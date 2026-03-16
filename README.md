# Budget Companion

예산 현황, 지출 내역, 위시리스트를 함께 관리하는 개인용 예산 관리 앱입니다.

## 현재 포함된 기능

- 대시보드
- 예산 생성
- 예산 항목 추가
- 지출 내역 기록
- 위시리스트 저장
- 이메일/비밀번호 회원가입 및 로그인
- Supabase 연동 구조

## 실행 방법

```bash
npm install
npm run dev
```

## 먼저 해야 할 일

### 1. Supabase 프로젝트 만들기

1. [Supabase](https://supabase.com/)에 로그인합니다.
2. `New project`를 눌러 새 프로젝트를 만듭니다.
3. `Project Settings -> API`로 이동합니다.
4. 아래 두 값을 복사합니다.
   - `Project URL`
   - `anon public key`

### 2. 환경변수 넣기

루트에 `.env.local` 파일을 만들고 아래처럼 채웁니다.

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key
```

### 3. DB 테이블 만들기

1. Supabase에서 `SQL Editor`를 엽니다.
2. [supabase/schema.sql](/C:/Users/lds43/OneDrive/문서/New%20project/supabase/schema.sql) 내용을 실행합니다.

## 로그인 설정

이 프로젝트는 `이메일 + 비밀번호` 로그인 방식만 사용합니다.

Supabase에서 확인할 것:

1. `Authentication -> Providers -> Email`로 이동
2. `Enable Email provider` 활성화
3. 필요하면 `Confirm email` 여부 선택
4. `Authentication -> URL Configuration`에서 개발 주소 등록

개발용 주소:

```txt
http://localhost:3000
http://localhost:3000/auth/callback
```

## 다음 추천 작업

1. 폼 에러 메시지 개선
2. 예산 수정/삭제
3. 지출 필터와 검색
4. 위시리스트 이미지 업로드
5. 차트 고도화
