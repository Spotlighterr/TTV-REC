/**
 * REC FTU GEN 16: JAVASCRIPT CONTROLLER
 * Complies with Apple HIG, Antislop (zero em dash, high accessibility) and Ponytail (Native JS)
 */

(function () {
  'use strict';

  // --- Department JD Data ---
  const DEPARTMENTS_DATA = {
    'chuyen-mon': {
      title: 'Ban Chuyên môn',
      tag: 'Khối Học thuật & Nghiên cứu',
      tasks: [
        'Nghiên cứu và tổng hợp báo cáo chuyên sâu về các phân khúc thị trường bất động sản.',
        'Phân tích case study kinh doanh và trực tiếp biên soạn đề thi học thuật cho The Real Contest.',
        'Cố vấn nội dung cho các chuỗi bài viết kiến thức và cẩm nang bất động sản của câu lạc bộ.',
        'Tham gia các buổi đào tạo chuyên môn định kỳ cùng cố vấn và cựu thành viên giàu kinh nghiệm.'
      ],
      requirements: [
        'Sinh viên Đại học Ngoại thương và các trường khối kinh tế yêu thích bất động sản và tài chính.',
        'Tư duy logic, khả năng tìm kiếm, chọn lọc và tổng hợp tài liệu tiếng Việt và tiếng Anh tốt.',
        'Tinh thần chủ động học hỏi, cẩn trọng, cầu tiến và có trách nhiệm cao với tiến độ công việc.'
      ],
      benefits: [
        'Được đào tạo bài bản tư duy phân tích thị trường từ các anh chị đang công tác tại các tập đoàn lớn.',
        'Cọ xát với các bài toán thực tế của doanh nghiệp thông qua việc biên soạn đề thi học thuật.',
        'Môi trường học thuật nghiêm túc, rèn luyện tư duy phản biện và khả năng trình bày quan điểm.'
      ]
    },
    'truyen-thong': {
      title: 'Ban Truyền thông',
      tag: 'Khối Sáng tạo & Media',
      tasks: [
        'Lên chiến lược và triển khai kế hoạch truyền thông cho kỳ tuyển thành viên và các cuộc thi lớn.',
        'Sáng tạo nội dung bài viết (Content Strategy) cho Fanpage chính thức REC FTU và các kênh vệ tinh.',
        'Thiết kế bộ nhận diện hình ảnh, poster, ấn phẩm đồ họa sự kiện (Graphic Design).',
        'Sản xuất video ngắn, quay chụp tư liệu sự kiện và quản trị tương tác trên mạng xã hội.'
      ],
      requirements: [
        'Thế mạnh về viết lách, tư duy ngôn từ tốt hoặc có năng khiếu về thẩm mỹ, thiết kế hình ảnh, video.',
        'Sử dụng được các công cụ thiết kế cơ bản đến nâng cao (Photoshop, Illustrator, Canva, Premiere, CapCut).',
        'Nhanh nhạy với xu hướng truyền thông sinh viên, có tinh thần phối hợp nhóm nhịp nhàng.'
      ],
      benefits: [
        'Rèn luyện kỹ năng xây dựng chiến dịch truyền thông thực chiến với quy mô tiếp cận lớn.',
        'Xây dựng Portfolio cá nhân chất lượng với các sản phẩm được phát hành chính thức.',
        'Tự do hiện thực hóa các ý tưởng sáng tạo trong không gian làm việc cởi mở.'
      ]
    },
    'doi-ngoai': {
      title: 'Ban Đối ngoại',
      tag: 'Khối Quan hệ Đối tác & Tài trợ',
      tasks: [
        'Tìm kiếm, phân loại và tiếp cận các doanh nghiệp, tập đoàn bất động sản tiềm năng.',
        'Soạn thảo hồ sơ mời tài trợ (Proposal), đàm phán quyền lợi và hỗ trợ ký kết hợp đồng hợp tác.',
        'Kết nối và làm việc cùng các diễn giả, chuyên gia hàng đầu trong ngành bất động sản.',
        'Duy trì mối quan hệ bền vững với các đơn vị bảo trợ truyền thông và câu lạc bộ bạn.'
      ],
      requirements: [
        'Tác phong chỉn chu, đĩnh đạc, khả năng giao tiếp, lắng nghe và thuyết phục tốt.',
        'Kỹ năng soạn thảo văn bản, email thương mại cẩn trọng và chuẩn mực.',
        'Năng động, tự tin và kiên trì khi làm việc cùng đối tác doanh nghiệp.'
      ],
      benefits: [
        'Cơ hội gặp gỡ và làm việc trực tiếp với đại diện doanh nghiệp, chuyên gia bất động sản uy tín.',
        'Trui rèn kỹ năng đàm phán, xử lý tình huống và phong thái làm việc chuyên nghiệp.',
        'Xây dựng mạng lưới quan hệ (Networking) giá trị cho lộ trình nghề nghiệp tương lai.'
      ]
    },
    'to-chuc': {
      title: 'Ban Tổ chức',
      tag: 'Khối Vận hành & Nhân sự',
      tasks: [
        'Lập kế hoạch chi tiết, điều phối timeline và trực tiếp vận hành các sự kiện lớn nhỏ của REC.',
        'Quản lý ngân sách, chuẩn bị cơ sở vật chất, hậu cần kỹ thuật và phòng chống rủi ro sự kiện.',
        'Quản trị nhân sự nội bộ, theo dõi tiến độ và đánh giá mức độ đóng góp của các thành viên.',
        'Tổ chức các hoạt động gắn kết văn hóa, bonding, dã ngoại và sinh hoạt nội bộ của CLB.'
      ],
      requirements: [
        'Nhanh nhẹn, tháo vát, chu đáo và có khả năng bao quát công việc tốt.',
        'Bình tĩnh và linh hoạt khi xử lý các tình huống phát sinh tại hiện trường sự kiện.',
        'Nhiệt huyết, trách nhiệm cao và mong muốn tạo dựng môi trường gắn bó cho tập thể.'
      ],
      benefits: [
        'Nắm vững kỹ năng quản trị dự án, phân bổ nguồn lực và vận hành sự kiện chuyên nghiệp.',
        'Trở thành người giữ lửa văn hóa câu lạc bộ, gắn kết các thế hệ thành viên.',
        'Được tín nhiệm và tôi luyện bản lĩnh người đứng đầu qua các chương trình thực tế.'
      ]
    }
  };

  // --- Theme Management ---
  const THEME_STORAGE_KEY = 'rec_ftu_theme';
  const themeToggleBtn = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
    }
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Listen for OS theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // --- Mobile Navigation Drawer ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function toggleMobileMenu(forceState) {
    if (!mobileMenuBtn || !mobileDrawer) return;
    const isCurrentlyOpen = mobileDrawer.classList.contains('open');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      mobileDrawer.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    } else {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      toggleMobileMenu();
    });
  }

  // Close mobile drawer when clicking on any link
  const mobileLinks = document.querySelectorAll('.mobile-link, .btn-cta-mobile');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMobileMenu(false);
    });
  });

  // --- Department JD Modal ---
  const jdModal = document.getElementById('jd-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalApplyBtn = document.getElementById('modal-apply-btn');

  const modalTitle = document.getElementById('modal-title');
  const modalDeptTag = document.getElementById('modal-dept-tag');
  const modalTasksList = document.getElementById('modal-tasks-list');
  const modalRequirementsList = document.getElementById('modal-requirements-list');
  const modalBenefitsList = document.getElementById('modal-benefits-list');

  function openDepartmentModal(deptKey) {
    const data = DEPARTMENTS_DATA[deptKey];
    if (!data || !jdModal) return;

    modalTitle.textContent = data.title;
    modalDeptTag.textContent = data.tag;

    // Helper to render list
    function renderItems(container, items) {
      container.innerHTML = '';
      items.forEach(function (itemText) {
        const li = document.createElement('li');
        li.textContent = itemText;
        container.appendChild(li);
      });
    }

    renderItems(modalTasksList, data.tasks);
    renderItems(modalRequirementsList, data.requirements);
    renderItems(modalBenefitsList, data.benefits);

    jdModal.showModal();
  }

  function closeDepartmentModal() {
    if (jdModal && jdModal.open) {
      jdModal.close();
    }
  }

  // View JD Buttons
  const viewJdButtons = document.querySelectorAll('.btn-view-jd');
  viewJdButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetDept = btn.getAttribute('data-target');
      openDepartmentModal(targetDept);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeDepartmentModal);
  }

  if (modalApplyBtn) {
    modalApplyBtn.addEventListener('click', function () {
      closeDepartmentModal();
    });
  }

  // Close modal when clicking on backdrop
  if (jdModal) {
    jdModal.addEventListener('click', function (event) {
      const rect = jdModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeDepartmentModal();
      }
    });
  }

  // --- Keyboard Shortcuts (Escape to close drawer & modal) ---
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    }
  });

})();
