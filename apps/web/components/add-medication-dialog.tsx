"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/web/dialog"
import { Button } from "@workspace/ui/components/web/button"
import { Input } from "@workspace/ui/components/web/input"
import { Label } from "@workspace/ui/components/web/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/web/select"

interface Medication {
  name: string
  dosage: string
  time: string
  color: string
}

interface AddMedicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMedication: (medication: Medication) => void
}

const colors = [
  { value: "bg-blue-500", label: "파란색" },
  { value: "bg-green-500", label: "초록색" },
  { value: "bg-yellow-500", label: "노란색" },
  { value: "bg-red-500", label: "빨간색" },
  { value: "bg-purple-500", label: "보라색" },
  { value: "bg-pink-500", label: "분홍색" },
]

export function AddMedicationDialog({ open, onOpenChange, onAddMedication }: AddMedicationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    time: "",
    color: "bg-blue-500",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.dosage && formData.time) {
      onAddMedication(formData)
      setFormData({ name: "", dosage: "", time: "", color: "bg-blue-500" })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 복약 추가</DialogTitle>
          <DialogDescription>새로운 복약 일정을 추가하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">약품명</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: any) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="예: 혈압약, 비타민D"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosage">복용량</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e: any) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
              placeholder="예: 1정, 2캡슐"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">복용 시간</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e: any) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">색상</Label>
            <Select
              value={formData.color}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, color: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color.value}`} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
