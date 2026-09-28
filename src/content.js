import departmentData from './data/departments.json';
import activitiesData from '../activities_data.json';
import photo1 from '../assets/images/rec_activity_1.jpg';
import photo2 from '../assets/images/rec_activity_2.jpg';
import photo3 from '../assets/images/rec_activity_3.jpg';
import photo4 from '../assets/images/rec_activity_4.jpg';
import photo5 from '../assets/images/rec_activity_5.jpg';

export const photos = [photo3, photo5, photo2, photo4, photo1];
export const chapters = [
  { id: 'orbit', name: 'Khởi hành', tag: '01 / REC FTU — TUYỂN THÀNH VIÊN GEN 16' },
  { id: 'vietnam', name: 'Việt Nam', tag: '02 / ĐIỂM HẸN: HÀ NỘI, VIỆT NAM' },
  { id: 'activities', name: 'Dấu ấn', tag: '03 / NHỮNG ĐIỀU CHÚNG MÌNH ĐÃ LÀM' },
  { id: 'departments', name: 'Đồng đội', tag: '04 / CHỌN VAI TRÒ CỦA BẠN' },
  { id: 'join', name: 'Gia nhập', tag: '05 / HẸN GẶP BẠN Ở NHÀ REC' },
];
export const activities = [
  ...activitiesData.ngoai_bo,
  { id: 'real-seminar', name: 'The Real Seminar', tag: 'Học từ những trải nghiệm thật', desc: 'Cùng Nhà REC trò chuyện với những người trong ngành, tham gia hội thảo và tìm hiểu các dự án bất động sản thực tế.' },
  { id: 'nha-rec', name: 'Những ngày ở Nhà REC', tag: 'Những người xa lạ, thành một mái nhà', desc: 'Từ Secret Santa, Cựu kể em nghe đến những buổi bonding, đi chơi xa và Rememe. Những kỷ niệm nhỏ làm nên một thời sinh viên đáng nhớ.' },
].map((item, i) => ({ ...item, image: photos[i] }));
export const internalActivities = activitiesData.noi_bo;
export const departments = Object.entries(departmentData).map(([id, data], i) => ({
  id, ...data, number: `0${i + 1}`,
  short: ['Chuyên môn', 'Truyền thông', 'Đối ngoại', 'Tổ chức'][i],
  line: ['Đặt câu hỏi. Tìm lời giải.', 'Biến ý tưởng thành tiếng nói.', 'Mở ra những kết nối mới.', 'Biến kế hoạch thành trải nghiệm.'][i],
}));
export const timeline = [
  ['Vòng đơn', 'Kể cho REC nghe về bạn, điều bạn quan tâm và lý do muốn trở thành một phần của Nhà REC.'],
  ['Đánh giá năng lực', 'Khám phá cách bạn tư duy, tìm lời giải và tiếp cận những thử thách mới.'],
  ['Teamwork', 'Cùng đồng đội kết nối ý tưởng và tạo ra một kết quả chung.'],
  ['Trải nghiệm & phỏng vấn', 'Gặp gỡ, trò chuyện và tìm mảnh ghép phù hợp với bạn.'],
];
export const recruitmentUrl = 'https://www.facebook.com/FTU.REC';
