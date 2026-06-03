# Default Stack

_Last updated: May 8, 2026_

This document defines the default technology stack across all projects. Deviations should be intentional and documented at the project level.

---

## Frontend

**SvelteKit**

Full-stack framework for all web projects. SvelteKit server routes handle in-app API needs. Vite is the local dev server. Deployed via the Cloudflare adapter.

---

## Styling

**stylebase + Bits UI via Suede**

stylebase provides global design tokens, fluid type scale, fluid spacing, layout primitives, and sensible element defaults. It is imported once globally as an npm package.

Bits UI provides headless accessible component primitives (focus traps, ARIA, keyboard navigation). Component-level styles are written in scoped Svelte CSS against stylebase tokens.

Suede is the starter template — a SvelteKit repo with Bits UI wired to stylebase, preconfigured with the full default stack. New projects begin by duplicating Suede. It is not a versioned dependency; each project owns its copy from that point. Storybook is included for developing and reviewing components in isolation.

**Design principles:**
- Screen-native only. No shadows, no skeuomorphism.
- Hierarchy through color, scale, weight, and space.
- Color is semantic, not decorative.

**Authorship model:**
All presentational code — Svelte component markup, scoped CSS, layout, spacing, typography, and Bits UI wiring — is authored by hand. LLM agents do not generate or modify presentation layer code. Agents own TypeScript logic: data fetching, server routes, Drizzle queries, form handling, API integrations, and Workers. Svelte's file structure (separate `<script>`, markup, and `<style>` blocks) enforces this boundary naturally.

---

## Backend Runtime

**SvelteKit server routes / Hono**

SvelteKit server routes handle all in-app API needs. Hono is used for standalone Cloudflare Workers or independent API services that live outside a SvelteKit app.

---

## Compute & Hosting

**Cloudflare Pages + Cloudflare Workers / Railway**

SvelteKit apps deploy to Cloudflare Pages. Standalone services and Workers deploy to Cloudflare Workers. Railway is used for anything outside the Cloudflare ecosystem — primarily Postgres-backed services and Node-based workloads.

---

## Database

**Cloudflare D1 + Drizzle / Postgres on Railway + Drizzle**

Drizzle is the ORM across all database targets. The database is selected based on deployment environment and query needs.

| Scenario | Database |
|---|---|
| Cloudflare-native projects | Cloudflare D1 |
| Full relational database needs | Postgres on Railway |
| Caching and key-value | Cloudflare KV |
| Non-Cloudflare lightweight SQL | Turso |

---

## Real-time

**Cloudflare Durable Objects / Web Push API**

Durable Objects handle in-app real-time features — one DO instance per shared resource (e.g. shared quest, collaborative session). Web Push API + Workers handle device push notifications.

---

## Social & Identity Layer

**ATProto**

ATProto is the primary social layer across all applicable projects. Private data is handled by whichever database fits the project. ATProto OAuth is used for authentication on ATProto projects.

---

## Auth

**ATProto OAuth / Better Auth**

ATProto OAuth for all ATProto projects. Better Auth for everything else — it is edge-native, has native D1 support, and integrates cleanly with SvelteKit.

---

## File & Blob Storage

**Cloudflare R2**

S3-compatible API, no egress fees, native Workers integration.

---

## CMS & Content

**Payload / Markdown + MDX**

Payload is the standard CMS. It is TypeScript-native, self-hosted, and schema-as-code. Used proactively across projects to build familiarity, not only when a CMS is strictly required.

Markdown and MDX are used for simple static content that does not warrant a CMS.

---

## Search

**Postgres FTS / Meilisearch**

Postgres FTS for Postgres projects. Meilisearch for D1 projects that need real search — it is open source, fast, and has a clean hosted option.

---

## Payments

**Stripe + Stripe Tax**

Stripe for all payment processing. Stripe Tax for automated sales tax and VAT compliance across regions.

---

## Transactional Email

**Resend**

Modern API, excellent developer experience, React Email for templates (server-side only, no React frontend required).

---

## Monitoring

**Sentry + Axiom + Cloudflare Analytics**

| Tool | Purpose |
|---|---|
| Sentry | Error tracking |
| Axiom | Log aggregation |
| Cloudflare Analytics | Traffic and CDN-level metrics |

---

## Product Analytics

**PostHog**

Event tracking, funnels, session replay, and feature flags. Used for understanding what users actually do — not just pageviews.

---

## Web Analytics

**Plausible**

Privacy-friendly, no cookies, GDPR compliant. Covers pageviews, referrers, and Web Vitals. Complements Cloudflare Analytics rather than replacing it.

---

## AI & LLM Integration

**OpenRouter**

Unified API gateway across all model providers. Model selection is per use case — better models for quality-critical tasks, cheaper models for volume. No dependency on any single provider.

---

## LLM-Assisted Coding

**OpenCode / Claude Code / Zed**

OpenCode is the primary coding agent — open source, model-agnostic, supports 75+ providers via OpenRouter including local models.

Claude Code is the fallback when OpenCode is insufficient.

Zed is the editor. Fast. AI autocomplete is available but not a primary workflow.

**LLM Documentation conventions:**
- `CLAUDE.md` at the repo root for every project: architecture context, conventions, and agent guardrails
- Skills files for reusable procedural knowledge — format standard is cross-agent compatible
- This stack document serves as a shared reference across all projects and agents

---

## CI/CD

**GitHub Actions**

Native Cloudflare Wrangler integration, largest ecosystem of actions, free for public repos.

---

## Code Hosting

**Tangled / GitHub**

Tangled for public and open source projects. GitHub for private projects, client work, and anything requiring CI/CD pipelines. DNS always managed through Cloudflare regardless of registrar.

---

## Package Manager

**pnpm**

Faster than npm, strict dependency resolution, content-addressable store, monorepo support via workspaces.

---

## Domain Registrar

**Cloudflare Registrar / Porkbun**

Cloudflare Registrar by default — at-cost pricing, no markup, native DNS management. Porkbun for TLDs not supported by Cloudflare. DNS always managed through Cloudflare regardless of registrar.

---

## Testing

**Vitest + Playwright**

Vitest for unit and integration tests — Vite-native, fast, Jest-compatible API. Playwright for end-to-end tests — native SvelteKit integration, runs cleanly in GitHub Actions CI.

---

## Mobile

**Web-first + PWA / React Native + Expo**

All projects are web-first. PWA capabilities are the default mobile story.

React Native and Expo are used when a project specifically requires genuine native feel and App Store distribution. Targets both iOS and Android from a single codebase.
