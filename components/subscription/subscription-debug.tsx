"use client"

import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SubscriptionDebug() {
  const { subscription, upgradeToProDemo, loading } = useSubscription()

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка подписки...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Статус подписки
          <Badge variant={subscription?.planType === "pro" ? "default" : "secondary"}>
            {subscription?.planType?.toUpperCase() || "UNKNOWN"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>План:</strong> {subscription?.planType || "Не определен"}
        </div>
        <div>
          <strong>Статус:</strong> {subscription?.status || "Не определен"}
        </div>
        <div>
          <strong>Использование:</strong>
          <ul className="ml-4 mt-2 space-y-1">
            <li>Гаражи: {subscription?.usage?.garagesCount || 0}</li>
            <li>Автомобили: {subscription?.usage?.carsCount || 0}</li>
            <li>Партнёры: {subscription?.usage?.partnersCount || 0}</li>
          </ul>
        </div>

        {subscription?.planType !== "pro" && (
          <Button onClick={upgradeToProDemo} className="w-full">
            🚀 Обновить до Pro (Демо)
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
