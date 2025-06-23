"use client"

import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { PricingModal } from "./pricing-modal"

export function SubscriptionBadge() {
  const { subscription, limits, usage, isLoading } = useSubscription()
  const [showPricingModal, setShowPricingModal] = useState(false)

  const safeLimits = limits ?? { garages: -1, cars: -1, partners: -1 }
  const safeUsage = usage ?? { garagesCount: 0, carsCount: 0, partnersCount: 0 }

  if (isLoading || !subscription) return null

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "pro":
        return <Crown className="h-3 w-3" />
      case "starter":
        return <Zap className="h-3 w-3" />
      default:
        return <Star className="h-3 w-3" />
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "pro":
        return "Pro"
      case "starter":
        return "Starter"
      default:
        return "Free"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "starter":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const isNearLimit = () => {
    if (safeLimits.garages !== -1 && safeUsage.garagesCount >= safeLimits.garages * 0.8) return true
    if (safeLimits.cars !== -1 && safeUsage.carsCount >= safeLimits.cars * 0.8) return true
    if (safeLimits.partners !== -1 && safeUsage.partnersCount >= safeLimits.partners * 0.8) return true
    return false
  }

  const isAtLimit = () => {
    if (safeLimits.garages !== -1 && safeUsage.garagesCount >= safeLimits.garages) return true
    if (safeLimits.cars !== -1 && safeUsage.carsCount >= safeLimits.cars) return true
    if (safeLimits.partners !== -1 && safeUsage.partnersCount >= safeLimits.partners) return true
    return false
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPricingModal(true)}
        className={`p-2 rounded-xl relative ${
          isAtLimit()
            ? "hover:bg-red-100 text-red-600"
            : isNearLimit()
              ? "hover:bg-amber-100 text-amber-600"
              : "hover:bg-white/50"
        }`}
        title={`План ${getPlanName(subscription.planType)} - нажмите для управления`}
      >
        <div className="flex items-center gap-2">
          {getPlanIcon(subscription.planType)}
          <Badge className={`text-xs px-2 py-0.5 ${getPlanColor(subscription.planType)}`}>
            {getPlanName(subscription.planType)}
          </Badge>
        </div>

        {/* Индикатор предупреждения */}
        {(isAtLimit() || isNearLimit()) && (
          <div className="absolute -top-1 -right-1">
            <div className={`w-3 h-3 rounded-full ${isAtLimit() ? "bg-red-500" : "bg-amber-500"}`}>
              <AlertTriangle className="h-2 w-2 text-white m-0.5" />
            </div>
          </div>
        )}
      </Button>

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </>
  )
}
