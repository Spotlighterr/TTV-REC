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
import gen16Recruitment from '../assets/images/gen16/gen16-recruitment.png';
import gen16OpenApplications from '../assets/images/gen16/gen16-open-applications.png';
import theRealContestImage from '../assets/images/gen16/the-real-contest-final.jpg';
import theRealContestEveningImage from '../assets/images/gen16/the-real-contest-evening.jpg';
import theRealSeminarImage from '../assets/images/gen16/the-real-seminar.jpg';
import companyVisitImage from '../assets/images/gen16/company-visit.jpg';
import theMazeImage from '../assets/images/gen16/the-maze-2026.jpg';
import memberBirthdayImage from '../assets/images/gen16/rec-birthday-2026.jpg';
import secretSantaImage from '../assets/images/gen16/secret-santa.jpg';
import cuuKeEmNgheImage from '../assets/images/gen16/cuu-ke-em-nghe.jpg';
import recOutingImage from '../assets/images/gen16/rec-outing.jpg';

export const photos = [photo3, photo5, photo2, photo4, photo1];
export const chapters = [
  { id: 'orbit', name: 'Khởi hành', tag: '01 / REC FTU — TUYỂN THÀNH VIÊN GEN 16' },
  { id: 'vietnam', name: 'Ngoại Thương', tag: '02 / ĐIỂM HẸN: HÀ NỘI, NGOẠI THƯƠNG' },
  { id: 'activities', name: 'Dấu ấn', tag: '03 / NHỮNG ĐIỀU CHÚNG MÌNH ĐÃ LÀM' },
  { id: 'departments', name: 'Đồng đội', tag: '04 / CHỌN VAI TRÒ CỦA EM' },
  { id: 'join', name: 'Gia nhập', tag: '05 / HẸN GẶP EM Ở NHÀ REC' },
];
export const internalActivities = activitiesData.noi_bo;
export const campaignImages = [
  { image: gen16Recruitment, name: 'Tuyển thành viên Gen 16', tag: 'CHIẾN DỊCH GEN 16' },
  { image: gen16OpenApplications, name: 'Mở đơn Gen 16', tag: 'VÒNG 1 · MỞ ĐƠN' },
];
const activityImages = {
  'the-real-contest': theRealContestImage,
  'the-maze': theMazeImage,
  findx: photo2,
  'real-contest-final': theRealContestEveningImage,
  'real-seminar': theRealSeminarImage,
  'rec-fanpage': photo1,
  'company-visit': companyVisitImage,
  'member-birthday': memberBirthdayImage,
  'secret-santa': secretSantaImage,
  'cuu-ke-em-nghe': cuuKeEmNgheImage,
  'di-choi-xa': recOutingImage,
  'bonding-noi-bo': photo5,
  rememe: legacyPortrait,
  'nha-rec': photo1,
};
export const activities = [
  ...activitiesData.ngoai_bo,
  { id: 'real-contest-final', name: 'Đêm chung kết The Real Contest', tag: 'Khoảnh khắc khép lại mùa thi', desc: 'Đêm chung kết là nơi các đội trình bày lời giải, gặp gỡ người trong ngành và cùng nhìn lại hành trình đã đi qua.' },
  { id: 'real-seminar', name: 'Hội thảo chuyên môn', tag: 'Học từ những trải nghiệm thật', desc: 'Cùng Nhà REC gặp gỡ người trong ngành, trò chuyện ở các buổi hội thảo và tìm hiểu những dự án bất động sản ngoài đời thật.' },
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
