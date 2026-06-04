# Submission draft — PR body + Reflection

> Soạn trước event. Phần đã chốt chiến lược đã điền sẵn; phần cần số liệu thật đánh dấu **‹ĐIỀN TRONG EVENT›**.
> Lúc 1:25 chỉ việc dán phần "PR BODY" vào mô tả PR, rồi nối phần "REFLECTION" vào cuối (reflection là mục bắt buộc).
> Viết tiếng Việt (BTC cho phép JP/EN/VN — chọn ngôn ngữ viết nhanh nhất).
>
> ⚠ **Trung thực về context dựng trước**: phần lớn AI scaffolding (CLAUDE.md, INSIGHT.md, GROK instruction,
> mini-specs) được dựng TRƯỚC event — hợp lệ (BTC cho nạp context trước), nhưng PHẢI nói rõ cái nào trước
> vs cái nào tạo/sửa trong event, để người chấm đánh giá đúng năng lực context-construction *trong lúc làm*.

---

# ════════ PR BODY ════════

## Tasks I worked on

> Liệt kê theo thứ tự đã làm, dùng số # từ user-stories.md. Cập nhật status thật.

1. #1 Date off-by-one (timezone display) — ‹done / partial›
2. #4 Full-text search (title + body) — ‹done / partial›
3. ‹#6 long-title / #2 confirm-delete nếu kịp — quick win›
4. ‹task không làm — ghi "not attempted" + 1 lý do›

## Why I picked this order

Tôi ưu tiên theo **business impact × implementation cost**, không làm dàn trải:

- **#1 trước (S, ~10–15')**: là **data integrity** — ngày sai làm mất uy tín khi share note cho khách (story Linh), 8 tickets/tháng lặp lại hàng tuần. Fix rẻ (chỉ 1 hàm `formatDate`), value cao → làm đầu tiên.
- **#4 sau (M, ~20–30')**: **#1 NPS 6 tháng liền** + **churn risk doanh thu thật** (Acme/BizCo dọa rời khi renew trong 4–5 tháng). Cost vừa phải (Prisma `where OR contains`). Đây là task value cao nhất xét theo tiền.
- **Defer mạnh #3 (tags) và #5 (export MD)**: #3 cần schema migration + UI filter (task M/L thật, không kịp làm tử tế trong 1.5h). #5 chính user nói "nice to have", **0 người +1**, sales xác nhận khách không hỏi → giá trị thấp nhất.
- **#2 (confirm-delete) và #6 (long-title) chỉ làm như quick-win nếu #1+#4 đã chắc** — mỗi cái ~5', không commit vào scope chính để tránh phân tán.

‹Nếu thực tế khác kế hoạch (vd hết giờ ở #4), ghi thẳng: đã quyết định cắt gì và vì sao.›

## How I used AI tools

**Tools**: Claude Code (implement + test + context construction) × Grok (system thinking, spec, review logic). Quy trình hai AI: xem `claude-grok.md`.

**Chỗ delegate cho AI** (điền 2–3 ví dụ cụ thể):
- ‹VD: Grok viết mini-spec #4, chỉ ra dùng Prisma `where: { OR: [...] , mode: 'insensitive' }` — tôi không nhớ chính xác cú pháp.›
- ‹VD: Claude implement + tự viết fixture verify cho #1.›
- ‹...›

**Chỗ tôi tự quyết / override AI** (2–3 ví dụ):
- ‹VD: AI đề xuất full-text search bằng tsvector index; tôi override → dùng ILIKE `contains` vì MVP 1.5h, đủ cho yêu cầu "tìm proper noun/số".›
- ‹VD: Tôi quyết KHÔNG đụng form create/edit khi fix #1 dù AI gợi ý — tránh scope-creep.›
- ‹...›

**Chỗ AI fail / lệch ý đồ** (1–2 ví dụ — BTC chấm cao sự trung thực này):
- ‹VD: AI ban đầu "fix" #1 nhưng không reproduce được vì seed toàn ≥09:00 JST; tôi phải yêu cầu thêm fixture sáng sớm mới thấy bug thật.›
- ‹...›

**Advanced features đã dùng**: ‹plan mode / sub-agents / custom skills / MCP / hooks / custom commands — mô tả ngắn nếu có. VD: context files tự dựng (mục dưới), vòng báo cáo Grok×Claude.›

## What you verified

- ‹Đã exercise: list view, create/edit/delete, feature mới (search, date).›
- **#1**: thêm fixture 07:30+09:00 JST → trước fix hiện sai 1 ngày, sau fix đúng ở **cả list, detail và ô Edit** (sửa `formatDate` + prefill edit form); meeting 09:00+ cũ không đổi. ‹kết quả thật›
- **#4**: `GET /api/meetings?q=...` lọc đúng title+body case-insensitive; không q → full list (không regression); 0 kết quả → empty-state. ‹kết quả thật›
- **Known issues chưa fix**: ‹VD: POST chưa validate input; form gửi date-only→UTC midnight (round-trip ổn nhưng không lý tưởng).›

## AI context files you added

> BTC tính đây là một phần "how you used AI". Nói rõ **dựng trước vs trong event**.

**Dựng TRƯỚC event** (nạp context — hợp lệ):
- `CLAUDE.md` — stack, entry points, constraints, links (auto-load cho Claude, giữ <60 dòng).
- `INSIGHT.md` — KB cho Grok: architecture, module map, data flow, boundary rules.
- `docs/prompts/GROK_SYSTEM_INSTRUCTION.md` (+ parts) — persona + workflow + project context cho Grok.
- `claude-grok.md` — quy trình hai AI v1.1. `docs/prep/` — mini-specs #1/#4, rubric, report template.

**Tạo / chỉnh TRONG event**: ‹điền — vd ADR nếu đổi architecture, cập nhật INSIGHT sau khi thêm field, decisions.md›

## Extra work (optional)

‹Nếu xong hết và còn giờ: liệt kê 1 dòng mỗi cái — vd thêm input validation cho POST, cải thiện loading state.›

---

# ════════ REFLECTION (nối vào cuối PR body — BẮT BUỘC) ════════

## 1. Task order and timing

| Order | Task # | Time spent | Status |
|---|---|---|---|
| 1 | #1 | ‹phút› | ‹done/partial/not› |
| 2 | #4 | ‹phút› | ‹...› |
| 3 | ‹#6/#2› | ‹phút› | ‹...› |
| 4 | ‹...› | | |
| 5 | | | |
| 6 | | | |

## 2. AI delegation vs. your own judgement

**Delegated** (2–3 ví dụ): ‹copy gọn từ mục "How I used AI" ở trên, chỉnh cho khớp thực tế›

**Decided yourself** (2–3 ví dụ): ‹...›

## 3. Sticking points
- Vấn đề: ‹...› — Cách thoát: ‹hỏi AI / đọc docs / thử nghiệm / bỏ›. AI giúp hay làm rối: ‹...›

## 4. What you would change
- Làm lại 1.5h này tôi sẽ: ‹làm gì trước›. Chỗ tốn quá nhiều giờ / quyết chậm: ‹...›

## 5. Tool feedback
### Claude Code
- Worked: ‹...› · Didn't: ‹...› · "Không có nó tôi mất thêm ~N phút": ‹...›
### Grok
- Worked: ‹...› · Didn't: ‹...›

## 6. Tier self-assessment
- [ ] T0 Instinctive  [ ] T1 Reactive  [x?] **T2 Iterative**  [ ] T3 Orchestrative

Lý do (1 dòng — **trung thực hơn là chọn cao**): ‹VD: tôi chạy vòng spec→implement→verify có chủ đích cho #1 và #4, và điều phối Grok×Claude ở mức báo cáo/review → T2, chạm T3 ở phần orchestration. Nếu thực tế chỉ reactive thì ghi T1 — đừng tô.›

## 7. Free-form
‹Feedback cho BTC: độ khó, khối lượng task, trục đánh giá có ý nghĩa không.›
