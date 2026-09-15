# REC FTU - Cổng Tuyển Thành Viên Khóa Gen 16

Website chính thức cho chiến dịch Tuyển Thành viên Khóa Gen 16 của **CLB Nghiên cứu Thị trường Bất động sản (REC FTU)**, Trường Đại học Ngoại thương Hà Nội.

> **Tinh thần cốt lõi**: *"REC là nhà"*

---

## Giới Thiệu Dự Án

Trang thông tin tuyển thành viên được xây dựng nhằm mang đến trải nghiệm trực quan, ấm áp và truyền cảm hứng cho các bạn sinh viên (đặc biệt là tân sinh viên Khóa 63 FTU) mong muốn tìm kiếm một môi trường học thuật thực chiến và gắn kết như một gia đình.

Mã nguồn được thiết kế theo triết lý **Native Web & Sharp Editorial**:
- Không phụ thuộc framework cồng kềnh (Zero external dependencies).
- Tốc độ tải trang tức thì (< 0.5s), tối ưu SEO và thiết bị di động.
- Đường nét sắc sảo, dứt khoát, phong cách báo chí - học thuật, loại bỏ hoàn toàn các kiểu thiết kế dập khuôn (không bo tròn bong bóng, không hiệu ứng mờ nhòe, không ô vuông to đùng).

---

## Các Tính Năng & Phân Khu Nội Dung

1. **Hero & Thông Điệp Chào Đón**:
   - Khơi gợi hành trình đại học và khẳng định tinh thần *"REC là nhà"*.
   - Lời nhắn gửi chân thành từ thế hệ đi trước.
2. **Thông Báo Tuyển Sinh & Đồng Hồ Đếm Ngược**:
   - Banner cảnh báo thời hạn nộp đơn Vòng 1 với độ tương phản cao.
   - Đồng hồ đếm ngược trực tiếp (Ngày : Giờ : Phút : Giây) nhảy theo thời gian thực.
3. **Giới Thiệu CLB (About Editorial)**:
   - Thông tin trực thuộc Đoàn trường, lịch sử 15 thế hệ và tôn chỉ hoạt động.
4. **Hoạt Động Của Câu Lạc Bộ (Tab Chuyển Đổi)**:
   - **Ngoại bộ**: The Real Contest (cuộc thi BĐS sinh viên toàn quốc), The Maze (sự kiện giải mật mã trinh thám), FindX - Tìm nhà cùng bạn (dự án xã hội hỗ trợ tân sinh viên).
   - **Nội bộ**: Secret Santa, Cựu kể em nghe, Đi chơi xa thường niên, Bonding ấm cúng, Rememe.
   - Bộ sưu tập hình ảnh thực tế từ các mùa hoạt động và chuỗi hội thảo chuyên môn **The Real Seminar**.
5. **Cơ Cấu 4 Ban & Mô Tả Chi Tiết (JD Dialog Modal)**:
   - Ban Chuyên môn (Bộ não học thuật)
   - Ban Truyền thông (Tiếng nói sáng tạo)
   - Ban Đối ngoại (Cầu nối bản lĩnh)
   - Ban Tổ chức (Khung xương vận hành)
   - Hỗ trợ xem chi tiết nhiệm vụ, yêu cầu, quyền lợi bằng cửa sổ `<dialog>` tương tác mượt mà, hỗ trợ phím `Escape`.
6. **Lộ Trình 4 Vòng Tuyển Chọn**:
   - Vòng 1: Nộp đơn trực tuyến (Application Form)
   - Vòng 2: Đánh giá năng lực & Làm việc nhóm
   - Vòng 3: Phỏng vấn chuyên sâu
   - Vòng 4: Chào đón thành viên mới & Training
7. **Cổng Tiếp Nhận Hồ Sơ & Chân Trang**:
   - Hướng dẫn chuẩn bị trước khi gửi đơn.
   - Nút kết nối trực tiếp đến Google Forms chính thức.
   - Thông tin liên hệ văn phòng CLB tại Trường ĐH Ngoại thương.

---

## Cấu Trúc Thư Mục

```text
REC-tuyen-thanh-vien/
├── index.html              # Cấu trúc HTML5 ngữ nghĩa chuẩn SEO & Accessibility
├── style.css               # Hệ thống Style Editorial, biến màu CSS tokens
├── app.js                  # Điều khiển tab hoạt động, modal JD, đồng hồ đếm ngược
├── DESIGN.md               # Quy chuẩn thiết kế, bảng mã màu, triết lý Anti-Slop
├── TASK.md                 # Kế hoạch công việc và lộ trình cập nhật
├── activities_data.json    # Dữ liệu tổng hợp các hoạt động Ngoại bộ & Nội bộ
├── assets/
│   └── images/             # Hình ảnh hoạt động và tài nguyên đồ họa thực tế
└── scripts/
    └── fetch_activities.py # Công cụ tự động thu thập & cập nhật dữ liệu hoạt động
```

---

## Hướng Dẫn Chạy Cục Bộ (Local Development)

Không cần cài đặt `npm install` hay build phức tạp. Bạn có thể mở trực tiếp hoặc chạy một máy chủ tĩnh nội bộ:

### Cách 1: Sử dụng Python
```bash
py -m http.server 3000
```
Sau đó truy cập: `http://localhost:3000`

### Cách 2: Sử dụng Node.js
```bash
npx serve . -p 3000
```

---

## Đóng Góp & Bản Quyền

- **Đơn vị phát triển**: Ban Điều hành CLB Nghiên cứu Thị trường Bất động sản (REC FTU).
- **Trực thuộc**: Đoàn Trường Đại học Ngoại thương Hà Nội.
- **Văn phòng**: Ô số 38, Nhà B, 91 Chùa Láng, Láng Thượng, Đống Đa, Hà Nội.
