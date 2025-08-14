"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Film, Book, Headphones, Camera, ArrowLeft } from "lucide-react";
import AddMovieTaste from "./taste-form/add-movie-taste";
import AddBookTaste from "./taste-form/add-book-taste";
import AddMusicTaste from "./taste-form/add-music-taste";
import AddPhotoTaste from "./taste-form/add-photo-taste";

interface AddTasteProps {
  onCancel: () => void;
}

export default function AddTaste({ onCancel }: AddTasteProps) {
  const [selectedType, setSelectedType] = useState<
    "movie" | "book" | "music" | "photo" | null
  >(null);

  const types = [
    { id: "movie", name: "영화", icon: Film },
    { id: "book", name: "책", icon: Book },
    { id: "music", name: "음악", icon: Headphones },
    { id: "photo", name: "사진", icon: Camera },
  ];

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null);
    } else {
      onCancel();
    }
  };

  const renderContent = () => {
    if (!selectedType) {
      return (
        <div className="max-w-2xl mx-auto">
          <label className="block text-sm font-medium mb-3">
            1. 취향 유형을 선택하세요
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-black bg-black">
            {types.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id as any)}
                  className={`aspect-square flex flex-col items-center justify-center gap-2 transition-all bg-white hover:bg-gray-50`}
                >
                  <Icon className="w-7 h-7" />
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // onCancel from child components should take user back to type selection
    // onSuccess from child components should close the whole thing
    switch (selectedType) {
      case "movie":
        return <AddMovieTaste onCancel={handleBack} onSuccess={onCancel} />;
      case "book":
        return <AddBookTaste onCancel={handleBack} onSuccess={onCancel} />;
      case "music":
        return <AddMusicTaste onCancel={handleBack} onSuccess={onCancel} />;
      case "photo":
        return <AddPhotoTaste onCancel={handleBack} onSuccess={onCancel} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black p-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "serif" }}>
            취향 기록하기
          </h1>
        </div>
      </header>

      <main className="p-4">{renderContent()}</main>
    </div>
  );
}
