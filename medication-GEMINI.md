# Hobby 프로젝트

프롬프트 작성은 한글을 사용하도록 한다.

GEMINI는 한글로 답변을 하도록 한다.

## 프로젝트 소개

- 프로젝트는 크게 3개의 폴더로 구성된다.

1. apps: 프로젝트 코드가 위치한다.
2. packages: 공통 컴포넌트와 유틸리티가 위치한다.
3. storybook: 스토리북 코드가 위치한다.

회원가입/로그인은 nextAuth와 카카오 로그인을 사용한다.

# 구현

1. 회원가입
   - 카카오 로그인으로 회원 가입한다.
2. 로그인 후, 화면 진입

- 복약 알림 목록이 뜨고, 상단에 복약등록을 클릭하면 복약 알림을 등록할 수 있다.
- 피드 클릭 시, 가족에 속해있지 않은 경우 가짜 피드가 샘플로 뜨고 dim 처리된 화면에 가족 생성, 가족 찾기 버튼만 존재한다.
- 가족 생성 클릭 시, 가족 명과 암호를 입력하여 families에 가족이 생성되며 family_members 테이블에 가족 멤버로 내가 추가된다.
- 가족 찾기 시, input text 하나만 보이고 검색하면 families 테이블에서 검색한다. 검색 결과가 없으면 검색 결과가 없다는 메시지를 띄운다.
- 가족 찾기 결과가 있으면 가족 멤버 목록이 뜨고 '가족입니다!'버튼 클릭하면 암호를 입력하고, 암호가 일치하면 해당 가족의 멤버로 추가된다.
- 가족 멤버 목록에서 가족 멤버를 클릭하면 가족 멤버의 복약 알림 목록이 팝업으로 뜨고, 팝업 하단에 '복약 추가' 버튼이 있다.
- 복약 추가 버튼 클릭 시, 복약 알림 등록 팝업이 뜨고, 선택한 가족의 복약 알림을 등록할 수 있다.
- 피드엔 가족끼리 피드를 남길 수 있고, 가족이 복약을 완료하면 복약완료하였다는 피드가 서로 공유된다.

3. 복약 알림 등록

- 복약 알림 등록 팝업에서 복약 알림을 등록할 수 있다.
- 본인의 복약 알림을 등록하면 bridge함수를 사용해서 안드로이드로 복약 목록을 보내준다.

# Database

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

-- families: 가족 테이블
CREATE TABLE "families" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
family_name TEXT NOT NULL,
password TEXT NOT NULL,
created_by UUID REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- family_members: 가족 멤버 테이블
CREATE TABLE "family_members" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
family_id UUID REFERENCES families(id) ON DELETE CASCADE,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
nickname TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- medications: 복약 알림 테이블
CREATE TABLE "medications" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
medication_name TEXT NOT NULL,
medication_time TIMESTAMPTZ NOT NULL,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- medication_logs: 복약 알림 로그 테이블
CREATE TABLE "medication_logs" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
is_taken BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- feed_items: 피드 아이템 테이블
CREATE TABLE "feed_items" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
family_id UUID REFERENCES families(id) ON DELETE CASCADE,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
content TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- feed_item_comments: 피드 아이템 댓글 테이블
CREATE TABLE "feed_item_comments" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
feed_item_id UUID REFERENCES feed_items(id) ON DELETE CASCADE,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
content TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- feed_item_likes: 피드 아이템 좋아요 테이블
CREATE TABLE "feed_item_likes" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
feed_item_id UUID REFERENCES feed_items(id) ON DELETE CASCADE,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);
