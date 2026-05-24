# Portfolio v2 Backend — Progress & Roadmap

> **Living document.** Revisit and update this file whenever architecture decisions change, phases complete, or new requirements appear.  
> **Last reviewed:** 2026-05-24 (Phase 6 complete)

---

## Quick status

| Area | Status | Notes |
|------|--------|-------|
| NestJS + clean-arch folder layout | Done | Path aliases in `tsconfig.json` |
| Swagger (`/docs`) | Done | `main.ts` |
| Env validation + `ConfigModule` | Done | See `.env.example` |
| Global `ValidationPipe` | Done | `main.ts` |
| Health check | Done | `GET /health` |
| Prisma + Supabase | Done | `database/schema.prisma` (Prisma 6); manual schema verified against live DB |
| Domain layer | Done | Project + image models, repository ports |
| Data / repository layer | Done | Prisma repositories |
| Project API | Done | Full CRUD at `/project` |
| Image API | Done | CRUD + multipart upload (Option B) |
| ImageKit | Done | Server-side upload via `imagekit` SDK |
| Redis caching (Upstash) | Done | `@upstash/redis`; cache-aside in read use cases |
| CORS | Done | `CORS_ORIGINS` (mock `http://localhost:3000`) |
| Vercel deploy | Done | `api/index.ts` + `vercel.json` |
| Certificate API | Done | `GET /certificate?page&pageSize` — paginated, `createdAt DESC`; Redis per page |
| Skills API | Done | `GET /skill` (+ optional `?type=`) — `icon` = frontend key |

---

## Project goals

Build a **portfolio CMS-style backend** that:

1. Serves **projects** and nested **images** to a separate frontend (portfolio remake).
2. Persists data in **Supabase (PostgreSQL)** via **Prisma**, respecting existing tables/data.
3. Handles **image uploads** through **ImageKit** (URLs stored in DB).
4. Uses **Redis** to cache hot read responses and invalidate on writes.
5. Follows **NestJS clean architecture** so domain rules stay independent of frameworks.
6. Exposes **certificates** and **skills** for the about/resume sections of the portfolio frontend.
7. *(Later)* Relate skills to projects and certificates when product design is ready.

---

## Architecture reference

### Layer responsibilities

```
presentation/     HTTP, DTOs, Swagger, validation pipes, controllers, Nest modules
application/      Use cases (orchestration), ports as interfaces consumed by use cases
domain/           Entities, value objects, domain errors, repository *interfaces*
data/             Repository implementations (Prisma), mappers entity ↔ persistence
infrastructure/   Cross-cutting: env config, Redis, ImageKit, Prisma module, logging
database/         Prisma schema, migrations (optional if introspecting only)
```

**Dependency rule:** `presentation` → `application` → `domain` ← `data` / `infrastructure`. Domain never imports Nest or Prisma.

### Path aliases (current)

| Alias | Path |
|-------|------|
| `@application/*` | `src/application/*` |
| `@domain/*` | `src/domain/*` |
| `@data/*` | `src/data/*` |
| `@database` / `@database/*` | `database/*` (repo root — create with Prisma) |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@presentation/*` | `src/presentation/*` |

### API versioning & routing

- Controllers use `@Controller({ version: '1' })`.
- `RouterModule` mounts `ProjectModule` at `/project` → effective base: **`GET /project`** (consider global prefix `/api` later for consistency with frontend).

### Naming: app vs database

| Concept | TypeScript / API (camelCase) | PostgreSQL (snake_case) |
|---------|------------------------------|-------------------------|
| Project timestamps | `createdAt`, `updatedAt` | `created_at`, `updated_at` |
| Image FK | `projectId` | `project_id` |
| Image URL field | `image` | `image` |
| Image slug | `slug` | `slug` |

Prisma: use `@map("snake_case")` on fields and `@@map("table_name")` on models when introspecting.

### Data model (target)

#### `projects`

| Field | Type | Notes |
|-------|------|-------|
| `id` | **Int** (`serial` / autoincrement) | Primary key |
| `title` | string | Required |
| `description` | string | Nullable in DB |
| `createdAt` | DateTime | `created_at` |
| `updatedAt` | DateTime | `updated_at` |

#### `images`

| Field | Type | Notes |
|-------|------|-------|
| `id` | **Int** (autoincrement) | Primary key |
| `slug` | string | Confirm unique scope before image CRUD |
| `image` | string | ImageKit CDN URL |
| `description` | string | Nullable |
| `projectId` | Int → `projects.id` | Prisma `onDelete: Cascade` |
| `createdAt` | DateTime | `created_at` |
| `updatedAt` | DateTime | `updated_at` |

**Relation:** `Project` 1 — N `Image`.

#### `certificates`

| Field | Type | Notes |
|-------|------|-------|
| `id` | **Int** (autoincrement) | Primary key |
| `title` | string | Required |
| `issuer` | string | Nullable |
| `issuedAt` | DateTime | Nullable — `issued_at` |
| `image` | string | Nullable — badge / preview image URL |
| `credential` | string | Nullable — verify / credential link URL |
| `createdAt` | DateTime | `created_at` |
| `updatedAt` | DateTime | `updated_at` |

**Data entry:** rows inserted manually in Supabase (no write API in Phase 6).

#### `skills`

| Field | Type | Notes |
|-------|------|-------|
| `id` | **Int** (autoincrement) | Primary key |
| `title` | string | Display name (e.g. `React`, `NestJS`) |
| `icon` | string | **Simple icon identifier** for the frontend — not a URL. Example values: `react`, `typescript`, `nestjs`. Frontend maps this string to an icon set (Lucide, Simple Icons, custom SVG map, etc.) |
| `type` | `SkillType` enum | `FRONTEND` \| `BACKEND` \| `UI_UX` (DB value `UI/UX` via `@map`) |

**Data entry:** rows inserted manually in Supabase (no write API in Phase 6).

**No relations yet** to `projects` or `certificates` — see Phase 7.

**Prisma schema:** `database/schema.prisma` — pinned to **Prisma 6** (v7 breaks `url` in datasource for this workflow). Models `Certificate` and `Skill` already defined; run `npx prisma generate` after schema changes.

### Read-model decision (list projects)

`GET /project` returns projects **`createdAt DESC`**, each with **`coverImageUrl`**: first related image by **`images.createdAt ASC`**. Wrapped by `ResponseInterceptor` as `{ data: [...] }`.

---

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Supabase Postgres |
| `PORT` | Yes (local) | HTTP port; Vercel sets automatically |
| `IMAGEKIT_PUBLIC_KEY` | Yes | ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | Yes | ImageKit |
| `IMAGEKIT_URL_ENDPOINT` | Yes | ImageKit CDN base |
| `REDIS_URL` | Recommended | Upstash REST URL — cache disabled if omitted |
| `REDIS_TOKEN` | Recommended | Upstash REST token |
| `CACHE_TTL_PROJECTS_LIST` | No | Default `300` (seconds) |
| `CACHE_TTL_PROJECT_DETAIL` | No | Default `600` |
| `CACHE_TTL_IMAGES` | No | Default `300` |
| `CACHE_TTL_CERTIFICATES` | No | Phase 6 — default `600` (planned) |
| `CACHE_TTL_SKILLS` | No | Phase 6 — default `600` (planned) |
| `CORS_ORIGINS` | No | Comma-separated; default `http://localhost:3000` — **set to deployed frontend URL** |

Copy `.env.example` → `.env` locally; add the same keys in the Vercel project dashboard.

---

## Implementation phases

### Phase 0 — Foundation & hygiene

**Goal:** Stable dev experience and conventions before database work.

**Status:** Complete (except optional items)

#### Sub-tasks

- [x] NestJS 11 app bootstrap
- [x] Swagger at `/docs`
- [x] Path aliases for clean architecture
- [x] Joi-based env schema (`DATABASE_URL`, `PORT`)
- [x] `ProjectModule` + controller + `GetProjectsUseCase`
- [x] `GetProjectsResponseDto` with `coverImageUrl`
- [x] Register `ConfigModule.forRoot({ load: [envsConfig] })` in `AppModule`
- [x] Global validation pipe (`ValidationPipe`, whitelist, transform)
- [ ] Global API prefix (e.g. `/api`) — align with frontend before changing routes
- [x] Rename `getListCategories()` → `getProjects()` in controller
- [x] Health check endpoint `GET /health` (DB ping in Phase 5)
- [ ] Replace default `README.md` with project-specific setup (optional)

#### Architecture notes

- Keep **one Nest module per bounded context** (`ProjectModule`, `ImageModule`) under `presentation/`.
- Export use cases only through controllers; do not call repositories from controllers.
- `ResponseInterceptor` wraps successful payloads as `{ data }`.

#### Technical concerns

- None blocking Phase 1.

#### Performance considerations

- N/A for this phase.

#### Future enhancements

- Structured logging (pino), request ID middleware, rate limiting.

---

### Phase 1 — Database (Prisma) + domain core

**Goal:** Connect to existing Supabase data safely; establish domain entities and repository contracts.

**Status:** Core complete — extend repositories as CRUD phases land

#### Sub-tasks

- [x] Install `prisma@6`, `@prisma/client@6`; `database/schema.prisma`
- [~] `npx prisma db pull` — **hangs on Supabase pooler**; schema written manually and **verified** with live queries
- [x] Prisma models: `@@map`, `@map`, **Int** ids, `onDelete: Cascade` on images
- [x] `prisma:generate` script + `postinstall`; `PrismaService` + global `PrismaModule`
- [x] `ProjectListItem` read model + `ProjectRepository.findAllWithCoverImage()`
- [ ] `image.entity.ts` / full `ImageRepository` (Phase 3)
- [x] `ProjectRepository` interface + `PROJECT_REPOSITORY` token
- [ ] Extend `ProjectRepository` — `findById`, `create`, `update`, `delete` (Phase 2)
- [x] `ProjectPrismaRepository` in `src/data/project/`
- [x] Repository binding in `ProjectModule`
- [ ] Seed script (optional)

#### Architecture notes

```
GetProjectsUseCase
  → ProjectRepository.findAllWithCoverImage()
  → ProjectMapper → GetProjectsResponseDto
```

- Use **injection tokens** (symbols or strings) for repository interfaces to keep domain free of Nest decorators on interfaces themselves (interfaces stay in domain; binding in module).

#### Technical concerns

- **IDs are integers** (not UUID) — use `number` in DTOs, domain, and route params.
- **Introspect via pooler:** `db pull` against `*.pooler.supabase.com:6543` may hang; use direct connection URL or maintain manual schema.
- Unique constraint on `images.slug` — confirm before image CRUD.

#### Performance considerations

- `findAll` with images: use Prisma `include: { images: { take: 1, orderBy: { createdAt: 'asc' } } }` to avoid N+1.
- Add DB indexes if missing: `images.project_id`, `images.slug` (unique).

#### Future enhancements

- Soft delete (`deletedAt`) if admin features need undo.
- Full-text search on `projects.title` / `description`.

---

### Phase 2 — Project CRUD API

**Goal:** Full project lifecycle over HTTP with validation and consistent error responses.

**Status:** Complete

#### Sub-tasks

- [x] **Read**
  - [x] Implement `GetProjectsUseCase` — list with cover image
  - [x] `GetProjectByIdUseCase` — single project + all images (`createdAt ASC`)
- [x] **Write** (admin — auth deferred to Phase 5)
  - [x] `CreateProjectUseCase` + `POST /project`
  - [x] `UpdateProjectUseCase` + `PATCH /project/:id`
  - [x] `DeleteProjectUseCase` + `DELETE /project/:id` (cascades images in DB)
- [x] Request DTOs: `CreateProjectDto`, `UpdateProjectDto` with `class-validator`
- [x] Response DTOs aligned with domain (camelCase, Int ids)
- [x] Domain errors → `DomainExceptionFilter` (404 / 409)
- [x] Swagger decorators on all endpoints
- [ ] Unit tests for use cases (mock repositories)

#### API contract (draft)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/project` | List projects (+ cover image) |
| `GET` | `/project/:id` | Project detail + images |
| `POST` | `/project` | Create project |
| `PATCH` | `/project/:id` | Update project |
| `DELETE` | `/project/:id` | Delete project (define cascade for images) |

#### Architecture notes

- Controllers stay thin; all branching in use cases.
- On delete: decide **cascade delete images** vs block delete when images exist — document decision here when implemented.

#### Technical concerns

- Without auth, write endpoints are public — acceptable for solo portfolio only if deployment is protected (API key / admin-only network) or add auth in Phase 5.

#### Performance considerations

- Pagination on list (`?page=&limit=`) before project count grows — add when > ~20 projects.

#### Future enhancements

- Reorder projects (`sortOrder` column).
- Publish/draft flag.

---

### Phase 3 — ImageKit integration + Image CRUD API

**Goal:** Upload images to ImageKit, persist metadata in `images` table, expose CRUD scoped to projects.

**Status:** Complete

#### Upload flow decision: **Option B** (multipart → backend → ImageKit)

No admin UI on the frontend — the API accepts `multipart/form-data` so you can manage portfolio content via Postman, Swagger, or a future admin tool without building client-side ImageKit upload first.

#### Sub-tasks

- [x] Install `imagekit` SDK; `ImageKitService` in `infrastructure/imagekit/`
- [x] ImageKit env vars required at boot (`IMAGEKIT_*`)
- [x] **Option B:** `POST /project/:projectId/image` with fields `file`, `slug`, optional `description`
- [x] `ImageModule` + `ImageController` + `ProjectImageController`
- [x] Use cases: list by project, get by id/slug, create (upload), update metadata, delete DB row
- [x] Slug: **manual** on create; global uniqueness check → `409 Conflict`
- [x] Routes: `/project/:projectId/image` and `/image/:id`, `/image/slug/:slug`
- [ ] ImageKit CDN delete on `DELETE /image/:id` — deferred (needs `file_id` column + direct DB migration; pooler blocks `db push`)

#### API contract (draft)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/project/:projectId/image` | List images for project |
| `GET` | `/image/:id` | Single image |
| `GET` | `/image/slug/:slug` | Public detail page (if slug globally unique) |
| `POST` | `/project/:projectId/image` | Create image record (+ upload if Option B) |
| `PATCH` | `/image/:id` | Update metadata |
| `DELETE` | `/image/:id` | Remove record (+ ImageKit asset optional) |

#### Architecture notes

- Store **only the delivery URL** (and optional ImageKit `fileId` for deletes) in `images.image`.
- Domain entity should not depend on ImageKit types.

#### Technical concerns

- Slug collisions — return `409 Conflict` with clear message.
- Orphaned ImageKit files if DB insert fails after upload — use transactional outbox or upload-after-DB-create pattern.

#### Performance considerations

- ImageKit CDN handles asset delivery; backend only serves metadata JSON.

#### Future enhancements

- Image transformations in URL (width/quality) documented for frontend.
- Bulk upload endpoint.

---

### Phase 4 — Redis caching

**Goal:** Faster repeated reads for portfolio visitors; correct invalidation on mutations.

**Status:** Complete

#### Sub-tasks

- [x] `@upstash/redis` via global `CacheModule` (`CacheService`)
- [x] Connection from `REDIS_URL` + `REDIS_TOKEN` (graceful no-op if missing)
- [x] Keys: `portfolio:projects:list`, `portfolio:project:{id}`, `portfolio:project:{id}:images`, `portfolio:image:{id}`, `portfolio:image:slug:{slug}`
- [x] Cache-aside in all **read** use cases
- [x] TTL via `CACHE_TTL_*` env vars
- [x] `CacheInvalidationService` on all writes
- [x] `GET /health` returns `{ status, redis: up|down|disabled }`

#### Architecture notes

```
Read:  cache get → miss → DB → cache set
Write: DB → invalidate matching keys (prefix scan or explicit list)
```

- Keep caching in **infrastructure** adapter implementing a `CachePort` interface if use cases should stay pure — optional simplification: cache in repository decorators in `data/`.

#### Technical concerns

- Cache stampede on cold start — optional short lock or single-flight.
- Stale data acceptable for portfolio? If not, shorten TTL or strict invalidation.

#### Performance considerations

- Target: sub-50ms cached list response vs DB round-trip to Supabase.
- Do not cache admin mutation responses.

#### Future enhancements

- Cache warming on deploy.
- ETag / `If-None-Match` at HTTP layer in addition to Redis.

---

### Phase 5 — Hardening & production readiness

**Goal:** Deployable on Vercel with frontend CORS. Auth/E2E explicitly out of scope.

**Status:** Complete (scoped)

#### Sub-tasks

- [ ] Admin authentication — **skipped** (not required)
- [x] CORS in `configureApp()` — `CORS_ORIGINS` (mock: `http://localhost:3000`)
- [x] `DomainExceptionFilter` for domain 404/409
- [ ] E2E tests — **skipped**
- [ ] CI — **skipped**
- [x] **Vercel:** `api/index.ts` serverless handler, `vercel.json`, `npm run vercel-build`

#### Vercel deploy checklist

1. Connect repo to Vercel; framework preset **Other**.
2. Set env vars from `.env.example` (including Upstash `REDIS_*`, Supabase `DATABASE_URL`, ImageKit).
3. Set `CORS_ORIGINS` to your production frontend URL (e.g. `https://your-portfolio.vercel.app`).
4. Deploy — all routes rewrite to `/api`; Swagger at `/docs`.

#### Future enhancements

- Auth for write routes if the API becomes public.
- OpenAPI client generation, Sentry, CI.

---

### Phase 6 — Certificates & Skills (read-only GET)

**Goal:** Serve certificate and skill lists for the portfolio frontend. **No write endpoints** — you maintain data directly in Supabase.

**Status:** Complete

#### Scope (this phase)

| Area | In scope | Out of scope |
|------|----------|--------------|
| Certificates | `GET` list all | `GET :id`, `POST` / `PATCH` / `DELETE` |
| Skills | `GET` list all (include `icon`, `type`) | Writes, icon file upload, grouping by project |
| Caching | Cache-aside on both list endpoints | — |
| Auth | — | Admin auth (unchanged) |

#### Sub-tasks

**Shared / Prisma**

- [x] Confirm `Certificate` and `Skill` models in `database/schema.prisma`
- [x] `npx prisma generate`

**Certificates**

- [x] `src/domain/certificate/` — entity + `CertificateRepository.findAll()`
- [x] `src/data/certificate/certificate-prisma.repository.ts`
- [x] `GetCertificatesUseCase`
- [x] `CertificateModule` + `CertificateController`
- [x] `GET /certificate` — paginated (`page`, `pageSize`); sort **`createdAt DESC`**
- [x] `GetCertificatesQueryDto`, `PaginatedCertificatesResponseDto` + Swagger
- [x] Cache key `portfolio:certificates:list:page:{n}:size:{n}` + TTL `CACHE_TTL_CERTIFICATES`

**Skills**

- [x] `src/domain/skill/` — entity + `SkillRepository.findAll(type?)`
- [x] `src/data/skill/skill-prisma.repository.ts`
- [x] `GetSkillsUseCase`
- [x] `SkillModule` + `SkillController`
- [x] `GET /skill` — API `type` values: `FRONTEND`, `BACKEND`, `UI_UX`
- [x] `GET /skill?type=FRONTEND|BACKEND|UI_UX`
- [x] `GetSkillsResponseDto` + Swagger; `icon` documented as frontend key
- [x] Cache keys `portfolio:skills:list`, `portfolio:skills:type:{type}`

**App wiring**

- [x] `CertificateModule`, `SkillModule` in `AppModule`
- [x] `@Controller('certificate')`, `@Controller('skill')`

#### API contract (planned)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/certificate` | Paginated certificates (`page`, `pageSize`) |
| `GET` | `/skill` | All skills (`icon` = simple name for UI icon map) |
| `GET` | `/skill?type=FRONTEND` | *(Optional)* Filter by `SkillType` |

**Query params (`GET /certificate`):**

| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `page` | `1` | — | 1-based page index |
| `pageSize` | `10` | `100` | Items per page |

**Sort:** `createdAt DESC` (newest first).

**Response shape:**

```json
// GET /certificate?page=1&pageSize=10
// Outer wrapper from ResponseInterceptor: { "data": { ... } }
{
  "data": [
    {
      "id": 1,
      "title": "AWS Certified Cloud Practitioner",
      "issuer": "Amazon",
      "issuedAt": "2024-06-01T00:00:00.000Z",
      "image": "https://...",
      "credential": "https://www.credly.com/badges/...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 25,
  "totalPages": 3
}

// GET /skill → { "data": [ ... ] }
{
  "id": 1,
  "title": "React",
  "icon": "react",
  "type": "FRONTEND"
}
```

#### Architecture notes

```
GetCertificatesUseCase → CertificateRepository.findPaginated({ page, pageSize }) → mapper → DTO
GetSkillsUseCase       → SkillRepository.findAll()       → mapper → DTO
```

- Mirror **Phase 2 read patterns** (`ProjectModule`, repository token, `ResponseInterceptor` wrapper).
- **`icon` field:** store and return a short stable string; frontend owns rendering (SVG sprite, `react-icons`, etc.). Do not store ImageKit URLs or file paths in `skills.icon` unless product changes.
- **`SkillType`:** Prisma enum; map to API consistently (document whether client receives `UI_UX` or `UI/UX`).

#### Technical concerns

- Enum mapping `UI_UX` ↔ DB `"UI/UX"` — test serialization in Swagger and real JSON once implemented.
- Empty tables are valid — return `{ "data": [] }`, not 404.
- If certificate/skill schema differs from Prisma file after manual SQL, reconcile schema before coding repositories.

#### Performance considerations

- Small, static-ish datasets — single list query each; Redis optional but cheap win for home/about page.
- No N+1 (no relations in Phase 6).

#### Future enhancements (within certificates/skills, before Phase 7)

- `GET /certificate/:id` if detail page needs it.
- Admin write APIs (only if you stop using Supabase UI for data).
- Sort order column (`sortOrder`) for manual display ordering.

---

### Phase 7 — Cross-entity relations (deferred)

**Goal:** Connect skills (and possibly certificates) to projects and to each other when UX/design is defined.

**Status:** Not started — **do not implement until Phase 6 is live and frontend needs are clear**

#### Ideas to decide later

- **Skills ↔ projects:** junction table (e.g. `project_skills`) or tags on `projects`; expose on `GET /project/:id` or separate endpoint.
- **Skills ↔ certificates:** only if resume section groups credentials by technology.
- Whether `SkillType` sections on the frontend are driven only by `type` enum or also by custom grouping.

#### Sub-tasks (placeholder)

- [ ] Product/design: which entities link to which UI sections
- [ ] Schema migration (new tables / FKs) via Supabase **direct** connection if pooler blocks `db push`
- [ ] Extend read models + cache invalidation rules
- [ ] Update frontend coordination table below

---

## Frontend coordination (design system & motion)

This backend does not implement UI, but the **portfolio remake frontend** will consume these APIs. Track cross-cutting decisions here so API shape supports UX.

### Design system (API-relevant)

| Frontend need | Backend support |
|---------------|-----------------|
| Project cards with cover image | `GET /project` returns `coverImageUrl` (or first image) |
| Project detail gallery | `GET /project/:id` includes `images[]` ordered consistently |
| Image alt / captions | `images.description` exposed in DTOs |
| Stable deep links | `images.slug` + `GET /image/slug/:slug` |
| Responsive images | Document ImageKit transformation query params for frontend |
| Certificates block | `GET /certificate?page&pageSize` — `issuedAt`, `image`, `credential`, issuer |
| Skills grid / chips | `GET /skill` — `icon` string keys + `type` for section tabs (Frontend / Backend / UI·UX) |

### Motion / interaction (API-relevant)

| Interaction | Backend implication |
|-------------|---------------------|
| Fast grid load on home | Redis-cached project list; minimal payload |
| Staggered gallery reveal | Single `GET` with all images preferred over N requests |
| Optimistic admin edits | `PATCH` returns full updated entity; clear error codes for rollback |
| Skeleton → content | Low TTFB via cache; consider `Cache-Control` headers later |
| About page skills | One `GET /skill`; client groups by `type`; resolve `icon` → component locally |
| Credentials list | Paginated `GET /certificate`; load more via `page` increment |

Update this section when frontend stack (Next.js, etc.) and animation library are chosen.

### Frontend icon map (skills)

Backend returns **names only** in `skills.icon`. Example convention (frontend implementation):

| `icon` value | Frontend resolves to |
|--------------|----------------------|
| `react` | React logo component |
| `nestjs` | NestJS logo component |
| `typescript` | TypeScript logo component |

Keep names lowercase, kebab-case, no file extensions. Add new rows in Supabase when you add stack entries.

---

## Testing checklist

- [ ] Unit: each use case with mocked repositories
- [ ] Integration: Prisma against local/test Supabase branch (or Docker Postgres)
- [ ] E2E: `GET /project`, create → update → delete project flow
- [ ] E2E: image CRUD + slug uniqueness
- [ ] Cache: hit/miss/invalidation behavior
- [ ] `GET /certificate`, `GET /skill` return expected shapes and cached responses

---

## Maintenance log

| Date | Change |
|------|--------|
| 2026-05-24 | Initial `PROGRESS.md` created from codebase audit |
| 2026-05-24 | Phase 0–1 done; `GET /project` live; Int PKs; Prisma 6 schema |
| 2026-05-24 | Phase 2–3 done; Option B multipart upload; full project + image CRUD |
| 2026-05-24 | Phase 4–5: Upstash cache, CORS, Vercel serverless entry |
| 2026-05-24 | Phase 6–7 planned: certificates & skills GET APIs; relations deferred |
| 2026-05-24 | Phase 6 implemented: `GET /certificate`, `GET /skill` |
| 2026-05-24 | Certificates: pagination (`page`, `pageSize`), sort `createdAt DESC` |
| 2026-05-24 | Certificate schema: `issuedAt`, `credential`; removed `validUntil` |

### How to update this file (agent / developer)

1. After completing a sub-task, check the box and update **Quick status**.
2. If implementation differs from plan, edit the phase **Architecture notes** and **API contract** — do not leave stale instructions.
3. Record introspection findings (actual column types, constraints) in **Data model** after Phase 1.
4. Move deferred items to **Future enhancements** instead of deleting context.
5. Bump **Last reviewed** date on every edit.

---

## Decisions pending (resolve during implementation)

1. **Global API prefix** — `/api` or bare routes?
2. **Image slug uniqueness** — global vs per project (check Supabase constraints).
3. **Delete project** — **cascade images** (Prisma `onDelete: Cascade` on `images.project_id`)
4. ~~**Image upload path**~~ — **Option B** (server multipart upload); no admin frontend required.
5. ~~**Auth for writes**~~ — deferred (not required).
6. **CORS** — set `CORS_ORIGINS` when frontend URL is known.
7. ~~**Skills API `type` serialization**~~ — API uses `UI_UX` (Prisma enum name).
8. ~~**Certificate list sort**~~ — **`createdAt DESC`**; pagination via `page` / `pageSize`.

---

## Suggested implementation order (current best strategy)

```
Phase 7 — Skills/projects/certificates relations (when designed)
```

**Optional parallel / low priority:** `file_id` + ImageKit delete on image remove; global `/api` prefix; observability.

**Next actionable step:** Phase 7 design (junction tables / extended `GET /project/:id`) when frontend needs linked skills or credentials.
