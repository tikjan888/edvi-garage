"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { X, Settings, Users, Trash2, Building2, ChevronRight } from "lucide-react"
import type { Garage } from "@/types/garage"
import { useAuth } from "@/contexts/auth-context"
import { useGarage } from "@/contexts/garage-context"
import { GarageMembersModal } from "./garage-members-modal"

interface GarageSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  garage: Garage
}

export function GarageSettingsModal({ isOpen, onClose, garage }: GarageSettingsModalProps) {
  const { user } = useAuth()
  const { updateGarage, deleteGarage, setCurrentGarage } = useGarage()
  const [loading, setLoading] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form state
  const [name, setName] = useState(garage.name)
  const [description, setDescription] = useState(garage.description || "")
  const [isPublic, setIsPublic] = useState(false) // Для будущих функций

  const isOwner = user?.uid === garage.ownerId
  const membersCount = garage.members?.length || (garage.hasPartner ? 2 : 1)

  useEffect(() => {
    if (garage) {
      setName(garage.name)
      setDescription(garage.description || "")
    }
  }, [garage])

  const handleSave = async () => {
    if (!isOwner) return

    setLoading(true)
    try {
      await updateGarage(garage.id, {
        name: name.trim(),
        description: description.trim(),
      })
      onClose()
    } catch (error) {
      console.error("Error updating garage:", error)
      alert("Ошибка обновления гаража")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwner) return

    setLoading(true)
    try {
      await deleteGarage(garage.id)
      setCurrentGarage(null)
      onClose()
    } catch (error) {
      console.error("Error deleting garage:", error)
      alert("Ошибка удаления гаража")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Настройки гаража</h2>
                  <p className="text-blue-100 text-sm">{garage.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Garage Info Section */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Информация о гараже
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="garageName" className="text-sm font-medium text-slate-700">
                    Название гаража
                  </Label>
                  <Input
                    id="garageName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    placeholder="Введите название гаража"
                    disabled={!isOwner}
                  />
                </div>

                <div>
                  <Label htmlFor="garageDescription" className="text-sm font-medium text-slate-700">
                    Описание
                  </Label>
                  <Textarea
                    id="garageDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                    placeholder="Описание гаража (необязательно)"
                    rows={3}
                    disabled={!isOwner}
                  />
                </div>

                {/* Future feature */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg opacity-50">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Публичный гараж</Label>
                    <p className="text-xs text-slate-500">Разрешить другим видеть статистику</p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} disabled />
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Участники и доступ
              </h3>

              <button
                onClick={() => setShowMembersModal(true)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-800">Управление участниками</p>
                    <p className="text-sm text-slate-600">{membersCount} участников</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>

              {/* Owner info */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Владелец гаража</p>
                    <p className="text-xs text-blue-600">{garage.ownerName || garage.ownerEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800">Статистика</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">0</p>
                  <p className="text-sm text-slate-600">Автомобилей</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">{membersCount}</p>
                  <p className="text-sm text-slate-600">Участников</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Создан</p>
                <p className="font-medium text-slate-800">
                  {new Date(garage.createdAt).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            {isOwner && (
              <div className="space-y-4">
                <h3 className="font-semibold text-red-600">Опасная зона</h3>

                <div className="border border-red-200 rounded-2xl p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">Удалить гараж</p>
                      <p className="text-sm text-red-600">Это действие нельзя отменить</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Отмена
              </Button>
              {isOwner && (
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  disabled={loading}
                >
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Удалить гараж</h3>
            <p className="text-gray-700 mb-6">
              Вы уверены, что хотите удалить гараж "{garage.name}"? Все автомобили, расходы и данные будут удалены
              навсегда. Это действие нельзя отменить.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? "Удаление..." : "Удалить гараж"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      <GarageMembersModal isOpen={showMembersModal} onClose={() => setShowMembersModal(false)} garage={garage} />
    </>
  )
}
