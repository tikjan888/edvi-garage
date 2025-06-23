import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { initFirebaseAdmin } from "@/lib/firebase-admin"
import type { AdminSettings } from "@/types/admin"

initFirebaseAdmin()
const db = getFirestore()

// ---------- GET  /api/admin/settings  -------------------------------
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!(await isAdmin(token))) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const snap = await db.doc("admin/settings").get()
  const settings = snap.exists ? (snap.data() as AdminSettings) : {}
  return NextResponse.json({ settings })
}

// ---------- POST /api/admin/settings  (partial update) --------------
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!(await isAdmin(token))) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { updates } = (await req.json()) as { updates: Partial<AdminSettings> }
  await db.doc("admin/settings").set(
    {
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  return NextResponse.json({ ok: true })
}

// ---------- helper ---------------------------------------------------
async function isAdmin(idToken?: string | null) {
  if (!idToken) return false
  try {
    const decoded = await getAuth().verifyIdToken(idToken)
    return decoded.role === 1
  } catch {
    return false
  }
}
