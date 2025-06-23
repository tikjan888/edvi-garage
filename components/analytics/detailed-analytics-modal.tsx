"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  X,
  DollarSign,
  Car,
  Clock,
  ShoppingCart,
  BarChart3,
  Download,
  FileText,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"

interface DetailedAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  garageData?: any
}

function DetailedAnalyticsModal({ isOpen, onClose, garageData }: DetailedAnalyticsModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCar, setSelectedCar] = useState("all")

  const modalRef = useRef<HTMLDivElement>(null)

  // Автофокус при открытии
  useEffect(() => {
    if (isOpen) {
      // Убираем фокус с других элементов
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      // Устанавливаем фокус на контент модального окна
      const timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus()
          // Программно активируем окно
          modalRef.current.scrollTop = 0
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Демо данные автомобилей
  const carsData = [
    {
      id: "bmw-320d",
      name: "BMW 320d 2013",
      buyPrice: 4500,
      sellPrice: 6500,
      repairCost: 800,
      otherCosts: 200,
      buyDate: "2025-03-02",
      sellDate: "2025-03-20",
      status: "sold",
    },
    {
      id: "audi-a4",
      name: "Audi A4 2015",
      buyPrice: 8000,
      sellPrice: 0,
      repairCost: 600,
      otherCosts: 150,
      buyDate: "2025-02-15",
      sellDate: null,
      status: "available",
    },
    {
      id: "mercedes-c",
      name: "Mercedes C-Class 2016",
      buyPrice: 12000,
      sellPrice: 15500,
      repairCost: 1200,
      otherCosts: 300,
      buyDate: "2025-01-10",
      sellDate: "2025-03-15",
      status: "sold",
    },
    {
      id: "vw-golf",
      name: "VW Golf 2014",
      buyPrice: 6000,
      sellPrice: 0,
      repairCost: 400,
      otherCosts: 100,
      buyDate: "2025-03-01",
      sellDate: null,
      status: "available",
    },
    {
      id: "toyota-camry",
      name: "Toyota Camry 2017",
      buyPrice: 15000,
      sellPrice: 18000,
      repairCost: 500,
      otherCosts: 200,
      buyDate: "2024-12-20",
      sellDate: "2025-02-28",
      status: "sold",
    },
  ]

  // Данные для разных периодов
  const periodData = {
    month: {
      multiplier: 1,
      monthlyProfit: [2500, 3200, 4100, 3800, 4500, 5200],
      label: "за месяц",
    },
    quarter: {
      multiplier: 3,
      monthlyProfit: [7500, 9600, 12300, 11400, 13500, 15600],
      label: "за квартал",
    },
    year: {
      multiplier: 12,
      monthlyProfit: [30000, 38400, 49200, 45600, 54000, 62400],
      label: "за год",
    },
  }

  // Получаем данные в зависимости от выбранного периода и автомобиля
  const getAnalyticsData = () => {
    const currentPeriodData = periodData[selectedPeriod as keyof typeof periodData]

    if (selectedCar === "all") {
      // Аналитика всего гаража
      const soldCars = carsData.filter((car) => car.status === "sold")
      const availableCars = carsData.filter((car) => car.status === "available")

      const totalSold = soldCars.length * currentPeriodData.multiplier
      const totalAvailable = availableCars.length
      const avgSellPrice = soldCars.reduce((sum, car) => sum + car.sellPrice, 0) / soldCars.length || 0

      const totalProfit =
        soldCars.reduce((sum, car) => {
          const profit = car.sellPrice - car.buyPrice - car.repairCost - car.otherCosts
          return sum + profit
        }, 0) * currentPeriodData.multiplier

      const avgMargin =
        soldCars.reduce((sum, car) => {
          const margin = ((car.sellPrice - car.buyPrice - car.repairCost - car.otherCosts) / car.sellPrice) * 100
          return sum + margin
        }, 0) / soldCars.length || 0

      const avgDaysToSell =
        soldCars.reduce((sum, car) => {
          if (car.buyDate && car.sellDate) {
            const days = Math.floor(
              (new Date(car.sellDate).getTime() - new Date(car.buyDate).getTime()) / (1000 * 60 * 60 * 24),
            )
            return sum + days
          }
          return sum
        }, 0) / soldCars.length || 0

      const totalRepairCosts = carsData.reduce((sum, car) => sum + car.repairCost, 0) * currentPeriodData.multiplier
      const totalOtherCosts = carsData.reduce((sum, car) => sum + car.otherCosts, 0) * currentPeriodData.multiplier
      const totalBuyCosts = carsData.reduce((sum, car) => sum + car.buyPrice, 0) * currentPeriodData.multiplier

      const mostProfitableDeal = soldCars.reduce((max, car) => {
        const profit = car.sellPrice - car.buyPrice - car.repairCost - car.otherCosts
        const maxProfit = max.sellPrice - max.buyPrice - max.repairCosts - max.otherCosts
        return profit > maxProfit ? car : max
      }, soldCars[0] || {})

      return {
        type: "garage",
        period: currentPeriodData.label,
        totalSold,
        totalAvailable,
        avgSellPrice: Math.round(avgSellPrice),
        totalProfit: Math.round(totalProfit),
        avgMargin: Math.round(avgMargin),
        avgDaysToSell: Math.round(avgDaysToSell),
        totalRepairCosts,
        totalOtherCosts,
        totalBuyCosts,
        mostProfitableDeal,
        monthlyProfit: currentPeriodData.monthlyProfit,
        soldCars,
      }
    } else {
      // Аналитика конкретного автомобиля
      const car = carsData.find((c) => c.id === selectedCar)
      if (!car) return null

      const profit = car.sellPrice - car.buyPrice - car.repairCost - car.otherCosts
      const margin = car.sellPrice > 0 ? (profit / car.sellPrice) * 100 : 0
      const daysInStock = car.buyDate
        ? Math.floor(
            (new Date(car.sellDate || new Date()).getTime() - new Date(car.buyDate).getTime()) / (1000 * 60 * 60 * 24),
          )
        : 0

      return {
        type: "car",
        period: currentPeriodData.label,
        car,
        profit: Math.round(profit),
        margin: Math.round(margin),
        daysInStock,
        totalCosts: car.buyPrice + car.repairCost + car.otherCosts,
      }
    }
  }

  const data = getAnalyticsData()
  if (!data) return null

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-600" />
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const exportReport = () => {
    const csvContent =
      selectedCar === "all"
        ? `Автомобиль,Цена покупки,Цена продажи,Ремонт,Прочие расходы,Прибыль
${carsData
  .map((car) => {
    const profit = car.sellPrice - car.buyPrice - car.repairCost - car.otherCosts
    return `${car.name},${car.buyPrice},${car.sellPrice || "Не продан"},${car.repairCost},${car.otherCosts},${car.sellPrice ? profit : "Не продан"}`
  })
  .join("\n")}`
        : `Показатель,Значение
Автомобиль,${data.car.name}
Цена покупки,€${data.car.buyPrice}
Цена продажи,€${data.car.sellPrice || "Не продан"}
Ремонт,€${data.car.repairCost}
Прочие расходы,€${data.car.otherCosts}
Прибыль,€${data.profit}
Маржа,${data.margin}%
Дней в наличии,${data.daysInStock}`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `analytics_${selectedCar}_${selectedPeriod}_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Закрываем только при клике именно на backdrop, не на дочерние элементы
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Закрытие по Escape
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 10000 }} // Выше чем настройки (9999)
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-analytics-modal
      autoFocus
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-screen overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10001 }} // Еще выше для содержимого
        tabIndex={0}
      >
        {/* Шапка */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Детальная аналитика</h2>
                <p className="text-blue-100">
                  {data.type === "garage" ? `Весь гараж ${data.period}` : `${data.car.name} ${data.period}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Период */}
              <div style={{ zIndex: 10002 }}>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32 bg-white bg-opacity-20 border-white border-opacity-30 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 10003 }}>
                    <SelectItem value="month">Месяц</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                    <SelectItem value="year">Год</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Автомобиль */}
              <div style={{ zIndex: 10002 }}>
                <Select value={selectedCar} onValueChange={setSelectedCar}>
                  <SelectTrigger className="w-48 bg-white bg-opacity-20 border-white border-opacity-30 text-white">
                    <Car className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 10003 }}>
                    <SelectItem value="all">🏠 Весь гараж</SelectItem>
                    {carsData.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        🚗 {car.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {data.type === "garage" ? (
              // Аналитика всего гаража
              <>
                {/* Продажи авто */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-600" />🚗 Продажи авто {data.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{data.totalSold}</div>
                        <div className="text-sm text-gray-600">Продано машин</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">€{data.avgSellPrice.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Средняя цена продажи</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {data.mostProfitableDeal ? data.mostProfitableDeal.name : "Нет данных"}
                        </div>
                        <div className="text-sm text-gray-600">Самая прибыльная сделка</div>
                        {data.mostProfitableDeal && (
                          <div className="text-xs text-purple-600">
                            +€
                            {data.mostProfitableDeal.sellPrice -
                              data.mostProfitableDeal.buyPrice -
                              data.mostProfitableDeal.repairCost -
                              data.mostProfitableDeal.otherCosts}
                          </div>
                        )}
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{data.avgDaysToSell}</div>
                        <div className="text-sm text-gray-600">Дней до продажи</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Доходность */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />💰 Доходность {data.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              €{data.totalProfit.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Общая прибыль</div>
                          </div>
                          {getTrendIcon(12)}
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{data.avgMargin}%</div>
                            <div className="text-sm text-gray-600">Средняя маржа</div>
                          </div>
                          {getTrendIcon(5)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">ТОП машин по доходности</h4>
                        <div className="space-y-2">
                          {data.soldCars.map((car, index) => {
                            const profit = car.sellPrice - car.buyPrice - car.repairCost - car.otherCosts
                            return (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{car.name}</span>
                                <span className="font-semibold text-green-600">€{profit.toLocaleString()}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* График прибыли */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">График изменения прибыли {data.period}</h4>
                      <div className="grid grid-cols-6 gap-2 h-32">
                        {data.monthlyProfit.map((value, index) => (
                          <div key={index} className="flex flex-col items-center justify-end">
                            <div
                              className="bg-gradient-to-t from-green-500 to-green-300 rounded-t w-full transition-all hover:from-green-600 hover:to-green-400 cursor-pointer"
                              style={{ height: `${(value / Math.max(...data.monthlyProfit)) * 100}%` }}
                              title={`€${value.toLocaleString()}`}
                            />
                            <span className="text-xs mt-1 text-gray-500">
                              {selectedPeriod === "month"
                                ? `Нед ${index + 1}`
                                : selectedPeriod === "quarter"
                                  ? `Мес ${index + 1}`
                                  : `Кв ${index + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Закупки авто */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-purple-600" />🛒 Закупки авто {data.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{data.totalSold}</div>
                        <div className="text-sm text-gray-600">Куплено машин</div>
                      </div>
                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                          €{Math.round(data.totalBuyCosts / data.totalSold).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Средняя цена закупки</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">€{data.totalRepairCosts.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Расходы на ремонт</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">
                          €{data.totalOtherCosts.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Документы + доставка</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Скорость оборота */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      ⏱️ Скорость оборота
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{data.avgDaysToSell}</div>
                        <div className="text-sm text-gray-600">Среднее время продажи (дни)</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">1</div>
                        <div className="text-sm text-gray-600">Долго стоящие (больше 30 дней)</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{data.totalAvailable}</div>
                        <div className="text-sm text-gray-600">Авто в наличии</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Категории затрат */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />📊 Категории затрат {data.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <span className="font-medium">Покупка авто</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={75} className="w-24" />
                          <span className="font-semibold">€{data.totalBuyCosts.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-red-500" />
                          <span className="font-medium">Ремонт</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={15} className="w-24" />
                          <span className="font-semibold">€{data.totalRepairCosts.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-yellow-500" />
                          <span className="font-medium">Документы</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={6} className="w-24" />
                          <span className="font-semibold">
                            €{Math.round(data.totalOtherCosts * 0.6).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">6%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-500" />
                          <span className="font-medium">Реклама</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={2} className="w-24" />
                          <span className="font-semibold">
                            €{Math.round(data.totalOtherCosts * 0.2).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">2%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-purple-500" />
                          <span className="font-medium">Транспортировка</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={2} className="w-24" />
                          <span className="font-semibold">
                            €{Math.round(data.totalOtherCosts * 0.2).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">2%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Аналитика конкретного автомобиля
              <>
                {/* Основная информация */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      Информация об автомобиле
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Название:</span>
                          <span className="font-semibold">{data.car.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Куплено за:</span>
                          <span className="font-semibold">€{data.car.buyPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ремонт:</span>
                          <span className="font-semibold text-red-600">€{data.car.repairCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Прочие расходы:</span>
                          <span className="font-semibold text-red-600">€{data.car.otherCosts.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Продано за:</span>
                          <span className="font-semibold">
                            {data.car.sellPrice ? `€${data.car.sellPrice.toLocaleString()}` : "Не продан"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Прибыль:</span>
                          <span className={`font-semibold ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                            €{data.profit.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Дата покупки:</span>
                          <span className="font-semibold">{new Date(data.car.buyDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Дней в наличии:</span>
                          <span className="font-semibold">{data.daysInStock}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Финансовые показатели */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className={`text-3xl font-bold ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        €{data.profit.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Прибыль</div>
                      <div className="mt-2">{getTrendIcon(data.profit)}</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className={`text-3xl font-bold ${data.margin >= 0 ? "text-blue-600" : "text-red-600"}`}>
                        {data.margin}%
                      </div>
                      <div className="text-sm text-gray-600">Маржа</div>
                      <Progress value={Math.abs(data.margin)} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600">€{data.totalCosts.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Общие затраты</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Структура расходов */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      Структура расходов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <span className="font-medium">Покупка</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={80} className="w-24" />
                          <span className="font-semibold">€{data.car.buyPrice.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-red-500" />
                          <span className="font-medium">Ремонт</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={15} className="w-24" />
                          <span className="font-semibold">€{data.car.repairCost.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-yellow-500" />
                          <span className="font-medium">Документы</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={3} className="w-24" />
                          <span className="font-semibold">
                            €{Math.round(data.car.otherCosts * 0.7).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">3%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-500" />
                          <span className="font-medium">Прочее</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={2} className="w-24" />
                          <span className="font-semibold">
                            €{Math.round(data.car.otherCosts * 0.3).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">2%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Экспорт отчётов */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-green-600" />📄 Экспорт отчётов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="flex items-center gap-2" variant="outline">
                    <FileText className="h-4 w-4" />
                    Скачать PDF
                  </Button>
                  <Button onClick={exportReport} className="flex items-center gap-2" variant="outline">
                    <Download className="h-4 w-4" />
                    Скачать Excel
                  </Button>
                  <Button className="flex items-center gap-2" variant="outline">
                    <Activity className="h-4 w-4" />
                    Быстрый отчёт
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export { DetailedAnalyticsModal }
export default DetailedAnalyticsModal
