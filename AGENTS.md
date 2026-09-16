# C-Lab / CoreTeam agent entrypoint

자연어 요청에서 가장 구체적인 의도를 먼저 골라 해당 스킬을 읽는다.
명령어 암기를 요구하지 않고 필요한 보조 스크립트는 에이전트가 실행한다.

- 구현·수정·작업 → [.agent/skills/clab-work/SKILL.md](.agent/skills/clab-work/SKILL.md)
- 테스트·검증·화면 확인 → [.agent/skills/clab-test/SKILL.md](.agent/skills/clab-test/SKILL.md)
- PR 초안·설명 → [.agent/skills/clab-pr/SKILL.md](.agent/skills/clab-pr/SKILL.md)
- 리뷰 반영·답변 → [.agent/skills/clab-review-fix/SKILL.md](.agent/skills/clab-review-fix/SKILL.md)
- 팀 컨벤션·학습 후보 → [.agent/skills/clab-team-learning/SKILL.md](.agent/skills/clab-team-learning/SKILL.md)

공통 운영 계약은 [.agent/rules/workflow.md](.agent/rules/workflow.md),
패키지 경계는 [.agent/rules/repository-structure.md](.agent/rules/repository-structure.md)를 따른다.
로컬 산출물은 ignore 확인 후 `.agent-local/`에만 보관한다.
사용자가 지정한 범위·브랜치·쓰기 권한을 유지한다.
