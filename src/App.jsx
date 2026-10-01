import React, { useCallback, useEffect, useRef, useState } from 'react';
import RecWorld from './rec-world.jsx';
import { chapters, activities, departments, timeline, recruitmentUrl, recruitmentIntro, recruitmentRounds, campaignImages } from './content';
import recLogoUrl from '../recftu_logo.jpg';
import oldRecMark from '../assets/images/wix_asset_1.png';
import oldCampaignCover from '../assets/images/wix_asset_2.png';
import oldRecVertical from '../assets/images/wix_asset_3.png';
import oldGen15Banner from '../assets/images/wix_asset_4.png';
import oldRecNumbers from '../assets/images/wix_asset_5.png';

const Arrow = () => <span aria-hidden="true">↗</span>;

const chapterIconPaths = [
  <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16" /></>,
  <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8" cy="9" r="1.5" /><path d="m4 18 5-5 3 3 3-4 5 6" /></>,
  <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M15 15a5 5 0 0 1 6 5" /></>,
  <><path d="m3 11 9-8 9 8M5 10v10h14V10M10 20v-6h4v6" /></>,
];
const ChapterIcon = ({ index }) => <svg className="chapter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{chapterIconPaths[index]}</svg>;

const registrationDeadline = new Date('2026-10-21T00:00:00+07:00').getTime();
const archivedTitles = {
  '01-text-effect1': 'Tiêu đề tuyển thành viên Gen 15',
  '02-legacy-980': 'Ảnh chiến dịch REC Gen 15',
  '03-cover-2': 'RECERIE · tuyển thành viên Gen 15',
  '04-untitled-2': 'Ấn phẩm REC Gen 15',
  '05-gthreal1': 'Thành viên REC · Gen 15',
  '06-dsc01999': 'Ảnh hoạt động REC Gen 15',
  '07-456481586_1251764352480859_377922388186230563_n': 'Khoảnh khắc REC Gen 15',
  '08-nhungconso': 'Những con số ấn tượng của REC',
  '09-hoatdong': 'Hoạt động REC',
  '10-thie-t-ke-chu-a-co-te-n_edited': 'Thiết kế tuyển thành viên Gen 15',
  '11-recerie-ttv': 'RECERIE · website Gen 15',
  '12-legacy-600': 'Ảnh tư liệu REC Gen 15',
  '13-va-n-anh': 'Ảnh thành viên REC Gen 15',
  '14-legacy-600': 'Ảnh tư liệu REC Gen 15',
  '15-clb_edited': 'CLB Nghiên cứu Thị trường Bất động sản',
  '16-legacy-311': 'Ảnh tư liệu REC Gen 15',
  'gen16-recruitment': 'Tuyển thành viên Gen 16',
  'gen16-open-applications': 'Mở đơn Gen 16',
  'the-real-contest-final': 'The Real Contest · Khoảnh khắc chung kết',
  'the-real-contest-evening': 'Đêm chung kết The Real Contest',
  'the-real-seminar': 'Hội thảo chuyên môn REC',
  'company-visit': 'Thăm quan doanh nghiệp',
  'the-maze-2026': 'The Maze 2026',
  'member-birthday': 'Sinh nhật REC',
  'rec-birthday-2026': 'Sinh nhật CLB 2026',
  'secret-santa': 'Secret Santa',
  'cuu-ke-em-nghe': 'Cựu kể em nghe',
  'rec-outing': 'Đi chơi xa cùng Nhà REC',
  'the-maze': 'Ấn phẩm The Maze',
  'cuu-ke-em-nghe-banner': 'Ấn phẩm Cựu kể em nghe',
};

function RegistrationCountdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, registrationDeadline - Date.now()));
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, registrationDeadline - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const totalSeconds = Math.floor(remaining / 1000);
  const units = [
    ['NGÀY', Math.floor(totalSeconds / 86400)],
    ['GIỜ', Math.floor(totalSeconds / 3600) % 24],
    ['PHÚT', Math.floor(totalSeconds / 60) % 60],
    ['GIÂY', totalSeconds % 60],
  ];
  return <div className="registration-countdown" aria-label={remaining ? 'Thời gian còn lại để đăng ký' : 'Đã hết hạn đăng ký'}>
    <div className="countdown-heading"><span>{remaining ? 'MỞ ĐƠN 01.10 · CÒN LẠI' : 'ĐÃ KHÉP ĐƠN GEN 16'}</span><time dateTime="2026-10-20">ĐÓNG 20.10</time></div>
    {remaining > 0 && <div className="countdown-units">{units.map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>}
  </div>;
}

const pressFiles = Object.entries({
  ...import.meta.glob('../assets/press/**/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  ...import.meta.glob('../assets/images/gen16/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' }),
})
  .sort(([a], [b]) => a.localeCompare(b, 'vi', { numeric: true }))
  .map(([path, src]) => {
    const filename = path.split('/').pop().replace(/\.[^.]+$/, '');
    const name = filename.replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim();
    return { src, name: archivedTitles[filename] || name || filename, legacy: path.includes('/gen15/'), featured: filename === 'gen16-recruitment', season: path.includes('/gen15/') ? 'GEN 15 · LƯU TRỮ' : 'GEN 16 · ẤN PHẨM MỚI' };
  });
const archivedArtwork = [
  { src: oldCampaignCover, name: 'RECERIE · tuyển thành viên Gen 15', legacy: true, season: 'GEN 15 · LƯU TRỮ' },
  { src: oldRecMark, name: 'Nhận diện REC Gen 15', legacy: true, season: 'GEN 15 · LƯU TRỮ' },
  { src: oldRecVertical, name: 'REC · bộ nhận diện dọc', legacy: true, season: 'GEN 15 · LƯU TRỮ' },
  { src: oldGen15Banner, name: 'Tuyển thành viên Gen 15', legacy: true, season: 'GEN 15 · LƯU TRỮ' },
  { src: oldRecNumbers, name: 'Những con số ấn tượng của REC', legacy: true, season: 'GEN 15 · LƯU TRỮ' },
];
const pressAssets = [...pressFiles, ...archivedArtwork].sort((a, b) => Number(a.legacy) - Number(b.legacy));

function Detail({ selection, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  const isDept = selection.type === 'department';
  const isTimeline = selection.type === 'timeline';
  const item = isDept ? departments[selection.index] : selection.type === 'campaign' ? campaignImages[selection.index] : activities[selection.index || 0];
  return <dialog ref={dialog} className={`detail-dialog ${isTimeline ? 'timeline-dialog' : ''}`} onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} aria-labelledby="detail-title">
    <div className="detail-shell">
      <button className="close-button" onClick={onClose} aria-label="Đóng chi tiết">✕</button>
      {!isDept && !isTimeline && selection.type !== 'campaign' && <img className="detail-image" src={item.image} alt={item.name} />}
      <div className="detail-body">
        <p className="eyebrow">{isTimeline ? 'HÀNH TRÌNH ĐẾN NHÀ REC' : isDept ? `MẢNH GHÉP ${item.number} / REC FTU` : selection.type === 'campaign' ? 'TUYỂN THÀNH VIÊN GEN 16' : 'NHẬT KÝ NHÀ REC'}</p>
        <h2 id="detail-title">{isTimeline ? 'Từ lá đơn đến đồng đội.' : isDept ? item.title : item.name}</h2>
        {selection.type === 'campaign' ? <><img className="detail-image" src={item.image} alt={item.name} /><p className="detail-tag">{item.tag}</p></> : isTimeline ? <>
          <ol className="recruitment-timeline">{timeline.map(([title, description], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
          <p className="detail-note">Tụi mình sẽ cập nhật lịch tuyển và cách nộp đơn trên fanpage REC FTU nhé.</p>
          <a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Xem thông tin ứng tuyển <Arrow /></a>
        </> : isDept ? <>
          <p className="detail-tag">{item.tag}</p>
          {[['Em sẽ làm gì?', item.tasks], ['Điều REC tìm kiếm', item.requirements], ['Điều em mang về', item.benefits]].map(([title, lines]) => <section key={title}><h3>{title}</h3><ul>{lines.map(line => <li key={line}>{line}</li>)}</ul></section>)}
          <a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Cùng ứng tuyển nhé <Arrow /></a>
        </> : <>
          <p className="detail-tag">{item.tag}</p><p>{item.desc}</p>
        </>}
      </div>
    </div>
  </dialog>;
}

function PressDialog({ onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  const feature = pressAssets.find(item => item.featured) || pressAssets.find(item => item.legacy && /dsc01999/i.test(item.name));
  return <dialog ref={dialog} className="press-dialog" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} aria-labelledby="press-dialog-title">
    <div className="press-dialog-shell">
      <header className="press-masthead" style={feature ? { '--press-image': `url("${feature.src}")` } : undefined}>
        <button className="close-button" onClick={onClose} aria-label="Đóng ấn phẩm">✕</button>
        <div><p>REC · TỪ MÙA TRƯỚC ĐẾN GEN 16</p><h2 id="press-dialog-title">Những dấu ấn<br /><em>của Nhà REC.</em></h2><span>Ảnh, chiến dịch và hoạt động của tụi mình — được lưu lại để em xem.</span></div>
      </header>
      <section className="press-archive" aria-label="Thư viện ấn phẩm và hình ảnh REC">
        <div className="press-archive-heading"><div><span>THƯ VIỆN HÌNH ẢNH</span><h3>REC qua những mùa.</h3></div><span>{String(pressAssets.length).padStart(2, '0')} TƯ LIỆU</span></div>
        <div className="press-grid">{pressAssets.map((item, index) => <a className={`press-card ${item.legacy ? 'archive-card' : ''}`} href={item.src} target="_blank" rel="noreferrer" key={`${item.src}-${index}`} aria-label={`Mở ảnh: ${item.name}`}><img src={item.src} alt={item.name} loading="lazy" /><div><span>{item.season}</span><strong>{item.name}</strong><span aria-hidden="true">↗</span></div></a>)}</div>
          {!pressAssets.some(item => !item.legacy) && <p className="press-upload-note">Ấn phẩm Gen 16 mới sẽ hiện ở đây khi được thêm vào <code>assets/press</code>.</p>}
      </section>
    </div>
  </dialog>;
}

export default function App() {
  const [chapter, setChapter] = useState(0);
  const [selection, setSelection] = useState(null);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [departmentIndex, setDepartmentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pressOpen, setPressOpen] = useState(false);
  const progress = useRef(0);
  const targetProgress = useRef(0);
  const scrollRange = useRef(1);
  const progressLine = useRef(null);
  const scrollTrackRef = useRef(null);
  const sceneState = useRef({ modal: false, activity: 0 });
  sceneState.current = { ...sceneState.current, modal: !!selection, activity: activityIndex, department: departmentIndex };

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(4, index));
    targetProgress.current = clamped;
    window.scrollTo({ top: scrollRange.current * clamped / 4, behavior: 'instant' });
    sceneState.current.focusRequest = (sceneState.current.focusRequest || 0) + 1;
    setMenuOpen(false);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailure(true); setReady(true); }, []);
  const onPick = useCallback((kind, index) => {
    if (kind === 'vietnam') goTo(1);
    else if (kind === 'activity') { setActivityIndex(index); setSelection({ type: 'activity', index }); }
    else if (kind === 'department') setSelection({ type: 'department', index });
  }, [goTo]);

  useEffect(() => {
    // The DOM and WebGL camera consume the same eased clock. No second scroll tween.
    let measuredHeight = window.innerHeight;
    let measured = false, resizing = false, resizeFrame;
    const update = () => { if (resizing || window.innerHeight !== measuredHeight) return; targetProgress.current = Math.max(0, Math.min(4, window.scrollY / scrollRange.current * 4)); };
    const resize = () => {
      if (!measured) {
        scrollRange.current = Math.max(1, (scrollTrackRef.current?.offsetHeight || window.innerHeight) - window.innerHeight);
        measured = true; update(); return;
      }
      const preserved = targetProgress.current; resizing = true;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        scrollRange.current = Math.max(1, (scrollTrackRef.current?.offsetHeight || window.innerHeight) - window.innerHeight);
        measuredHeight = window.innerHeight;
        window.scrollTo({ top: preserved * scrollRange.current / 4, behavior: 'instant' });
        targetProgress.current = preserved; resizing = false;
      });
    };
    let frame, last = performance.now(), displayedChapter = -1;
    const advance = now => {
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      const distance = targetProgress.current - progress.current;
      progress.current += distance * (1 - Math.exp(-dt * 18));
      if (Math.abs(distance) < 0.0001) progress.current = targetProgress.current;
      if (progressLine.current) progressLine.current.style.transform = `scaleX(${progress.current / 4})`;
      const next = Math.round(progress.current);
      if (next !== displayedChapter) { displayedChapter = next; setChapter(next); }
      frame = requestAnimationFrame(advance);
    };
    const key = event => {
      if (sceneState.current.modal || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      if (event.key === 'Escape') setMenuOpen(false);
      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        goTo(Math.round(targetProgress.current) + (['ArrowDown', 'PageDown'].includes(event.key) ? 1 : -1));
      }
      if (event.key === 'Home') { event.preventDefault(); goTo(0); }
      if (event.key === 'End') { event.preventDefault(); goTo(4); }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', key);
    resize(); frame = requestAnimationFrame(advance);
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); window.removeEventListener('scroll', update); window.removeEventListener('resize', resize); window.removeEventListener('keydown', key); };
  }, [goTo]);

  useEffect(() => {
    const hash = location.hash.slice(1);
    const aliases = { about: 1, hero: 0, apply: 4, timeline: 4, announcement: 4 };
    const initial = chapters.findIndex(item => item.id === hash);
    const index = initial >= 0 ? initial : aliases[hash];
    if (index != null) requestAnimationFrame(() => window.scrollTo(0, Math.max(1, (scrollTrackRef.current?.offsetHeight || innerHeight) - innerHeight) * index / 4));
  }, []);
  useEffect(() => { history.replaceState(null, '', `#${chapters[chapter].id}`); }, [chapter]);
  const activeActivity = activities[activityIndex];
  return <>
    <div ref={scrollTrackRef} className="scroll-track" aria-hidden="true" />
    <div className={`experience chapter-${chapter} ${ready ? 'is-ready' : ''}`}>
      <a href="#chapter-content" className="skip-link">Đến nội dung</a>
      {!failure && <RecWorld progress={progress} state={sceneState} onReady={onReady} onFailure={onFailure} onPick={onPick} />}
      {failure && <div className="fallback-planet" aria-hidden="true" />}
      <div className="scene-shade" aria-hidden="true" />
      <div className="scene-colorwash" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true"><div ref={progressLine} /></div>
      <header className="site-header">
        <button className="brand" onClick={() => goTo(0)} aria-label="CLB Nghiên cứu Thị trường Bất động sản, Trường Đại học Ngoại Thương — về đầu hành trình">
          <img className="brand-logo" src={recLogoUrl} alt="Logo Trường Đại học Ngoại Thương" />
          <span className="brand-name"><strong>CLB Nghiên cứu Thị trường Bất động sản</strong><span>Trường Đại học Ngoại Thương</span></span>
        </button>
        <div className="header-coordinate"><span className="status-dot" /> HÀ NỘI, VIỆT NAM <span className="coordinate-value">21°01′ N / 105°51′ E</span></div>
        <div className="header-actions">
          <button className="press-nav" aria-label="Mở thư viện ấn phẩm REC" onClick={() => setPressOpen(true)}>ẤN PHẨM <Arrow /></button>
          <button className="join-nav" onClick={() => goTo(4)}>GIA NHẬP REC <Arrow /></button>
          <button className="menu-toggle" aria-label="Mở điều hướng" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </header>

      <main id="chapter-content" className="story-stage" tabIndex={-1}>
        {chapters.map((story, panelIndex) => <section key={story.id} className={`story-layer chapter-${panelIndex} ${chapter === panelIndex ? 'active' : ''}`} inert={chapter !== panelIndex} aria-hidden={chapter !== panelIndex}>
        <div className="chapter-content"><div className="chapter-copy">
          <p className="eyebrow"><span /> {story.tag}</p>
          {panelIndex === 0 && <>
            <h1>Thế giới rộng.<br />Mình <em>đi cùng.</em></h1>
            <p className="chapter-description">Có cả thế giới đang chờ em khám phá.<br />Ở Nhà REC, tụi mình bắt đầu từ những điều gần gũi nhất.</p>
            <button className="button primary" onClick={() => goTo(1)}>Đi cùng REC <Arrow /></button>
            <p className="micro-note"><span className="mini-orbit" /> Kéo địa cầu để xoay · Chạm Hà Nội để đến gần</p>
          </>}
          {panelIndex === 1 && <>
            <h2>Hà Nội.<br />Ngoại Thương.<br /><em>REC Là Nhà.</em></h2>
            <p className="chapter-description">{recruitmentIntro[0]}</p>
            <p className="chapter-description">{recruitmentIntro[1]}</p>
            <div className="location-card"><span className="location-symbol">↗</span><div><strong>CLB Nghiên cứu Thị trường Bất động sản</strong><p>Trường Đại học Ngoại Thương</p><small>91 Chùa Láng · Hà Nội</small></div></div>
            <button className="text-link" onClick={() => goTo(2)}>Khám phá Nhà REC <Arrow /></button>
          </>}
          {panelIndex === 2 && <>
            <h2>Chuyện tụi mình<br /><em>đã cùng làm.</em></h2>
            <p className="chapter-description">Từ những buổi học, sự kiện đến chuyến đi xa — mỗi dịp lại có thêm chuyện vui để nhớ.</p>
            <div className="activity-preview" key={activityIndex}>
              <button className="activity-preview-image" onClick={() => setSelection({ type: 'activity', index: activityIndex })} aria-label={`Xem ảnh và câu chuyện: ${activeActivity.name}`}><img src={activeActivity.image} alt={activeActivity.name} /></button>
              <span className="mono">{String(activityIndex + 1).padStart(2, '0')} / {String(activities.length).padStart(2, '0')}</span>
              <h3>{activeActivity.name}</h3><p>{activeActivity.tag}</p>
              <button className="text-link" onClick={() => setSelection({ type: 'activity', index: activityIndex })}>Kể em nghe <Arrow /></button>
            </div>
            <div className="activity-controls"><button aria-label="Hoạt động trước" onClick={() => setActivityIndex(index => (index + activities.length - 1) % activities.length)}>←</button><div>{activities.map((item, i) => <button key={item.id} className={i === activityIndex ? 'active' : ''} aria-label={item.name} aria-pressed={i === activityIndex} onClick={() => setActivityIndex(i)} />)}</div><button aria-label="Hoạt động tiếp" onClick={() => setActivityIndex(index => (index + 1) % activities.length)}>→</button></div>
          </>}
          {panelIndex === 3 && <>
            <h2>Bốn ban.<br /><em>Có em trong đội.</em></h2>
            <p className="chapter-description">Em thích tìm hiểu, sáng tạo, kết nối hay tổ chức? Tụi mình có một chỗ dành cho em.</p>
            <div className="department-list">{departments.map((department, i) => <button key={department.id} className={departmentIndex === i ? 'selected' : ''} aria-pressed={departmentIndex === i} onClick={() => setDepartmentIndex(i)}><span className="mono">{department.number}</span><div><strong>{department.short}</strong><small>{department.line}</small></div><span aria-hidden="true">{departmentIndex === i ? '●' : '↗'}</span></button>)}</div>
            <button className="text-link department-details" onClick={() => setSelection({ type: 'department', index: departmentIndex })}>Tìm hiểu về ban {departments[departmentIndex].short} <Arrow /></button>
          </>}
          {panelIndex === 4 && <>
            <p className="join-kicker">GEN 16 · NHÀ REC ĐANG TÌM ĐỒNG ĐỘI</p>
            <h2>Nhà REC thêm vui.<br /><em>Khi có em.</em></h2>
            <p className="chapter-description">{recruitmentIntro[2]}</p>
            <div className="join-actions"><a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Xem cách ứng tuyển <Arrow /></a><button className="button secondary" onClick={() => setSelection({ type: 'timeline' })}>Các vòng sẽ như thế nào? <span>＋</span></button></div>
            <RegistrationCountdown />
            <div className="join-actions">
              {campaignImages.map((item, index) => <button className="button secondary" key={item.name} onClick={() => setSelection({ type: 'campaign', index })}>{item.name} <Arrow /></button>)}
            </div>
            <p className="micro-note">Lịch tuyển Gen 16: {recruitmentRounds.map(([round, dates]) => `${round} ${dates}`).join(' · ')}. Giờ và nội dung chi tiết từng vòng sẽ được cập nhật trên fanpage REC FTU.</p>
          </>}
        </div></div>
        </section>)}
      </main>

      {chapter === 3 && <div className="model-console"><div><span className="model-index">0{departmentIndex + 1} / 04</span><strong>{departments[departmentIndex].short}</strong><small>Kéo để xoay · Bấm mô hình để xem chi tiết</small></div><div className="model-switch"><button aria-label="Mô hình trước" onClick={() => setDepartmentIndex(index => (index + 3) % 4)}>←</button><button aria-label="Mô hình tiếp" onClick={() => setDepartmentIndex(index => (index + 1) % 4)}>→</button></div></div>}

      <aside className="scene-caption" aria-hidden="true">
        <div className="scene-data"><svg className="radar-glyph" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" /><circle cx="28" cy="28" r="15" /><path d="M28 1v54M1 28h54" /><g className="radar-hand"><path d="M28 28L45 11" /></g><circle className="radar-point" cx="37" cy="17" r="2" /><circle className="radar-center" cx="28" cy="28" r="2" /></svg><div><small>{['ĐIỂM HẸN', 'NGOẠI THƯƠNG · HÀ NỘI', 'REC ARCHIVE', 'CÙNG MỘT QUỸ ĐẠO', 'HẸN GẶP EM'][chapter]}</small><strong>{['Hà Nội, Việt Nam', 'Hà Nội, Ngoại Thương', `${String(activities.length).padStart(2, '0')} câu chuyện`, '04 mảnh ghép', 'Nhà REC'][chapter]}</strong><span>{['21.0285° N · 105.8542° E', 'REC Là Nhà', 'Học · Làm · Gắn kết', 'Chọn ban để khám phá', 'Thế hệ tiếp theo'][chapter]}</span></div></div>
        <div className="caption-rule" /><p>{['Góc nhìn lớn. Khởi đầu nhỏ.', 'Từ Ngoại Thương, cùng nhau dựng nên một mái nhà.', 'Những khoảnh khắc trở thành chúng ta.', 'Khác biệt để cùng nhau tiến xa.', 'Hẹn gặp em ở Nhà REC.'][chapter]}</p>
      </aside>

      <footer className="journey-footer">
        <div className="journey-intro"><span className="scroll-mouse" aria-hidden="true" /><span>CUỘN ĐỂ<br /><strong>ĐỔI GÓC NHÌN</strong></span></div>
        <nav className="chapter-nav" aria-label="Các chặng hành trình">{chapters.map((item, i) => <button key={item.id} className={i === chapter ? 'active' : ''} aria-label={item.name} title={item.name} aria-current={i === chapter ? 'step' : undefined} onClick={() => goTo(i)}><span>0{i + 1}</span><strong>{item.name}</strong><ChapterIcon index={i} /><i /></button>)}</nav>
        <span className="journey-count"><strong>0{chapter + 1}</strong><span> / 05</span></span>
      </footer>
      <aside className="contact-dock" aria-label="Kênh liên hệ REC">
        <nav aria-label="Mạng xã hội và email">
          <a href="https://www.facebook.com/FTU.REC/" target="_blank" rel="noreferrer" aria-label="Facebook REC FTU" title="Facebook REC FTU" data-label="Facebook REC FTU">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.2v3H10v8h3.4z" /></svg>
          </a>
          <a href="https://www.tiktok.com/@rec.ftu" target="_blank" rel="noreferrer" aria-label="TikTok REC FTU" title="TikTok REC FTU" data-label="TikTok REC FTU">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path className="tiktok-cyan" d="M14.1 3v11.1a4.1 4.1 0 1 1-3.2-4v3.2a1 1 0 1 0 .1 1.8V3h3.1z" /><path className="tiktok-pink" d="M15.5 4.3a6.2 6.2 0 0 0 4.1 3.2v3.2a9.2 9.2 0 0 1-4.1-1.8v5.3a6.1 6.1 0 1 1-6.1-6.1v3.2a2.9 2.9 0 1 0 2.9 2.9V4.3h3.2z" /><path d="M14.8 3v11.1a4.1 4.1 0 1 1-3.2-4v3.2a1 1 0 1 0 .1 1.8V3h3.1zm0 0a6.1 6.1 0 0 0 4.1 3.2v3.2a9.2 9.2 0 0 1-4.1-1.8" /></svg>
          </a>
          <a href="https://www.tiktok.com/@timnhacungban.findx" target="_blank" rel="noreferrer" aria-label="TikTok Tìm Nhà Cùng Bạn FindX" title="TikTok FindX" data-label="TikTok FindX">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path className="tiktok-cyan" d="M14.1 3v11.1a4.1 4.1 0 1 1-3.2-4v3.2a1 1 0 1 0 .1 1.8V3h3.1z" /><path className="tiktok-pink" d="M15.5 4.3a6.2 6.2 0 0 0 4.1 3.2v3.2a9.2 9.2 0 0 1-4.1-1.8v5.3a6.1 6.1 0 1 1-6.1-6.1v3.2a2.9 2.9 0 1 0 2.9 2.9V4.3h3.2z" /><path d="M14.8 3v11.1a4.1 4.1 0 1 1-3.2-4v3.2a1 1 0 1 0 .1 1.8V3h3.1zm0 0a6.1 6.1 0 0 0 4.1 3.2v3.2a9.2 9.2 0 0 1-4.1-1.8" /></svg>
          </a>
          <a href="mailto:rec@ftu.edu.vn" aria-label="Gửi email đến REC FTU" title="Email REC FTU" data-label="rec@ftu.edu.vn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v13h-17zM4 6l8 7 8-7" /></svg>
          </a>
        </nav>
      </aside>
      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} inert={!menuOpen} aria-label="Điều hướng di động">{chapters.map((item, i) => <button key={item.id} onClick={() => goTo(i)}><span>0{i + 1}</span>{item.name}<Arrow /></button>)}</nav>
      {!ready && <div className="loading-scene" role="status"><span className="loading-ring" /><p>Đang mở một góc nhìn mới…</p></div>}
      {failure && <p className="scene-fallback-note" role="status">Chế độ nhẹ — em vẫn có thể khám phá đầy đủ các chặng.</p>}
    </div>
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about"><p className="footer-eyebrow">REC · FTU</p><h2>Nhà REC luôn có chỗ cho em.</h2><p>CLB Nghiên cứu Thị trường Bất động sản<br />Trường Đại học Ngoại thương</p></div>
        <div className="footer-contact"><h3>TÌM TỤI MÌNH</h3><p>91 Chùa Láng, Đống Đa<br />Hà Nội, Việt Nam</p><a href="mailto:rec@ftu.edu.vn">rec@ftu.edu.vn</a><nav aria-label="Kênh liên lạc REC"><a href="https://www.facebook.com/FTU.REC/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.tiktok.com/@rec.ftu" target="_blank" rel="noreferrer">TikTok REC</a><a href="https://www.tiktok.com/@timnhacungban.findx" target="_blank" rel="noreferrer">TikTok FindX</a></nav></div>
        <div className="footer-brand"><img src={recLogoUrl} alt="Logo REC FTU" /><button onClick={() => goTo(4)}>VỀ VỚI REC <Arrow /></button></div>
      </div>
      <div className="footer-bottom"><span>© 2026 REC FTU · GEN 16</span><span>Design by Spolighterr</span></div>
    </footer>
    {pressOpen && <PressDialog onClose={() => setPressOpen(false)} />}
    {selection && <Detail selection={selection} onClose={() => setSelection(null)} />}
  </>;
}
