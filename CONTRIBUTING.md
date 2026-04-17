# Contributing Guide

Thank you for contributing to **nuxt4-boilerplate**! This guide covers everything you need to get started.

---

## Table of Contents

1. [Development Setup](#development-setup)
2. [Git Workflow](#git-workflow)
3. [Commit Messages](#commit-messages)
4. [Code Quality](#code-quality)
5. [Pull Requests](#pull-requests)
6. [Environment Variables](#environment-variables)
7. [Release Process](#release-process)
8. [Dependency Updates](#dependency-updates)
9. [Security Reporting](#security-reporting)

---

## Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/ivashchenko96/nuxt4-boilerplate.git
cd nuxt4-boilerplate

# 2. Install dependencies (this also sets up Git hooks via Husky)
npm install

# 3. Copy and fill environment variables
cp .env.example .env
# Edit .env with your local values

# 4. Start the development server
npm run dev
```

> **Node version**: Use Node 22 or newer (matches the Docker image).
> Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) for version management.

---

## Git Workflow

We follow **trunk-based development** with short-lived feature branches:

```
main          ← production-ready; only merged via PR
develop       ← integration branch; PRs targeting main should pass here first
feature/*     ← new features, branched from develop
fix/*         ← bug fixes
chore/*       ← maintenance tasks
docs/*        ← documentation
hotfix/*      ← critical production fixes, branched from main
release/*     ← release preparation branches
```

### Branch naming

```
feature/add-oauth-login
fix/sidebar-collapse-mobile
chore/upgrade-pinia-3
docs/deployment-guide
hotfix/cors-production
```

---

## Commit Messages

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via **commitlint** (runs automatically as a Git hook).

### Format

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer(s)]
```

### Allowed types

| Type       | When to use                                             |
|------------|---------------------------------------------------------|
| `feat`     | New feature                                             |
| `fix`      | Bug fix                                                 |
| `docs`     | Documentation only                                      |
| `style`    | Formatting, whitespace (no logic change)                |
| `refactor` | Code change that is neither a fix nor a feature         |
| `perf`     | Performance improvement                                 |
| `test`     | Adding or fixing tests                                  |
| `chore`    | Build process, dependencies, tooling                    |
| `ci`       | CI/CD configuration                                     |
| `build`    | Build system changes                                    |
| `revert`   | Reverts a previous commit                               |

### Examples

```
feat(auth): add OAuth2 Google login support
fix(sidebar): correct collapse animation on mobile
docs(deployment): add Heroku deployment guide
chore(deps): upgrade nuxt to 3.17.2
feat!: drop support for Node 18  ← BREAKING CHANGE
```

### Guided commit helper

Use the interactive Commitizen helper to compose correctly formatted commits:

```bash
npm run commit
```

---

## Code Quality

Git hooks enforce quality automatically on every commit:

| Hook         | Trigger       | What runs                                     |
|--------------|---------------|-----------------------------------------------|
| `pre-commit` | `git commit`  | `lint-staged` (ESLint on staged files)        |
| `commit-msg` | `git commit`  | `commitlint` (validates commit message format)|
| `pre-push`   | `git push`    | `npm run typecheck`                           |

### Manual checks

```bash
npm run lint          # ESLint across all files
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # vue-tsc full type check
npm run ci:check      # lint + typecheck (same as CI)
```

---

## Pull Requests

1. **Fork → branch → PR** — never push directly to `main` or `develop`.
2. Keep PRs **focused and small** — one concern per PR.
3. Ensure `npm run ci:check` passes before opening the PR.
4. Fill in the PR template (created automatically by GitHub).
5. Request at least one review.
6. Squash-merge into `develop`; linear history into `main`.

---

## Environment Variables

- Local: copy `.env.example` → `.env` and fill in values.
- **Never commit `.env`** — it is in `.gitignore`.
- Server-only secrets must **never** use the `NUXT_PUBLIC_` prefix.
- For CI and production: inject vars via your platform's secrets manager.

See `.env.example` for the full list and descriptions.

---

## Release Process

We use [Semantic Versioning](https://semver.org/) and [Conventional Commits](https://www.conventionalcommits.org/) to automate releases:

```bash
# Bump version (patch / minor / major)
npm run release -- patch   # 1.0.0 → 1.0.1
npm run release -- minor   # 1.0.0 → 1.1.0
npm run release -- major   # 1.0.0 → 2.0.0

# Or using npx semantic-release / release-it if configured
```

After bumping:
1. Update `CHANGELOG.md` with the new version and release notes.
2. Commit: `chore(release): v1.1.0`
3. Tag: `git tag v1.1.0`
4. Push: `git push && git push --tags`

The `deploy-production.yml` GitHub Actions workflow triggers automatically on `v*.*.*` tags.

---

## Dependency Updates

[Dependabot](https://docs.github.com/en/code-security/dependabot) is configured to open automated PRs every Monday for:
- npm dependencies (grouped by ecosystem)
- GitHub Actions

Review these PRs promptly. For major version bumps, test locally before merging.

---

## Security Reporting

Please **do not** open public issues for security vulnerabilities.
Email: security@example.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)
