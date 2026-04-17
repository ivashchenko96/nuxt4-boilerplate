# ============================================================
# Stage 1 — deps: install ALL dependencies (including devDeps)
# ============================================================
FROM node:22-alpine AS deps

# Install build tools needed for native modules
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy manifests only (maximises Docker layer caching)
COPY package.json package-lock.json ./

# Install all deps (dev + prod) needed for building
RUN npm ci --ignore-scripts


# ============================================================
# Stage 2 — builder: build the Nuxt application
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments that are ONLY needed at build time.
# Public NUXT_PUBLIC_* vars baked in here only as defaults;
# they can be overridden at runtime via environment variables.
ARG NODE_ENV=production
ARG NUXT_PUBLIC_APP_NAME="Enterprise Platform"
ARG NUXT_PUBLIC_APP_URL="http://localhost:3000"
ARG NUXT_PUBLIC_API_BASE_URL="http://localhost:3001"
ARG NUXT_PUBLIC_AUTH_BASE_URL="http://localhost:3001"

ENV NODE_ENV=${NODE_ENV}

# Build — Nitro's node-server preset produces a self-contained
# .output directory that bundles only what is needed at runtime.
RUN npm run build


# ============================================================
# Stage 3 — runner: lean production image
# ============================================================
FROM node:22-alpine AS runner

LABEL org.opencontainers.image.title="nuxt4-boilerplate"
LABEL org.opencontainers.image.description="Production-ready Nuxt 4 enterprise boilerplate"
LABEL org.opencontainers.image.url="https://github.com/ivashchenko96/nuxt4-boilerplate"

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

WORKDIR /app

# Copy the self-contained Nitro output — no node_modules needed here
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./

USER nuxtjs

# Nitro listens on this port by default; overrideable via NITRO_PORT / PORT
EXPOSE 3000

# ── Environment variables ─────────────────────────────────────────────────────
# IMPORTANT: Runtime-only secrets/config must be supplied via environment
# variables (or a secrets manager) at container start — never baked into the
# image.  Public vars that were NOT baked in during build can be overridden here.
#
# Example:
#   docker run -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
#              -e JWT_SECRET=<secret> \
#              nuxt4-boilerplate
# ─────────────────────────────────────────────────────────────────────────────

ENV NODE_ENV=production \
    NITRO_PORT=3000 \
    NITRO_HOST=0.0.0.0

# Health check — uses the /api/health endpoint defined in server/api/health.get.ts
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Graceful shutdown is handled by Nitro; Node receives SIGTERM from the
# container orchestrator and Nitro drains in-flight requests before exiting.
CMD ["node", "server/index.mjs"]
