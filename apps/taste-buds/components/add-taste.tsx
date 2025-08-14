"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Film, Book, Headphones, Camera, Star, ArrowLeft } from "lucide-react";

// Define types for our data to ensure consistency
interface TasteBase {
  type: "movie" | "book" | "music" | "photo";
  title: string;
  description: string;
  image: string; // URL from API/manual input, or base64 from file upload
}

interface RatedTaste extends TasteBase {
  rating: number;
}

interface MovieTaste extends RatedTaste {
  type: "movie";
  director: string;
  releaseYear?: number;
}

interface BookTaste extends RatedTaste {
  type: "book";
  author: string;
  releaseYear?: number;
}

interface MusicTaste extends RatedTaste {
  type: "music";
  artist: string;
  releaseYear?: number;
}

interface PhotoTaste extends TasteBase {
  type: "photo";
  rating?: undefined; // Photos don't have ratings
}

type Taste = MovieTaste | BookTaste | MusicTaste | PhotoTaste;

interface AddTasteProps {
  onCancel: () => void;
}

// Type for TMDB search results
interface MovieSearchResult {
  id: number;
  title: string;
  director: string;
  releaseYear?: number;
  image: string;
  source: "api";
  sourceId: string;
}

export default function AddTaste({ onCancel }: AddTasteProps) {
  const [selectedType, setSelectedType] = useState<
    "movie" | "book" | "music" | "photo" | null
  >(null);
  const [inputMode, setInputMode] = useState<"search" | "manual" | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(""); // Can be URL or base64
  const [artist, setArtist] = useState("");
  const [director, setDirector] = useState("");
  const [author, setAuthor] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | undefined>(undefined);

  // Movie search specific state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  const types = [
    { id: "movie", name: "영화", icon: Film },
    { id: "book", name: "책", icon: Book },
    { id: "music", name: "음악", icon: Headphones },
    { id: "photo", name: "사진", icon: Camera },
  ];

  // Reset all state when changing taste type or input mode
  useEffect(() => {
    setInputMode(null);
    setTitle("");
    setDescription("");
    setRating(0);
    setImage("");
    setArtist("");
    setDirector("");
    setAuthor("");
    setReleaseYear(undefined);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMovie(null);
    setIsSearching(false);
  }, [selectedType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // base64
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleMovieSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await fetch(
        `/api/movie/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("영화 검색 API 호출에 실패했습니다.");
      }
      const data: MovieSearchResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      alert(
        error instanceof Error
          ? error.message
          : "영화 검색 중 오류가 발생했습니다."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    setTitle(movie.title);
    setDirector(movie.director);
    setReleaseYear(movie.releaseYear);
    setImage(movie.image);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType) return;

    // Validation
    if (!title || !description) {
      alert("제목과 후기는 필수 항목입니다.");
      return;
    }
    if (selectedType !== "photo" && rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    let postData: any = {
      tasteType: selectedType,
      title: title,
      comment: description, // Renamed from description to comment for API
      rating: selectedType !== "photo" ? rating : null,
      imageUrl: image, // Renamed from image to imageUrl for API
      searchType: inputMode, // 'search' or 'manual'
    };

    if (selectedType === "movie") {
      postData.artistDirectorAuthor = director; // director for movie
      postData.year = releaseYear ? releaseYear.toString() : null;
      if (inputMode === "search" && selectedMovie) {
        postData.sourceId = selectedMovie.id; // Pass sourceId from selected movie
      }
    }
    // TODO: Add logic for other types (music, book, photo)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("취향이 성공적으로 등록되었습니다!");
        onCancel(); // Close the form or dialog
      } else {
        const errorData = await response.json();
        alert(
          `취향 등록에 실패했습니다: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Failed to submit taste:", error);
      alert("취향 등록 중 오류가 발생했습니다.");
    }
  };

  const renderMovieInputs = () => (
    <>
      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">입력 방식 선택</label>
        <div className="grid grid-cols-2 gap-px border border-black">
          <Button
            type="button"
            onClick={() => setInputMode("search")}
            className={`rounded-none h-12 ${inputMode === "search" ? "bg-gray-200 font-bold" : "bg-white hover:bg-gray-50"} text-black border-r border-black`}
          >
            검색하기
          </Button>
          <Button
            type="button"
            onClick={() => setInputMode("manual")}
            className={`rounded-none h-12 ${inputMode === "manual" ? "bg-gray-200 font-bold" : "bg-white hover:bg-gray-50"} text-black`}
          >
            직접입력
          </Button>
        </div>
      </div>

      {inputMode === "search" && (
        <div className="space-y-4">
          {!selectedMovie && (
            <div>
              <label className="block text-sm font-medium mb-2">
                영화 검색
              </label>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMovieSearch()}
                  placeholder="영화 제목, 감독 등으로 검색"
                  className="border border-black rounded-none bg-white"
                  disabled={isSearching}
                />
                <Button
                  type="button"
                  onClick={handleMovieSearch}
                  className="bg-black text-white hover:bg-gray-800 rounded-none w-20"
                  disabled={isSearching}
                >
                  {isSearching ? "검색중..." : "검색"}
                </Button>
              </div>
            </div>
          )}

          {isSearching && (
            <div className="text-center p-4">검색 중입니다...</div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="border border-gray-300 space-y-px max-h-64 overflow-y-auto bg-gray-300">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className="flex items-start gap-4 p-3 cursor-pointer hover:bg-gray-100 bg-white"
                >
                  {movie.image ? (
                    <div className="w-16 flex-shrink-0">
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        width={64}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-24 bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                      <Film />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-bold">{movie.title}</p>
                    <p className="text-sm text-gray-600">{movie.director}</p>
                    <p className="text-sm text-gray-500">{movie.releaseYear}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery && (
            <div className="border border-dashed border-gray-300 p-4 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}

          {selectedMovie && (
            <div className="border border-black p-4 space-y-3">
              <div className="flex items-start gap-4">
                {selectedMovie.image ? (
                  <div className="w-24 flex-shrink-0">
                    <Image
                      src={selectedMovie.image}
                      alt={selectedMovie.title}
                      width={96}
                      height={144}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-36 bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                    <Film />
                  </div>
                )}
                <div className="flex-grow space-y-1">
                  <h3 className="font-bold text-lg">{selectedMovie.title}</h3>
                  <p>
                    <span className="font-semibold">감독:</span>{" "}
                    {selectedMovie.director}
                  </p>
                  <p>
                    <span className="font-semibold">개봉년도:</span>{" "}
                    {selectedMovie.releaseYear}
                  </p>
                </div>
              </div>
              <Button
                variant="link"
                onClick={() => setSelectedMovie(null)}
                className="p-0 h-auto text-blue-600 hover:underline"
              >
                다시 검색하기
              </Button>
            </div>
          )}
        </div>
      )}

      {inputMode === "manual" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="영화 제목"
              className="border border-black rounded-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">감독</label>
            <Input
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="감독 이름"
              className="border border-black rounded-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">연도</label>
            <Input
              type="number"
              value={releaseYear || ""}
              onChange={(e) =>
                setReleaseYear(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="개봉 연도"
              className="border border-black rounded-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              포스터 이미지
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-black rounded-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-gray-100 hover:file:bg-gray-200"
            />
            {image && (
              <div className="mt-2">
                <Image
                  src={image}
                  alt="Preview"
                  width={100}
                  height={150}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  // TODO: Implement renderBookInputs, renderMusicInputs, renderPhotoInputs

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black p-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "serif" }}>
            취향 기록하기
          </h1>
        </div>
      </header>

      <main className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <label className="block text-sm font-medium mb-3">
              1. 취향 유형을 선택하세요
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-black bg-black">
              {types.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id as any)}
                    className={`aspect-square flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedType === type.id
                        ? "bg-gray-200 font-bold"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType && (
            <div className="space-y-6">
              <hr />
              <div>
                <h2 className="block text-sm font-medium mb-3">
                  2. 취향 정보를 입력하세요 (
                  {types.find((t) => t.id === selectedType)?.name})
                </h2>
                {selectedType === "movie" && renderMovieInputs()}
                {/* TODO: Add other types */}
              </div>

              {(inputMode || selectedType === "photo") && (
                <>
                  <hr />
                  <div>
                    <h2 className="block text-sm font-medium mb-3">
                      3. 소감과 별점을 남겨주세요
                    </h2>
                    <div className="space-y-6">
                      {selectedType !== "photo" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            별점
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1 transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-500" : "text-gray-300"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          후기
                        </label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="이 취향에 대한 생각을 자유롭게 적어보세요."
                          className="border border-black rounded-none min-h-[120px] bg-white resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="grid grid-cols-2 gap-px border border-black h-12">
                    <Button
                      type="button"
                      onClick={onCancel}
                      className="border-r border-black rounded-none bg-white hover:bg-gray-100 text-black font-medium"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-none bg-black hover:bg-gray-800 text-white font-medium"
                    >
                      등록하기
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
