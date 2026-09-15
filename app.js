/**
 * REC FTU GEN 16: JAVASCRIPT CONTROLLER
 * Complies with Apple HIG, Antislop (zero em dash, high accessibility) and Ponytail (Native JS)
 */

(function () {
  'use strict';

  // --- Department Data (Phong cách sinh viên, ấm áp, truyền cảm hứng) ---
  const DEPARTMENTS_DATA = {
    'chuyen-mon': {
      title: 'Ban Chuyên môn',
      tag: 'Bộ Não Học Thuật',
      tasks: [
        'Cùng nhau nghiên cứu, tìm hiểu các bài toán thực tế và thị trường bất động sản thông qua các buổi sinh hoạt chuyên môn ấm cúng.',
        'Lên ý tưởng và tham gia biên soạn đề bài cho cuộc thi The Real Contest, sân khấu học thuật BĐS sinh viên lớn nhất miền Bắc.',
        'Viết bài phân tích, chia sẻ kiến thức hữu ích qua các chuyên mục REnews, REstudy và cẩm nang sinh viên Tìm nhà cùng bạn.',
        'Tham gia các chuyến Company Tour thực tế đến các dự án và tập đoàn bất động sản hàng đầu.'
      ],
      requirements: [
        'Không yêu cầu em phải có sẵn kiến thức sâu rộng về BĐS, chỉ cần em có tinh thần cầu tiến, ham học hỏi và chăm chỉ.',
        'Thích đọc, tìm tòi tài liệu và có tư duy logic, phản biện tích cực.',
        'Có tinh thần trách nhiệm, đúng hẹn với công việc của ban và nhiệt tình với tập thể.'
      ],
      benefits: [
        'Được các anh chị cựu thành viên (Alumni) và ban điều hành đào tạo bài bản từ những khái niệm BĐS cơ bản nhất.',
        'Nâng cao tư duy tài chính, kỹ năng giải quyết tình huống kinh doanh thực tế.',
        'Tích lũy kiến thức vững vàng để tham gia các cuộc thi sinh viên lớn và định hướng nghề nghiệp tương lai.'
      ]
    },
    'truyen-thong': {
      title: 'Ban Truyền thông',
      tag: 'Tiếng Nói Sáng Tạo',
      tasks: [
        'Sáng tạo ý tưởng nội dung (Content) cho Fanpage REC FTU, bắt trend sinh viên và lan tỏa hình ảnh đẹp của CLB.',
        'Thiết kế các ấn phẩm hình ảnh, visual sự kiện, logo, poster (Design) bằng Photoshop, Illustrator hoặc Canva.',
        'Quay chụp, lưu giữ những khoảnh khắc đẹp của Nhà REC trong các buổi chạy sự kiện, dã ngoại và bonding.',
        'Sản xuất các video ngắn, clip TikTok, Reels sáng tạo và quản trị tương tác cùng các bạn sinh viên.'
      ],
      requirements: [
        'Yêu thích viết lách, sáng tạo hoặc có gu thẩm mỹ, đam mê với màu sắc, thiết kế hay quay dựng video.',
        'Đừng ngại nếu em chưa giỏi công cụ, anh chị sẵn sàng training từ những bước đầu tiên.',
        'Nhanh nhạy, tươi vui và có tinh thần phối hợp ăn ý cùng đồng đội.'
      ],
      benefits: [
        'Rèn luyện kỹ năng xây dựng chiến dịch truyền thông thực tế với quy mô tiếp cận hàng chục nghìn sinh viên.',
        'Tự tay tạo nên những ấn phẩm triệu view và xây dựng một Portfolio cá nhân cực xịn.',
        'Làm việc trong môi trường tự do sáng tạo, khuyến khích mọi ý tưởng mới lạ.'
      ]
    },
    'doi-ngoai': {
      title: 'Ban Đối ngoại',
      tag: 'Cầu Nối Bản Lĩnh',
      tasks: [
        'Kết nối CLB với các doanh nghiệp, tập đoàn bất động sản lớn để tìm kiếm các gói tài trợ tài chính và hiện vật.',
        'Soạn thảo hồ sơ mời tài trợ (Proposal), gửi thư ngỏ và tham gia các buổi đàm phán quyền lợi cùng đại diện doanh nghiệp.',
        'Mời các diễn giả, chuyên gia uy tín trong ngành BĐS về chia sẻ tại các buổi talkshow, workshop của trường.',
        'Duy trì mối quan hệ thân thiết với các đơn vị bảo trợ truyền thông và các câu lạc bộ bạn tại Ngoại thương.'
      ],
      requirements: [
        'Tự tin, hoạt bát, thích giao tiếp và mở rộng các mối quan hệ mới.',
        'Tác phong lịch thiệp, chu đáo trong cách viết email và ứng xử.',
        'Kiên trì, không nản lòng trước thử thách và có tinh thần cầu tiến.'
      ],
      benefits: [
        'Cơ hội hiếm có để tiếp xúc, làm việc trực tiếp với các anh chị quản lý tại các tập đoàn lớn ngay từ năm nhất, năm hai.',
        'Nâng tầm kỹ năng đàm phán, thuyết phục và phong thái tự tin trước đám đông.',
        'Sở hữu mạng lưới quan hệ (Networking) rộng lớn, mở ra nhiều cơ hội thực tập và việc làm sau này.'
      ]
    },
    'to-chuc': {
      title: 'Ban Tổ chức',
      tag: 'Khung Xương Vận Hành',
      tasks: [
        'Lên ý tưởng, kịch bản, timeline chi tiết và điều phối vận hành trực tiếp các sự kiện: The Real Contest, Talkshow, Company Tour.',
        'Quản lý ngân sách dự án, khảo sát địa điểm, chuẩn bị cơ sở vật chất, âm thanh, ánh sáng và hậu cần kỹ thuật.',
        'Chăm sóc đời sống tinh thần của thành viên, theo dõi tiến độ và gắn kết các ban trong câu lạc bộ.',
        'Đứng sau tổ chức các buổi bonding, dã ngoại, sinh nhật, prom và những đêm thức cùng nhau làm nên kỷ niệm thanh xuân.'
      ],
      requirements: [
        'Tháo vát, nhanh nhẹn, chu đáo và biết quan tâm đến mọi người xung quanh.',
        'Khả năng bao quát, sắp xếp thời gian hợp lý và bình tĩnh xử lý các tình huống bất ngờ.',
        'Nhiệt huyết, lăn xả và luôn giữ ngọn lửa nhiệt tình cho cả tập thể.'
      ],
      benefits: [
        'Trở thành người nắm giữ kỹ năng quản lý dự án, xử lý rủi ro và điều phối sự kiện lớn.',
        'Là linh hồn giữ lửa, gắn kết các thế hệ thành viên và tạo nên những kỷ niệm ấm áp nhất của thời sinh viên.',
        'Được tôi luyện bản lĩnh và khả năng lãnh đạo thông qua các trải nghiệm thực tế.'
      ]
    }
  };

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

  // --- Department Modal Controller ---
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

    // Helper render
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
