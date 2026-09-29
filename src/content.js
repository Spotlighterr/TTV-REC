import departmentData from './data/departments.json';
import activitiesData from '../activities_data.json';
import photo1 from '../assets/images/rec_activity_1.jpg';
import photo2 from '../assets/images/rec_activity_2.jpg';
import photo3 from '../assets/images/rec_activity_3.jpg';
import photo4 from '../assets/images/rec_activity_4.jpg';
import photo5 from '../assets/images/rec_activity_5.jpg';
import legacyEvent1 from '../assets/press/gen15/06-dsc01999.avif';
import legacyEvent2 from '../assets/press/gen15/07-456481586_1251764352480859_377922388186230563_n.avif';
import legacyPortrait from '../assets/press/gen15/13-va-n-anh.avif';

export const photos = [photo3, photo5, photo2, photo4, photo1];
export const chapters = [
  { id: 'orbit', name: 'Khởi hành', tag: '01 / REC FTU — TUYỂN THÀNH VIÊN GEN 16' },
  { id: 'vietnam', name: 'Ngoại Thương', tag: '02 / ĐIỂM HẸN: HÀ NỘI, NGOẠI THƯƠNG' },
  { id: 'activities', name: 'Dấu ấn', tag: '03 / NHỮNG ĐIỀU CHÚNG MÌNH ĐÃ LÀM' },
  { id: 'departments', name: 'Đồng đội', tag: '04 / CHỌN VAI TRÒ CỦA EM' },
  { id: 'join', name: 'Gia nhập', tag: '05 / HẸN GẶP EM Ở NHÀ REC' },
];
export const internalActivities = activitiesData.noi_bo;
const activityImages = {
  'the-real-contest': photo3,
  'the-maze': photo5,
  findx: photo2,
  'real-contest-final': photo3,
  'real-seminar': photo4,
  'rec-fanpage': photo1,
  'company-visit': legacyEvent1,
  'member-birthday': legacyEvent2,
  'secret-santa': legacyEvent2,
  'cuu-ke-em-nghe': photo4,
  'di-choi-xa': legacyEvent1,
  'bonding-noi-bo': photo5,
  rememe: legacyPortrait,
  'nha-rec': photo1,
};
export const activities = [
  ...activitiesData.ngoai_bo,
  { id: 'real-contest-final', name: 'Đêm chung kết The Real Contest', tag: 'Khoảnh khắc khép lại mùa thi', desc: 'Đêm chung kết là nơi các đội trình bày lời giải, gặp gỡ người trong ngành và cùng nhìn lại hành trình đã đi qua.' },
  { id: 'real-seminar', name: 'The Real Seminar', tag: 'Học từ những trải nghiệm thật', desc: 'Cùng Nhà REC gặp gỡ người trong ngành, trò chuyện ở các buổi hội thảo và tìm hiểu những dự án bất động sản ngoài đời thật.' },
  { id: 'rec-fanpage', name: 'Fanpage REC', tag: 'Chuyện nghề, chuyện trường và chuyện nhà', desc: 'Tụi mình chia sẻ thông tin bất động sản, hoạt động của CLB và những câu chuyện thường ngày trên fanpage REC FTU.' },
  { id: 'company-visit', name: 'Tham quan doanh nghiệp', tag: 'Nhìn ngành nghề từ thực tế', desc: 'Tụi mình ghé thăm doanh nghiệp, tìm hiểu cách mọi người làm việc và đặt thêm câu hỏi về những hướng đi trong ngành bất động sản.' },
  { id: 'member-birthday', name: 'Sinh nhật thành viên', tag: 'Thêm một dịp để cả nhà gặp nhau', desc: 'Những lời chúc, chiếc bánh và vài tấm ảnh đủ làm một ngày học bình thường thành kỷ niệm của Nhà REC.' },
  ...internalActivities.map(item => ({ ...item, tag: item.tag || 'Những ngày ở Nhà REC' })),
  { id: 'nha-rec', name: 'Những ngày ở Nhà REC', tag: 'Những người xa lạ, thành một mái nhà', desc: 'Từ Secret Santa, Cựu kể em nghe đến mấy buổi bonding hay chuyến đi xa — ở REC lúc nào cũng có chuyện vui để nhớ.' },
].map(item => ({ ...item, image: item.image || activityImages[item.id] || photo1 }));
export const departments = Object.entries(departmentData).map(([id, data], i) => ({
  id, ...data, number: `0${i + 1}`,
  short: ['Chuyên môn', 'Truyền thông', 'Đối ngoại', 'Tổ chức'][i],
  line: ['Đặt câu hỏi. Tìm lời giải.', 'Biến ý tưởng thành tiếng nói.', 'Mở ra những kết nối mới.', 'Biến kế hoạch thành trải nghiệm.'][i],
}));
export const timeline = [
  ['Vòng đơn', 'Kể tụi mình nghe về em, điều em thích và điều em muốn thử sức ở REC nhé.'],
  ['Đánh giá năng lực', 'Cùng tìm hiểu cách em suy nghĩ, tìm lời giải và đón nhận những thử thách mới.'],
  ['Teamwork', 'Gặp những đồng đội mới, chia sẻ ý tưởng và cùng làm nên một điều thật vui.'],
  ['Trải nghiệm & phỏng vấn', 'Mình gặp nhau, trò chuyện và xem REC có phải nơi em muốn đồng hành không nhé.'],
];
export const recruitmentUrl = 'https://www.facebook.com/FTU.REC';
