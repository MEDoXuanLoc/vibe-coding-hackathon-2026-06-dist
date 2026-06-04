# CLAUDE.md — Meeting Notes App (vibe-coding-hackathon-2026-06)

Meeting-notes CRUD app used as the diagnostic exercise for the internal Vibe Coding hackathon. Improve it from `tasks/user-stories.md` (and `tasks/specs/` after 0:50).

## Stack
Next.js 15 (App Router, React 19) · Express 4 + TypeScript · Prisma 5 · PostgreSQL 16 · Tailwind CSS · Docker Compose

## Entry points
- `app/api/src/index.ts` — Express entry; mounts `/api/meetings` + `/health`
- `app/api/src/routes/meetings.ts` — all CRUD handlers (the data path)
- `app/web/app/page.tsx` — meetings list; `app/web/app/meetings/[id]/` — detail/edit
- `app/web/lib/api.ts` — web→API client + `formatDate`; `app/api/prisma/schema.prisma` — `Meeting` model

## Bất biến / Constraints (vi phạm = reject)
- Single `Meeting` model (id, title, body, meetingDate, createdAt, updatedAt). Schema change ⇒ `prisma db push` runs on every `up`, so DB is reset-friendly but treat migrations deliberately.
- Web ↔ API only over HTTP via `NEXT_PUBLIC_API_URL`; web never touches Postgres directly.
- Dates: DB timestamps are correct (UTC). Display bugs live in the formatting path (`formatDate`), not the data — fix presentation, not stored values.
- Don't commit secrets / `.env` / `node_modules` / build output.

## Quy trình
- Phân loại task S/M/L trước (xem docs/WORKFLOW.md nếu có). Không rõ → hỏi.
- Đụng phần lõi/architecture ⇒ task L ⇒ phải có ADR (docs/adr/).
- Grok thiết kế/spec; Claude implement+test. Không để Claude tự review code Claude.
- Hoàn thành + verify xong 1 task ⇒ phát báo cáo cho Grok (docs/prep/grok-report-template.md) để Grok review logic & cập nhật context.

## Lệnh
```bash
cd app && docker compose up           # web :3000 · api :4000 · db :5433
docker compose down -v                # wipe DB volume + reset
docker compose exec web npm run lint  # next lint
```

## Links
- Rubric chấm điểm (6 trục + golden rules, target T2): docs/prep/diagnostic-rubric.md
- Quy trình Claude×Grok: claude-grok.md · Báo cáo task: docs/prep/grok-report-template.md
- KB cho Grok: INSIGHT.md · Grok prompt: docs/prompts/GROK_SYSTEM_INSTRUCTION.md
- ADR: docs/adr/ · Decisions: docs/decisions.md · Mini-specs: docs/prep/phase-a-mini-specs.md
- User stories: tasks/user-stories.md · Codebase tour: docs/codebase-tour.md

## Đừng
- Đừng "sửa" timestamp trong DB cho bug lệch ngày — sửa ở display path.
- Đừng thêm ORM/DB call vào web layer — đi qua API client.
- Commit secret/.env/output sinh ra.

<!-- Giữ file < 60 dòng. Chi tiết dài để trong docs/ rồi link, đừng nhồi vào đây. -->
