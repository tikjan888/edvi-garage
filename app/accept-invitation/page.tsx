"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, Users, Crown, Shield, Eye, Mail, AlertTriangle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useGarage } from "@/contexts/garage-context"
import type { GarageInvitation, Garage } from "@/types/garage"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getRoleDisplayName } from "@/types/garage"

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { updateGarage } = useGarage()

  const [invitation, setInvitation] = useState<GarageInvitation | null>(null)
  const [garage, setGarage] = useState<Garage | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"pending" | "accepted" | "declined" | "error">("pending")

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Неверная ссылка приглашения")
      setLoading(false)
      return
    }

    loadInvitation()
  }, [token])

  const loadInvitation = async () => {
    try {
      setLoading(true)

      // Получить приглашение
      const invitationDoc = await getDoc(doc(db, "garage-invitations", token!))

      if (!invitationDoc.exists()) {
        setError("Приглашение не найдено")
        return
      }

      const invitationData = { id: invitationDoc.id, ...invitationDoc.data() } as GarageInvitation

      // Проверить статус приглашения
      if (invitationData.status !== "pending") {
        if (invitationData.status === "accepted") {
          setStatus("accepted")
        } else if (invitationData.status === "declined") {
          setStatus("declined")
        } else {
          setError("Приглашение недействительно")
        }
        setInvitation(invitationData)
        return
      }

      // Проверить срок действия
      if (new Date() > new Date(invitationData.expiresAt)) {
        setError("Срок действия приглашения истек")
        setInvitation(invitationData)
        return
      }

      // Получить информацию о гараже
      const garageDoc = await getDoc(doc(db, "garages", invitationData.garageId))

      if (!garageDoc.exists()) {
        setError("Гараж не найден")
        return
      }

      const garageData = { id: garageDoc.id, ...garageDoc.data() } as Garage

      setInvitation(invitationData)
      setGarage(garageData)
    } catch (error) {
      console.error("Error loading invitation:", error)
      setError("Ошибка загрузки приглашения")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!user || !invitation || !garage) return

    // Проверить, что email совпадает
    if (user.email !== invitation.inviteeEmail) {
      setError("Это приглашение предназначено для другого email адреса")
      return
    }

    // Проверить, не является ли пользователь уже участником
    const existingMember = garage.members.find((m) => m.userId === user.uid)
    if (existingMember) {
      setError("Вы уже являетесь участником этого гаража")
      return
    }

    setProcessing(true)

    try {
      // Создать объект участника
      const newMember = {
        userId: user.uid,
        email: user.email || "",
        name: user.displayName || user.email || "Пользователь",
        role: invitation.role,
        joinedAt: new Date().toISOString(),
        permissions: invitation.permissions,
      }

      // Добавить участника в гараж
      await updateDoc(doc(db, "garages", garage.id), {
        members: arrayUnion(newMember),
        updatedAt: new Date(),
      })

      // Обновить статус приглашения
      await updateDoc(doc(db, "garage-invitations", invitation.id), {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      })

      setStatus("accepted")

      // Перенаправить на главную страницу через 2 секунды
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error accepting invitation:", error)
      setError("Ошибка принятия приглашения")
    } finally {
      setProcessing(false)
    }
  }

  const handleDecline = async () => {
    if (!invitation) return

    setProcessing(true)

    try {
      await updateDoc(doc(db, "garage-invitations", invitation.id), {
        status: "declined",
        declinedAt: new Date().toISOString(),
      })

      setStatus("declined")
    } catch (error) {
      console.error("Error declining invitation:", error)
      setError("Ошибка отклонения приглашения")
    } finally {
      setProcessing(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "partner":
        return <Users className="h-4 w-4 text-emerald-600" />
      case "viewer":
        return <Eye className="h-4 w-4 text-blue-600" />
      default:
        return <Shield className="h-4 w-4 text-slate-600" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800"
      case "partner":
        return "bg-emerald-100 text-emerald-800"
      case "viewer":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Загрузка приглашения...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Требуется авторизация</h2>
            <p className="text-slate-600 mb-6">Для принятия приглашения необходимо войти в систему</p>
            <Button onClick={() => router.push("/")} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Ошибка</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "accepted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Приглашение принято!</h2>
            <p className="text-slate-600 mb-4">Вы успешно присоединились к гаражу "{garage?.name}"</p>
            <p className="text-sm text-slate-500">Перенаправление на главную страницу...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Приглашение отклонено</h2>
            <p className="text-slate-600 mb-6">Вы отклонили приглашение в гараж "{garage?.name}"</p>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Приглашение в гараж</h1>
            <p className="text-blue-100">Вас пригласили присоединиться</p>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {invitation && garage && (
            <div className="space-y-6">
              {/* Garage Info */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Информация о гараже</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Название</p>
                    <p className="text-lg font-semibold text-slate-800">{garage.name}</p>
                  </div>

                  {garage.description && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">Описание</p>
                      <p className="text-slate-700">{garage.description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-slate-600">Владелец</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                          {garage.ownerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-800">{garage.ownerName}</p>
                        <p className="text-sm text-slate-600">{garage.ownerEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600">Участники</p>
                    <p className="text-slate-700">{garage.members.length} участник(ов)</p>
                  </div>
                </div>
              </div>

              {/* Role Info */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Ваша роль</h3>

                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${getRoleBadgeColor(invitation.role)} text-sm px-3 py-1`}>
                    <span className="flex items-center gap-2">
                      {getRoleIcon(invitation.role)}
                      {getRoleDisplayName(invitation.role)}
                    </span>
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Разрешения:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {invitation.permissions.canAddExpenses && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Добавление расходов
                      </div>
                    )}
                    {invitation.permissions.canEditExpenses && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Редактирование расходов
                      </div>
                    )}
                    {invitation.permissions.canViewReports && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Просмотр отчетов
                      </div>
                    )}
                    {invitation.permissions.canAddCars && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Добавление автомобилей
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invitation Details */}
              <div className="bg-amber-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <Clock className="h-4 w-4" />
                  <span>Приглашение действительно до {new Date(invitation.expiresAt).toLocaleDateString("ru-RU")}</span>
                </div>
              </div>

              {/* Email Verification */}
              {user.email !== invitation.inviteeEmail && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-sm text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      Это приглашение предназначено для {invitation.inviteeEmail}, а вы вошли как {user.email}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  disabled={processing || user.email !== invitation.inviteeEmail}
                  className="flex-1"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Отклонить
                </Button>

                <Button
                  onClick={handleAccept}
                  disabled={processing || user.email !== invitation.inviteeEmail}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Принять приглашение
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
