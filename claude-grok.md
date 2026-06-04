# Claude × Grok — Working Process v1.1

> Quy trình làm việc giữa hai AI cho project này. Bản chi tiết; bản nén nằm trong
> GROK_SYSTEM_INSTRUCTION (PART2). Mục tiêu: vòng lặp spec → implement → verify rõ ràng,
> không để một AI tự review chính nó.

## Vai trò

| Bên | Trách nhiệm | KHÔNG làm |
|---|---|---|
| **Grok** | System thinking, architecture, business value, trade-off, viết spec/ADR, review logic | Không viết code |
| **Claude** | Implement, test, refactor, performance, viết docs kỹ thuật | Không tự ý đổi architecture (phải qua ADR), không tự review code mình vừa viết coi như đã review |
| **User (Anh)** | Quyết định ưu tiên; **trọng tài** khi 2 AI bất đồng | — |

## Phân loại task (bước BẮT BUỘC đầu tiên)

| Loại | Quy mô | Quy trình |
|---|---|---|
| **S** | < 2h, không đụng logic lõi | Giao thẳng Claude, không spec |
| **M** | nửa–2 ngày | Mini-spec (Grok) → Claude tóm tắt + plan → confirm → implement → quick review |
| **L** | > 2 ngày / đụng architecture | Discovery → Full Spec → (Spike) → Implement → Review + **ADR** |

Không rõ loại → hỏi User.

## Vòng lặp task M/L

1. **Value first** — Grok nêu: giá trị gì, đo bằng metric nào. Không trả lời được → nói thẳng, có thể không đáng làm.
2. **Spec** (Grok) — Mini/Full spec với **Definition of Done đo được**. Phần chưa chắc đánh dấu `[OPEN]`.
3. **Plan** (Claude) — tóm tắt lại spec theo cách hiểu của mình → chỉ ra điểm mơ hồ → đề xuất plan (chia commit/file) → **chờ User confirm** trước khi code.
4. **(Spike tùy chọn)** — rủi ro cao → prototype throwaway ngắn.
5. **Implement** (Claude) — code theo plan; bám DoD.
6. **Verify** (Claude) — exercise thật, có **bằng chứng** (fixture/response/screenshot). Không tự nhận "xong" khi chưa verify.
7. **Báo cáo Grok** — phát report theo [docs/prep/grok-report-template.md](docs/prep/grok-report-template.md) để Grok **review logic** + cập nhật context.
8. **Review** (Grok review logic; Claude review kỹ thuật). Đổi architecture → tạo **ADR** trong `docs/adr/`.

## Quy tắc bất biến
- Không skip bước **Value**.
- Spec không rõ → **hỏi**, không đoán.
- Tuyệt đối không paste sensitive data / secret.
- Phát hiện vấn đề → **dừng & phản hồi ngay**, không vòng vo.
- Đổi architecture → **ADR**.
- **Không đoán codebase**: thiếu context → yêu cầu INSIGHT.md hoặc snippet interface (không full file).
- **Không nhận đề xuất AI nguyên xi** (golden rule BTC) — User đối chiếu ý đồ trước khi chấp nhận.

## Context protocol (Grok ↔ repo)
- Grok không tự đọc repo. Đọc **INSIGHT.md** (đã upload) + cái được paste.
- Grok cần *architecture / responsibility / data flow*, **không** cần chi tiết code.
- Cần sâu hơn → Claude pull interface/snippet cụ thể, không paste full file.

## Anti-patterns
- Spec quá chi tiết cho task S.
- Để Claude tự review code Claude (biased).
- Trộn nhiều feature L trong 1 chat.
- Skip review / skip verify.
- Báo cáo Grok khi task còn nửa chừng (chỉ báo sau khi verify xong).

## Liên kết
- Rubric chấm điểm: [docs/prep/diagnostic-rubric.md](docs/prep/diagnostic-rubric.md)
- Mẫu báo cáo: [docs/prep/grok-report-template.md](docs/prep/grok-report-template.md)
- KB cho Grok: [INSIGHT.md](INSIGHT.md) · Grok prompt: [docs/prompts/GROK_SYSTEM_INSTRUCTION.md](docs/prompts/GROK_SYSTEM_INSTRUCTION.md)
