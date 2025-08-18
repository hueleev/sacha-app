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
} from "@/lib/schema";
import { eq, sql, and, or, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;

  try {
    const allPosts = await db
      .select({
        post: posts,
        movie: movieContents,
        book: bookContents,
        music: musicContents,
        photo: photoContents,
        profile: profiles,
        contentType: commonCodes,
        isLiked:
          sql<boolean>`CASE WHEN ${likes.userId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
            "isLiked"
          ),
        isBookmarked:
          sql<boolean>`CASE WHEN ${bookmarks.userId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
            "isBookmarked"
          ),
        isFollowing:
          sql<boolean>`CASE WHEN ${follows.followerId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
            "isisFollowing"
          ),
        likesCount: sql<number>`count(${likes.id})`.as("likesCount"),
      })
      .from(posts)
      .leftJoin(movieContents, eq(posts.movieContentId, movieContents.id))
      .leftJoin(bookContents, eq(posts.bookContentId, bookContents.id))
      .leftJoin(musicContents, eq(posts.musicContentId, musicContents.id))
      .leftJoin(photoContents, eq(posts.photoContentId, photoContents.id))
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .leftJoin(commonCodes, eq(posts.contentTypeId, commonCodes.id))
      .leftJoin(
        likes,
        and(eq(likes.postId, posts.id), eq(likes.userId, currentUserId))
      )
      .leftJoin(
        bookmarks,
        and(
          eq(bookmarks.userId, currentUserId),
          or(
            and(
              eq(bookmarks.musicContentId, posts.musicContentId),
              eq(commonCodes.code, "music")
            ),
            and(
              eq(bookmarks.movieContentId, posts.movieContentId),
              eq(commonCodes.code, "movie")
            ),
            and(
              eq(bookmarks.bookContentId, posts.bookContentId),
              eq(commonCodes.code, "book")
            ),
            and(
              eq(bookmarks.photoContentId, posts.photoContentId),
              eq(commonCodes.code, "photo")
            )
          )
        )
      )
      .leftJoin(
        follows,
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, posts.userId)
        )
      )
      .groupBy(
        posts.id,
        movieContents.id,
        bookContents.id,
        musicContents.id,
        photoContents.id,
        profiles.id,
        commonCodes.id,
        likes.userId,
        bookmarks.userId,
        follows.followerId
      )
      .orderBy(desc(posts.createdAt)); // Order by newest first

    const formattedPosts = allPosts.map((row) => {
      const {
        post,
        movie,
        book,
        music,
        photo,
        profile,
        contentType,
        isLiked,
        isBookmarked,
        isFollowing,
        likesCount,
      } = row;

      let content: any = null;
      let type: string = "";
      let imageUrl: string | null = null;
      let mainAuthor: string | null = null;
      let releaseYear: number | null = null;

      if (contentType) {
        type = contentType.code;
        switch (contentType.code) {
          case "movie":
            content = movie;
            imageUrl = movie?.image || null;
            mainAuthor = movie?.director || null;
            releaseYear = movie?.releaseYear || null;
            break;
          case "book":
            content = book;
            imageUrl = book?.image || null;
            mainAuthor = book?.author || null;
            releaseYear = book?.publicationYear || null;
            break;
          case "music":
            content = music;
            imageUrl = music?.image || null;
            mainAuthor = music?.artist || null;
            releaseYear = music?.releaseYear || null;
            break;
          case "photo":
            content = photo;
            imageUrl = photo?.image || null;
            mainAuthor = profile?.nickname || null; // Photo author is the user
            break;
        }
      }

      return {
        id: post.id,
        comment: post.comment,
        rating: post.rating,
        createdAt: post.createdAt?.toISOString(),
        userId: post.userId,
        userNickname: profile?.nickname || "Unknown",
        userProfileImage: profile?.bio || null, // Assuming bio might store profile image URL, or add a new column
        type: type,
        title: content?.title || "Untitled",
        image: imageUrl,
        author: mainAuthor,
        releaseYear: releaseYear,
        isLiked: isLiked,
        isBookmarked: isBookmarked,
        isFollowing: isFollowing,
        likesCount: likesCount,
      };
    });

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", error: (error as Error).message },
      { status: 500 }
    );
  }
}
