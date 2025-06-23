export type UserRole = 1 | 2 | 3 | 4

export interface UserRoleInfo {
  roleName: string
  displayName: string
  subscriptionType: "free" | "starter" | "pro"
  permissions: string[]
  limits: {
    garages: number
    cars: number
    features: string[]
  }
}

export const USER_ROLES: Record<UserRole, UserRoleInfo> = {
  1: {
    roleName: "Admin",
    displayName: "Администратор",
    subscriptionType: "pro", // Админ = Pro доступ
    permissions: ["all"],
    limits: {
      garages: -1, // unlimited
      cars: -1, // unlimited
      features: ["admin_panel", "all_features"],
    },
  },
  2: {
    roleName: "Free",
    displayName: "Бесплатный",
    subscriptionType: "free",
    permissions: ["basic"],
    limits: {
      garages: 1,
      cars: 3,
      features: ["basic_tracking"],
    },
  },
  3: {
    roleName: "Starter",
    displayName: "Стартер",
    subscriptionType: "starter",
    permissions: ["basic", "advanced"],
    limits: {
      garages: 3,
      cars: 10,
      features: ["basic_tracking", "excel_export", "email_notifications"],
    },
  },
  4: {
    roleName: "Pro",
    displayName: "Профессиональный",
    subscriptionType: "pro",
    permissions: ["basic", "advanced", "premium"],
    limits: {
      garages: -1, // unlimited
      cars: -1, // unlimited
      features: [
        "basic_tracking",
        "excel_export",
        "pdf_export",
        "email_notifications",
        "detailed_analytics",
        "cloud_backup",
        "priority_support",
        "api_access",
        "email_invitations",
      ],
    },
  },
}

// Функция для проверки является ли пользователь админом
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 1
}

// Функция для проверки разрешений
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const roleInfo = USER_ROLES[userRole]
  if (!roleInfo) return false

  return roleInfo.permissions.includes("all") || roleInfo.permissions.includes(permission)
}

// Функция для проверки лимитов
export function isWithinLimit(userRole: UserRole, type: "garages" | "cars", currentCount: number): boolean {
  const roleInfo = USER_ROLES[userRole]
  if (!roleInfo) return false

  const limit = roleInfo.limits[type]
  return limit === -1 || currentCount < limit
}

// Функция для проверки доступности функции
export function hasFeature(userRole: UserRole, feature: string): boolean {
  const roleInfo = USER_ROLES[userRole]
  if (!roleInfo) return false

  return roleInfo.limits.features.includes("all_features") || roleInfo.limits.features.includes(feature)
}

// Функция для проверки Pro доступа (включая админа)
export function hasProAccess(userRole: UserRole): boolean {
  return userRole === 1 || userRole === 4 // Admin или Pro
}

// Функция для проверки Starter+ доступа (включая админа)
export function hasStarterAccess(userRole: UserRole): boolean {
  return userRole === 1 || userRole === 3 || userRole === 4 // Admin, Starter или Pro
}
