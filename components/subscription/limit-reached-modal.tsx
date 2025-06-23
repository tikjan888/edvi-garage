"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Crown, Zap, Building2, Car, Users, X } from "lucide-react"

interface LimitReachedModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
  limitType?: "garages" | "cars" | "partners"
}

export function LimitReachedModal({ isOpen, onClose, onUpgrade, limitType = "cars" }: LimitReachedModalProps) {
  if (!isOpen) return null

  const getLimitInfo = (type: string) => {
    switch (type) {
      case "garages":
        return {
          icon: <Building2 className="h-8 w-8" />,
          title: "Лимит гаражей достигнут",
          description: "Вы достигли максимального количества гаражей для вашего плана",
          freeLimits: "1 гараж",
          starterLimits: "До 3 гаражей",
          proLimits: "Неограниченные гаражи",
        }
      case "partners":
        return {
          icon: <Users className="h-8 w-8" />,
          title: "Лимит партнёров достигнут",
          description: "Вы достигли максимального количества партнёров для вашего плана",
          freeLimits: "1 партнёр",
          starterLimits: "До 5 партнёров на гараж",
          proLimits: "Неограниченные партнёры",
        }
      default:
        return {
          icon: <Car className="h-8 w-8" />,
          title: "Лимит автомобилей достигнут",
          description: "Вы достигли максимального количества автомобилей для вашего плана",
          freeLimits: "До 3 автомобилей",
          starterLimits: "До 20 автомобилей",
          proLimits: "Неограниченные автомобили",
        }
    }
  }

  const limitInfo = getLimitInfo(limitType)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-white">{limitInfo.icon}</div>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{limitInfo.title}</h2>
              <p className="text-slate-600 text-sm">{limitInfo.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {/* Free Plan */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Free</div>
                  <div className="text-xs text-slate-500">{limitInfo.freeLimits}</div>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-700 text-xs">Текущий план</Badge>
            </div>

            {/* Starter Plan */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Starter</div>
                  <div className="text-xs text-slate-500">{limitInfo.starterLimits}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">€9/мес</div>
                <div className="text-xs text-slate-500">или €90/год</div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Pro</div>
                  <div className="text-xs text-slate-500">{limitInfo.proLimits}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">€19/мес</div>
                <div className="text-xs text-slate-500">или €190/год</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
            >
              Обновить план
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full py-3 rounded-xl">
              Позже
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-3xl text-center">
          <p className="text-xs text-slate-500">🔒 14-дневный пробный период Pro плана • Отмените в любое время</p>
        </div>
      </div>
    </div>
  )
}
