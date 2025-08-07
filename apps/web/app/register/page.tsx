"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Label } from "@workspace/ui/components/shadcn/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // 이미 로그인하지 않은 경우 홈으로 리다이렉트
  if (!session) {
    router.push("/");
    return null;
  }

  // 이미 정보가 등록된 경우 대시보드로 리다이렉트
  if (session.user?.name && session.user?.email) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 세션 업데이트
        await update();
        toast.success("등록되었습니다!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "사용자 정보 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("사용자 정보 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            사용자 정보 등록
          </CardTitle>
          <CardDescription className="text-center">
            서비스 이용을 위해 추가 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.name || !formData.email}
            >
              {isLoading ? "등록 중..." : "정보 등록"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
