import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db, isFirebaseConfigured } from "./firebase"

export async function createDemoAdmin() {
  if (!isFirebaseConfigured || !auth || !db) {
    console.log("Demo mode: Admin user already exists")
    return
  }

  const adminEmail = "admin@demo.com"
  const adminPassword = "admin123"

  try {
    // Try to create admin user
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)

    // Set admin role in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      role: 1, // Admin role
      email: adminEmail,
      displayName: "Demo Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Demo admin user created successfully")
    return userCredential.user
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      console.log("Demo admin user already exists")
      // Try to sign in instead
      try {
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
        return userCredential.user
      } catch (signInError) {
        console.error("Error signing in demo admin:", signInError)
      }
    } else {
      console.error("Error creating demo admin:", error)
    }
  }
}

// Call this function on app initialization if needed
if (typeof window !== "undefined") {
  // Only run in browser environment
  setTimeout(() => {
    createDemoAdmin().catch(console.error)
  }, 1000)
}
