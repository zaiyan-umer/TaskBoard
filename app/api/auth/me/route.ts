import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/db"
import User from "@/models/user"
import { getUserIdByCookies } from "@/controllers/helpers"

export async function GET() {
  try {
    const userId = await getUserIdByCookies()
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch current user", error)
    const message = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ message }, { status: 500 })
  }
}
