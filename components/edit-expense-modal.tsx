"use client"

import type { React } from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Edit } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useNames } from "@/contexts/names-context"
import { useGarage } from "@/contexts/garage-context"
import type { Expense } from "@/app/page"

interface EditExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (expenseData: Expense) => void
  expense: Expense | null
}

export function EditExpenseModal({ isOpen, onClose, onSubmit, expense }: EditExpenseModalProps) {
  const { t } = useLanguage()
  const { meName, partnerName } = useNames()
  const { currentGarage } = useGarage()
  const hasPartner = currentGarage?.hasPartner || false

  const [formData, setFormData] = useState({
    description: expense?.description || "",
    amount: expense?.amount.toString() || "",
    date: expense?.date || new Date().toISOString().split("T")[0],
    paidBy: expense?.paidBy || ("you" as "you" | "partner"),
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        date: expense.date,
        paidBy: expense.paidBy,
        notes: "",
      })
    }
  }, [expense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expense) return

    // Validation - только описание и сумма обязательны
    const newErrors: Record<string, string> = {}
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.amount.trim()) newErrors.amount = "Amount is required"
    if (hasPartner && !formData.paidBy) newErrors.paidBy = "Please select who paid"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const updatedExpense: Expense = {
      ...expense,
      description: formData.description.trim(),
      amount: Number.parseFloat(formData.amount),
      category: expense.category || "general", // Сохраняем существующую категорию или устанавливаем общую
      date: formData.date,
      paidBy: hasPartner ? formData.paidBy : "you",
    }

    onSubmit(updatedExpense)
    setErrors({})
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen || !expense) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">
                {t("edit")} {t("expense")}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              {t("description")} *
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`mt-1 ${errors.description ? "border-red-500" : ""}`}
              placeholder="Engine repair, Parts, Service..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Amount & Paid By */}
          <div className={`grid ${hasPartner ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                {t("amount")} (€) *
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className={`mt-1 ${errors.amount ? "border-red-500" : ""}`}
                placeholder="100.00"
                min="0"
                step="0.01"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            {hasPartner && (
              <div>
                <Label htmlFor="paidBy" className="text-sm font-medium text-slate-700">
                  {t("paidBy")}
                </Label>
                <Select
                  value={formData.paidBy}
                  onValueChange={(value: "you" | "partner") => handleChange("paidBy", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.paidBy ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={t("selectPayer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="you">{meName}</SelectItem>
                    <SelectItem value="partner">{partnerName}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paidBy && <p className="text-red-500 text-xs mt-1">{errors.paidBy}</p>}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-sm font-medium text-slate-700">
              {t("date")}
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
              {t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
