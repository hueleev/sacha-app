import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const { name, email } = await request.json();

    // 필수 필드 검증
    if (!name || !email) {
      return NextResponse.json(
        { message: "이름과 이메일은 필수입니다." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 사용자 정보 업데이트
    await db
      .update(user)
      .set({
        name: name,
        email: email,
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json(
      { message: "사용자 정보가 성공적으로 업데이트되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "사용자 정보 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
