"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@workspace/ui/components/shadcn/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface ToastContextType {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, "id">) => { id: string; dismiss: () => void }
  dismiss: (id?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

const TOAST_LIMIT = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const dismiss = React.useCallback((id?: string) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id || id === undefined ? { ...t, open: false } : t
      )
    )
    if (id) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 1000)
    } else {
      setTimeout(() => {
        setToasts([])
      }, 1000)
    }
  }, [])

  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prev) => {
      const newToast: ToasterToast = {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss(id)
        },
      }
      return [newToast, ...prev].slice(0, TOAST_LIMIT)
    })

    // 3초 후 자동으로 사라지도록 타이머 설정
    setTimeout(() => {
      dismiss(id)
    }, 3000)

    return {
      id,
      dismiss: () => dismiss(id),
    }
  }, [dismiss])

  return React.createElement(
    ToastContext.Provider,
    { value: { toasts, toast, dismiss } },
    children
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
