## ═══ PHẦN 4: CROSS-PROJECT CONTEXT ═══

<!-- CROSS_PROJECT = none — placeholder để điền sau khi có liên kết với project khác. -->

Hiện tại project **Meeting Notes App** đứng độc lập, không có data flow cross-project.

Khi sau này tích hợp với project khác (vd: hệ thống auth chung, export sang knowledge base,
analytics pipeline), điền vào đây:

- **Project liên kết:** {{tên + repo path}}
- **Data flow:** {{ai gửi gì cho ai, qua interface nào}}
- **Contract / interface:** {{API/schema/event chia sẻ}}
- **Câu hỏi cần đặt khi design feature cross-project:**
  - Dữ liệu nào là source of truth ở mỗi bên?
  - Đồng bộ hay bất đồng bộ? Lỗi một bên thì bên kia xử lý sao?
  - Versioning của contract ai sở hữu?
  - Boundary nào tuyệt đối không được vượt (vd: web không nối thẳng DB của project khác)?
