import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/lib/db";
import {
  posts,
  movieContents,
  bookContents,
  musicContents,
  photoContents,
  profiles,
  likes,
  bookmarks,
  follows,
  commonCodes,
  user,
} from "@/lib/schema";
import { eq, sql, and, or, desc, inArray, ne, SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "tastopia";
  const rating = searchParams.get("rating") || "all";
  const type = searchParams.get("type") || "all";

  try {
    const likesCountSubquery = db
      .select({
        postId: likes.postId,
        count: sql<number>`count(${likes.id})`.as("likes_count"),
      })
      .from(likes)
      .groupBy(likes.postId)
      .as("likes_count_sq");

    const userLikes = alias(likes, "user_likes");
    const userFollows = alias(follows, "user_follows");
    const userBookmarks = alias(bookmarks, "user_bookmarks");

    let query = db
      .select({
        id: posts.id,
        comment: posts.comment,
        rating: posts.rating,
        createdAt: posts.createdAt,
        userId: posts.userId,
        userNickname: profiles.nickname,
        userProfileImage: user.image,
        type: commonCodes.code,
        title:
          sql<string>`coalesce(${movieContents.title}, ${bookContents.title}, ${musicContents.title}, ${photoContents.title})`.as(
            "title"
          ),
        image:
          sql<string>`coalesce(${movieContents.image}, ${bookContents.image}, ${musicContents.image}, ${photoContents.image})`.as(
            "image"
          ),
        author:
          sql<string>`coalesce(${movieContents.director}, ${bookContents.author}, ${musicContents.artist})`.as(
            "author"
          ),
        releaseYear:
          sql<number>`coalesce(${movieContents.releaseYear}, ${bookContents.publicationYear}, ${musicContents.releaseYear})`.as(
            "releaseYear"
          ),
        isLiked: sql<boolean>`${userLikes.id} IS NOT NULL`.as("isLiked"),
        isBookmarked: sql<boolean>`${userBookmarks.id} IS NOT NULL`.as(
          "isBookmarked"
        ),
        isFollowing: sql<boolean>`${userFollows.id} IS NOT NULL`.as(
          "isFollowing"
        ),
        likesCount: sql<number>`coalesce(${likesCountSubquery.count}, 0)`.as(
          "likesCount"
        ),
      })
      .from(posts)
      .leftJoin(movieContents, eq(posts.movieContentId, movieContents.id))
      .leftJoin(bookContents, eq(posts.bookContentId, bookContents.id))
      .leftJoin(musicContents, eq(posts.musicContentId, musicContents.id))
      .leftJoin(photoContents, eq(posts.photoContentId, photoContents.id))
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .leftJoin(user, eq(posts.userId, user.id))
      .leftJoin(commonCodes, eq(posts.contentTypeId, commonCodes.id))
      .leftJoin(likesCountSubquery, eq(posts.id, likesCountSubquery.postId))
      .leftJoin(
        userLikes,
        and(eq(userLikes.postId, posts.id), eq(userLikes.userId, currentUserId))
      )
      .leftJoin(
        userFollows,
        and(
          eq(userFollows.followerId, currentUserId),
          eq(userFollows.followingId, posts.userId)
        )
      )
      .leftJoin(
        userBookmarks,
        and(
          eq(userBookmarks.userId, currentUserId),
          or(
            eq(userBookmarks.musicContentId, posts.musicContentId),
            eq(userBookmarks.movieContentId, posts.movieContentId),
            eq(userBookmarks.bookContentId, posts.bookContentId),
            eq(userBookmarks.photoContentId, posts.photoContentId)
          )
        )
      )
      .orderBy(desc(posts.createdAt))
      .$dynamic();

    const whereConditions: (SQL | undefined)[] = [];

    switch (tab) {
      case "moimoi":
        whereConditions.push(eq(posts.userId, currentUserId));
        break;
      case "favfolk":
        const followedUsers = db
          .select({ followingId: follows.followingId })
          .from(follows)
          .where(eq(follows.followerId, currentUserId));
        whereConditions.push(
          and(
            inArray(posts.userId, followedUsers),
            ne(posts.userId, currentUserId)
          )
        );
        break;
      case "zzimzzim":
        whereConditions.push(sql`${userBookmarks.id} IS NOT NULL`);
        break;
      case "tastopia":
      default:
        break;
    }

    if (rating !== "all") {
      whereConditions.push(eq(posts.rating, Number(rating)));
    }

    if (type !== "all") {
      whereConditions.push(eq(commonCodes.code, type));
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    const allPosts = await query;

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", error: (error as Error).message },
      { status: 500 }
    );
  }
}