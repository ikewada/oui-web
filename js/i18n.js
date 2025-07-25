// シンプルな多言語化システム
// 翻訳データは translations/*.js ファイルで管理されています

let polyglot = null;
let currentLanguage = 'ja';

// 設定
const I18N_CONFIG = {
    defaultLanguage: 'en',
    supportedLanguages: ['ja', 'en']
};

// 現在のページ名を取得
function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === '') {
        return 'index';
    }
    
    return filename.replace('.html', '') || 'index';
}

// ページ名から翻訳データ変数名を取得
function getTranslationVariableName(pageName) {
    const upperPageName = pageName.toUpperCase();
    return `${upperPageName}_TRANSLATIONS`;
}

// 翻訳データを取得
function getTranslations(pageName, language) {
    // 共通翻訳データを取得
    const commonData = window.COMMON_TRANSLATIONS;
    if (!commonData || !commonData[language]) {
        console.error('共通翻訳データが見つかりません:', language);
        return {};
    }
    
    // ページ固有翻訳データを取得
    const variableName = getTranslationVariableName(pageName);
    const pageData = window[variableName];
    if (!pageData || !pageData[language]) {
        console.error(`ページ翻訳データが見つかりません: ${variableName}[${language}]`);
        return commonData[language];
    }
    
    // 共通データ + ページデータをマージ（ページデータが優先）
    return {
        ...commonData[language],
        ...pageData[language]
    };
}

// Polyglotを初期化/更新
function initPolyglot(pageName, language) {
    const translations = getTranslations(pageName, language);
    
    if (!polyglot) {
        polyglot = new Polyglot({ phrases: translations });
        console.log(`✅ 多言語化システム初期化完了 (${language})`);
    } else {
        polyglot.replace(translations);
        console.log(`🔄 言語切り替え完了 (${language})`);
    }
    
    currentLanguage = language;
    return true;
}

// テキストを更新
function updateTexts() {
    if (!polyglot) {
        console.error('Polyglot が初期化されていません');
        return false;
    }
    
    // data-i18n属性を持つ要素のテキストを更新
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const text = polyglot.t(key);
        
        if (text.includes('<br>')) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    });
    
    // プライバシーラベルの語順を言語に応じて調整
    adjustPrivacyLabelOrder(currentLanguage);
    
    return true;
}

// プライバシーラベルの語順調整
function adjustPrivacyLabelOrder(language) {
    const privacyLabel = document.getElementById('privacy-label');
    const privacyLink = document.getElementById('privacy-policy-link');
    const privacyAgree = privacyLabel ? privacyLabel.querySelector('[data-i18n="contact_privacy_agree"]') : null;
    
    if (privacyLabel && privacyLink && privacyAgree) {
        if (language === 'en') {
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

// 言語を切り替え
function switchLanguage(language) {
    if (!I18N_CONFIG.supportedLanguages.includes(language)) {
        console.error(`サポートされていない言語: ${language}`);
        return false;
    }
    
    const pageName = getCurrentPageName();
    
    try {
        initPolyglot(pageName, language);
        updateTexts();
        
        // ドロップダウンの選択状態を更新
        updateLanguageDropdown(language);
        
        // 言語設定を保存（ユーザーが手動で変更した場合）
        saveLanguage(language);
        console.log(`言語設定を保存: ${language}`);
        
        return true;
        
    } catch (error) {
        console.error('言語切り替えエラー:', error);
        return false;
    }
}

// 言語ドロップダウンの選択状態を更新
function updateLanguageDropdown(language) {
    const langList = document.getElementById('lang-dropdown-list');
    if (langList) {
        langList.querySelectorAll('.lang-option').forEach(opt => {
            const isMatch = opt.getAttribute('data-lang') === language;
            opt.classList.toggle('selected', isMatch);
            opt.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
    }
}

// 保存された言語設定を取得
function getSavedLanguage() {
    try {
        const saved = localStorage.getItem('oui-language');
        if (saved && I18N_CONFIG.supportedLanguages.includes(saved)) {
            return saved;
        }
    } catch (error) {
        // localStorageが無効な場合は無視
        console.warn('localStorage アクセスエラー:', error);
    }
    return null;
}

// 言語設定を保存
function saveLanguage(language) {
    try {
        localStorage.setItem('oui-language', language);
    } catch (error) {
        // localStorageが無効な場合は無視
        console.warn('localStorage 保存エラー:', error);
    }
}

// ブラウザの言語設定を自動判定
function detectDefaultLanguage() {
    const navLang = navigator.language || navigator.userLanguage || '';
    const detectedLang = navLang.startsWith('ja') ? 'ja' : 'en';
    return I18N_CONFIG.supportedLanguages.includes(detectedLang) 
        ? detectedLang 
        : I18N_CONFIG.defaultLanguage;
}

// 最適な言語を決定（優先順位: 保存された設定 > ブラウザ設定）
function determineOptimalLanguage() {
    // 1. 保存された言語設定があればそれを使用
    const savedLang = getSavedLanguage();
    if (savedLang) {
        console.log(`保存された言語設定を使用: ${savedLang}`);
        return savedLang;
    }
    
    // 2. なければブラウザ設定から自動判定
    const detectedLang = detectDefaultLanguage();
    console.log(`ブラウザ設定から言語を判定: ${detectedLang}`);
    return detectedLang;
}

// 言語選択ドロップダウンの初期化
function initLanguageSelector() {
    const langBtn = document.getElementById('lang-dropdown-btn');
    const langList = document.getElementById('lang-dropdown-list');

    if (!langBtn || !langList) {
        console.warn('言語選択要素が見つかりません');
        return false;
    }

    // ドロップダウンボタンのクリック処理
    langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = langList.classList.toggle('open');
        langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // 言語オプションのクリック処理
    langList.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            const newLanguage = this.getAttribute('data-lang');
            if (newLanguage === currentLanguage) {
                // 同じ言語なら何もしない
                langList.classList.remove('open');
                langBtn.setAttribute('aria-expanded', 'false');
                return;
            }
            
            // 言語を切り替え
            const success = switchLanguage(newLanguage);
            
            if (success) {
                // ドロップダウンを閉じる
                langList.classList.remove('open');
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // 外部クリックでドロップダウンを閉じる
    document.addEventListener('click', function(e) {
        if (!langList.contains(e.target) && !langBtn.contains(e.target)) {
            langList.classList.remove('open');
            langBtn.setAttribute('aria-expanded', 'false');
        }
    });

    return true;
}

// システム全体の初期化
function initLanguageSystem() {
    try {
        // Polyglotライブラリの確認
        if (typeof Polyglot === 'undefined') {
            console.error('❌ Polyglot ライブラリが読み込まれていません');
            console.error('💡 CDNまたはスクリプトタグを確認してください');
            showFallbackError('翻訳ライブラリの読み込みに失敗しました');
            return false;
        }
        
        const pageName = getCurrentPageName();
        const defaultLanguage = determineOptimalLanguage();
        
        // 翻訳データの存在確認
        const commonExists = window.COMMON_TRANSLATIONS;
        const pageVarName = getTranslationVariableName(pageName);
        const pageExists = window[pageVarName];
        
        if (!commonExists) {
            console.error('⚠️  共通翻訳データ (COMMON_TRANSLATIONS) が読み込まれていません');
            console.error('💡 translations/common.js が読み込まれているか確認してください');
            showFallbackError('共通翻訳データの読み込みに失敗しました');
            return false;
        }
        
        if (!pageExists) {
            console.error(`⚠️  ページ翻訳データ (${pageVarName}) が読み込まれていません`);
            console.error(`💡 translations/${pageName}.js が読み込まれているか確認してください`);
            showFallbackError(`ページ翻訳データ (${pageName}) の読み込みに失敗しました`);
            return false;
        }
        
        // Polyglotを初期化
        initPolyglot(pageName, defaultLanguage);
        
        // 言語選択機能の初期化
        initLanguageSelector();
        
        // テキストを更新
        updateTexts();
        
        // ドロップダウンの状態を同期
        updateLanguageDropdown(defaultLanguage);
        
        return true;
        
    } catch (error) {
        console.error('多言語化システムの初期化に失敗:', error);
        showFallbackError('多言語化システムの初期化に失敗しました: ' + error.message);
        return false;
    }
}

// エラー表示用のフォールバック関数
function showFallbackError(message) {
    // 開発者モードでのエラー表示（本番では削除）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ffebee;
            border: 1px solid #f44336;
            color: #c62828;
            padding: 10px;
            border-radius: 4px;
            z-index: 10000;
            max-width: 300px;
            font-size: 12px;
        `;
        errorDiv.textContent = `i18n Error: ${message}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
    }
}

// 翻訳テキストを取得する便利関数
function t(key, options = {}) {
    if (!polyglot) {
        console.error('Polyglot が初期化されていません');
        return key;
    }
    return polyglot.t(key, options);
}

// API として外部に公開
window.i18n = {
    // 主要な関数
    init: initLanguageSystem,
    t,
    switchLanguage,
    
    // ユーティリティ
    getCurrentPageName,
    getCurrentLanguage: () => currentLanguage,
    getSupportedLanguages: () => [...I18N_CONFIG.supportedLanguages],
    
    // 詳細制御用（通常は使用しない）
    updateTexts,
    detectDefaultLanguage,
    initLanguageSelector,
    
    // 言語設定管理
    getSavedLanguage,
    saveLanguage,
    
    // デバッグ用
    get polyglot() {
        return polyglot;
    }
}; 