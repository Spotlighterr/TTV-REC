import image0 from '../assets/images/gen16-bnd/bnd-ttv-cover.png';
import image1 from '../assets/images/gen16-bnd/form-banner.png';
import image2 from '../assets/images/departments/BCM.jpg';
import image3 from '../assets/images/departments/BTT.jpg';
import image4 from '../assets/images/departments/BDN.jpg';
import image5 from '../assets/images/departments/BTC.jpg';
import image6 from '../assets/images/gen16/company-visit.jpg';
import image7 from '../assets/images/gen16/cuu-ke-em-nghe-banner.png';
import image8 from '../assets/images/gen16/cuu-ke-em-nghe.jpg';
import image9 from '../assets/images/gen16/gen16-open-applications.png';
import image10 from '../assets/images/gen16/gen16-recruitment.png';
import image11 from '../assets/images/gen16/member-birthday.png';
import image12 from '../assets/images/gen16/rec-birthday-2026.jpg';
import image13 from '../assets/images/gen16/rec-outing.jpg';
import image14 from '../assets/images/gen16/secret-santa.jpg';
import image15 from '../assets/images/gen16/the-maze-2026.jpg';
import image16 from '../assets/images/gen16/the-maze.png';
import image17 from '../assets/images/gen16/the-real-contest-evening.jpg';
import image18 from '../assets/images/gen16/the-real-contest-final.jpg';
import image19 from '../assets/images/gen16/the-real-contest.png';
import image20 from '../assets/images/gen16/the-real-seminar.jpg';

const variants = import.meta.glob('../assets/images/display/*-*.webp', { eager: true, query: '?url', import: 'default' });
const sources = new Map([
  [image0, ['bnd-ttv-cover', 3925, 1453]],
  [image1, ['form-banner', 1600, 400]],
  [image2, ['BCM', 6000, 3368]],
  [image3, ['BTT', 6000, 3368]],
  [image4, ['BDN', 6000, 3368]],
  [image5, ['BTC', 6000, 3368]],
  [image6, ['company-visit', 2000, 1125]],
  [image7, ['cuu-ke-em-nghe-banner', 2480, 2480]],
  [image8, ['cuu-ke-em-nghe', 2048, 1536]],
  [image9, ['gen16-open-applications', 1453, 1453]],
  [image10, ['gen16-recruitment', 1453, 1453]],
  [image11, ['member-birthday', 1471, 1462]],
  [image12, ['rec-birthday-2026', 2048, 1366]],
  [image13, ['rec-outing', 5712, 4284]],
  [image14, ['secret-santa', 2048, 1150]],
  [image15, ['the-maze-2026', 2048, 1365]],
  [image16, ['the-maze', 2000, 2000]],
  [image17, ['the-real-contest-evening', 2048, 1365]],
  [image18, ['the-real-contest-final', 1453, 1453]],
  [image19, ['the-real-contest', 1453, 1453]],
  [image20, ['the-real-seminar', 2048, 1340]],
]);

export function displayImageProps(source, thumbnail = false) {
  const entry = sources.get(source);
  if (!entry) return { src: source, decoding: 'async' };
  const [name, width, height] = entry;
  const url = size => variants[`../assets/images/display/${name}-${size}.webp`];
  const sizes = thumbnail ? [160] : [480, 960, 1600];
  return {
    src: url(thumbnail ? 160 : 960),
    srcSet: sizes.filter((size, index) => index === 0 || Math.min(size, width) > Math.min(sizes[index - 1], width)).map(size => `${url(size)} ${Math.min(size, width)}w`).join(', '),
    sizes: thumbnail ? '64px' : '(max-width: 760px) calc(100vw - 32px), (max-width: 960px) 90vw, 720px',
    width, height, decoding: 'async',
  };
}
