"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { PenTool, Book, Headphones, Film, BookOpen } from "lucide-react" // BookOpen 추가

interface AuthProps {
  onLogin: (userData: any) => void
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin({ email, name: email.split("@")[0] })
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="border border-black rounded-none bg-white h-10"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                className="border border-black rounded-none bg-white h-10"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full border border-black rounded-none bg-white hover:bg-gray-100 text-black font-medium h-10"
            >
              {isSignUp ? "회원가입" : "로그인"}
            </Button>
          </form>
          <Button
            onClick={() => window.open("/storybook", "_blank")}
            className="w-full border border-black rounded-none bg-white hover:bg-gray-100 text-black font-medium h-10 mt-2 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> {/* BookOpen 아이콘 추가 */}
            스토리북 보기
          </Button>
          <div className="mt-4 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-gray-500 hover:text-black">
              {isSignUp ? "이미 계정이 있나요? 로그인" : "계정이 없나요? 회원가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
