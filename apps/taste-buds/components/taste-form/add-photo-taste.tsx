"use client";
import type React from "react";
import { Button } from "@workspace/ui/components/shadcn/button";

interface AddPhotoTasteProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddPhotoTaste({ onCancel }: AddPhotoTasteProps) {
  return (
    <div>
      <p>사진 취향 추가는 아직 구현되지 않았습니다.</p>
      <Button onClick={onCancel}>돌아가기</Button>
    </div>
  );
}