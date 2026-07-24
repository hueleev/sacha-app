import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/lib/db";
import { likes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { postId } = await request.json();

  if (!postId) {
    return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
  }

  try {
    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.userId, userId), eq(likes.postId, postId)),
    });

    if (existingLike) {
      // Unlike
      await db.delete(likes).where(eq(likes.id, existingLike.id));
      return NextResponse.json({ message: "Unliked", liked: false }, { status: 200 });
    } else {
      // Like
      await db.insert(likes).values({ userId, postId });
      return NextResponse.json({ message: "Liked", liked: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return NextResponse.json(
      { message: "Failed to toggle like", error: (error as Error).message },
      { status: 500 }
    );
  }
}