"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginScreen } from "../components/login-screen";
import Image from "next/image";

import heartPillImg from "@workspace/ui/assets/image/heartPill.png";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // 로딩 중일 때는 아무것도 하지 않음

    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin-slow">
          <Image
            src={heartPillImg}
            alt="로딩"
            width={80}
            height={80}
            priority
          />
        </div>
        <div className="mt-4 text-gray-500 text-sm font-medium tracking-wide">
          로딩 중...
        </div>
        <style jsx global>{`
          @keyframes spin-slow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 1.2s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return <LoginScreen />;
}
