"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "./login-modal"
import { useState } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isDemo } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚗</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Car Finance Manager</h1>
          <p className="text-slate-600 mb-8">
            Управляйте своими автомобилями и расходами.{" "}
            {isDemo ? "Демо режим - данные сохраняются локально." : "Войдите в систему для продолжения."}
          </p>
          {isDemo && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                🚧 <strong>Демо режим</strong> - Firebase не настроен. Данные сохраняются в браузере.
              </p>
            </div>
          )}
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            {isDemo ? "Войти в демо" : "Войти в систему"}
          </button>
        </div>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    )
  }

  return (
    <>
      {isDemo && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-amber-800 text-sm">
            🚧 <strong>Демо режим</strong> - Данные сохраняются локально. Настройте Firebase для облачного хранения.
          </p>
        </div>
      )}
      {children}
    </>
  )
}
