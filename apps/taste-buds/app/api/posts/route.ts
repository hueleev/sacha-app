import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/lib/db";
import { movieContents, posts, commonCodes, bookContents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();

  const {
    tasteType,
    searchType,
    title,
    artistDirectorAuthor, // director for movie
    year,
    imageUrl,
    comment,
    rating,
    photoFile, // base64 string for photo
    sourceId: apiSourceId, // sourceId from API search result
  } = body;

  try {
    let contentId: string | undefined;
    let contentTypeCode: string;
    let postRating: number | null = rating ? parseInt(rating, 10) : null;

    // Determine content type code and handle content insertion
    switch (tasteType) {
      case "movie":
        contentTypeCode = "movie";
        let movieSource = searchType === "search" ? "api" : "manual";
        let movieSourceId =
          searchType === "search" ? apiSourceId : `taste-${uuidv4()}`;
        let movieReleaseYear = year ? parseInt(year, 10) : null;

        // Check if movie content already exists
        let existingMovie = await db.query.movieContents.findFirst({
          where: eq(movieContents.sourceId, movieSourceId),
        });

        if (existingMovie) {
          contentId = existingMovie.id;
        } else {
          const [newMovie] = await db
            .insert(movieContents)
            .values({
              title,
              director: artistDirectorAuthor,
              releaseYear: movieReleaseYear,
              image: imageUrl,
              source: movieSource,
              sourceId: movieSourceId,
            })
            .returning();
          if (newMovie) {
            contentId = newMovie.id;
          }
        }
        break;
      case "music":
        contentTypeCode = "music";
        // TODO: Implement music content insertion
        return NextResponse.json(
          { message: "Music taste type not yet implemented" },
          { status: 501 }
        );
      case "book":
        contentTypeCode = "book";
        let bookSource = searchType === "search" ? "api" : "manual";
        let bookSourceId =
          searchType === "search" ? apiSourceId : `taste-${uuidv4()}`;
        let bookPublicationYear = year ? parseInt(year, 10) : null;

        // Check if book content already exists
        let existingBook = await db.query.bookContents.findFirst({
          where: eq(bookContents.sourceId, bookSourceId),
        });

        if (existingBook) {
          contentId = existingBook.id;
        } else {
          const [newBook] = await db
            .insert(bookContents)
            .values({
              title,
              author: artistDirectorAuthor,
              publicationYear: bookPublicationYear,
              image: imageUrl,
              source: bookSource,
              sourceId: bookSourceId,
            })
            .returning();
          if (newBook) contentId = newBook.id;
        }
        break;
      case "photo":
        contentTypeCode = "photo";
        // TODO: Implement photo content insertion
        return NextResponse.json(
          { message: "Photo taste type not yet implemented" },
          { status: 501 }
        );
      default:
        return NextResponse.json(
          { message: "Invalid taste type" },
          { status: 400 }
        );
    }

    // Get contentTypeId from common_codes
    const commonCode = await db.query.commonCodes.findFirst({
      where: eq(commonCodes.code, contentTypeCode),
    });

    if (!commonCode) {
      return NextResponse.json(
        {
          message: `Common code for ${contentTypeCode} not found. Please ensure common_codes table is populated.`,
        },
        { status: 500 }
      );
    }

    const contentTypeId = commonCode.id;

    // Insert into posts table
    await db.insert(posts).values({
      userId: userId,
      contentTypeId: contentTypeId,
      movieContentId: tasteType === "movie" ? contentId : null,
      musicContentId: tasteType === "music" ? contentId : null,
      bookContentId: tasteType === "book" ? contentId : null,
      photoContentId: tasteType === "photo" ? contentId : null,
      comment: comment,
      rating: postRating,
    });

    return NextResponse.json(
      { message: "Taste added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to add taste:", error);
    return NextResponse.json(
      { message: "Failed to add taste", error: (error as Error).message },
      { status: 500 }
    );
  }
}
