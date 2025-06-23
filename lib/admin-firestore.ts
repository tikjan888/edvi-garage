import { collection, doc, getDoc, getDocs, setDoc, updateDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { UserRole } from "@/types/user-roles"
import type { AdminUser, SystemStats, AdminSettings, PaymentConfig } from "@/types/admin"

// Проверяем, работаем ли мы в браузерной среде (v0/next-lite)
// Но если Firebase настроен - пытаемся его использовать
const useDemoMode = !isFirebaseConfigured

// Список администраторов по email
const ADMIN_EMAILS = [
  "tikjan1983@gmail.com", // Ваш email
  "admin@demo.com", // Демо админ
]

// Demo data for non-Firebase mode
const demoAdminData = {
  users: [
    {
      uid: "demo-admin",
      email: "admin@demo.com",
      displayName: "Demo Admin",
      role: 1,
      createdAt: new Date().toISOString(),
      garagesCount: 0,
      carsCount: 0,
    },
    {
      uid: "demo-user-1",
      email: "user1@demo.com",
      displayName: "Demo User 1",
      role: 2,
      createdAt: new Date().toISOString(),
      garagesCount: 1,
      carsCount: 2,
    },
    {
      uid: "demo-user-2",
      email: "user2@demo.com",
      displayName: "Demo User 2",
      role: 3,
      createdAt: new Date().toISOString(),
      garagesCount: 2,
      carsCount: 5,
    },
  ] as AdminUser[],
  stats: {
    totalUsers: 3,
    activeUsers: 2,
    totalGarages: 3,
    totalCars: 7,
    totalRevenue: 150,
    subscriptionBreakdown: {
      free: 1,
      starter: 1,
      pro: 1,
    },
  } as SystemStats,
  settings: {
    paymentConfigs: [
      {
        id: "bank-transfer",
        name: "Bank Transfer",
        type: "bank_transfer" as const,
        enabled: true,
        config: {
          bankName: "Demo Bank",
          accountNumber: "1234567890",
          routingNumber: "123456789",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "paypal",
        name: "PayPal",
        type: "paypal" as const,
        enabled: false,
        config: {
          clientId: "",
          clientSecret: "",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    systemSettings: {
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsersPerPlan: {
        free: 1000,
        starter: 500,
        pro: 100,
      },
    },
  } as AdminSettings,
}

export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()

      // Проверяем email пользователя для автоматического назначения админа
      const userEmail = userData.email
      if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        // Если пользователь в списке админов, но роль не админ - обновляем
        if (userData.role !== 1) {
          await updateDoc(doc(db, "users", userId), {
            role: 1,
            updatedAt: Timestamp.now(),
          })
          console.log(`Пользователь ${userEmail} автоматически назначен администратором`)
          return 1
        }
      }

      return userData.role || 2 // Default to free user
    }

    // Создаем документ пользователя
    const userAuth = await import("firebase/auth").then((auth) => auth.getAuth())
    const currentUser = userAuth.currentUser
    const userEmail = currentUser?.email

    // Определяем роль на основе email
    const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())
    const defaultRole: UserRole = isAdmin ? 1 : 2

    await setDoc(
      doc(db, "users", userId),
      {
        role: defaultRole,
        email: userEmail,
        displayName: currentUser?.displayName || "Unknown",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    )

    if (isAdmin) {
      console.log(`Новый администратор создан: ${userEmail}`)
    }

    return defaultRole
  } catch (error) {
    console.error("Error getting user role:", error)
    return 2
  }
}

export async function updateUserRole(userId: string, newRole: UserRole, originalRole?: UserRole): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - update local data
    const user = demoAdminData.users.find((u) => u.uid === userId)
    if (user) {
      user.role = newRole
      if (originalRole) {
        // Store original role for testing
        ;(user as any).originalRole = originalRole
      }
    }
    return
  }

  try {
    const updateData: any = {
      role: newRole,
      updatedAt: Timestamp.now(),
    }

    if (originalRole) {
      updateData.originalRole = originalRole
    }

    await updateDoc(doc(db, "users", userId), updateData)
    console.log(`Роль пользователя ${userId} изменена на ${newRole}`)
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

/**
 * Получает список всех пользователей.
 * 1. Пытаемся прочитать напрямую через клиент (если правила позволяют)
 * 2. Если получили permission-denied, делаем fetch на API-роут,
 *    где работает Firebase Admin SDK.
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  // DEMO-режим без Firebase — оставляем как было
  if (useDemoMode) {
    return demoAdminData.users
  }

  // --- 1. пробуем клиентский запрос ---
  try {
    const snap = await getDocs(collection(db, "users"))
    return await buildUserArrayFromSnapshot(snap)
  } catch (err: any) {
    // Если нет прав, пытаемся через сервер
    if (err?.code !== "permission-denied") {
      console.error("Unexpected Firestore error:", err)
      return []
    }
    console.warn("Client cannot read users, falling back to server…")
  }

  // --- 2. fallback: обращаемся к API /api/admin/users ---
  try {
    const res = await fetch("/api/admin/users")
    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const { users } = (await res.json()) as { users: AdminUser[] }
    return users
  } catch (e) {
    console.error("Error fetching users via API:", e)
    return []
  }
}

/* ------------------------------------------------------------------ */
/* ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ СОЗДАНИЯ МАССИВА ПОЛЬЗОВАТЕЛЕЙ ИЗ SNAPSHOT */
/* ------------------------------------------------------------------ */
import type { QuerySnapshot, DocumentData } from "firebase/firestore"
async function buildUserArrayFromSnapshot(snap: QuerySnapshot<DocumentData>): Promise<AdminUser[]> {
  const users: AdminUser[] = []
  for (const d of snap.docs) {
    const data = d.data()
    // безопасно пытаемся посчитать подколлекции
    let garagesCount = 0
    let carsCount = 0
    try {
      const garages = await getDocs(collection(db, "users", d.id, "garages"))
      garagesCount = garages.size
      const cars = await getDocs(collection(db, "users", d.id, "cars"))
      carsCount = cars.size
    } catch (e) {
      // Если нет доступа к подколлекциям — пропускаем
    }
    users.push({
      uid: d.id,
      email: data.email ?? "Unknown",
      displayName: data.displayName ?? "Unknown",
      role: (data.role ?? 2) as UserRole,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? "",
      garagesCount,
      carsCount,
    })
  }
  return users
}

export async function getSystemStats(): Promise<SystemStats> {
  if (useDemoMode) {
    // Demo mode
    return demoAdminData.stats
  }

  try {
    // ───── 1. Пробуем напрямую с клиента ────────────────────────────────
    const usersSnapshot = await getDocs(collection(db, "users"))
    return await buildStatsFromSnapshot(usersSnapshot)
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.error("Error getting system stats:", err)
      return emptyStats()
    }
    // ───── 2. Нет прав → обращаемся к API /api/admin/stats ───────────────
    console.warn("Client cannot read stats, falling back to server…")
    try {
      const res = await fetch("/api/admin/stats")
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const { stats } = (await res.json()) as { stats: SystemStats }
      return stats
    } catch (apiErr) {
      console.error("Error fetching stats via API:", apiErr)
      return emptyStats()
    }
  }

  /* ---------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------------- */
  function emptyStats(): SystemStats {
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalGarages: 0,
      totalCars: 0,
      totalRevenue: 0,
      subscriptionBreakdown: { free: 0, starter: 0, pro: 0 },
    }
  }

  async function buildStatsFromSnapshot(
    usersSnapshot: import("firebase/firestore").QuerySnapshot<import("firebase/firestore").DocumentData>,
  ): Promise<SystemStats> {
    let totalGarages = 0
    let totalCars = 0
    const subscriptionBreakdown = { free: 0, starter: 0, pro: 0 }

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()
      const role = userData.role || 2
      switch (role) {
        case 2:
          subscriptionBreakdown.free++
          break
        case 3:
          subscriptionBreakdown.starter++
          break
        case 4:
          subscriptionBreakdown.pro++
          break
      }

      try {
        const garagesSnapshot = await getDocs(collection(db, "users", userDoc.id, "garages"))
        const carsSnapshot = await getDocs(collection(db, "users", userDoc.id, "cars"))
        totalGarages += garagesSnapshot.size
        totalCars += carsSnapshot.size
      } catch {
        /* пропускаем если нет доступа */
      }
    }

    return {
      totalUsers: usersSnapshot.size,
      activeUsers: usersSnapshot.size, // упрощённо
      totalGarages,
      totalCars,
      totalRevenue: subscriptionBreakdown.starter * 9 + subscriptionBreakdown.pro * 19,
      subscriptionBreakdown,
    }
  }
}

export async function getAdminSettings(): Promise<AdminSettings> {
  // ───── DEMO-режим ───────────────────────────────────────────────────
  if (useDemoMode) {
    return demoAdminData.settings
  }

  // ───── 1. Пытаемся прочитать напрямую с клиента ─────────────────────
  try {
    const snap = await getDoc(doc(db, "admin", "settings"))
    if (snap.exists()) return snap.data() as AdminSettings
    // если документа нет — создаём по-старому (код ниже не меняем) …
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.error("Error getting admin settings:", err)
      return demoAdminData.settings
    }
    console.warn("Client cannot read settings, falling back to server…")
  }

  // ───── 2. Fallback: обращаемся к API /api/admin/settings ────────────
  try {
    const res = await fetch("/api/admin/settings")
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const { settings } = (await res.json()) as { settings: AdminSettings }
    return settings
  } catch (apiErr) {
    console.error("Error fetching settings via API:", apiErr)
    return demoAdminData.settings
  }
}

export async function updateAdminSettings(settings: Partial<AdminSettings>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    // Demo mode - update local data
    Object.assign(demoAdminData.settings, settings)
    console.log("✅ Демо настройки обновлены:", settings)
    return
  }

  try {
    await updateDoc(doc(db, "admin", "settings"), {
      ...settings,
      updatedAt: Timestamp.now(),
    })
  } catch (err: any) {
    if (err?.code === "permission-denied") {
      // ► fallback на сервер
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: settings }),
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      return
    }
    console.error("Error updating admin settings:", err)
    throw err
  }
}

export async function addPaymentConfig(config: Omit<PaymentConfig, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    // Demo mode
    const newConfig: PaymentConfig = {
      ...config,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    demoAdminData.settings.paymentConfigs.push(newConfig)
    return newConfig.id
  }

  try {
    const configDoc = doc(collection(db, "admin", "settings", "paymentConfigs"))
    const newConfig: PaymentConfig = {
      ...config,
      id: configDoc.id,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
    }

    await setDoc(configDoc, newConfig)
    return configDoc.id
  } catch (error) {
    console.error("Error adding payment config:", error)
    throw error
  }
}

export async function updatePaymentConfig(configId: string, updates: Partial<PaymentConfig>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    // Demo mode
    const configIndex = demoAdminData.settings.paymentConfigs.findIndex((c) => c.id === configId)
    if (configIndex !== -1) {
      Object.assign(demoAdminData.settings.paymentConfigs[configIndex], updates, {
        updatedAt: new Date().toISOString(),
      })
    }
    return
  }

  try {
    await updateDoc(doc(db, "admin", "settings", "paymentConfigs", configId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating payment config:", error)
    throw error
  }
}

// Функция для создания администратора (можно вызвать из консоли)
export async function makeUserAdmin(email: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.log("Firebase не настроен")
    return
  }

  try {
    const usersSnapshot = await getDocs(collection(db, "users"))

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()
      if (userData.email && userData.email.toLowerCase() === email.toLowerCase()) {
        await updateDoc(doc(db, "users", userDoc.id), {
          role: 1,
          updatedAt: Timestamp.now(),
        })
        console.log(`Пользователь ${email} назначен администратором`)
        return
      }
    }

    console.log(`Пользователь с email ${email} не найден`)
  } catch (error) {
    console.error("Error making user admin:", error)
  }
}
