"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Garage } from "@/types/garage"
import { useAuth } from "./auth-context"
import {
  subscribeToGarages,
  addGarage as addGarageToFirestore,
  updateGarage as updateGarageInFirestore,
  deleteGarage as deleteGarageFromFirestore,
} from "@/lib/firestore"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useSubscription } from "./subscription-context"

interface GarageContextType {
  garages: Garage[]
  currentGarage: Garage | null
  setCurrentGarage: (garage: Garage | null) => void
  addGarage: (garage: Omit<Garage, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateGarage: (garageId: string, updates: Partial<Garage>) => Promise<void>
  deleteGarage: (garageId: string) => Promise<void>
  refreshCurrentGarage: () => Promise<void>
  loading: boolean
}

const GarageContext = createContext<GarageContextType | undefined>(undefined)

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { incrementUsage, decrementUsage } = useSubscription()
  const [garages, setGarages] = useState<Garage[]>([])
  const [currentGarage, setCurrentGarageState] = useState<Garage | null>(null)
  const [loading, setLoading] = useState(true)

  // Subscribe to garages
  useEffect(() => {
    if (!user) {
      setGarages([])
      setCurrentGarageState(null)
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToGarages(user.uid, (fetchedGarages) => {
      console.log("Fetched garages:", fetchedGarages)
      setGarages(fetchedGarages)

      // Restore last selected garage or select first one
      if (fetchedGarages.length > 0) {
        const savedGarageId = localStorage.getItem(`current-garage-id-${user.uid}`)
        console.log("Saved garage ID:", savedGarageId)

        let garageToSelect: Garage | null = null

        if (savedGarageId) {
          // Try to find the saved garage
          garageToSelect = fetchedGarages.find((g) => g.id === savedGarageId) || null
          console.log("Found saved garage:", garageToSelect?.name)
        }

        // If no saved garage found or no saved ID, select the first one
        if (!garageToSelect) {
          garageToSelect = fetchedGarages[0]
          console.log("Selecting first garage:", garageToSelect.name)
        }

        // Only set if different from current
        if (!currentGarage || currentGarage.id !== garageToSelect.id) {
          setCurrentGarageState(garageToSelect)
        }
      } else {
        setCurrentGarageState(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const setCurrentGarage = (garage: Garage | null) => {
    console.log("Setting current garage:", garage?.name || "null")
    setCurrentGarageState(garage)

    if (garage && user) {
      // Save the selected garage for this user
      localStorage.setItem(`current-garage-id-${user.uid}`, garage.id)
      console.log("Saved garage ID to localStorage:", garage.id)
    } else if (user) {
      localStorage.removeItem(`current-garage-id-${user.uid}`)
      console.log("Removed garage ID from localStorage")
    }
  }

  const addGarage = async (garageData: Omit<Garage, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return

    console.log("🏗️ GarageContext: Добавляем гараж", garageData.name)

    try {
      await addGarageToFirestore(user.uid, garageData)
      console.log("✅ GarageContext: Гараж добавлен в Firestore")
    } catch (error) {
      console.error("❌ GarageContext: Ошибка добавления гаража:", error)
      throw error
    }
  }

  const updateGarage = async (garageId: string, updates: Partial<Garage>) => {
    if (!user) return
    await updateGarageInFirestore(user.uid, garageId, updates)
  }

  const deleteGarage = async (garageId: string) => {
    if (!user) return
    await deleteGarageFromFirestore(user.uid, garageId)
  }

  const refreshCurrentGarage = async () => {
    if (!currentGarage || !user) return

    try {
      const garageDoc = await getDoc(doc(db, "garages", currentGarage.id))
      if (garageDoc.exists()) {
        const updatedGarage = { id: garageDoc.id, ...garageDoc.data() } as Garage
        setCurrentGarageState(updatedGarage)
      }
    } catch (error) {
      console.error("Error refreshing garage:", error)
    }
  }

  return (
    <GarageContext.Provider
      value={{
        garages,
        currentGarage,
        setCurrentGarage,
        addGarage,
        updateGarage,
        deleteGarage,
        refreshCurrentGarage,
        loading,
      }}
    >
      {children}
    </GarageContext.Provider>
  )
}

export function useGarage() {
  const context = useContext(GarageContext)
  if (context === undefined) {
    throw new Error("useGarage must be used within a GarageProvider")
  }
  return context
}
