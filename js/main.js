/**
 * Main JavaScript for Oui Website
 * Handles background video, contact form, privacy modal, and i18n initialization
 */

let backgroundVideo = null;
let videoDuration = 0;

/**
 * 背景動画の初期化
 */
function initBackgroundVideo() {
    backgroundVideo = document.getElementById('background-video');
    if (!backgroundVideo) return;
    backgroundVideo.addEventListener('loadedmetadata', function() {
        videoDuration = backgroundVideo.duration;
        backgroundVideo.currentTime = 0;
    });
    backgroundVideo.load();
}

/**
 * メイン初期化処理
 */
function init() {
    console.log('🚀 Oui Website initialized');
    initBackgroundVideo();
    // 必要なライブラリの存在確認
    if (typeof Polyglot === 'undefined') {
        console.error('❌ Polyglot library not loaded');
        return;
    }
    if (typeof window.COMMON_TRANSLATIONS === 'undefined') {
        console.error('❌ Common translations not loaded');
        return;
    }
    // 多言語化システム初期化
    if (window.i18n?.init) {
        const success = window.i18n.init();
        console.log(success ? '✅ i18n initialized' : '❌ i18n initialization failed');
    }
    // 各機能の初期化
    initContactForm();
    initPrivacyModal();
    initVideoScrollSync();
}

/**
 * お問い合わせフォームの初期化
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const privacyCheckbox = document.getElementById('privacy');
    
    if (!form || !privacyCheckbox) return;
    
    form.addEventListener('submit', function(e) {
        if (!privacyCheckbox.checked) {
            e.preventDefault();
            const message = window.i18n?.t?.('privacy_required') || 
                          '個人情報の取り扱いに同意してください。';
            alert(message);
        }
    });
}

/**
 * プライバシーポリシーモーダルの初期化
 */
function initPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const link = document.getElementById('privacy-policy-link');
    const closeBtn = document.querySelector('.close');

    if (!modal) return;

    // モーダルを開く
    if (link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    // モーダルを閉じる
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // 外部クリックで閉じる
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 動画のスクロール連動機能の初期化
 */
function initVideoScrollSync() {
    if (!backgroundVideo) return;

    let targetTime = 0;
    let isAnimating = false;
    let animationStartTime = 0;
    let animationStartValue = 0;
    const animationDuration = 1000;

    function updateVideoTime() {
        if (videoDuration === 0) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollTop / scrollHeight, 1);
        
        const newTargetTime = scrollProgress * videoDuration;
        
        if (Math.abs(newTargetTime - targetTime) > 0.01) {
            targetTime = newTargetTime;
            startAnimation();
        }
    }

    function startAnimation() {
        if (isAnimating) return;
        
        isAnimating = true;
        animationStartTime = performance.now();
        animationStartValue = backgroundVideo.currentTime;
        animateFrame();
    }

    function animateFrame() {
        if (!isAnimating) return;
        
        const elapsed = performance.now() - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out
        
        const currentTime = animationStartValue + (targetTime - animationStartValue) * easedProgress;
        backgroundVideo.currentTime = currentTime;
        
        if (progress < 1) {
            requestAnimationFrame(animateFrame);
        } else {
            isAnimating = false;
        }
    }

    // スロットリングされたスクロールイベント
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateVideoTime, 16); // 60fps相当
    });

    // 初期設定
    if (backgroundVideo.readyState >= 1) {
        updateVideoTime();
    } else {
        backgroundVideo.addEventListener('loadedmetadata', updateVideoTime);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    init();
});