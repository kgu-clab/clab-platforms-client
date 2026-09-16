# Code quality

근거: 루트 `.prettierrc`, `apps/member/.prettierrc`, `packages/config/eslint/`,
`apps/land/eslint.config.mjs`, `apps/member/eslint.config.js`,
`apps/land/tsconfig.json`, `apps/member/tsconfig*.json`, `packages/design-system/tsconfig.json`.

- 해당 패키지의 ESLint·TypeScript 설정과 주변 코드 형식을 따른다. root/member Prettier 설정은
  서로 다르므로 하나의 인용부호·import 규칙을 모든 패키지에 강요하지 않는다.
- member는 공유 `reactBase` 뒤에 React Refresh의 Vite 설정과 Storybook 설정을 추가한다.
  land는 공유 `base`에서 import 플러그인 등록 항목을 제외한 뒤 공유 `react`,
  Next core-web-vitals, Next TypeScript 설정, 출력물 ignore를 차례로 조합한다.
  설정 차이를 파일 배치 관습으로 오해하지 않는다.
- TypeScript 설정은 land, member, design-system에 있으며 config에는 `tsconfig`가 없다.
  모든 패키지에 같은 설정 파일이나 검사 명령이 있다고 가정하지 않는다.
- 타입/컴포넌트/API의 기존 export와 별칭을 먼저 확인하고 최소 범위로 수정한다.
  새로운 폴더 계층이나 공용 추상화는 실제 필요가 있을 때만 만든다.
- UI 수정 시 기존 이름·레이블·키보드 접근·loading/error/empty 상태를 함께 확인한다.
  이것은 변경 검토 지침이며 모든 기존 화면이 이를 만족한다는 보장은 아니다.
- 포맷은 변경 파일만 검사한다. 이슈와 무관한 lint 정리·대규모 포맷·의존성 추가를 섞지 않는다.
- `.agent/scripts/*.mjs`는 현재 Turbo lint 대상과 루트 format glob (`**/*.{ts,tsx,md}`) 밖이다.
  하네스 변경은 `pnpm agent:test`와 변경 파일의 명시적 `prettier --check`가 필요하다.
  JSON·Markdown·MJS는 Prettier로 검사하고, 기본 parser가 없는 `.gitignore`는
  `prettier --check --ignore-unknown`의 건너뜀을 기록한 뒤 경로/공백 검사를 별도로 확인한다.
- Git 경로는 인자 배열/NUL 구분으로 다룬다. 파일 경로를 shell 문자열에 삽입하거나 환경 값,
  로컬 기록, 생성물, 비밀을 공유 diff에 넣지 않는다.
