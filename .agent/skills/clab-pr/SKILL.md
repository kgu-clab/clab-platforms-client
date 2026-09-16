---
name: clab-pr
description: C-Lab PR 초안·설명 요청에서 이슈 범위, 브랜치 전체 변경, 실제 검증 증거를 리뷰 가능한 본문으로 만든다.
---

# C-Lab PR draft

1. [workflow.md](../../rules/workflow.md), [verification.md](../../rules/verification.md)를 읽고
   GitHub 이슈, 실제 diff, 기존 로컬 worklog를 확인한다.
2. `pnpm agent:pr-evidence`로 base와 branch/staged/unstaged/untracked 경로를 수집한다.
   unknown base는 임의로 채우지 않는다. 실제 base ref를 확인할 수 있으면 `--base <ref>`를 사용한다.
   종료 코드가 0이 아니거나 `ok: false`이면 증거 수집 실패로 기록하고 PR 준비 완료로 처리하지 않는다.
   의심 경로는 값/내용을 출력하지 않고 사용자 권한 범위에서 해결한 뒤 재실행한다.
   `ok: true`도 lint/build/화면 검증 통과를 뜻하지 않는다.
3. `pnpm agent:init` 성공 후 [pr-draft.md](../../templates/pr-draft.md)를
   `.agent-local/pr-drafts/<issue>.md`에 작성한다. 저장소 PR 템플릿의 Summary/Tasks/ETC/Screenshot을 유지한다.
4. 이슈 연결, 문제와 결과 동작, 실제 검증·미검증, 리뷰 초점을 적는다.
   증거 도구는 검사를 실행하지 않으므로 성공 여부는 실행 로그에서만 가져온다.
5. 커밋 메시지 제안은 실행 중인 emoji/scope 규칙을 따른다. 게시나 push는 사용자 권한 범위에서만 수행한다.
