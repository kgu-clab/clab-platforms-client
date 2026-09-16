# Testing

근거: root/land/member/design-system/config `package.json`, `turbo.json`,
`apps/member/vite.config.ts`, `packages/design-system/.storybook/`.

- 루트 `test`는 `turbo run test`지만 현재 workspace에는 `test` 스크립트가 없다.
  member의 Vitest/Playwright 의존성과 test 설정, Storybook의 Vitest addon 존재를
  실행 가능한 제품 테스트나 통과 증거로 보고하지 않는다.
- 이 하네스의 `pnpm agent:test`는 Node 내장 `node:test`로 `.agent/scripts/harness.test.mjs`를 실행한다.
  제품 코드의 검증 범위를 대신하지 않는다.
- 현재 helpers/tests는 POSIX 환경인 macOS/Linux를 전제로 한다. 제안 명령의 shell quoting,
  테스트의 `/dev/null` Git 설정과 symlink fixture가 이 전제에 의존하며 Windows 지원은 검증하지 않았다.
- `.agent/scripts/*.mjs`는 현재 Turbo lint와 루트 format glob의 대상이 아니다.
  `pnpm agent:test`와 변경 파일을 지정한 Prettier check를 별도로 실행한다.
- 결정적 변환, Git 변경 수집, base 선택, 경로 보호 같은 실패 위험은 작은 단위/격리 Git 테스트로 검증한다.
  네트워크, 사용자 저장소 설정, 실제 환경 값, 실행 순서에 의존하지 않는다.
- 작은 문서/스타일 수정에 구현을 그대로 복제하는 테스트는 추가하지 않는다.
  제품 테스트 도입은 실제 요청과 기존 실행 환경을 확인한 후 별도 범위로 판단한다.
- 검증 절차와 보고 기준은 [verification.md](verification.md)를 따른다.
