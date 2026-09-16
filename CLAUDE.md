# C-Lab / CoreTeam Claude entrypoint

[AGENTS.md](AGENTS.md)의 자연어 라우팅과 공통 운영 계약을 읽고 같은 `.agent/` 스킬을 사용한다.
구현, 검증, PR 초안, 리뷰 반영, 팀 학습 중 구체적인 요청에 맞는 스킬만 로드한다.
사용자에게 하네스 명령 실행을 떠넘기지 않는다.

사용법과 보조 스크립트의 한계는 [.agent/README.md](.agent/README.md)를 참고한다.
임시 기록은 ignore 확인 후 `.agent-local/`에 보관하고 공유 규칙과 분리한다.
