'use client'

import { signIn } from "next-auth/react"
import { Button } from "@workspace/ui/components/shadcn/button"
import { PenTool, Book, Headphones, Film, BookOpen } from "lucide-react"

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md border border-black bg-white">
        <div className="text-center border-b border-black bg-white p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="aspect-square border border-black flex items-center justify-center">
              <PenTool className="w-6 h-6" />
            </div>
            <div className="aspect-square border border-black flex items-center justify-center">
              <Book className="w-6 h-6" />
            </div>
            <div className="aspect-square border border-black flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="aspect-square border border-black flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "serif" }}>
            Taste Buds
          </h1>
          <p className="text-sm text-gray-600">Discover Your Taste Buds</p>
        </div>
        <div className="p-6 bg-white">
          <div className="space-y-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full border border-black rounded-none bg-white hover:bg-gray-100 text-black font-medium h-10"
            >
              Google로 로그인
            </Button>
            <Button
              onClick={() => signIn("kakao", { callbackUrl: "/" })}
              className="w-full border border-black rounded-none bg-yellow-300 hover:bg-yellow-400 text-black font-medium h-10"
            >
              카카오로 로그인
            </Button>
            <hr/>
            <Button
                onClick={() => window.open("/storybook", "_blank")}
                className="w-full border border-black rounded-none bg-white hover:bg-gray-100 text-black font-medium h-10 mt-4 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> {/* BookOpen 아이콘 추가 */}
              스토리북 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}