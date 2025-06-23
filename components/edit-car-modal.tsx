"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Edit } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { CarType } from "@/app/page"

interface EditCarModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (carData: CarType) => void
  car: CarType | null
}

export function EditCarModal({ isOpen, onClose, onSubmit, car }: EditCarModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    plateNumber: "",
    mileage: "",
    notes: "",
    purchaseDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when car changes
  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        year: car.year || "",
        plateNumber: car.plateNumber || "",
        mileage: car.mileage?.toString() || "",
        notes: car.notes || "",
        purchaseDate: car.purchaseDate || "",
      })
    }
  }, [car])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!car) return

    // Validation - только название и год обязательны
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Car name is required"
    if (!formData.year.trim()) newErrors.year = "Year is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Создаем объект обновления только с определенными значениями
    const updatedCar: any = {
      ...car,
      name: formData.name.trim(),
      year: formData.year.trim(),
    }

    // Добавляем необязательные поля только если они не пустые
    if (formData.plateNumber.trim()) {
      updatedCar.plateNumber = formData.plateNumber.trim()
    }

    if (formData.mileage && formData.mileage.trim()) {
      updatedCar.mileage = Number.parseInt(formData.mileage)
    }

    // Сохраняем заметки (даже если пустые)
    updatedCar.notes = formData.notes.trim()

    if (formData.purchaseDate.trim()) {
      updatedCar.purchaseDate = formData.purchaseDate.trim()
    }

    onSubmit(updatedCar)
    setErrors({})
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen || !car) return null

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
              <h2 className="text-xl font-bold">Редактировать автомобиль</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

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
              {t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
