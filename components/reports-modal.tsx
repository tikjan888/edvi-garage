"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, TrendingUp, DollarSign, Car } from "lucide-react"

interface ReportsModalProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    totalCars: number
    totalRevenue: number
    monthlyProfit: number
    pendingDeals: number
  }
}

export function ReportsModal({ isOpen, onClose, stats }: ReportsModalProps) {
  if (!isOpen) return null

  const avgProfitPerCar = stats.totalCars > 0 ? stats.monthlyProfit / stats.totalCars : 0
  const profitMargin = stats.totalRevenue > 0 ? (stats.monthlyProfit / stats.totalRevenue) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Финансовые отчеты</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Общая прибыль</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">${stats.monthlyProfit.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Общая выручка</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Прибыль на авто</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">${avgProfitPerCar.toFixed(0)}</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Маржа прибыли</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600">{profitMargin.toFixed(1)}%</p>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Сводка</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Всего автомобилей в наличии:</span>
                <span className="font-medium">{stats.totalCars}</span>
              </div>
              <div className="flex justify-between">
                <span>Ожидающие сделки:</span>
                <span className="font-medium">{stats.pendingDeals}</span>
              </div>
              <div className="flex justify-between">
                <span>Средняя прибыль на автомобиль:</span>
                <span className="font-medium">${avgProfitPerCar.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Процент маржи:</span>
                <span className="font-medium">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Экспорт в PDF
            </Button>
            <Button variant="outline" className="flex-1">
              Экспорт в Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
