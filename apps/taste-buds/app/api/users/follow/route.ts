import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/lib/db";
import { follows } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const followerId = session.user.id;
  const { targetUserId } = await request.json(); // The user to follow/unfollow

  if (!targetUserId) {
    return NextResponse.json({ message: "Target user ID is required" }, { status: 400 });
  }

  if (followerId === targetUserId) {
    return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });
  }

  try {
    const existingFollow = await db.query.follows.findFirst({
      where: and(eq(follows.followerId, followerId), eq(follows.followingId, targetUserId)),
    });

    if (existingFollow) {
      // Unfollow
      await db.delete(follows).where(eq(follows.id, existingFollow.id));
      return NextResponse.json({ message: "Unfollowed", followed: false }, { status: 200 });
    } else {
      // Follow
      await db.insert(follows).values({ followerId, followingId: targetUserId });
      return NextResponse.json({ message: "Followed", followed: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to toggle follow:", error);
    return NextResponse.json(
      { message: "Failed to toggle follow", error: (error as Error).message },
      { status: 500 }
    );
  }
}