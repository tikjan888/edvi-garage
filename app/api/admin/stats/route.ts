import { adminDb, adminAuth } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await adminAuth.listUsers()
    const numberOfUsers = users.users.length

    const productsSnapshot = await adminDb.collection("products").get()
    const numberOfProducts = productsSnapshot.size

    const ordersSnapshot = await adminDb.collection("orders").get()
    const numberOfOrders = ordersSnapshot.size

    return NextResponse.json({
      numberOfUsers,
      numberOfProducts,
      numberOfOrders,
    })
  } catch (error: any) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
