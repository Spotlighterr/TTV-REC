# REC FTU Gen 16: Design System & Guidelines

Tài liệu định hướng thiết kế cho Website Tuyển thành viên Gen 16 của Câu lạc bộ Nghiên cứu Thị trường Bất động sản (REC FTU), Đại học Ngoại thương Hà Nội.

---

## 1. Định vị & Bộ ba thước đo (Design Read & Dials)

* **Design Read**: Landing page tuyển sinh viên chính thức cho REC FTU Gen 16, hướng đến sinh viên Đại học Ngoại thương và các bạn trẻ có tư duy kinh doanh, đầu tư, phân tích thị trường bất động sản. Phong cách Apple Human Interface Guidelines (Apple HIG) kết hợp với tinh thần học thuật, thực chiến của REC.
* **Bộ ba thước đo (Dials)**:
  * **ENERGY: 2 (Cân bằng & Điềm đạm)**: Không sặc sỡ, không lòe loẹt như web crypto/gaming, giữ nét trang nhã, tin cậy của lĩnh vực tài chính và bất động sản cao cấp.
  * **RHYTHM: 2 (Nhịp điệu biến chuyển có chủ đích)**: Cấu trúc mỗi phần thay đổi linh hoạt theo nhu cầu nội dung thực tế (Hero thoáng đãng, Thẻ ban chức năng bất đối xứng có điểm nhấn, Timeline phân tầng mạch lạc).
  * **MOTION: 1 (Tối giản & Tinh tế)**: Chỉ sử dụng chuyển động vi mô (micro-interactions) cho các trạng thái hover, focus, active và mở modal. Không dùng animation bay lượn vô nghĩa hoặc vòng lặp vô tận.

---

## 2. Bảng màu Semantic (Apple HIG Inspired)

Hệ thống màu thích ứng tự nhiên với cả chế độ Sáng (Light Mode) và Tối (Dark Mode), đạt chuẩn tương phản tối thiểu WCAG AA (4.5:1 cho văn bản thông thường, 3:1 cho tiêu đề lớn).

### Chế độ Sáng (Light Mode)
* **Canvas Background**: `#F5F5F7` (Apple Light Gray Canvas)
* **Surface Background (Cards / Panels)**: `#FFFFFF` (Pure White)
* **Glass Header**: `rgba(255, 255, 255, 0.72)` kèm `backdrop-filter: blur(20px)`
* **Primary Text**: `#1D1D1F` (Apple Deep Charcoal, tương phản 16:1)
* **Secondary Text**: `#6E6E73` (Apple Neutral Gray, tương phản 4.8:1)
* **Tertiary / Border**: `rgba(0, 0, 0, 0.08)`
* **Brand Primary (Navy REC)**: `#002B49` (Navy Ngoại thương truyền thống)
* **Brand Accent (Warm Gold)**: `#B8860B` / `#C5A059` (Điểm nhấn bất động sản cao cấp)
* **Interactive Focus Outline**: `#0071E3` (Apple System Blue)

### Chế độ Tối (Dark Mode)
* **Canvas Background**: `#000000` (Apple True Black Canvas)
* **Surface Background (Cards / Panels)**: `#1C1C1E` (Apple System Dark Gray)
* **Glass Header**: `rgba(28, 28, 30, 0.75)` kèm `backdrop-filter: blur(20px)`
* **Primary Text**: `#F5F5F7` (Apple Off-White, tương phản 17:1)
* **Secondary Text**: `#A1A1A6` (Apple Dark Mode Secondary, tương phản 5.2:1)
* **Tertiary / Border**: `rgba(255, 255, 255, 0.12)`
* **Brand Primary (Navy REC)**: `#2997FF` (Tương phản sáng trên nền tối)
* **Brand Accent (Warm Gold)**: `#DFB15B` (Ánh kim ấm áp trên nền tối)
* **Interactive Focus Outline**: `#2997FF`

---

## 3. Hệ thống Typography (Apple SF Pro Scale)

* **Font Stack**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
* **Cấp bậc văn bản**:
  * **Large Hero Title**: `48px - 56px`, Font Weight 700, Line Height 1.1, Letter Spacing `-0.015em`
  * **Section Title**: `32px - 40px`, Font Weight 600, Line Height 1.2, Letter Spacing `-0.01em`
  * **Card Title / Subhead**: `20px - 24px`, Font Weight 600, Line Height 1.3
  * **Body Text**: `16px - 17px`, Font Weight 400, Line Height 1.5, Letter Spacing `-0.005em`
  * **Caption / Meta**: `13px - 14px`, Font Weight 500, Line Height 1.4

---

## 4. Bố cục & Thang đo (Layout & Spacing Grid)

* **Grid cơ sở**: Hệ số 8pt (8px, 16px, 24px, 32px, 48px, 64px, 96px).
* **Độ bo góc (Corner Radii)**:
  * Thẻ nội dung (Cards): `20px`
  * Nút bấm (Buttons): `12px` (không dùng bo tròn kiểu viên thuốc cho mọi nút)
  * Khung nhập liệu / Tag: `8px`
  * Cửa sổ thông tin (Modal Dialog): `24px`
* **Vùng tương tác chạm (Touch Target)**: Tối thiểu `44px x 44px` trên thiết bị di động.

---

## 5. Quy tắc Nghiêm ngặt Antislop

1. **Tuyệt đối không dùng dấu gạch ngang em dash (`—`)** trong văn bản giao diện.
2. **Không dùng từ ngữ AI sáo rỗng**: Tránh các từ như "bứt phá", "chuyển mình", "khai phóng", "hành trình diệu kỳ". Dùng ngôn ngữ thực tế, gãy gọn.
3. **Không dùng emoji trang trí rải rác** trên tiêu đề hay nút bấm.
4. **Không bịa đặt số liệu hoặc đánh giá giả**: Mọi thông tin đều gắn liền với hoạt động thực tế của REC FTU.
5. **Không để nút chết**: Mọi liên kết đều có điểm đến thực tế hoặc mở chức năng cụ thể.
