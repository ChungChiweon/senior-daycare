# SilverCare AI (실버케어 AI)

노인 주간보호센터(데이케어센터) 및 노인복지시설 사회복지사를 위한 AI 행정 및 보호자 소통 업무 자동화 SaaS MVP입니다. 어르신 당일 케어 정보(건강상태, 식사량, 투약 현황, 진행 프로그램)와 사진을 입력하면 일일 알림장, 급여제공기록지 초안, 가정통신문, 블로그 홍보글, 인스타그램 소식을 5종 동시 자동 생성합니다.

## 기술 스택

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, Storage
- AI provider adapter 구조: `mock`, `openai`
- Stripe 연동 준비 구조
- Vercel 배포 가능

## 주요 기능

- 사회복지사 전용 로그인 화면 (Email / Google OAuth)
- 통합 업무 생성: 어르신 케어 정보 1회 입력, 5종 행정/소통 문서 동시 생성
- 어르신 일일 알림장 (카카오톡 / 문자 메시지 복사 최적화)
- 급여제공기록지 초안 및 월간 소식지 생성
- 네이버 블로그 어르신 활동 소식 및 신규 수급자/이용자 모집 홍보글 생성
- 기관 정보 관리: 주간보호센터명, 대표자, 유형(주야간보호, 요양원, 복지관), 전화번호, 주소
- 사진 업로드 및 사진 기반 분위기 AI 감지 반영
- 모바일/데스크톱 최적화 반응형 대시보드 UI
- Supabase 미설정 시 로컬 더미 모드로 실행 가능

## 로컬 실행

```bash
npm install
npm run dev
```

PowerShell 실행 정책으로 `npm`이 막히면 Windows에서 아래처럼 실행할 수 있습니다.

```bash
npm.cmd install
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 환경변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO_MONTHLY=
```

`AI_PROVIDER=mock`이면 API 키 없이도 생성 플로우를 테스트할 수 있습니다. OpenAI를 쓰려면 `AI_PROVIDER=openai`와 `OPENAI_API_KEY`를 설정합니다.

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/schema.sql`을 실행합니다.
3. Authentication에서 Email provider를 활성화합니다.
4. Storage bucket `content-images`가 생성되었는지 확인합니다.
5. `.env.local`에 Supabase URL과 anon key를 입력합니다.

## 폴더 구조

```text
src/app
  (auth)/login        로그인
  (dashboard)         관리자 SaaS 화면
  (dashboard)/create  통합 콘텐츠 생성
  api/generate        AI 생성 API
  api/generate-batch  5종 동시 생성 API
src/components
  auth                인증 UI
  content             콘텐츠 생성 스튜디오
  dashboard           대시보드/설정
  layout              사이드바/모바일 내비게이션
  ui                  기본 UI 컴포넌트
src/lib
  ai                  AI provider 교체 계층
  supabase            Supabase 클라이언트
  stripe              결제 준비 설정
src/types             공통 타입
supabase/schema.sql   DB, RLS, Storage 설계
```

## AI 교체 구조

`src/lib/ai/index.ts`에서 provider를 선택합니다. Claude 등 다른 API를 추가하려면 `AiProvider` 인터페이스를 구현한 파일을 추가하고 환경변수 기준 분기만 확장하면 됩니다.

## 구독 준비

`src/lib/stripe/config.ts`와 `subscriptions` 테이블에 Stripe 고객/구독 ID를 저장할 수 있는 구조를 포함했습니다. MVP에서는 실제 결제 플로우를 호출하지 않습니다.

## 배포

Vercel에 배포할 때 환경변수를 동일하게 등록합니다.

```bash
npm run build
```

빌드가 성공하면 Vercel Git 연동 또는 CLI 배포를 사용할 수 있습니다.
