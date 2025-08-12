"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@workspace/ui/components/shadcn/button"
import { Input } from "@workspace/ui/components/shadcn/input"
import { Textarea } from "@workspace/ui/components/shadcn/textarea"
import { Film, Book, Headphones, Camera, Star, ArrowLeft } from "lucide-react"

interface AddTasteProps {
  onAdd: (taste: any) => void
  onCancel: () => void
}

export default function AddTaste({ onAdd, onCancel }: AddTasteProps) {
  const [selectedType, setSelectedType] = useState<"movie" | "book" | "music" | "photo" | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState(0)
  const [image, setImage] = useState("")
  const [inputMode, setInputMode] = useState<'search' | 'manual' | null>(null)
  const [artist, setArtist] = useState("")
  const [director, setDirector] = useState("")
  const [author, setAuthor] = useState("")
  const [releaseYear, setReleaseYear] = useState<number | undefined>(undefined)

  const types = [
    { id: "movie", name: "영화", icon: Film },
    { id: "book", name: "책", icon: Book },
    { id: "music", name: "음악", icon: Headphones },
    { id: "photo", name: "사진", icon: Camera },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!selectedType || !title || !description) {
      // Add more specific validation messages later
      alert("필수 항목을 입력해주세요.")
      return
    }

    // Collect common data
    const commonData = {
      type: selectedType,
      title,
      description,
      rating: selectedType !== "photo" ? rating : undefined,
      image: image, // Image can be URL or base64
    }

    let specificData = {}

    if (selectedType === "music" && inputMode === "manual") {
      specificData = { artist, releaseYear }
    } else if (selectedType === "movie" && inputMode === "manual") {
      specificData = { director, releaseYear }
    } else if (selectedType === "book" && inputMode === "manual") {
      specificData = { author, releaseYear }
    }
    // For search mode, these fields would be populated from search results
    // For photo, no additional specific fields beyond title, description, image

    onAdd({ ...commonData, ...specificData })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="p-0 h-auto hover:bg-transparent">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "serif" }}>
            Taste Buds
          </h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 타입 선택 */}
          <div>
            <label className="block text-sm font-medium mb-3">취향 유형을 선택하세요</label>
            <div className="grid grid-cols-2 gap-px border border-black">
              {types.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id as any)}
                    className={`aspect-square border-r border-b border-black last:border-r-0 even:border-r-0 flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedType === type.id ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedType && (
            <>
              {selectedType !== "photo" && ( // Only for movie, book, music
                <div className="space-y-4">
                  <label className="block text-sm font-medium mb-2">입력 방식 선택</label>
                  <div className="grid grid-cols-2 gap-px border border-black">
                    <Button
                      type="button"
                      onClick={() => setInputMode("search")}
                      className={`rounded-none ${inputMode === "search" ? "bg-gray-100" : "bg-white hover:bg-gray-50"} text-black font-medium border-r border-black`}
                    >
                      검색하기
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setInputMode("manual")}
                      className={`rounded-none ${inputMode === "manual" ? "bg-gray-100" : "bg-white hover:bg-gray-50"} text-black font-medium`}
                    >
                      직접입력
                    </Button>
                  </div>
                </div>
              )}

              {(selectedType === "photo" || inputMode) && ( // Always show for photo, or if inputMode is selected
                <>
                  {/* 제목 */}
                  {(selectedType === "photo" || inputMode) && ( // Always show for photo, or if inputMode is selected
                <>
                  {/* Common fields for all types */}
                  {/* 제목 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">제목</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={`${types.find((t) => t.id === selectedType)?.name} 제목을 입력하세요`}
                      className="border border-black rounded-none bg-white"
                      required
                      readOnly={inputMode === "search"} // Readonly if in search mode
                    />
                  </div>

                  {/* Specific fields based on type and inputMode */}
                  {selectedType !== "photo" && inputMode === "search" && (
                    <>
                      {/* Search input for music, movie, book */}
                      <div>
                        <label className="block text-sm font-medium mb-2">검색어</label>
                        <Input
                          placeholder="검색어를 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                        <Button type="button" className="mt-2 w-full bg-black text-white hover:bg-gray-800 rounded-none">
                          검색
                        </Button>
                      </div>
                      {/* Placeholder for search results */}
                      <div className="border border-dashed border-gray-300 p-4 text-center text-gray-500">
                        검색 결과가 여기에 표시됩니다.
                      </div>
                    </>
                  )}

                  {selectedType === "music" && inputMode === "manual" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">가수</label>
                        <Input
                          placeholder="가수를 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">연도</label>
                        <Input
                          type="number"
                          placeholder="연도를 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {selectedType === "movie" && inputMode === "manual" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">감독</label>
                        <Input
                          placeholder="감독을 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">연도</label>
                        <Input
                          type="number"
                          placeholder="연도를 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {selectedType === "book" && inputMode === "manual" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">작가</label>
                        <Input
                          placeholder="작가를 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">연도</label>
                        <Input
                          type="number"
                          placeholder="연도를 입력하세요"
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* Image input for manual mode (music, movie, book) or photo type */}
                  {(inputMode === "manual" && selectedType !== "photo") && (
                    <div>
                      <label className="block text-sm font-medium mb-2">이미지 URL</label>
                      <Input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="이미지 URL을 입력하세요"
                        className="border border-black rounded-none bg-white"
                      />
                    </div>
                  )}

                  {selectedType === "photo" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">사진 업로드</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImage(reader.result as string);
                              };
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                          className="border border-black rounded-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* 별점 (사진 제외) */}
                  {selectedType !== "photo" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">별점</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                            <Star className={`w-6 h-6 ${star <= rating ? "fill-black text-black" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 설명 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">후기</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="이 취향에 대한 생각을 자유롭게 적어보세요"
                      className="border border-black rounded-none min-h-[100px] bg-white resize-none"
                      required
                    />
                  </div>

                  {/* 등록 버튼 */}
                  <div className="grid grid-cols-2 gap-px border border-black h-10">
                    <Button
                      type="button"
                      onClick={onCancel}
                      className="border-r border-black rounded-none bg-white hover:bg-gray-100 text-black font-medium"
                    >
                      취소
                    </Button>
                    <Button type="submit" className="rounded-none bg-white hover:bg-gray-100 text-black font-medium">
                      등록하기
                    </Button>
                  </div>
                </>
              )}
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}
