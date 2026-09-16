---
name: clab-team-learning
description: C-Lab 작업·리뷰에서 배운 점을 근거 있는 팀 컨벤션 후보로 정리할 때 사용한다.
---

# C-Lab team learning

1. [workflow.md](../../rules/workflow.md)와 관련된 기존 규칙을 읽는다. 일회성 실수와 반복 가능한 판단을 구분한다.
2. 실제 이슈·코드 위치·리뷰·검증 결과를 근거로 후보를 고른다. 개인 평가나 비공개 코칭 내용은 포함하지 않는다.
3. `pnpm agent:init` 성공 후 [team-learning-proposal.md](../../templates/team-learning-proposal.md)를
   `.agent-local/proposals/`에 작성한다. 적용 범위·예외·효과·검증 방법·승격 대상 파일을 명시한다.
4. 기존 규칙과 충돌하면 근거를 함께 적는다. 제안 생성만으로 `.agent/rules/`를 변경하지 않는다.
   사용자가 공유 규칙 반영을 요청한 경우 그 범위에서 수정하고 관련 참조와 검증을 갱신한다.
