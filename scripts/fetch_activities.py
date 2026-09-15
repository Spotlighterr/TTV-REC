import urllib.request
import urllib.parse
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Running Python script to compile REC FTU activities data...")

activities = {
    "ngoai_bo": [
        {
            "id": "the-real-contest",
            "name": "The Real Contest",
            "tag": "Cuộc thi Bất động sản quy mô toàn quốc",
            "desc": "Cuộc thi học thuật và thực chiến về lĩnh vực Bất động sản thường niên đầu tiên và uy tín nhất dành cho sinh viên kinh tế. Nơi các đội thi giải quyết các bài toán kinh doanh, marketing, sales và tư vấn đầu tư dự án thực tế từ các tập đoàn hàng đầu.",
            "scale": "Toàn quốc (Hà Nội, TP.HCM và các tỉnh thành)"
        },
        {
            "id": "the-maze",
            "name": "The Maze",
            "tag": "Chuỗi thử thách giải mật mã & Định hướng",
            "desc": "Chuỗi sự kiện thực tế mang phong cách trinh thám, giải mã bí ẩn kết hợp teambuilding độc đáo của REC. Thử thách tư duy logic, phản xạ nhanh và tinh thần đồng đội của các bạn trẻ qua từng chặng đua gay cấn.",
            "scale": "Quy mô sinh viên Ngoại thương và các trường đại học"
        },
        {
            "id": "findx",
            "name": "FindX - Tìm nhà cùng bạn",
            "tag": "Dự án cẩm nang cộng đồng sinh viên",
            "desc": "Dự án phi lợi nhuận ý nghĩa của REC nhằm hỗ trợ các bạn tân sinh viên tìm kiếm nhà trọ an toàn, minh bạch, tránh lừa đảo quanh khu vực Chùa Láng và các quận lân cận. Cung cấp cẩm nang pháp lý thuê trọ và bản đồ nhà ở uy tín.",
            "scale": "Cộng đồng tân sinh viên và sinh viên Hà Nội"
        }
    ],
    "noi_bo": [
        {
            "id": "secret-santa",
            "name": "Secret Santa",
            "tag": "Giáng sinh Nhà REC",
            "desc": "Truyền thống Noel ấm áp mỗi dịp cuối năm. Các thành viên bốc thăm ngẫu nhiên để trở thành 'ông già Noel bí mật', chuẩn bị những món quà bất ngờ kèm những lá thư tay chan chứa tình cảm cho người anh em cùng nhà."
        },
        {
            "id": "cuu-ke-em-nghe",
            "name": "Cựu kể em nghe",
            "tag": "Chuyện nghề & Chuyện đời cùng Alumni",
            "desc": "Không gian trò chuyện thân mật giữa các thế hệ cựu thành viên (Alumni) kỳ cựu và thế hệ đàn em. Nơi chia sẻ thật nhất về con đường học tập tại FTU, kinh nghiệm thực tập tại các tập đoàn lớn, chuyện nghề BĐS và định hướng tương lai."
        },
        {
            "id": "di-choi-xa",
            "name": "Đi chơi xa",
            "tag": "Chuyến du lịch gia đình thường niên",
            "desc": "Chuyến 'trốn phố về biển' hoặc 'lên núi săn mây' hàng năm của đại gia đình REC. Cùng nhau rời xa deadline, thức thâu đêm trò chuyện bên bờ biển, nướng BBQ và tạo nên những kỷ niệm thanh xuân đẹp đẽ nhất."
        },
        {
            "id": "bonding-noi-bo",
            "name": "Bonding nội bộ",
            "tag": "Những buổi tụ tập sau giờ học",
            "desc": "Những buổi lẩu đêm Chùa Láng, trà chanh vỉa hè, boardgame cười nghiêng ngả, sinh nhật thành viên hàng tháng và những buổi offline ngẫu hứng sau khi hoàn thành các dự án lớn."
        },
        {
            "id": "rememe",
            "name": "Rememe",
            "tag": "Góc giải trí & Kỷ niệm khó đỡ",
            "desc": "Đặc sản giải trí không thể thiếu của Nhà REC. Nơi lưu giữ những khoảnh khắc 'dìm hàng' siêu đáng yêu, các meme độc quyền trong các buổi chạy sự kiện, đem lại tiếng cười sảng khoái và xua tan mọi áp lực."
        }
    ]
}

with open("activities_data.json", "w", encoding="utf-8") as f:
    json.dump(activities, f, ensure_ascii=False, indent=2)

print("Saved activities_data.json successfully with all 3 Ngoại bộ & 5 Nội bộ activities.")
