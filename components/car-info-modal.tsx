"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Car, Calendar, Hash, Gauge, FileText, MapPin } from "lucide-react"
import type { CarType } from "@/app/page"

interface CarInfoModalProps {
  isOpen: boolean
  onClose: () => void
  car: CarType | null
}

export function CarInfoModal({ isOpen, onClose, car }: CarInfoModalProps) {
  if (!isOpen || !car) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "sold":
        return "bg-gray-100 text-gray-600 border-gray-200"
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Доступен"
      case "sold":
        return "Продан"
      case "pending":
        return "Ожидает"
      default:
        return "Неизвестно"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{car.name}</h2>
                <Badge className={`mt-1 text-xs ${getStatusColor(car.status)}`}>{getStatusText(car.status)}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Car Information */}
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="space-y-4">
            {/* Year and Plate Number - всегда в одной строке */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">Год выпуска</span>
                </div>
                <p className="text-lg font-bold text-slate-800">{car.year || "Не указан"}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">Номерной знак</span>
                </div>
                <p className="text-lg font-bold text-slate-800 font-mono">{car.plateNumber || "Не указан"}</p>
              </div>
            </div>

            {/* Mileage and Purchase Date - всегда в одной строке */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">Пробег</span>
                </div>
                <p className="text-lg font-bold text-slate-800">
                  {car.mileage ? `${car.mileage.toLocaleString()} км` : "Не указан"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">Дата покупки</span>
                </div>
                <p className="text-lg font-bold text-slate-800">
                  {car.purchaseDate
                    ? new Date(car.purchaseDate).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Не указана"}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Финансовая информация</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Общие расходы</p>
                <p className="text-lg font-bold text-red-600">€{car.totalExpenses.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Количество расходов</p>
                <p className="text-lg font-bold text-slate-700">{car.expenses?.length || 0}</p>
              </div>
            </div>

            {car.saleInfo && (
              <div className="mt-3 pt-3 border-t border-white/50">
                <p className="text-xs text-slate-500 mb-1">Цена продажи</p>
                <p className="text-lg font-bold text-green-600">€{car.saleInfo.salePrice.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {car.notes && car.notes.trim() && (
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">Заметки</span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{car.notes}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-6 pt-0">
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  )
}
