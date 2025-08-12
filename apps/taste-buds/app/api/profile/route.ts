import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { profiles, user } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, image, nickname, bio } = body

    if (!nickname || !name) {
      return NextResponse.json({ message: "Name and nickname are required" }, { status: 400 })
    }

    await db.transaction(async (tx) => {
      // 1. Update user table
      await tx
        .update(user)
        .set({ name, image })
        .where(eq(user.id, session.user.id))

      // 2. Create profile
      await tx.insert(profiles).values({
        userId: session.user.id,
        nickname,
        bio,
      })
    })

    return NextResponse.json({ message: "Profile created successfully" }, { status: 201 })

  } catch (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, image, nickname, bio } = body

    if (!nickname || !name) {
      return NextResponse.json({ message: "Name and nickname are required" }, { status: 400 })
    }

    await db.transaction(async (tx) => {
      // 1. Update user table
      await tx
        .update(user)
        .set({ name, image })
        .where(eq(user.id, session.user.id))

      // 2. Update profiles table
      await tx
        .update(profiles)
        .set({ nickname, bio })
        .where(eq(profiles.userId, session.user.id))
    })

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    })

    if (userProfile) {
      return NextResponse.json({ hasProfile: true, profile: userProfile }, { status: 200 })
    } else {
      return NextResponse.json({ hasProfile: false }, { status: 200 })
    }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
