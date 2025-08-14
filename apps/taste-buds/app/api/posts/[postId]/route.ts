import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const postId = params.postId;

  if (!postId) {
    return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
  }

  try {
    // Verify that the user owns the post
    const postToDelete = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!postToDelete) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (postToDelete.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { message: "Failed to delete post", error: (error as Error).message },
      { status: 500 }
    );
  }
}