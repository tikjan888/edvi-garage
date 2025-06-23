"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Settings,
  EyeOff,
  Users,
  CreditCard,
  BarChart3,
  Cloud,
  Headphones,
  Code,
  Mail,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AdminControlPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface FeatureStatus {
  id: string
  name: string
  icon: any
  enabled: boolean
  visible: boolean
  description: string
  category: "core" | "pro" | "starter" | "admin"
}

export function AdminControlPanel({ isOpen, onClose }: AdminControlPanelProps) {
  const [features, setFeatures] = useState<FeatureStatus[]>([
    // Основные функции
    {
      id: "garages",
      name: "Управление гаражами",
      icon: Settings,
      enabled: true,
      visible: true,
      description: "Создание и управление гаражами",
      category: "core",
    },
    {
      id: "cars",
      name: "Управление автомобилями",
      icon: Settings,
      enabled: true,
      visible: true,
      description: "Добавление и редактирование автомобилей",
      category: "core",
    },
    {
      id: "expenses",
      name: "Учет расходов",
      icon: Settings,
      enabled: true,
      visible: true,
      description: "Ведение учета расходов на автомобили",
      category: "core",
    },
    {
      id: "invitations",
      name: "Приглашения участников",
      icon: Users,
      enabled: true,
      visible: true,
      description: "Приглашение новых участников в гараж",
      category: "core",
    },

    // Starter функции
    {
      id: "email-invites",
      name: "Email приглашения",
      icon: Mail,
      enabled: true,
      visible: true,
      description: "Отправка приглашений по email",
      category: "starter",
    },
    {
      id: "pdf-export",
      name: "PDF экспорт",
      icon: FileText,
      enabled: true,
      visible: true,
      description: "Экспорт отчетов в PDF формат",
      category: "starter",
    },
    {
      id: "excel-export",
      name: "Excel экспорт",
      icon: Download,
      enabled: true,
      visible: true,
      description: "Экспорт данных в Excel",
      category: "starter",
    },

    // Pro функции
    {
      id: "analytics",
      name: "Детальная аналитика",
      icon: BarChart3,
      enabled: true,
      visible: true,
      description: "Подробные отчеты и графики",
      category: "pro",
    },
    {
      id: "cloud-backup",
      name: "Облачные бэкапы",
      icon: Cloud,
      enabled: true,
      visible: true,
      description: "Автоматическое резервное копирование",
      category: "pro",
    },
    {
      id: "priority-support",
      name: "Приоритетная поддержка",
      icon: Headphones,
      enabled: true,
      visible: true,
      description: "Быстрая техническая поддержка",
      category: "pro",
    },
    {
      id: "api-access",
      name: "API доступ",
      icon: Code,
      enabled: true,
      visible: true,
      description: "Доступ к API для интеграций",
      category: "pro",
    },

    // Админ функции
    {
      id: "payment-settings",
      name: "Настройки платежей",
      icon: CreditCard,
      enabled: true,
      visible: true,
      description: "Управление способами оплаты",
      category: "admin",
    },
    {
      id: "user-management",
      name: "Управление пользователями",
      icon: Users,
      enabled: true,
      visible: true,
      description: "Управление ролями пользователей",
      category: "admin",
    },
  ])

  const [systemStatus, setSystemStatus] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    paymentsEnabled: true,
  })

  const toggleFeature = (featureId: string, field: "enabled" | "visible") => {
    setFeatures((prev) =>
      prev.map((feature) => (feature.id === featureId ? { ...feature, [field]: !feature[field] } : feature)),
    )

    const feature = features.find((f) => f.id === featureId)
    if (feature) {
      const action = field === "enabled" ? "отключена" : "скрыта"
      const actionReverse = field === "enabled" ? "включена" : "показана"
      const newValue = !feature[field]

      toast({
        title: `${feature.name}`,
        description: `Функция ${newValue ? actionReverse : action}`,
        variant: newValue ? "default" : "destructive",
      })
    }
  }

  const toggleSystemSetting = (setting: keyof typeof systemStatus) => {
    setSystemStatus((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))

    const settingNames = {
      maintenanceMode: "Режим обслуживания",
      registrationEnabled: "Регистрация пользователей",
      paymentsEnabled: "Платежная система",
    }

    toast({
      title: settingNames[setting],
      description: `${!systemStatus[setting] ? "Включено" : "Отключено"}`,
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-800"
      case "starter":
        return "bg-green-100 text-green-800"
      case "pro":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "core":
        return "Основные"
      case "starter":
        return "Starter"
      case "pro":
        return "Pro"
      case "admin":
        return "Админ"
      default:
        return "Другие"
    }
  }

  const getStatusIcon = (enabled: boolean, visible: boolean) => {
    if (!enabled) return <XCircle className="h-4 w-4 text-red-500" />
    if (!visible) return <EyeOff className="h-4 w-4 text-orange-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const groupedFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) acc[feature.category] = []
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<string, FeatureStatus[]>,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            Админ-панель управления
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="features" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Управление функциями</TabsTrigger>
            <TabsTrigger value="system">Системные настройки</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[70vh]">
            <TabsContent value="features" className="mt-0">
              <div className="space-y-6">
                <div className="text-sm text-gray-600">
                  Управляйте доступностью и видимостью функций для пользователей
                </div>

                {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Badge className={getCategoryColor(category)}>{getCategoryName(category)}</Badge>
                        <span className="text-sm text-gray-500">({categoryFeatures.length} функций)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {categoryFeatures.map((feature) => {
                        const Icon = feature.icon
                        return (
                          <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5 text-gray-600" />
                                {getStatusIcon(feature.enabled, feature.visible)}
                              </div>
                              <div>
                                <h4 className="font-medium">{feature.name}</h4>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`${feature.id}-enabled`} className="text-sm">
                                  Включена
                                </Label>
                                <Switch
                                  id={`${feature.id}-enabled`}
                                  checked={feature.enabled}
                                  onCheckedChange={() => toggleFeature(feature.id, "enabled")}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`${feature.id}-visible`} className="text-sm">
                                  Видима
                                </Label>
                                <Switch
                                  id={`${feature.id}-visible`}
                                  checked={feature.visible}
                                  onCheckedChange={() => toggleFeature(feature.id, "visible")}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="system" className="mt-0">
              <div className="space-y-6">
                <div className="text-sm text-gray-600">Глобальные настройки системы</div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Системные переключатели
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <div>
                          <h4 className="font-medium">Режим обслуживания</h4>
                          <p className="text-sm text-gray-600">
                            Временно отключить доступ к системе для всех пользователей
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={systemStatus.maintenanceMode}
                        onCheckedChange={() => toggleSystemSetting("maintenanceMode")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">Регистрация новых пользователей</h4>
                          <p className="text-sm text-gray-600">Разрешить создание новых аккаунтов</p>
                        </div>
                      </div>
                      <Switch
                        checked={systemStatus.registrationEnabled}
                        onCheckedChange={() => toggleSystemSetting("registrationEnabled")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium">Платежная система</h4>
                          <p className="text-sm text-gray-600">Включить обработку платежей и подписок</p>
                        </div>
                      </div>
                      <Switch
                        checked={systemStatus.paymentsEnabled}
                        onCheckedChange={() => toggleSystemSetting("paymentsEnabled")}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Статус системы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {features.filter((f) => f.enabled).length}
                        </div>
                        <div className="text-sm text-green-600">Активных функций</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {features.filter((f) => f.visible).length}
                        </div>
                        <div className="text-sm text-blue-600">Видимых функций</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {Object.values(systemStatus).filter(Boolean).length}
                        </div>
                        <div className="text-sm text-orange-600">Включенных систем</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
