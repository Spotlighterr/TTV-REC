# REC FTU — Từ thế giới, về Nhà REC

Trải nghiệm tuyển thành viên Gen 16 của CLB Nghiên cứu Thị trường Bất động sản, Đại học Ngoại thương. React quản lý toàn bộ giao diện; Three.js dựng địa cầu, quỹ đạo, ảnh hoạt động và các mảnh ghép ban trong cùng một không gian.

## Hành trình

1. **Khởi hành:** địa cầu có texture bề mặt, normal map, phản sáng đại dương và lớp mây; bao quanh là trạm quỹ đạo có các khoang ghép và động cơ. Kéo để xoay hoặc bấm Hà Nội để chuyển chặng.
2. **Việt Nam:** máy quay tiến gần Việt Nam, giữ hướng bắc ở phía trên và giới thiệu Nhà REC tại 91 Chùa Láng.
3. **Dấu ấn:** ảnh hoạt động chuyển thành một vòng quỹ đạo. Dùng nút trước/sau, chọn dấu chấm hoặc bấm trực tiếp ảnh 3D để đọc câu chuyện.
4. **Đồng đội:** chọn một trong bốn mô hình — cụm kiến trúc, máy ảnh, vệ tinh và sân khấu — để xem ở kích thước lớn. Kéo xoay để quan sát; bấm vật thể hoặc nút khám phá để đọc thông tin ban. Có nút trước/sau bên dưới mô hình.
5. **Gia nhập:** mũ phi hành gia với vật liệu PBR xuất hiện trước đường chân trời địa cầu; mở thông tin tuyển thành viên và lộ trình bốn vòng.

Cuộn thay đổi tiến độ máy quay trong một sân khấu cố định. Thanh điều hướng, menu di động và các phím mũi tên lên/xuống, Page Up/Down, Home/End cũng chuyển chặng. Các hộp thoại hỗ trợ Escape và khóa cuộn nền.

## Chạy cục bộ

Yêu cầu Node.js 24 và npm.

```sh
npm install
npm run dev -- --port 5173
```

Mở `http://localhost:5173/`. Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd`.

```sh
npm run build
npm run preview
```

Vite tạo bản triển khai trong `dist/`. Đường dẫn tài nguyên tương đối hỗ trợ GitHub Pages trong thư mục repository. Workflow `.github/workflows/deploy.yml` cài dependencies, build rồi đưa riêng `dist/` lên Pages khi có push vào `main`.

## Cấu trúc

- `index.html`: điểm vào, metadata và nội dung khi JavaScript bị tắt.
- `src/App.jsx`: giao diện React, các chặng, điều hướng và hộp thoại.
- `src/rec-world.jsx`: dựng địa cầu, ánh sáng môi trường, camera, thao tác kéo và chọn vật thể.
- `src/department-models.js`: mô hình từng ban, gộp hình học theo vật liệu để giảm draw calls.
- `src/scene-details.js`: điểm lục địa, đèn thành phố, radar, vệ tinh và hạt chạy theo đường nối.
- `src/ambient-space.js`: tinh vân được vẽ sẵn, bụi sáng và vòng sáng không gian.
- `src/orbital-station.js`: trạm quỹ đạo, bề mặt kim loại, luồng năng lượng, thiên thạch và sóng chuyển cảnh.
- `assets/textures/`: texture địa cầu; nguồn ở `CREDITS.md`.
- `public/models/scifi-helmet/`: mô hình CC0, được tải khi đến gần cảnh cuối; tác giả và các thay đổi texture ở `CREDITS.md`.
- `src/world.css`: typography, bố cục toàn màn hình và responsive.
- `src/content.js`: hoạt động, ảnh, các ban và cấu hình liên kết tuyển thành viên.
- `src/data/world.json`: hình học địa lý được rút gọn từ Natural Earth.
- `src/data/departments.json`: mô tả các ban kế thừa từ dự án.
- `activities_data.json`, `assets/images/`: nội dung và ảnh hoạt động hiện có.
- `app.js`, `style.css`: mã giao diện cũ được giữ để tham chiếu; không được trang mới tải.

## Hiệu ứng và khả năng truy cập

- Tôn trọng `prefers-reduced-motion`, có nút **Bật hiệu ứng / Giảm chuyển động** để lựa chọn.
- DOM và WebGL dùng chung tiến độ được làm mượt; camera đi theo đường cong, kéo xoay có quán tính, ảnh chọn đường xoay ngắn nhất.
- Vẽ trực tiếp với quầng sáng cục bộ; shadow map 1024px chỉ cập nhật khi xem mô hình ban. Giới hạn DPR theo số pixel, tự giảm độ phân giải sau nhiều khung hình chậm; ngừng vẽ khi tab bị ẩn hoặc cảnh đã đứng yên ở chế độ giảm chuyển động.
- Các bảng dùng glassmorphism: nền trong, viền sáng và backdrop blur ở vùng nhỏ; không dùng bóng nổi/lõm kiểu neumorphism.
- Font hệ thống Apple (`-apple-system`, `BlinkMacSystemFont`, SF Pro), với system-ui/Segoe UI dự phòng trên Windows. Không đóng gói hay tải font Apple từ bên ngoài.
- Khi WebGL hoặc dữ liệu bản đồ không tải được, giao diện chuyển sang nền nhẹ và các nội dung vẫn dùng được.
- Chữ, nút và nội dung hộp thoại là HTML; tương tác 3D đều có nút tương ứng.
- Ảnh, dữ liệu bản đồ và mã đều được đóng gói trong bản build, không cần CDN khi chạy.
- Trạm quỹ đạo, thiên thạch và mũ phi hành gia là hình ảnh giả tưởng của trải nghiệm khám phá, không phải cơ sở vật chất hay hoạt động có thật của REC.

## Nội dung tuyển thành viên

CTA hiện mở [fanpage REC FTU](https://www.facebook.com/FTU.REC). Liên kết Google Forms cũ là một URL chưa được xác thực, nên không dùng để tiếp nhận hồ sơ. Cập nhật `recruitmentUrl` trong `src/content.js` khi có đường dẫn chính thức. Trang không tạo thời hạn tuyển hay đồng hồ đếm ngược giả.

## Nguồn dữ liệu địa lý

Đường biên địa cầu lấy từ [Natural Earth — Admin 0, 1:110m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), được giữ lại tên, mã nước và tọa độ rút gọn. Các đường nối chuyển động là phần minh họa cho hành trình khám phá, không mô tả mạng lưới đối tác của REC.
