# Land app

근거: `apps/land/package.json`, `tsconfig.json`, `app/`, `lib/axios.ts`, `lib/QueryProvider.tsx`.

- Next 16 App Router 앱이다. `app/page.tsx`, `app/apply/page.tsx`,
  `app/apply/[id]/page.tsx`가 현재 페이지 근거다. layout이나 컴포넌트 파일만으로 새 URL을 만들지 않는다.
- `@/`는 앱 루트를 가리킨다. `components`, `hooks/apply`, `constants`, `lib`, `types`의 기존 경계를 따른다.
- server/client 경계와 기존 provider 위치를 확인한다. 브라우저 API·상호작용이 필요한 범위를
  확인한 후 client 경계를 바꾼다. member의 라우트 구성이나 인증 가드를 그대로 적용하지 않는다.
- API는 기존 `lib/axios.ts`, query 훅과 상수를 확인한다. 환경 변수는 이름/필요 여부만 확인하고 값을 출력하지 않는다.
- 개발 명령은 `pnpm --filter @clab/land dev` (스크립트 포트 6003)이다.
  lint와 Next build를 실행한다. 동적 지원 페이지의 실제 식별자/데이터는 화면 검증 때 확인한다.
