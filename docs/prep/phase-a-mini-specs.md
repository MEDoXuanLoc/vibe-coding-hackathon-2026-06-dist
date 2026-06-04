# Phase A — Mini-specs (prep)

> Prep cá nhân cho 2 task anchor: **#1 (date off-by-one)** và **#4 (full-text search)**.
> Viết trước event (hợp lệ: chỉ là thiết kế/spec, KHÔNG code sẵn). Vào event chỉ implement + verify.
> Mỗi spec có **Definition of Done đo được**. Phần chưa chắc đánh dấu `[OPEN]`.

Thứ tự ưu tiên: **#1 trước** (nhỏ, data-integrity, ticket lặp tuần) → **#4 sau** (lớn hơn, churn revenue).

---

## #1 — Meeting dates off by a day

### Root cause (đã xác minh trong code)
- Hiển thị ngày đi qua một hàm duy nhất: `formatDate` trong [app/web/lib/api.ts](../../app/web/lib/api.ts).
- Hiện tại: `new Date(isoString).toISOString().slice(0, 10)` → **luôn format theo UTC**, bất kể timezone người xem.
- DB lưu timestamp đúng (vd seed `2026-04-08T09:00:00+09:00`). Lỗi nằm 100% ở **display path**, không phải dữ liệu.
- Cơ chế off-by-one: meeting lúc **07:00 JST = 22:00 UTC hôm trước** → `toISOString()` trả ngày hôm trước. Khớp story "07:00–09:00 JST".

### ⚠ Bẫy reproduce (quan trọng — đưa vào DoD)
- Seed hiện tại **toàn bộ ≥ 09:00 JST** (09:00 JST = 00:00 UTC) → **bug không tự hiện** với seed mặc định.
- Để thấy bug & verify fix, **phải thêm 1 fixture sáng sớm** vào [app/api/prisma/seed.ts](../../app/api/prisma/seed.ts), ví dụ:
  `meetingDate: new Date('2026-04-20T07:30:00+09:00')` (= 22:30 UTC 2026-04-19).
  Trước fix: list hiện `2026-04-19`. Sau fix (xem JST/local): `2026-04-20`.
- Reset để seed chạy lại: `cd app && docker compose down -v && docker compose up`.

### Fix point
Bug nằm ở **2 chỗ display path** dùng cùng pattern "cắt chuỗi ISO = ngày UTC". Sửa cả hai để nhất quán:

**(1) `formatDate`** ([app/web/lib/api.ts](../../app/web/lib/api.ts)) — bỏ chuyển UTC:
```ts
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-CA') // 'en-CA' => YYYY-MM-DD theo TZ runtime
}
```
- Chỉ chạy **client-side** (data fetch trong `useEffect`, SSR render "Loading…") → không hydration mismatch.
- Hưởng fix tự động: list `page.tsx`, detail `[id]/page.tsx`.

**(2) Edit form prefill** ([edit/page.tsx:21](../../app/web/app/meetings/[id]/edit/page.tsx)) — hiện `m.meetingDate.slice(0, 10)` = **cùng bug off-by-one** (lấy ngày UTC). Dùng lại hàm đã fix:
```ts
setMeetingDate(formatDate(m.meetingDate)) // thay cho m.meetingDate.slice(0, 10)
```
- ⚠ Nếu bỏ sót chỗ này: detail hiện đúng ngày nhưng ô Edit hiện sai 1 ngày → trông như regression. **Bắt buộc fix kèm.**

### `[OPEN]` — Quyết định cần chốt (hỏi User nếu cần)
- **Timezone hiển thị nào là "đúng"?**
  - (A) **Local của người xem** (browser) — đơn giản, không hardcode. VN (UTC+7) và JST (UTC+9) đều hiển thị đúng *ngày họp* cho phần lớn case. ← *khuyến nghị, minimal fix.*
  - (B) **Cố định Asia/Tokyo** — `toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })`. Đúng "canonical" nếu nghiệp vụ coi ngày họp luôn theo JST. Chống lệch khi người xem ở TZ xa.
  - Mặc định chọn (A) trừ khi User nói ngày họp phải neo theo JST.
- **Known issue có sẵn — KHÔNG fix trong task này** (không phải lỗi ta tạo, vẫn giữ *ngày* đúng):
  - Form lưu `new Date(dateStr).toISOString()` → mất time-of-day (đẩy về UTC midnight). Ghi known issue.
  - `new/page.tsx:12` default ngày theo UTC (`new Date().toISOString().slice(0,10)`) — edge case gần nửa đêm. Optional polish: `new Date().toLocaleDateString('en-CA')`.

### Definition of Done
- [ ] Thêm fixture sáng sớm (<09:00 JST) vào seed; `down -v && up` để nạp lại.
- [ ] Trước fix: list view hiển thị **sai 1 ngày** cho fixture đó (chụp/ghi lại để chứng minh).
- [ ] Sau fix: fixture hiển thị **đúng ngày** ở **cả list, detail VÀ ô Edit**; các meeting 09:00+ JST cũ **không đổi**.
- [ ] Sửa `formatDate` + dùng lại nó ở edit-form prefill; không đụng DB/API/dữ liệu.
- [ ] Ghi rõ trong PR: root cause là UTC-format ở display path (2 chỗ), không phải DB.

### Ước lượng: **S** (~10–15 phút gồm verify).

---

## #4 — Full-text search trong title + body

### Hiện trạng
- `GET /api/meetings` ([app/api/src/routes/meetings.ts](../../app/api/src/routes/meetings.ts)) trả tất cả, sort `meetingDate desc`. Không filter.
- List view ([app/web/app/page.tsx](../../app/web/app/page.tsx)) gọi `fetchMeetings()` (không tham số).
- Postgres + Prisma 5 → hỗ trợ `contains` + `mode: 'insensitive'`.

### Thiết kế (backend-first, mỏng nhất chạy được)
**API** — thêm query param `?q=`:
```ts
router.get('/', async (req, res) => {
  const q = (req.query.q as string)?.trim()
  const where = q
    ? { OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { body:  { contains: q, mode: 'insensitive' as const } },
      ] }
    : {}
  const meetings = await prisma.meeting.findMany({ where, orderBy: { meetingDate: 'desc' } })
  res.json(meetings)
})
```
- `q` rỗng/thiếu → trả full list (giữ hành vi cũ, backward-compatible).
- `contains` + `mode:'insensitive'` = ILIKE `%q%` trên Postgres. Đủ cho "tìm proper noun / số trong body" (story #4). **Không** cần `tsvector`/full-text index cho MVP.

**Web client** — [app/web/lib/api.ts](../../app/web/lib/api.ts):
```ts
export async function fetchMeetings(q?: string): Promise<Meeting[]> {
  const url = q ? `${API_URL}/api/meetings?q=${encodeURIComponent(q)}` : `${API_URL}/api/meetings`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch meetings')
  return res.json()
}
```

**Web UI** — list page: thêm 1 ô input search ở trên danh sách, state `query`, gọi `fetchMeetings(query)` (debounce ~300ms hoặc submit on Enter). Hiển thị empty-state khi 0 kết quả.

### `[OPEN]`
- **Debounce vs nút Search**: debounce 300ms cho UX mượt; nếu hết giờ → fetch on Enter là đủ. *Khuyến nghị debounce nếu kịp.*
- **Highlight match trong kết quả**: defer (story gốc chỉ cần "tìm được"). Không làm trong MVP.
- **Search có gồm cả empty-string trả full không**: có (đã định nghĩa ở trên).

### Definition of Done
- [ ] `GET /api/meetings?q=foo` trả đúng meeting có "foo" trong title HOẶC body (case-insensitive).
- [ ] `GET /api/meetings` (không q) vẫn trả full list, sort cũ — không regression.
- [ ] List view có ô search; gõ → danh sách lọc lại; xóa hết → về full list.
- [ ] 0 kết quả → empty-state rõ ràng (không phải màn trắng/lỗi).
- [ ] Verify bằng seed: search "search" → ra các note nhắc "search is missing/#1 request"; search "billing" → ra note có "billing".

### Ước lượng: **M** (~20–30 phút). API ~5 phút, UI ~15–20 phút.

---

## Ghi chú chiến lược (cho reflection)
- **Chọn #1 + #4 vì**: #1 = data integrity, ticket lặp hàng tuần, fix rẻ (S). #4 = #1 NPS 6 tháng + churn risk doanh thu thật (Acme/BizCo). Cả hai impact cao, không phải "nice to have".
- **Defer #3 (tags), #5 (export MD)**: #3 cần schema migration + UI (M/L thật); #5 chính user nói "nice to have", 0 người +1.
- **Quick win nếu dư giờ (không commit vào scope)**: #2 confirm-delete (~5') = thêm `confirm()` trước `deleteMeeting` ở detail page; #6 long-title (~5') = `truncate`/`line-clamp` + `min-w-0` ở list row.
- **Phase B (0:50)**: dùng `tasks/specs/` để giảm ambiguity, hoàn thiện cái đã bắt đầu — không mở task mới trừ khi #1+#4 đã chắc.
