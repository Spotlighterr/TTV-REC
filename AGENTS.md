# AGENTS.MD - HANDOVER & SYSTEM CONTEXT CHO CODEX

Tài liệu bàn giao bối cảnh dự án, hiện trạng mã nguồn, tài nguyên và phản hồi của người dùng cho Codex tiếp quản.
> **LƯU Ý QUAN TRỌNG:** File này cung cấp bối cảnh kỹ thuật và hiện trạng. Không tự động chạy các quyết định thiết kế mà **hãy đợi người dùng trực tiếp ra lệnh và định hướng**.

---

## 1. Tổng quan dự án

- **Tên dự án:** Trang landing page tuyển thành viên REC Gen 16 (CLB Nghiên cứu Thị trường Bất động sản - Trường Đại học Ngoại thương Hà Nội).
- **Thư mục làm việc dự án:** `D:\kNowHow\TTV-REC`
- **Tech Stack:**
  - Vite + React 18 (SPA)
  - CSS thuần (`src/world.css`, `src/index.css`)
  - Server preview đang chạy: `http://localhost:4173` (chạy qua lệnh `npm run preview -- --port 4173`)
  - Lệnh build: `npm run build`
  - Lệnh dev: `npm run dev`

---

## 2. Bản đồ tài nguyên & Đường dẫn quan trọng (Assets)

1. **Link Google Form chính thức (Không thay đổi):**
   - URL: `https://docs.google.com/forms/d/e/1FAIpQLSe58cV_K2RHsC8aCmwNiOsB3MDQursF6Hi7xkPIm-DUGrdFUA/viewform`

2. **Bộ nhận diện thương hiệu (BND Gen 16):**
   - Thư mục gốc: `D:\kNowHow\TTV-REC\REC16 _ TTV _ BTT _ BND`
   - Chủ đề: **ROAD · Tuyển thành viên thế hệ thứ 16 · Đường về nhà · Vì REC là Nhà**
   - Tone màu chủ đạo:
     - Xanh dương thương hiệu (BND Blue): `#1a4b8c`, `#0e3160`, `#2563eb`
     - Đỏ cam điểm nhấn / CTA: `#d32f2f`, `#ef4444`
     - Trắng / Kem mây: `#ffffff`, `#f8fafc`
   - File chi tiết mô tả vòng tuyển và copy: `D:\kNowHow\TTV-REC\REC16 _ TTV _ CAP TRONG ĐƠN.md`

3. **Background chính thức theo yêu cầu:**
   - File gốc người dùng chỉ định: `D:\kNowHow\TTV-REC\dominik-schroder-FIKD9t5_5zQ-unsplash.jpg`
   - Ảnh đã được copy vào assets: `D:\kNowHow\TTV-REC\assets\images\bnd-sky-official.jpg`
   - Đặc điểm ảnh: Bầu trời xanh sáng, biển mây bồng bềnh và đỉnh núi tuyết phía dưới.

4. **Ảnh trường ĐH Ngoại Thương (Dùng cho Tab 02):**
   - File: `D:\kNowHow\TTV-REC\truong-dai-hoc-ngoai-thuong-anh-ftu-3848-2191.jpg.webp`
   - Đã copy tại: `D:\kNowHow\TTV-REC\assets\images\ftu-campus.webp`

5. **Ảnh các ban thực tế (Dùng cho Tab 04):**
   - Thư mục: `D:\kNowHow\TTV-REC\ẢNH CÁC BAN\`
   - 4 ban:
     - Ban Chuyên môn: `BCM.jpg`
     - Ban Tổ chức: `BTC.jpg`
     - Ban Truyền thông: `BTT.jpg`
     - Ban Đối ngoại: `BDN.jpg`
   - Đã copy tại: `D:\kNowHow\TTV-REC\assets\images\departments\`

---

## 3. Cấu trúc mã nguồn chính

- `src/App.jsx`:
  - Quản lý trạng thái 5 tab (`chapter` / `panelIndex` từ 0 đến 4).
  - Tích hợp lớp background mây trời `bnd-sky-official-layer`.
  - Tab 0 (Khởi hành): Hero banner BND, slogan ROAD, sticky note 4 vòng tuyển, nút CTA form.
  - Tab 1 (Ngoại Thương): Ảnh FTU Chùa Láng + nội dung giới thiệu.
  - Tab 2 (Dấu ấn): Carousel 8 sự kiện/hoạt động lớn của REC.
  - Tab 3 (Bốn ban): Tab chọn 4 ban (BCM, BTT, BDN, BTC) + hiển thị ảnh chụp thành viên thực tế của từng ban.
  - Tab 4 (Gia nhập): Lưới cân đối gồm banner trên, CTA + nội dung trái, đồng hồ đếm ngược và link ấn phẩm phải.
  - Navigation footer: 5 icon chuyển tab nhanh ở thanh đáy (`.journey-footer`).
  - Thanh mạng xã hội: Facebook REC FTU, TikTok REC FTU, TikTok FindX, Email `rec@ftu.edu.vn`.
- `src/world.css`:
  - Quy định toàn bộ giao diện, hiệu ứng chuyển tab, layout responsive, thẻ card và typography.
  - Lưu ý: Không dùng lại Three.js / WebGL nặng nề vì đã được gỡ bỏ để tối ưu tốc độ load.

---

## 4. Phản hồi cụ thể & Các vấn đề người dùng vừa chỉ ra

Người dùng đã nêu 2 vấn đề trọng tâm cần xử lý:

1. **Vấn đề Background:**
   - **Hiện tượng:** Người dùng phản ánh ảnh background `dominik-schroder-FIKD9t5_5zQ-unsplash.jpg` bị tối hoặc không thấy rõ như một background thực thụ sau nội dung.
   - **Nguyên nhân kỹ thuật trong CSS:** Trong `src/world.css`, lớp phủ `.bnd-sky-overlay-gradient` và độ mờ `opacity: 0.35` của ảnh đã phủ lên một gradient xanh đen đậm (`rgba(8, 20, 36, 0.88)` đến `rgba(8, 18, 32, 0.92)`), khiến bầu trời mây trắng trong ảnh bị chìm hẳn, trông giống màu nền phẳng tối. Cần làm cho background thể hiện đúng bức ảnh mây trời sáng rõ của tác giả Dominik Schröder theo ý người dùng.

2. **Vấn đề Thiết kế thiếu tính liên kết giữa 5 tab & Thiếu ngôn ngữ trang trí đồng bộ:**
   - **Hiện tượng:** 5 tab đang có cảm giác rời rạc, mỗi tab một phong cách riêng (Tab 1 có sticker, Tab 2 chỉ có ảnh trường, Tab 3 có khối hình sự kiện màu vàng, Tab 4 có ảnh ban, Tab 5 có khung đếm ngược), chưa có các chi tiết decor xuyên suốt thống nhất bộ nhận diện ROAD (như biển báo đường, vé xe/hành trình, tem dán, mây trời, chi tiết đồ họa nhận diện của REC).

---

## 5. Trạng thái bàn giao

- Toàn bộ repo đang ở trạng thái sạch, build chạy bình thường không lỗi.
- Preview server đang hoạt động tại cổng `4173`.
- Các file ảnh chụp màn hình kiểm tra hiện tại được lưu tại thư mục gốc: `tab_01_khoi_hanh.png` đến `tab_05_gia_nhap.png`.
- **Codex chờ lệnh chỉ đạo trực tiếp từ người dùng để tiếp tục triển khai.**
