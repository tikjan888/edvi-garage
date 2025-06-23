import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { CarType, Expense } from "@/app/page"
import type { Garage, GarageInvitation } from "@/types/garage"

// Local storage keys for demo mode
const DEMO_CARS_KEY = "demo-cars"
const DEMO_EXPENSES_KEY = "demo-expenses"
const DEMO_GARAGES_KEY = "demo-garages"
const DEMO_INVITATIONS_KEY = "demo-invitations"

// Demo data storage
const demoData: {
  cars: CarType[]
  expenses: Record<string, Expense[]>
  garages: Garage[]
  invitations: GarageInvitation[]
} = {
  cars: [],
  expenses: {},
  garages: [],
  invitations: [],
}

// Initialize demo data from localStorage
if (typeof window !== "undefined") {
  const savedCars = localStorage.getItem(DEMO_CARS_KEY)
  const savedExpenses = localStorage.getItem(DEMO_EXPENSES_KEY)
  const savedGarages = localStorage.getItem(DEMO_GARAGES_KEY)
  const savedInvitations = localStorage.getItem(DEMO_INVITATIONS_KEY)

  if (savedCars) {
    demoData.cars = JSON.parse(savedCars)
  }
  if (savedExpenses) {
    demoData.expenses = JSON.parse(savedExpenses)
  }
  if (savedGarages) {
    demoData.garages = JSON.parse(savedGarages)
  }
  if (savedInvitations) {
    demoData.invitations = JSON.parse(savedInvitations)
  }
}

// Save demo data to localStorage
function saveDemoData() {
  if (typeof window !== "undefined") {
    localStorage.setItem(DEMO_CARS_KEY, JSON.stringify(demoData.cars))
    localStorage.setItem(DEMO_EXPENSES_KEY, JSON.stringify(demoData.expenses))
    localStorage.setItem(DEMO_GARAGES_KEY, JSON.stringify(demoData.garages))
    localStorage.setItem(DEMO_INVITATIONS_KEY, JSON.stringify(demoData.invitations))
  }
}

// Helper function to clean undefined values from objects
function cleanUndefinedValues(obj: any): any {
  const cleaned: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value
    }
  }
  return cleaned
}

// Cars collection functions
export const carsCollection = (userId: string) => {
  if (!isFirebaseConfigured || !db) return null
  return collection(db, "users", userId, "cars")
}

export const expensesCollection = (userId: string, carId: string) => {
  if (!isFirebaseConfigured || !db) return null
  return collection(db, "users", userId, "cars", carId, "expenses")
}

// Car CRUD operations
export async function addCar(userId: string, car: Omit<CarType, "id">) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - use local storage
    const newCar: CarType = {
      ...car,
      id: Date.now().toString(),
    }
    demoData.cars.push(newCar)
    demoData.expenses[newCar.id] = []
    saveDemoData()
    return newCar.id
  }

  try {
    // Clean the car data to remove undefined values
    const cleanCarData = cleanUndefinedValues({
      ...car,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    const docRef = await addDoc(carsCollection(userId)!, cleanCarData)
    return docRef.id
  } catch (error) {
    console.error("Error adding car:", error)
    throw error
  }
}

export async function updateCar(userId: string, carId: string, updates: Partial<CarType>) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - update local data
    console.log("Demo mode: updating car", carId, "with", updates)
    const carIndex = demoData.cars.findIndex((car) => car.id === carId)
    if (carIndex !== -1) {
      // Handle undefined values in demo mode
      const cleanUpdates = { ...updates }
      if (cleanUpdates.saleInfo === undefined) {
        delete cleanUpdates.saleInfo
        // Remove saleInfo from existing car
        const { saleInfo, ...carWithoutSaleInfo } = demoData.cars[carIndex]
        demoData.cars[carIndex] = { ...carWithoutSaleInfo, ...cleanUpdates }
      } else {
        demoData.cars[carIndex] = { ...demoData.cars[carIndex], ...cleanUpdates }
      }
      saveDemoData()
      console.log("Demo mode: car updated successfully", demoData.cars[carIndex])
    } else {
      console.log("Demo mode: car not found", carId)
    }
    return
  }

  try {
    const carRef = doc(carsCollection(userId)!, carId)

    // Prepare update data, handling undefined values
    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    // Only add fields that are not undefined
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof CarType]
      if (value !== undefined) {
        if (key === "saleInfo" && value === undefined) {
          updateData[key] = deleteField()
        } else {
          updateData[key] = value
        }
      }
    })

    // Special handling for saleInfo deletion
    if (updates.saleInfo === undefined && Object.prototype.hasOwnProperty.call(updates, "saleInfo")) {
      updateData.saleInfo = deleteField()
    }

    await updateDoc(carRef, updateData)
    console.log("Firestore: car updated successfully")
  } catch (error) {
    console.error("Error updating car:", error)
    throw error
  }
}

export async function deleteCar(userId: string, carId: string) {
  console.log("🗑️ Начинаем удаление автомобиля:", carId)

  if (!isFirebaseConfigured || !db) {
    // Demo mode - remove from local data
    console.log("🗑️ Demo режим: удаляем из localStorage")
    demoData.cars = demoData.cars.filter((car) => car.id !== carId)
    delete demoData.expenses[carId]
    saveDemoData()
    console.log("✅ Автомобиль удален из demo данных")
    return
  }

  try {
    console.log("🗑️ Firebase режим: удаляем из Firestore")
    const carRef = doc(carsCollection(userId)!, carId)
    await deleteDoc(carRef)
    console.log("✅ Автомобиль удален из Firestore")
  } catch (error) {
    console.error("❌ Ошибка удаления автомобиля:", error)
    throw error
  }
}

export function subscribeToCars(userId: string, callback: (cars: CarType[]) => void) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - return cars from local storage
    callback(demoData.cars)
    return () => {} // Return empty unsubscribe function
  }

  const q = query(carsCollection(userId)!, orderBy("createdAt", "desc"))

  return onSnapshot(q, (snapshot) => {
    const cars: CarType[] = []
    snapshot.forEach((doc) => {
      cars.push({
        id: doc.id,
        ...doc.data(),
      } as CarType)
    })
    callback(cars)
  })
}

// Expense CRUD operations
export async function addExpense(userId: string, carId: string, expense: Omit<Expense, "id">) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - add to local data
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    if (!demoData.expenses[carId]) {
      demoData.expenses[carId] = []
    }
    demoData.expenses[carId].push(newExpense)
    saveDemoData()
    return newExpense.id
  }

  try {
    // Clean the expense data to remove undefined values
    const cleanExpenseData = cleanUndefinedValues({
      ...expense,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    const docRef = await addDoc(expensesCollection(userId, carId)!, cleanExpenseData)
    return docRef.id
  } catch (error) {
    console.error("Error adding expense:", error)
    throw error
  }
}

export async function updateExpense(userId: string, carId: string, expenseId: string, updates: Partial<Expense>) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - update local data
    if (demoData.expenses[carId]) {
      const expenseIndex = demoData.expenses[carId].findIndex((exp) => exp.id === expenseId)
      if (expenseIndex !== -1) {
        demoData.expenses[carId][expenseIndex] = { ...demoData.expenses[carId][expenseIndex], ...updates }
        saveDemoData()
      }
    }
    return
  }

  try {
    const expenseRef = doc(expensesCollection(userId, carId)!, expenseId)

    // Clean the updates to remove undefined values
    const cleanUpdates = cleanUndefinedValues({
      ...updates,
      updatedAt: Timestamp.now(),
    })

    await updateDoc(expenseRef, cleanUpdates)
  } catch (error) {
    console.error("Error updating expense:", error)
    throw error
  }
}

export async function deleteExpense(userId: string, carId: string, expenseId: string) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - remove from local data
    if (demoData.expenses[carId]) {
      demoData.expenses[carId] = demoData.expenses[carId].filter((exp) => exp.id !== expenseId)
      saveDemoData()
    }
    return
  }

  try {
    const expenseRef = doc(expensesCollection(userId, carId)!, expenseId)
    await deleteDoc(expenseRef)
  } catch (error) {
    console.error("Error deleting expense:", error)
    throw error
  }
}

export function subscribeToExpenses(userId: string, carId: string, callback: (expenses: Expense[]) => void) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - return expenses from local storage
    const expenses = demoData.expenses[carId] || []
    callback(expenses)
    return () => {} // Return empty unsubscribe function
  }

  const q = query(expensesCollection(userId, carId)!, orderBy("date", "desc"))

  return onSnapshot(q, (snapshot) => {
    const expenses: Expense[] = []
    snapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
      } as Expense)
    })
    callback(expenses)
  })
}

// Add garage collection function
export const garagesCollection = (userId: string) => {
  if (!isFirebaseConfigured || !db) return null
  return collection(db, "users", userId, "garages")
}

// Garage CRUD operations
export async function addGarage(userId: string, garage: Omit<Garage, "id" | "createdAt" | "updatedAt">) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - use local storage
    const newGarage: Garage = {
      ...garage,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    demoData.garages.push(newGarage)
    saveDemoData()
    return newGarage.id
  }

  try {
    // Clean up the garage data to remove undefined values
    const cleanGarageData = cleanUndefinedValues({
      name: garage.name,
      ownerId: garage.ownerId,
      ownerName: garage.ownerName,
      ownerEmail: garage.ownerEmail,
      members: garage.members || [],
      hasPartner: garage.hasPartner,
      description: garage.description,
      partnerInfo: garage.hasPartner && garage.partnerInfo ? cleanUndefinedValues(garage.partnerInfo) : undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    const docRef = await addDoc(garagesCollection(userId)!, cleanGarageData)
    return docRef.id
  } catch (error) {
    console.error("Error adding garage:", error)
    throw error
  }
}

export async function updateGarage(userId: string, garageId: string, updates: Partial<Garage>) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - update local data
    const garageIndex = demoData.garages.findIndex((garage) => garage.id === garageId)
    if (garageIndex !== -1) {
      // Create updated garage object
      const updatedGarage = {
        ...demoData.garages[garageIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // If hasPartner is false, remove partnerInfo
      if (updates.hasPartner === false) {
        delete updatedGarage.partnerInfo
      }

      demoData.garages[garageIndex] = updatedGarage
      saveDemoData()
      console.log("Demo mode: garage updated successfully", updatedGarage)
    }
    return
  }

  try {
    const garageRef = doc(garagesCollection(userId)!, garageId)

    // Prepare clean update data
    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    // Add non-undefined fields
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.hasPartner !== undefined) updateData.hasPartner = updates.hasPartner
    if (updates.members !== undefined) updateData.members = updates.members

    // Handle partnerInfo
    if (updates.hasPartner === false) {
      updateData.partnerInfo = deleteField()
    } else if (updates.partnerInfo) {
      // Clean partnerInfo object
      updateData.partnerInfo = cleanUndefinedValues(updates.partnerInfo)
    }

    await updateDoc(garageRef, updateData)
    console.log("Firestore: garage updated successfully")
  } catch (error) {
    console.error("Error updating garage:", error)
    throw error
  }
}

export async function deleteGarage(userId: string, garageId: string) {
  console.log("🗑️ Начинаем удаление гаража:", garageId)

  // Check if there are cars in this garage
  const garageCars = demoData.cars.filter((car) => car.garageId === garageId)
  if (garageCars.length > 0) {
    console.log("❌ Нельзя удалить гараж с автомобилями")
    throw new Error("Cannot delete garage with cars")
  }

  if (!isFirebaseConfigured || !db) {
    // Demo mode - remove from local data
    console.log("🗑️ Demo режим: удаляем из localStorage")
    demoData.garages = demoData.garages.filter((garage) => garage.id !== garageId)
    saveDemoData()
    console.log("✅ Гараж удален из demo данных")
    return
  }

  try {
    console.log("🗑️ Firebase режим: проверяем автомобили в гараже")
    // Check if there are cars in this garage in Firestore
    const carsRef = collection(db, "users", userId, "cars")
    const q = query(carsRef, where("garageId", "==", garageId))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      console.log("❌ Нельзя удалить гараж с автомобилями в Firestore")
      throw new Error("Cannot delete garage with cars")
    }

    console.log("🗑️ Удаляем гараж из Firestore")
    const garageRef = doc(garagesCollection(userId)!, garageId)
    await deleteDoc(garageRef)
    console.log("✅ Гараж удален из Firestore")
  } catch (error) {
    console.error("❌ Ошибка удаления гаража:", error)
    throw error
  }
}

export function subscribeToGarages(userId: string, callback: (garages: Garage[]) => void) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - return garages from local storage
    callback(demoData.garages)
    return () => {} // Return empty unsubscribe function
  }

  const q = query(garagesCollection(userId)!, orderBy("createdAt", "desc"))

  return onSnapshot(q, (snapshot) => {
    const garages: Garage[] = []
    snapshot.forEach((doc) => {
      garages.push({
        id: doc.id,
        ...doc.data(),
      } as Garage)
    })
    callback(garages)
  })
}

// Invitation functions
export async function addInvitation(invitation: Omit<GarageInvitation, "id">) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode
    const newInvitation: GarageInvitation = {
      ...invitation,
      id: Date.now().toString(),
    }
    demoData.invitations.push(newInvitation)
    saveDemoData()
    return newInvitation.id
  }

  try {
    // Clean the invitation data to remove undefined values
    const cleanInvitationData = cleanUndefinedValues(invitation)
    const docRef = await addDoc(collection(db, "garage-invitations"), cleanInvitationData)
    return docRef.id
  } catch (error) {
    console.error("Error adding invitation:", error)
    throw error
  }
}

export function subscribeToInvitations(garageId: string, callback: (invitations: GarageInvitation[]) => void) {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - return empty array since we don't have real invitations in demo
    callback([])
    return () => {}
  }

  try {
    const q = query(
      collection(db, "garage-invitations"),
      where("garageId", "==", garageId),
      where("status", "==", "pending"),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const invitations: GarageInvitation[] = []
        snapshot.forEach((doc) => {
          invitations.push({
            id: doc.id,
            ...doc.data(),
          } as GarageInvitation)
        })
        callback(invitations)
      },
      (error) => {
        console.error("Error listening to invitations:", error)
        // В случае ошибки возвращаем пустой массив
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up invitations listener:", error)
    callback([])
    return () => {}
  }
}
