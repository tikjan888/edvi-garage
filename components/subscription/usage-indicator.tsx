"use client"

import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star, TrendingUp } from "lucide-react"

interface UsageIndicatorProps {
  onUpgrade: () => void
}

export function UsageIndicator({ onUpgrade }: UsageIndicatorProps) {
  const { subscription, usage, limits } = useSubscription()

  if (!subscription) return null

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "pro":
        return <Crown className="h-4 w-4" />
      case "starter":
        return <Zap className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "from-emerald-500 to-green-600"
      case "starter":
        return "from-blue-500 to-purple-600"
      default:
        return "from-slate-500 to-gray-600"
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

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const isNearLimit = (current: number, limit: number) => {
    if (limit === -1) return false
    return current / limit >= 0.8
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getPlanColor(subscription.planType)} flex items-center justify-center`}
          >
            <div className="text-white">{getPlanIcon(subscription.planType)}</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800">План {getPlanName(subscription.planType)}</h3>
              {subscription.status === "trial" && (
                <Badge className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5">Пробный период</Badge>
              )}
            </div>
            {subscription.status === "trial" && subscription.trialEndDate && (
              <p className="text-xs text-slate-500">До {new Date(subscription.trialEndDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {subscription.planType === "free" && (
          <Button
            onClick={onUpgrade}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Обновить
          </Button>
        )}
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Garages */}
        <div className="text-center">
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-800">
              {usage.garagesCount}
              {limits.garages === -1 ? "" : `/${limits.garages}`}
            </div>
            <div className="text-xs text-slate-500">Гаражи</div>
          </div>
          {limits.garages !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getUsageColor(getUsagePercentage(usage.garagesCount, limits.garages))}`}
                style={{ width: `${getUsagePercentage(usage.garagesCount, limits.garages)}%` }}
              />
            </div>
          )}
          {isNearLimit(usage.garagesCount, limits.garages) && (
            <div className="text-xs text-amber-600 mt-1">Близко к лимиту</div>
          )}
        </div>

        {/* Cars */}
        <div className="text-center">
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-800">
              {usage.carsCount}
              {limits.cars === -1 ? "" : `/${limits.cars}`}
            </div>
            <div className="text-xs text-slate-500">Автомобили</div>
          </div>
          {limits.cars !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getUsageColor(getUsagePercentage(usage.carsCount, limits.cars))}`}
                style={{ width: `${getUsagePercentage(usage.carsCount, limits.cars)}%` }}
              />
            </div>
          )}
          {isNearLimit(usage.carsCount, limits.cars) && (
            <div className="text-xs text-amber-600 mt-1">Близко к лимиту</div>
          )}
        </div>

        {/* Partners */}
        <div className="text-center">
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-800">
              {usage.partnersCount}
              {limits.partnersPerGarage === -1 ? "" : `/${limits.partnersPerGarage}`}
            </div>
            <div className="text-xs text-slate-500">Партнёры</div>
          </div>
          {limits.partnersPerGarage !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getUsageColor(getUsagePercentage(usage.partnersCount, limits.partnersPerGarage))}`}
                style={{ width: `${getUsagePercentage(usage.partnersCount, limits.partnersPerGarage)}%` }}
              />
            </div>
          )}
          {isNearLimit(usage.partnersCount, limits.partnersPerGarage) && (
            <div className="text-xs text-amber-600 mt-1">Близко к лимиту</div>
          )}
        </div>
      </div>
    </div>
  )
}
