"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/shadcn/button";
import { LogIn, BookOpen } from "lucide-react";

import loginImage from "@workspace/ui/assets/image/yak-alarm.png";
import heartPillImg from "@workspace/ui/assets/image/heartPill_2.png";
import starPillImg from "@workspace/ui/assets/image/starPill_2.png";
import { useEffect, useRef, useState } from "react";

const PILL_IMAGES = [heartPillImg, starPillImg];
const PILL_COUNT = 8;

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomPillConfig() {
  return {
    x: getRandom(0, window.innerWidth - 100),
    y: getRandom(0, window.innerHeight - 100),
    dx: getRandom(-1.2, 1.2) || 1,
    dy: getRandom(-1.2, 1.2) || 1,
    angle: getRandom(0, 360),
    dAngle: getRandom(-1, 1),
    size: getRandom(60, 120),
    img: PILL_IMAGES[Math.floor(Math.random() * PILL_IMAGES.length)],
    opacity: getRandom(0.13, 0.35),
    blur: Math.random() > 0.5 ? 0 : 2,
  };
}

export function LoginScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);
  const [_, forceRerender] = useState(0); // 강제 리렌더링용
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // pill 초기화 (window 크기 사용)
    function getRandomPillConfigSafe() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = getRandom(60, 120);
      return {
        size,
        x: getRandom(0, width - size),
        y: getRandom(0, height - size),
        dx: getRandom(-1.2, 1.2) || 1,
        dy: getRandom(-1.2, 1.2) || 1,
        angle: getRandom(0, 360),
        dAngle: getRandom(-1, 1),
        img: PILL_IMAGES[Math.floor(Math.random() * PILL_IMAGES.length)],
        opacity: 1, // 투명도 제거
        blur: Math.random() > 0.5 ? 0 : 2,
      };
    }
    const pills = Array.from({ length: PILL_COUNT }).map(
      getRandomPillConfigSafe
    );
    pillsRef.current = pills;

    function animate() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      pillsRef.current.forEach((pill) => {
        pill.x += pill.dx;
        pill.y += pill.dy;
        pill.angle += pill.dAngle;
        if (pill.x <= 0 || pill.x + pill.size >= width) pill.dx *= -1;
        if (pill.y <= 0 || pill.y + pill.size >= height) pill.dy *= -1;
      });
      forceRerender((v) => v + 1); // 강제 리렌더링
      animationRef.current = requestAnimationFrame(animate);
    }
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const pills = pillsRef.current;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* 움직이는 pill 배경 */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none select-none z-0"
      >
        {pills.map((pill, i) => (
          <Image
            key={i}
            src={pill.img}
            alt="pill"
            width={pill.size}
            height={pill.size}
            style={{
              position: "absolute",
              left: pill.x,
              top: pill.y,
              opacity: 1, // 투명도 제거
              filter: pill.blur ? `blur(${pill.blur}px)` : undefined,
              transform: `rotate(${pill.angle}deg)`,
              transition: "none",
              zIndex: 0,
            }}
            draggable={false}
          />
        ))}
      </div>
      {/* 카드 뒤 dim 배경 */}
      <div className="fixed inset-0 bg-white/60 z-10 pointer-events-none" />
      {/* 로그인 카드 */}
      <div className="bg-white/80 shadow-xl rounded-2xl px-10 py-12 flex flex-col items-center animate-fade-in relative z-20">
        <Image
          src={loginImage}
          alt="Yak Alarm"
          width={180}
          height={180}
          className="mx-auto mb-6 drop-shadow-lg rounded-full border-4 border-yellow-200"
          priority
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight drop-shadow-sm">
          복약 관리
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          가족과 함께 건강을 지키세요
        </p>
        <Button
          onClick={() => {
            setIsLoggingIn(true);
            signIn("kakao", { callbackUrl: "/dashboard" });
          }}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-3 rounded-full shadow-md flex items-center gap-2 transition-all duration-200"
          style={{ boxShadow: "0 4px 24px 0 rgba(255, 221, 51, 0.15)" }}
          disabled={isLoggingIn}
        >
          <LogIn className="w-5 h-5 mr-1" />
          {isLoggingIn ? "로그인 중..." : "카카오로 로그인"}
        </Button>

        {/* 스토리북 버튼 */}
        <Button
          onClick={() => window.open("/storybook", "_blank")}
          variant="outline"
          size="sm"
          className="mt-4 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 transition-all duration-200"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          스토리북 보기
        </Button>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
