# Decisions Log — Meeting Notes App

> Quyết định kỹ thuật/sản phẩm ngắn gọn. Quyết định lớn (đổi architecture) → ADR riêng trong `docs/adr/` rồi link về đây.

## Format

```
## YYYY-MM-DD — <Tiêu đề quyết định>
- **Bối cảnh:** vì sao cần quyết định
- **Quyết định:** chốt cái gì
- **Lý do / trade-off:** tại sao chọn cái này thay vì lựa chọn khác
- **Tác động:** module/file ảnh hưởng
- **ADR:** docs/adr/NNNN-*.md (nếu là task L)
```

---

<!-- Thêm quyết định mới ở trên cùng (mới nhất trước). -->

## 2026-06-04 — #4 Search: ILIKE contains + escape, defer pagination/highlight
- **Bối cảnh:** Story #4 cần tìm proper noun/số trong title+body. Quy mô <500 notes.
- **Quyết định:** Dùng Prisma `contains` + `mode:'insensitive'` (ILIKE) trên title OR body. Escape `% _ \` trong query (Prisma không tự escape → `%`/`_` bị coi là wildcard). **Defer**: pagination, highlight match, multi-keyword AND/OR.
- **Lý do / trade-off:** ILIKE đủ cho use case hiện tại, không cần `tsvector`/full-text index ở quy mô này. Escape là fix correctness rẻ (1 dòng, verify được). Pagination chưa cần tới ~2000–3000 notes (limit/offset hoặc cursor khi đó); highlight là nice-to-have.
- **Tác động:** `app/api/src/routes/meetings.ts`, `app/web/lib/api.ts`, `app/web/app/page.tsx`.
- **ADR:** Không (không đổi architecture/schema).

## 2026-06-04 — #1 Date display theo timezone local người xem
- **Bối cảnh:** `formatDate` format theo UTC → lệch ngày với họp sáng sớm (07:00 JST = 22:00 UTC hôm trước). DB lưu đúng.
- **Quyết định:** Sửa display path (`formatDate` + edit-form prefill) dùng `toLocaleDateString('en-CA')` = ngày theo **TZ local người xem**. KHÔNG hardcode JST, KHÔNG đụng DB.
- **Lý do / trade-off:** Minimal + đúng cho cả VN/JST trong app nội bộ. **Rủi ro đã ghi nhận:** nếu sau này cần "ngày họp chuẩn" cho báo cáo/audit theo JST hoặc reminder/notification → cần chuẩn hóa (field JST riêng hoặc hiển thị theo TZ cố định). Chấp nhận cho MVP nội bộ.
- **Tác động:** `app/web/lib/api.ts`, `app/web/app/page.tsx`, `app/web/app/meetings/[id]/{page,edit/page}.tsx`, seed fixture.
- **ADR:** Không.
