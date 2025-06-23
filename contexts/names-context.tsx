"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface NamesContextType {
  meName: string
  partnerName: string
  setMeName: (name: string) => void
  setPartnerName: (name: string) => void
}

const NamesContext = createContext<NamesContextType | undefined>(undefined)

export function NamesProvider({ children }: { children: React.ReactNode }) {
  const [meName, setMeNameState] = useState("Я")
  const [partnerName, setPartnerNameState] = useState("Партнер")

  useEffect(() => {
    const savedMeName = localStorage.getItem("car-finance-me-name")
    const savedPartnerName = localStorage.getItem("car-finance-partner-name")

    if (savedMeName) setMeNameState(savedMeName)
    if (savedPartnerName) setPartnerNameState(savedPartnerName)
  }, [])

  const setMeName = (name: string) => {
    setMeNameState(name)
    localStorage.setItem("car-finance-me-name", name)
  }

  const setPartnerName = (name: string) => {
    setPartnerNameState(name)
    localStorage.setItem("car-finance-partner-name", name)
  }

  return (
    <NamesContext.Provider value={{ meName, partnerName, setMeName, setPartnerName }}>{children}</NamesContext.Provider>
  )
}

export function useNames() {
  const context = useContext(NamesContext)
  if (context === undefined) {
    throw new Error("useNames must be used within a NamesProvider")
  }
  return context
}
