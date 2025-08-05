"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
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

  const types = [
    { id: "movie", name: "영화", icon: Film },
    { id: "book", name: "책", icon: Book },
    { id: "music", name: "음악", icon: Headphones },
    { id: "photo", name: "사진", icon: Camera },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || !title || !description) return

    const newTaste = {
      type: selectedType,
      title,
      description,
      rating: selectedType !== "photo" ? rating : undefined,
      image: image || `/placeholder.svg?height=300&width=300&query=${selectedType}`,
    }

    onAdd(newTaste)
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
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`${types.find((t) => t.id === selectedType)?.name} 제목을 입력하세요`}
                  className="border border-black rounded-none bg-white"
                  required
                />
              </div>

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

              {/* 이미지 URL (선택사항) */}
              <div>
                <label className="block text-sm font-medium mb-2">이미지 URL (선택사항)</label>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="이미지 URL을 입력하세요"
                  className="border border-black rounded-none bg-white"
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
        </form>
      </div>
    </div>
  )
}
