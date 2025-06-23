"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Code, Key, Copy, Eye, EyeOff, RefreshCw, Book, Zap, Shield, Activity, CheckCircle } from "lucide-react"

interface ApiAccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ApiAccessModal({ isOpen, onClose }: ApiAccessModalProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!isOpen) return null

  const apiData = {
    apiKey: "cfm_live_sk_1234567890abcdef1234567890abcdef",
    usage: {
      requests: 1247,
      limit: 10000,
      resetDate: "2024-02-01",
    },
    endpoints: [
      { name: "GET /api/garages", description: "Получить список гаражей", calls: 324 },
      { name: "GET /api/cars", description: "Получить список автомобилей", calls: 567 },
      { name: "POST /api/expenses", description: "Добавить расход", calls: 234 },
      { name: "GET /api/reports", description: "Получить отчеты", calls: 122 },
    ],
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiData.apiKey)
    alert("API ключ скопирован в буфер обмена!")
  }

  const handleGenerateNewKey = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      alert("Новый API ключ сгенерирован!")
    }, 2000)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const codeExample = `// Пример использования API
const response = await fetch('https://api.carfinance.com/v1/garages', {
  headers: {
    'Authorization': 'Bearer ${apiData.apiKey}',
    'Content-Type': 'application/json'
  }
});

const garages = await response.json();
console.log(garages);`

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        pointerEvents: "auto",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">API доступ</h2>
                <p className="text-indigo-100">Pro функция - Программный доступ к данным</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              style={{ pointerEvents: "auto" }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" style={{ pointerEvents: "auto" }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="keys">API ключи</TabsTrigger>
              <TabsTrigger value="docs">Документация</TabsTrigger>
              <TabsTrigger value="usage">Использование</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{apiData.usage.requests.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Запросов в месяц</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{apiData.usage.limit.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Лимит запросов</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    <div className="text-sm text-gray-500">Uptime</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Доступные эндпоинты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apiData.endpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-mono text-sm font-semibold">{endpoint.name}</div>
                          <div className="text-sm text-gray-600">{endpoint.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{endpoint.calls}</div>
                          <div className="text-xs text-gray-500">вызовов</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Ваш API ключ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="apikey">API ключ</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="apikey"
                        type={showApiKey ? "text" : "password"}
                        value={apiData.apiKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopyApiKey}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleGenerateNewKey} disabled={isGenerating} variant="outline">
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Сгенерировать новый ключ
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-800">Безопасность</div>
                        <div className="text-sm text-amber-700 mt-1">
                          Никогда не передавайте ваш API ключ третьим лицам. Храните его в безопасном месте и
                          используйте переменные окружения в ваших приложениях.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Быстрый старт
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">1. Аутентификация</h4>
                      <p className="text-sm text-gray-600 mb-2">Используйте ваш API ключ в заголовке Authorization:</p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        Authorization: Bearer {apiData.apiKey}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">2. Пример запроса</h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{codeExample}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">3. Базовый URL</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <code className="text-blue-800">https://api.carfinance.com/v1</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Доступные методы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-700">GET</Badge>
                        <code className="text-sm">/api/garages</code>
                      </div>
                      <p className="text-sm text-gray-600">Получить список всех гаражей</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                        <code className="text-sm">/api/garages</code>
                      </div>
                      <p className="text-sm text-gray-600">Создать новый гараж</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-700">GET</Badge>
                        <code className="text-sm">/api/cars</code>
                      </div>
                      <p className="text-sm text-gray-600">Получить список автомобилей</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-700">GET</Badge>
                        <code className="text-sm">/api/reports</code>
                      </div>
                      <p className="text-sm text-gray-600">Получить финансовые отчеты</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Использование API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Запросы в этом месяце</span>
                          <span>
                            {apiData.usage.requests} / {apiData.usage.limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(apiData.usage.requests / apiData.usage.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">Лимит сбрасывается: {apiData.usage.resetDate}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Статус API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Статус сервиса</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-semibold">Работает</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Время отклика</span>
                        <span className="font-semibold">45ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Uptime</span>
                        <span className="font-semibold">99.9%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
