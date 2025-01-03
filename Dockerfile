FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json env.mjs bun.lockb prisma/ ./
RUN ls -la
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
RUN ls -la 
COPY . .
RUN bun run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary build artifacts
COPY --from=builder --chown=$USER:$USER /app/.next ./app/.next
COPY --from=builder --chown=$USER:$USER /app/public ./public
COPY --from=builder --chown=$USER:$USER /app/node_modules ./node_modules
COPY --from=builder --chown=$USER:$USER /app/next.config.js ./next.config.js
COPY --from=builder --chown=$USER:$USER /app/package.json ./package.json

EXPOSE 3000
CMD ["bun", "start"]
