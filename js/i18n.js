/**
 * Internationalization System for Oui Website
 * Simple multilingual support with localStorage persistence
 */

let polyglot = null;
let currentLanguage = 'ja';

const CONFIG = {
    defaultLanguage: 'en',
    supportedLanguages: ['ja', 'en']
};

/**
 * 現在のページ名を取得
 */
function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename.replace('.html', '') || 'index';
}

/**
 * ページ固有の翻訳データ変数名を取得
 */
function getTranslationVariableName(pageName) {
    return `${pageName.toUpperCase()}_TRANSLATIONS`;
}

/**
 * 翻訳データを取得（共通 + ページ固有）
 */
function getTranslations(pageName, language) {
    const commonData = window.COMMON_TRANSLATIONS;
    if (!commonData?.[language]) {
        console.error(`Common translations not found for: ${language}`);
        return {};
    }
    
    const variableName = getTranslationVariableName(pageName);
    const pageData = window[variableName];
    if (!pageData?.[language]) {
        console.warn(`Page translations not found: ${variableName}[${language}]`);
        return commonData[language];
    }
    
    return { ...commonData[language], ...pageData[language] };
}

/**
 * Polyglotを初期化/更新
 */
function initPolyglot(pageName, language) {
    const translations = getTranslations(pageName, language);
    
    if (!polyglot) {
        polyglot = new Polyglot({ phrases: translations });
    } else {
        polyglot.replace(translations);
    }
    
    currentLanguage = language;
    return true;
}

/**
 * ページ内の翻訳テキストを更新
 */
function updateTexts() {
    if (!polyglot) return false;
    
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const text = polyglot.t(key);
        
        if (text.includes('<br>')) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    });
    
    // Update YouTube video URL based on language
    updatePromoVideo(currentLanguage);
    
    adjustPrivacyLabelOrder(currentLanguage);
    return true;
}

/**
 * YouTube動画のURLを言語に応じて更新
 */
function updatePromoVideo(language) {
    const videoIframe = document.getElementById('promo-video');
    if (!videoIframe) return;
    
    const pageName = getCurrentPageName();
    const translations = getTranslations(pageName, language);
    
    let videoUrl;
    if (language === 'ja') {
        videoUrl = translations.promo_video_ja || 'https://youtu.be/fJhOI0N3p-g';
    } else {
        videoUrl = translations.promo_video_en || 'https://youtu.be/89FkfgzlUAw';
    }
    
    // YouTube URLをembed形式に変換
    const embedUrl = videoUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    videoIframe.src = embedUrl;
}

/**
 * プライバシーラベルの語順調整（言語別）
 */
function adjustPrivacyLabelOrder(language) {
    const privacyLabel = document.getElementById('privacy-label');
    const privacyLink = document.getElementById('privacy-policy-link');
    const privacyAgree = privacyLabel?.querySelector('[data-i18n="contact_privacy_agree"]');
    
    if (!privacyLabel || !privacyLink || !privacyAgree) return;
    
    privacyLabel.innerHTML = '';
    
    if (language === 'en') {
        // English: "I agree to the handling of personal information"
        privacyLabel.appendChild(privacyAgree);
        privacyLabel.appendChild(privacyLink);
    } else {
        // Japanese: "個人情報の取り扱いに同意する"
        privacyLabel.appendChild(privacyLink);
        privacyLabel.appendChild(privacyAgree);
    }
}

/**
 * 言語を切り替え
 */
function switchLanguage(language) {
    if (!CONFIG.supportedLanguages.includes(language)) {
        console.error(`Unsupported language: ${language}`);
        return false;
    }
    
    const pageName = getCurrentPageName();
    
    try {
        initPolyglot(pageName, language);
        updateTexts();
        updateLanguageDropdown(language);
        saveLanguage(language);
        return true;
    } catch (error) {
        console.error('Language switch failed:', error);
        return false;
    }
}

/**
 * 言語ドロップダウンの選択状態を更新
 */
function updateLanguageDropdown(language) {
    const langList = document.getElementById('lang-dropdown-list');
    if (!langList) return;
    
    langList.querySelectorAll('.lang-option').forEach(opt => {
        const isMatch = opt.getAttribute('data-lang') === language;
        opt.classList.toggle('selected', isMatch);
        opt.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
}

/**
 * 言語設定の保存/取得
 */
function getSavedLanguage() {
    try {
        const saved = localStorage.getItem('oui-language');
        return CONFIG.supportedLanguages.includes(saved) ? saved : null;
    } catch {
        return null;
    }
}

function saveLanguage(language) {
    try {
        localStorage.setItem('oui-language', language);
    } catch {
        // localStorage利用不可の場合は無視
    }
}

/**
 * ブラウザの言語設定を自動判定
 */
function detectBrowserLanguage() {
    const navLang = navigator.language || navigator.userLanguage || '';
    const detectedLang = navLang.startsWith('ja') ? 'ja' : 'en';
    return CONFIG.supportedLanguages.includes(detectedLang) 
        ? detectedLang 
        : CONFIG.defaultLanguage;
}

/**
 * 最適な言語を決定（保存設定 > ブラウザ設定）
 */
function determineOptimalLanguage() {
    return getSavedLanguage() || detectBrowserLanguage();
}

/**
 * 言語選択ドロップダウンの初期化
 */
function initLanguageSelector() {
    const langBtn = document.getElementById('lang-dropdown-btn');
    const langList = document.getElementById('lang-dropdown-list');

    console.log('[i18n] initLanguageSelector called');
    console.log('[i18n] langBtn:', langBtn);
    console.log('[i18n] langList:', langList);

    if (!langBtn || !langList) {
        console.warn('[i18n] langBtn/langList not found');
        return false;
    }

    // ドロップダウン開閉
    langBtn.addEventListener('click', function(e) {
        console.log('[i18n] langBtn clicked');
        e.stopPropagation();
        const isOpen = langList.classList.toggle('open');
        langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        console.log('[i18n] langList open:', isOpen);
    });

    // 言語選択
    langList.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(e) {
            console.log('[i18n] lang-option clicked:', this.getAttribute('data-lang'));
            e.preventDefault();
            const newLanguage = this.getAttribute('data-lang');
            if (newLanguage === currentLanguage) {
                closeDropdown();
                return;
            }
            if (switchLanguage(newLanguage)) {
                closeDropdown();
            }
        });
    });

    // 外部クリックで閉じる
    document.addEventListener('click', function(e) {
        if (!langList.contains(e.target) && !langBtn.contains(e.target)) {
            closeDropdown();
        }
    });

    function closeDropdown() {
        langList.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
        console.log('[i18n] langList closed');
    }

    return true;
}

/**
 * システム全体の初期化
 */
function initLanguageSystem() {
    try {
        // 必須ライブラリの確認
        if (typeof Polyglot === 'undefined') {
            console.error('Polyglot library not loaded');
            return false;
        }
        
        const pageName = getCurrentPageName();
        const defaultLanguage = determineOptimalLanguage();
        
        // 翻訳データの存在確認
        const commonExists = window.COMMON_TRANSLATIONS;
        const pageVarName = getTranslationVariableName(pageName);
        const pageExists = window[pageVarName];
        
        if (!commonExists) {
            console.error('Common translations not loaded');
            return false;
        }
        
        if (!pageExists) {
            console.error(`Page translations not loaded: ${pageVarName}`);
            return false;
        }
        
        // 初期化実行
        initPolyglot(pageName, defaultLanguage);
        initLanguageSelector();
        updateTexts();
        updateLanguageDropdown(defaultLanguage);
        
        return true;
        
    } catch (error) {
        console.error('i18n initialization failed:', error);
        return false;
    }
}

/**
 * 翻訳テキストを取得する便利関数
 */
function t(key, options = {}) {
    if (!polyglot) {
        console.warn('Polyglot not initialized');
        return key;
    }
    return polyglot.t(key, options);
}

// API公開
window.i18n = {
    init: initLanguageSystem,
    t,
    switchLanguage,
    getCurrentPageName,
    getCurrentLanguage: () => currentLanguage,
    getSupportedLanguages: () => [...CONFIG.supportedLanguages],
    updateTexts,
    getSavedLanguage,
    saveLanguage,
    
    // デバッグ用
    get polyglot() { return polyglot; }
}; 