"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Car } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { CarType } from "@/app/page"
import { useGarage } from "@/contexts/garage-context"

interface AddCarModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (carData: Omit<CarType, "id" | "totalExpenses" | "expenses">) => void
}

export function AddCarModal({ isOpen, onClose, onSubmit }: AddCarModalProps) {
  const { t } = useLanguage()
  const { currentGarage } = useGarage()
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    mileage: "",
    plateNumber: "",
    notes: "",
    status: "available" as const,
    purchaseDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation - только название и год обязательны
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Car name is required"
    if (!formData.year.trim()) newErrors.year = "Year is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const carData = {
      name: formData.name.trim(),
      year: formData.year.trim(),
      plateNumber: formData.plateNumber.trim() || undefined,
      mileage: formData.mileage ? Number.parseInt(formData.mileage) : undefined,
      notes: formData.notes.trim() || undefined,
      status: formData.status,
      garageId: currentGarage?.id,
      purchaseDate: formData.purchaseDate || undefined,
    }

    onSubmit(carData)

    // Reset form
    setFormData({
      name: "",
      year: "",
      mileage: "",
      plateNumber: "",
      notes: "",
      status: "available",
      purchaseDate: new Date().toISOString().split("T")[0],
    })
    setErrors({})
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">{t("addNewCar")}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {currentGarage && (
          <div className="px-6 py-3 bg-blue-50 border-b">
            <p className="text-sm text-blue-700">
              Adding to: <span className="font-semibold">{currentGarage.name}</span>
              {currentGarage.hasPartner && (
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Partnership
                </span>
              )}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Car Make & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="make" className="text-sm font-medium text-slate-700">
                {t("carMake")} *
              </Label>
              <Input
                id="make"
                value={formData.name.split(" ")[0] || ""}
                onChange={(e) => {
                  const make = e.target.value
                  const model = formData.name.split(" ").slice(1).join(" ")
                  handleChange("name", `${make} ${model}`.trim())
                }}
                className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                placeholder="Toyota"
              />
            </div>
            <div>
              <Label htmlFor="model" className="text-sm font-medium text-slate-700">
                {t("carModel")} *
              </Label>
              <Input
                id="model"
                value={formData.name.split(" ").slice(1).join(" ") || ""}
                onChange={(e) => {
                  const make = formData.name.split(" ")[0] || ""
                  const model = e.target.value
                  handleChange("name", `${make} ${model}`.trim())
                }}
                className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                placeholder="Camry"
              />
            </div>
          </div>
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          {/* Year & Plate Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="year" className="text-sm font-medium text-slate-700">
                {t("year")} *
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className={`mt-1 ${errors.year ? "border-red-500" : ""}`}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>
            <div>
              <Label htmlFor="plateNumber" className="text-sm font-medium text-slate-700">
                Номер автомобиля
              </Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => handleChange("plateNumber", e.target.value.toUpperCase())}
                className="mt-1"
                placeholder="AB-123-AB (optional)"
                maxLength={9}
              />
            </div>
          </div>

          {/* Mileage & Purchase Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="mileage" className="text-sm font-medium text-slate-700">
                {t("mileage")} (km)
              </Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                className="mt-1"
                placeholder="50000 (optional)"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="purchaseDate" className="text-sm font-medium text-slate-700">
                Дата покупки
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
              {t("notes")}
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="mt-1"
              placeholder={t("additionalInfo")}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
              {t("add")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
