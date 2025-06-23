import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Инициализация Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Получаем ключ из переменной окружения
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

    if (!serviceAccountKey) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY не найден в переменных окружения")
    }

    // Парсим JSON ключ
    const serviceAccount = JSON.parse(serviceAccountKey)

    // Инициализируем приложение с сертификатом
    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    })

    console.log("✅ Firebase Admin SDK инициализирован")
    return app
  } catch (error) {
    console.error("❌ Ошибка инициализации Firebase Admin SDK:", error)
    throw error
  }
}

// Экспортируем инстансы
export const adminApp = initializeFirebaseAdmin()
export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
