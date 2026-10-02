import React, { useCallback, useEffect, useRef, useState } from 'react';
import { displayImageProps } from './display-images';
import { chapters, activities, departments, timeline, recruitmentUrl, recruitmentIntro, recruitmentRounds, campaignImages, contestImage } from './content';
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
import contestEveningImg from '../assets/images/gen16/the-real-contest-evening.jpg';

const departmentImages = [deptBcmImg, deptBttImg, deptBdnImg, deptBtcImg];

const mobileLayoutQuery = '(max-width: 760px), (max-width: 960px) and (pointer: coarse)';
const isMobileLayout = () => window.matchMedia(mobileLayoutQuery).matches;
const Arrow = () => <span aria-hidden="true">↗</span>;

const chapterIconPaths = [
  <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16" /></>,
  <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8" cy="9" r="1.5" /><path d="m4 18 5-5 3 3 3-4 5 6" /></>,
  <><path d="M4 5h16v3a4 4 0 0 1-4 4h-1a4 4 0 0 1-3 3.9A4 4 0 0 1 9 12H8a4 4 0 0 1-4-4V5ZM12 16v4m-4 0h8" /></>,
  <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M15 15a5 5 0 0 1 6 5" /></>,
  <><path d="m3 11 9-8 9 8M5 10v10h14V10M10 20v-6h4v6" /></>,
  <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /><path d="M3 21h18" /></>,
];
const ChapterIcon = ({ index }) => <svg className="chapter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{chapterIconPaths[index] || chapterIconPaths[0]}</svg>;
const lastChapter = chapters.length - 1;

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
      {isStory && (
        <div className="story-dialog-banner-wrap">
          <img className="detail-image story-dialog-banner" src={ftuCampusImage} alt="Trường Đại học Ngoại Thương - REC FTU" />
          <div className="story-dialog-banner-badge">HÀ NỘI · FTU · VÌ REC LÀ NHÀ</div>
        </div>
      )}
      <div className="detail-body">
        <p className="eyebrow">{isStory ? 'CÂU CHUYỆN GEN 16' : isTimeline ? 'HÀNH TRÌNH ĐẾN NHÀ REC' : isDept ? `MẢNH GHÉP ${item.number} / REC FTU` : selection.type === 'campaign' ? 'TUYỂN THÀNH VIÊN GEN 16' : 'NHẬT KÝ NHÀ REC'}</p>
        <h2 id="detail-title">{isStory ? 'Con đường về Nhà REC.' : isTimeline ? 'Từ lá đơn đến đồng đội.' : isDept ? item.title : item.name}</h2>
        {isStory ? (
          <div className="story-dialog-content">
            <div className="story-dialog-copy">{recruitmentIntro.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}</div>
            <div className="story-dialog-actions">
              <a className="button primary cta-pulse" href={recruitmentUrl} target="_blank" rel="noreferrer">Điền đơn ứng tuyển Gen 16 <Arrow /></a>
            </div>
          </div>
        ) : selection.type === 'campaign' ? <><img className="detail-image" {...displayImageProps(item.image)} alt={item.name} /><p className="detail-tag">{item.tag}</p></> : isTimeline ? <>
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
      if (!isNaN(t) && t >= 0 && t <= lastChapter) return t;
    } catch (e) {}
    return null;
  })();

  const [chapter, setChapter] = useState(tabParamVal ?? 0);
  const [selection, setSelection] = useState(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [activityDir, setActivityDir] = useState(1);
  const [departmentIndex, setDepartmentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(isMobileLayout);
  const [isContinuousScroll, setIsContinuousScroll] = useState(false);
  const [showPeekFooter, setShowPeekFooter] = useState(false);
  const experienceRef = useRef(null);
  const progressLine = useRef(null);
  const modalOpen = useRef(false);
  modalOpen.current = !!selection;

  const goTo = useCallback((index, options = {}) => {
    const clamped = Math.max(0, Math.min(lastChapter, index));
    setChapter(clamped);
    if (isContinuousScroll || isMobileLayout()) {
      document.getElementById(`story-${clamped}`)?.scrollIntoView({ behavior: options.behavior || 'smooth', block: 'start' });
    }
    if (progressLine.current) progressLine.current.style.transform = `scaleX(${clamped / lastChapter})`;
    setMenuOpen(false);
  }, [isContinuousScroll]);

  const toggleContinuousScroll = useCallback(() => {
    setIsContinuousScroll(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document.getElementById(`story-${chapter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
      return next;
    });
  }, [chapter]);

  const goActivity = useCallback((next) => {
    setActivityDir(next > activityIndex ? 1 : -1);
    setActivityIndex(next);
  }, [activityIndex]);

  // Preload all activities and department images on mount for instant zero-lag tab switching
  useEffect(() => {
    activities.forEach(item => {
      if (item.image) {
        const img = new Image();
        img.decoding = 'async';
        img.src = item.image;
      }
    });
    departmentImages.forEach(src => {
      if (src) {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      }
    });
    if (contestImage) {
      const img = new Image();
      img.decoding = 'async';
      img.src = contestImage;
    }
  }, []);

  // Mobile layout detection
  useEffect(() => {
    const media = window.matchMedia(mobileLayoutQuery);
    const change = () => setMobileLayout(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  // Update active chapter during continuous scroll or mobile scroll
  useEffect(() => {
    if (!isContinuousScroll && !mobileLayout) return;
    const layers = Array.from(document.querySelectorAll('.story-stage > .story-layer'));
    if (!layers.length) return;

    let ticking = false;
    const updateActiveChapter = () => {
      const viewMid = window.innerHeight * 0.42;
      let targetIdx = 0;
      for (let i = 0; i < layers.length; i++) {
        const rect = layers[i].getBoundingClientRect();
        if (rect.top <= viewMid) {
          targetIdx = i;
        }
      }
      setChapter(prev => {
        if (prev !== targetIdx) {
          if (progressLine.current) progressLine.current.style.transform = `scaleX(${targetIdx / lastChapter})`;
          return targetIdx;
        }
        return prev;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveChapter);
        ticking = true;
      }
    };

    const scrollContainer = isContinuousScroll && !mobileLayout ? experienceRef.current : window;
    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    updateActiveChapter();

    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, [isContinuousScroll, mobileLayout]);

  // Header and footer height measurement
  useEffect(() => {
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.journey-footer');
    const stage = document.querySelector('.story-stage');
    if (!stage) return;
    const measure = () => {
      if (header) {
        stage.style.setProperty('--story-top', `${Math.ceil(header.getBoundingClientRect().bottom) + 8}px`);
      }
      if (footer) {
        const footerHeight = Math.ceil(window.innerHeight - footer.getBoundingClientRect().top);
        stage.style.setProperty('--story-bottom', `${Math.max(50, footerHeight) + 8}px`);
      }
    };
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    if (footer) observer.observe(footer);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const key = event => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

      if (modalOpen.current) {
        if (event.key === 'Escape') { event.preventDefault(); setSelection(null); return; }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          setSelection(prev => {
            if (!prev) return prev;
            if (prev.type === 'campaign') return { ...prev, index: (prev.index + 1) % campaignImages.length };
            if (prev.type === 'activity') return { ...prev, index: ((prev.index ?? 0) + 1) % activities.length };
            if (prev.type === 'department') return { ...prev, index: ((prev.index ?? 0) + 1) % departments.length };
            return prev;
          });
          return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          setSelection(prev => {
            if (!prev) return prev;
            if (prev.type === 'campaign') return { ...prev, index: (prev.index + campaignImages.length - 1) % campaignImages.length };
            if (prev.type === 'activity') return { ...prev, index: ((prev.index ?? 0) + activities.length - 1) % activities.length };
            if (prev.type === 'department') return { ...prev, index: ((prev.index ?? 0) + departments.length - 1) % departments.length };
            return prev;
          });
          return;
        }
        return;
      }

      // Vertical navigation: Switch chapters
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        goTo(chapter + 1);
        return;
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        goTo(chapter - 1);
        return;
      }

      // Horizontal navigation: Switch sub-items if available
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (chapter === 2) {
          goActivity((activityIndex + 1) % activities.length);
        } else if (chapter === 4) {
          setDepartmentIndex(index => (index + 1) % departments.length);
        } else {
          goTo(chapter + 1);
        }
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (chapter === 2) {
          goActivity((activityIndex + activities.length - 1) % activities.length);
        } else if (chapter === 4) {
          setDepartmentIndex(index => (index + departments.length - 1) % departments.length);
        } else {
          goTo(chapter - 1);
        }
        return;
      }

      if (event.key === 'Home') { event.preventDefault(); goTo(0); }
      if (event.key === 'End') { event.preventDefault(); goTo(lastChapter); }
      if (event.key === 'Escape') setMenuOpen(false);
    };

    // On PC: Prevent native wheel scroll when in presentation mode
    const wheel = event => {
      if (isMobileLayout() || modalOpen.current || isContinuousScroll) return;
      const target = event.target;
      if (target && target.closest && target.closest('.detail-shell, .dialog, .chapter-content')) {
        const scrollable = target.closest('.chapter-content');
        if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) return;
      }
      event.preventDefault();
    };

    window.addEventListener('keydown', key);
    window.addEventListener('wheel', wheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('wheel', wheel);
    };
  }, [chapter, goTo, goActivity, activityIndex, isContinuousScroll]);

  // Slide up footer when mouse reaches bottom edge on PC
  useEffect(() => {
    if (mobileLayout || isContinuousScroll) return;
    const onMove = (e) => {
      if (e.clientY >= window.innerHeight - 25) {
        setShowPeekFooter(true);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mobileLayout, isContinuousScroll]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      const idx = parseInt(tabParam, 10);
      if (!isNaN(idx) && idx >= 0 && idx <= lastChapter) {
        goTo(idx, { behavior: 'instant' });
        return;
      }
    }
    const hash = location.hash.slice(1);
    const aliases = { about: 1, hero: 0, apply: lastChapter, timeline: lastChapter, announcement: lastChapter };
    const initial = chapters.findIndex(item => item.id === hash);
    const index = initial >= 0 ? initial : aliases[hash];
    if (index != null) goTo(index, { behavior: 'instant' });
  }, [goTo]);
  useEffect(() => { history.replaceState(null, '', `#${chapters[chapter].id}`); }, [chapter]);


  const activeActivity = activities[activityIndex];
  return <>
    <div
      ref={experienceRef}
      className={`experience chapter-${chapters[chapter].id} ${isContinuousScroll ? 'mode-continuous-scroll' : ''} is-ready`}
    >
      <a href="#chapter-content" className="skip-link">Đến nội dung</a>
      <div className="bnd-stage-backdrop" aria-hidden="true">
        <div className="bnd-sky-official-layer" />
        <div className="bnd-sky-overlay-gradient" />
        <div className="bnd-sky-ambience">
          {/* TOP ATMOSPHERIC EFFECTS */}
          <div className="ambient-sunlight-beam" />
          <div className="sky-sunray-beams">
            <span className="sunray r-1" />
            <span className="sunray r-2" />
            <span className="sunray r-3" />
          </div>
          <div className="sky-cloud-wisp-drift" />

          {/* SHOOTING STARS / VỆT SÁNG XẸT NGANG */}
          <div className="sky-shooting-stars" aria-hidden="true">
            <span className="shooting-star star-1" />
            <span className="shooting-star star-2" />
            <span className="shooting-star star-3" />
          </div>

          {/* KHINH KHÍ CẦU BAY LÊN NHẸ NHÀNG */}
          <div className="sky-balloons-group" aria-hidden="true">
            <div className="hot-air-balloon balloon-1">
              <svg viewBox="0 0 32 44" fill="currentColor">
                <path d="M16 0 C7.16 0 0 7.16 0 16 C0 23.5 10 32 12 34 L12 37 L20 37 L20 34 C22 32 32 23.5 32 16 C32 7.16 24.84 0 16 0 Z" fill="#2563eb" opacity="0.85"/>
                <path d="M11 0 C7 4 4 10 4 16 C4 23 12 34 12 34 L14 34 C12 28 8 20 8 16 C8 10 11 3 13 0 Z" fill="#ffffff" opacity="0.6"/>
                <path d="M21 0 C25 4 28 10 28 16 C28 23 20 34 20 34 L18 34 C20 28 24 20 24 16 C24 10 21 3 19 0 Z" fill="#ffffff" opacity="0.6"/>
                <rect x="13" y="39" width="6" height="5" rx="1" fill="#c2410c"/>
                <line x1="13" y1="37" x2="13.5" y2="39" stroke="#94a3b8" strokeWidth="0.8"/>
                <line x1="19" y1="37" x2="18.5" y2="39" stroke="#94a3b8" strokeWidth="0.8"/>
              </svg>
            </div>
            <div className="hot-air-balloon balloon-2">
              <svg viewBox="0 0 32 44" fill="currentColor">
                <path d="M16 0 C7.16 0 0 7.16 0 16 C0 23.5 10 32 12 34 L12 37 L20 37 L20 34 C22 32 32 23.5 32 16 C32 7.16 24.84 0 16 0 Z" fill="#d97706" opacity="0.8"/>
                <path d="M11 0 C7 4 4 10 4 16 C4 23 12 34 12 34 L14 34 C12 28 8 20 8 16 C8 10 11 3 13 0 Z" fill="#fef3c7" opacity="0.6"/>
                <path d="M21 0 C25 4 28 10 28 16 C28 23 20 34 20 34 L18 34 C20 28 24 20 24 16 C24 10 21 3 19 0 Z" fill="#fef3c7" opacity="0.6"/>
                <rect x="13" y="39" width="6" height="5" rx="1" fill="#78350f"/>
              </svg>
            </div>
          </div>

          {/* ĐÀN CHIM DI CƯ BAY THEO ĐỘI HÌNH CHỮ V */}
          <div className="migrating-v-flock" aria-hidden="true">
            <svg viewBox="0 0 140 75" fill="currentColor">
              {/* Leader */}
              <path d="M70 8 C72 5 75 5 77 8 C74 7 72 8 70 10 C68 8 66 7 63 8 C65 5 68 5 70 8 Z" />
              {/* Left wingmen */}
              <path d="M54 20 C56 17 59 17 61 20 C58 19 56 20 54 22 C52 20 50 19 47 20 C49 17 52 17 54 20 Z" opacity="0.9" />
              <path d="M38 32 C40 29 43 29 45 32 C42 31 40 32 38 34 C36 32 34 31 31 32 C33 29 36 29 38 32 Z" opacity="0.8" />
              <path d="M22 44 C24 41 27 41 29 44 C26 43 24 44 22 46 C20 44 18 43 15 44 C17 41 20 41 22 44 Z" opacity="0.7" />
              <path d="M7 56 C9 53 11 53 13 56 C11 55 9 56 7 58 C5 56 4 55 2 56 C3 53 5 53 7 56 Z" opacity="0.6" />
              {/* Right wingmen */}
              <path d="M86 20 C88 17 91 17 93 20 C90 19 88 20 86 22 C84 20 82 19 79 20 C81 17 84 17 86 20 Z" opacity="0.9" />
              <path d="M102 32 C104 29 107 29 109 32 C106 31 104 32 102 34 C100 32 98 31 95 32 C97 29 100 29 102 32 Z" opacity="0.8" />
              <path d="M118 44 C120 41 123 41 125 44 C122 43 120 44 118 46 C116 44 114 43 111 44 C113 41 116 41 118 44 Z" opacity="0.7" />
              <path d="M133 56 C135 53 137 53 139 56 C137 55 135 56 133 58 C132 56 130 55 128 56 C130 53 131 53 133 56 Z" opacity="0.6" />
            </svg>
          </div>

          {/* NHIỀU KIỂU CHIM: BỒ CÂU VÀ CHIM ÉN CHAO LIỆNG */}
          <div className="sky-birds-flock" aria-hidden="true">
            <span className="soaring-bird bird-1">
              <svg viewBox="0 0 24 16" fill="currentColor"><path d="M0 8 C4 3, 8 2, 12 7 C16 2, 20 3, 24 8 C19 6, 15 7, 12 11 C9 7, 5 6, 0 8 Z" /></svg>
            </span>
            <span className="sky-dove dove-1">
              <svg viewBox="0 0 26 18" fill="currentColor"><path d="M1 9 C4 4, 9 2, 13 8 C17 3, 22 4, 25 8 C21 7, 17 8, 13 12 C10 8, 5 7, 1 9 Z M13 12 C14 15, 12 18, 10 18 C11 16, 11 14, 13 12 Z" /></svg>
            </span>
            <span className="soaring-bird bird-2">
              <svg viewBox="0 0 24 16" fill="currentColor"><path d="M0 8 C4 3, 8 2, 12 7 C16 2, 20 3, 24 8 C19 6, 15 7, 12 11 C9 7, 5 6, 0 8 Z" /></svg>
            </span>
            <span className="sky-dove dove-2">
              <svg viewBox="0 0 26 18" fill="currentColor"><path d="M1 9 C4 4, 9 2, 13 8 C17 3, 22 4, 25 8 C21 7, 17 8, 13 12 C10 8, 5 7, 1 9 Z M13 12 C14 15, 12 18, 10 18 C11 16, 11 14, 13 12 Z" /></svg>
            </span>
            <span className="soaring-bird bird-3">
              <svg viewBox="0 0 24 16" fill="currentColor"><path d="M0 8 C4 3, 8 2, 12 7 C16 2, 20 3, 24 8 C19 6, 15 7, 12 11 C9 7, 5 6, 0 8 Z" /></svg>
            </span>
          </div>

          {/* Floating paper airplane */}
          <div className="sky-floating-plane" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>

          {/* 2D DETAILED HANOI SKYLINE (MULTI-DEPTH ARCHITECTURE WITH WINDOWS & SPIRES) */}
          <div className="sky-city-skyline" aria-hidden="true">
            {/* Background Layer: Distant tall towers and broadcast masts */}
            <svg className="skyline-back-layer" viewBox="0 0 1440 240" preserveAspectRatio="none" fill="currentColor">
              <path d="M0 240 L0 190 L30 190 L30 165 L50 165 L50 190 L95 190 L95 140 L100 80 L102 80 L107 140 L115 140 L115 190 L160 190 L160 120 L180 120 L180 190 L240 190 L240 145 L255 145 L255 190 L310 190 L310 110 L315 50 L318 50 L322 110 L345 110 L345 190 L410 190 L410 135 L430 135 L430 190 L490 190 L490 95 L505 95 L508 30 L511 30 L514 95 L530 95 L530 190 L600 190 L600 150 L630 150 L630 190 L690 190 L690 125 L710 125 L710 190 L770 190 L770 100 L775 60 L780 100 L800 100 L800 190 L870 190 L870 140 L900 140 L900 190 L960 190 L960 85 L965 20 L968 20 L972 85 L995 85 L995 190 L1070 190 L1070 130 L1100 130 L1100 190 L1160 190 L1160 115 L1185 115 L1185 190 L1250 190 L1250 140 L1280 140 L1280 190 L1350 190 L1350 155 L1380 155 L1380 190 L1440 190 L1440 240 Z" opacity="0.45" />
            </svg>

            {/* Midground Layer: Detailed 2D cityscape with stepped roofs, Keangnam & Lotte profiles */}
            <svg className="skyline-front-layer" viewBox="0 0 1440 220" preserveAspectRatio="none" fill="currentColor">
              {/* Silhouette outline with varied rooflines */}
              <path d="M0 220 L0 180 L35 180 L35 160 L45 160 L45 150 L60 150 L60 180 L80 180 L80 135 L95 135 L95 125 L108 125 L108 180 L135 180 L135 110 L150 110 L150 95 L158 55 L162 95 L170 110 L195 110 L195 180 L225 180 L225 145 L245 145 L245 135 L260 135 L260 180 L285 180 L285 125 L310 125 L310 180 L345 180 L345 155 L375 155 L375 180 L425 180 L425 115 L445 115 L445 65 L450 25 L455 65 L465 115 L485 115 L485 180 L525 180 L525 140 L555 140 L555 180 L600 180 L600 150 L635 150 L635 180 L685 180 L685 105 L715 105 L715 180 L765 180 L765 130 L795 130 L795 180 L845 180 L845 95 L860 95 L860 35 L865 15 L870 35 L880 95 L900 95 L900 180 L945 180 L945 145 L975 145 L975 180 L1025 180 L1025 120 L1055 120 L1055 180 L1105 180 L1105 155 L1135 155 L1135 180 L1185 180 L1185 125 L1205 125 L1210 75 L1215 50 L1220 75 L1235 125 L1250 125 L1250 180 L1295 180 L1295 145 L1325 145 L1325 180 L1385 180 L1385 160 L1440 160 L1440 220 Z" />
              {/* Window grid perforations across towers */}
              <g className="skyline-window-grids" fill="rgba(255,255,255,0.22)">
                <rect x="85" y="145" width="3" height="4" /><rect x="92" y="145" width="3" height="4" /><rect x="85" y="155" width="3" height="4" /><rect x="92" y="155" width="3" height="4" /><rect x="85" y="165" width="3" height="4" /><rect x="92" y="165" width="3" height="4" />
                <rect x="142" y="125" width="4" height="4" /><rect x="150" y="125" width="4" height="4" /><rect x="142" y="137" width="4" height="4" /><rect x="150" y="137" width="4" height="4" /><rect x="142" y="149" width="4" height="4" /><rect x="150" y="149" width="4" height="4" /><rect x="142" y="161" width="4" height="4" /><rect x="150" y="161" width="4" height="4" />
                <rect x="232" y="155" width="3" height="4" /><rect x="240" y="155" width="3" height="4" /><rect x="232" y="165" width="3" height="4" /><rect x="240" y="165" width="3" height="4" />
                <rect x="435" y="125" width="4" height="4" /><rect x="445" y="125" width="4" height="4" /><rect x="435" y="137" width="4" height="4" /><rect x="445" y="137" width="4" height="4" /><rect x="435" y="149" width="4" height="4" /><rect x="445" y="149" width="4" height="4" /><rect x="435" y="161" width="4" height="4" /><rect x="445" y="161" width="4" height="4" />
                <rect x="695" y="120" width="4" height="4" /><rect x="704" y="120" width="4" height="4" /><rect x="695" y="132" width="4" height="4" /><rect x="704" y="132" width="4" height="4" /><rect x="695" y="144" width="4" height="4" /><rect x="704" y="144" width="4" height="4" /><rect x="695" y="156" width="4" height="4" /><rect x="704" y="156" width="4" height="4" />
                <rect x="852" y="105" width="4" height="4" /><rect x="862" y="105" width="4" height="4" /><rect x="852" y="117" width="4" height="4" /><rect x="862" y="117" width="4" height="4" /><rect x="852" y="129" width="4" height="4" /><rect x="862" y="129" width="4" height="4" /><rect x="852" y="141" width="4" height="4" /><rect x="862" y="141" width="4" height="4" /><rect x="852" y="153" width="4" height="4" /><rect x="862" y="153" width="4" height="4" /><rect x="852" y="165" width="4" height="4" /><rect x="862" y="165" width="4" height="4" />
                <rect x="1032" y="135" width="3" height="4" /><rect x="1040" y="135" width="3" height="4" /><rect x="1032" y="147" width="3" height="4" /><rect x="1040" y="147" width="3" height="4" /><rect x="1032" y="159" width="3" height="4" /><rect x="1040" y="159" width="3" height="4" />
                <rect x="1195" y="140" width="4" height="4" /><rect x="1205" y="140" width="4" height="4" /><rect x="1195" y="152" width="4" height="4" /><rect x="1205" y="152" width="4" height="4" /><rect x="1195" y="164" width="4" height="4" /><rect x="1205" y="164" width="4" height="4" />
              </g>
            </svg>

            {/* Red Aviation Warning Beacons on Tall Spires */}
            <span className="skyline-beacon beacon-1" style={{ left: '11.2%', bottom: '168px' }} />
            <span className="skyline-beacon beacon-2" style={{ left: '31.2%', bottom: '198px' }} />
            <span className="skyline-beacon beacon-3" style={{ left: '60.1%', bottom: '208px' }} />
            <span className="skyline-beacon beacon-4" style={{ left: '84.4%', bottom: '172px' }} />
          </div>

          {/* BOTTOM ATMOSPHERIC EFFECTS */}
          <div className="sky-mountain-mist-breath" />
          <div className="sky-horizon-amber-glow" />
        </div>
      </div>
      <div className="reading-progress" aria-hidden="true"><div ref={progressLine} /></div>
      <header className="site-header">
        <button className="brand" onClick={() => goTo(0)} aria-label="CLB Nghiên cứu Thị trường Bất động sản, Trường Đại học Ngoại Thương – về đầu hành trình">
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
        {chapters.map((story, panelIndex) => <section id={`story-${panelIndex}`} key={story.id} className={`story-layer chapter-${story.id} ${chapter === panelIndex ? 'active' : ''} ${panelIndex < chapter ? 'is-passed' : ''} ${panelIndex > chapter ? 'is-upcoming' : ''}`} aria-label={story.name}>
        {(mobileLayout || isContinuousScroll || chapter === panelIndex) && <div className="chapter-content"><div className="chapter-copy">
          {story.id === 'orbit' && <>
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
                  <div className="sticky-item note-vong-don">
                    <img src={noteVongDon} alt="Vòng Đơn: 01/10 - 20/10" />
                    <span><strong>VÒNG ĐƠN</strong><small>01/10 – 20/10</small></span>
                  </div>
                  <div className="sticky-item note-vong-dgnl">
                    <img src={noteVongDgnl} alt="Vòng Đánh giá năng lực: 23/10 - 24/10" />
                    <span><strong>ĐÁNH GIÁ<br />NĂNG LỰC</strong><small>23/10 – 24/10</small></span>
                  </div>
                  <div className="sticky-item note-vong-teamwork">
                    <img src={noteVongTeamwork} alt="Vòng Teamwork: 26/10 - 01/11" />
                    <span><strong>VÒNG<br />TEAMWORK</strong><small>26/10 – 01/11</small></span>
                  </div>
                  <div className="sticky-item note-vong-tnpv">
                    <img src={noteVongTnpv} alt="Vòng Trải nghiệm & Phỏng vấn: 02/11 - 10/11" />
                    <span><strong>TRẢI NGHIỆM<br />& PV</strong><small>02/11 – 10/11</small></span>
                  </div>
                </div>
              </div>
              <div className="hero-visual-col">
                <div className="hero-poster-frame">
                  <img {...displayImageProps(gen16Cover)} alt="Bộ nhận diện Gen 16 REC - ROAD Về Nhà" className="hero-poster-img" />
                </div>
              </div>
            </div>
          </>}
          {story.id === 'vietnam' && <>
            <div className="ftu-showcase-layout">
              <div className="ftu-text-side">
                <p className="eyebrow"><span /> {story.tag}</p>
                <h2>Hà Nội.<br />Ngoại Thương.<br /><em>REC Là Nhà.</em></h2>
                <p className="chapter-description">Mỗi người đến Ngoại Thương từ một điểm xuất phát khác nhau. Ở REC, những cuộc gặp bình thường dần thành tình bạn và một nơi để gọi là nhà.</p>
                <div className="location-card"><span className="location-symbol">↗</span><div><strong>CLB Nghiên cứu Thị trường Bất động sản</strong><p>Trường Đại học Ngoại Thương</p><small>91 Chùa Láng, Phường Láng, Hà Nội</small></div></div>
                <div className="story-links"><button className="button story-read-btn" onClick={() => setSelection({ type: 'story' })}><span className="btn-sparkle" aria-hidden="true">✨</span><span>Đọc câu chuyện REC</span> <Arrow /></button><button className="button secondary" onClick={() => goTo(2)}>Khám phá Dấu ấn REC <Arrow /></button></div>
              </div>
              <div className="ftu-image-side">
                <div className="ftu-photo-frame">
                  <img src={ftuCampusImage} alt="Trường Đại học Ngoại Thương Hà Nội" className="ftu-photo" loading="lazy" decoding="async" />
                  <div className="ftu-photo-badge">TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG · 91 CHÙA LÁNG</div>
                </div>
              </div>
            </div>
          </>}
          {story.id === 'activities' && (
            <div className="activity-split-layout">
              <div className="activity-text-side">
                <p className="eyebrow"><span /> {story.tag}</p>
                <h2>Chuyện tụi mình<br /><em>đã cùng làm.</em></h2>
                <p className="chapter-description">
                  Từ những buổi học học thuật, thử thách giải mật mã đến những chuyến đi xa – mỗi dịp lại có thêm chuyện vui để nhớ.
                </p>

                <div key={activeActivity.id} className={`activity-feature-card activity-slide-${activityDir > 0 ? 'next' : 'prev'}`}>
                  <div className="activity-feature-top">
                    <span className="activity-cat-badge">
                      {activeActivity.scale ? 'HOẠT ĐỘNG NGOẠI BỘ' : 'GẮN KẾT NỘI BỘ'}
                    </span>
                    <span className="activity-count-badge">
                      {String(activityIndex + 1).padStart(2, '0')} / {String(activities.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="activity-card-title">{activeActivity.name}</h3>
                  <p className="activity-card-tagline">{activeActivity.tag}</p>
                  <p className="activity-card-desc">{activeActivity.desc}</p>
                  {activeActivity.scale && (
                    <div className="activity-card-scale">
                      <span><strong>Quy mô:</strong> {activeActivity.scale}</span>
                    </div>
                  )}
                  <div className="activity-card-cta-row">
                    <button
                      className="button primary activity-open-modal-btn"
                      onClick={() => setSelection({ type: 'activity', index: activityIndex })}
                    >
                      Xem chi tiết câu chuyện <Arrow />
                    </button>
                    <button className="button secondary" onClick={() => goTo(3)}>
                      Khám phá The Real Contest <Arrow />
                    </button>
                  </div>
                </div>
              </div>

              <div className="activity-visual-side">
                <div className="activity-showcase-box">
                  <div
                    key={activeActivity.id}
                    className={`activity-main-photo-frame activity-slide-${activityDir > 0 ? 'next' : 'prev'}`}
                    onClick={() => setSelection({ type: 'activity', index: activityIndex })}
                    title={`Bấm để xem chi tiết: ${activeActivity.name}`}
                  >
                    <img
                      {...displayImageProps(activeActivity.image)}
                      alt={activeActivity.name}
                      className="activity-main-photo"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="activity-strip-controls">
                    <div className="activity-strip-thumbnails">
                      {activities.map((item, i) => (
                        <button
                          key={item.id}
                          className={`activity-thumb-btn ${i === activityIndex ? 'active' : ''}`}
                          onClick={() => goActivity(i)}
                          aria-label={`Xem hoạt động ${item.name}`}
                          title={item.name}
                        >
                          <img src={item.image} alt={item.name} loading="eager" decoding="async" />
                          <span className="thumb-num">{String(i + 1).padStart(2, '0')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {story.id === 'the-real-contest' && (
            <div className="contest-showcase-layout">
              <div className="contest-text-side">
                <p className="eyebrow"><span /> {story.tag}</p>
                <h2>The Real<br /><em>Contest.</em></h2>
                <div className="contest-badge-line">
                  <span className="contest-pill">CUỘC THI TOÀN QUỐC</span>
                  <span className="contest-host">ĐẤU TRƯỜNG BẤT ĐỘNG SẢN · REC FTU</span>
                </div>
                <p className="chapter-description">
                  The Real Contest là cuộc thi học thuật về Bất động sản thường niên do REC FTU tổ chức dành cho sinh viên trên cả nước. Nơi các bạn trẻ cùng nhau thử sức giải quyết những bài toán thị trường thực tế từ doanh nghiệp, học hỏi từ các chuyên gia đầu ngành và tìm thấy những người đồng đội chung đam mê.
                </p>
                <div className="contest-points-grid">
                  <div className="contest-point-card">
                    <span className="point-index">01</span>
                    <div className="point-info">
                      <strong>Giải quyết bài toán thị trường thực tế</strong>
                      <p>Trực tiếp phân tích số liệu, định vị dự án và xây dựng giải pháp kinh doanh toàn diện dưới sự cố vấn chuyên môn từ các chuyên gia và doanh nghiệp.</p>
                    </div>
                  </div>
                  <div className="contest-point-card">
                    <span className="point-index">02</span>
                    <div className="point-info">
                      <strong>Thử thách bản lĩnh & Kết nối đồng đội</strong>
                      <p>Tranh tài tại Đêm Chung kết, mở rộng kết nối với mạng lưới cựu thành viên REC và đón nhận những cơ hội thực tập, phát triển nghề nghiệp.</p>
                    </div>
                  </div>
                </div>
                <div className="contest-actions">
                  <a className="button primary cta-pulse" href="https://www.facebook.com/TRC.RECFTU" target="_blank" rel="noopener noreferrer">
                    Ghé thăm Fanpage The Real Contest <Arrow />
                  </a>
                  <button className="button secondary" onClick={() => goTo(4)}>
                    Khám phá Bốn ban REC <Arrow />
                  </button>
                </div>
              </div>
              <div className="contest-visual-side">
                <div className="contest-photo-stack">
                  <div className="contest-main-frame">
                    <img {...displayImageProps(contestImage)} alt="Đêm Chung kết The Real Contest của REC FTU" className="contest-main-photo" loading="lazy" />
                    <div className="contest-photo-badge">
                      <span className="badge-dot" />
                      <strong>ĐÊM CHUNG KẾT · THE REAL CONTEST</strong>
                    </div>
                  </div>
                  <div className="contest-floating-card">
                    <img {...displayImageProps(contestEveningImg)} alt="Khoảnh khắc vinh danh The Real Contest" className="contest-inset-photo" loading="lazy" />
                    <div className="contest-inset-copy">
                      <span className="contest-sub-tag">KHOẢNH KHẮC CHIẾN THẮNG</span>
                      <strong>Hành trình bản lĩnh & tự hào</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {story.id === 'departments' && <>
            <div className="department-split-layout">
              <div className="department-left-side">
                <p className="eyebrow"><span /> {story.tag}</p>
                <h2>Bốn ban.<br /><em>Có em trong đội.</em></h2>
                <p className="chapter-description">Em thích tìm hiểu, sáng tạo, kết nối hay tổ chức? Tụi mình có một chỗ dành cho em.</p>
                <div className="department-list">{departments.map((department, i) => <button key={department.id} className={departmentIndex === i ? 'selected' : ''} aria-pressed={departmentIndex === i} onClick={() => setDepartmentIndex(i)}><span className="mono">{department.number}</span><div><strong>{department.short}</strong><small>{department.line}</small></div><span aria-hidden="true">{departmentIndex === i ? '' : '↗'}</span></button>)}</div>
                <button className="department-details" onClick={() => setSelection({ type: 'department', index: departmentIndex })}>Tìm hiểu về ban {departments[departmentIndex].short} <Arrow /></button>
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
          {story.id === 'join' && <>
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
                </div>
              </div>
              <div className="join-grid-extra">
                <div className="join-unified-info-card">
                  <RegistrationCountdown />
                  <div className="join-card-divider" />
                  {/* Visualized Recruitment Roadmap Diagram */}
                  <div className="recruitment-roadmap-card">
                    <div className="roadmap-header">
                      <span className="roadmap-badge">LỊCH TRÌNH 4 VÒNG TUYỂN</span>
                      <span className="roadmap-deadline">HẠN ĐƠN: 23:59 · 20/10</span>
                    </div>
                    <div className="roadmap-stepper">
                      <div className="roadmap-step is-active">
                        <div className="step-track">
                          <span className="step-dot">01</span>
                          <span className="step-line" />
                        </div>
                        <div className="step-info">
                          <div className="step-head">
                            <strong className="step-title">VÒNG ĐƠN</strong>
                            <span className="step-tag live">ĐANG MỞ</span>
                            <span className="step-dates">01/10 – 20/10</span>
                          </div>
                          <p className="step-desc">Điền đơn online & kể cho REC nghe câu chuyện của em</p>
                        </div>
                      </div>

                      <div className="roadmap-step">
                        <div className="step-track">
                          <span className="step-dot">02</span>
                          <span className="step-line" />
                        </div>
                        <div className="step-info">
                          <div className="step-head">
                            <strong className="step-title">ĐÁNH GIÁ NĂNG LỰC</strong>
                            <span className="step-dates">23/10 – 24/10</span>
                          </div>
                          <p className="step-desc">Bài test tư duy và kiến thức nền tảng</p>
                        </div>
                      </div>

                      <div className="roadmap-step">
                        <div className="step-track">
                          <span className="step-dot">03</span>
                          <span className="step-line" />
                        </div>
                        <div className="step-info">
                          <div className="step-head">
                            <strong className="step-title">TEAMWORK</strong>
                            <span className="step-dates">26/10 – 01/11</span>
                          </div>
                          <p className="step-desc">Thử thách đồng đội thực chiến & giải case BĐS</p>
                        </div>
                      </div>

                      <div className="roadmap-step">
                        <div className="step-track">
                          <span className="step-dot">04</span>
                        </div>
                        <div className="step-info">
                          <div className="step-head">
                            <strong className="step-title">TRẢI NGHIỆM & PHỎNG VẤN</strong>
                            <span className="step-dates">02/11 – 10/11</span>
                          </div>
                          <p className="step-desc">Phỏng vấn trực tiếp & chính thức về Nhà REC</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}
        </div></div>}
        </section>)}
      </main>

      {/* Single-Box Corner Navigation Widget (Bottom-Left) */}
      <div className="corner-chapter-widget">
        <button
          className="widget-chapter-box"
          onClick={() => goTo((chapter + 1) % chapters.length)}
          aria-label={`Chặng 0${chapter + 1}: ${chapters[chapter].name}. Bấm để chuyển sang chặng tiếp theo`}
          title={`Chặng 0${chapter + 1}: ${chapters[chapter].name} (Bấm để chuyển chặng)`}
        >
          <span className="widget-step-number">0{chapter + 1}</span>
          <span className="widget-icon-wrap"><ChapterIcon index={chapter} /></span>
          <span className="widget-step-title">{chapters[chapter].name}</span>
          <span className="widget-next-indicator">↗</span>
        </button>
      </div>

      {/* Desktop Navigation Guidance HUD */}
      <div className="desktop-hud-controls">
        <div className="desktop-nav-hint" aria-hidden="true" title="Dùng ↑ ↓ đổi chặng, ← → đổi nội dung">
          <span className="hint-keys"><kbd>↑</kbd><kbd>↓</kbd></span>
          <span className="hint-sep">·</span>
          <span className="hint-keys"><kbd>←</kbd><kbd>→</kbd></span>
        </div>
      </div>

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

    {/* Full Site Footer (Accessible via toggle handle or bottom hover on desktop, static at bottom on mobile) */}
    <footer
      className={`site-footer ${showPeekFooter ? 'is-peeked' : ''}`}
      onMouseLeave={() => setShowPeekFooter(false)}
      role="contentinfo"
      aria-label="Thông tin liên hệ và chân trang REC FTU"
    >
      <div className="footer-inner">
        <div className="footer-about">
          <p className="footer-eyebrow">REC · FTU</p>
          <h2>Nhà REC luôn có <em>chỗ cho em.</em></h2>
          <p>CLB Nghiên cứu Thị trường Bất động sản<br />Trường Đại học Ngoại thương Hà Nội</p>
        </div>
        <div className="footer-contact">
          <h3>TÌM TỤI MÌNH</h3>
          <p>Ô số 38, 91 Chùa Láng, Phường Láng, Hà Nội</p>
          <a href="mailto:rec@ftu.edu.vn" className="footer-mail-link">rec@ftu.edu.vn</a>
          <nav aria-label="Kênh liên lạc REC">
            <a href="https://www.facebook.com/FTU.REC/" target="_blank" rel="noreferrer">Facebook REC FTU <Arrow /></a>
            <a href="https://www.facebook.com/TRC.RECFTU" target="_blank" rel="noreferrer">The Real Contest <Arrow /></a>
            <a href="https://www.tiktok.com/@rec.ftu" target="_blank" rel="noreferrer">TikTok @rec.ftu <Arrow /></a>
            <a href="https://www.tiktok.com/@timnhacungban.findx" target="_blank" rel="noreferrer">Tìm Nhà Cùng Bạn <Arrow /></a>
          </nav>
        </div>
        <div className="footer-brand">
          <img src={recLogoUrl} alt="Logo REC FTU" />
          <a className="button primary cta-pulse" href={recruitmentUrl} target="_blank" rel="noreferrer">ĐIỀN ĐƠN NGAY <Arrow /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CLB Nghiên cứu Thị trường Bất động sản REC FTU — GEN 16 · ROAD</span>
        <span>Vì REC Là Nhà · @Design by Spotlighterr</span>
      </div>
    </footer>

    {selection && <Detail selection={selection} onClose={() => setSelection(null)} />}
  </>;
}
