---
name: clab-work
description: C-Lab 구현·수정·리팩터링 요청을 패키지 범위와 완료 기준으로 정리하고 검증까지 수행한다.
---

# C-Lab work

1. [workflow.md](../../rules/workflow.md), [repository-structure.md](../../rules/repository-structure.md),
   [code-quality.md](../../rules/code-quality.md)를 읽고 사용자 요청·GitHub 이슈·현재 branch/status를 확인한다.
2. 대상에 따라 [member-app.md](../../rules/member-app.md), [land-app.md](../../rules/land-app.md),
   [design-system.md](../../rules/design-system.md)만 추가로 읽는다. config 변경은 소비 패키지도 확인한다.
3. 이슈 작업은 `pnpm agent:init` 성공 후 [task-card.md](../../templates/task-card.md)를
   `.agent-local/task-cards/<issue>.md`에 작성한다. 범위·완료 기준에 영향을 주는 모호함만 질문하고
   답변과 독립적인 조사는 진행한다. 작은 명시적 수정에는 카드를 생략할 수 있다.
4. 현재 구조에서 필요한 변경만 수행한다. 중요한 배치/규칙 판단과 한계는
   [worklog.md](../../templates/worklog.md)를 사용해 `.agent-local/worklogs/`에 기록한다.
5. [clab-test](../clab-test/SKILL.md)로 검증하고 요청 범위·실제 변경·검증·위험을 인계한다.
   PR 지원이 요청되면 [clab-pr](../clab-pr/SKILL.md)를 이어서 수행한다.
