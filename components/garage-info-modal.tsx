"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Building2, Users, Calendar, FileText, Car, TrendingUp, User } from "lucide-react"
import type { Garage } from "@/types/garage"
import type { CarType } from "@/app/page"

interface GarageInfoModalProps {
  isOpen: boolean
  onClose: () => void
  garage: Garage | null
  cars: CarType[]
}

export function GarageInfoModal({ isOpen, onClose, garage, cars }: GarageInfoModalProps) {
  if (!isOpen || !garage) return null

  // Calculate garage statistics
  const garageCars = cars.filter((car) => car.garageId === garage.id)
  const stats = {
    total: garageCars.length,
    available: garageCars.filter((car) => car.status === "available").length,
    sold: garageCars.filter((car) => car.status === "sold").length,
    pending: garageCars.filter((car) => car.status === "pending").length,
  }

  // Calculate financial statistics
  const totalExpenses = garageCars.reduce((sum, car) => sum + car.totalExpenses, 0)
  const totalSales = garageCars
    .filter((car) => car.saleInfo)
    .reduce((sum, car) => sum + (car.saleInfo?.salePrice || 0), 0)
  const totalProfit = garageCars
    .filter((car) => car.saleInfo)
    .reduce((sum, car) => sum + (car.saleInfo?.totalProfit || 0), 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className={`p-6 text-white ${
            garage.hasPartner
              ? "bg-gradient-to-r from-emerald-500 to-green-600"
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {garage.hasPartner ? (
                  <Users className="h-6 w-6 text-white" />
                ) : (
                  <Building2 className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{garage.name}</h2>
                {garage.hasPartner && (
                  <Badge className="mt-1 text-xs bg-white/20 text-white border-white/30">
                    <Users className="h-3 w-3 mr-1" />
                    Партнерство
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Garage Information */}
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Создан</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{formatDate(garage.createdAt)}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Владелец</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{garage.ownerName || "Вы"}</p>
            </div>
          </div>

          {/* Partner Information */}
          {garage.hasPartner && garage.partnerInfo && (
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600">Информация о партнере</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Имя партнера</p>
                  <p className="text-sm font-bold text-slate-800">{garage.partnerInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Разделение прибыли</p>
                  <p className="text-sm font-bold text-slate-800">
                    {garage.partnerInfo.splitRatio}% / {100 - garage.partnerInfo.splitRatio}%
                  </p>
                </div>
                {garage.partnerInfo.email && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-sm text-slate-700">{garage.partnerInfo.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Car Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Статистика автомобилей</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Всего автомобилей</p>
                <p className="text-lg font-bold text-slate-700">{stats.total}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Доступно</p>
                <p className="text-lg font-bold text-emerald-600">{stats.available}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Продано</p>
                <p className="text-lg font-bold text-blue-600">{stats.sold}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Ожидает</p>
                <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          {/* Financial Statistics */}
          {stats.total > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Финансовая статистика</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Общие расходы</p>
                  <p className="text-lg font-bold text-red-600">€{totalExpenses.toFixed(2)}</p>
                </div>
                {totalSales > 0 && (
                  <>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Общие продажи</p>
                      <p className="text-lg font-bold text-blue-600">€{totalSales.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Общая прибыль</p>
                      <p className={`text-lg font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        €{totalProfit.toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {garage.description && garage.description.trim() && (
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">Описание</span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{garage.description}</p>
            </div>
          )}

          {/* No additional info message */}
          {!garage.description?.trim() && stats.total === 0 && (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">Дополнительная информация появится после добавления автомобилей</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-6 pt-0">
          <Button
            onClick={onClose}
            className={`w-full ${
              garage.hasPartner
                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            }`}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  )
}
