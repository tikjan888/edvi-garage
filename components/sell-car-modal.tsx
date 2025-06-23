"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, DollarSign } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface SellCarModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (salePrice: number) => void
  carName: string
}

export function SellCarModal({ isOpen, onClose, onConfirm, carName }: SellCarModalProps) {
  const { t } = useLanguage()
  const [salePrice, setSalePrice] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!salePrice.trim()) {
      setError("Sale price is required")
      return
    }

    const price = Number.parseFloat(salePrice)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      return
    }

    onConfirm(price)
    setSalePrice("")
    setError("")
  }

  const handleClose = () => {
    setSalePrice("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t("sellVehicle")}</h2>
                <p className="text-emerald-100 text-sm">{carName}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label htmlFor="salePrice" className="text-sm font-medium text-slate-700">
              {t("salePrice")} (€)
            </Label>
            <Input
              id="salePrice"
              type="number"
              value={salePrice}
              onChange={(e) => {
                setSalePrice(e.target.value)
                if (error) setError("")
              }}
              className={`mt-2 text-lg ${error ? "border-red-500" : ""}`}
              placeholder="5000.00"
              min="0"
              step="0.01"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 mb-2">💡 {t("reminder")}</h3>
            <p className="text-sm text-slate-600">{t("sellReminderText")}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600">
              {t("confirm")} {t("sellVehicle")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
