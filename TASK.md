# Danh Sách Công Việc (Task Board) - Tuyển Thành Viên REC Gen 16

Tài liệu theo dõi tiến độ phát triển, cập nhật nội dung và chuẩn bị cho chiến dịch Tuyển Thành viên Khóa Gen 16 của **CLB Nghiên cứu Thị trường Bất động sản (REC FTU)**.

---

## 📌 Công Việc Trọng Tâm Cần Bổ Sung Ngay

### 1. Bổ sung thời gian cụ thể cho từng vòng tuyển chọn
- [ ] **Vòng 1 (Vòng Đơn - Application Form)**:
  - Cập nhật ngày mở đơn chính thức: `[Ngày/Tháng/2026]`
  - Cập nhật thời hạn đóng đơn (Deadline): `[Giờ:Phút, Ngày/Tháng/2026]`
  - Cập nhật mốc thời gian thông báo kết quả Vòng 1 qua Email/SMS: `[Ngày/Tháng/2026]`
  - Đồng bộ mốc thời gian này vào mục **Timeline Tuyển Chọn** trong `index.html` và bộ đếm ngược `app.js`.
- [ ] **Vòng 2 (Vòng Test & Teamwork)**:
  - Cập nhật thời gian làm bài test chuyên môn / logic: `[Ngày/Tháng/2026]`
  - Cập nhật thời gian tổ chức buổi sinh hoạt nhóm thực tế: `[Ngày/Tháng/2026]`
  - Cập nhật thời gian công bố danh sách bước tiếp vào Vòng 3.
- [ ] **Vòng 3 (Phỏng vấn chuyên sâu - Interview)**:
  - Cập nhật khung ngày phỏng vấn trực tiếp với Ban Điều hành và các Trưởng/Phó Ban: `[Ngày - Ngày/Tháng/2026]`
  - Cập nhật địa điểm phỏng vấn (Offline tại trường FTU hoặc linh hoạt Online).
- [ ] **Vòng 4 (Welcome Day & Training Nội Bộ)**:
  - Cập nhật thời gian tổ chức buổi gặp mặt đầu tiên (First Meeting): `[Ngày/Tháng/2026]`
  - Cập nhật lịch trình chuỗi đào tạo hội nhập dành cho tân thành viên Gen 16.

---

## 📋 Trạng Thái Các Hạng Mục Dự Án

### Giai đoạn 1: Khung Nền Tảng & Giao Diện Sắc Nét (Đã Hoàn Thành)
- [x] Khởi tạo repository Git và đồng bộ với GitHub remote `Spotlighterr/TTV-REC`.
- [x] Thiết lập cấu trúc Native Web (HTML5, Vanilla CSS, Vanilla JS) đạt tốc độ tối đa, không phụ thuộc thư viện nặng.
- [x] Chuẩn hóa phong cách thiết kế **Sharp Editorial**:
  - [x] Loại bỏ toàn bộ viền bo tròn bong bóng, chuyển sang bo góc sắc nét (`border-radius: 4px`).
  - [x] Loại bỏ hiệu ứng mờ nhòe (backdrop-filter blur).
  - [x] Loại bỏ các khối hộp ô vuông dập khuôn, chuyển sang bố cục báo chí thanh lịch.
- [x] Tuân thủ nghiêm ngặt quy tắc Anti-Slop (loại bỏ hoàn toàn ký tự em dash, giữ ngôn từ sinh viên ấm áp, chân thành).
- [x] Cập nhật tinh thần cốt lõi: **"REC là nhà"** (bỏ chữ "Slogan" ở tất cả các vị trí hiển thị).
- [x] Đơn giản hóa định danh thế hệ: **"Gen 16"** (lược bỏ phần mở ngoặc năm học).
- [x] Cập nhật định danh hoạt động học thuật: **"The Real Seminar"** thay cho Company Tour cũ.
- [x] Tích hợp khối **Thông báo tuyển sinh to bản kèm Đồng hồ đếm ngược trực tiếp** (Ngày, Giờ, Phút, Giây) hoạt động theo thời gian thực.
- [x] Bổ sung đầy đủ 2 nhóm hoạt động:
  - [x] Ngoại bộ (The Real Contest, The Maze, FindX - Tìm nhà cùng bạn).
  - [x] Nội bộ (Secret Santa, Cựu kể em nghe, Đi chơi xa, Bonding nội bộ, Rememe).
- [x] Xây dựng cửa sổ `<dialog>` mô tả chi tiết nhiệm vụ, yêu cầu và quyền lợi của 4 Ban (Chuyên môn, Truyền thông, Đối ngoại, Tổ chức) hỗ trợ phím `Escape`.

---

### Giai đoạn 2: Tiếp Nhận Dữ Liệu Thực Tế Từ Ban Truyền Thông (Đang Triển Khai)
- [ ] **Liên kết cuộc thi The Real Contest**:
  - Bổ sung link Fanpage / Cổng thông tin chính thức của cuộc thi The Real Contest để gắn vào thẻ hoạt động và bài viết chuyên môn.
- [ ] **Logo REC FTU chính thức**:
  - Bổ sung file Logo CLB (định dạng SVG hoặc PNG trong suốt độ phân giải cao) để thay thế cho logo text trên Header và Footer.
- [ ] **Hệ sinh thái liên kết dự án FindX (Tìm Nhà Cùng Bạn)**:
  - [ ] Link Group Facebook: Cộng đồng Tìm trọ & Hỗ trợ sinh viên Chùa Láng
  - [ ] Link Fanpage chính thức: FindX - Tìm nhà cùng bạn
  - [ ] Link kênh TikTok chính thức: Kênh video mẹo thuê trọ sinh viên của FindX
- [ ] **Liên kết Google Form tuyển dụng**:
  - Thay thế đường dẫn giữ chỗ `https://forms.gle/rec-ftu-gen16` bằng link Form tuyển chính thức do Ban Tổ chức cung cấp.
- [ ] **Ấn phẩm truyền thông chính thức**:
  - Bổ sung bộ ảnh Key Visual (KV) chiến dịch Gen 16 khi Fanpage phát động.
  - Cập nhật ảnh đại diện (OG Image) để hiển thị đẹp mắt khi chia sẻ link lên Facebook và Zalo.
- [ ] **Kênh liên hệ trực tuyến của CLB**:
  - Gắn link Fanpage chính thức: `https://www.facebook.com/rec.ftu`
  - Gắn link TikTok / Instagram / LinkedIn của REC FTU nếu có chiến dịch đồng hành.

---

### Giai đoạn 3: Kiểm Thử Đa Thiết Bị & Triển Khai Trực Tuyến (Production)
- [ ] Kiểm tra hiển thị responsive trên các dòng điện thoại thông dụng (iPhone SE, iPhone 14/15, Samsung Galaxy).
- [ ] Kiểm tra khả năng truy cập (Accessibility): Đảm bảo độ tương phản màu sắc đạt chuẩn WCAG, bàn phím điều hướng mượt mà.
- [ ] Kích hoạt **GitHub Pages** trên repo `Spotlighterr/TTV-REC` để công khai website trên Internet:
  - Vào `Settings` > `Pages` trên GitHub.
  - Chọn nhánh `main` và thư mục `/ (root)` để xuất bản.
- [ ] Trỏ tên miền riêng hoặc rút gọn link tuyển sinh để chia sẻ trong các bài đăng truyền thông.
