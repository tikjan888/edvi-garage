"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Headphones, MessageCircle, Phone, Mail, Clock, CheckCircle, AlertTriangle, Zap, Star } from "lucide-react"

interface PrioritySupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrioritySupportModal({ isOpen, onClose }: PrioritySupportModalProps) {
  const [ticketForm, setTicketForm] = useState({
    priority: "",
    category: "",
    subject: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const supportTickets = [
    {
      id: "#PRO-001",
      subject: "Проблема с синхронизацией данных",
      status: "В работе",
      priority: "Высокий",
      created: "2024-01-15 10:30",
      response: "< 2 часов",
    },
    {
      id: "#PRO-002",
      subject: "Вопрос по API интеграции",
      status: "Решен",
      priority: "Средний",
      created: "2024-01-14 15:20",
      response: "45 минут",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Симуляция отправки тикета
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Тикет успешно создан! Наш специалист свяжется с вами в течение 30 минут.")
      setTicketForm({ priority: "", category: "", subject: "", description: "" })
    }, 2000)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

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
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Приоритетная поддержка</h2>
                <p className="text-purple-100">Pro функция - Персональная помощь 24/7</p>
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
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Support Channels */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Каналы поддержки Pro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <Phone className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <div className="font-semibold">Прямая линия</div>
                      <div className="text-sm text-gray-600">+7 (800) 123-45-67</div>
                      <Badge className="bg-green-100 text-green-700 text-xs">Доступно 24/7</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-semibold">Приоритетный чат</div>
                      <div className="text-sm text-gray-600">Мгновенные ответы</div>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Ответ &lt; 5 мин</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                    <Mail className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-semibold">Email поддержка</div>
                      <div className="text-sm text-gray-600">pro-support@carfinance.com</div>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">Ответ &lt; 30 мин</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Ваши тикеты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supportTickets.map((ticket, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">{ticket.id}</div>
                          <Badge
                            className={
                              ticket.status === "Решен" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{ticket.subject}</div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{ticket.created}</span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Ответ: {ticket.response}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Create Ticket Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Создать тикет поддержки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Приоритет</Label>
                        <Select
                          value={ticketForm.priority}
                          onValueChange={(value) => setTicketForm((prev) => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите приоритет" />
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
                        <Label htmlFor="category">Категория</Label>
                        <Select
                          value={ticketForm.category}
                          onValueChange={(value) => setTicketForm((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Техническая проблема</SelectItem>
                            <SelectItem value="billing">Вопросы по оплате</SelectItem>
                            <SelectItem value="feature">Запрос функции</SelectItem>
                            <SelectItem value="api">API интеграция</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Тема</Label>
                      <Input
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                        placeholder="Кратко опишите проблему"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Подробно опишите проблему или вопрос"
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Headphones className="h-4 w-4 mr-2" />
                          Создать тикет
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Pro Benefits */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-purple-800">Преимущества Pro поддержки</div>
                    <ul className="text-sm text-purple-700 mt-1 space-y-1">
                      <li>• Приоритетная обработка тикетов</li>
                      <li>• Персональный менеджер поддержки</li>
                      <li>• Техническая консультация по телефону</li>
                      <li>• Помощь с настройкой и интеграцией</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
