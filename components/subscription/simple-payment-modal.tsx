"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, CreditCard, Building2, Send, Copy, Check, Mail, AlertCircle, ExternalLink } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { PAYMENT_METHODS, getPaymentInstructions, PRICING } from "@/lib/payment-config"

interface SimplePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: "starter" | "pro"
  billingCycle: "monthly" | "yearly"
}

export function SimplePaymentModal({ isOpen, onClose, plan, billingCycle }: SimplePaymentModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer")
  const [copied, setCopied] = useState<string | null>(null)
  const { upgradeToProDemo } = useSubscription()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

  const price = PRICING[plan][billingCycle]
  const currency = "EUR"
  const selectedPaymentMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod)
  const instructions = selectedPaymentMethod ? getPaymentInstructions(selectedPaymentMethod, plan, billingCycle) : ""

  const handleClose = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handlePaymentComplete = async () => {
    // Имитируем активацию подписки
    if (plan === "pro") {
      await upgradeToProDemo()
    }

    alert(
      `✅ Спасибо! Мы получили информацию о платеже. Подписка ${plan.toUpperCase()} будет активирована в течение 24 часов после подтверждения платежа.`,
    )
    onClose()
  }

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 2147483647 }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Кнопка закрытия */}
        <div
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          onClick={handleClose}
        >
          <X className="h-5 w-5 text-gray-600" />
        </div>

        {/* Контент с прокруткой */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Оплата подписки</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">
                  План: <span className="font-semibold text-white">{plan.toUpperCase()}</span>
                </p>
                <p className="text-blue-100">
                  Период:{" "}
                  <span className="font-semibold text-white">
                    {billingCycle === "monthly" ? "Месячный" : "Годовой"}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {currency} {price}
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-blue-100 text-sm">
                    Экономия {currency} {PRICING[plan].monthly * 12 - price}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Выберите способ оплаты</h3>

            <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="bank_transfer" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Банк
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  PayPal
                </TabsTrigger>
                <TabsTrigger value="card_transfer" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Карта
                </TabsTrigger>
              </TabsList>

              {/* Bank Transfer */}
              <TabsContent value="bank_transfer" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Банковский перевод</span>
                  </div>
                  <p className="text-blue-700 text-sm">Переведите средства на наш банковский счет</p>
                </div>

                <div className="space-y-3">
                  {Object.entries(PAYMENT_METHODS[0].details).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-medium capitalize">
                            {key === "accountHolder"
                              ? "Получатель"
                              : key === "bankName"
                                ? "Банк"
                                : key === "accountNumber"
                                  ? "Номер счета"
                                  : key === "iban"
                                    ? "IBAN"
                                    : key === "swift"
                                      ? "SWIFT"
                                      : key}
                          </label>
                          <p className="text-sm text-gray-600 font-mono">{value}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(value, key)}>
                          {copied === key ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium">Сумма к переводу</label>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-800">
                        {currency} {price}
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(price.toString(), "amount")}>
                        {copied === "amount" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium">Назначение платежа</label>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Подписка {plan.toUpperCase()} - {billingCycle === "monthly" ? "месячная" : "годовая"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `Подписка ${plan.toUpperCase()} - ${billingCycle === "monthly" ? "месячная" : "годовая"}`,
                            "purpose",
                          )
                        }
                      >
                        {copied === "purpose" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PayPal */}
              <TabsContent value="paypal" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">PayPal перевод</span>
                  </div>
                  <p className="text-blue-700 text-sm">Отправьте платеж через PayPal</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="text-sm font-medium">Email получателя</label>
                        <p className="text-sm text-gray-600 font-mono">{PAYMENT_METHODS[1].details.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(PAYMENT_METHODS[1].details.email, "paypal-email")}
                      >
                        {copied === "paypal-email" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="text-sm font-medium">Сумма</label>
                        <p className="text-lg font-bold text-gray-800">
                          {currency} {price}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(price.toString(), "paypal-amount")}
                      >
                        {copied === "paypal-amount" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    window.open(
                      `https://paypal.me/${PAYMENT_METHODS[1].details.email.split("@")[0]}/${price}EUR`,
                      "_blank",
                    )
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть PayPal для отправки
                </Button>
              </TabsContent>

              {/* Card Transfer */}
              <TabsContent value="card_transfer" className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Перевод на карту</span>
                  </div>
                  <p className="text-green-700 text-sm">Переведите средства на банковскую карту</p>
                </div>

                <div className="space-y-3">
                  {Object.entries(PAYMENT_METHODS[2].details).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-medium capitalize">
                            {key === "cardNumber"
                              ? "Номер карты"
                              : key === "cardHolder"
                                ? "Владелец карты"
                                : key === "bankName"
                                  ? "Банк"
                                  : key}
                          </label>
                          <p className="text-sm text-gray-600 font-mono">{value}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(value, `card-${key}`)}>
                          {copied === `card-${key}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="text-sm font-medium">Сумма</label>
                        <p className="text-lg font-bold text-gray-800">
                          {currency} {price}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(price.toString(), "card-amount")}
                      >
                        {copied === "card-amount" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-2">Важные инструкции:</h4>
                  <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                    <li>
                      Переведите точную сумму:{" "}
                      <strong>
                        {currency} {price}
                      </strong>
                    </li>
                    <li>Обязательно укажите назначение платежа</li>
                    <li>После перевода нажмите кнопку "Я отправил платеж"</li>
                    <li>Подписка активируется в течение 24 часов</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handlePaymentComplete}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3"
            >
              <Mail className="h-4 w-4 mr-2" />Я отправил платеж - активировать подписку
            </Button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 border-t text-center">
            <p className="text-sm text-gray-600">
              Возникли вопросы? Напишите нам: <strong>support@yourapp.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
