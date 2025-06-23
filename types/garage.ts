export interface Garage {
  id: string
  name: string
  description?: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  members: GarageMember[]
  hasPartner: boolean // Вычисляется из members
  partnerInfo?: PartnerInfo // Deprecated, оставляем для совместимости
  createdAt: string
  updatedAt: string
}

export interface GarageMember {
  userId: string
  email: string
  name: string
  role: "owner" | "partner" | "viewer"
  joinedAt: string
  permissions: MemberPermissions
}

export interface MemberPermissions {
  canAddExpenses: boolean
  canEditExpenses: boolean
  canDeleteExpenses: boolean
  canViewReports: boolean
  canAddCars: boolean
  canEditCars: boolean
  canSellCars: boolean
}

export interface GarageInvitation {
  id: string
  garageId: string
  garageName: string
  inviterUserId: string
  inviterName: string
  inviterEmail: string
  inviteeEmail: string
  status: "pending" | "accepted" | "declined" | "expired"
  role: "partner" | "viewer"
  permissions: MemberPermissions
  createdAt: string
  expiresAt: string
  acceptedAt?: string
}

export interface PartnerInfo {
  name: string
  email?: string
  phone?: string
  splitRatio: number // Percentage (0-100)
  notes?: string
}

export interface GarageStats {
  totalCars: number
  availableCars: number
  soldCars: number
  pendingCars: number
  totalExpenses: number
  totalRevenue: number
  profit: number
}

// Утилиты для работы с разрешениями
export const getDefaultPermissions = (role: "partner" | "viewer"): MemberPermissions => {
  if (role === "partner") {
    return {
      canAddExpenses: true,
      canEditExpenses: true, // только свои расходы
      canDeleteExpenses: false,
      canViewReports: true,
      canAddCars: false,
      canEditCars: false,
      canSellCars: false,
    }
  }

  return {
    canAddExpenses: false,
    canEditExpenses: false,
    canDeleteExpenses: false,
    canViewReports: true,
    canAddCars: false,
    canEditCars: false,
    canSellCars: false,
  }
}

export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "owner":
      return "Владелец"
    case "partner":
      return "Партнер"
    case "viewer":
      return "Наблюдатель"
    default:
      return role
  }
}
