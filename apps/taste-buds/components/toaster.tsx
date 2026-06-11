"use client"

import { useToast } from "@/hooks/use-toast"
import { X, CheckCircle2, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        if (toast.open === false) return null

        const isDestructive = toast.variant === "destructive"

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative flex w-full items-start gap-3 border p-4 rounded-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 bg-white ${
              isDestructive
                ? "border-red-600 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] text-red-600"
                : "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
            }`}
          >
            {/* 아이콘 */}
            <div className="mt-0.5">
              {isDestructive ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-black" />
              )}
            </div>

            {/* 텍스트 영역 */}
            <div className="flex-grow pr-4">
              {toast.title && (
                <h4 className="text-sm font-bold font-serif mb-0.5 leading-none">
                  {toast.title}
                </h4>
              )}
              {toast.description && (
                <p className="text-xs leading-relaxed opacity-90">
                  {toast.description}
                </p>
              )}
            </div>

            {/* 닫기 버튼 */}
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
