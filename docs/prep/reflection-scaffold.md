# REFLECTION SCAFFOLD — Vibe Coding Hackathon Diagnostic

> **Tác giả: Grok** (system thinking). Đây là **công cụ để SUY NGHĨ** — tổ chức theo đúng 6 trục chấm điểm.
> Sau khi điền xong, **chắt lọc các câu trả lời chính sang [submission-draft.md](submission-draft.md)** (đó mới là
> bản nộp thật, theo cấu trúc reflection-template.md bắt buộc của BTC). Hai file bổ trợ nhau, không trùng vai.

**Mục đích**: Giúp bạn viết reflection nhanh (5–8 phút), sâu, và có cấu trúc theo đúng 6 trục mà ban tổ chức đang đánh giá.

**Cách dùng**: Điền ngắn gọn sau khi kết thúc 1.5 giờ. Có thể copy paste vào PR body.

---

## 1. Quyết định ưu tiên & Lý do (Prioritization)

**Task(s) tôi chọn làm:**
- #1 (ngày JST), #4 (search) làm chính; #2 (confirm delete) + #6 (title overflow) làm quick-win sau khi 2 task chính chắc.

**Tại sao chọn task này thay vì task khác?**
- #1 = data integrity, ticket lặp hàng tuần, fix rẻ (display layer). #4 = #1 NPS 6 tháng + churn risk doanh thu thật (Acme/BizCo). Cả hai impact cao theo business × cost thấp/vừa.

**Task nào tôi chủ động bỏ/defer và lý do?**
- Defer #3 (tags): task M thật — schema migration + API + UI filter, không làm tử tế kịp trong 1.5h.
- Skip #5 (export MD): chính user nói "nice to have", 0 người +1, sales xác nhận khách không hỏi.

**Đánh giá mức độ đúng đắn của quyết định này (sau khi làm xong):**
- Đúng: hoàn thành 4 story đạt full AC + còn dư thời gian audit & spec-align, thay vì làm dở 6 cái. Spec Phase B xác nhận #3 đúng là task lớn.

---

## 2. Đánh giá theo 6 trục

### 2.1 Specification (AI viết kế hoạch & review)
- Grok viết mini-spec cho #1/#4 trước event: giá trị, DoD đo được, đánh dấu `[OPEN]` chỗ chưa chắc (TZ local vs JST).
- Kế hoạch hợp lý, chỉnh ít. Hài lòng: spec bắt sẵn "bẫy reproduce" (#1 cần fixture sáng sớm). Chưa hài lòng: để TZ là `[OPEN]` — đáng lẽ neo JST sớm hơn (app JST-centric).

### 2.2 Iteration (Vòng lặp Lập kế hoạch → Triển khai → Xác minh)
- Có xoay vòng thật cho từng task, không làm thẳng.
- Ví dụ rõ nhất: #1 — Phase A chọn TZ-local (có lý do), Phase B đọc spec AC#3 yêu cầu JST → **dừng, verify case 00:30 JST thấy local fail với VN, đảo quyết định** sang Asia/Tokyo. Một vòng iterate hoàn chỉnh do dữ liệu mới (spec).

### 2.3 Orchestration (Song song hóa & delegate subtask)
- Mô hình: Grok (spec + review logic) × Claude (implement + verify). Không chạy nhiều phiên song song → lý do tôi giữ T2 (không tự nhận T3 cho đủ).
- Delegate: viết spec, code, viết verify. Giữ lại: quyết định ưu tiên, override kỹ thuật, quyết định scope.
- Hiệu quả: review của Grok kéo ra bug LIKE wildcard mà self-review code dễ bỏ sót → giá trị thật của 2-AI loop.

### 2.4 Verification (Làm rõ bước xác minh)
- Chủ động verify, không tin AI tương đối.
- Cách: seed fixture 07:30 JST reproduce; node logic test (00:30 JST chứng minh độc lập TZ); curl edge case search (%, _, 12%, hoa/thường, rỗng, partial); soát XSS/SQLi.
- AI sai tôi bắt được: (a) #1 TZ-local fail spec → sửa; (b) #4 `%`/`_` bị coi wildcard → escape.

### 2.5 Context Construction (Xây dựng ngữ cảnh có chủ đích)
- Trước event: CLAUDE.md (lean, auto-load), INSIGHT.md (KB cho Grok), GROK_SYSTEM_INSTRUCTION, claude-grok.md, mini-specs. Trong event: cập nhật decisions.md.
- Hữu ích nhất: boundary rule trong INSIGHT ("ngày sai sửa ở display, không đụng DB") + insight "bẫy reproduce #1" trong mini-spec.
- Còn thiếu: chưa neo JST trong context từ đầu (phải sửa ở Phase B).

### 2.6 Prioritization (Tự quyết định thứ tự ưu tiên)
- Có, ưu tiên theo impact (data integrity #1 + churn #4) rồi quick-win, defer #3/skip #5.
- **Quyết định mạnh nhất: chủ động audit ra pre-existing security gaps (no input validation, no auth, CORS allow-all) nhưng QUYẾT KHÔNG sửa** — ngoài scope, sát deadline dễ regression, ưu tiên sản phẩm ổn định > sửa hết technical debt. Ghi nhận + đề xuất follow-up (task riêng input validation + auth) thay vì scope-creep.
- Bài học: phân biệt "lỗi mình tạo ra" vs "technical debt có sẵn" là một quyết định ưu tiên, không phải bỏ sót.

---

## 3. Delegation & Human Judgment (Ranh giới quan trọng)

**Những việc tôi giao cho AI và kết quả:**
- Grok: mini-spec + DoD + review logic → kết quả tốt, review bắt được bug wildcard.
- Claude: implement 4 task + viết verify (fixture/curl/node) → chạy đúng, compile sạch.

**Những việc tôi tự làm vì cần phán đoán / chịu trách nhiệm:**
- Quyết định ưu tiên (#1+#4, defer #3, skip #5) và override kỹ thuật (ILIKE thay tsvector).
- Đảo quyết định TZ sang JST khi đối chiếu spec (không giữ lựa chọn cũ chỉ vì đã làm).
- **Quyết định scope về security**: phát hiện pre-existing gaps (no validation/auth, CORS allow-all) → chủ động KHÔNG sửa sát giờ (tránh regression), ghi nhận + đề xuất follow-up. Phân biệt rõ "lỗi mình tạo" vs "debt có sẵn".

**Đánh giá ranh giới delegation của tôi có hợp lý không?**
- Hợp lý: giao phần cơ học (spec draft, code, verify script) cho AI; giữ lại phần phán đoán (ưu tiên, trade-off, scope, chịu trách nhiệm quyết định). Đúng nguyên tắc "chỉ tự làm phần cần phán đoán".

---

## 4. Đánh giá Style (T0 – T3)

> Lưu ý: nhãn tier chính thức (reflection-template.md BTC) là T0 Instinctive / T1 Reactive / T2 Iterative / T3 Orchestrative. Khi nộp dùng nhãn chính thức.

**Style chính tôi thể hiện trong buổi này:**
- □ T0 — Instinctive (Phản xạ)
- □ T1 — Reactive (chạy theo error message)
- ☑ **T2 — Iterative (Có kế hoạch: Plan → Implement → Verify)** ← chạm T3 nhẹ
- □ T3 — Orchestrative (nhiều phiên song song, orchestration mạnh)

**Lý do tôi đánh giá mình ở level này:**
- Chạy plan→implement→verify có chủ đích cho từng task, có đảo quyết định dựa trên dữ liệu mới (spec). Điều phối Claude×Grok (spec/review/implement/verify) + tự giữ quyết định ưu tiên/scope → chạm T3 ở Context Construction & Prioritization. Chưa chạy nhiều phiên song song nên giữ T2 cho trung thực.

**Level tôi muốn hướng tới trong công việc sau này:**
- T3: chạy song song nhiều luồng AI cho subtask độc lập, giữ vai biên đạo.

---

## 5. Kết quả & Bài học có thể tái hiện

**Điều tôi làm tốt nhất trong 1.5 giờ này:**
- Verification có chiều sâu (reproduce bằng fixture, edge case, soát bảo mật) + prioritization có kỷ luật (không scope-creep).

**Điều tôi cần cải thiện rõ nhất:**
- Neo giả định nền tảng (timezone) sớm hơn — tránh phải đảo ở Phase B.

**Mô hình / cách làm nào từ buổi này tôi có thể tái hiện trong công việc hàng ngày?**
- Vòng 2-AI: một bên spec/review logic, một bên implement/verify; + decision log + báo cáo sau mỗi task verified.

**Nếu làm lại từ đầu, tôi sẽ thay đổi điều gì?**
- Đọc/đoán yêu cầu nền (JST-centric) ngay từ context, không để `[OPEN]` cho phần có thể suy ra được.

---

## 6. Self-Assessment (Tổng kết)

**Mức độ hài lòng với kết quả sản phẩm (chạy được trong thời gian):**
- Cao: 4/6 story đạt full AC, app chạy ổn, không regression, có dư thời gian audit.

**Mức độ hài lòng với cách mình dùng AI:**
- Cao: vòng spec→implement→verify→review chạy trơn; AI bắt được bug (wildcard) tôi có thể bỏ sót.

**Điểm tôi muốn nhấn mạnh nhất trong reflection này:**
- Human judgment ở ranh giới scope: chủ động audit pre-existing security gaps nhưng quyết KHÔNG sửa sát giờ — ưu tiên sản phẩm ổn định + đề xuất follow-up, thay vì scope-creep.

---

**Ghi chú cuối:**  
Reflection này không cần dài. Quan trọng là **chân thật** và **có ví dụ cụ thể**. Ban tổ chức đánh giá cao người biết tự nhìn lại và rút ra bài học hơn là người làm được nhiều task.
