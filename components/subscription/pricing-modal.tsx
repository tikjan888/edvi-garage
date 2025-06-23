"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Star, X, Sparkles } from "lucide-react"
import { SimplePaymentModal } from "./simple-payment-modal"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [mounted, setMounted] = useState(false)
  const [showCustomPayment, setShowCustomPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro">("starter")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Escape pressed, closing modal")
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const handleClose = () => {
    console.log("Modal closing...")
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log("Backdrop clicked, closing modal")
      handleClose()
    }
  }

  const handleSubscribe = async (plan: "starter" | "pro", cycle: "monthly" | "yearly") => {
    setSelectedPlan(plan)
    setShowCustomPayment(true)
  }

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Для начинающих",
      features: ["1 гараж", "До 3 автомобилей", "1 партнёр", "Основные функции", "Ограниченная аналитика"],
      buttonText: "Текущий план",
      disabled: true,
      icon: <Star className="h-8 w-8" />,
      gradient: "from-slate-500 to-gray-600",
      bgGradient: "from-gray-50 to-slate-100",
    },
    {
      name: "Starter",
      price: { monthly: 9, yearly: 90 },
      description: "Для малого бизнеса",
      features: [
        "До 3 гаражей",
        "До 20 автомобилей",
        "До 5 партнёров на гараж",
        "Полная отчетность",
        "PDF-отчёты",
        "Email поддержка",
      ],
      buttonText: "Выбрать Starter",
      popular: false,
      icon: <Zap className="h-8 w-8" />,
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50",
    },
    {
      name: "Pro",
      price: { monthly: 19, yearly: 190 },
      description: "Для профессионалов",
      features: [
        "Неограниченные гаражи",
        "Неограниченные автомобили",
        "Неограниченные партнёры",
        "Приглашения по email",
        "Детальная аналитика",
        "Облачные бэкапы",
        "Приоритетная поддержка",
        "API доступ",
      ],
      buttonText: "Выбрать Pro",
      popular: true,
      icon: <Crown className="h-8 w-8" />,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
    },
  ]

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 2147483647 }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Кнопка закрытия - ИСПРАВЛЕНА */}
        <div
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          onClick={handleClose}
        >
          <X className="h-5 w-5 text-gray-600" />
        </div>

        {/* Контент с прокруткой */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Фоновые градиенты */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />

          <div className="relative z-10">
            {/* Header */}
            <div className="pt-12 pb-6 px-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Выберите ваш план
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Начните с бесплатного плана и масштабируйтесь по мере роста
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8 px-8">
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-gray-50"
                  }`}
                >
                  Ежемесячно
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-gray-50"
                  }`}
                >
                  Ежегодно
                  <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1.5 py-0.5">
                    -17%
                  </Badge>
                </button>
              </div>
            </div>

            {/* Plans */}
            <div className="px-8 pb-8">
              <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan, index) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                      plan.popular
                        ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md scale-105"
                        : "border-gray-200 bg-gradient-to-br " + plan.bgGradient + " hover:border-gray-300"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-1 text-sm font-semibold shadow-md">
                          🔥 Популярный
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}
                      >
                        <div className="text-white">{plan.icon}</div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                      <p className="text-slate-600 mb-4">{plan.description}</p>

                      <div className="mb-4">
                        <div className="text-4xl font-bold text-slate-800 mb-1">
                          €{plan.price[billingCycle]}
                          {plan.price[billingCycle] > 0 && (
                            <span className="text-lg font-normal text-slate-500">
                              /{billingCycle === "monthly" ? "мес" : "год"}
                            </span>
                          )}
                        </div>
                        {billingCycle === "yearly" && plan.price.yearly > 0 && (
                          <p className="text-sm text-emerald-600 font-semibold">
                            💰 Экономия €{plan.price.monthly * 12 - plan.price.yearly} в год
                          </p>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(plan.name.toLowerCase() as "starter" | "pro", billingCycle)}
                      disabled={plan.disabled}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg"
                          : plan.disabled
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 py-6 px-8 text-center rounded-b-3xl">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6 mb-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-sm">Безопасные платежи</div>
                      <div className="text-slate-600 text-xs">Защищено Stripe</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-sm">14-дневный пробный период</div>
                      <div className="text-slate-600 text-xs">Pro план бесплатно</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                      <X className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-sm">Отмените в любое время</div>
                      <div className="text-slate-600 text-xs">Без скрытых комиссий</div>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  Присоединяйтесь к тысячам автодилеров, которые уже используют нашу платформу
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Custom Payment Modal */}
        <SimplePaymentModal
          isOpen={showCustomPayment}
          onClose={() => setShowCustomPayment(false)}
          plan={selectedPlan}
          billingCycle={billingCycle}
        />
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
