import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/lib/db";
import { bookmarks, posts, commonCodes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { postId } = await request.json();

  if (!postId) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch post details to get content type and content ID
    const postDetails = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        contentType: true,
      },
    });

    if (!postDetails || !postDetails.contentType) {
      return NextResponse.json(
        { message: "Post not found or content type missing" },
        { status: 404 }
      );
    }

    const contentTypeId = postDetails.contentTypeId;
    const contentTypeCode = postDetails.contentType.code;

    let contentId: string | null = null;
    switch (contentTypeCode) {
      case "movie":
        contentId = postDetails.movieContentId;
        break;
      case "book":
        contentId = postDetails.bookContentId;
        break;
      case "music":
        contentId = postDetails.musicContentId;
        break;
      case "photo":
        contentId = postDetails.photoContentId;
        break;
    }

    if (!contentId) {
      return NextResponse.json(
        { message: "Content ID not found for post" },
        { status: 400 }
      );
    }

    // Check for existing bookmark
    const existingBookmark = await db.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.contentTypeId, contentTypeId ?? ""),
        contentTypeCode === "movie"
          ? eq(bookmarks.movieContentId, contentId)
          : undefined,
        contentTypeCode === "book"
          ? eq(bookmarks.bookContentId, contentId)
          : undefined,
        contentTypeCode === "music"
          ? eq(bookmarks.musicContentId, contentId)
          : undefined,
        contentTypeCode === "photo"
          ? eq(bookmarks.photoContentId, contentId)
          : undefined
      ),
    });

    if (existingBookmark) {
      // Unbookmark
      await db.delete(bookmarks).where(eq(bookmarks.id, existingBookmark.id));
      return NextResponse.json(
        { message: "Unbookmarked", bookmarked: false },
        { status: 200 }
      );
    } else {
      // Bookmark
      const bookmarkValues: any = { userId, contentTypeId };
      switch (contentTypeCode) {
        case "movie":
          bookmarkValues.movieContentId = contentId;
          break;
        case "book":
          bookmarkValues.bookContentId = contentId;
          break;
        case "music":
          bookmarkValues.musicContentId = contentId;
          break;
        case "photo":
          bookmarkValues.photoContentId = contentId;
          break;
      }
      await db.insert(bookmarks).values(bookmarkValues);
      return NextResponse.json(
        { message: "Bookmarked", bookmarked: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    return NextResponse.json(
      { message: "Failed to toggle bookmark", error: (error as Error).message },
      { status: 500 }
    );
  }
}
