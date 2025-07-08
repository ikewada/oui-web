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

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // フォーム送信時のバリデーション処理
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const privacyCheckbox = document.getElementById('privacy');
            
            if (!privacyCheckbox.checked) {
                e.preventDefault();
                alert(polyglot.t('privacy_required'));
                return false;
            }
        });
    }
    
    // プライバシーポリシーモーダル
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

    // 言語選択ドロップダウン
    const langBtn = document.getElementById('lang-dropdown-btn');
    const langList = document.getElementById('lang-dropdown-list');

    // Polyglot.js 辞書
    const phrases = {
        ja: {
            about_title: "About Oui",
            about_1: "Unity社のアドボケートとして活動した8年間の経験を活かし、現在はゲーム開発を中心に多様なクリエイティブプロジェクトに取り組んでいます。",
            about_2: "デザイン力と表現力に加え、幅広い技術への柔軟な対応力を強みとし、常に進化するテクノロジーの流れを楽しみながら、新たな表現の可能性を追求しています。",
            about_signature: "池和田 有輔",
            profile_title: "Company Profile",
            profile_company: "法人名",
            profile_company_val: "Oui合同会社",
            profile_ceo: "代表者",
            profile_ceo_val: "池和田 有輔",
            profile_address: "住所",
            profile_address_val: "東京都渋谷区道玄坂1-10-8 渋谷道玄坂東急ビル2F-C",
            profile_founded: "設立",
            profile_founded_val: "2025年4月",
            profile_capital: "資本金",
            profile_capital_val: "1,000,000円",
            contact_title: "Contact us",
            contact_desc: "お仕事のご依頼やお問い合わせは下記フォームよりお願いします。",
            contact_label_name: "お名前",
            contact_label_email: "メールアドレス",
            contact_label_subject: "件名",
            contact_label_message: "メッセージ",
            contact_privacy_link: "個人情報の取り扱い",
            contact_privacy_agree: "に同意する",
            contact_submit: "送信",
            contact_alert: "お問い合わせありがとうございます。近日中にご連絡いたします。",
            privacy_required: "個人情報の取り扱いに同意してください。",
            privacy_policy_title: "個人情報保護方針",
            privacy_policy_intro: "Oui合同会社は、個人情報の保護に十分配慮した事業活動を行ってまいります。<br>以下のとおり個人情報保護方針を定め、情報管理に関する社内体制の策定・実施・維持・改善を継続的に行い、関連法令および社内規程を遵守いたします。",
            privacy_section1_title: "情報の収集目的、利用範囲および訂正・削除について",
            privacy_section1_content: "当社は、お問い合わせフォームを通じてご提供いただいた個人情報を、お問い合わせ内容への適切な回答のためにのみ利用し、目的外の利用はいたしません。<br>また、お客様が個人情報の訂正や削除をご希望される場合には、ご本人であることを確認のうえ、合理的な範囲で情報の訂正、更新、または削除を行います。",
            privacy_section2_title: "個人情報の第三者提供について",
            privacy_section2_content: "当社は、あらかじめご本人の同意を得ることなく、個人情報を第三者に提供または開示することはありません。<br>ただし、業務の一部を外部に委託する場合には、個人情報の漏えいや再提供がないよう契約により義務づけ、適切な管理と監督を行います。<br>また、法令に基づく場合や、お客様または公衆の生命・財産など重大な利益を保護するために必要な場合は、この限りではありません。",
            privacy_section3_title: "セキュリティ対策について",
            privacy_section3_content: "当社は、お客様の個人情報について厳重なセキュリティ対策を講じ、情報の紛失、不正アクセス、誤用、改ざん等の防止に努めるとともに、システムの継続的な見直しと改善を行います。",
            privacy_section4_title: "法令遵守および体制の継続的改善",
            privacy_section4_content: "当社は、保有する個人情報に関して適用される法令および各種ガイドラインを遵守し、本方針の内容を適宜見直し、継続的な改善に努めてまいります。"
        },
        en: {
            about_title: "About Oui",
            about_1: "With eight years of experience as a Unity Advocate, I now focus on game development as the core of my work, while engaging in a wide range of creative projects.",
            about_2: "I bring strong skills in design and expression, along with the ability to adapt to diverse technologies. Embracing the ever-evolving landscape of technology, I continuously explore new possibilities for creative expression.",
            about_signature: "Yusuke Ikewada",
            profile_title: "Company Profile",
            profile_company: "Company",
            profile_company_val: "Oui LLC",
            profile_ceo: "Founder",
            profile_ceo_val: "Yusuke Ikewada",
            profile_address: "Address",
            profile_address_val: "2F-C, Shibuya Dogenzaka Tokyu Bldg, 1-10-8 Dogenzaka, Shibuya-ku, Tokyo, Japan",
            profile_founded: "Founded",
            profile_founded_val: "May 2025",
            profile_capital: "Capital",
            profile_capital_val: "1,000,000 JPY",
            contact_title: "Contact us",
            contact_desc: "Please use this form to contact us.",
            contact_label_name: "Name",
            contact_label_email: "Email",
            contact_label_subject: "Subject",
            contact_label_message: "Message",
            contact_privacy_link: "handling of personal information",
            contact_privacy_agree: "I agree to the ",
            contact_submit: "Send",
            contact_alert: "Thank you for your inquiry. We will contact you soon.",
            privacy_required: "Please agree to the handling of personal information.",
            privacy_policy_title: "Privacy Policy",
            privacy_policy_intro: "Oui LLC conducts business activities with full consideration for the protection of personal information.<br>We have established the following privacy policy and will continuously implement, maintain, and improve our internal systems for information management, while complying with relevant laws and internal regulations.",
            privacy_section1_title: "Purpose of Information Collection, Scope of Use, and Correction/Deletion",
            privacy_section1_content: "We use personal information provided through our contact form solely for the purpose of providing appropriate responses to inquiries, and will not use it for any other purposes.<br>If customers wish to correct or delete their personal information, we will correct, update, or delete the information within a reasonable scope after confirming their identity.",
            privacy_section2_title: "Provision of Personal Information to Third Parties",
            privacy_section2_content: "We will not provide or disclose personal information to third parties without obtaining prior consent from the individual.<br>However, when outsourcing part of our business to external parties, we will contractually obligate them to prevent leakage or re-provision of personal information and provide appropriate management and supervision.<br>This does not apply when required by law or when necessary to protect the life, property, or other significant interests of customers or the public.",
            privacy_section3_title: "Security Measures",
            privacy_section3_content: "We implement strict security measures for customers' personal information and strive to prevent loss, unauthorized access, misuse, alteration, etc., while continuously reviewing and improving our systems.",
            privacy_section4_title: "Legal Compliance and Continuous Improvement of Systems",
            privacy_section4_content: "We comply with applicable laws and various guidelines regarding personal information we hold, and will continuously strive to improve by reviewing the content of this policy as appropriate."
        }
    };

    let polyglot = new Polyglot({ phrases: phrases["ja"] }); // デフォルト日本語

    function updateTexts(lang) {
        polyglot.replace(phrases[lang]);
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            const text = polyglot.t(key);
            if (text.includes('<br>')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        });
        
        // プライバシーラベルの語順を言語に応じて調整
        const privacyLabel = document.getElementById('privacy-label');
        const privacyLink = document.getElementById('privacy-policy-link');
        const privacyAgree = privacyLabel.querySelector('[data-i18n="contact_privacy_agree"]');
        
        if (privacyLabel && privacyLink && privacyAgree) {
            if (lang === 'en') {
                // 英語の場合: "I agree to the handling of personal information"
                privacyLabel.innerHTML = '';
                privacyLabel.appendChild(privacyAgree);
                privacyLabel.appendChild(privacyLink);
            } else {
                // 日本語の場合: "個人情報の取り扱いに同意する"
                privacyLabel.innerHTML = '';
                privacyLabel.appendChild(privacyLink);
                privacyLabel.appendChild(privacyAgree);
            }
        }
    }

    if (langBtn && langList) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = langList.classList.toggle('open');
            langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        langList.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', function(e) {
                langList.querySelectorAll('.lang-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.setAttribute('aria-selected', 'false');
                });
                this.classList.add('selected');
                this.setAttribute('aria-selected', 'true');
                langList.classList.remove('open');
                langBtn.setAttribute('aria-expanded', 'false');
                // Polyglot.jsで言語切替
                const lang = this.getAttribute('data-lang');
                updateTexts(lang);
            });
        });

        document.addEventListener('click', function(e) {
            if (!langList.contains(e.target) && !langBtn.contains(e.target)) {
                langList.classList.remove('open');
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 言語の自動判定
    function detectDefaultLang() {
        const navLang = navigator.language || navigator.userLanguage || '';
        return navLang.startsWith('ja') ? 'ja' : 'en';
    }
    const defaultLang = detectDefaultLang();
    updateTexts(defaultLang);
    // ドロップダウン選択状態も同期
    if (langList) {
        langList.querySelectorAll('.lang-option').forEach(opt => {
            const isMatch = opt.getAttribute('data-lang') === defaultLang;
            opt.classList.toggle('selected', isMatch);
            opt.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
    }


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

    // Additional JavaScript functionality can be added here
});