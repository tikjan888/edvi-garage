"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Users, Crown, Shield, Eye, Mail, MoreVertical, UserMinus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Garage, GarageMember, GarageInvitation } from "@/types/garage"
import { useAuth } from "@/contexts/auth-context"
import { InvitePartnerModal } from "./invite-partner-modal"
import { subscribeToInvitations } from "@/lib/firestore"
import { getRoleDisplayName } from "@/types/garage"

interface GarageMembersModalProps {
  isOpen: boolean
  onClose: () => void
  garage: Garage | null
}

export function GarageMembersModal({ isOpen, onClose, garage }: GarageMembersModalProps) {
  const { user } = useAuth()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [pendingInvitations, setPendingInvitations] = useState<GarageInvitation[]>([])
  const [loading, setLoading] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (garage) {
      setIsOwner(user?.uid === garage.ownerId)
    }
  }, [user, garage])

  // Подписка на приглашения через функцию из firestore.ts
  useEffect(() => {
    if (!isOpen || !garage?.id) return

    const unsubscribe = subscribeToInvitations(garage.id, setPendingInvitations)
    return unsubscribe
  }, [isOpen, garage?.id])

  const handleRemoveMember = async (member: GarageMember) => {
    if (!isOwner || member.role === "owner" || !garage) return

    const confirmed = confirm(`Удалить ${member.name} из гаража?`)
    if (!confirmed) return

    setLoading(true)
    try {
      // В demo режиме просто показываем уведомление
      alert("В demo режиме изменения не сохраняются")
    } catch (error) {
      console.error("Error removing member:", error)
      alert("Ошибка удаления участника")
    } finally {
      setLoading(false)
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

  if (!isOpen || !garage) return null

  // Создаем участников из существующих данных гаража
  const members: GarageMember[] = []

  // Добавляем владельца как участника
  if (garage.ownerId && garage.ownerName && garage.ownerEmail) {
    members.push({
      userId: garage.ownerId,
      email: garage.ownerEmail,
      name: garage.ownerName,
      role: "owner",
      joinedAt: garage.createdAt,
      permissions: {
        canAddExpenses: true,
        canEditExpenses: true,
        canDeleteExpenses: true,
        canViewReports: true,
        canAddCars: true,
        canEditCars: true,
        canSellCars: true,
      },
    })
  }

  // Добавляем существующих участников из garage.members если они есть
  if (garage.members && Array.isArray(garage.members)) {
    garage.members.forEach((member) => {
      // Проверяем, что это не дубликат владельца
      if (member.userId !== garage.ownerId) {
        members.push(member)
      }
    })
  }

  // Если есть старая структура partnerInfo, добавляем как участника
  if (garage.hasPartner && garage.partnerInfo && !members.some((m) => m.email === garage.partnerInfo?.email)) {
    members.push({
      userId: `partner-${garage.id}`, // Временный ID для старой структуры
      email: garage.partnerInfo.email || "partner@example.com",
      name: garage.partnerInfo.name,
      role: "partner",
      joinedAt: garage.createdAt,
      permissions: {
        canAddExpenses: true,
        canEditExpenses: true,
        canDeleteExpenses: false,
        canViewReports: true,
        canAddCars: false,
        canEditCars: false,
        canSellCars: false,
      },
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Участники гаража</h2>
                  <p className="text-blue-100 text-sm">{garage.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Пригласить
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Demo Mode Warning */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-4 w-4" />
                <span className="text-sm">
                  Demo режим: Показаны текущие участники. Для полной функциональности настройте Firebase.
                </span>
              </div>
            </div>

            {/* Current Members */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Участники ({members.length})
              </h3>

              {members.length > 0 ? (
                members.map((member, index) => (
                  <div key={member.userId || index} className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {member.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-800">{member.name || "Неизвестный пользователь"}</p>
                            {member.userId === user?.uid && (
                              <Badge variant="outline" className="text-xs">
                                Вы
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getRoleBadgeColor(member.role)}`}>
                              <span className="flex items-center gap-1">
                                {getRoleIcon(member.role)}
                                {getRoleDisplayName(member.role)}
                              </span>
                            </Badge>
                            {member.joinedAt && (
                              <span className="text-xs text-slate-500">
                                Присоединился {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions - только показываем в demo режиме */}
                      {isOwner && member.role !== "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRemoveMember(member)} className="text-red-600">
                              <UserMinus className="h-4 w-4 mr-2" />
                              Удалить из гаража
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Permissions */}
                    {member.permissions && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-600 mb-2">Разрешения:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.canAddExpenses && (
                            <Badge variant="outline" className="text-xs">
                              Добавление расходов
                            </Badge>
                          )}
                          {member.permissions.canEditExpenses && (
                            <Badge variant="outline" className="text-xs">
                              Редактирование расходов
                            </Badge>
                          )}
                          {member.permissions.canViewReports && (
                            <Badge variant="outline" className="text-xs">
                              Просмотр отчетов
                            </Badge>
                          )}
                          {member.permissions.canAddCars && (
                            <Badge variant="outline" className="text-xs">
                              Добавление авто
                            </Badge>
                          )}
                          {member.permissions.canSellCars && (
                            <Badge variant="outline" className="text-xs">
                              Продажа авто
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500">Участники не найдены</p>
                </div>
              )}
            </div>

            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Ожидающие приглашения ({pendingInvitations.length})
                </h3>

                {pendingInvitations.map((invitation) => (
                  <div key={invitation.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{invitation.inviteeEmail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getRoleBadgeColor(invitation.role)}`}>
                            <span className="flex items-center gap-1">
                              {getRoleIcon(invitation.role)}
                              {getRoleDisplayName(invitation.role)}
                            </span>
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Отправлено {new Date(invitation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        Ожидает
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {members.length <= 1 && pendingInvitations.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Пока только вы</h3>
                <p className="text-slate-600 mb-4">Пригласите партнеров для совместной работы</p>
                {isOwner && (
                  <Button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Пригласить партнера
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {garage && (
        <InvitePartnerModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} garage={garage} />
      )}
    </>
  )
}
