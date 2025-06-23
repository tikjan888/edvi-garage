"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import {
  getUserRole,
  updateUserRole,
  getAllUsers,
  getSystemStats,
  getAdminSettings,
  updateAdminSettings,
} from "@/lib/admin-firestore"
import type { UserRole } from "@/types/user-roles"
import type { AdminUser, SystemStats, AdminSettings } from "@/types/admin"

interface AdminContextType {
  userRole: UserRole | null
  isAdmin: boolean
  loading: boolean
  users: AdminUser[]
  systemStats: SystemStats | null
  adminSettings: AdminSettings | null

  // Actions
  changeUserRole: (userId: string, newRole: UserRole) => Promise<void>
  refreshUsers: () => Promise<void>
  refreshStats: () => Promise<void>
  updateSettings: (settings: Partial<AdminSettings>) => Promise<void>
  testUserRole: (userId: string, testRole: UserRole) => Promise<void>
  restoreUserRole: (userId: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null)

  // Добавить отладочное логирование
  console.log("🔍 AdminProvider - Environment check:", {
    hasWindow: typeof window !== "undefined",
    hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    user: user?.email,
    userRole,
  })

  const isAdmin = userRole === 1

  // Load user role
  useEffect(() => {
    if (!user) {
      setUserRole(null)
      setLoading(false)
      return
    }

    const loadUserRole = async () => {
      try {
        const role = await getUserRole(user.uid)
        setUserRole(role)
      } catch (error) {
        console.error("Error loading user role:", error)
        setUserRole(2) // Default to free user
      } finally {
        setLoading(false)
      }
    }

    loadUserRole()
  }, [user])

  // Load admin data if user is admin
  useEffect(() => {
    if (!isAdmin) return

    const loadAdminData = async () => {
      try {
        await Promise.all([refreshUsers(), refreshStats(), loadAdminSettings()])
      } catch (error) {
        console.error("Error loading admin data:", error)
      }
    }

    loadAdminData()
  }, [isAdmin])

  const changeUserRole = async (userId: string, newRole: UserRole) => {
    if (!isAdmin) throw new Error("Unauthorized")

    try {
      await updateUserRole(userId, newRole)
      await refreshUsers()
    } catch (error) {
      console.error("Error changing user role:", error)
      throw error
    }
  }

  const refreshUsers = async () => {
    if (!isAdmin) return

    try {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      console.error("Error refreshing users:", error)
    }
  }

  const refreshStats = async () => {
    if (!isAdmin) return

    try {
      const stats = await getSystemStats()
      setSystemStats(stats)
    } catch (error) {
      console.error("Error refreshing stats:", error)
    }
  }

  const loadAdminSettings = async () => {
    if (!isAdmin) return

    try {
      const settings = await getAdminSettings()
      setAdminSettings(settings)
    } catch (error) {
      console.error("Error loading admin settings:", error)
    }
  }

  const updateSettings = async (settings: Partial<AdminSettings>) => {
    if (!isAdmin) throw new Error("Unauthorized")

    try {
      await updateAdminSettings(settings)
      await loadAdminSettings()
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  }

  const testUserRole = async (userId: string, testRole: UserRole) => {
    if (!isAdmin) throw new Error("Unauthorized")

    try {
      // Store original role in a separate field for restoration
      const user = users.find((u) => u.uid === userId)
      if (user) {
        await updateUserRole(userId, testRole, user.role)
        await refreshUsers()
      }
    } catch (error) {
      console.error("Error testing user role:", error)
      throw error
    }
  }

  const restoreUserRole = async (userId: string) => {
    if (!isAdmin) throw new Error("Unauthorized")

    try {
      // This would restore from the stored original role
      await updateUserRole(userId, 2) // Default restore to free for now
      await refreshUsers()
    } catch (error) {
      console.error("Error restoring user role:", error)
      throw error
    }
  }

  const value = {
    userRole,
    isAdmin,
    loading,
    users,
    systemStats,
    adminSettings,
    changeUserRole,
    refreshUsers,
    refreshStats,
    updateSettings,
    testUserRole,
    restoreUserRole,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
