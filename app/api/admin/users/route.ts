import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    const listUsersResult = await adminAuth.listUsers()

    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
    }))

    return NextResponse.json(users)
  } catch (error: any) {
    console.error("Error listing users:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
