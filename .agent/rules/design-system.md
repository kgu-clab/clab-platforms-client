# Design system

근거: `packages/design-system/package.json`, `src/index.ts`, `src/components/`,
`.storybook/main.ts`, `.storybook/preview.tsx`, `packages/config/theme.css`.

- 공용 컴포넌트는 기존 구현·stories와 package exports를 먼저 확인한다. 루트 export 외에
  `components`, `utils`, `button`, `input`, `textarea` 서브패스가 있다. 공개 API 변경은 소비 앱도 확인한다.
- 스타일은 기존 `@clab/config/theme.css`와 컴포넌트 변형 방식을 따른다.
  테마 정의는 design-system이 아니라 `packages/config`에 있다.
- Storybook은 React/Vite 기반이며 preview가 공유 테마와 `MemoryRouter`를 제공한다.
  story의 router context가 Next 소비 앱에서도 동일하다고 가정하지 않는다.
- `pnpm --filter @clab/design-system storybook`은 포트 6006 개발 명령이다.
  `build`와 `build-storybook`은 모두 Storybook 빌드이며 배포용 라이브러리 번들 검증과 동일하지 않다.
- 이 패키지에는 lint/test 스크립트가 없다. 공용 export·CSS·테마 변경은 Storybook과 두 앱의
  build 및 관련 화면을 확인한다. 접근성 addon의 `test: 'todo'`를 접근성 통과 보장으로 해석하지 않는다.
