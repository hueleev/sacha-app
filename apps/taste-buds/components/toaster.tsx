"use client"

import { useToast } from "@/hooks/use-toast"
import { X, CheckCircle2, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    // iOS 등 모바일 화면에서 양쪽이 잘리지 않도록 max-width를 320px(기본)로 조정하고,
    // 화면 크기에 맞게 100%에서 여백을 뺀 w-[calc(100%-2rem)] 및 left-4, right-4, mx-auto를 적용해 모바일 대응을 합니다.
    // 데스크톱(md 이상)에서는 기존처럼 우측 하단에 고정되도록 설정합니다.
    <div className="fixed bottom-4 right-4 left-4 md:left-auto z-[9999] flex flex-col gap-3 w-[calc(100%-2rem)] max-w-[320px] md:max-w-sm mx-auto md:mx-0 pointer-events-none">
      {toasts.map((toast) => {
        if (toast.open === false) return null

        const isDestructive = toast.variant === "destructive"

        return (
          <div
            key={toast.id}
            // h-auto 와 min-h-[56px] 를 적용하여 내용이 늘어나도 세로 크기가 유동적으로 변하게 합니다.
            className={`pointer-events-auto relative flex w-full h-auto min-h-[56px] items-start gap-3 border p-4 rounded-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 bg-white ${
              isDestructive
                ? "border-red-600 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] text-red-600"
                : "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
            }`}
          >
            {/* 알림 아이콘 표시부 */}
            <div className="mt-0.5">
              {isDestructive ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-black" />
              )}
            </div>

            {/* 텍스트 내용부: break-words와 whitespace-pre-line으로 2줄 이상의 장문도 정상 줄바꿈 처리합니다. */}
            <div className="flex-grow pr-4 text-left">
              {toast.title && (
                <h4 className="text-sm font-bold font-serif mb-1 leading-tight break-words">
                  {toast.title}
                </h4>
              )}
              {toast.description && (
                <p className="text-xs leading-relaxed opacity-90 break-words whitespace-pre-line">
                  {toast.description}
                </p>
              )}
            </div>

            {/* 닫기(X) 버튼 영역 */}
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
