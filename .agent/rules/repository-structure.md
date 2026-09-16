# Repository structure

근거: `pnpm-workspace.yaml`, 루트와 각 패키지의 `package.json`, `turbo.json`.
실행 기준은 Node 20.x / pnpm 10.15.0이다. 다른 런타임으로 검증하면 차이를 기록한다.

| 위치                                             | 실제 경계                                                                                                                                | 추가 규칙                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `apps/land` (`@clab/land`)                       | Next 16 App Router, React 19; `app/`, `components/`, `hooks/`, `lib/`, `constants/`, `types/`                                            | [land-app.md](land-app.md)                                             |
| `apps/member` (`@clab/member`)                   | Vite, React 19, React Router 7; `src/` 아래 `app`, `pages`, `components`, `model`, `hooks`, `api`, `types`, `utils`, `constants`, `mock` | [member-app.md](member-app.md)                                         |
| `packages/design-system` (`@clab/design-system`) | 공용 React 컴포넌트, 소스 export, Storybook                                                                                              | [design-system.md](design-system.md)                                   |
| `packages/config` (`@clab/config`)               | `theme.css`, ESLint base/react 설정; 자체 scripts 없음                                                                                   | [code-quality.md](code-quality.md), [verification.md](verification.md) |

앱별 라우팅·데이터 흐름은 해당 앱 안에서 기존 패턴을 따른다. 앱 전용 기능을 임의로 공용 패키지로
이동하지 않는다. 공용 export/테마/설정 변경은 소비자인 두 앱과 Storybook에 미치는 영향을 확인한다.
`admin`은 커밋 scope이며 별도 앱이 아니다. 실제 관리 화면은 member 안에 있다.
