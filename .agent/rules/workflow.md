# Workflow

근거: `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`,
`commitlint.config.js`, `lefthook.yml`.

1. 사용자 요청과 GitHub Issue/PR의 범위·완료 기준을 확인한다. 현재 브랜치와
   `git status --short`를 읽고 기존 변경을 보존한다. 새 브랜치나 티켓 체계를 임의로 만들지 않는다.
2. 이슈 작업에는 [task-card.md](../templates/task-card.md)를 사용해 목표, 대상 패키지,
   제외 범위, 완료 기준을 정리한다. 작고 명확한 변경은 대화 기록으로 충분하다.
3. 작업 중 중요한 판단과 실제 검증 결과는 [worklog.md](../templates/worklog.md)에 남긴다.
   `.agent/scripts/init.mjs` 성공 후 `.agent-local/`에만 작성한다. 비밀 값과 운영 URL은 기록하지 않는다.
4. 인계에는 요청 범위, 실제 변경, 통과/실패/미실행 검증, 남은 위험을 구분한다.
5. commit/push/PR 생성·외부 댓글·공유 규칙 승격은 사용자 지시 범위에서만 수행한다.
   기존 승인을 반복해서 묻지 않는다. 초안 요청 자체를 게시 권한으로 해석하지 않는다.

## 커밋 검증 권위와 알려진 불일치

실행 설정은 `이모지 (scope) 설명`을 검증한다. 예: `:sparkles: (*) 코어팀 하네스 추가`.
허용 scope: `land`, `member`, `config`, `design-system`, `*`, `admin`.
헤더는 100자 이하이며 설명은 비어 있거나 마침표로 끝나면 안 된다.
`lefthook.yml`의 commit-msg가 `commitlint.config.js`를 실행한다.

`CONTRIBUTING.md`는 `<type>[optional package scope]: <description>`을 안내하므로 서로 다르다.
현재 검증 기준은 실행 설정이다. 이 불일치를 숨기거나 티켓 범위 밖에서 문서를 고치지 않는다.
PR 본문은 기존 GitHub 템플릿에 맞추고 이슈 번호를 연결한다. 별도의 강제 PR 제목 형식은 만들지 않는다.

pre-commit에는 lint와 `pnpm format`이 있으며 format은 자동 스테이징한다.
스테이징 금지 작업에서는 훅을 검증 수단으로 실행하지 말고 `prettier --check`를 사용한다.
