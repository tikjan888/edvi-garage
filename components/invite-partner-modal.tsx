"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Mail, Users, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { getDefaultPermissions } from "@/types/garage"
import { addDoc, collection } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

interface InvitePartnerModalProps {
  isOpen: boolean
  onClose: () => void
  garage: any
}

export function InvitePartnerModal({ isOpen, onClose, garage }: InvitePartnerModalProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    role: "partner" as "partner" | "viewer",
    message: "",
    permissions: getDefaultPermissions("partner"),
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const handleRoleChange = (role: "partner" | "viewer") => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: getDefaultPermissions(role),
    }))
  }

  const handlePermissionChange = (permission: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email"
    } else if (formData.email === user?.email) {
      newErrors.email = "Нельзя пригласить самого себя"
    }

    // Проверить, не приглашен ли уже этот email
    const existingMember = garage.members?.find((m) => m.email === formData.email)
    if (existingMember) {
      newErrors.email = "Этот пользователь уже участник гаража"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    // Проверка Firebase
    if (!isFirebaseConfigured || !db) {
      setErrors({ submit: "Firebase не настроен. Функция недоступна в demo режиме." })
      return
    }

    setLoading(true)

    try {
      const invitation = {
        garageId: garage.id,
        garageName: garage.name,
        inviterUserId: user.uid,
        inviterName: user.displayName || user.email || "Пользователь",
        inviterEmail: user.email || "",
        inviteeEmail: formData.email.trim().toLowerCase(),
        status: "pending",
        role: formData.role,
        permissions: formData.permissions,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 дней
      }

      await addDoc(collection(db, "garage-invitations"), invitation)

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        // Сброс формы
        setFormData({
          email: "",
          role: "partner",
          message: "",
          permissions: getDefaultPermissions("partner"),
        })
      }, 2000)
    } catch (error) {
      console.error("Error sending invitation:", error)
      setErrors({ submit: "Ошибка отправки приглашения" })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Проверка Firebase
  if (!isFirebaseConfigured) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Firebase не настроен</h3>
          <p className="text-slate-600 mb-4">Для отправки приглашений необходимо настроить Firebase конфигурацию.</p>
          <Button onClick={onClose} variant="outline" className="w-full">
            Закрыть
          </Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Приглашение отправлено!</h3>
          <p className="text-slate-600">
            Приглашение отправлено на {formData.email}. Пользователь получит email со ссылкой для присоединения к
            гаражу.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Пригласить партнера</h2>
                <p className="text-blue-100 text-sm">Гараж: {garage.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email партнера
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
              }}
              className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
              placeholder="partner@example.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <Label className="text-sm font-medium text-slate-700">Роль</Label>
            <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partner">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-medium">Партнер</p>
                      <p className="text-xs text-slate-500">Может добавлять расходы и просматривать отчеты</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Наблюдатель</p>
                      <p className="text-xs text-slate-500">Только просмотр отчетов</p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Permissions */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Разрешения
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Добавление расходов</p>
                  <p className="text-xs text-slate-500">Может добавлять новые расходы</p>
                </div>
                <Switch
                  checked={formData.permissions.canAddExpenses}
                  onCheckedChange={(checked) => handlePermissionChange("canAddExpenses", checked)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Редактирование расходов</p>
                  <p className="text-xs text-slate-500">Может редактировать свои расходы</p>
                </div>
                <Switch
                  checked={formData.permissions.canEditExpenses}
                  onCheckedChange={(checked) => handlePermissionChange("canEditExpenses", checked)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Просмотр отчетов</p>
                  <p className="text-xs text-slate-500">Может просматривать финансовые отчеты</p>
                </div>
                <Switch
                  checked={formData.permissions.canViewReports}
                  onCheckedChange={(checked) => handlePermissionChange("canViewReports", checked)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Добавление автомобилей</p>
                  <p className="text-xs text-slate-500">Может добавлять новые автомобили</p>
                </div>
                <Switch
                  checked={formData.permissions.canAddCars}
                  onCheckedChange={(checked) => handlePermissionChange("canAddCars", checked)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-slate-700">
              Сообщение (необязательно)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="mt-1"
              placeholder="Привет! Приглашаю тебя присоединиться к нашему гаражу..."
              rows={3}
              disabled={loading}
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Отправка...
                </div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Отправить приглашение
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
