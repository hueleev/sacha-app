import { NextResponse } from "next/server";

// Type for Naver API book item
interface NaverBookItem {
  title: string;
  link: string;
  image: string;
  author: string;
  price: string;
  discount: string;
  publisher: string;
  pubdate: string; // "20221006"
  isbn: string;
  description: string;
}

// Type for our standardized search result
interface BookSearchResult {
  id: string; // Using ISBN as a unique ID
  title: string;
  author: string;
  publication_year?: number;
  image: string;
  source: "api";
  sourceId: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { message: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Naver API credentials are not set in .env file");
    return NextResponse.json(
      { message: "서버 설정 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
        query
      )}&display=20`,
      {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Naver API error:", errorBody);
      throw new Error("네이버 책 검색 API 호출에 실패했습니다.");
    }

    const data = await response.json();

    const results: BookSearchResult[] = data.items.map(
      (item: NaverBookItem) => {
        // Clean up title and author from HTML tags
        const title = item.title.replace(/<[^>]*>?/gm, "");
        const author = item.author.replace(/<[^>]*>?/gm, "");
        
        return {
          id: item.isbn,
          sourceId: item.isbn,
          source: "api",
          title,
          author,
          publication_year: item.pubdate
            ? parseInt(item.pubdate.substring(0, 4), 10)
            : undefined,
          image: item.image,
        };
      }
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch books from Naver API:", error);
    const message =
      error instanceof Error ? error.message : "책 검색 중 알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ message }, { status: 500 });
  }
}