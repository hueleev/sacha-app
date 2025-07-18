"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dashboard } from "@/components/dashboard";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
      return;
    }
    if (!session.user?.name || !session.user?.email) {
      router.push("/register");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session || !session.user?.name || !session.user?.email) {
    return null;
  }

  return <Dashboard />;
}
