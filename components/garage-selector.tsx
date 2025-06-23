"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, ChevronDown, Users, User, Plus, Settings, Car } from "lucide-react"
import { useGarage } from "@/contexts/garage-context"
import { useLanguage } from "@/contexts/language-context"
import type { Garage } from "@/types/garage"

interface GarageSelectorProps {
  onAddGarage: () => void
  onManageGarages: () => void
  cars: any[]
}

export function GarageSelector({ onAddGarage, onManageGarages, cars }: GarageSelectorProps) {
  const { garages, currentGarage, setCurrentGarage } = useGarage()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentGarageCars = cars.filter((car) => car.garageId === currentGarage?.id)
  const availableCars = currentGarageCars.filter((car) => car.status === "available").length
  const soldCars = currentGarageCars.filter((car) => car.status === "sold").length

  const handleGarageSelect = (garage: Garage) => {
    setCurrentGarage(garage)
    setIsOpen(false)
  }

  if (!currentGarage && garages.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
        <div className="text-center">
          <Building2 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 mb-3">No garages found</p>
          <Button onClick={onAddGarage} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Create First Garage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden">
        {/* Current Garage Display */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">{currentGarage?.name || "Select Garage"}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Car className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{currentGarageCars.length} cars</span>
                </div>
                {currentGarage?.hasPartner && (
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
                    <Users className="h-3 w-3 mr-1" />
                    Partner
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Quick Stats */}
        {currentGarage && (
          <div className="px-4 pb-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 rounded-lg p-2 text-center">
                <p className="text-xs text-emerald-600 font-medium">{availableCars}</p>
                <p className="text-xs text-emerald-500">Available</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-xs text-blue-600 font-medium">{soldCars}</p>
                <p className="text-xs text-blue-500">Sold</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <p className="text-xs text-purple-600 font-medium">
                  {currentGarageCars.filter((car) => car.status === "pending").length}
                </p>
                <p className="text-xs text-purple-500">Pending</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl z-50 overflow-hidden">
          {/* Garage List */}
          <div className="max-h-64 overflow-y-auto">
            {garages.map((garage) => (
              <button
                key={garage.id}
                onClick={() => handleGarageSelect(garage)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-white/50 transition-colors ${
                  currentGarage?.id === garage.id ? "bg-blue-50" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    garage.hasPartner
                      ? "bg-gradient-to-br from-emerald-500 to-green-600"
                      : "bg-gradient-to-br from-slate-500 to-gray-600"
                  }`}
                >
                  {garage.hasPartner ? (
                    <Users className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-800">{garage.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">{garage.description || "No description"}</p>
                    {garage.hasPartner && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5">
                        {garage.partnerInfo?.splitRatio || 50}% split
                      </Badge>
                    )}
                  </div>
                </div>
                {currentGarage?.id === garage.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-white/30 p-2 space-y-1">
            <Button
              onClick={() => {
                onAddGarage()
                setIsOpen(false)
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Garage
            </Button>
            <Button
              onClick={() => {
                onManageGarages()
                setIsOpen(false)
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-600 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Garages
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
