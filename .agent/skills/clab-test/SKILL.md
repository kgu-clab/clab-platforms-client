---
name: clab-test
description: C-Lab 테스트·브랜치 검증·화면 확인 요청에서 실제 실행 가능한 검사와 증거를 정리한다.
---

# C-Lab test

1. [workflow.md](../../rules/workflow.md), [testing.md](../../rules/testing.md),
   [verification.md](../../rules/verification.md)를 읽는다. branch/status와 실제 diff를 확인한다.
2. 로컬 경로 검사도 포함하는 `pnpm agent:check-diff`와 `pnpm agent:verify`를 실행한다.
   base와 계층별 변경 목록을 확인하고 실제 PR base가 다르면 `--base <ref>`로 다시 수집한다.
3. 제안된 명령 중 변경에 필요한 검증과 기본 lint/build를 실행한다. 하네스 수정은 `pnpm agent:test`를 포함한다.
   존재하지 않는 app test를 실행하거나 Turbo의 작업 없음 결과를 테스트 성공으로 보고하지 않는다.
4. 화면 변경은 `pnpm agent:screenshots` 후 실제 라우트/스토리와 관련 상태를 확인한다.
   후보가 없으면 연결된 화면을 조사한다. 화면 변경 자체가 없으면 해당 없음으로 기록한다.
5. [worklog.md](../../templates/worklog.md)에 명령·종료 코드·오류 위치·화면 증거를 남긴다.
   파일은 `agent:init` 성공 후 `.agent-local/`에만 작성한다. 통과/실패/미실행과 남은 위험을 분리한다.
