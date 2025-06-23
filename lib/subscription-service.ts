import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { UserSubscription } from "@/types/subscription"

// Локальное хранение для демо-режима
const DEMO_SUBSCRIPTION_KEY = "demo-subscription"

export class SubscriptionService {
  // Получить подписку пользователя
  static async getUserSubscription(userId: string): Promise<UserSubscription> {
    if (!isFirebaseConfigured || !db) {
      // Демо-режим - используем localStorage
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(DEMO_SUBSCRIPTION_KEY)
        if (saved) {
          return JSON.parse(saved)
        }
      }

      // По умолчанию Pro для демо
      const defaultSub: UserSubscription = {
        planType: "pro",
        status: "active",
        usage: {
          garagesCount: 0,
          carsCount: 0,
          partnersCount: 0,
        },
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_SUBSCRIPTION_KEY, JSON.stringify(defaultSub))
      }

      return defaultSub
    }

    // Firebase режим
    const subscriptionRef = doc(db, "users", userId, "subscription", "current")
    const docSnap = await getDoc(subscriptionRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserSubscription
    } else {
      // Создаем новую подписку
      const newSub: UserSubscription = {
        planType: "free",
        status: "active",
        usage: {
          garagesCount: 0,
          carsCount: 0,
          partnersCount: 0,
        },
      }

      await setDoc(subscriptionRef, newSub)
      return newSub
    }
  }

  // Обновить подписку
  static async updateSubscription(userId: string, updates: Partial<UserSubscription>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      // Демо-режим
      if (typeof window !== "undefined") {
        const current = await this.getUserSubscription(userId)
        const updated = { ...current, ...updates }
        localStorage.setItem(DEMO_SUBSCRIPTION_KEY, JSON.stringify(updated))
      }
      return
    }

    // Firebase режим
    const subscriptionRef = doc(db, "users", userId, "subscription", "current")
    await updateDoc(subscriptionRef, updates)
  }

  // Подписаться на изменения подписки
  static subscribeToSubscription(userId: string, callback: (subscription: UserSubscription) => void) {
    if (!isFirebaseConfigured || !db) {
      // Демо-режим - возвращаем текущую подписку
      this.getUserSubscription(userId).then(callback)
      return () => {} // Пустая функция отписки
    }

    // Firebase режим
    const subscriptionRef = doc(db, "users", userId, "subscription", "current")
    return onSnapshot(subscriptionRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as UserSubscription)
      } else {
        // Создаем новую подписку если не существует
        const newSub: UserSubscription = {
          planType: "free",
          status: "active",
          usage: {
            garagesCount: 0,
            carsCount: 0,
            partnersCount: 0,
          },
        }
        setDoc(subscriptionRef, newSub)
        callback(newSub)
      }
    })
  }

  // Обновить до Pro (для демо)
  static async upgradeToProDemo(userId: string): Promise<void> {
    const proSub: UserSubscription = {
      planType: "pro",
      status: "active",
      usage: {
        garagesCount: 0,
        carsCount: 0,
        partnersCount: 0,
      },
    }

    if (!isFirebaseConfigured || !db) {
      // Демо-режим
      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_SUBSCRIPTION_KEY, JSON.stringify(proSub))
        console.log("✅ Обновлено до Pro в демо-режиме")
      }
    } else {
      // Firebase режим
      await this.updateSubscription(userId, proSub)
      console.log("✅ Обновлено до Pro в Firebase")
    }
  }
}
