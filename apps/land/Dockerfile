# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/land/package.json ./apps/land/
COPY packages/config/package.json ./packages/config/
COPY packages/design-system/package.json ./packages/design-system/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/land ./apps/land
COPY packages/config ./packages/config
COPY packages/design-system ./packages/design-system
COPY turbo.json ./

# Build the application
RUN pnpm --filter @clab/land build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/apps/land/.next/standalone ./
COPY --from=builder /app/apps/land/.next/static ./apps/land/.next/static
COPY --from=builder /app/apps/land/public ./apps/land/public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/land/server.js"]
