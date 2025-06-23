"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserRole } from "@/lib/admin-firestore"
import type { UserRole } from "@/types/user-roles"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  isDemo: boolean
  userRole: UserRole | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  // Всегда используем Firebase
  const isDemo = false

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      setUserRole(null)
      return
    }

    const loadUserRole = async () => {
      try {
        const role = await getUserRole(user.uid)
        setUserRole(role)
      } catch (error) {
        console.error("Error loading user role:", error)
        setUserRole(2) // Default to free user
      }
    }

    loadUserRole()
  }, [user])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase не настроен. Проверьте конфигурацию.")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("Sign in error:", error)

      // Более понятные сообщения об ошибках
      let errorMessage = "Ошибка входа в систему"

      switch (error.code) {
        case "auth/network-request-failed":
          errorMessage = "Ошибка сети. Проверьте подключение к интернету."
          break
        case "auth/user-not-found":
          errorMessage = "Пользователь не найден"
          break
        case "auth/wrong-password":
          errorMessage = "Неверный пароль"
          break
        case "auth/invalid-email":
          errorMessage = "Неверный формат email"
          break
        case "auth/user-disabled":
          errorMessage = "Аккаунт заблокирован"
          break
        case "auth/too-many-requests":
          errorMessage = "Слишком много попыток входа. Попробуйте позже."
          break
        default:
          errorMessage = error.message || "Неизвестная ошибка"
      }

      throw new Error(errorMessage)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      throw new Error("Firebase не настроен. Проверьте конфигурацию.")
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
    } catch (error: any) {
      console.error("Sign up error:", error)

      let errorMessage = "Ошибка регистрации"

      switch (error.code) {
        case "auth/network-request-failed":
          errorMessage = "Ошибка сети. Проверьте подключение к интернету."
          break
        case "auth/email-already-in-use":
          errorMessage = "Email уже используется"
          break
        case "auth/weak-password":
          errorMessage = "Слишком слабый пароль"
          break
        case "auth/invalid-email":
          errorMessage = "Неверный формат email"
          break
        default:
          errorMessage = error.message || "Неизвестная ошибка"
      }

      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error("Firebase not configured")
    }

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    isDemo,
    userRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
