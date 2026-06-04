# Báo cáo cho Grok khi hoàn thành 1 task

> Sau khi Claude implement + verify xong **một** task, phát báo cáo theo mẫu dưới để User
> paste vào Grok. Mục đích: Grok **review logic** + **cập nhật mental model** về hệ thống.
>
> Nguyên tắc (PART2 context protocol): Grok cần *architecture / responsibility / quyết định / kết quả verify* —
> **KHÔNG paste full code**. Cần xem chi tiết thì Grok sẽ yêu cầu snippet/interface cụ thể.

---

## Mẫu (copy-paste vào Grok)

```
## Báo cáo Grok — Task #<n>: <tên ngắn>

- **Đã làm (theo behavior/value):** <1–2 dòng — người dùng giờ thấy/làm được gì khác>
- **Thay đổi (abstract):** <module/file + responsibility đụng tới; KHÔNG full code>
- **Quyết định / [OPEN] đã chốt:** <chọn phương án nào, vì sao; cái nào còn để ngỏ>
- **Verify (DoD):** <đã exercise gì, pass/fail, bằng chứng (fixture/screenshot/response)>
- **Risk / follow-up / known issue:** <hoặc "none">
- **Architecture có đổi không:** <không / có → đề xuất tạo ADR>

→ Nhờ Grok: review logic có lỗ hổng gì? DoD đã đủ chưa? Có cần ADR không?
```

---

## Ví dụ điền sẵn — Task #1 (date off-by-one)

```
## Báo cáo Grok — Task #1: Date off-by-one

- **Đã làm:** Ngày trên list/detail giờ hiển thị đúng calendar-day cho người xem;
  hết lệch 1 ngày với meeting sáng sớm (vd 07:00 JST).
- **Thay đổi (abstract):** Sửa duy nhất hàm formatDate (web/lib/api.ts) — bỏ format theo UTC,
  chuyển sang format theo timezone local của người xem. Không đụng DB/API/dữ liệu.
- **Quyết định / [OPEN] đã chốt:** Chọn hiển thị theo TZ local người xem (không hardcode JST)
  vì minimal + đúng cho cả VN/JST. [OPEN] neo cứng Asia/Tokyo: chưa làm.
- **Verify (DoD):** Thêm fixture 07:30+09:00 vào seed → trước fix hiện sai 1 ngày, sau fix đúng;
  meeting 09:00+ JST cũ không đổi.
- **Risk / follow-up / known issue:** Form create/edit vẫn gửi date-only→UTC midnight (round-trip ổn,
  để ngoài scope task này). 
- **Architecture có đổi không:** Không.

→ Nhờ Grok: lựa chọn TZ-local có rủi ro nghiệp vụ nào không? DoD đủ chưa?
```

---

## Khi nào KHÔNG cần báo cáo
- Task S cực nhỏ, không đổi logic/behavior người dùng (vd đổi text) → bỏ qua, đỡ noise.
- Đang giữa chừng một task → chỉ báo khi đã verify xong, tránh báo cáo nửa vời.
