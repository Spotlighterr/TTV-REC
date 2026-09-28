# Từ thế giới, về Nhà REC

## Trải nghiệm

Một sân khấu WebGL cố định với năm chặng: địa cầu → Việt Nam / Hà Nội → ảnh hoạt động → các ban → gia nhập. Khi cuộn, máy quay, vị trí địa cầu và các vật thể nội suy giữa các chặng. Nội dung chữ xuất hiện theo từng cảnh.

## Ngôn ngữ hình ảnh

- Nền không gian #03080f, chữ trắng ngà, điểm nhấn đồng cam #ffa978; ánh sáng xanh cyan, tím và cam chia các lớp không gian.
- Việt Nam và tín hiệu Hà Nội dùng màu cát vàng để phân biệt với biển xanh.
- Địa cầu dùng ảnh bề mặt, normal map, bản đồ phản sáng và mây xoay độc lập; Việt Nam được đánh dấu bằng đường biên và tín hiệu Hà Nội. Trạm quỹ đạo ghép từ giáp, khe kỹ thuật, thanh giằng, khoang và động cơ.
- Ánh sáng studio được tạo một lần làm bản đồ phản chiếu cho kim loại và kính; ánh sáng viền xanh–ấm tách mô hình khỏi nền. Tinh vân và bụi sao tạo chiều sâu, quầng sáng cục bộ thay bloom toàn màn hình.
- Bốn mô hình theo ban được xem riêng ở kích thước lớn và kéo xoay: kiến trúc có mặt dựng và giằng, máy ảnh có vòng ống kính/khẩu độ/nút chỉnh, vệ tinh có pin và chảo thu, sân khấu có loa, LED và chùm đèn. Hình học tĩnh gộp theo sáu nhóm vật liệu, kèm vòng quét và đèn động. Shadow map giúp tạo bóng giữa các bộ phận.
- Cảnh gia nhập dùng SciFiHelmet CC0 của Michael Pavlovic, chuyển glTF bởi Norbert Nopper, với bản đồ màu, normal, AO và metallic/roughness. Nguồn và thay đổi nằm cạnh tài nguyên.
- Bảng, nút, menu và hộp thoại dùng kính trong, viền mảnh, blur có giới hạn. Không dùng bóng nổi/lõm neumorphism.
- Tiêu đề sans serif lớn dùng font hệ thống Apple trên thiết bị Apple, system-ui/Segoe UI trên Windows; không tải hoặc phân phối font Apple. Chữ nhấn xanh sương, chữ phụ đủ tương phản.
- Thanh điều hướng biểu thị các chặng của một hành trình; phần đọc luôn có độ tương phản rõ.

## Chuyển động

- Máy quay theo đường cong với cùng một đồng hồ nội suy cho HTML và WebGL. Các lớp nội dung được giữ sẵn để crossfade; không remount tiêu đề khi chuyển chặng.
- Các vệt sao xuất hiện theo tốc độ chuyển cảnh, không có nhấp nháy liên tục.
- Trạm xoay quanh địa cầu, mây trôi độc lập, ba luồng năng lượng chạy trong không gian, thiên thạch ở nhiều khoảng cách và sóng sáng mở rộng khi chuyển chặng. Mô hình ban xoay nhẹ; kéo để điều khiển hướng quan sát, bấm để đọc chi tiết. Chế độ giảm chuyển động dừng các hiệu ứng tự động.
- Kéo địa cầu thay đổi góc nhìn; góc kéo tự trở về khi bắt đầu chuyển chặng để điểm đến vẫn đúng vị trí.
- Hộp thoại tạm dừng các chuyển động nền. Thiết lập giảm chuyển động dừng chuyển động tự động và làm chuyển chặng trực tiếp.

## Responsive và tương tác

Desktop bố trí chữ bên trái, địa cầu / các vật thể phía phải. Trên điện thoại, cảnh nằm ở nửa trên và nội dung phía dưới, có gradient để bảo đảm khả năng đọc. Mọi chặng có điều hướng bằng nút; các đối tượng 3D đều có lựa chọn HTML tương ứng. Hộp thoại dùng phần tử dialog để hỗ trợ bàn phím, focus và Escape.

## Quy tắc nội dung

Giữ giọng nói gần gũi với sinh viên. Dùng ảnh và mô tả sẵn có của REC. Không tạo số liệu thành tích, hạn tuyển, năm thành lập hay liên kết nhận đơn mới. Các chi tiết tuyển thành viên cần được đối chiếu với fanpage trước khi đưa trang vào chiến dịch chính thức.
