## Tasks I worked on

1. **#1** UTC/JST date off-by-one — **done** (Phase A; aligned to JST per spec in Phase B)
2. **#4** Full-text search (title + body) — **done**
3. **#2** Confirm before delete — **done** (quick win)
4. **#6** Long-title overflow in list — **done** (quick win; tooltip added per spec)
5. **#3** Tags/filter — **not attempted** (deliberately deferred — task M: schema + API + UI)
6. **#5** Markdown export — **not attempted** (deliberately skipped — lowest demand)

## Why I picked this order

Ưu tiên theo **business impact × implementation cost**, không làm dàn trải:

- **#1 trước**: data integrity — ngày sai làm mất uy tín khi share note cho khách, 8 tickets/tháng lặp lại. Fix rẻ (display layer, 1 hàm). Value cao, cost thấp → làm đầu.
- **#4**: #1 NPS 6 tháng + churn risk doanh thu thật (Acme/BizCo renew 4–5 tháng). Cost vừa (Prisma ILIKE). Value cao nhất xét theo tiền.
- **#2 + #6** là quick-win (~5' mỗi cái, khác file) — nhặt sau khi #1/#4 chắc, không phân tán: #2 chặn xóa nhầm không khôi phục được; #6 sửa vỡ layout.
- **Defer #3** (tags): task M thật (schema migration + API + UI filter), không làm tử tế kịp trong 1.5h → để nguyên hơn là làm dở.
- **Skip #5** (export MD): chính user nói "nice to have", 0 người +1, sales xác nhận khách không hỏi → value thấp nhất.

## How I used AI tools

**Tools**: **Claude Code** (implement + test/verify + context construction) × **Grok** (system thinking, spec, review logic). Quy trình hai AI: `claude-grok.md`.

**Delegate cho AI:**
- Grok viết mini-spec #1/#4 trước event (giá trị, DoD đo được, đánh dấu `[OPEN]`).
- Claude implement toàn bộ code + tự viết fixture/curl verify.

**Tự quyết / override AI:**
- Override đề xuất `tsvector` → chọn ILIKE `contains` cho MVP 1.5h (đủ cho "tìm tên khách/số").
- Quyết defer #3 và skip #5 dựa trên impact, dù AI có thể làm được — đây là phán đoán PM, giữ cho mình.
- Khi spec-1 release mâu thuẫn lựa chọn TZ-local của tôi, **tôi tự đối chiếu** rồi đổi sang JST tường minh (không nhận đề xuất cũ nguyên xi).

**Chỗ AI sai / lệch — và tôi bắt được:**
- **#1 timezone**: Phase A tôi chọn TZ-local (browser) có lý do; Phase B spec AC#3 yêu cầu JST cố định, "không khuyến khích" local. Verify chứng minh local FAIL với người xem VN khi họp 00:30 JST → đã sửa sang `Asia/Tokyo`.
- **#4 LIKE wildcard**: Grok review đẩy trục Verification → tôi phát hiện `%`/`_` bị Prisma `contains` coi là wildcard (q='%' trả toàn bộ; q='12%' match nhầm "12 minutes"). Đã escape `% _ \` + verify lại.

**Advanced features**: context files tự dựng (`CLAUDE.md`, `INSIGHT.md`, Grok system prompt), vòng báo cáo Claude→Grok review→sửa (orchestration 2 AI), plan→implement→verify từng task, decision log.

## What you verified

Chạy app thật (Docker), curl API + node logic + eyeball:
- **#1**: thêm fixture 07:30 JST (lưu `2026-04-19T22:30Z`). Formatter cũ→`04-19` (sai), mới (JST)→`04-20` (đúng) ở list/detail/edit; case 00:30 JST chứng minh độc lập TZ trình duyệt; meeting 09:00 JST cũ không đổi; web compile sạch.
- **#4**: full=13; `q=billing`→2 (match body); `BILLING`==`billing` (case-insensitive); `q=search`→4; không khớp→`[]` + empty-state; không q→full list (no regression); wildcard `%`/`_`/`12%` escape đúng sau fix.
- **#2**: bấm Delete → hộp confirm; hủy thì không xóa.
- **#6**: title 113 ký tự ellipsize 1 dòng, cột ngày thẳng hàng, hover xem full (title attr), title ngắn không đổi.

**Known issues chưa fix (cố ý):** `POST /api/meetings` chưa validate input; form lưu đẩy date→UTC midnight (mất time-of-day, *ngày* vẫn đúng); #4 chưa sync query vào URL (gợi ý optional của spec) + chưa highlight match.

## AI context files you added

**Dựng TRƯỚC event** (nạp context — hợp lệ): `CLAUDE.md`, `INSIGHT.md`, `docs/prompts/GROK_SYSTEM_INSTRUCTION.md` (+parts), `claude-grok.md`, `docs/prep/` (mini-specs, rubric, report/submission templates, git checklist).
**Tạo/cập nhật TRONG event**: `docs/decisions.md` (log quyết định #1 TZ + #4 ILIKE/escape, gồm cả việc đảo quyết định TZ ở Phase B), seed fixture.

## Extra work (optional)

- #2 confirm-delete và #6 tooltip ngoài 2 task ưu tiên.
- #4 escape LIKE wildcard (vượt spec — spec không yêu cầu, nhưng là correctness bug thật do Grok review chỉ ra).

---

# Reflection

## 1. Task order and timing

| Order | Task # | Time (approx) | Status |
|---|---|---|---|
| 1 | #1 | ~15' | done |
| 2 | #4 | ~25' (gồm escape fix) | done |
| 3 | #2 | ~5' | done |
| 4 | #6 | ~5' | done |
| — | #3 | — | deferred (task M) |
| — | #5 | — | skipped (no demand) |

## 2. AI delegation vs. own judgement

**Delegated**: spec/DoD (Grok), implement + viết verify (Claude), review logic (Grok → bắt edge wildcard).
**Decided myself**: ILIKE thay tsvector; defer #3 / skip #5 theo impact; đổi TZ-local→JST khi đọc spec thay vì nghe AT cũ.

## 3. Sticking points
- TZ là chỗ tinh tế nhất: lựa chọn ban đầu (local) đúng về "không lệch" nhưng sai về "chuẩn JST" mà spec yêu cầu. Thoát bằng cách đọc kỹ AC + verify case 00:30 JST để thấy local fail.

## 4. What you would change
- Đọc spec sớm hơn cho phần TZ (đã làm Phase A theo phán đoán, Phase B phải sửa). Nếu làm lại sẽ neo JST ngay từ đầu vì app JST-centric.

## 5. Tool feedback
- **Claude Code**: implement nhanh, tự verify bằng fixture/curl tốt. "Không có nó tôi mất thêm ~30–40'".
- **Grok**: review logic giá trị — câu hỏi về edge case kéo ra bug LIKE wildcard mà code-level dễ bỏ sót.

## 6. Tier self-assessment
- [ ] T0 · [ ] T1 · [x] **T2 Iterative** (chạm T3 ở orchestration)

Lý do: tôi chạy plan→implement→verify có chủ đích cho từng task, và điều phối Claude×Grok (Grok spec/review, Claude implement/verify) + tự giữ các quyết định ưu tiên & override — phần orchestration chạm T3, nhưng chưa chạy nhiều phiên song song nên giữ T2 cho trung thực.

## 7. Free-form
Spec ví dụ rõ ràng, AC đo được — đặc biệt AC#3 của #1 (JST cố định) giúp chốt đúng cái mơ hồ tôi đã đánh dấu `[OPEN]` từ Phase A.
