# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/member/package.json ./apps/member/
COPY packages/config/package.json ./packages/config/
COPY packages/design-system/package.json ./packages/design-system/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/member ./apps/member
COPY packages/config ./packages/config
COPY packages/design-system ./packages/design-system
COPY turbo.json ./

# Build the application
RUN pnpm --filter @clab/member build

# Production stage
FROM nginx:alpine AS runner

# Copy built files to nginx
COPY --from=builder /app/apps/member/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/member/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
