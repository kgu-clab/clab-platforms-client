# Docker 배포 가이드

이 문서는 clab-platforms-v2 프로젝트의 Docker 배포 방법을 설명합니다.

## 프로젝트 구조

- **land**: Next.js 기반 랜딩 페이지 (포트 6003)
- **member**: Vite + React 기반 멤버 페이지 (포트 6001)

## 사전 요구사항

- Docker 20.10 이상
- Docker Compose 2.0 이상

필요에 따라 환경 변수를 수정하세요.

## 빌드 및 실행

### 전체 서비스 실행

```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build
```

### 개별 서비스 실행

```bash
# land 앱만 실행
docker-compose up land

# member 앱만 실행
docker-compose up member
```

## 서비스 접근

- **Land App**: http://localhost:6003
- **Member App**: http://localhost:6001

## 개발 모드

Docker는 프로덕션 빌드를 위한 것입니다. 개발 모드는 로컬에서 실행하세요:

```bash
pnpm install
pnpm dev
```

## 유용한 명령어

```bash
# 로그 확인
docker-compose logs -f

# 특정 서비스 로그 확인
docker-compose logs -f land
docker-compose logs -f member

# 서비스 중지
docker-compose down

# 볼륨 포함 완전 삭제
docker-compose down -v

# 이미지 재빌드
docker-compose build --no-cache

# 실행 중인 컨테이너 확인
docker-compose ps
```

## 프로덕션 배포

프로덕션 환경에서는 다음을 고려하세요:

1. **환경 변수**: 실제 프로덕션 API URL로 변경
2. **리버스 프록시**: Nginx 또는 Traefik을 사용하여 SSL 종료 및 라우팅
3. **로그 관리**: 중앙 집중식 로깅 시스템 구성
4. **모니터링**: 헬스체크 및 메트릭 수집 설정

## 트러블슈팅

### 빌드 실패

```bash
# 캐시 없이 재빌드
docker-compose build --no-cache
```

### 포트 충돌

`.env` 파일이나 `docker-compose.yml`에서 포트를 변경하세요.

### 의존성 문제

```bash
# pnpm-lock.yaml 업데이트 후 재빌드
docker-compose down
docker-compose up --build
```
