'use client';

import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/shadcn/button';
import { Input } from '@workspace/ui/components/shadcn/input';
import { Textarea } from '@workspace/ui/components/shadcn/textarea';
import { Film, Star } from 'lucide-react';
// 토스트 메시지 출력을 위한 로컬 훅 임포트
import { useToast } from '@/hooks/use-toast';

// 영화 검색 결과를 나타내는 인터페이스 정의
interface MovieSearchResult {
  id: number;
  title: string;
  director: string;
  releaseYear?: number;
  image: string;
  source: 'api';
  sourceId: string;
}

interface AddMovieTasteProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddMovieTaste({
  onCancel,
  onSuccess,
}: AddMovieTasteProps) {
  // 토스트 훅 초기화
  const { toast } = useToast();
  const [inputMode, setInputMode] = useState<'search' | 'manual' | null>(null);

  // 입력 폼 상태값 정의
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(''); // 이미지 URL 혹은 base64 데이터
  const [director, setDirector] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | undefined>(undefined);

  // 영화 검색을 위한 상태값 정의
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  // 이미지 업로드 핸들러 (수동 입력 시 base64 인코딩)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // base64 문자열 저장
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // TMDb API를 통한 영화 검색 핸들러
  const handleMovieSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await fetch(
        `/api/movie/search?query=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) {
        throw new Error('영화 검색 API 호출에 실패했습니다.');
      }
      const data: MovieSearchResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      // 영화 검색 에러 발생 시 토스트 팝업 (오류 타이틀 포함)
      toast({
        title: '오류',
        description:
          error instanceof Error
            ? error.message
            : '영화 검색 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 결과 목록에서 영화를 선택했을 때 처리 핸들러
  const handleSelectMovie = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    setTitle(movie.title);
    setDirector(movie.director);
    setReleaseYear(movie.releaseYear);
    setImage(movie.image);
    setSearchResults([]);
    setSearchQuery('');
  };

  // 취향 등록 폼 전송 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 입력값 검증 실패 시 토스트 팝업 (실패 타이틀 포함)
    if (!title || !description) {
      toast({
        title: '실패',
        description: '제목과 후기는 필수 항목입니다.',
        variant: 'destructive',
      });
      return;
    }
    if (rating === 0) {
      toast({
        title: '실패',
        description: '별점을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    let postData: any = {
      tasteType: 'movie',
      title: title,
      comment: description,
      rating: rating,
      imageUrl: image,
      searchType: inputMode,
      artistDirectorAuthor: director, // 감독 정보 매핑
      year: releaseYear ? releaseYear.toString() : null,
    };

    if (inputMode === 'search' && selectedMovie) {
      postData.sourceId = selectedMovie.id;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // 성공한 경우 타이틀(title) 없이 내용(description)만 보여줍니다.
        toast({
          description: '취향이 성공적으로 등록되었습니다!',
        });
        onSuccess(); // 등록 폼 모달 닫기
      } else {
        const errorData = await response.json();
        // 등록 실패 시 토스트 팝업 (실패 타이틀 포함)
        toast({
          title: '실패',
          description: `취향 등록에 실패했습니다: ${errorData.message || response.statusText}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to submit taste:', error);
      // 알 수 없는 오류 발생 시 토스트 팝업 (오류 타이틀 포함)
      toast({
        title: '오류',
        description: '취향 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const renderMovieInputs = () => (
    <>
      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">입력 방식 선택</label>
        <div className="grid grid-cols-2 gap-px border border-black">
          <Button
            type="button"
            onClick={() => setInputMode('search')}
            className={`rounded-none h-12 ${inputMode === 'search' ? 'bg-gray-200 font-bold' : 'bg-white hover:bg-gray-50'} text-black border-r border-black`}
          >
            검색하기
          </Button>
          <Button
            type="button"
            onClick={() => setInputMode('manual')}
            className={`rounded-none h-12 ${inputMode === 'manual' ? 'bg-gray-200 font-bold' : 'bg-white hover:bg-gray-50'} text-black`}
          >
            직접입력
          </Button>
        </div>
      </div>

      {inputMode === 'search' && (
        <div className="space-y-4">
          {!selectedMovie && (
            <div>
              <label className="block text-sm font-medium mb-2 mt-2">
                영화 검색
              </label>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMovieSearch()}
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
                  {isSearching ? '검색중...' : '검색'}
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
                    <span className="font-semibold">감독:</span>{' '}
                    {selectedMovie.director}
                  </p>
                  <p>
                    <span className="font-semibold">개봉년도:</span>{' '}
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

      {inputMode === 'manual' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 mt-2">제목</label>
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
              value={releaseYear || ''}
              onChange={(e) =>
                setReleaseYear(
                  e.target.value ? parseInt(e.target.value) : undefined,
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-6">
        <div>
          <h2 className="block text-sm font-medium mb-3">
            2. 취향 정보를 입력하세요 (영화)
          </h2>
          {renderMovieInputs()}
        </div>

        {inputMode && (
          <>
            <hr />
            <div>
              <h2 className="block text-sm font-medium mb-3">
                3. 소감과 별점을 남겨주세요
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">별점</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">후기</label>
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
            <div className="grid grid-cols-2 border border-black">
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
    </form>
  );
}
