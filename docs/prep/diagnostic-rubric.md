# Diagnostic Rubric — cách buổi thi chấm điểm

> Đây **không phải** competition. Là **diagnostic** đo "vibe-coding fluency" — cách User + AI làm việc cùng nhau.
> Số task hoàn thành KHÔNG phải thước đo chính. Cách làm + lý do mới là thứ được chấm.
> File này để tra ở các điểm quyết định trong event; không auto-load (giữ CLAUDE.md lean).

## 6 trục đánh giá — và artifact ta dùng để ghi điểm

| # | Trục | Nghĩa | Ta thể hiện bằng |
|---|------|-------|------------------|
| 1 | **Specification** | Dùng AI viết kế hoạch & review | Mini-spec + DoD đo được → [phase-a-mini-specs.md](phase-a-mini-specs.md) |
| 2 | **Iteration** | Vòng Plan → Implement → Verify | Tóm tắt spec → plan → confirm → code → verify; không nhảy thẳng vào code |
| 3 | **Orchestration** | Song song hóa, delegate cho nhiều phiên AI | Vòng báo cáo Grok×Claude → [grok-report-template.md](grok-report-template.md); chạy task độc lập song song |
| 4 | **Verification** | Làm rõ bước xác minh | DoD checklist + bằng chứng (vd: fixture sáng sớm để reproduce #1, response API, screenshot) |
| 5 | **Context Construction** | Xây ngữ cảnh có chủ đích | CLAUDE.md · INSIGHT.md · GROK_SYSTEM_INSTRUCTION — **điểm mạnh hiện tại** |
| 6 | **Prioritization** | Tự quyết thứ tự + lý do | Chọn #1+#4, defer #3/#5, quick-win #2/#6 — lý do ghi vào PR + reflection |

→ Hiện ta phủ 5/6 trục bằng artifact cụ thể; trục 6 chốt ở reflection.

## Golden rules từ BTC (ảnh hưởng hành vi trong event)
- **Sản phẩm chạy được > hoàn hảo** trong 1.5h. "Perfect but ran out of time" tệ hơn "tradeoff có chủ đích, giải thích được".
- **Tắc → dừng, hít thở, xem lại chiến lược, lập lại kế hoạch.** Không cố đấm.
- **Không nhận đề xuất AI nguyên xi** — luôn đối chiếu với ý đồ của User.
- Chỉ **tự làm phần cần phán đoán**; phần còn lại giao AI.

## Thang tier (style khuyến khích: T2, chạm T3 nếu cần)
- **T0 Instinctive** — đi theo trực giác với cái AI đưa.
- **T1 Reactive** — chạy theo error message, "không chạy thì thử lại".
- **T2 Iterative** — chủ động vòng spec → implement → verify. ← **mục tiêu**
- **T3 Orchestrative** — kết hợp nhiều AI/tool/context, tự giữ các quyết định ưu tiên.
- Reflection có self-assessment tier: **trung thực quan trọng hơn chọn cao** (AI chấm soi khoảng cách giữa tier judged vs self-assessed = tín hiệu metacognition).

## Nhắc nhanh khi vào event
1. Mỗi task: bắt đầu bằng **Value** (giá trị gì, metric nào) → spec/plan → confirm → implement → **verify có bằng chứng** → báo cáo Grok.
2. Ghi lại **quyết định ưu tiên + lý do** ngay khi quyết (đừng để cuối giờ nhớ lại).
3. Lưu 2–3 ví dụ cụ thể: chỗ delegate cho AI, chỗ tự override AI, chỗ AI fail → nguyên liệu reflection.
