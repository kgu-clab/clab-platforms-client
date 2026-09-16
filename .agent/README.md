# C-Lab / CoreTeam repo-local harness

진입점은 [AGENTS.md](../AGENTS.md)와 [CLAUDE.md](../CLAUDE.md)다.
자연어 요청 → 필요한 스킬/규칙 → 범위에 맞는 변경 → 실제 검증 → 인계 순서로 사용한다.
이 디렉터리는 진입점이 읽는 저장소 내부 지침이며 전역 스킬 설치가 필요하지 않다.

- `skills/`: 작업, 검증, PR 초안, 리뷰 반영, 팀 학습 절차
- `rules/`: 실행 설정과 실제 소스에 근거한 규칙; 패키지 경계는 [repository-structure.md](rules/repository-structure.md)
- `scripts/`: Node 내장 모듈과 로컬 Git만 사용하는 보조 도구
- `templates/`: 필요한 작업 기록의 출발점
- `.agent-local/` (저장소 루트): 무시되는 작업 카드·로그·초안·화면 증거·제안

현재 helpers/tests는 POSIX 환경인 macOS/Linux를 전제로 한다. shell quoting과 테스트의
`/dev/null`·symlink 사용 때문에 Windows에서의 동작은 검증하지 않았다.

## 에이전트용 명령

| 명령                     | 결과                                                            |
| ------------------------ | --------------------------------------------------------------- |
| `pnpm agent:init`        | ignore/추적 여부 확인 후 로컬 작업 폴더 생성; 재실행 시 보존    |
| `pnpm agent:check`       | 로컬 파일 검사 + diff 위생 검사                                 |
| `pnpm agent:check-local` | ignore 누락, 추적된 로컬/환경 파일, 의심 경로 검사              |
| `pnpm agent:check-diff`  | 같은 경로 검사 + 커밋/인덱스/작업 트리 공백 오류 검사           |
| `pnpm agent:verify`      | 변경 범위와 실제 package scripts에 맞는 명령 제안               |
| `pnpm agent:screenshots` | 근거 있는 화면 후보와 수동 확인 대상 출력                       |
| `pnpm agent:pr-evidence` | base, 계층별 변경 경로, 검증 제안 출력; 의심 경로가 있으면 실패 |
| `pnpm agent:test`        | 오프라인 Node 내장 테스트                                       |

`agent:check-local`, `agent:check-diff`, `agent:verify`, `agent:screenshots`,
`agent:pr-evidence`는 `--base <ref>`를 받는다. 예: `pnpm agent:pr-evidence --base origin/main`.
기본 base 순서는 로컬 `origin/HEAD`, `origin/main`, `origin/develop`, `main`, `develop`이다.
현재 체크아웃한 로컬 브랜치 이름과 같은 후보는 자동 선택에서 제외한다.
다른 ref가 HEAD와 같은 커밋을 가리킨다는 이유로 제외하지는 않는다.
기준은 merge-base이며 fetch는 하지 않는다. 후보가 없으면 base를 unknown으로 표시하고
staged/unstaged/untracked만 수집한다. 잘못 지정한 명시적 base는 실패한다. 임의의 이전 커밋을 기준으로 삼지 않는다.
`--base`는 현재 체크아웃의 비교 기준만 바꾸며 리뷰 대상 브랜치를 전환하지 않는다.
실제 PR base와 자동 선택이 다르거나 로컬 ref가 오래되었으면 기준과 한계를 기록한다.

변경 목록은 branch diff, staged, unstaged, untracked의 합집합이다.
branch 계층은 `merge-base..HEAD`이며 병합된 이력도 포함할 수 있다. diff 위생 실패의
`failedLayers`는 계층과 파일 경로를 함께 제공하므로 이력을 확인한 뒤 티켓과의 관계를 판단한다.
rename은 삭제/추가 양쪽 경로로 취급한다. Git 인자는 shell을 거치지 않고 NUL 구분 경로를 읽는다.
출력은 JSON이며 파일 내용, 환경 값, 커밋 본문, 원격 URL을 수집하지 않는다.
경로 검사는 환경 파일, `.agent-local`, 캐시·키 파일 등의 이름 기반 검사로, 전체 비밀 탐지기가 아니다.
기존에 추적된 루트 `.env.example`과 `.npmrc`는 공유 설정이므로 변경이 없을 때만 제외한다.
두 파일이 변경 목록에 있으면 검토 대상으로 표시한다. 값은 읽거나 출력하지 않는다.
삭제 경로도 보수적으로 표시하므로 제거 목적의 변경은 인계에 설명한다.
untracked 공백 검사에서는 의심 경로 및 심볼릭 링크의 내용을 읽지 않는다.
추적 파일은 Git diff 검사에 포함하되 진단 원문 대신 계층과 경로만 출력한다.
PR 증거도 추적 파일과 변경 경로에 같은 로컬 경로 검사를 적용하며 의심 경로가 있으면
`ok: false`, 종료 코드 1로 실패한다. `ok: true`는 경로 검사 성공만 뜻한다.

package discovery는 루트와 [lib.mjs](scripts/lib.mjs)의 `packagePaths`에 명시한 네 패키지를 읽는다.
패키지가 바뀌면 이 목록과 규칙을 함께 갱신한다. 예상 manifest를 읽거나 JSON으로 파싱하지 못하면
작업 종류와 저장소 기준 상대 경로만 출력하고 실패한다. 원본 오류나 파일 내용은 출력하지 않는다.

검증 제안은 실행 결과가 아니다. PR 증거 도구도 테스트를 실행하거나 성공을 추정하지 않는다.
화면 도구는 현재 존재하는 변경된 land `page.*`만 경로로 변환한다. 동적 세그먼트는
패턴으로 남긴다. member, 공유 컴포넌트, layout, Storybook은 소비 화면/스토리를 직접 확인한다.
후보가 없으면 빈 목록을 유지한다. 실제 화면 확인 결과는 별도로 기록한다.
`needsInspection`은 페이지·컴포넌트·라우터·스타일·화면 자산 같은 UI 후보로 제한한다.
`package.json`, member `src/api/**`, land `lib/axios.ts`만 바뀌면 화면 검사를 요구하지 않는다.

`.agent/scripts/*.mjs`는 현재 `pnpm lint`의 Turbo 작업과 루트 format glob
(`**/*.{ts,tsx,md}`)에 포함되지 않는다. `pnpm agent:test`와 변경 파일을 명시한 Prettier check가 필요하다.
`.gitignore`는 기본 Prettier parser가 없으므로 `--ignore-unknown`으로 건너뜀을 명시하고
로컬 경로 및 diff 위생 검사로 확인한다. `pnpm format`은 이 검증을 대신하지 않는다.

`init`만 로컬 폴더를 쓴다. 나머지 도구는 읽기 전용이다. 실행 결과를 보관할 때도
먼저 `agent:init`을 성공시키고 `.agent-local/worklogs/` 등을 사용한다.
