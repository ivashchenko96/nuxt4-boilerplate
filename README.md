# nuxt4-boilerplate

A **production-ready Nuxt 4 enterprise boilerplate** designed to serve as the foundation for:

- Company / public-facing websites
- Admin / dashboard applications
- Multi-tenant SaaS platforms
- Multilingual product experiences

[![CI](https://github.com/ivashchenko96/nuxt4-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/ivashchenko96/nuxt4-boilerplate/actions/workflows/ci.yml)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Development](#development)
6. [Code Quality and Git Hooks](#code-quality-and-git-hooks)
7. [Building and Running in Production](#building-and-running-in-production)
8. [Docker](#docker)
9. [Deployment Targets](#deployment-targets)
10. [Reverse Proxy Setup](#reverse-proxy-setup)
11. [Multi-Environment Strategy](#multi-environment-strategy)
12. [Architecture Overview](#architecture-overview)
13. [CI/CD](#cicd)
14. [Release and Versioning](#release-and-versioning)
15. [Security Guidance](#security-guidance)
16. [Contributing](#contributing)

---

## Quick Start

```bash
# Prerequisites: Node 24+, npm 11+
git clone https://github.com/ivashchenko96/nuxt4-boilerplate.git
cd nuxt4-boilerplate
npm install          # also installs Husky Git hooks
cp .env.example .env # fill in your values
npm run dev          # starts dev server at http://localhost:3000
```

---

## Tech Stack

| Category    | Technology                                           |
|-------------|------------------------------------------------------|
| Framework   | Nuxt 4 + Vue 3                                       |
| UI          | @nuxt/ui + Tailwind CSS v4                           |
| State       | Pinia                                                |
| Auth        | JWT (external backend), refresh token strategy       |
| i18n        | @nuxtjs/i18n (EN, DE)                                |
| SEO         | @nuxtjs/sitemap + @nuxtjs/robots                     |
| Linting     | ESLint + @nuxt/eslint                                |
| Git Hooks   | Husky + lint-staged + commitlint                     |
| Types       | TypeScript 5 + vue-tsc                               |
| Container   | Docker (multi-stage) + Docker Compose                |
| CI          | GitHub Actions                                       |

---

## Project Structure

```
nuxt4-boilerplate/
├── app/                          # Nuxt 4 srcDir
│   ├── components/               # base/, dashboard/, shared/, website/
│   ├── composables/              # useAuth, useApiClient, useSeo, useTenant, usePermissions
│   ├── layouts/                  # default, dashboard, auth
│   ├── middleware/               # auth.ts, require-auth.global.ts, tenant.global.ts, permissions.ts
│   ├── pages/                    # File-based routing
│   ├── plugins/                  # auth.client.ts (JWT service)
│   └── stores/                   # auth, tenant, ui (Pinia)
├── server/
│   ├── api/health.get.ts         # Health check endpoint
│   └── middleware/security.ts    # Security response headers
├── shared/
│   ├── types/index.ts            # Shared TypeScript types
│   └── utils/index.ts            # Pure utilities
├── locales/en.json               # English translations
├── locales/de.json               # German translations
├── public/icons/                 # App icons
├── deploy/
│   ├── nginx/nuxt4-app.conf      # Nginx reverse proxy config
│   ├── caddy/Caddyfile           # Caddy reverse proxy config
│   └── vercel/vercel.json        # Vercel deployment config
├── .github/
│   ├── workflows/ci.yml          # CI: lint + typecheck + build
│   ├── workflows/deploy-production.yml
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
├── .husky/                       # pre-commit, commit-msg, pre-push hooks
├── Dockerfile                    # Multi-stage production image
├── docker-compose.yml            # Local dev orchestration
├── .dockerignore
├── Procfile                      # Heroku / Dokku / Railway
├── .env.example
├── commitlint.config.mjs
├── .editorconfig
├── CONTRIBUTING.md
└── CHANGELOG.md
```

---

## Environment Variables

Copy `.env.example` to `.env` for local development. **Never commit `.env`**.

| Variable                      | Scope   | Description                                |
|-------------------------------|---------|--------------------------------------------|
| `NUXT_PUBLIC_APP_NAME`        | Public  | Application display name                   |
| `NUXT_PUBLIC_APP_URL`         | Public  | Canonical public URL                       |
| `NUXT_PUBLIC_API_BASE_URL`    | Public  | REST API base URL (client-side)            |
| `NUXT_PUBLIC_AUTH_BASE_URL`   | Public  | Auth service base URL                      |
| `NUXT_PUBLIC_ENABLE_SEO`      | Public  | Enable SEO meta (default: true)            |
| `NUXT_PUBLIC_DEFAULT_TENANT`  | Public  | Default tenant slug                        |
| `JWT_SECRET`                  | Private | Server-only JWT secret (never to client)   |
| `API_SECRET`                  | Private | Server-only API secret                     |

**Build-time vs runtime**: With SSR, `NUXT_PUBLIC_*` vars are read at runtime
from the server process — you do not need to rebuild the image to change them.
With static export (`nuxt generate`), they are baked in at build time.

---

## Development

```bash
npm run dev          # Dev server with HMR at :3000
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run typecheck    # Full TypeScript type check
npm run ci:check     # lint + typecheck combined
npm run commit       # Guided Conventional Commit via Commitizen
```

---

## Code Quality and Git Hooks

Hooks run automatically after `npm install`:

| Hook         | Trigger      | Action                                      |
|--------------|--------------|---------------------------------------------|
| `pre-commit` | git commit   | lint-staged (ESLint on staged files only)   |
| `commit-msg` | git commit   | commitlint (validates Conventional Commits) |
| `pre-push`   | git push     | npm run typecheck                           |

Use `npm run commit` for a guided commit message builder (Commitizen).

---

## Building and Running in Production

```bash
npm run build             # SSR build → .output/
npm run start             # Run Node server from .output/
npm run build:static      # Static export → .output/public/
```

---

## Docker

### Build and run

```bash
npm run docker:build      # docker build -t nuxt4-boilerplate .
npm run docker:run        # docker run -p 3000:3000 --env-file .env nuxt4-boilerplate
```

### Docker Compose (local dev)

```bash
docker compose up                               # dev server with hot-reload
docker compose --profile prod up app-prod       # production-like build
```

### Environment variable injection

The Docker image does not bake in secrets. Always inject at container start:

```bash
docker run \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.prod.example.com \
  -e JWT_SECRET=<secret> \
  nuxt4-boilerplate
```

### Health check

`GET /api/health` returns server status, uptime, and memory. Used by the Docker
`HEALTHCHECK` directive and load balancer health probes.

### Graceful shutdown

Nitro handles `SIGTERM` from the container orchestrator by draining in-flight
requests before exiting. No additional configuration is needed.

---

## Deployment Targets

### Vercel

Zero-config — Vercel detects Nuxt automatically:

```bash
npm i -g vercel && vercel
```

Or connect the GitHub repo in the Vercel dashboard. Set env vars under
**Settings > Environment Variables**. Private vars (`JWT_SECRET`) configured
the same way — Vercel does not expose them to the client.

Optional: copy `deploy/vercel/vercel.json` to the project root.

### Docker / VPS / Dedicated Server

```bash
docker pull ghcr.io/your-org/nuxt4-boilerplate:latest
docker run -d --name nuxt4-prod -p 3000:3000 \
  --restart unless-stopped \
  --env-file /etc/nuxt4/.env \
  ghcr.io/your-org/nuxt4-boilerplate:latest
```

Use Nginx or Caddy as a reverse proxy (configs in `deploy/`).
The `deploy-production.yml` workflow builds and pushes the image on `v*` tags.

**Zero-downtime rollout**: replace the container with the new image while the
old one drains, or use Docker Swarm rolling updates / Kubernetes rolling deployment.

### Node.js Hosting (PM2 / bare server)

```bash
npm run build
# Copy .output/ to server, then:
pm2 start .output/server/index.mjs --name nuxt4-app
pm2 save && pm2 startup
```

### Heroku / Railway / Render / Dokku

`Procfile` is included:
```
web: node .output/server/index.mjs
```

```bash
heroku create my-app
heroku config:set NUXT_PUBLIC_APP_URL=https://my-app.herokuapp.com
git push heroku main
```

Heroku runs `npm install` + `npm run build` automatically.

### AWS / Serverless

Change the Nitro preset in `nuxt.config.ts`:

```typescript
nitro: { preset: 'aws-lambda' }      // Lambda
nitro: { preset: 'cloudflare-pages'} // Cloudflare
nitro: { preset: 'azure' }           // Azure Functions
nitro: { preset: 'netlify' }         // Netlify
```

For enterprise AWS, prefer **App Runner** or **ECS** with the Docker image over
bare Lambda — better SSR support and no cold-start concerns.

### Plesk / cPanel / Shared Hosting

Shared hosting cannot run a persistent Node process. Options:

1. **Plesk Node.js selector** (if available): point startup file to `.output/server/index.mjs`.
2. **Static export**: `npm run build:static` → upload `.output/public/` via FTP.
3. **External proxy**: run Node elsewhere and proxy from Plesk.

Static export is the safest for shared hosting. Dashboard/auth pages set to
`ssr: false` remain functional as SPAs.

### Static Export (SSG)

```bash
npm run build:static
# Deploy .output/public/ to any static host:
# Netlify, GitHub Pages, Cloudflare Pages, S3+CloudFront, etc.
```

---

## Reverse Proxy Setup

### Nginx

```bash
cp deploy/nginx/nuxt4-app.conf /etc/nginx/sites-available/nuxt4-app
ln -s /etc/nginx/sites-available/nuxt4-app /etc/nginx/sites-enabled/
# Edit: server_name, TLS cert paths
nginx -t && nginx -s reload
```

Included: HTTP→HTTPS redirect, HSTS, security headers, rate limiting, gzip.

### Caddy

```bash
cp deploy/caddy/Caddyfile /etc/caddy/Caddyfile
# Edit: domain name, email for Let's Encrypt
caddy validate && caddy reload
```

Included: automatic HTTPS, security headers, zstd+gzip compression, structured logging.

---

## Multi-Environment Strategy

| Environment | Config source            | Notes                                  |
|-------------|--------------------------|----------------------------------------|
| Local dev   | `.env`                   | Copy from `.env.example`, git-ignored  |
| Docker dev  | `.env.local`             | Used by docker-compose, git-ignored    |
| CI          | GitHub Actions secrets   | Never in repo                          |
| Staging     | Platform env vars        | Injected at deploy time                |
| Production  | Secrets manager          | Rotate regularly, no `.env` files      |

**Key principle**: Build the image once, deploy it everywhere by changing env vars only.

---

## Architecture Overview

**Hybrid rendering** per route:

| Route         | Mode       | Reason                                       |
|---------------|------------|----------------------------------------------|
| `/`, `/about` | Prerendered | Best SEO; no server needed for static pages |
| `/auth/**`    | SSR         | Dynamic redirects, server-side logic         |
| `/dashboard/**` | SPA       | Protected; no SSR needed; faster navigation  |

**Auth flow**: Client → POST to external auth server → receives JWT pair →
stores in `sessionStorage` (CSRF-safe) → attaches `Authorization: Bearer` header
to all API calls → on 401 triggers refresh → on refresh failure clears session
and redirects to login.

**Tenant resolution**: subdomain extracted from `window.location.hostname` (client)
or `useRequestURL().hostname` (server). The `tenant.global.ts` middleware runs on
every navigation and re-resolves if the subdomain has changed.

---

## CI/CD

### Workflows

| Workflow                 | Trigger                   | Jobs                                      |
|--------------------------|---------------------------|-------------------------------------------|
| `ci.yml`                 | Push to main/develop, PRs | Lint → Typecheck → Build → Docker dry-run |
| `deploy-production.yml`  | Tag `v*.*.*`              | Build image → push GHCR → deploy via SSH  |

### Required GitHub Secrets (production deploy)

| Secret           | Description                |
|------------------|----------------------------|
| `DEPLOY_HOST`    | Server hostname/IP         |
| `DEPLOY_USER`    | SSH user                   |
| `DEPLOY_SSH_KEY` | Private SSH key            |

Uncomment the SSH deployment step in `deploy-production.yml` and fill in your server details.

---

## Release and Versioning

Semantic Versioning + Conventional Commits:

```bash
npm run release -- patch   # 1.0.0 → 1.0.1 (bug fixes)
npm run release -- minor   # 1.0.0 → 1.1.0 (new features)
npm run release -- major   # 1.0.0 → 2.0.0 (breaking changes)
```

After version bump: update `CHANGELOG.md`, commit as `chore(release): vX.Y.Z`,
push tag to trigger `deploy-production.yml`.

**Dependabot** opens automated PRs every Monday for npm and GitHub Actions updates.

---

## Security Guidance

- Never commit `.env` — git-ignored and docker-ignored.
- Never use `NUXT_PUBLIC_*` for secrets — they ship in the client bundle.
- Rotate secrets via your platform's secrets manager.
- Enable GitHub Secret Scanning in repository settings.
- Run `npm audit` regularly; Dependabot handles automated PRs.
- Security headers applied in `server/middleware/security.ts` and reverse proxy configs.
- Docker image runs as non-root user (`nuxtjs`, UID 1001).
- `/api/health` returns only safe operational metrics.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branch naming, commit format, PR guidelines, and release process.
