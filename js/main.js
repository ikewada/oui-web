// 背景動画の制御
let backgroundVideo = null;
let videoDuration = 0;

// 動画の初期化
function initBackgroundVideo() {
    backgroundVideo = document.getElementById('background-video');
    
    if (backgroundVideo) {
        // 動画の準備ができたら初期設定
        backgroundVideo.addEventListener('loadedmetadata', function() {
            videoDuration = backgroundVideo.duration;
            backgroundVideo.currentTime = 0; // 最初のフレームを表示
        });
        
        // 動画の読み込み開始
        backgroundVideo.load();
    }
}

// DOM読み込み時に動画を初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundVideo);
} else {
    initBackgroundVideo();
}

// メイン処理
document.addEventListener('DOMContentLoaded', function() {
    // 多言語化の初期化
    if (window.i18n && typeof window.i18n.init === 'function') {
        window.i18n.init();
    }

    // フォーム送信の処理
    initContactForm();
    
    // プライバシーポリシーモーダルの初期化
    initPrivacyModal();
    
    // 動画のスクロール連動機能の初期化
    initVideoScrollSync();
});

// フォーム送信処理の初期化
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const privacyCheckbox = document.getElementById('privacy');
            
            if (!privacyCheckbox.checked) {
                e.preventDefault();
                // 多言語化されたメッセージを表示
                const message = window.i18n && window.i18n.t 
                    ? window.i18n.t('privacy_required')
                    : '個人情報の取り扱いに同意してください。';
                alert(message);
                return false;
            }
        });
    }
}

// プライバシーポリシーモーダルの初期化
function initPrivacyModal() {
    const privacyModal = document.getElementById('privacy-modal');
    const privacyLink = document.getElementById('privacy-policy-link');
    const closeModal = document.querySelector('.close');

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            privacyModal.style.display = 'block';
        });
    }

    if (closeModal && privacyModal) {
        closeModal.addEventListener('click', function() {
            privacyModal.style.display = 'none';
        });
    }

    if (privacyModal) {
        window.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                privacyModal.style.display = 'none';
            }
        });
    }
}

// 動画のスクロール連動機能の初期化
function initVideoScrollSync() {
    // スクロールによる動画コマ送り（アニメーション付き）
    let targetTime = 0;
    let isAnimating = false;
    let animationStartTime = 0;
    let animationStartValue = 0;
    const animationDuration = 1000; // 1秒

    function updateBackgroundVideo() {
        if (!backgroundVideo || videoDuration === 0) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollTop / scrollHeight, 1);
        
        // 新しい目標時間を計算
        const newTargetTime = scrollProgress * videoDuration;
        
        // 目標が変わった場合はアニメーション開始
        if (Math.abs(newTargetTime - targetTime) > 0.01) {
            targetTime = newTargetTime;
            startVideoAnimation();
        }
    }

    function startVideoAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            animationStartTime = performance.now();
            animationStartValue = backgroundVideo.currentTime;
            animateVideoTime();
        }
    }

    function animateVideoTime() {
        if (!isAnimating) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        // 現在値から目標値へのアニメーション
        const currentVideoTime = animationStartValue + (targetTime - animationStartValue) * easedProgress;
        backgroundVideo.currentTime = currentVideoTime;
        
        if (progress < 1) {
            requestAnimationFrame(animateVideoTime);
        } else {
            isAnimating = false;
        }
    }

    // スクロールイベントリスナーの追加（パフォーマンス最適化のためにスロットリング）
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateBackgroundVideo, 16); // 60fps相当
    });

    // 初期動画設定（動画が読み込まれた後に呼び出し）
    if (backgroundVideo && backgroundVideo.readyState >= 1) {
        updateBackgroundVideo();
    } else if (backgroundVideo) {
        backgroundVideo.addEventListener('loadedmetadata', updateBackgroundVideo);
    }
}