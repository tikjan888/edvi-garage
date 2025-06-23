"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, Send, Save, Eye, EyeOff, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { getAuth } from "firebase/auth"

interface PaymentMethod {
  id: string
  name: string
  type: "bank_transfer" | "paypal" | "card_transfer"
  enabled: boolean
  details: {
    [key: string]: string
  }
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bank_transfer",
    name: "Банковский перевод",
    type: "bank_transfer",
    enabled: true,
    details: {
      bankName: "Ваш Банк",
      accountHolder: "Ваше Имя Фамилия",
      accountNumber: "1234 5678 9012 3456",
      iban: "DE89 3704 0044 0532 0130 00",
      swift: "DEUTDEFF",
      bic: "DEUTDEFF370",
    },
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "paypal",
    enabled: true,
    details: {
      email: "your-paypal@email.com",
      name: "Ваше Имя",
    },
  },
  {
    id: "card_transfer",
    name: "Перевод на карту",
    type: "card_transfer",
    enabled: true,
    details: {
      cardNumber: "1234 5678 9012 3456",
      cardHolder: "VASHE IMYA",
      bankName: "Ваш Банк",
    },
  },
]

export function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS)
  const [showSensitive, setShowSensitive] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [supportEmail, setSupportEmail] = useState("support@yourapp.com")
  const [paymentInstructions, setPaymentInstructions] = useState("")

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadPaymentSettings()
  }, [])

  const loadPaymentSettings = async () => {
    if (!isFirebaseConfigured || !db) {
      console.log("Firebase не настроен, используются демо данные")
      return
    }

    try {
      const settingsDoc = await getDoc(doc(db, "admin", "payment-settings"))
      if (settingsDoc.exists()) {
        const data = settingsDoc.data()
        if (data.paymentMethods) {
          setPaymentMethods(data.paymentMethods)
        }
        if (data.supportEmail) {
          setSupportEmail(data.supportEmail)
        }
        if (data.paymentInstructions) {
          setPaymentInstructions(data.paymentInstructions)
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек платежей:", error)
    }
  }

  const updatePaymentMethod = (methodId: string, field: string, value: string | boolean) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === methodId
          ? field === "enabled"
            ? { ...method, enabled: value as boolean }
            : { ...method, details: { ...method.details, [field]: value as string } }
          : method,
      ),
    )
  }

  const toggleSensitive = (key: string) => {
    setShowSensitive((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
      toast({
        title: "✅ Скопировано",
        description: "Данные скопированы в буфер обмена",
      })
    } catch (err) {
      console.error("Failed to copy: ", err)
      toast({
        title: "❌ Ошибка",
        description: "Не удалось скопировать",
        variant: "destructive",
      })
    }
  }

  const saveSettings = async () => {
    setLoading(true)

    try {
      if (!isFirebaseConfigured || !db) {
        // -------- Demo mode --------
        toast({
          title: "✅ Настройки сохранены",
          description: "Платежные настройки успешно обновлены (демо режим)",
        })
        setLoading(false)
        return
      }

      const settingsData = {
        paymentMethods,
        supportEmail,
        paymentInstructions,
      }

      // -------- Primary attempt: client-side write --------
      await setDoc(doc(db, "admin", "payment-settings"), settingsData, { merge: true })

      toast({
        title: "✅ Настройки сохранены",
        description: "Платежные настройки успешно обновлены",
      })
    } catch (error: any) {
      // ---------- Fallback on permission-denied ----------
      if (error?.code === "permission-denied") {
        try {
          const auth = getAuth()
          const token = await auth.currentUser?.getIdToken()

          const res = await fetch("/api/admin/payment-settings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(settingsData),
          })

          if (!res.ok) throw new Error(`API error ${res.status}`)

          toast({
            title: "✅ Настройки сохранены",
            description: "Платежные настройки обновлены через сервер",
          })
        } catch (apiErr) {
          console.error("API save failed:", apiErr)
          toast({
            title: "❌ Ошибка сохранения",
            description: "Сервер не смог сохранить настройки",
            variant: "destructive",
          })
        }
      } else {
        console.error("Ошибка сохранения настроек:", error)
        toast({
          title: "❌ Ошибка сохранения",
          description: "Не удалось сохранить настройки",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Настройки платежей</h2>
        <Button onClick={saveSettings} disabled={loading} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Сохранение..." : "Сохранить все"}
        </Button>
      </div>

      <Tabs defaultValue="bank_transfer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bank_transfer" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Банковский перевод
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="card_transfer" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Перевод на карту
          </TabsTrigger>
        </TabsList>

        {/* Bank Transfer Settings */}
        <TabsContent value="bank_transfer">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Банковский перевод
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={paymentMethods[0]?.enabled || false}
                    onCheckedChange={(checked) => updatePaymentMethod("bank_transfer", "enabled", checked)}
                  />
                  <Badge variant={paymentMethods[0]?.enabled ? "default" : "secondary"}>
                    {paymentMethods[0]?.enabled ? "Активен" : "Отключен"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Название банка</Label>
                  <Input
                    id="bankName"
                    value={paymentMethods[0]?.details?.bankName || ""}
                    onChange={(e) => updatePaymentMethod("bank_transfer", "bankName", e.target.value)}
                    placeholder="Название вашего банка"
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolder">Владелец счета</Label>
                  <Input
                    id="accountHolder"
                    value={paymentMethods[0]?.details?.accountHolder || ""}
                    onChange={(e) => updatePaymentMethod("bank_transfer", "accountHolder", e.target.value)}
                    placeholder="Ваше имя и фамилия"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Номер счета</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accountNumber"
                      type={showSensitive.accountNumber ? "text" : "password"}
                      value={paymentMethods[0]?.details?.accountNumber || ""}
                      onChange={(e) => updatePaymentMethod("bank_transfer", "accountNumber", e.target.value)}
                      placeholder="Номер банковского счета"
                    />
                    <Button variant="outline" size="sm" onClick={() => toggleSensitive("accountNumber")}>
                      {showSensitive.accountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentMethods[0]?.details?.accountNumber || "", "accountNumber")}
                    >
                      {copied === "accountNumber" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <div className="flex gap-2">
                    <Input
                      id="iban"
                      value={paymentMethods[0]?.details?.iban || ""}
                      onChange={(e) => updatePaymentMethod("bank_transfer", "iban", e.target.value)}
                      placeholder="DE89 3704 0044 0532 0130 00"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentMethods[0]?.details?.iban || "", "iban")}
                    >
                      {copied === "iban" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="swift">SWIFT/BIC</Label>
                  <Input
                    id="swift"
                    value={paymentMethods[0]?.details?.swift || ""}
                    onChange={(e) => updatePaymentMethod("bank_transfer", "swift", e.target.value)}
                    placeholder="DEUTDEFF"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PayPal Settings */}
        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  PayPal
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={paymentMethods[1]?.enabled || false}
                    onCheckedChange={(checked) => updatePaymentMethod("paypal", "enabled", checked)}
                  />
                  <Badge variant={paymentMethods[1]?.enabled ? "default" : "secondary"}>
                    {paymentMethods[1]?.enabled ? "Активен" : "Отключен"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paypalEmail">Email PayPal</Label>
                  <div className="flex gap-2">
                    <Input
                      id="paypalEmail"
                      type="email"
                      value={paymentMethods[1]?.details?.email || ""}
                      onChange={(e) => updatePaymentMethod("paypal", "email", e.target.value)}
                      placeholder="your-paypal@email.com"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentMethods[1]?.details?.email || "", "paypalEmail")}
                    >
                      {copied === "paypalEmail" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="paypalName">Имя получателя</Label>
                  <Input
                    id="paypalName"
                    value={paymentMethods[1]?.details?.name || ""}
                    onChange={(e) => updatePaymentMethod("paypal", "name", e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Ссылка для быстрой оплаты:</h4>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`https://paypal.me/${paymentMethods[1]?.details?.email?.split("@")[0] || "username"}`}
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `https://paypal.me/${paymentMethods[1]?.details?.email?.split("@")[0] || "username"}`,
                        "paypalLink",
                      )
                    }
                  >
                    {copied === "paypalLink" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Card Transfer Settings */}
        <TabsContent value="card_transfer">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Перевод на карту
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={paymentMethods[2]?.enabled || false}
                    onCheckedChange={(checked) => updatePaymentMethod("card_transfer", "enabled", checked)}
                  />
                  <Badge variant={paymentMethods[2]?.enabled ? "default" : "secondary"}>
                    {paymentMethods[2]?.enabled ? "Активен" : "Отключен"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Номер карты</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cardNumber"
                      type={showSensitive.cardNumber ? "text" : "password"}
                      value={paymentMethods[2]?.details?.cardNumber || ""}
                      onChange={(e) => updatePaymentMethod("card_transfer", "cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                    <Button variant="outline" size="sm" onClick={() => toggleSensitive("cardNumber")}>
                      {showSensitive.cardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentMethods[2]?.details?.cardNumber || "", "cardNumber")}
                    >
                      {copied === "cardNumber" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardHolder">Владелец карты</Label>
                  <Input
                    id="cardHolder"
                    value={paymentMethods[2]?.details?.cardHolder || ""}
                    onChange={(e) => updatePaymentMethod("card_transfer", "cardHolder", e.target.value)}
                    placeholder="VASHE IMYA"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardBank">Банк-эмитент</Label>
                <Input
                  id="cardBank"
                  value={paymentMethods[2]?.details?.bankName || ""}
                  onChange={(e) => updatePaymentMethod("card_transfer", "bankName", e.target.value)}
                  placeholder="Название банка"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Support Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Контактная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supportEmail">Email для поддержки</Label>
            <Input
              id="supportEmail"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@yourapp.com"
            />
            <p className="text-sm text-gray-500 mt-1">
              На этот email пользователи будут отправлять подтверждения платежей
            </p>
          </div>

          <div>
            <Label htmlFor="paymentInstructions">Дополнительные инструкции</Label>
            <Textarea
              id="paymentInstructions"
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              placeholder="Дополнительные инструкции для пользователей по оплате..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
