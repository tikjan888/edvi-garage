"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  CreditCard,
  Building2,
  Bitcoin,
  Shield,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  ShoppingCartIcon as Paypal,
} from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"

interface CustomPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: "starter" | "pro"
  billingCycle: "monthly" | "yearly"
}

export function CustomPaymentModal({ isOpen, onClose, plan, billingCycle }: CustomPaymentModalProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "crypto" | "paypal">("card")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    email: "",
  })
  const { upgradeToProDemo } = useSubscription()

  const bankDetails = {
    bankName: "Ваш Банк",
    accountHolder: "Ваше Имя",
    accountNumber: "Ваш номер счета",
    iban: "Ваш IBAN",
    swift: "Ваш SWIFT код",
  }

  const paypalEmail = "your-paypal@email.com"

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

  const prices = {
    starter: { monthly: 9, yearly: 90 },
    pro: { monthly: 19, yearly: 190 },
  }

  const price = prices[plan][billingCycle]
  const currency = "EUR"

  const handleClose = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleCardPayment = () => {
    alert("📧 Инструкции для оплаты картой отправлены на ваш email")
    onClose()
  }

  const handleBankTransfer = () => {
    alert("📧 Инструкции для банковского перевода отправлены на ваш email")
    onClose()
  }

  const handleCryptoPayment = () => {
    alert("₿ Криптовалютный платеж инициирован. Проверьте ваш кошелек.")
    onClose()
  }

  const handlePaypalPayment = () => {
    alert(`📧 Инструкции для оплаты через PayPal отправлены на ${paypalEmail}`)
    onClose()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("📋 Скопировано в буфер обмена")
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
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
            <h2 className="text-2xl font-bold mb-2">Оформление подписки</h2>
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
                <div className="text-blue-100 text-sm">
                  {billingCycle === "yearly" && `Экономия ${currency} ${prices[plan].monthly * 12 - price}`}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-6">
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Карта
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Банк
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-2">
                  <Bitcoin className="h-4 w-4" />
                  Крипто
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <Paypal className="h-4 w-4" />
                  PayPal
                </TabsTrigger>
              </TabsList>

              {/* Card Payment */}
              <TabsContent value="card" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Безопасная оплата</span>
                  </div>
                  <p className="text-blue-700 text-sm">Ваши данные защищены 256-битным шифрованием SSL</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="email">Email для чека</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cardData.email}
                      onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="cardName">Имя на карте</Label>
                    <Input
                      id="cardName"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      placeholder="IVAN PETROV"
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="cardNumber">Номер карты</Label>
                    <Input
                      id="cardNumber"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiry">Срок действия</Label>
                    <Input
                      id="expiry"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                      placeholder="123"
                      maxLength={4}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCardPayment}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Обработка платежа...
                    </div>
                  ) : (
                    `Оплатить ${currency} ${price}`
                  )}
                </Button>
              </TabsContent>

              {/* Bank Transfer */}
              <TabsContent value="bank" className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Банковский перевод</span>
                  </div>
                  <p className="text-green-700 text-sm">Переведите средства на наш банковский счет</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-medium">Получатель</Label>
                        <p className="text-sm text-gray-600">{bankDetails.accountHolder}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankDetails.accountHolder)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-medium">IBAN</Label>
                        <p className="text-sm text-gray-600 font-mono">{bankDetails.iban}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankDetails.iban)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-medium">Сумма</Label>
                        <p className="text-sm text-gray-600 font-bold">
                          {currency} {price}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${price}`)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Назначение платежа</Label>
                    <p className="text-sm text-gray-600">
                      Подписка {plan.toUpperCase()} - {billingCycle}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-amber-800 text-sm font-medium">Важно!</p>
                      <p className="text-amber-700 text-sm">
                        Обработка банковского перевода может занять 1-3 рабочих дня. После получения платежа мы
                        активируем вашу подписку.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBankTransfer}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3"
                >
                  Отправить инструкции на email
                </Button>
              </TabsContent>

              {/* Crypto Payment */}
              <TabsContent value="crypto" className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Bitcoin className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Криптовалютная оплата</span>
                  </div>
                  <p className="text-orange-700 text-sm">Поддерживаем Bitcoin, Ethereum, USDT</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                    <div className="text-2xl mb-1">₿</div>
                    <div className="text-sm font-medium">Bitcoin</div>
                    <div className="text-xs text-gray-500">BTC</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                    <div className="text-2xl mb-1">Ξ</div>
                    <div className="text-sm font-medium">Ethereum</div>
                    <div className="text-xs text-gray-500">ETH</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                    <div className="text-2xl mb-1">₮</div>
                    <div className="text-sm font-medium">Tether</div>
                    <div className="text-xs text-gray-500">USDT</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium">Bitcoin адрес</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-white p-2 rounded border flex-1 font-mono">
                      bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium">Сумма к оплате</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold">
                      {currency} {price}
                    </span>
                    <span className="text-sm text-gray-500">≈ 0.00045 BTC</span>
                  </div>
                </div>

                <Button
                  onClick={handleCryptoPayment}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 py-3"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть кошелек для оплаты
                </Button>
              </TabsContent>

              {/* Paypal Payment */}
              <TabsContent value="paypal" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Paypal className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Оплата через PayPal</span>
                  </div>
                  <p className="text-blue-700 text-sm">Оплатите подписку через ваш аккаунт PayPal</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-medium">PayPal Email</Label>
                        <p className="text-sm text-gray-600">{paypalEmail}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paypalEmail)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-medium">Сумма</Label>
                        <p className="text-sm text-gray-600 font-bold">
                          {currency} {price}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${price}`)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Назначение платежа</Label>
                    <p className="text-sm text-gray-600">
                      Подписка {plan.toUpperCase()} - {billingCycle}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handlePaypalPayment}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3"
                >
                  Отправить инструкции на email
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Безопасно</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Мгновенная активация</span>
              </div>
              <div className="flex items-center gap-1">
                <X className="h-4 w-4" />
                <span>Отмена в любое время</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
