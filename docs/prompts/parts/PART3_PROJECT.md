## ═══ PHẦN 3: PROJECT — Meeting Notes App ═══

### 3.1 Bối cảnh & Giá trị
App ghi chú cuộc họp (CRUD), là bài tập chẩn đoán cho Vibe Coding hackathon. Người dùng nội bộ (CS, eng, consulting, planning, HR) lưu & tra cứu ghi chú họp. Giá trị cốt lõi: **độ tin cậy của dữ liệu** (ngày đúng) và **khả năng tìm lại** (search/tag) khi số notes tăng. Tín hiệu value: 8 tickets/tháng về ngày lệch; search là #1 NPS request 6 tháng liền + churn risk 2 khách lớn (Acme, BizCo) renew trong 4–5 tháng; >100 notes → >500 cuối Q2.

### 3.2 Pipeline chính (ASCII)
```
web (Next :3000) ──HTTP/JSON──► api (Express :4000) ──Prisma──► db (Postgres :5433)
   lib/api.ts        NEXT_PUBLIC_   /api/meetings              Meeting table
                     API_URL        /health
        └────────────── Docker Compose (1 stack) ──────────────┘
```

### 3.3 Stack
Next.js 15 (App Router, React 19) · Express 4 + TypeScript · Prisma 5 · PostgreSQL 16 · Tailwind CSS · Docker Compose.

### 3.4 Key modules (abstract)
| Module | Trách nhiệm |
|---|---|
| web list/detail/new/edit pages | UI CRUD cho Meeting |
| web `lib/api.ts` | API client + `formatDate` (ISO→YYYY-MM-DD) |
| api `routes/meetings.ts` | Toàn bộ CRUD handler — điểm duy nhất chạm dữ liệu |
| api `lib/db.ts` | Prisma client |
| `schema.prisma` | Model `Meeting` (id, title, body, meetingDate, createdAt, updatedAt) |

### 3.5 Boundary rules
- Web ⇄ API chỉ qua HTTP; web không import Prisma / không nối DB trực tiếp.
- DB timestamp đúng (UTC) → bug lệch ngày sửa ở display path, KHÔNG sửa dữ liệu.
- Mọi mutation đi qua `routes/meetings.ts`; đổi schema lớn → ADR.

### 3.6 Known pain points
- `POST /api/meetings` chưa validate input (`// TODO` trong code).
- `formatDate` dùng `toISOString().slice(0,10)` → lệch ngày với họp sáng sớm theo timezone (story #1).
- Delete không có confirm; không soft-delete/restore (story #2, irreversible).
- Không filter theo tag (story #3); không full-text search trong body (story #4).
- List view vỡ layout với title dài >100 ký tự (story #6).

### 3.7 Quy tắc làm việc cho project này
- Ưu tiên theo business impact × cost: data-integrity (#1) & churn-risk (#4) trước; "nice to have" (#5 export Markdown) sau cùng.
- Bug lệch ngày: chẩn đoán ở display/format path trước khi đụng API/DB.
- Thêm field/model → cập nhật `schema.prisma`, `types.ts`, và API handler đồng bộ.
- Sau 0:50 có spec ở `tasks/specs/` → đọc spec trước khi implement task tương ứng.
- Đụng architecture (đổi model, thêm service) ⇒ task L ⇒ ADR trong `docs/adr/`.
