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
            about_title: "About us",
            about_1: "Ouiはゲーム開発を軸に、ウェブ、アプリケーションなど、さまざまなプラットフォームのコンテンツ作成に取り組んでいます。",
            about_2: "デザイン力と表現力、そして多様な技術への対応を強みとし、テクノロジーの変化の波を楽しみながら新しい表現の可能性を日々探求しています。",
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
            contact_desc: "お問い合わせはこちらのフォームよりお願いします。",
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
            about_title: "About us",
            about_1: "Oui is primarily focused on game development, but also engages in content creation for various platforms such as web and applications.",
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


    // Additional JavaScript functionality can be added here
});