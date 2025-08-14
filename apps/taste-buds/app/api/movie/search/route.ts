import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  // IMPORTANT: User must add this to their .env or .env.local file
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY environment variable not set');
    return NextResponse.json({ message: 'TMDB API key is not configured on the server' }, { status: 500 });
  }

  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ko-KR&page=1`;

  try {
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      console.error(`TMDb search API request failed: ${searchResponse.statusText}`);
      return NextResponse.json({ message: 'Failed to fetch from TMDb API' }, { status: searchResponse.status });
    }
    const searchData = await searchResponse.json();

    // Get details for each movie to find the director
    const movies = await Promise.all(
      searchData.results.slice(0, 10).map(async (movie: any) => {
        const creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=ko-KR`;
        let directorName = '정보 없음';
        try {
            const creditsResponse = await fetch(creditsUrl);
            if (creditsResponse.ok) {
                const creditsData = await creditsResponse.json();
                const director = creditsData.crew.find((person: any) => person.job === 'Director');
                if (director) {
                    directorName = director.name;
                }
            }
        } catch (e) {
            // Could fail for a single movie, don't let it stop the whole process
            console.error(`Could not fetch credits for movie ID ${movie.id}`, e);
        }

        return {
          id: movie.id,
          title: movie.title,
          director: directorName,
          releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : undefined,
          image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
          source: 'api',
          source_id: movie.id.toString(),
        };
      })
    );

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Movie search API route error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
