"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Plus,
  TrendingUp,
  Car,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  RotateCcw,
  Building2,
  Users,
  ArrowLeft,
  Info,
} from "lucide-react"
import type { CarType, Garage } from "@/app/page"
import { useLanguage } from "@/contexts/language-context"
import { useSubscription } from "@/contexts/subscription-context"
import { SubscriptionBadge } from "@/components/subscription/subscription-badge"
import { LimitReachedModal } from "@/components/subscription/limit-reached-modal"
import { PricingModal } from "@/components/subscription/pricing-modal"
import { AddGarageModal } from "./add-garage-modal"
import { ManageGaragesModal } from "./manage-garages-modal"
import { useGarage } from "@/contexts/garage-context"
import { EditGarageModal } from "./edit-garage-modal"
import { GarageInfoModal } from "./garage-info-modal"

interface CarListScreenProps {
  cars: CarType[]
  onCarSelect: (car: CarType) => void
  onAddCar: () => void
  onOpenSettings: () => void
  onEditCar: (car: CarType) => void
  onDeleteCar: (carId: string) => void
  onCancelSale: (carId: string) => void
  onAddGarage: (garageData: any) => void
  onShowCarInfo: (car: CarType) => void
}

export default function CarListScreen({
  cars,
  onCarSelect,
  onAddCar,
  onOpenSettings,
  onEditCar,
  onDeleteCar,
  onCancelSale,
  onAddGarage,
  onShowCarInfo,
}: CarListScreenProps) {
  const { t } = useLanguage()
  const { garages, currentGarage, setCurrentGarage, updateGarage, deleteGarage, addGarage } = useGarage()

  // Subscription functionality
  const { canAddGarage, canAddCar, canAddPartner, incrementUsage, decrementUsage } = useSubscription()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limitType, setLimitType] = useState<"garages" | "cars" | "partners">("cars")

  const [showAddGarageModal, setShowAddGarageModal] = useState(false)
  const [showManageGaragesModal, setShowManageGaragesModal] = useState(false)
  const [showGarageInfoModal, setShowGarageInfoModal] = useState(false)
  const [garageForInfo, setGarageForInfo] = useState<Garage | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "sold" | "pending">("all")

  const [deleteCarId, setDeleteCarId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [showEditGarageModal, setShowEditGarageModal] = useState(false)
  const [editingGarage, setEditingGarage] = useState<Garage | null>(null)
  const [deleteGarageId, setDeleteGarageId] = useState<string | null>(null)
  const [showDeleteGarageModal, setShowDeleteGarageModal] = useState(false)

  // Subscription-aware handlers
  const handleAddCarClick = () => {
    if (canAddCar()) {
      onAddCar()
      incrementUsage("cars")
    } else {
      setLimitType("cars")
      setShowLimitModal(true)
    }
  }

  const handleAddGarageClick = () => {
    if (canAddGarage()) {
      setShowAddGarageModal(true)
    } else {
      setLimitType("garages")
      setShowLimitModal(true)
    }
  }

  const handleAddGarageSubmit = async (garageData: any) => {
    if (!canAddGarage()) {
      setLimitType("garages")
      setShowLimitModal(true)
      return
    }

    // Сначала закрываем модальное окно
    setShowAddGarageModal(false)

    // Затем выполняем добавление в фоне
    try {
      console.log("🏗️ Начинаем добавление гаража:", garageData.name)
      await addGarage(garageData)
      await incrementUsage("garages")
      console.log("✅ Гараж успешно добавлен")
    } catch (error) {
      console.error("❌ Ошибка добавления гаража:", error)
    }
  }

  const handleDeleteCarConfirm = async (carId: string) => {
    // Сначала закрываем модальное окно
    setShowDeleteModal(false)
    setDeleteCarId(null)

    // Затем выполняем удаление в фоне
    try {
      onDeleteCar(carId)
      await decrementUsage("cars")
    } catch (error) {
      console.error("Error deleting car:", error)
    }
  }

  const garageCars = cars.filter((car) => car.garageId === currentGarage?.id)
  const filteredCars = garageCars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || car.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
        return t("available")
      case "sold":
        return t("sold")
      case "pending":
        return t("pending")
      default:
        return "Unknown"
    }
  }

  const statusCounts = {
    available: garageCars.filter((c) => c.status === "available").length,
    sold: garageCars.filter((c) => c.status === "sold").length,
    pending: garageCars.filter((c) => c.status === "pending").length,
  }

  const getTabIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Car className="h-4 w-4" />
      case "sold":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getTabGradient = (status: string, isActive: boolean) => {
    if (!isActive) return "bg-white/50 text-slate-600 hover:bg-white/70"

    switch (status) {
      case "available":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25"
      case "sold":
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg shadow-slate-500/25"
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25"
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
    }
  }

  const getGarageStats = (garageId: string) => {
    const garageCars = cars.filter((car) => car.garageId === garageId)
    return {
      total: garageCars.length,
      available: garageCars.filter((car) => car.status === "available").length,
      sold: garageCars.filter((car) => car.status === "sold").length,
      pending: garageCars.filter((car) => car.status === "pending").length,
    }
  }

  const handleEditGarage = (garage: Garage) => {
    setEditingGarage(garage)
    setShowEditGarageModal(true)
  }

  const handleShowGarageInfo = (garage: Garage) => {
    setGarageForInfo(garage)
    setShowGarageInfoModal(true)
  }

  const handleUpdateGarage = async (garageId: string, updates: Partial<Garage>) => {
    try {
      await updateGarage(garageId, updates)
      setShowEditGarageModal(false)
      setEditingGarage(null)
    } catch (error) {
      console.error("Error updating garage:", error)
    }
  }

  const handleDeleteGarageClick = (garageId: string) => {
    setDeleteGarageId(garageId)
    setShowDeleteGarageModal(true)
  }

  const handleDeleteGarageConfirm = async () => {
    if (!deleteGarageId) return

    // Сначала закрываем модальное окно
    setShowDeleteGarageModal(false)
    setDeleteGarageId(null)

    // Затем выполняем удаление в фоне
    try {
      await deleteGarage(deleteGarageId)
      await decrementUsage("garages")
    } catch (error) {
      console.error("Error deleting garage:", error)
    }
  }

  // If no garage is selected, show garage selection screen
  if (!currentGarage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  Выберите гараж
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  {garages.length} {garages.length === 1 ? "гараж" : "гаражей"} доступно
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SubscriptionBadge />
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/50 rounded-xl" onClick={onOpenSettings}>
                  <Settings className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Garage List */}
        <div className="px-6 py-6">
          {garages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Создайте свой первый гараж</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Гаражи помогают организовать ваши автомобили и управлять партнерскими отношениями
              </p>
              <Button
                onClick={handleAddGarageClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Создать гараж
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {garages.map((garage) => {
                const stats = getGarageStats(garage.id)
                return (
                  <div
                    key={garage.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/90 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => setCurrentGarage(garage)}
                      >
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            garage.hasPartner
                              ? "bg-gradient-to-br from-emerald-500 to-green-600"
                              : "bg-gradient-to-br from-blue-500 to-purple-600"
                          }`}
                        >
                          {garage.hasPartner ? (
                            <Users className="h-8 w-8 text-white" />
                          ) : (
                            <Building2 className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {garage.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShowGarageInfo(garage)
                              }}
                              className="p-1 h-6 w-6 hover:bg-blue-100 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Информация о гараже"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                            {garage.hasPartner && (
                              <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
                                <Users className="h-3 w-3 mr-1" />
                                Партнерство
                              </Badge>
                            )}
                          </div>

                          {garage.description && <p className="text-slate-600 mb-3">{garage.description}</p>}

                          {garage.hasPartner && garage.partnerInfo && (
                            <div className="bg-white/50 rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium text-slate-800">Партнер: {garage.partnerInfo.name}</p>
                              <p className="text-xs text-slate-500">
                                Разделение прибыли: {garage.partnerInfo.splitRatio}% /{" "}
                                {100 - garage.partnerInfo.splitRatio}%
                              </p>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-3">
                            <div className="bg-white/70 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-slate-800">{stats.total}</p>
                              <p className="text-xs text-slate-500">Всего</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-emerald-600">{stats.available}</p>
                              <p className="text-xs text-emerald-500">Доступно</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-blue-600">{stats.sold}</p>
                              <p className="text-xs text-blue-500">Продано</p>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
                              <p className="text-xs text-amber-500">Ожидает</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditGarage(garage)
                          }}
                          className="p-2 hover:bg-blue-100 text-blue-600"
                          title="Редактировать гараж"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteGarageClick(garage.id)
                          }}
                          className="p-2 hover:bg-red-100 text-red-600"
                          title="Удалить гараж"
                          disabled={stats.total > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Add New Garage Button */}
              <div
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-white/50 hover:bg-white/70 hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                onClick={handleAddGarageClick}
              >
                <div className="flex items-center justify-center gap-3 text-slate-600 group-hover:text-blue-600 transition-colors">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Добавить новый гараж</h3>
                    <p className="text-sm text-slate-500">Создать новое место для автомобилей</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddGarageModal
          isOpen={showAddGarageModal}
          onClose={() => setShowAddGarageModal(false)}
          onSubmit={handleAddGarageSubmit}
        />

        <ManageGaragesModal
          isOpen={showManageGaragesModal}
          onClose={() => setShowManageGaragesModal(false)}
          onAddGarage={() => {
            setShowManageGaragesModal(false)
            handleAddGarageClick()
          }}
          cars={cars}
        />

        <GarageInfoModal
          isOpen={showGarageInfoModal}
          onClose={() => {
            setShowGarageInfoModal(false)
            setGarageForInfo(null)
          }}
          garage={garageForInfo}
          cars={cars}
        />

        <EditGarageModal
          isOpen={showEditGarageModal}
          onClose={() => {
            setShowEditGarageModal(false)
            setEditingGarage(null)
          }}
          onSubmit={handleUpdateGarage}
          garage={editingGarage}
        />

        {showDeleteGarageModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Удалить гараж</h3>
              <p className="text-gray-700 mb-6">
                Вы уверены, что хотите удалить этот гараж? Это действие нельзя отменить.
                {deleteGarageId && getGarageStats(deleteGarageId).total > 0 && (
                  <span className="block mt-2 text-amber-600 font-medium">
                    Нельзя удалить гараж, содержащий автомобили. Сначала переместите или удалите все автомобили.
                  </span>
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteGarageModal(false)}>
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteGarageConfirm}
                  disabled={deleteGarageId && getGarageStats(deleteGarageId).total > 0}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Modals */}
        <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
        <LimitReachedModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          onUpgrade={() => {
            setShowLimitModal(false)
            setShowPricingModal(true)
          }}
          limitType={limitType}
        />
      </div>
    )
  }

  // Show cars for selected garage
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/50 rounded-xl"
                onClick={() => setCurrentGarage(null)}
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                    {currentGarage.name}
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    {filteredCars.length} {t("vehiclesInFleet")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShowGarageInfo(currentGarage)}
                  className="p-2 hover:bg-blue-100 text-blue-500"
                  title="Информация о гараже"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SubscriptionBadge />
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/50 rounded-xl" onClick={onOpenSettings}>
                <Settings className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Car List */}
      <div className="px-6 pb-24">
        <div className="space-y-3">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Car className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Нет автомобилей в этом гараже</h2>
              <p className="text-slate-600 mb-8">
                Добавьте свой первый автомобиль, чтобы начать отслеживать расходы и прибыль
              </p>
            </div>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/90 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => onCarSelect(car)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {car.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onShowCarInfo(car)
                            }}
                            className="p-1 h-6 w-6 hover:bg-blue-100 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Информация об автомобиле"
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-500">{car.year}</p>
                          {car.plateNumber && (
                            <>
                              <span className="text-slate-300">•</span>
                              <p className="text-sm text-slate-500 font-mono">{car.plateNumber}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs px-3 py-1 rounded-full ${getStatusColor(car.status)}`}>
                        {getStatusText(car.status)}
                      </Badge>
                      <div className="text-right">
                        {car.saleInfo ? (
                          <div>
                            <p className="text-sm font-medium text-green-600">€{car.saleInfo.salePrice.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{t("salePrice")}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-red-600">€{car.totalExpenses.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{t("totalExpenses")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {car.status === "sold" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onCancelSale(car.id)
                        }}
                        className="p-2 hover:bg-orange-100 text-orange-600"
                        title="Отменить продажу"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditCar(car)
                          }}
                          className="p-2 hover:bg-blue-100 text-blue-600"
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteCarId(car.id)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 hover:bg-red-100 text-red-600"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation with Filters and Add Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/30">
        <div className="px-6 py-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
            <div className="flex gap-1">
              {[
                { key: "all", label: "Все", count: garageCars.length, icon: "all" },
                { key: "available", label: t("available"), count: statusCounts.available, icon: "available" },
                { key: "sold", label: t("sold"), count: statusCounts.sold, icon: "sold" },
                { key: "pending", label: t("pending"), count: statusCounts.pending, icon: "pending" },
              ].map((tab) => {
                const isActive = filterStatus === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilterStatus(tab.key as "all" | "available" | "sold" | "pending")}
                    className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 ${getTabGradient(tab.icon, isActive)}`}
                  >
                    <div className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                      {getTabIcon(tab.icon)}
                    </div>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <div
                      className={`text-xs px-2 py-1 rounded-full font-bold transition-all duration-300 ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </div>
                  </button>
                )
              })}

              {/* Add Car Button with Subscription Check */}
              <button
                onClick={handleAddCarClick}
                className="flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t("addCar")}</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteCarId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Удалить автомобиль</h3>
            <p className="text-gray-700 mb-6">
              Вы уверены, что хотите удалить этот автомобиль? Все связанные расходы также будут удалены. Это действие
              нельзя отменить.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteCarId(null)
                }}
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteCarId) {
                    handleDeleteCarConfirm(deleteCarId)
                  }
                }}
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modals */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => {
          setShowLimitModal(false)
          setShowPricingModal(true)
        }}
        limitType={limitType}
      />

      {/* Other Modals */}
      <AddGarageModal
        isOpen={showAddGarageModal}
        onClose={() => setShowAddGarageModal(false)}
        onSubmit={handleAddGarageSubmit}
      />

      <ManageGaragesModal
        isOpen={showManageGaragesModal}
        onClose={() => setShowManageGaragesModal(false)}
        onAddGarage={() => {
          setShowManageGaragesModal(false)
          handleAddGarageClick()
        }}
        cars={cars}
      />

      <GarageInfoModal
        isOpen={showGarageInfoModal}
        onClose={() => {
          setShowGarageInfoModal(false)
          setGarageForInfo(null)
        }}
        garage={garageForInfo}
        cars={cars}
      />
    </div>
  )
}
