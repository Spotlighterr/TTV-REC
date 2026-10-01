import departmentData from './data/departments.json';
import activitiesData from '../activities_data.json';
import gen16Recruitment from '../assets/images/gen16/gen16-recruitment.png';
import gen16OpenApplications from '../assets/images/gen16/gen16-open-applications.png';
import theRealContestImage from '../assets/images/gen16/the-real-contest-final.jpg';
import theRealSeminarImage from '../assets/images/gen16/the-real-seminar.jpg';
import companyVisitImage from '../assets/images/gen16/company-visit.jpg';
import theMazeImage from '../assets/images/gen16/the-maze-2026.jpg';
import memberBirthdayImage from '../assets/images/gen16/rec-birthday-2026.jpg';
import secretSantaImage from '../assets/images/gen16/secret-santa.jpg';
import cuuKeEmNgheImage from '../assets/images/gen16/cuu-ke-em-nghe.jpg';
import recOutingImage from '../assets/images/gen16/rec-outing.jpg';

export const chapters = [
  { id: 'orbit', name: 'Khởi hành', tag: '01 / REC FTU — TUYỂN THÀNH VIÊN GEN 16' },
  { id: 'vietnam', name: 'Ngoại Thương', tag: '02 / ĐIỂM HẸN: HÀ NỘI, NGOẠI THƯƠNG' },
  { id: 'activities', name: 'Dấu ấn', tag: '03 / NHỮNG ĐIỀU CHÚNG MÌNH ĐÃ LÀM' },
  { id: 'departments', name: 'Đồng đội', tag: '04 / CHỌN VAI TRÒ CỦA EM' },
  { id: 'join', name: 'Gia nhập', tag: '05 / HẸN GẶP EM Ở NHÀ REC' },
];
export const campaignImages = [
  { image: gen16Recruitment, name: 'Tuyển thành viên Gen 16', tag: 'CHIẾN DỊCH GEN 16' },
  { image: gen16OpenApplications, name: 'Mở đơn Gen 16', tag: 'VÒNG 1 · MỞ ĐƠN' },
];
const activityImages = {
  'the-real-contest': theRealContestImage,
  'the-maze': theMazeImage,
  'real-seminar': theRealSeminarImage,
  'company-visit': companyVisitImage,
  'rec-birthday-2026': memberBirthdayImage,
  'secret-santa': secretSantaImage,
  'cuu-ke-em-nghe': cuuKeEmNgheImage,
  'di-choi-xa': recOutingImage,
};
export const activities = [
  ...activitiesData.ngoai_bo.filter(item => ['the-real-contest', 'the-maze'].includes(item.id)),
  { id: 'real-seminar', name: 'Hội thảo chuyên môn', tag: 'Học từ những trải nghiệm thật', desc: 'Cùng Nhà REC gặp gỡ người trong ngành, trò chuyện ở các buổi hội thảo và tìm hiểu những dự án bất động sản ngoài đời thật.' },
  { id: 'company-visit', name: 'Tham quan doanh nghiệp', tag: 'Nhìn ngành nghề từ thực tế', desc: 'Tụi mình ghé thăm doanh nghiệp, tìm hiểu cách mọi người làm việc và đặt thêm câu hỏi về những hướng đi trong ngành bất động sản.' },
  { id: 'rec-birthday-2026', name: 'Sinh nhật CLB 2026', tag: 'Cả nhà REC cùng gặp nhau', desc: 'Một dịp để các thế hệ thành viên REC gặp lại, cùng nhìn lại những chặng đường đã qua và lưu thêm kỷ niệm mới.' },
  ...activitiesData.noi_bo.filter(item => ['secret-santa', 'cuu-ke-em-nghe', 'di-choi-xa'].includes(item.id)),
].map(item => ({ ...item, image: activityImages[item.id] }));
export const departments = Object.entries(departmentData).map(([id, data], i) => ({
  id, ...data, number: `0${i + 1}`,
  short: ['Chuyên môn', 'Truyền thông', 'Đối ngoại', 'Tổ chức'][i],
  line: ['Đặt câu hỏi. Tìm lời giải.', 'Biến ý tưởng thành tiếng nói.', 'Mở ra những kết nối mới.', 'Biến kế hoạch thành trải nghiệm.'][i],
}));
export const recruitmentIntro = [
  'Có một con đường mà chẳng ai bắt đầu từ cùng một điểm. Mỗi người bước vào đại học với một câu chuyện riêng, mang theo những điều mình yêu thích, những ước mơ còn dang dở và cả những người chưa từng gặp. Trên hành trình ấy, đôi khi chỉ một cuộc gặp tình cờ cũng đủ để một con đường xa lạ trở nên thân quen. Và biết đâu, nơi bạn tìm thấy những người đồng hành cũng chính là nơi bạn muốn gọi là nhà.',
  'Chúng mình tin rằng những mối liên kết đẹp nhất thường bắt đầu từ những cuộc gặp rất đỗi bình thường. Từ những người xa lạ, chúng ta dần trở thành những người đồng hành.',
  'Với REC, hành trình ấy không chỉ là cùng nhau đi qua những ngày tháng đại học, mà còn là cùng tạo nên những kỷ niệm, những câu chuyện và những mối gắn kết đáng nhớ. Bởi đôi khi, điều khiến một nơi trở thành nhà không phải là nơi ấy ở đâu, mà là những người đang ở đó cùng bạn.',
];
export const recruitmentRounds = [
  ['Vòng 1 · Mở đơn', '01/10–20/10'],
  ['Vòng 2', '23–24/10'],
  ['Vòng 3', '26/10–01/11'],
  ['Vòng 4', '02/11–10/11'],
];
export const timeline = [
  ['Vòng 1 · Mở đơn', '01/10–20/10 · Kể tụi mình nghe về em, điều em thích và điều em muốn thử sức ở REC nhé.'],
  ['Vòng 2', '23–24/10 · Chi tiết hình thức vòng này sẽ được REC cập nhật.'],
  ['Vòng 3', '26/10–01/11 · Chi tiết hình thức vòng này sẽ được REC cập nhật.'],
  ['Vòng 4', '02/11–10/11 · Chi tiết hình thức vòng này sẽ được REC cập nhật.'],
];
export const recruitmentUrl = 'https://www.facebook.com/FTU.REC';
