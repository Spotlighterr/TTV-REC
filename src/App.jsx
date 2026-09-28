import React, { useCallback, useEffect, useRef, useState } from 'react';
import RecWorld from './rec-world.jsx';
import { chapters, activities, departments, internalActivities, timeline, recruitmentUrl } from './content';

const Arrow = () => <span aria-hidden="true">↗</span>;

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
  const item = isDept ? departments[selection.index] : activities[selection.index || 0];
  return <dialog ref={dialog} className={`detail-dialog ${isTimeline ? 'timeline-dialog' : ''}`} onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} aria-labelledby="detail-title">
    <div className="detail-shell">
      <button className="close-button" onClick={onClose} aria-label="Đóng chi tiết">✕</button>
      {!isDept && !isTimeline && <img className="detail-image" src={item.image} alt={item.name} />}
      <div className="detail-body">
        <p className="eyebrow">{isTimeline ? 'HÀNH TRÌNH ĐẾN NHÀ REC' : isDept ? `MẢNH GHÉP ${item.number} / REC FTU` : 'NHẬT KÝ NHÀ REC'}</p>
        <h2 id="detail-title">{isTimeline ? 'Một hành trình. Bốn chặng.' : isDept ? item.title : item.name}</h2>
        {isTimeline ? <>
          <ol className="recruitment-timeline">{timeline.map(([title, description], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
          <p className="detail-note">Lịch tuyển và đường dẫn nộp đơn được cập nhật trên fanpage REC FTU.</p>
          <a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Mở thông tin tuyển thành viên <Arrow /></a>
        </> : isDept ? <>
          <p className="detail-tag">{item.tag}</p>
          {[['Bạn sẽ làm gì?', item.tasks], ['Điều REC tìm kiếm', item.requirements], ['Điều bạn mang về', item.benefits]].map(([title, lines]) => <section key={title}><h3>{title}</h3><ul>{lines.map(line => <li key={line}>{line}</li>)}</ul></section>)}
          <a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Tìm hiểu ứng tuyển <Arrow /></a>
        </> : <>
          <p className="detail-tag">{item.tag}</p><p>{item.desc}</p>
          {selection.index === 4 && <div className="internal-activities">{internalActivities.map(activity => <section key={activity.id}><h3>{activity.name}</h3><p>{activity.desc}</p></section>)}</div>}
        </>}
      </div>
    </div>
  </dialog>;
}

export default function App() {
  const [chapter, setChapter] = useState(0);
  const [selection, setSelection] = useState(null);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [activityIndex, setActivityIndex] = useState(0);
  const [departmentIndex, setDepartmentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useRef(0);
  const targetProgress = useRef(0);
  const scrollRange = useRef(1);
  const progressLine = useRef(null);
  const pinRef = useRef(null);
  const sceneState = useRef({ paused, modal: false, activity: 0 });
  sceneState.current = { ...sceneState.current, paused, modal: !!selection, activity: activityIndex, department: departmentIndex };

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
        scrollRange.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        measured = true; update(); return;
      }
      const preserved = targetProgress.current; resizing = true;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        scrollRange.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        measuredHeight = window.innerHeight;
        window.scrollTo({ top: preserved * scrollRange.current / 4, behavior: 'instant' });
        targetProgress.current = preserved; resizing = false;
      });
    };
    let frame, last = performance.now(), displayedChapter = -1;
    const advance = now => {
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      const distance = targetProgress.current - progress.current;
      progress.current += distance * (sceneState.current.paused ? 1 : 1 - Math.exp(-dt * 11));
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
    if (index != null) requestAnimationFrame(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * index / 4));
  }, []);
  useEffect(() => { history.replaceState(null, '', `#${chapters[chapter].id}`); }, [chapter]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = event => setPaused(event.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  const activeActivity = activities[activityIndex];
  return <>
    <div className="scroll-track" aria-hidden="true" />
    <div className={`experience chapter-${chapter} ${ready ? 'is-ready' : ''} ${paused ? 'is-paused' : ''}`}>
      <a href="#chapter-content" className="skip-link">Đến nội dung</a>
      {!failure && <RecWorld progress={progress} state={sceneState} pinRef={pinRef} onReady={onReady} onFailure={onFailure} onPick={onPick} />}
      {failure && <div className="fallback-planet" aria-hidden="true" />}
      <div className="scene-shade" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true"><div ref={progressLine} /></div>
      <header className="site-header">
        <button className="brand" onClick={() => goTo(0)} aria-label="REC FTU, về đầu hành trình"><span className="brand-symbol" aria-hidden="true">R<span>↗</span></span><span className="brand-name">REC<span>FTU · GEN 16</span></span></button>
        <div className="header-coordinate"><span className="status-dot" /> HÀ NỘI, VIỆT NAM <span className="coordinate-value">21°01′ N / 105°51′ E</span></div>
        <div className="header-actions">
          <button className={`motion-toggle ${paused ? 'is-off' : ''}`} aria-pressed={paused} onClick={() => setPaused(value => !value)} aria-label={paused ? 'Bật chuyển động' : 'Giảm chuyển động'} title={paused ? 'Bật chuyển động' : 'Giảm chuyển động'}>{paused && <small>Bật hiệu ứng</small>}{paused ? '▷' : 'Ⅱ'}</button>
          <button className="join-nav" onClick={() => goTo(4)}>GIA NHẬP REC <Arrow /></button>
          <button className="menu-toggle" aria-label="Mở điều hướng" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </header>

      <button ref={pinRef} className="geo-label" tabIndex={chapter <= 1 ? 0 : -1} aria-hidden={chapter > 1} onClick={() => goTo(1)} aria-label="Khám phá Việt Nam và Nhà REC tại Hà Nội"><span className="geo-cross" /><span><small>ĐIỂM ĐẾN CỦA CHÚNG TA</small><strong>HÀ NỘI, VIỆT NAM <span>↗</span></strong><em>21.0285° N · 105.8542° E</em></span></button>

      <main id="chapter-content" className="story-stage" tabIndex={-1}>
        {chapters.map((story, panelIndex) => <section key={story.id} className={`story-layer chapter-${panelIndex} ${chapter === panelIndex ? 'active' : ''}`} inert={chapter !== panelIndex} aria-hidden={chapter !== panelIndex}>
        <div className="chapter-content"><div className="chapter-copy">
          <p className="eyebrow"><span /> {story.tag}</p>
          {panelIndex === 0 && <>
            <h1>Thế giới rộng.<br />Mình <em>đi cùng.</em></h1>
            <p className="chapter-description">Một điểm trên bản đồ.<br />Một thế giới đang chờ bạn khám phá.<br />Một mái nhà mang tên REC.</p>
            <button className="button primary" onClick={() => goTo(1)}>Bắt đầu hành trình <Arrow /></button>
            <p className="micro-note"><span className="mini-orbit" /> Kéo địa cầu để xoay · Chạm Hà Nội để đến gần</p>
          </>}
          {panelIndex === 1 && <>
            <h2>Việt Nam.<br />Hà Nội.<br /><em>Nhà REC.</em></h2>
            <p className="chapter-description">Từ 91 Chùa Láng, những người trẻ cùng học, cùng làm và cùng mở rộng góc nhìn về bất động sản.</p>
            <div className="location-card"><span className="location-symbol">↗</span><div><strong>ĐẠI HỌC NGOẠI THƯƠNG</strong><p>CLB Nghiên cứu Thị trường Bất động sản</p><small>91 Chùa Láng · Hà Nội</small></div></div>
            <button className="text-link" onClick={() => goTo(2)}>Gặp những điều làm nên Nhà REC <Arrow /></button>
          </>}
          {panelIndex === 2 && <>
            <h2>Những dấu ấn<br /><em>cùng tạo nên.</em></h2>
            <p className="chapter-description">Học từ thực tế. Làm bằng đam mê.<br />Và mang về những người bạn đồng hành.</p>
            <div className="activity-preview" key={activityIndex}>
              <span className="mono">0{activityIndex + 1} / 05</span>
              <h3>{activeActivity.name}</h3><p>{activeActivity.tag}</p>
              <button className="text-link" onClick={() => setSelection({ type: 'activity', index: activityIndex })}>Mở câu chuyện <Arrow /></button>
            </div>
            <div className="activity-controls"><button aria-label="Hoạt động trước" onClick={() => setActivityIndex(index => (index + 4) % 5)}>←</button><div>{activities.map((item, i) => <button key={item.id} className={i === activityIndex ? 'active' : ''} aria-label={item.name} aria-pressed={i === activityIndex} onClick={() => setActivityIndex(i)} />)}</div><button aria-label="Hoạt động tiếp" onClick={() => setActivityIndex(index => (index + 1) % 5)}>→</button></div>
          </>}
          {panelIndex === 3 && <>
            <h2>Bốn ban.<br />Một <em>đội hình.</em></h2>
            <p className="chapter-description">Chọn nơi bạn muốn bắt đầu.<br />Mỗi vai trò mở ra một cách đóng góp.</p>
            <div className="department-list">{departments.map((department, i) => <button key={department.id} className={departmentIndex === i ? 'selected' : ''} aria-pressed={departmentIndex === i} onClick={() => setDepartmentIndex(i)}><span className="mono">{department.number}</span><div><strong>{department.short}</strong><small>{department.line}</small></div><span aria-hidden="true">{departmentIndex === i ? '●' : '↗'}</span></button>)}</div>
            <button className="text-link department-details" onClick={() => setSelection({ type: 'department', index: departmentIndex })}>Khám phá ban {departments[departmentIndex].short} <Arrow /></button>
          </>}
          {panelIndex === 4 && <>
            <p className="join-kicker">TUYỂN THÀNH VIÊN · GEN 16</p>
            <h2>Quỹ đạo mới.<br /><em>Có bạn.</em></h2>
            <p className="chapter-description">Không cần biết hết mọi điều để bắt đầu.<br />Chỉ cần bạn sẵn sàng bước tới. REC sẽ đi cùng.</p>
            <div className="join-actions"><a className="button primary" href={recruitmentUrl} target="_blank" rel="noreferrer">Thông tin ứng tuyển <Arrow /></a><button className="button secondary" onClick={() => setSelection({ type: 'timeline' })}>Lộ trình tuyển thành viên <span>＋</span></button></div>
            <p className="micro-note">Lịch tuyển và link nộp đơn được cập nhật tại fanpage REC FTU.</p>
          </>}
        </div></div>
        </section>)}
      </main>

      {chapter === 3 && <div className="model-console"><div><span className="model-index">0{departmentIndex + 1} / 04</span><strong>{departments[departmentIndex].short}</strong><small>Kéo để xoay · Bấm mô hình để xem chi tiết</small></div><div className="model-switch"><button aria-label="Mô hình trước" onClick={() => setDepartmentIndex(index => (index + 3) % 4)}>←</button><button aria-label="Mô hình tiếp" onClick={() => setDepartmentIndex(index => (index + 1) % 4)}>→</button></div></div>}

      <aside className="scene-caption" aria-hidden="true">
        <div className="scene-data"><svg className="radar-glyph" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="24" /><circle cx="28" cy="28" r="15" /><path d="M28 1v54M1 28h54" /><g className="radar-hand"><path d="M28 28L45 11" /></g><circle className="radar-point" cx="37" cy="17" r="2" /><circle className="radar-center" cx="28" cy="28" r="2" /></svg><div><small>{['ĐIỂM HẸN', 'TỪ VIỆT NAM', 'REC ARCHIVE', 'CÙNG MỘT QUỸ ĐẠO', 'HẸN GẶP BẠN'][chapter]}</small><strong>{['Hà Nội, Việt Nam', '91 Chùa Láng', '05 câu chuyện', '04 mảnh ghép', 'Nhà REC'][chapter]}</strong><span>{['21.0285° N · 105.8542° E', 'Đại học Ngoại thương', 'Học · Làm · Gắn kết', 'Chọn ban để khám phá', 'Thế hệ tiếp theo'][chapter]}</span></div></div>
        <div className="caption-rule" /><p>{['Góc nhìn lớn. Khởi đầu nhỏ.', 'Mọi kết nối đều có một điểm bắt đầu.', 'Những khoảnh khắc trở thành chúng ta.', 'Khác biệt để cùng nhau tiến xa.', 'Hẹn gặp bạn ở Nhà REC.'][chapter]}</p>
      </aside>

      <footer className="journey-footer">
        <div className="journey-intro"><span className="scroll-mouse" aria-hidden="true" /><span>CUỘN ĐỂ<br /><strong>ĐỔI GÓC NHÌN</strong></span></div>
        <nav className="chapter-nav" aria-label="Các chặng hành trình">{chapters.map((item, i) => <button key={item.id} className={i === chapter ? 'active' : ''} aria-current={i === chapter ? 'step' : undefined} onClick={() => goTo(i)}><span>0{i + 1}</span><strong>{item.name}</strong><i /></button>)}</nav>
        <span className="journey-count"><strong>0{chapter + 1}</strong><span> / 05</span></span>
      </footer>
      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} inert={!menuOpen} aria-label="Điều hướng di động">{chapters.map((item, i) => <button key={item.id} onClick={() => goTo(i)}><span>0{i + 1}</span>{item.name}<Arrow /></button>)}</nav>
      {!ready && <div className="loading-scene" role="status"><span className="loading-ring" /><p>Đang mở một góc nhìn mới…</p></div>}
      {failure && <p className="scene-fallback-note" role="status">Chế độ nhẹ — bạn vẫn có thể khám phá đầy đủ các chặng.</p>}
    </div>
    {selection && <Detail selection={selection} onClose={() => setSelection(null)} />}
  </>;
}
