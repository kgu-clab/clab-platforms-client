# Member app

근거: `apps/member/package.json`, `vite.config.ts`, `src/app/main.tsx`,
`src/app/route/config.tsx`, `src/constants/route.ts`, `src/api/config/`.

- Vite/React Router 7 앱이다. 라우트는 `src/app/route/config.tsx`의 `createBrowserRouter` 구성과
  `src/constants/route.ts`를 함께 확인한다. 페이지 파일명만으로 URL을 추정하지 않는다.
- `@/`는 `src/`를 가리킨다. 페이지는 `src/pages`, 화면 컴포넌트는 `src/components`,
  API 호출은 `src/api`, 타입은 `src/types`, 유틸리티는 `src/utils`를 먼저 확인한다.
- 상태·훅·컨텍스트는 `src/model`과 `src/hooks`에 나뉘어 있다. 기존 책임과 사용처를 확인하며
  모든 훅/상태를 model로 모으는 규칙으로 해석하지 않는다. 상수는 `src/constants`,
  mock 데이터는 `src/mock`의 기존 경계를 따른다.
- 보호 라우트는 `AuthProvider protect`, 관리 화면은 `AdminGuard` 사용을 확인한다.
  표시만 보고 접근 가능 여부나 서버 권한을 추정하지 않는다.
- API는 `src/api/config`의 ky 클라이언트와 기존 타입/변환을 따른다. QueryClient는
  `src/app/main.tsx`에 있다. land의 axios 설정을 member 규칙으로 복사하지 않는다.
- 개발 명령은 `pnpm --filter @clab/member dev` (설정 포트 6001), build는 `tsc -b && vite build`다.
  lint/build를 확인하고 제품 test 스크립트가 없다는 점은 [testing.md](testing.md)를 따른다.
