---
name: clab-review-fix
description: C-Lab 리뷰 코멘트 반영·답변 요청을 현재 코드와 대조하고 필요한 수정 및 재검증으로 연결한다.
---

# C-Lab review fix

1. [workflow.md](../../rules/workflow.md)와 [repository-structure.md](../../rules/repository-structure.md)를 읽고
   실제 GitHub 코멘트·대상 코드·현재 branch/status를 확인한다.
2. `pnpm agent:init` 성공 후 [review-fix-card.md](../../templates/review-fix-card.md)를
   `.agent-local/review-fixes/`에 작성한다. 코멘트가 현재도 유효한지, 수용/부분 수용/미반영 근거를 적는다.
3. 관련 패키지 규칙을 읽고 유효한 범위만 수정한다. 이미 해결되었으면 추가 변경 없이 근거를 남긴다.
4. [clab-test](../clab-test/SKILL.md)로 영향 범위를 재검증한다.
5. 변경·검증·남은 쟁점을 담은 답변 초안을 카드에 작성한다. 게시 요청이 없으면 댓글을 보내지 않는다.
   반복 판단은 [clab-team-learning](../clab-team-learning/SKILL.md)의 로컬 제안으로 남긴다.
