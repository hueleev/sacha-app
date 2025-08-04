"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginScreen } from "../components/login-screen";
import { LoadingSpinner } from "../components/loading-spinner";

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
    return <LoadingSpinner />;
  }

  if (session) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return <LoginScreen />;
}
