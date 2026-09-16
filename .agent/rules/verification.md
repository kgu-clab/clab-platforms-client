# Verification

근거: `.github/workflows/ci.yml`은 Node 20에서 `pnpm lint`, `pnpm build`만 실행한다.
현재 실행 가능한 범위별 명령:

| 변경 범위             | 확인 명령                                                                      |
| --------------------- | ------------------------------------------------------------------------------ |
| land                  | `pnpm --filter @clab/land lint`, `pnpm --filter @clab/land build`              |
| member                | `pnpm --filter @clab/member lint`, `pnpm --filter @clab/member build`          |
| design-system         | `pnpm --filter @clab/design-system build` (Storybook), 두 소비 앱의 lint/build |
| config·workspace 설정 | 두 앱 lint/build + design-system build; config 자체 명령 없음                  |
| 하네스                | `pnpm agent:test`, `pnpm agent:check`, 변경 파일 Prettier check                |

인계 전 기본 검증은 `pnpm lint`, `pnpm build`다. 격리된 작업에서 범위별 명령만 실행했다면
루트 검증을 생략한 이유를 적는다. 하네스 변경도 CI 통과를 추정하지 않는다.
제안 도구는 실제 package scripts를 읽어 존재하는 명령만 고른다. 앱 `test`/`typecheck`를 만들어 제안하지 않는다.

1. `pnpm agent:verify`로 base와 모든 변경 계층을 확인한다. unknown이면 범위가 불완전함을 명시한다.
2. 로컬 파일·diff 위생을 확인하고 선택한 검증을 실행한다. Prettier는 파일 인자를 안전하게 전달한다.
3. 명령, 종료 코드, 관련 오류 위치/이유를 기록한다. 통과, 실패, 미실행, 미검증을 나눈다.
   기존 오류는 근거를 남기고 해당 이슈 밖의 수정을 하지 않는다. 의존성이나 환경 부재도 실패/차단 사유다.
   diff 위생의 `failedLayers`는 계층과 해당 파일 경로를 함께 제공한다. branch 계층은
   `merge-base..HEAD`이므로 병합된 이력도 포함할 수 있다. 경로와 이력을 대조하기 전에는
   그 실패를 현재 티켓의 변경 탓으로 기록하지 않는다.
4. UI 변경은 `make-screenshot-plan.mjs` 결과를 시작점으로 소비 라우트/스토리를 확인한다.
   동적 경로는 실제 로컬 데이터와 접근 권한을 확인한 후 사용한다. desktop/mobile 크기는 후보일 뿐 제품 요구사항이 아니다.
5. 변경과 관련된 화면 상태·콘솔 오류를 실제로 확인한다. 후보 목록, Storybook 빌드,
   타입 검증을 브라우저 화면 검증으로 보고하지 않는다. 화면 변경이 없으면 해당 없음으로 기록한다.

로그에 비밀 값이나 운영 URL을 남기지 않는다. 도구의 경로 기반 검사만으로 비밀 부재를 보증하지 않는다.
PR 증거의 `ok`는 로컬 경로 검사의 결과이며 lint/build/화면 검증 성공을 뜻하지 않는다.
