import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { firebaseConfig, enableFirebase } from "./firebase-config"

// Проверяем наличие всех необходимых переменных окружения
const hasValidEnvVars = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
)

// Используем Firebase конфигурацию из файла или переменных окружения
const config = enableFirebase
  ? firebaseConfig
  : {
      apiKey: "AIzaSyCa3GoeR5S5a6wjBJ9riu7OiK_1pCrRTsU",
  authDomain: "edvi-garage.firebaseapp.com",
  projectId: "edvi-garage",
  storageBucket: "edvi-garage.firebasestorage.app",
  messagingSenderId: "128859648999",
  appId: "1:128859648999:web:6434c3f85ba95fa31e8342",
    }

// Всегда используем Firebase
export const isFirebaseConfigured = true

// Initialize Firebase
const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth(app)

console.log("Firebase initialized successfully")

export { db, auth }
export default app
