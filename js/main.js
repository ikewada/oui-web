// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // フォーム送信時のカスタム処理を削除し、デフォルト動作（FormspreeへのPOST）を有効化
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         alert(polyglot.t('contact_alert'));
    //         contactForm.reset();
    //     });
    // }
    
    // 言語選択ドロップダウン
    const langBtn = document.getElementById('lang-dropdown-btn');
    const langList = document.getElementById('lang-dropdown-list');

    // Polyglot.js 辞書
    const phrases = {
        ja: {
            about_title: "About us",
            about_1: "OUIはゲーム開発を軸に、ウェブ、アプリケーションなど、さまざまなプラットフォームのコンテンツ作成に取り組んでいます。",
            about_2: "デザイン力と表現力、そして多様な技術への対応を強みとし、テクノロジーの変化の波を楽しみながら新しい表現の可能性を日々探求しています。",
            profile_title: "Company Profile",
            profile_company: "商号",
            profile_company_val: "Oui合同会社",
            profile_ceo: "代表",
            profile_ceo_val: "池和田 有輔",
            profile_address: "住所",
            profile_address_val: "東京都渋谷区道玄坂1-10-8 渋谷道玄坂東急ビル2F-C",
            profile_founded: "設立",
            profile_founded_val: "2025年4月",
            profile_capital: "資本金",
            profile_capital_val: "1,000,000円",
            contact_title: "Contact us",
            contact_desc: "お問い合わせはこちらのフォームをご利用ください。",
            contact_label_name: "お名前",
            contact_label_email: "メールアドレス",
            contact_label_subject: "件名",
            contact_label_message: "メッセージ",
            contact_submit: "送信",
            contact_alert: "お問い合わせありがとうございます。近日中にご連絡いたします。"
        },
        en: {
            about_title: "About us",
            about_1: "OUI is primarily focused on game development, but also engages in content creation for various platforms such as web and applications.",
            about_2: "Leveraging its strengths in design capabilities, expressive power, and adaptability to a wide range of technologies, OUI continuously explores new possibilities for expression every day, all while enthusiastically embracing the constant evolution of technology.",
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
            contact_submit: "Send",
            contact_alert: "Thank you for your inquiry. We will contact you soon."
        }
    };

    let polyglot = new Polyglot({ phrases: phrases["ja"] }); // デフォルト日本語

    function updateTexts(lang) {
        polyglot.replace(phrases[lang]);
        document.querySelectorAll("[data-i18n]").forEach(el => {
            el.textContent = polyglot.t(el.getAttribute("data-i18n"));
        });
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


    // Additional JavaScript functionality can be added here
});