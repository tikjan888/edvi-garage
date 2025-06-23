"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, LogIn, UserPlus, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isSignUp) {
        // Validation for sign up
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = "Имя обязательно"
        if (!formData.email.trim()) newErrors.email = "Email обязателен"
        if (formData.password.length < 6) newErrors.password = "Пароль должен быть минимум 6 символов"
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Пароли не совпадают"
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
          setLoading(false)
          return
        }

        await signUp(formData.email, formData.password, formData.name)
      } else {
        // Validation for sign in
        if (!formData.email.trim() || !formData.password.trim()) {
          setErrors({ general: "Email и пароль обязательны" })
          setLoading(false)
          return
        }

        await signIn(formData.email, formData.password)
      }

      onClose()
      setFormData({ email: "", password: "", name: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Auth error:", error)
      setErrors({ general: error.message || "Ошибка аутентификации" })
    } finally {
      setLoading(false)
    }
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
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </div>
              <h2 className="text-xl font-bold">{isSignUp ? "Создать аккаунт" : "Вход в систему"}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">Ошибка:</p>
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Имя
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                placeholder="Ваше имя"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Пароль
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`mt-1 pr-10 ${errors.password ? "border-red-500" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {isSignUp && (
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Подтвердите пароль
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className={`mt-1 ${errors.confirmPassword ? "border-red-500" : ""}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? "Загрузка..." : isSignUp ? "Создать аккаунт" : "Войти"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrors({})
                  setFormData({ email: "", password: "", name: "", confirmPassword: "" })
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Создать"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
