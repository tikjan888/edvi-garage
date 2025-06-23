"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Users,
  User,
} from "lucide-react"
import type { Expense } from "@/app/page"
import { useLanguage } from "@/contexts/language-context"
import { SellCarModal } from "./sell-car-modal"
import { useNames } from "@/contexts/names-context"
import { EditExpenseModal } from "./edit-expense-modal"
import { useGarage } from "@/contexts/garage-context"

interface ExpenseDetailScreenProps {
  car: any
  onBack: () => void
  onSell: (salePrice: number) => void
  onAddExpense: () => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (expenseId: string) => void
  onStatusChange: (carId: string, status: "available" | "pending") => void
}

export function ExpenseDetailScreen({
  car,
  onBack,
  onSell,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onStatusChange,
}: ExpenseDetailScreenProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [showSellModal, setShowSellModal] = useState(false)
  const { t } = useLanguage()
  const { meName, partnerName } = useNames()
  const { currentGarage } = useGarage()
  const hasPartner = currentGarage?.hasPartner || false

  // Получаем имя партнера из гаража или используем дефолтное
  const actualPartnerName = currentGarage?.partnerInfo?.name || partnerName

  const [selectedExpense, setSelectedExpense] = useState<any | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleSellClick = () => {
    setShowSellModal(true)
  }

  const handleSellConfirm = (salePrice: number) => {
    setShowSellModal(false)
    onSell(salePrice)
  }

  const handleStatusChange = (newStatus: "available" | "pending") => {
    console.log("ExpenseDetailScreen: Changing status from", car.status, "to", newStatus, "for car:", car.id)

    if (car.status === newStatus) {
      console.log("Status is already", newStatus, "- no change needed")
      return
    }

    onStatusChange(car.id, newStatus)
  }

  const yourExpenses = car.expenses
    .filter((e) => e.type === "expense" && e.paidBy === "you")
    .reduce((sum, e) => sum + e.amount, 0)
  const partnerExpenses = car.expenses
    .filter((e) => e.type === "expense" && e.paidBy === "partner")
    .reduce((sum, e) => sum + e.amount, 0)
  const totalExpenses = car.expenses.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  const netAmount = yourExpenses + partnerExpenses

  // Calculate counts for tabs (только если есть партнер)
  const expenseCounts = hasPartner
    ? {
        all: car.expenses.length,
        you: car.expenses.filter((e) => e.paidBy === "you").length,
        partner: car.expenses.filter((e) => e.paidBy === "partner").length,
      }
    : {}

  const filteredExpenses = car.expenses.filter((expense) => {
    if (!hasPartner) return true // Если нет партнера, показываем все расходы
    if (activeTab === "all") return true
    if (activeTab === "you") return expense.paidBy === "you"
    if (activeTab === "partner") return expense.paidBy === "partner"
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "sold":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 text-white"
      case "pending":
        return "bg-amber-500 text-white"
      case "sold":
        return "bg-gray-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return t("available")
      case "pending":
        return t("pending")
      case "sold":
        return t("sold")
      default:
        return "Unknown"
    }
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "you":
        return <User className="h-4 w-4" />
      case "partner":
        return <Users className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getTabGradient = (tab: string, isActive: boolean) => {
    if (!isActive) return "bg-white/50 text-slate-600 hover:bg-white/70"

    switch (tab) {
      case "you":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
      case "partner":
        return "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25"
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg shadow-slate-500/25"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-white/50 rounded-xl">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{car.name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600">
                    {car.year} • {t("financialOverview")}
                  </p>
                  {car.plateNumber && (
                    <>
                      <span className="text-slate-300">•</span>
                      <p className="text-sm text-slate-500 font-mono">{car.plateNumber}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {car.status !== "sold" && (
                <Button
                  onClick={handleSellClick}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
                >
                  {t("sellVehicle")}
                </Button>
              )}
            </div>
          </div>

          {/* Status Control */}
          {car.status !== "sold" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">Статус автомобиля:</span>
                  <Badge className={`px-3 py-1 rounded-full ${getStatusColor(car.status)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(car.status)}
                      <span>{getStatusText(car.status)}</span>
                    </div>
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={car.status === "available" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("available")}
                    className={`px-4 py-2 text-sm transition-all duration-200 ${
                      car.status === "available"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                        : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 border-slate-300"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t("available")}
                  </Button>
                  <Button
                    variant={car.status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("pending")}
                    className={`px-4 py-2 text-sm transition-all duration-200 ${
                      car.status === "pending"
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                        : "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 border-slate-300"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {t("pending")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Sold Status Display */}
          {car.status === "sold" && car.saleInfo && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Автомобиль продан</p>
                    <p className="text-sm text-green-600">Цена продажи: €{car.saleInfo.salePrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-700">Прибыль: €{car.saleInfo.totalProfit.toFixed(2)}</p>
                  <p className="text-xs text-green-600">Вы получили: €{car.saleInfo.youReceive.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {hasPartner ? (
            <>
              {/* С партнером - показываем отдельные карточки */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      {meName} {t("expenses")}
                    </p>
                    <p className="text-xl font-bold text-blue-600">€{yourExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      {actualPartnerName} {t("expenses")}
                    </p>
                    <p className="text-xl font-bold text-purple-600">€{partnerExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">{t("totalExpenses")}</p>
                    <p className="text-xl font-bold text-red-600">€{Math.abs(netAmount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Без партнера - показываем только общие расходы */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Общие расходы</p>
                    <p className="text-xl font-bold text-blue-600">€{totalExpenses.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Всего записей</p>
                    <p className="text-xl font-bold text-slate-600">{car.expenses.length}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Transactions List */}
        <div className={`space-y-3 ${car.status !== "sold" ? "mb-32" : "mb-6"}`}>
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/90 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      hasPartner ? (expense.paidBy === "you" ? "bg-blue-100" : "bg-purple-100") : "bg-blue-100"
                    }`}
                  >
                    <span
                      className={`text-lg font-bold ${
                        hasPartner ? (expense.paidBy === "you" ? "text-blue-600" : "text-purple-600") : "text-blue-600"
                      }`}
                    >
                      {hasPartner
                        ? expense.paidBy === "you"
                          ? meName.charAt(0).toUpperCase()
                          : actualPartnerName.charAt(0).toUpperCase()
                        : meName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">{expense.description}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {expense.date}
                      </div>

                      {hasPartner && (
                        <Badge
                          className={`text-xs px-2 py-1 rounded-full ${
                            expense.paidBy === "you" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {expense.paidBy === "you" ? meName : actualPartnerName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-3">
                    <p className="text-lg font-bold text-red-600">-€{expense.amount.toFixed(2)}</p>
                  </div>
                  {car.status !== "sold" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedExpense(expense)
                          setShowEditModal(true)
                        }}
                        className="p-2 hover:bg-blue-100 text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedExpense(expense)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - показываем только если машина не продана */}
      {car.status !== "sold" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/30">
          <div className="px-6 py-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
              <div className="flex gap-1">
                {hasPartner ? (
                  <>
                    {/* С партнером - показываем табы фильтрации с реальными именами */}
                    {[
                      { key: "all", label: "All", count: expenseCounts.all, icon: "all" },
                      { key: "you", label: meName, count: expenseCounts.you, icon: "you" },
                      { key: "partner", label: actualPartnerName, count: expenseCounts.partner, icon: "partner" },
                    ].map((tab) => {
                      const isActive = activeTab === tab.key
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
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
                  </>
                ) : null}

                {/* Add Expense Button - всегда показываем */}
                <button
                  onClick={onAddExpense}
                  className={`${hasPartner ? "flex-1" : "w-full"} py-3 px-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("addExpense")}</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Car Modal */}
      <SellCarModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        onConfirm={handleSellConfirm}
        carName={car.name}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedExpense(null)
        }}
        onSubmit={(updatedExpense) => {
          onEditExpense(updatedExpense)
          setShowEditModal(false)
          setSelectedExpense(null)
        }}
        expense={selectedExpense}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Expense</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{selectedExpense.description}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedExpense(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDeleteExpense(selectedExpense.id)
                  setShowDeleteModal(false)
                  setSelectedExpense(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
