import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { adminDb } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const paymentSettings = await adminDb.collection("paymentSettings").doc("paymentSettings").get()

    if (!paymentSettings.exists) {
      return NextResponse.json({ message: "No payment settings found" }, { status: 404 })
    }

    return NextResponse.json(paymentSettings.data(), { status: 200 })
  } catch (error: any) {
    console.error("Error fetching payment settings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const paymentSettings = await request.json()

    await adminDb.collection("paymentSettings").doc("paymentSettings").set(paymentSettings)

    return NextResponse.json({ message: "Payment settings updated successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating payment settings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
