"use client"

import { useState, useEffect } from "react"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import CarListScreen from "@/components/car-list-screen"
import { ExpenseDetailScreen } from "@/components/expense-detail-screen"
import { SaleResultModal } from "@/components/sale-result-modal"
import { SettingsModal } from "@/components/settings-modal"
import { AddCarModal } from "@/components/add-car-modal"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { NamesProvider } from "@/contexts/names-context"
import { EditCarModal } from "@/components/edit-car-modal"
import { CarInfoModal } from "@/components/car-info-modal"
import { useAuth } from "@/contexts/auth-context"
import { GarageProvider, useGarage } from "@/contexts/garage-context"
import {
  addCar as addCarToFirestore,
  updateCar as updateCarInFirestore,
  deleteCar as deleteCarFromFirestore,
  subscribeToCars,
  addExpense as addExpenseToFirestore,
  updateExpense as updateExpenseInFirestore,
  deleteExpense as deleteExpenseFromFirestore,
  subscribeToExpenses,
} from "@/lib/firestore"
import { AdminProvider } from "@/contexts/admin-context"

export interface CarType {
  id: string
  name: string
  totalExpenses: number
  expenses: Expense[]
  image?: string
  year?: string
  plateNumber?: string
  mileage?: number
  notes?: string
  purchaseDate?: string
  status: "available" | "sold" | "pending"
  saleInfo?: SaleResult
  garageId?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  category: string
  paidBy: "you" | "partner"
}

export interface SaleResult {
  salePrice: number
  totalExpenses: number
  totalProfit: number
  yourExpenses: number
  partnerExpenses: number
  yourProfit: number
  partnerProfit: number
  youReceive: number
  partnerReceives: number
}

function CarFinanceAppContent() {
  const { user } = useAuth()
  const { currentGarage } = useGarage()
  const { addGarage } = useGarage()
  const [currentScreen, setCurrentScreen] = useState<"list" | "detail">("list")
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAddCarModal, setShowAddCarModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [saleResult, setSaleResult] = useState<SaleResult | null>(null)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showEditCarModal, setShowEditCarModal] = useState(false)
  const [editingCar, setEditingCar] = useState<CarType | null>(null)
  const [showCarInfoModal, setShowCarInfoModal] = useState(false)
  const [carForInfo, setCarForInfo] = useState<CarType | null>(null)

  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to cars from Firestore
  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToCars(user.uid, (firestoreCars) => {
      // Для каждого автомобиля подписываемся на его расходы
      const carsWithExpenses = firestoreCars.map((car) => ({
        ...car,
        expenses: [],
        totalExpenses: 0,
      }))

      setCars(carsWithExpenses)
      setLoading(false)

      // Подписываемся на расходы для каждого автомобиля
      firestoreCars.forEach((car) => {
        subscribeToExpenses(user.uid, car.id, (expenses) => {
          const totalExpenses = expenses
            .filter((exp) => exp.type === "expense")
            .reduce((sum, exp) => sum + exp.amount, 0)

          setCars((prevCars) =>
            prevCars.map((prevCar) =>
              prevCar.id === car.id
                ? {
                    ...prevCar,
                    expenses,
                    totalExpenses,
                  }
                : prevCar,
            ),
          )

          // Обновляем выбранный автомобиль если он совпадает
          setSelectedCar((prevSelected) =>
            prevSelected && prevSelected.id === car.id
              ? {
                  ...prevSelected,
                  expenses,
                  totalExpenses,
                }
              : prevSelected,
          )
        })
      })
    })

    return unsubscribe
  }, [user])

  useEffect(() => {
    if (!user) return

    const fetchGarage = async () => {
      const garage = await fetchGarageDataFromFirestore(user.uid)
      // setCurrentGarage(garage) // Removed redundant state update
    }

    fetchGarage()
  }, [user])

  const handleCarSelect = (car: CarType) => {
    setSelectedCar(car)
    setCurrentScreen("detail")
  }

  const handleBackToList = () => {
    setCurrentScreen("list")
    setSelectedCar(null)
  }

  const handleStatusChange = async (carId: string, newStatus: "available" | "pending") => {
    if (!user) return

    console.log("Attempting to change status:", {
      carId,
      newStatus,
      currentStatus: cars.find((c) => c.id === carId)?.status,
    })

    try {
      await updateCarInFirestore(user.uid, carId, { status: newStatus })

      // Обновляем локальное состояние немедленно для лучшего UX
      setCars((prevCars) => prevCars.map((car) => (car.id === carId ? { ...car, status: newStatus } : car)))

      // Обновляем выбранный автомобиль если это он
      setSelectedCar((prevSelected) =>
        prevSelected && prevSelected.id === carId ? { ...prevSelected, status: newStatus } : prevSelected,
      )

      console.log("Status changed successfully to:", newStatus)
    } catch (error) {
      console.error("Error updating car status:", error)
    }
  }

  const handleSellCar = async (salePrice: number) => {
    if (!selectedCar || !user) return

    // Calculate expenses for each partner
    const yourExpenses = selectedCar.expenses
      .filter((exp) => exp.type === "expense" && exp.paidBy === "you")
      .reduce((sum, exp) => sum + exp.amount, 0)

    const partnerExpenses = selectedCar.expenses
      .filter((exp) => exp.type === "expense" && exp.paidBy === "partner")
      .reduce((sum, exp) => sum + exp.amount, 0)

    const totalExpenses = yourExpenses + partnerExpenses
    const totalProfit = salePrice - totalExpenses

    let result: SaleResult

    // Check if current garage has partner
    if (currentGarage?.hasPartner) {
      // With partner - use split ratio from garage settings
      const yourSplitRatio = currentGarage.partnerInfo?.splitRatio || 50
      const partnerSplitRatio = 100 - yourSplitRatio

      const yourProfit = (totalProfit * yourSplitRatio) / 100
      const partnerProfit = (totalProfit * partnerSplitRatio) / 100
      const youReceive = yourExpenses + yourProfit
      const partnerReceives = partnerExpenses + partnerProfit

      result = {
        salePrice,
        totalExpenses,
        totalProfit,
        yourExpenses,
        partnerExpenses,
        yourProfit,
        partnerProfit,
        youReceive,
        partnerReceives,
      }
    } else {
      // Without partner - all profit goes to you
      result = {
        salePrice,
        totalExpenses,
        totalProfit,
        yourExpenses: totalExpenses, // All expenses are yours
        partnerExpenses: 0,
        yourProfit: totalProfit, // All profit is yours
        partnerProfit: 0,
        youReceive: salePrice, // You receive the full sale price
        partnerReceives: 0,
      }
    }

    try {
      await updateCarInFirestore(user.uid, selectedCar.id, {
        status: "sold",
        saleInfo: result,
      })

      setSaleResult(result)
      setShowSaleModal(true)
    } catch (error) {
      console.error("Error selling car:", error)
    }
  }

  const handleCloseSaleModal = () => {
    setShowSaleModal(false)
    setSaleResult(null)
  }

  const handleAddCar = async (carData: Omit<CarType, "id" | "totalExpenses" | "expenses">) => {
    if (!user) return

    try {
      await addCarToFirestore(user.uid, {
        ...carData,
        totalExpenses: 0,
        expenses: [],
      })
      setShowAddCarModal(false)
    } catch (error) {
      console.error("Error adding car:", error)
    }
  }

  const handleAddExpense = async (expenseData: Omit<Expense, "id">) => {
    if (!selectedCar || !user) return

    try {
      await addExpenseToFirestore(user.uid, selectedCar.id, expenseData)
      setShowAddExpenseModal(false)
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  const handleEditExpense = async (expense: Expense) => {
    if (!selectedCar || !user) return

    try {
      await updateExpenseInFirestore(user.uid, selectedCar.id, expense.id, expense)
    } catch (error) {
      console.error("Error updating expense:", error)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!selectedCar || !user) return

    try {
      await deleteExpenseFromFirestore(user.uid, selectedCar.id, expenseId)
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const handleEditCar = (car: CarType) => {
    setEditingCar(car)
    setShowEditCarModal(true)
  }

  const handleShowCarInfo = (car: CarType) => {
    setCarForInfo(car)
    setShowCarInfoModal(true)
  }

  const handleUpdateCar = async (updatedCar: CarType) => {
    if (!user) return

    try {
      await updateCarInFirestore(user.uid, updatedCar.id, updatedCar)
      setShowEditCarModal(false)
      setEditingCar(null)
    } catch (error) {
      console.error("Error updating car:", error)
    }
  }

  const handleDeleteCar = async (carId: string) => {
    if (!user) return

    try {
      await deleteCarFromFirestore(user.uid, carId)

      // If we're currently viewing this car, go back to list
      if (selectedCar && selectedCar.id === carId) {
        setCurrentScreen("list")
        setSelectedCar(null)
      }
    } catch (error) {
      console.error("Error deleting car:", error)
    }
  }

  const handleCancelSale = async (carId: string) => {
    if (!user) return

    console.log("Canceling sale for car:", carId)

    try {
      // Use undefined to trigger deleteField() in updateCar function
      await updateCarInFirestore(user.uid, carId, {
        status: "available",
        saleInfo: undefined,
      })

      console.log("Sale canceled successfully")
    } catch (error) {
      console.error("Error canceling sale:", error)
    }
  }

  const handleAddGarage = async (garageData: any) => {
    try {
      await addGarage(garageData)
    } catch (error) {
      console.error("Error adding garage:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {currentScreen === "list" && (
        <CarListScreen
          cars={cars}
          onCarSelect={handleCarSelect}
          onAddCar={() => setShowAddCarModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onEditCar={handleEditCar}
          onDeleteCar={handleDeleteCar}
          onCancelSale={handleCancelSale}
          onAddGarage={handleAddGarage}
          onShowCarInfo={handleShowCarInfo}
        />
      )}

      {currentScreen === "detail" && selectedCar && (
        <ExpenseDetailScreen
          car={selectedCar}
          onBack={handleBackToList}
          onSell={handleSellCar}
          onAddExpense={() => setShowAddExpenseModal(true)}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modals */}
      {showSaleModal && saleResult && <SaleResultModal saleResult={saleResult} onClose={handleCloseSaleModal} />}

      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      <AddCarModal isOpen={showAddCarModal} onClose={() => setShowAddCarModal(false)} onSubmit={handleAddCar} />

      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onSubmit={handleAddExpense}
      />

      <EditCarModal
        isOpen={showEditCarModal}
        onClose={() => {
          setShowEditCarModal(false)
          setEditingCar(null)
        }}
        onSubmit={handleUpdateCar}
        car={editingCar}
      />

      <CarInfoModal
        isOpen={showCarInfoModal}
        onClose={() => {
          setShowCarInfoModal(false)
          setCarForInfo(null)
        }}
        car={carForInfo}
      />
    </div>
  )
}

function AppWithProviders() {
  return (
    <AuthProvider>
      <AdminProvider>
        <SubscriptionProvider>
          <GarageProvider>
            <AuthGuard>
              <CarFinanceAppContent />
            </AuthGuard>
          </GarageProvider>
        </SubscriptionProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default function CarFinanceApp() {
  return (
    <LanguageProvider>
      <NamesProvider>
        <AppWithProviders />
      </NamesProvider>
    </LanguageProvider>
  )
}

export type Car = CarType

async function fetchGarageDataFromFirestore(userId: string) {
  // Placeholder for fetching garage data from Firestore
  return {}
}
