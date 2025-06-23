"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { X, Building2, Users, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Garage } from "@/types/garage"

interface AddGarageModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (garageData: Omit<Garage, "id" | "createdAt" | "updatedAt">) => void
}

export function AddGarageModal({ isOpen, onClose, onSubmit }: AddGarageModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hasPartner: false,
    partnerName: "",
    partnerEmail: "",
    partnerPhone: "",
    splitRatio: 50,
    partnerNotes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Garage name is required"
    if (formData.hasPartner && !formData.partnerName.trim()) {
      newErrors.partnerName = "Partner name is required"
    }
    if (formData.hasPartner && (formData.splitRatio < 0 || formData.splitRatio > 100)) {
      newErrors.splitRatio = "Split ratio must be between 0 and 100"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const garageData: Omit<Garage, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name.trim(),
      description: formData.description.trim() || null, // Use null instead of undefined
      hasPartner: formData.hasPartner,
    }

    // Only add partnerInfo if hasPartner is true
    if (formData.hasPartner) {
      garageData.partnerInfo = {
        name: formData.partnerName.trim(),
        splitRatio: formData.splitRatio,
      }

      // Only add optional fields if they have values
      if (formData.partnerEmail.trim()) {
        garageData.partnerInfo.email = formData.partnerEmail.trim()
      }

      if (formData.partnerPhone.trim()) {
        garageData.partnerInfo.phone = formData.partnerPhone.trim()
      }

      if (formData.partnerNotes.trim()) {
        garageData.partnerInfo.notes = formData.partnerNotes.trim()
      }
    }

    onSubmit(garageData)

    // Reset form
    setFormData({
      name: "",
      description: "",
      hasPartner: false,
      partnerName: "",
      partnerEmail: "",
      partnerPhone: "",
      splitRatio: 50,
      partnerNotes: "",
    })
    setErrors({})
  }

  const handleChange = (field: string, value: string | number | boolean) => {
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
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Add New Garage</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Garage Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Garage Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
              placeholder="Main Garage"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1"
              placeholder="Primary location for car sales..."
              rows={2}
            />
          </div>

          {/* Partner Toggle */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    formData.hasPartner ? "bg-emerald-100" : "bg-slate-100"
                  }`}
                >
                  {formData.hasPartner ? (
                    <Users className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <User className="h-4 w-4 text-slate-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-800">Partnership</p>
                  <p className="text-xs text-slate-500">
                    {formData.hasPartner ? "This garage has a partner" : "Solo operation"}
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.hasPartner}
                onCheckedChange={(checked) => handleChange("hasPartner", checked)}
              />
            </div>

            {/* Partner Details */}
            {formData.hasPartner && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div>
                  <Label htmlFor="partnerName" className="text-sm font-medium text-slate-700">
                    Partner Name
                  </Label>
                  <Input
                    id="partnerName"
                    value={formData.partnerName}
                    onChange={(e) => handleChange("partnerName", e.target.value)}
                    className={`mt-1 ${errors.partnerName ? "border-red-500" : ""}`}
                    placeholder="John Smith"
                  />
                  {errors.partnerName && <p className="text-red-500 text-xs mt-1">{errors.partnerName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="partnerEmail" className="text-sm font-medium text-slate-700">
                      Email (Optional)
                    </Label>
                    <Input
                      id="partnerEmail"
                      type="email"
                      value={formData.partnerEmail}
                      onChange={(e) => handleChange("partnerEmail", e.target.value)}
                      className="mt-1"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerPhone" className="text-sm font-medium text-slate-700">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="partnerPhone"
                      value={formData.partnerPhone}
                      onChange={(e) => handleChange("partnerPhone", e.target.value)}
                      className="mt-1"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="splitRatio" className="text-sm font-medium text-slate-700">
                    Your Profit Share (%)
                  </Label>
                  <Input
                    id="splitRatio"
                    type="number"
                    value={formData.splitRatio}
                    onChange={(e) => handleChange("splitRatio", Number.parseInt(e.target.value) || 0)}
                    className={`mt-1 ${errors.splitRatio ? "border-red-500" : ""}`}
                    min="0"
                    max="100"
                  />
                  {errors.splitRatio && <p className="text-red-500 text-xs mt-1">{errors.splitRatio}</p>}
                  <p className="text-xs text-slate-500 mt-1">Partner gets {100 - formData.splitRatio}%</p>
                </div>

                <div>
                  <Label htmlFor="partnerNotes" className="text-sm font-medium text-slate-700">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="partnerNotes"
                    value={formData.partnerNotes}
                    onChange={(e) => handleChange("partnerNotes", e.target.value)}
                    className="mt-1"
                    placeholder="Partnership terms, agreements..."
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
              Create Garage
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
