# 취향을 작성하는 프로젝트 (taste-buds)

모든 프롬프트 작성은 **한글**로 진행합니다.  
GEMINI는 **한글로 응답**하도록 설정합니다.

현재는 **v0 프로토타입 디자인**이 구성된 상태입니다.

## 프로젝트 개요

**taste-buds**는 사용자 개인의 취향을 기록하고, 다른 사람의 취향을 탐색하며, 공감할 수 있는 소셜 성향의 앱입니다.

## 프로젝트 구조

```bash
apps/taste-buds      # 앱 소스 코드
packages/            # 공통 컴포넌트 및 유틸리티
storybook/           # Storybook 구성
```

## 앱 기능 요약

- 카카오/구글 OAuth를 통한 로그인 및 회원가입 (NextAuth 사용)
- 회원가입 시 닉네임과 프로필 사진 등록
- 음악, 영화, 책, 사진에 대한 취향 등록
- 소감 및 별점 입력
- 취향에 공감하거나 찜하기 가능
- 사용자 팔로우 기능
- 다양한 보기 방식 (썸네일 / 목록)
- 필터: 별점 선택, 중복 콘텐츠 숨기기

## 주요 화면 및 기능 흐름


### 1. 회원가입 / 로그인

- 카카오 또는 구글 OAuth 로그인 지원 (NextAuth 사용)
- 최초 로그인 시 닉네임과 프로필 이미지 등록
- 등록 완료 후 메인 화면으로 진입

---

### 2. 취향 등록

등록 가능한 취향 유형:

- 🎵 음악: 제목, 가수, 연도, 앨범 커버
- 🎬 영화: 제목, 감독, 연도, 썸네일
- 📚 책: 제목, 작가, 연도, 표지 이미지
- 🖼️ 사진: 제목, 이미지 업로드

> 네이버 OpenAPI를 통해 콘텐츠 자동 검색 및 정보 입력  
> 직접 입력도 가능 (모든 필드 수동 입력)  
> 소감 및 별점 입력은 필수

---

### 3. 메인 피드 화면

- 인스타그램 스타일의 취향 피드
- 보기 방식 선택:
    - 썸네일 보기
    - 목록 보기
- 필터 기능:
    - 별점 필터링
    - 중복 콘텐츠 숨기기 (같은 콘텐츠 반복 노출 방지)
- 각 콘텐츠에:
    - 공감(좋아요)
    - 찜하기
- 사용자 팔로우 기능 제공

---

### 4. 탭 구성

| 탭 이름      | 설명                                              |
|-------------|---------------------------------------------------|
| MoiMoi      | 내가 직접 올린 취향들을 모아볼 수 있어요           |
| Tastopia    | 모든 사용자들의 다양한 취향을 탐색해보세요         |
| FavFolk     | 팔로우한 사람들의 취향만 골라서 볼 수 있어요       |
| ZzimZzim    | 찜한 취향들을 저장해두고 나중에 다시 볼 수 있어요 |

## Database

- database는 vercel이 출시한 neon을 사용한다.
- table 정보

-- users: 사용자 테이블 (NextAuth 호환)
CREATE TABLE "users" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name TEXT,
email TEXT UNIQUE,
email_verified TIMESTAMPTZ,
image TEXT,
created_at TIMESTamptz DEFAULT now()
);

-- accounts: OAuth 계정 연결 테이블 (NextAuth 호환)
CREATE TABLE "accounts" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
type TEXT NOT NULL, -- 'oauth'
provider TEXT NOT NULL, -- 'kakao'
provider_account_id TEXT NOT NULL, -- kakao user id
refresh_token TEXT,
access_token TEXT,
expires_at BIGINT,
token_type TEXT,
scope TEXT,
id_token TEXT,
session_state TEXT,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(provider, provider_account_id)
);

-- sessions: 세션 테이블 (NextAuth 호환)
CREATE TABLE "sessions" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
session_token TEXT UNIQUE NOT NULL,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
expires TIMESTAMPTZ NOT NULL
);

-- profiles: 사용자 프로필 테이블
CREATE TABLE "profiles" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
nickname TEXT NOT NULL,
bio TEXT,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- common_codes: 공통 코드 테이블
CREATE TABLE "common_codes" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
code_group TEXT NOT NULL, -- 'content_type'
code TEXT NOT NULL, -- 'music', 'movie', 'book', 'photo'
name TEXT NOT NULL, -- '음악', '영화', '책', '사진'
description TEXT,
sort_order INTEGER,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(code_group, code)
);

-- contents: 콘텐츠 정보는 Naver API를 통해 가져오므로 별도의 테이블이 필요하지 않음

-- posts: 게시물 및 별점 테이블
CREATE TABLE "posts" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
content_type_id UUID REFERENCES common_codes(id) ON DELETE RESTRICT, -- 콘텐츠 타입 코드 ID
content_id TEXT NOT NULL, -- Naver API에서 제공하는 콘텐츠 ID
title TEXT NOT NULL, -- 콘텐츠 제목
comment TEXT NOT NULL,
rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(user_id, content_type_id, content_id)
);

-- likes: 공감(좋아요) 테이블
CREATE TABLE "likes" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(user_id, post_id)
);

-- bookmarks: 찜하기 테이블
CREATE TABLE "bookmarks" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
content_type_id UUID REFERENCES common_codes(id) ON DELETE RESTRICT, -- 콘텐츠 타입 코드 ID
content_id TEXT NOT NULL, -- Naver API에서 제공하는 콘텐츠 ID
title TEXT NOT NULL, -- 콘텐츠 제목
thumbnail_url TEXT, -- 썸네일 URL
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(user_id, content_type_id, content_id)
);

-- follows: 팔로우 관계 테이블
CREATE TABLE "follows" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
following_id UUID REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(follower_id, following_id)
);
