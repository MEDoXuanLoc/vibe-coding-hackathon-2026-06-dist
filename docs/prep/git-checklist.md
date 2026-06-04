# Git checklist — Hackathon submission

> Trạng thái remote **đã xác minh** trong repo này:
> - `origin` → fork của anh: `https://github.com/MEDoXuanLoc/vibe-coding-hackathon-2026-06-dist.git`
> - `upstream` → repo BTC: `https://github.com/marketenterprise/vibe-coding-hackathon-2026-06-dist.git`
> - Fork + upstream **đã setup sẵn** (pre-event step 2 done). Đang ở branch `main`.
>
> ⚠ PR nộp: từ **fork (origin) `submit/<tên>`** → vào **upstream (marketenterprise) `main`**. PR KHÔNG được merge — chỉ là snapshot chấm điểm.

---

## Trước event (làm ngay bây giờ)

- [ ] Đồng bộ `main` với BTC để có code mới nhất:
  ```bash
  git checkout main
  git pull upstream main
  ```
- [ ] Tạo branch làm việc từ main (mang theo toàn bộ prep file đang có):
  ```bash
  git checkout -b submit/loc-do    # đổi <tên> theo ý; ví dụ BTC: submit/linh-nguyen
  ```
- [ ] (Tùy chọn) Commit prep scaffolding ngay để có mốc sạch — và để show trong PR:
  ```bash
  git add -A
  git commit -m "chore: pre-event AI context + prep (CLAUDE/INSIGHT/Grok/specs)"
  git push -u origin submit/loc-do
  ```

## Trong event

- [ ] Làm việc **trên branch `submit/<tên>`**, không phải `main`.
- [ ] Commit nhỏ, message rõ theo task, ví dụ:
  ```bash
  git add -A && git commit -m "fix(#1): display meetingDate in local TZ (formatDate + edit prefill)"
  git add -A && git commit -m "feat(#4): full-text search over title+body (?q=) + search box"
  ```

## Mốc 0:50 — pull spec từ BTC

- [ ] Lấy `tasks/specs/` (BTC push vào upstream/main):
  ```bash
  git pull upstream main        # đang ở branch submit/<tên>, merge specs vào
  ```
  - Nếu có conflict ở file ta đã sửa → resolve thủ công, ưu tiên giữ code của mình + tham khảo spec.
  - Nếu chỉ muốn lấy thư mục specs cho gọn: `git fetch upstream && git checkout upstream/main -- tasks/specs/`

## Mốc 1:25 — nộp

- [ ] Push lần cuối:
  ```bash
  git push origin submit/loc-do
  ```
- [ ] Mở PR: **base** = `marketenterprise/vibe-coding-hackathon-2026-06-dist : main` ← **head** = `MEDoXuanLoc : submit/loc-do`.
  ```bash
  # nếu dùng gh CLI:
  gh pr create --repo marketenterprise/vibe-coding-hackathon-2026-06-dist \
    --base main --head MEDoXuanLoc:submit/loc-do \
    --title "Submission: <tên>" --body-file docs/prep/submission-draft.md
  ```
  - Hoặc mở trên web: vào fork → "Contribute" / "Open pull request" → chọn base repo = marketenterprise, base = main.
- [ ] Dán nội dung từ [submission-draft.md](submission-draft.md) (PR BODY) vào mô tả + nối REFLECTION ở cuối. Điền hết chỗ `‹ĐIỀN TRONG EVENT›`.
- [ ] **Snapshot tại 1:25 là cái được chấm** — được làm tiếp sau nhưng không tính.

## Lưu ý
- `gh pr create --body-file` sẽ dán **nguyên** file submission-draft (gồm cả phần hướng dẫn ở đầu). Nên **copy thủ công** phần dưới `# ════ PR BODY ════` thôi, hoặc tạo file body sạch trước khi nộp.
- Không commit `.env`, output sinh ra, `node_modules` (đã có trong .gitignore).
