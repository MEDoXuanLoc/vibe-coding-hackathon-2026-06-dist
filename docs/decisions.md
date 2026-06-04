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

## 2026-06-04 — #1 Date display theo JST tường minh (Asia/Tokyo)
- **Bối cảnh:** `formatDate` format theo UTC → lệch ngày với họp sáng sớm (07:00 JST = 22:00 UTC hôm trước). DB lưu đúng.
- **Quyết định ban đầu (Phase A):** dùng `toLocaleDateString('en-CA')` = TZ local người xem (đánh dấu `[OPEN]`: local vs JST).
- **Quyết định cuối (Phase B, sau khi đọc spec-1):** đổi sang **`toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })`** — JST tường minh, độc lập TZ trình duyệt. Spec AC#3 yêu cầu rõ "không phụ thuộc TZ trình duyệt, luôn giả định JST" và khuyến nghị cách A; cách B (local) bị "không khuyến khích".
- **Lý do / trade-off:** Local browser FAIL với người xem VN khi họp lúc 00:00–01:59 JST (verify: 00:30 JST → VN-local ra ngày hôm trước, JST đúng). JST tường minh khớp AC, vẫn minimal (1 dòng trong `formatDate`), không đụng DB/API.
- **Tác động:** `app/web/lib/api.ts`, edit-form prefill (dùng lại `formatDate`), seed fixture.
- **ADR:** Không.
