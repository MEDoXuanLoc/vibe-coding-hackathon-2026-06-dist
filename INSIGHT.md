# INSIGHT.md — Meeting Notes App

> Knowledge base for Grok. Describes architecture, responsibility, and data flow — not code detail.
> Project: `vibe-coding-hackathon-2026-06` · meeting-notes CRUD app (diagnostic hackathon target).

## 1. Vấn đề và giá trị

**Bối cảnh:** Đây là app ghi chú cuộc họp (meeting notes) dùng làm bài tập chẩn đoán cho Vibe Coding hackathon. Người tham gia có 1.5h cải thiện app dựa trên `tasks/user-stories.md`. Cái được đánh giá là *cách dùng AI*, không phải số lượng task hoàn thành.

**Giá trị app (theo user stories):** giúp các team (CS, engineering, consulting, planning, HR) lưu và tra cứu ghi chú họp đáng tin cậy. Các pain point thực tế thúc đẩy ưu tiên:

| Metric / tín hiệu | Giá trị |
|---|---|
| Tickets "ngày hiển thị sai" (story #1) | 8 tickets/tháng, lặp lại hàng tuần — data integrity |
| Search trong body (story #4) | #1 NPS request 6 tháng liền; 2 khách lớn (Acme, BizCo) dọa churn khi renew (4–5 tháng tới) |
| Số lượng notes (story #3) | >100 hiện tại, dự kiến >500 cuối Q2 — scaling |

**Nguyên tắc ưu tiên:** business impact × implementation cost. Data-integrity & churn-risk > convenience (vd export Markdown story #5 là "nice to have", không ai +1).

## 2. Kiến trúc tổng quan

```
┌──────────────┐    HTTP/JSON     ┌───────────────┐   Prisma    ┌──────────────┐
│  web (Next)  │ ───────────────► │  api (Express)│ ──────────► │ db (Postgres)│
│  :3000       │ ◄─────────────── │  :4000        │ ◄────────── │  :5433→5432  │
│  App Router  │  NEXT_PUBLIC_    │  /api/meetings│             │  Meeting     │
│  lib/api.ts  │  API_URL         │  /health      │             │  table       │
└──────────────┘                  └───────────────┘             └──────────────┘
        └──────────────── Docker Compose (one stack) ────────────────┘
```

Web không bao giờ nói chuyện trực tiếp với Postgres — luôn qua API HTTP.

## 3. Module map

| Module | Trách nhiệm |
|---|---|
| `app/web/app/page.tsx` | List view (sorted by meetingDate desc) |
| `app/web/app/meetings/new/page.tsx` | Create form |
| `app/web/app/meetings/[id]/page.tsx` | Detail + Delete |
| `app/web/app/meetings/[id]/edit/page.tsx` | Edit form |
| `app/web/lib/api.ts` | API client (fetch/create/update/delete) + `formatDate` |
| `app/web/lib/types.ts` | `Meeting` TS type (mirror of Prisma model) |
| `app/api/src/index.ts` | Express bootstrap, CORS, JSON, route mount, `/health` |
| `app/api/src/routes/meetings.ts` | Toàn bộ CRUD handlers |
| `app/api/src/lib/db.ts` | Prisma client singleton |
| `app/api/prisma/schema.prisma` | `Meeting` model |
| `app/api/prisma/seed.ts` | Seed data (chạy mỗi lần `up`) |

## 4. Data flow chi tiết

1. User mở `web :3000`; component gọi hàm trong `lib/api.ts`.
2. `lib/api.ts` fetch tới `${NEXT_PUBLIC_API_URL}/api/meetings...` (`cache: 'no-store'`).
3. Express (`index.ts`) áp dụng CORS + JSON, route `/api/meetings` → `routes/meetings.ts`.
4. Handler gọi Prisma client (`lib/db.ts`) → query/mutate Postgres.
5. Postgres trả row(s); Prisma map sang object; handler trả JSON.
6. Web nhận JSON, render. `formatDate` chuyển ISO → `YYYY-MM-DD` để hiển thị.
7. Lúc `docker compose up`: api chạy `prisma db push` (sync schema) → `seed.ts` → `npm run dev`.

## 5. Boundary rules

| Rule | Lý do |
|---|---|
| Web chỉ gọi API qua HTTP, không import Prisma | Giữ tách biệt frontend/backend; web là client thuần |
| DB timestamp là UTC và đúng | Bug lệch ngày (story #1) nằm ở display path, không sửa dữ liệu |
| Mọi CRUD đi qua `routes/meetings.ts` | Một chỗ duy nhất để validate/đổi logic dữ liệu |
| Schema đổi → `prisma db push` chạy lại khi `up` | DB reset-friendly, nhưng đổi schema phải có chủ đích (ADR nếu lớn) |
| `POST` hiện chưa validate input (`// TODO`) | Điểm yếu đã biết — thêm validation phải nhất quán cho cả POST/PUT |

## 6. External dependencies

| Service | Dùng bởi | Mục đích |
|---|---|---|
| PostgreSQL 16 | api (Prisma) | Lưu trữ `Meeting` |
| Prisma 5 | api | ORM / migration (`db push`) |
| Docker Compose | toàn stack | Orchestrate web + api + db |
| Tailwind CSS | web | Styling |

<!-- TODO: bổ sung khi spec ở tasks/specs/ được release lúc 0:50 -->
