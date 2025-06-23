"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { USER_ROLES } from "@/types/user-roles"

/* ---------- Types ----------- */
type PlanType = "free" | "starter" | "pro"
export interface Limits {
  garages: number
  cars: number
  partners: number
}
export interface Usage {
  garagesCount: number
  carsCount: number
  partnersCount: number
}
interface Subscription {
  planType: PlanType
  limits: Limits
}

interface SubscriptionContextType {
  subscription: Subscription | null
  limits: Limits
  usage: Usage
  isLoading: boolean
}

/* ---------- Constants ----------- */
export const PLAN_LIMITS: Record<PlanType, Limits> = {
  free: { garages: 1, cars: 5, partners: 0 },
  starter: { garages: 3, cars: 20, partners: 5 },
  pro: { garages: 9999, cars: 9999, partners: 9999 }, // -1 means “unlimited”, but use large numbers for simplicity
}

/* ---------- Context ----------- */
const defaultLimits = PLAN_LIMITS.free
const defaultUsage: Usage = { garagesCount: 0, carsCount: 0, partnersCount: 0 }

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  limits: defaultLimits,
  usage: defaultUsage,
  isLoading: true,
})

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { userRole } = useAuth() // <-- must be supplied by auth-context
  const [usage, setUsage] = useState<Usage>(defaultUsage)
  const [isLoading, setIsLoading] = useState(true)

  /* Derive subscription from userRole (or fallback to free) */
  const subscription = useMemo<Subscription | null>(() => {
    if (!userRole) return null
    const roleInfo = USER_ROLES[userRole] // { subscriptionType: 'free' | 'starter' | 'pro' }
    return {
      planType: roleInfo.subscriptionType as PlanType,
      limits: PLAN_LIMITS[roleInfo.subscriptionType as PlanType],
    }
  }, [userRole])

  const limits = subscription ? subscription.limits : defaultLimits

  /* Simulate async load */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <SubscriptionContext.Provider value={{ subscription, limits, usage, isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}
