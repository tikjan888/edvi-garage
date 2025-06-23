"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useAdmin } from "@/contexts/admin-context"
import { useLanguage } from "@/contexts/language-context"
import { useNames } from "@/contexts/names-context"
import { PaymentSettings } from "./admin/payment-settings"
import { AdminControlPanel } from "./admin/admin-control-panel"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Crown,
  CreditCard,
  BarChart3,
  Cloud,
  Headphones,
  Code,
  Mail,
  FileText,
  Download,
  Zap,
  Star,
  Lock,
  X,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DetailedAnalyticsModal } from "./analytics/detailed-analytics-modal"

const DEFAULT_NAMES = { garage: "", car: "", expense: "", member: "" } as const

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, signOut } = useAuth()
  const { userRole, isAdmin } = useAdmin()
  const { language, setLanguage } = useLanguage()
  const { names, updateNames } = useNames()

  // Определяем уровень доступа
  const isAdminUser = userRole === 1
  const isPro = userRole === 4 || isAdminUser
  const isStarter = userRole === 3 || isPro

  // Состояния для настроек
  const [activeTab, setActiveTab] = useState("profile")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)
  const [theme, setTheme] = useState("system")
  const [currency, setCurrency] = useState("EUR")

  // Модальные окна
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)

  const [showFeaturesSubmenu, setShowFeaturesSubmenu] = useState(false)
  const [activeFunctionTab, setActiveFunctionTab] = useState<string | null>(null)

  // Локальные имена для редактирования
  const [localNames, setLocalNames] = useState(names ?? DEFAULT_NAMES)

  useEffect(() => {
    if (names) {
      setLocalNames(names)
    }
  }, [names])

  const handleSaveNames = () => {
    updateNames(localNames)
    toast({
      title: "✅ Сохранено",
      description: "Названия успешно обновлены",
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      onClose()
      toast({
        title: "👋 До свидания",
        description: "Вы успешно вышли из системы",
      })
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось выйти из системы",
        variant: "destructive",
      })
    }
  }

  const getSubscriptionInfo = () => {
    if (isAdminUser) {
      return {
        type: "Admin",
        description: "Полный доступ ко всем функциям",
        badge: "👑 Admin",
        color: "bg-yellow-500",
      }
    }

    switch (userRole) {
      case 4:
        return {
          type: "Pro",
          description: "Все функции разблокированы",
          badge: "⭐ Pro",
          color: "bg-purple-500",
        }
      case 3:
        return {
          type: "Starter",
          description: "Расширенные возможности",
          badge: "🚀 Starter",
          color: "bg-blue-500",
        }
      default:
        return {
          type: "Free",
          description: "Базовые функции",
          badge: "🆓 Free",
          color: "bg-gray-500",
        }
    }
  }

  const subscriptionInfo = getSubscriptionInfo()

  const menuItems = [
    { id: "profile", label: "Профиль", icon: User },
    { id: "notifications", label: "Уведомления", icon: Bell },
    { id: "appearance", label: "Внешний вид", icon: Palette },
    { id: "names", label: "Названия", icon: Globe },
    ...(isAdminUser ? [{ id: "payments", label: "Платежи", icon: CreditCard }] : []),
  ]

  const featureItems = [
    { id: "analytics", label: "Детальная аналитика", icon: BarChart3, requiresPro: true },
    { id: "backup", label: "Облачные бэкапы", icon: Cloud, requiresPro: true },
    { id: "support", label: "Приоритетная поддержка", icon: Headphones, requiresPro: true },
    { id: "api", label: "API доступ", icon: Code, requiresPro: true },
    { id: "email", label: "Приглашения партнёров", icon: Mail, requiresStarter: true },
    { id: "pdf", label: "PDF экспорт", icon: FileText, requiresStarter: true },
    { id: "excel", label: "Excel экспорт", icon: Download, requiresStarter: true },
  ]

  const handleFeatureClick = (featureId: string) => {
    setActiveFunctionTab(featureId)
    setActiveTab("function-" + featureId)
  }

  const handleBackToFunctions = () => {
    setActiveFunctionTab(null)
    setActiveTab("features")
  }

  const renderFunctionContent = (functionId: string) => {
    const feature = featureItems.find((item) => item.id === functionId)
    if (!feature) return null

    const Icon = feature.icon
    const hasAccess = feature.requiresPro ? isPro : feature.requiresStarter ? isStarter : true

    if (!hasAccess) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Icon className="h-6 w-6 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-400">{feature.label}</h3>
            <Lock className="h-5 w-5 text-gray-400" />
          </div>

          <div className="text-center py-12">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-500 mb-2">Функция недоступна</h4>
            <p className="text-gray-400 mb-6">
              Для доступа к "{feature.label}" необходима подписка {feature.requiresPro ? "Pro" : "Starter"}
            </p>
            <Button variant="outline" disabled>
              Обновить подписку
            </Button>
          </div>
        </div>
      )
    }

    switch (functionId) {
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Детальная аналитика</h3>
              {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>

            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">📊 Расширенные отчеты</h4>
                  <p className="text-gray-600 mb-4">
                    Подробная аналитика расходов, доходов и трендов с интерактивными графиками
                  </p>
                  <Button className="w-full" onClick={() => setShowDetailedAnalytics(true)}>
                    Открыть аналитику
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">📈 Графики и диаграммы</h4>
                  <p className="text-gray-600 mb-4">Интерактивная визуализация данных с фильтрами по периодам</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">€45K</div>
                      <div className="text-xs text-gray-500">Прибыль</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">68%</div>
                      <div className="text-xs text-gray-500">Конверсия</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">18д</div>
                      <div className="text-xs text-gray-500">Сделка</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Настроить графики
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "backup":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Cloud className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Облачные бэкапы</h3>
              {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>

            {/* Статус бэкапа */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-green-600">Активен</div>
                  <div className="text-sm text-gray-500">Статус бэкапа</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-blue-600">2.4 MB</div>
                  <div className="text-sm text-gray-500">Размер данных</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-purple-600">Сегодня 14:30</div>
                  <div className="text-sm text-gray-500">Последний бэкап</div>
                </CardContent>
              </Card>
            </div>

            {/* Настройки автобэкапа */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">☁️ Автоматическое сохранение</h4>
                    <p className="text-sm text-gray-600">Ваши данные автоматически сохраняются в облаке каждый день</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Время бэкапа</span>
                    <Select defaultValue="14:30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="02:00">02:00</SelectItem>
                        <SelectItem value="14:30">14:30</SelectItem>
                        <SelectItem value="22:00">22:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Хранить копий</span>
                    <Select defaultValue="7">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 дня</SelectItem>
                        <SelectItem value="7">7 дней</SelectItem>
                        <SelectItem value="30">30 дней</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ручные действия */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">💾 Создать бэкап сейчас</h4>
                  <p className="text-gray-600 mb-4">Создать резервную копию всех данных прямо сейчас</p>
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "🔄 Создание бэкапа...",
                        description: "Резервная копия создается, это займет несколько секунд",
                      })
                      setTimeout(() => {
                        toast({
                          title: "✅ Бэкап создан!",
                          description: "Резервная копия успешно сохранена в облаке",
                        })
                      }, 3000)
                    }}
                  >
                    Создать бэкап
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">📥 Восстановить данные</h4>
                  <p className="text-gray-600 mb-4">Восстановить данные из резервной копии</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "⚠️ Восстановление данных",
                        description: "Эта функция заменит текущие данные. Продолжить?",
                      })
                    }}
                  >
                    Восстановить
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* История бэкапов */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">📋 История бэкапов</h4>
                <div className="space-y-3">
                  {[
                    { date: "Сегодня 14:30", size: "2.4 MB", status: "success" },
                    { date: "Вчера 14:30", size: "2.3 MB", status: "success" },
                    { date: "2 дня назад 14:30", size: "2.2 MB", status: "success" },
                    { date: "3 дня назад 14:30", size: "2.1 MB", status: "failed" },
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {backup.status === "success" ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        ) : (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{backup.date}</div>
                          <div className="text-xs text-gray-500">Размер: {backup.size}</div>
                        </div>
                      </div>
                      {backup.status === "success" && (
                        <Button size="sm" variant="ghost">
                          Восстановить
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "support":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Headphones className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Приоритетная поддержка</h3>
              {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>

            {/* Каналы связи */}
            <div className="grid gap-4 mb-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">Прямая линия поддержки</h4>
                      <p className="text-sm text-green-600">+7 (800) 123-45-67 • Доступно 24/7</p>
                    </div>
                    <Badge className="bg-green-600 text-white">Pro</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">Email поддержка</h4>
                      <p className="text-sm text-blue-600">pro-support@garage.com • Ответ в течение 30 минут</p>
                    </div>
                    <Button size="sm" onClick={() => window.open("mailto:pro-support@garage.com")}>
                      Написать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Создание тикета */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">🎫 Создать тикет поддержки</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Приоритет</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                          <SelectItem value="critical">Критический</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Категория</Label>
                      <Select defaultValue="technical">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Техническая проблема</SelectItem>
                          <SelectItem value="billing">Вопросы по оплате</SelectItem>
                          <SelectItem value="feature">Запрос функции</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Тема</Label>
                    <Input placeholder="Кратко опишите проблему" />
                  </div>

                  <div>
                    <Label>Описание</Label>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={4}
                      placeholder="Подробно опишите проблему или вопрос"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "🎫 Тикет создан!",
                        description: "Наш специалист свяжется с вами в течение 30 минут",
                      })
                    }}
                  >
                    Отправить тикет
                  </Button>
                </CardContent>
              </Card>

            {/* Мои тикеты */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">📋 Мои тикеты</h4>
                <div className="space-y-3">
                  {[
                    { id: "#PRO-001", subject: "Проблема с синхронизацией", status: "В работе", priority: "Высокий" },
                    { id: "#PRO-002", subject: "Вопрос по экспорту данных", status: "Решен", priority: "Средний" },
                  ].map((ticket, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{ticket.id}</span>
                        <div className="flex gap-2">
                          <Badge variant={ticket.status === "Решен" ? "default" : "secondary"}>{ticket.status}</Badge>
                          <Badge variant="outline">{ticket.priority}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{ticket.subject}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "api":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Code className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">API доступ</h3>
              {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>

            {/* Статистика API */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-500">Запросов в месяц</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-blue-600">10,000</div>
                  <div className="text-sm text-gray-500">Лимит запросов</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-purple-600">99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </CardContent>
              </Card>
            </div>

            {/* API ключ */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">🔑 Ваш API ключ</h4>
                <div className="space-y-4">
                  <div>
                    <Label>API ключ</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="password"
                        value="cfm_live_sk_1234567890abcdef1234567890abcdef"
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("cfm_live_sk_1234567890abcdef1234567890abcdef")
                          toast({
                            title: "📋 Скопировано!",
                            description: "API ключ скопирован в буфер обмена",
                          })
                        }}
                      >
                        Копировать
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "🔄 Новый ключ создан!",
                          description: "Старый ключ больше не действителен",
                        })
                      }}
                    >
                      Сгенерировать новый ключ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Документация */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">📚 Быстрый старт</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Базовый URL</h5>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">https://api.garage.com/v1</div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Аутентификация</h5>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Пример запроса</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {`curl -X GET "https://api.garage.com/v1/garages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Доступные эндпоинты */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">🔗 Доступные эндпоинты</h4>
                <div className="space-y-3">
                  {[
                    { method: "GET", endpoint: "/garages", description: "Получить список гаражей" },
                    { method: "POST", endpoint: "/garages", description: "Создать новый гараж" },
                    { method: "GET", endpoint: "/cars", description: "Получить список автомобилей" },
                    { method: "POST", endpoint: "/expenses", description: "Добавить расход" },
                    { method: "GET", endpoint: "/reports", description: "Получить отчеты" },
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={api.method === "GET" ? "secondary" : "default"}>{api.method}</Badge>
                        <code className="text-sm">{api.endpoint}</code>
                      </div>
                      <span className="text-sm text-gray-600">{api.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "email":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Mail className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Приглашения партнёров</h3>
              {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>

            {/* Статистика приглашений */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-500">Отправлено</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-500">Принято</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-orange-600">2</div>
                  <div className="text-sm text-gray-500">Ожидают</div>
                </CardContent>
              </Card>
            </div>

            {/* Отправить приглашение */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">📧 Пригласить нового партнёра</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Email партнёра</Label>
                    <Input placeholder="partner@example.com" type="email" />
                  </div>

                  <div>
                    <Label>Роль</Label>
                    <Select defaultValue="partner">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partner">Партнёр (полный доступ)</SelectItem>
                        <SelectItem value="viewer">Наблюдатель (только просмотр)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Сообщение (необязательно)</Label>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={3}
                      placeholder="Привет! Приглашаю тебя присоединиться к нашему гаражу..."
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "📧 Приглашение отправлено!",
                        description: "Партнёр получит email со ссылкой для присоединения",
                      })
                    }}
                  >
                    Отправить приглашение
                  </Button>
                </CardContent>
              </Card>

            {/* Список приглашений */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">👥 Отправленные приглашения</h4>
                <div className="space-y-3">
                  {[
                    { email: "john@example.com", status: "accepted", role: "Партнёр", date: "2 дня назад" },
                    { email: "mary@example.com", status: "pending", role: "Наблюдатель", date: "1 день назад" },
                    { email: "alex@example.com", status: "pending", role: "Партнёр", date: "Сегодня" },
                  ].map((invitation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{invitation.email}</div>
                        <div className="text-sm text-gray-500">
                          {invitation.role} • {invitation.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={invitation.status === "accepted" ? "default" : "secondary"}>
                          {invitation.status === "accepted" ? "Принято" : "Ожидает"}
                        </Badge>
                        {invitation.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "📧 Приглашение отправлено повторно",
                                description: `Повторное приглашение отправлено на ${invitation.email}`,
                              })
                            }}
                          >
                            Повторить
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Настройки приглашений */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">⚙️ Настройки приглашений</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Автоматическое напоминание</Label>
                      <p className="text-sm text-gray-600">Отправлять напоминания через 3 дня</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Уведомления о принятии</Label>
                      <p className="text-sm text-gray-600">Получать уведомления когда приглашение принято</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "pdf":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">PDF экспорт</h3>
              {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>

            {/* Быстрый экспорт */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">📄 Отчет по гаражу</h4>
                  <p className="text-gray-600 mb-4">Полный отчет по всем автомобилям и расходам</p>
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "📄 Создание PDF...",
                        description: "Отчет будет готов через несколько секунд",
                      })
                      setTimeout(() => {
                        toast({
                          title: "✅ PDF готов!",
                          description: "Отчет сохранен в папку Загрузки",
                        })
                      }, 2000)
                    }}
                  >
                    Скачать PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">🚗 Отчет по автомобилю</h4>
                  <p className="text-gray-600 mb-4">Детальный отчет по выбранному автомобилю</p>
                  <div className="space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите автомобиль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bmw-x5">BMW X5 2020</SelectItem>
                        <SelectItem value="audi-a4">Audi A4 2019</SelectItem>
                        <SelectItem value="mercedes-c">Mercedes C-Class 2021</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full">
                      Скачать PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Настройки экспорта */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">⚙️ Настройки экспорта</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Период отчета</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Весь период</SelectItem>
                          <SelectItem value="year">Текущий год</SelectItem>
                          <SelectItem value="month">Текущий месяц</SelectItem>
                          <SelectItem value="custom">Выбрать период</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Включить в отчет</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="expenses" defaultChecked />
                          <Label htmlFor="expenses">Расходы</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="income" defaultChecked />
                          <Label htmlFor="income">Доходы</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="charts" defaultChecked />
                          <Label htmlFor="charts">Графики</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="photos" />
                          <Label htmlFor="photos">Фотографии</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Формат страницы</Label>
                      <Select defaultValue="a4">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4</SelectItem>
                          <SelectItem value="a3">A3</SelectItem>
                          <SelectItem value="letter">Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Ориентация</Label>
                      <Select defaultValue="portrait">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Книжная</SelectItem>
                          <SelectItem value="landscape">Альбомная</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="watermark" />
                      <Label htmlFor="watermark">Добавить водяной знак</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Шаблоны */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">📋 Шаблоны отчетов</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Стандартный", description: "Базовый отчет с основными данными" },
                    { name: "Детальный", description: "Подробный отчет со всеми деталями" },
                    { name: "Финансовый", description: "Фокус на финансовых показателях" },
                  ].map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          Использовать
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* История экспортов */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">📁 Последние экспорты</h4>
                <div className="space-y-3">
                  {[
                    { name: "Отчет_Гараж_2024.pdf", date: "Сегодня 15:30", size: "2.1 MB" },
                    { name: "BMW_X5_Детальный.pdf", date: "Вчера 10:15", size: "1.8 MB" },
                    { name: "Финансовый_отчет_Январь.pdf", date: "3 дня назад", size: "1.2 MB" },
                  ].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {file.date} • {file.size}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Скачать
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "excel":
        return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={handleBackToFunctions} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Download className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Excel экспорт</h3>
            {isAdminUser && <Crown className="h-5 w-5 text-yellow-500" />}
          </div>

          {/* Быстрый экспорт */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">📊 Все данные</h4>
                <p className="text-gray-600 mb-4">Экспорт всех автомобилей и расходов в один файл</p>
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "📊 Создание Excel...",
                      description: "Файл будет готов через несколько секунд"
                    })
                    setTimeout(() => {
                      // Создаем простой CSV файл для демонстрации
                      const csvContent = `Автомобиль,Дата,Описание,Сумма,Тип
BMW X5,2024-01-15,Покупка автомобиля,25000,Расход
BMW X5,2024-01-16,Ремонт двигателя,1500,Расход
BMW X5,2024-01-20,Продажа,30000,Доход
Audi A4,2024-01-10,Покупка автомобиля,18000,Расход
Audi A4,2024-01-12,Замена шин,800,Расход`
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                      const link = document.createElement('a')
                      const url = URL.createObjectURL(blob)
                      link.setAttribute('href', url)
                      link.setAttribute('download', 'garage_data.csv')
                      link.style.visibility = 'hidden'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      
                      toast({
                        title: "✅ Excel файл готов!",
                        description: "Файл сохранен в папку Загрузки"
                      })
                    }, 2000)
                  }}
                >
                  Скачать Excel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">🚗 По автомобилям</h4>
                <p className="text-gray-600 mb-4">Отдельные листы для каждого автомобиля</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "📊 Создание файла...",
                      description: "Создается файл с отдельными листами"
                    })
                  }}
                >
                  Скачать Excel
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Настройки экспорта */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">⚙️ Настройки экспорта</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Формат файла</Label>
                    <Select defaultValue="xlsx">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="ods">OpenDocument (.ods)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Структура данных</Label>
                    <Select defaultValue="detailed">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Детальная</SelectItem>
                        <SelectItem value="summary">Сводная</SelectItem>
                        <SelectItem value="pivot">Сводная таблица</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Период данных</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Весь период</SelectItem>
                        <SelectItem value="year">Текущий год</SelectItem>
                        <SelectItem value="month">Текущий месяц</SelectItem>
                        <SelectItem value="quarter">Текущий квартал</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Включить листы</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="cars-sheet" defaultChecked />
                        <Label htmlFor="cars-sheet">Автомобили</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="expenses-sheet" defaultChecked />
                        <Label htmlFor="expenses-sheet">Расходы</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="income-sheet" defaultChecked />
                        <Label htmlFor="income-sheet">Доходы</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="summary-sheet" defaultChecked />
                        <Label htmlFor="summary-sheet">Сводка</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="charts-sheet" />
                        <Label htmlFor="charts-sheet">Графики</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="formulas" defaultChecked />
                    <Label htmlFor="formulas">Включить формулы</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="formatting" defaultChecked />
                    <Label htmlFor="formatting">Форматирование</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Автоматический экспорт */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">🔄 Автоматический экспорт</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Включить автоэкспорт</Label>
                    <p className="text-sm text-gray-600">Автоматически создавать Excel файлы</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Периодичность</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Ежедневно</SelectItem>
                        <SelectItem value="weekly">Еженедельно</SelectItem>
                        <SelectItem value="monthly">Ежемесячно</SelectItem>
                        <SelectItem value="quarterly">Ежеквартально</SelectItem>
                      </SelectContent>
                  </div>
                  
                  <div>
                    <Label>Email для отправки</Label>
                    <Input placeholder="your@email.com" type="email" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Шаблоны */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">📋 Готовые шаблоны</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { 
                    name: "Финансовый отчет", 
                    description: "Доходы, расходы, прибыль по месяцам",
                    sheets: ["Сводка", "Расходы", "Доходы", "Графики"]
                  },
                  { 
                    name: "Инвентаризация", 
                    description: "Список всех автомобилей с характеристиками",
                    sheets: ["Автомобили", "Техосмотр", "Страховка"]
                  },
                  { 
                    name: "Налоговый отчет", 
                    description: "Данные для налоговой отчетности",
                    sheets: ["Доходы", "Расходы", "НДС", "Прибыль"]
                  },
                  { 
                    name: "Анализ прибыльности", 
                    description: "Детальный анализ по каждому автомобилю",
                    sheets: ["Анализ", "Сравнение", "Тренды"]
                  },
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">{template.name}</h5>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.sheets.map((sheet, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {sheet}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: `📊 Создание "${template.name}"`,
                            description: "Файл будет готов через несколько секунд"
                          })
                        }}
                      >
                        Скачать
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* История экспортов */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">📁 Последние экспорты</h4>
              <div className="space-y-3">
                {[
                  { name: "Garage_Data_2024.xlsx", date: "Сегодня 16:45", size: "1.2 MB", type: "Все данные" },
                  { name: "Financial_Report_Jan.xlsx", date: "Вчера 09:30", size: "856 KB", type: "Финансовый" },
                  { name: "Cars_Inventory.xlsx", date: "2 дня назад", size: "445 KB", type: "Инвентаризация" },
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.date} • {file.size} • {file.type}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        Скачать
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          toast({
                            title: "📊 Пересоздание файла...",
                            description: "Создается новая версия с актуальными данными"
                          })
                        }}
                      >
                        Обновить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )

    default:
      return null
  }
}

  const renderContent = () => {
    // Если активна функция, показываем её контент
    if (activeFunctionTab) {
      return renderFunctionContent(activeFunctionTab)
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.displayName || "Пользователь"}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <Badge className={`${subscriptionInfo.color} text-white mt-1`}>{subscriptionInfo.badge}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Отображаемое имя</Label>
                <Input id="displayName" defaultValue={user?.displayName || ""} placeholder="Ваше имя" />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Подписка: {subscriptionInfo.type}</h4>
                <p className="text-sm text-blue-600">{subscriptionInfo.description}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSignOut} variant="outline" className="flex-1">
                Выйти из аккаунта
              </Button>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Уведомления</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email уведомления</Label>
                    <p className="text-sm text-gray-600">Получать уведомления на email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push уведомления</Label>
                    <p className="text-sm text-gray-600">Уведомления в браузере</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>Автоматический бэкап</Label>
                    {!isPro && <Lock className="h-4 w-4 text-gray-400" />}
                    {isAdminUser && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} disabled={!isPro} />
                </div>
              </div>
            </div>
          </div>
        )

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Внешний вид</h3>

              <div className="space-y-4">
                <div>
                  <Label>Тема</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Светлая</SelectItem>
                      <SelectItem value="dark">Темная</SelectItem>
                      <SelectItem value="system">Системная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Язык</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Валюта</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="RUB">RUB (₽)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case "names":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Настройка названий</h3>
              <p className="text-gray-600 mb-4">Измените названия разделов под свои нужды</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="garage">Название для "Гараж"</Label>
                  <Input
                    id="garage"
                    value={localNames.garage}
                    onChange={(e) => setLocalNames({ ...localNames, garage: e.target.value })}
                    placeholder="Гараж"
                  />
                </div>

                <div>
                  <Label htmlFor="car">Название для "Автомобиль"</Label>
                  <Input
                    id="car"
                    value={localNames.car}
                    onChange={(e) => setLocalNames({ ...localNames, car: e.target.value })}
                    placeholder="Автомобиль"
                  />
                </div>

                <div>
                  <Label htmlFor="expense">Название для "Расход"</Label>
                  <Input
                    id="expense"
                    value={localNames.expense}
                    onChange={(e) => setLocalNames({ ...localNames, expense: e.target.value })}
                    placeholder="Расход"
                  />
                </div>

                <div>
                  <Label htmlFor="member">Название для "Участник"</Label>
                  <Input
                    id="member"
                    value={localNames.member}
                    onChange={(e) => setLocalNames({ ...localNames, member: e.target.value })}
                    placeholder="Участник"
                  />
                </div>
              </div>

              <Button onClick={handleSaveNames} className="w-full mt-4">
                Сохранить названия
              </Button>
            </div>
          </div>
        )

      case "payments":
        return (
          <div className="space-y-6">
            {isAdminUser ? (
              <PaymentSettings />
            ) : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Доступ ограничен</h3>
                <p className="text-gray-600">Настройки платежей доступны только администраторам</p>
              </div>
            )}
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Выберите функцию</h3>
              <p className="text-gray-600">Выберите нужную функцию из меню слева</p>
            </div>
          </div>
        )

      case "about":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Garage Manager</h3>
              <p className="text-gray-600 mb-4">Версия 2.0.0</p>

              {isAdminUser && <Badge className="bg-yellow-500 text-white mb-4">👑 Администратор - Полный доступ</Badge>}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Возможности вашего плана:</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Управление гаражами и автомобилями</li>
                  <li>✅ Учет расходов и доходов</li>
                  <li>✅ Базовая аналитика</li>
                  {isStarter && <li>✅ Email приглашения</li>}
                  {isStarter && <li>✅ PDF/Excel экспорт</li>}
                  {isPro && <li>✅ Детальная аналитика</li>}
                  {isPro && <li>✅ Облачные бэкапы</li>}
                  {isPro && <li>✅ Приоритетная поддержка</li>}
                  {isPro && <li>✅ API доступ</li>}
                  {isAdminUser && <li>👑 Административные функции</li>}
                </ul>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>© 2024 Garage Manager. Все права защищены.</p>
                <p className="mt-1">Разработано с ❤️ для автолюбителей</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 settings-modal">
          <div className="flex h-[80vh]">
            {/* Левая панель с меню */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
              {/* Заголовок */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <h2 className="font-semibold">Настройки</h2>
                    {isAdminUser && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Меню */}
              <div className="flex-1 p-2 overflow-y-auto">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id)
                          setActiveFunctionTab(null)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                          activeTab === item.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    )
                  })}

                  {/* Функции с подменю */}
                  <div>
                    <button
                      onClick={() => setShowFeaturesSubmenu(!showFeaturesSubmenu)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left text-gray-700 hover:bg-gray-100"
                    >
                      <Zap className="h-4 w-4" />
                      Функции
                      <ChevronDown
                        className={`h-4 w-4 ml-auto transition-transform ${showFeaturesSubmenu ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Подменю функций */}
                    {showFeaturesSubmenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {featureItems.map((item) => {
                          const Icon = item.icon
                          const hasAccess = item.requiresPro ? isPro : item.requiresStarter ? isStarter : true

                          return (
                            <button
                              key={item.id}
                              onClick={() => hasAccess && handleFeatureClick(item.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                                hasAccess
                                  ? activeFunctionTab === item.id
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                              {!hasAccess && <Lock className="h-3 w-3 ml-auto" />}
                              {isAdminUser && <Crown className="h-3 w-3 ml-auto text-yellow-500" />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* О программе - всегда внизу */}
                  <button
                    onClick={() => {
                      setActiveTab("about")
                      setActiveFunctionTab(null)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      activeTab === "about" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Star className="h-4 w-4" />О программе
                  </button>
                </nav>

                {/* Админ кнопка */}
                {isAdminUser && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => setShowAdminPanel(true)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Админ-панель
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Правая панель с контентом */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Админ панель - единственное отдельное модальное окно */}
      {showAdminPanel && <AdminControlPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />}

      {/* Детальная аналитика */}
      {showDetailedAnalytics && (
        <DetailedAnalyticsModal isOpen={showDetailedAnalytics} onClose={() => setShowDetailedAnalytics(false)} />
      )}
    </>
  )
}

// —— EXPORTS ————————————————————————————————————————————
// Keep the named export (already present via the function) and
// add a default export so either `import SettingsModal …` or
// `import { SettingsModal } …` both work.
export default SettingsModal
