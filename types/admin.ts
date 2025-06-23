import type { UserRole } from "./user-roles"

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
  lastLogin?: string
  garagesCount: number
  carsCount: number
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalGarages: number
  totalCars: number
  totalRevenue: number
  subscriptionBreakdown: {
    free: number
    starter: number
    pro: number
  }
}

export interface PaymentConfig {
  id: string
  name: string
  type: "bank_transfer" | "paypal" | "card" | "crypto"
  enabled: boolean
  config: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface AdminSettings {
  paymentConfigs: PaymentConfig[]
  systemSettings: {
    maintenanceMode: boolean
    registrationEnabled: boolean
    maxUsersPerPlan: {
      free: number
      starter: number
      pro: number
    }
  }
}
