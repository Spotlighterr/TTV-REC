import React, { useCallback, useEffect, useRef, useState } from 'react';
import { displayImageProps } from './display-images';
import { chapters, activities, departments, timeline, recruitmentUrl, recruitmentIntro, recruitmentRounds, campaignImages } from './content';
import recLogoUrl from '../recftu_logo.jpg';
import gen16Cover from '../assets/images/gen16-bnd/bnd-ttv-cover.png';
import gen16FormBanner from '../assets/images/gen16-bnd/form-banner.png';
import noteVongDon from '../assets/images/gen16-bnd/note-vong-don.png';
import noteVongDgnl from '../assets/images/gen16-bnd/note-vong-dgnl.png';
import noteVongTeamwork from '../assets/images/gen16-bnd/note-vong-teamwork.png';
import noteVongTnpv from '../assets/images/gen16-bnd/note-vong-tnpv.png';
import ftuCampusImage from '../assets/images/ftu-campus.webp';
import deptBcmImg from '../assets/images/departments/BCM.jpg';
import deptBttImg from '../assets/images/departments/BTT.jpg';
import deptBdnImg from '../assets/images/departments/BDN.jpg';
import deptBtcImg from '../assets/images/departments/BTC.jpg';

const departmentImages = [deptBcmImg, deptBttImg, deptBdnImg, deptBtcImg];

const mobileLayoutQuery = '(max-width: 760px), (max-width: 960px) and (pointer: coarse)';
const isMobileLayout = () => window.matchMedia(mobileLayoutQuery).matches;
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
  const isStory = selection.type === 'story';
  const item = isStory ? null : isDept ? departments[selection.index] : selection.type === 'campaign' ? campaignImages[selection.index] : activities[selection.index || 0];
  return <dialog ref={dialog} className={`detail-dialog ${isTimeline ? 'timeline-dialog' : ''}`} onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} aria-labelledby="detail-title">
    <div className="detail-shell">
      <button className="close-button" onClick={onClose} aria-label="Đóng chi tiết">✕</button>
      {!isDept && !isTimeline && !isStory && selection.type !== 'campaign' && <img className="detail-image" {...displayImageProps(item.image)} alt={item.name} />}
      <div className="detail-body">
        <p className="eyebrow">{isStory ? 'CÂU CHUYỆN GEN 16' : isTimeline ? 'HÀNH TRÌNH ĐẾN NHÀ REC' : isDept ? `MẢNH GHÉP ${item.number} / REC FTU` : selection.type === 'campaign' ? 'TUYỂN THÀNH VIÊN GEN 16' : 'NHẬT KÝ NHÀ REC'}</p>
        <h2 id="detail-title">{isStory ? 'Con đường về Nhà REC.' : isTimeline ? 'Từ lá đơn đến đồng đội.' : isDept ? item.title : item.name}</h2>
        {isStory ? <div className="story-dialog-copy">{recruitmentIntro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div> : selection.type === 'campaign' ? <><img className="detail-image" {...displayImageProps(item.image)} alt={item.name} /><p className="detail-tag">{item.tag}</p></> : isTimeline ? <>
          <ol className="recruitment-timeline">{timeline.map(([title, description], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
          <p className="detail-note">Đơn đăng ký mở từ 01/10 đến hết ngày 20/10/2026. Hãy kể cho REC nghe về em nhé!</p>
          <a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Điền đơn ứng tuyển ngay <Arrow /></a>
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

export default function App() {
  const tabParamVal = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = parseInt(params.get('tab'), 10);
      if (!isNaN(t) && t >= 0 && t <= 4) return t;
    } catch (e) {}
    return null;
  })();

  const [chapter, setChapter] = useState(tabParamVal ?? 0);
  const [selection, setSelection] = useState(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [departmentIndex, setDepartmentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(isMobileLayout);
  const previousChapter = useRef(chapter);
  const progress = useRef(tabParamVal ?? 0);
  const targetProgress = useRef(tabParamVal ?? 0);
  const scrollRange = useRef(1);
  const progressLine = useRef(null);
  const scrollTrackRef = useRef(null);
  const modalOpen = useRef(false);
  modalOpen.current = !!selection;

  useEffect(() => {
    if (mobileLayout) return;
    const content = document.querySelector(`#story-${chapter} .chapter-content`);
    const direction = chapter >= previousChapter.current ? 1 : -1;
    previousChapter.current = chapter;
    const animation = content?.animate([
      { opacity: 0, transform: `translateY(${direction * 24}px) scale(.985)` },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration: 550, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    return () => animation?.cancel();
  }, [chapter, mobileLayout]);

  useEffect(() => {
    if (!mobileLayout) return;
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const content = entry.target.querySelector('.chapter-content');
        const animation = content?.animate([
          { opacity: .45, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 500, easing: 'cubic-bezier(.22, 1, .36, 1)' });
        if (animation) {
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      }
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.story-stage > .story-layer').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [mobileLayout]);

  useEffect(() => {
    const media = window.matchMedia(mobileLayoutQuery);
    const change = () => setMobileLayout(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  const goTo = useCallback((index, options = {}) => {
    const clamped = Math.max(0, Math.min(4, index));
    if (isMobileLayout()) {
      document.getElementById(`story-${clamped}`)?.scrollIntoView({ behavior: options.behavior || 'smooth', block: 'start' });
      setMenuOpen(false);
      return;
    }
    targetProgress.current = clamped;
    progress.current = clamped;
    setChapter(clamped);
    if (!isMobileLayout()) window.scrollTo({ top: scrollRange.current * clamped / 4, behavior: 'instant' });
    if (progressLine.current) progressLine.current.style.transform = `scaleX(${clamped / 4})`;
    setMenuOpen(false);
  }, []);
  useEffect(() => {
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.journey-footer');
    const stage = document.querySelector('.story-stage');
    const measure = () => {
      stage.style.setProperty('--story-top', `${Math.ceil(header.getBoundingClientRect().bottom) + 8}px`);
      stage.style.setProperty('--story-bottom', isMobileLayout() ? '0px' : `${Math.ceil(window.innerHeight - footer.getBoundingClientRect().top) + 8}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(footer);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
    };
  }, []);
  useEffect(() => {
    // Ease chapter transitions and the reading progress together.
    let measuredHeight = window.innerHeight;
    let measured = false, resizing = false, resizeFrame;
    const update = () => {
      if (resizing) return;
      if (isMobileLayout()) {
        const sections = [...document.querySelectorAll('.story-stage > .story-layer')];
        const centers = sections.map(section => {
          const bounds = section.getBoundingClientRect();
          return bounds.top + window.scrollY + Math.min(bounds.height / 2, window.innerHeight / 2);
        });
        const probe = window.scrollY + window.innerHeight * 0.45;
        let value = 0;
        for (let index = 0; index < centers.length - 1; index++) {
          if (probe >= centers[index]) value = index + Math.min(1, (probe - centers[index]) / Math.max(1, centers[index + 1] - centers[index]));
        }
        targetProgress.current = value;
      } else {
        if (window.innerHeight !== measuredHeight || tabParamVal !== null) return;
        targetProgress.current = Math.max(0, Math.min(4, window.scrollY / scrollRange.current * 4));
      }
      schedule();
    };
    const resize = () => {
      if (isMobileLayout()) { measuredHeight = window.innerHeight; measured = true; update(); return; }
      if (!measured) {
        scrollRange.current = Math.max(1, (scrollTrackRef.current?.offsetHeight || window.innerHeight) - window.innerHeight);
        measured = true;
        return;
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
    let frame = null, last = performance.now(), displayedChapter = -1;
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(advance); };
    const advance = now => {
      frame = null;
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      const distance = targetProgress.current - progress.current;
      progress.current += distance * (1 - Math.exp(-dt * 18));
      if (Math.abs(distance) < 0.0001) progress.current = targetProgress.current;
      if (progressLine.current) progressLine.current.style.transform = `scaleX(${progress.current / 4})`;
      const next = Math.round(progress.current);
      if (next !== displayedChapter) { displayedChapter = next; setChapter(next); }
      if (Math.abs(distance) >= 0.0001) schedule();
    };
    const key = event => {
      if (modalOpen.current || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      if (event.key === 'Escape') setMenuOpen(false);
      if (isMobileLayout()) return;
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
    const observer = new ResizeObserver(() => { if (isMobileLayout()) update(); });
    observer.observe(document.querySelector('.story-stage'));
    resize(); schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); window.removeEventListener('scroll', update); window.removeEventListener('resize', resize); window.removeEventListener('keydown', key); };
  }, [goTo, mobileLayout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      const idx = parseInt(tabParam, 10);
      if (!isNaN(idx) && idx >= 0 && idx <= 4) {
        if (isMobileLayout()) { goTo(idx, { behavior: 'instant' }); return; }
        setChapter(idx);
        targetProgress.current = idx;
        progress.current = idx;
        return;
      }
    }
    const hash = location.hash.slice(1);
    const aliases = { about: 1, hero: 0, apply: 4, timeline: 4, announcement: 4 };
    const initial = chapters.findIndex(item => item.id === hash);
    const index = initial >= 0 ? initial : aliases[hash];
    if (index != null) goTo(index, { behavior: 'instant' });
  }, [goTo]);
  useEffect(() => { history.replaceState(null, '', `#${chapters[chapter].id}`); }, [chapter]);
  const activeActivity = activities[activityIndex];
  return <>
    <div ref={scrollTrackRef} className="scroll-track" aria-hidden="true" />
    <div className={`experience chapter-${chapter} is-ready`}>
      <a href="#chapter-content" className="skip-link">Đến nội dung</a>
      <div className="bnd-stage-backdrop" aria-hidden="true">
        <div className="bnd-sky-official-layer" />
        <div className="bnd-sky-overlay-gradient" />
      </div>
      <div className="reading-progress" aria-hidden="true"><div ref={progressLine} /></div>
      <header className="site-header">
        <button className="brand" onClick={() => goTo(0)} aria-label="CLB Nghiên cứu Thị trường Bất động sản, Trường Đại học Ngoại Thương — về đầu hành trình">
          <img className="brand-logo" src={recLogoUrl} alt="Logo Trường Đại học Ngoại Thương" />
          <span className="brand-name"><strong>CLB Nghiên cứu Thị trường Bất động sản</strong><span>Trường Đại học Ngoại Thương</span></span>
        </button>
        <div className="header-coordinate"><span className="status-dot" /> HÀ NỘI · FTU <span className="coordinate-value">REC GEN 16 · ROAD</span></div>
        <div className="header-actions">
          <a className="join-nav bnd-sign-button" href={recruitmentUrl} target="_blank" rel="noreferrer">ĐIỀN ĐƠN NGAY <Arrow /></a>
          <button className="menu-toggle" aria-label="Mở điều hướng" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </header>

      <main id="chapter-content" className="story-stage" tabIndex={-1}>
        {chapters.map((story, panelIndex) => <section id={`story-${panelIndex}`} key={story.id} className={`story-layer chapter-${panelIndex} ${chapter === panelIndex ? 'active' : ''}`} inert={!mobileLayout && chapter !== panelIndex} aria-hidden={!mobileLayout && chapter !== panelIndex} aria-label={story.name}>
        {(mobileLayout || chapter === panelIndex) && <div className="chapter-content"><div className="chapter-copy">
          {panelIndex === 0 && <>
            <div className="hero-bnd-layout">
              <div className="hero-text-col">
                <div className="bnd-hero-badge">
                  <span className="bnd-badge-clb">CLB NGHIÊN CỨU THỊ TRƯỜNG BẤT ĐỘNG SẢN · ĐH NGOẠI THƯƠNG</span>
                  <span className="bnd-badge-gen">TUYỂN THÀNH VIÊN THẾ HỆ THỨ 16</span>
                </div>
                <h1 className="bnd-hero-title">
                  <span className="bnd-title-road">ROAD</span>
                  <span className="bnd-title-sub">ĐƯỜNG VỀ NHÀ · VÌ REC LÀ NHÀ</span>
                </h1>
                <p className="chapter-description">Mỗi hành trình đại học bắt đầu từ những bước chân riêng rẽ. Ở REC, tụi mình cùng nhau đi chung một con đường.</p>
                <div className="hero-cta-group">
                  <a className="button primary cta-pulse" href={recruitmentUrl} target="_blank" rel="noreferrer">Điền đơn ứng tuyển ngay <Arrow /></a>
                  <button className="button secondary" onClick={() => goTo(1)}>Khám phá hành trình <Arrow /></button>
                </div>
                <div className="bnd-sticky-preview">
                  <div className="sticky-item"><img src={noteVongDon} alt="Vòng Đơn: 01/10 - 20/10" /><span><strong>VÒNG ĐƠN</strong>01/10 - 20/10</span></div>
                  <div className="sticky-item"><img src={noteVongDgnl} alt="Vòng ĐGNL: 23/10 - 24/10" /><span><strong>ĐÁNH GIÁ NL</strong>23/10 - 24/10</span></div>
                  <div className="sticky-item"><img src={noteVongTeamwork} alt="Vòng Teamwork: 26/10 - 01/11" /><span><strong>TEAMWORK</strong>26/10 - 01/11</span></div>
                  <div className="sticky-item"><img src={noteVongTnpv} alt="Vòng Trải nghiệm & PV: 02/11 - 10/11" /><span><strong>TRẢI NGHIỆM</strong>02/11 - 10/11</span></div>
                </div>
              </div>
              <div className="hero-visual-col">
                <div className="hero-poster-frame">
                  <img {...displayImageProps(gen16Cover)} alt="Bộ nhận diện Gen 16 REC - ROAD Về Nhà" className="hero-poster-img" />
                </div>
              </div>
            </div>
          </>}
          {panelIndex === 1 && <>
            <div className="ftu-showcase-layout">
              <div className="ftu-text-side">
                <p className="eyebrow"><span /> {story.tag}</p>
                <h2>Hà Nội.<br />Ngoại Thương.<br /><em>REC Là Nhà.</em></h2>
                <p className="chapter-description">Mỗi người đến Ngoại Thương từ một điểm xuất phát khác nhau. Ở REC, những cuộc gặp bình thường dần thành tình bạn và một nơi để gọi là nhà.</p>
                <div className="location-card"><span className="location-symbol">↗</span><div><strong>CLB Nghiên cứu Thị trường Bất động sản</strong><p>Trường Đại học Ngoại Thương</p><small>91 Chùa Láng · Đống Đa · Hà Nội</small></div></div>
                <div className="story-links"><button className="text-link" onClick={() => setSelection({ type: 'story' })}>Đọc câu chuyện REC <Arrow /></button><button className="button secondary" onClick={() => goTo(2)}>Khám phá Nhà REC <Arrow /></button></div>
              </div>
              <div className="ftu-image-side">
                <div className="ftu-photo-frame">
                  <img src={ftuCampusImage} alt="Trường Đại học Ngoại Thương Hà Nội" className="ftu-photo" loading="lazy" decoding="async" />
                  <div className="ftu-photo-badge">TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG · 91 CHÙA LÁNG</div>
                </div>
              </div>
            </div>
          </>}
          {panelIndex === 2 && <>
            <div className="activity-centered-container">
              <p className="eyebrow"><span /> {story.tag}</p>
              <h2>Chuyện tụi mình <em>đã cùng làm.</em></h2>
              <p className="chapter-description">Từ những buổi học, sự kiện đến chuyến đi xa — mỗi dịp lại có thêm chuyện vui để nhớ.</p>
              <div className="activity-big-card">
                <button className="activity-preview-image" onClick={() => setSelection({ type: 'activity', index: activityIndex })} aria-label={`Xem ảnh và câu chuyện: ${activeActivity.name}`}><img key={activeActivity.id} {...displayImageProps(activeActivity.image)} alt={activeActivity.name} loading="lazy" /></button>
                <div className="activity-preview-meta">
                  <span className="mono">{String(activityIndex + 1).padStart(2, '0')} / {String(activities.length).padStart(2, '0')}</span>
                  <h3>{activeActivity.name}</h3><p className="activity-tagline">{activeActivity.tag}</p>
                  <p className="activity-desc-snippet">{activeActivity.desc}</p>
                  <button className="button secondary" onClick={() => setSelection({ type: 'activity', index: activityIndex })}>Kể em nghe chuyện này <Arrow /></button>
                </div>
              </div>
              <div className="activity-controls"><button aria-label="Hoạt động trước" onClick={() => setActivityIndex(index => (index + activities.length - 1) % activities.length)}>←</button><div>{activities.map((item, i) => <button key={item.id} className={i === activityIndex ? 'active' : ''} aria-label={item.name} aria-pressed={i === activityIndex} onClick={() => setActivityIndex(i)} />)}</div><button aria-label="Hoạt động tiếp" onClick={() => setActivityIndex(index => (index + 1) % activities.length)}>→</button></div>
            </div>
          </>}
          {panelIndex === 3 && <>
            <div className="department-split-layout">
              <div className="department-left-side">
                <p className="eyebrow"><span /> {story.tag}</p>
                <h2>Bốn ban.<br /><em>Có em trong đội.</em></h2>
                <p className="chapter-description">Em thích tìm hiểu, sáng tạo, kết nối hay tổ chức? Tụi mình có một chỗ dành cho em.</p>
                <div className="department-list">{departments.map((department, i) => <button key={department.id} className={departmentIndex === i ? 'selected' : ''} aria-pressed={departmentIndex === i} onClick={() => setDepartmentIndex(i)}><span className="mono">{department.number}</span><div><strong>{department.short}</strong><small>{department.line}</small></div><span aria-hidden="true">{departmentIndex === i ? '●' : '↗'}</span></button>)}</div>
                <button className="text-link department-details" onClick={() => setSelection({ type: 'department', index: departmentIndex })}>Tìm hiểu về ban {departments[departmentIndex].short} <Arrow /></button>
              </div>
              <div className="department-right-side">
                <div className="department-photo-card" onClick={() => setSelection({ type: 'department', index: departmentIndex })}>
                  <img key={departments[departmentIndex].id} {...displayImageProps(departmentImages[departmentIndex])} alt={`Ban ${departments[departmentIndex].short}`} className="department-photo" loading="lazy" />
                  <div className="department-photo-caption">
                    <span className="caption-label">BAN {departments[departmentIndex].short.toUpperCase()}</span>
                    <strong className="caption-tagline">{departments[departmentIndex].tag}</strong>
                    <span className="caption-hint">Bấm ảnh để xem chi tiết công việc <Arrow /></span>
                  </div>
                </div>
              </div>
            </div>
          </>}
          {panelIndex === 4 && <>
            <div className="join-balanced-grid">
              <div className="join-grid-banner">
                <div className="join-hero-banner-wrapper">
                  <img {...displayImageProps(gen16FormBanner)} alt="Tuyển thành viên Gen 16" className="join-form-cover" loading="lazy" />
                </div>
              </div>
              <div className="join-grid-main">
                <p className="join-kicker">GEN 16 · ROAD · VỀ NHÀ</p>
                <h2>Nhà REC thêm vui.<br /><em>Khi có em.</em></h2>
                <p className="chapter-description">{recruitmentIntro[2]}</p>
                <div className="join-actions">
                  <a className="button primary cta-pulse" href={recruitmentUrl} target="_blank" rel="noreferrer">Điền đơn ứng tuyển ngay <Arrow /></a>
                  <button className="button secondary" onClick={() => setSelection({ type: 'timeline' })}>Lịch trình 4 vòng tuyển <span>＋</span></button>
                </div>
              </div>
              <div className="join-grid-extra">
                <RegistrationCountdown />
                <div className="join-actions">
                  {campaignImages.map((item, index) => <button className="button secondary" key={item.name} onClick={() => setSelection({ type: 'campaign', index })}>{item.name} <Arrow /></button>)}
                </div>
                <p className="micro-note">Lịch tuyển Gen 16: {recruitmentRounds.map(([round, dates]) => `${round} (${dates})`).join(' · ')}. Hạn nộp đơn: 23:59 ngày 20/10/2026.</p>
              </div>
            </div>
          </>}
        </div></div>}
        </section>)}
      </main>

      <footer className="journey-footer">
        <div className="journey-intro"><span className="scroll-mouse" aria-hidden="true" /><span>CUỘN ĐỂ<br /><strong>XEM CÁC CHẶNG</strong></span></div>
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
    </div>
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about"><p className="footer-eyebrow">REC · FTU</p><h2>Nhà REC luôn có chỗ cho em.</h2><p>CLB Nghiên cứu Thị trường Bất động sản<br />Trường Đại học Ngoại thương</p></div>
        <div className="footer-contact"><h3>TÌM TỤI MÌNH</h3><p>91 Chùa Láng, Đống Đa<br />Hà Nội, Việt Nam</p><a href="mailto:rec@ftu.edu.vn">rec@ftu.edu.vn</a><nav aria-label="Kênh liên lạc REC"><a href="https://www.facebook.com/FTU.REC/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.tiktok.com/@rec.ftu" target="_blank" rel="noreferrer">TikTok REC</a><a href="https://www.tiktok.com/@timnhacungban.findx" target="_blank" rel="noreferrer">TikTok FindX</a></nav></div>
        <div className="footer-brand"><img src={recLogoUrl} alt="Logo REC FTU" /><button onClick={() => goTo(4)}>VỀ VỚI REC <Arrow /></button></div>
      </div>
      <div className="footer-bottom"><span>© 2026 REC FTU · GEN 16</span><span>Design by Spolighterr</span></div>
    </footer>
    {selection && <Detail selection={selection} onClose={() => setSelection(null)} />}
  </>;
}
