# 취향을 작성하는 프로젝트 (taste-buds)

모든 프롬프트 작성은 **한글**로 진행합니다.  
GEMINI는 **한글로 응답**하도록 설정합니다.

현재는 **v0 프로토타입 디자인**이 구성된 상태입니다.

## 프로젝트 개요

**taste-buds**는 사용자 개인의 취향을 기록하고, 다른 사람의 취향을 탐색하며, 공감할 수 있는 소셜 성향의 웹앱.

## 프로젝트 구조

- shadcnUI 기반의 monorepo 프로젝트임. 
- NextJS 사용
- pnpm 사용 

- `apps/web` : 샘플코드로 해당 소스는 인덱싱하지 않고, **답변할 때 참고하지 않도록 한다.**
- `apps/taste-buds` : 웹앱 프로젝트이자 우리가 만들어야 할 프로젝트. 
- `packages/` : 공통 컴포넌트 및 유틸리티
- `packates/ui` : 공통 컴포넌트 및 스토리북 (shadcnUI 컴포넌트 포함)

## 앱 기능 요약

- 카카오/구글 OAuth를 통한 로그인 및 회원가입 (NextAuth 사용)
- 회원가입 시 닉네임과 프로필 사진 등록
- 음악, 영화, 책, 사진에 대한 취향 등록
- 소감 및 별점 입력
- 취향에 공감하거나 찜하기 가능
- 사용자 팔로우 기능
- 다양한 보기 방식 (썸네일 / 목록)
- 필터: 별점 선택, 중복 콘텐츠 숨기기


## 상세 앱 기능

### 1. 회원가입 / 로그인

- 카카오 또는 구글 OAuth 로그인 지원 (NextAuth 사용)
- 최초 로그인 시, 이름,닉네임,프로필 이미지,소개 등록
  - 이름과 프로플이미지는 user테이블에 등록
  - 닉네임과 소개는 profiles 테이블에 등록
- 등록 완료 후 메인 화면으로 진입

### 2. 상세 기능

1. 업로드 가능한 취향 유형 및 입력 항목: 음악,영화,책은 소감과 별점을 필수로 입력해야한다.
   - 🎵 음악: 제목, 가수, 연도, 앨범 커버(이미지 url)
   - 🎬 영화: 제목, 감독, 연도, 썸네일(이미지 url)
   - 📚 책: 제목, 작가, 연도, 표지 이미지(이미지 url)
   - 🖼️ 사진: 제목, 이미지 업로드, 설명

2. 메인화면에 구성은 아래와 같다.
   - 탭구성
       | 탭 이름      | 설명                                              |
       |-------------|---------------------------------------------------|
       | MoiMoi      | 내가 직접 올린 취향들을 모아볼 수 있어요           |
       | Tastopia    | 모든 사용자들의 다양한 취향을 탐색해보세요         |
       | FavFolk     | 팔로우한 사람들의 취향만 골라서 볼 수 있어요       |
       | ZzimZzim    | 찜한 취향들을 저장해두고 나중에 다시 볼 수 있어요 |

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
       - 팔로우 기능 제공

3. '음악, 영화, 책' 등록하기
   - '음악, 영화, 책을 접한 소감과 별점을 등록한다.' 
   - 검색하기와 직접입력 2개의 버튼이 보여진다.
   - 검색하기 클릭 시, 하단에 '##개발' 에 적힌 openAPI를 사용하여 검색한다. 검색 후, 선택하면 1에 정의된 유형 별 입력항목 input box가 readonly로 생성되며 항목들이 자동 입력된다. 이미지는 url이 보여지는 게 아니라 이미지가 보여지도록 한다. 데이터 저장할 때, 이미지 url을 저장한다.
   - 직접입력 클릭 시, 1에 정의된 input box들이 생성되며 직접입력할 수 있게 한다. 이미지는 파일선택으로 보여지며, 직접입력의 경우 base64로 이미지를 저장하도록 한다.
   - 모든 항목은 소감과 별점은 공통 입력 항목이며, 검색하기,직접입력 클릭 시, input이 최하단에 생성되도록 한다.

4. '사진' 등록하기
   - '사용자가 직접 찍은 취향의 사진을 등록하고, 제목과 설명을 입력한다.'
   - 파일선택과, 제목, 설명 input이 보여진다.


## 개발

### 취향 등록

- 검색하기에서 사용하는 openAPI는 아래와 같다.
  - 영화: TMDb API 사용
  - 책: Naver 책 검색 API 사용
  - 음악: iTunes Search API 사용
- 음악,영화,책, 사진의 데이터 정보는 별도의 테이블로 구분하여 입력항목을 저장한다. openAPI로 검색된 정보가 해당 테이블에 없는 경우, insert 한다. 직접입력의 경우, prefix로 `taste-` 를 붙여 uuid를 생성한다.
- 소감, 별점, 작성일자와 같은 정보는 posts 테이블에 저장하고, 데이터 테이블과 relation을 맺어준다.
- `### 2. 상세 기능` 내용과 상단의 내용에 맞춰 과정을 진행하고, 개발이 완료되면 [ ] 안에 '**'를 입력하도록 한다.
  1. 영화 등록 [ ]
  2. 책 등록 [ ]
  3. 음악 등록 [ ]
  4. 사진 등록 [ ]


### 메인화면 취향 목록, 상세보기 & 진행 과정

아래 과정을 진행 하고, UI 개발이 완료되면 [ ] 안에 '*'을 입력하고, 기능 개발까지 완료되면 '**'를 입력하도록 한다.

- 목록
  1. /main 화면의 취향목록에 보여지는 포스팅의 내용은 2줄까지만 보여준다.
  2. 하트를 클릭하면 빨간하트로 바뀌면서 likes 테이블에 좋아요 기록을 등록한다. [ ]
  3. 책갈피를 클릭하면 파란책갈피로 바뀌면서 bookmarks 테이블에 데이터를 등록한다. [ ]
  4. 팔로우 버튼을 클릭하면 해당 포스팅을 올린 사용자를 팔로우한다. [ ]

- 상세보기
  1. 포스트를 클릭하면 모달이 보여지며, 상세 내용을 볼 수 있다. [ ]
  2. 하트를 클릭하면 빨간하트로 바뀌면서 likes 테이블에 좋아요 기록을 등록한다. [ ]
  3. 책갈피를 클릭하면 파란책갈피로 바뀌면서 bookmarks 테이블에 데이터를 등록한다. [ ]
  4. 팔로우 버튼을 클릭하면 해당 포스팅을 올린 사용자를 팔로우한다. [ ]
  5. 내가 올린 포스트는 모달 하단에 수정/삭제 버튼을 추가한다. [ ]
  6. 닉네임을 클릭하면 해당 사용자의 취향 목록으로 이동한다.

### 취향 수정,삭제

- 각 항목의 수정/삭제는 메인화면에서 내가 올린 포스트를 클릭하면 뜨는 팝업에 하단 '수정하기'/'삭제하기' 버튼을 클릭하면 작동하도록 한다. [ ]
- 수정하기를 클릭하면 수정화면으로 이동하며, 내용을 수정할 수 있다. [ ] 
- '음악, 영화, 책' 수정하기 [ ]
  - 이미지 정보가 url인 경우 소감과 별점만 수정 가능하다. 
  - 이미지 정보가 base64인 경우, 모든 항목이 수정 가능하다.
- '사진' 수정하기 [ ]
  - 제목과 설명만 수정가능하다.
- '삭제하기' 버튼을 클릭 하면, '삭제하시겠습니까?' 팝업이 뜨고 'O`, 'X' 버튼이 뜬다. 'O' 를 클릭하면 삭제되고, 'X'를 클릭하면 팝업이 사라진다. [ ] 

### 사용자의 취향 목록

아래 과정을 진행 하고, UI 개발이 완료되면 [ ] 안에 '*'을 입력하고, 기능 개발까지 완료되면 '**'를 입력하도록 한다.

해당 목록은 나의 취향 목록에도 적용되며 상대방의 취향목록에도 적용된다.
아래는 사용자의 목록으로 가는 과정이다.
- 헤더의 아바타를 클릭하면 나오는 드롭다운에 'MoiMoi, Go!' 버튼을 생성하고, 클릭하면 나의 취향 목록으로 이동한다. [ ]
- 메인 화면에 포스트를 클릭했을 때, 나오는 모달에서 사용자 아바타를 클릭하면 해당 사용자의 취향 목록으로 이동한다. 이 때, 그 포스팅 작성자가 나라면 나의 취향 목록으로 이동한다. [ ]

아래는 목록 내용이다.
- '취향 등록' 화면처럼 뒤로가기 버튼을 추가해준다. [ ]
- 상단에 해당 사용자의 프로필 이미지와 닉네임 소개를 보여준다. [ ]
- 해당 사용자의 팔로워, 팔로잉 수를 보여주고, 클릭하면 상세 목록을 볼 수 있게 페이지를 이동한다. [ ]  
- 해당 사용자가 내가 아닐 때, 팔로우 돼있으면 '팔로잉' 까만 버튼을, 팔로우 되어있지 않으면 '팔로우' 하얀 버튼을 보여준다. 클릭하면 팔로잉이 되도록 한다. [ ]
- 해당 사용자가 올린 취향 포스트 목록이 main 화면 처럼 보여지게 한다. 단, 탭은 제거된 상태이다. (유형 선택, 별점은 유지하도록 한다.)
- 클릭하면 메인화면의 상세보기처럼 모달이 뜨도록 한다. [ ]

## Database

- database는 vercel이 출시한 neon을 사용한다.
- table 정보

-- profiles: 사용자 프로필 테이블
CREATE TABLE "profiles" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
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

-- music_contents: 음악 콘텐츠 정보 테이블
CREATE TABLE "music_contents" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title TEXT NOT NULL,
artist TEXT,
release_year INTEGER,
image TEXT,
source TEXT, -- 'api' or 'manual'
source_id TEXT, -- ID from external API or 'taste-' prefixed UUID for manual
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(source, source_id)
);

-- movie_contents: 영화 콘텐츠 정보 테이블
CREATE TABLE "movie_contents" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title TEXT NOT NULL,
director TEXT,
release_year INTEGER,
image TEXT,
source TEXT, -- 'api' or 'manual'
source_id TEXT, -- ID from external API or 'taste-' prefixed UUID for manual
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(source, source_id)
);

-- book_contents: 책 콘텐츠 정보 테이블
CREATE TABLE "book_contents" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title TEXT NOT NULL,
author TEXT,
publication_year INTEGER,
image TEXT,
source TEXT, -- 'api' or 'manual'
source_id TEXT, -- ID from external API or 'taste-' prefixed UUID for manual
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(source, source_id)
);

-- photo_contents: 사진 콘텐츠 정보 테이블
CREATE TABLE "photo_contents" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title TEXT NOT NULL,
image TEXT, -- For uploaded images (base64 or URL)
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

-- posts: 게시물 및 별점 테이블
CREATE TABLE "posts" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
content_type_id UUID REFERENCES common_codes(id) ON DELETE RESTRICT, -- 콘텐츠 타입 코드 ID
music_content_id UUID REFERENCES music_contents(id) ON DELETE CASCADE,
movie_content_id UUID REFERENCES movie_contents(id) ON DELETE CASCADE,
book_content_id UUID REFERENCES book_contents(id) ON DELETE CASCADE,
photo_content_id UUID REFERENCES photo_contents(id) ON DELETE CASCADE,
comment TEXT NOT NULL,
rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- Rating is optional for photos
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
-- Ensure only one content type is linked per post
CONSTRAINT chk_one_content_type CHECK (
    (music_content_id IS NOT NULL AND movie_content_id IS NULL AND book_content_id IS NULL AND photo_content_id IS NULL) OR
    (music_content_id IS NULL AND movie_content_id IS NOT NULL AND book_content_id IS NULL AND photo_content_id IS NULL) OR
    (music_content_id IS NULL AND movie_content_id IS NULL AND book_content_id IS NOT NULL AND photo_content_id IS NULL) OR
    (music_content_id IS NULL AND movie_content_id IS NULL AND book_content_id IS NULL AND photo_content_id IS NOT NULL)
)
);

-- likes: 공감(좋아요) 테이블
CREATE TABLE "likes" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(user_id, post_id)
);

-- bookmarks: 찜하기 테이블
CREATE TABLE "bookmarks" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
content_type_id UUID REFERENCES common_codes(id) ON DELETE RESTRICT, -- 콘텐츠 타입 코드 ID
music_content_id UUID REFERENCES music_contents(id) ON DELETE CASCADE,
movie_content_id UUID REFERENCES movie_contents(id) ON DELETE CASCADE,
book_content_id UUID REFERENCES book_contents(id) ON DELETE CASCADE,
photo_content_id UUID REFERENCES photo_contents(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(user_id, content_type_id, music_content_id, movie_content_id, book_content_id, photo_content_id), -- Ensure uniqueness for content type and specific content
-- Ensure only one content type is linked per bookmark
CONSTRAINT chk_one_bookmark_content_type CHECK (
    (music_content_id IS NOT NULL AND movie_content_id IS NULL AND book_content_id IS NULL AND photo_content_id IS NULL) OR
    (music_content_id IS NULL AND movie_content_id IS NOT NULL AND book_content_id IS NULL AND photo_content_id IS NULL) OR
    (music_content_id IS NULL AND movie_content_id IS NULL AND book_content_id IS NOT NULL AND photo_content_id IS NULL) OR
    (music_content_id IS NULL AND movie_content_id IS NULL AND book_content_id IS NULL AND photo_content_id IS NOT NULL)
)
);

-- follows: 팔로우 관계 테이블
CREATE TABLE "follows" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
follower_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
following_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(follower_id, following_id)
);
