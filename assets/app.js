const STORAGE_KEYS = {
  lang: 'pic.lang',
  cookie: 'pic.cookie',
  rememberCookie: 'pic.rememberCookie',
};

const DEFAULT_MAX_BYTES = 5.5 * 1024 * 1024;

const COOKIE_GUIDE_URL = 'https://www.jsw.ac.cn/pic';

const I18N = {
  'zh-Hans': {
    pageTitle: '图片上传',
    langLabel: '语言',
    uploadHeading: '上传',
    fileLabel: '图片',
    fileHint: '单张，小于 5.5 MB',
    emptyPreviewName: '未选择',
    cookieLabel: 'Cookie',
    cookieHint: '请输入闲鱼创作平台登录后的完整 Cookie。该内容仅用于本次上传请求；勾选“记住”后会保存在当前浏览器本地。',
    cookieHelpPrefix: '如果你不知道如何获取 Cookie，请先阅读',
    cookieHelpLink: '这篇文章',
    cookieHelpSuffix: '。',
    rememberLabel: '记住',
    clearCookieBtn: '清除',
    verifyLabel: '验证',
    verifyHintIdle: '完成后可上传',
    verifyHintReady: '验证通过',
    verifyHintExpired: '验证已失效',
    verifyHintError: '验证加载失败',
    submitBtn: '上传图片',
    resultHeading: '上传结果',
    resultDesc: '上传成功后，这里会显示图片直链和 Markdown。',
    urlLabel: '直链',
    mdLabel: 'Markdown',
    copyUrlBtn: '复制直链',
    copyMdBtn: '复制 Markdown',
    openImageLink: '打开图片',
    closeModal: '完成',
    pickImage: '请选择图片。',
    imageOnly: '仅支持图片文件。',
    sizeExceeded: '图片过大。',
    cookieRequired: '请填写 Cookie。',
    verifyRequired: '请先完成验证。',
    uploading: '上传中...',
    uploadOk: '上传成功。',
    uploadFail: '上传失败。',
    configFail: '初始化失败。',
    cookieSaved: '已保存。',
    cookieCleared: '已清除。',
    copyOk: '已复制。',
    copyFail: '复制失败。',
    noResultUrl: '未解析到直链。',
    resultImageAlt: '图片预览',
  },
  'zh-Hant': {
    pageTitle: '圖片上傳',
    langLabel: '語言',
    uploadHeading: '上傳',
    fileLabel: '圖片',
    fileHint: '單張，小於 5.5 MB',
    emptyPreviewName: '未選擇',
    cookieLabel: 'Cookie',
    cookieHint: '請輸入閒魚創作平台登入後的完整 Cookie。該內容僅用於本次上傳請求；勾選「記住」後會保存在目前瀏覽器本地。',
    cookieHelpPrefix: '如果你不知道如何取得 Cookie，請先閱讀',
    cookieHelpLink: '這篇文章',
    cookieHelpSuffix: '。',
    rememberLabel: '記住',
    clearCookieBtn: '清除',
    verifyLabel: '驗證',
    verifyHintIdle: '完成後可上傳',
    verifyHintReady: '驗證通過',
    verifyHintExpired: '驗證已失效',
    verifyHintError: '驗證載入失敗',
    submitBtn: '上傳圖片',
    resultHeading: '上傳結果',
    resultDesc: '上傳成功後，這裡會顯示圖片直鏈和 Markdown。',
    urlLabel: '直鏈',
    mdLabel: 'Markdown',
    copyUrlBtn: '複製直鏈',
    copyMdBtn: '複製 Markdown',
    openImageLink: '打開圖片',
    closeModal: '完成',
    pickImage: '請選擇圖片。',
    imageOnly: '僅支援圖片檔案。',
    sizeExceeded: '圖片過大。',
    cookieRequired: '請填寫 Cookie。',
    verifyRequired: '請先完成驗證。',
    uploading: '上傳中...',
    uploadOk: '上傳成功。',
    uploadFail: '上傳失敗。',
    configFail: '初始化失敗。',
    cookieSaved: '已保存。',
    cookieCleared: '已清除。',
    copyOk: '已複製。',
    copyFail: '複製失敗。',
    noResultUrl: '未解析到直鏈。',
    resultImageAlt: '圖片預覽',
  },
  en: {
    pageTitle: 'Image Upload',
    langLabel: 'Language',
    uploadHeading: 'Upload',
    fileLabel: 'Image',
    fileHint: 'Single image, under 5.5 MB',
    emptyPreviewName: 'Not selected',
    cookieLabel: 'Cookie',
    cookieHint: 'Enter the full Cookie from the logged-in Goofish creator platform. It is used only for this upload request; if you enable “Remember”, it will be stored locally in this browser.',
    cookieHelpPrefix: 'If you do not know how to get the Cookie, read',
    cookieHelpLink: 'this article',
    cookieHelpSuffix: '.',
    rememberLabel: 'Remember',
    clearCookieBtn: 'Clear',
    verifyLabel: 'Verify',
    verifyHintIdle: 'Complete verification to upload',
    verifyHintReady: 'Verified',
    verifyHintExpired: 'Verification expired',
    verifyHintError: 'Verification failed to load',
    submitBtn: 'Upload Image',
    resultHeading: 'Upload Result',
    resultDesc: 'After a successful upload, the direct image URL and Markdown will appear here.',
    urlLabel: 'Direct URL',
    mdLabel: 'Markdown',
    copyUrlBtn: 'Copy URL',
    copyMdBtn: 'Copy Markdown',
    openImageLink: 'Open Image',
    closeModal: 'Done',
    pickImage: 'Please choose an image.',
    imageOnly: 'Images only.',
    sizeExceeded: 'Image is too large.',
    cookieRequired: 'Please enter the Cookie.',
    verifyRequired: 'Please complete verification.',
    uploading: 'Uploading...',
    uploadOk: 'Upload completed.',
    uploadFail: 'Upload failed.',
    configFail: 'Initialization failed.',
    cookieSaved: 'Saved.',
    cookieCleared: 'Cleared.',
    copyOk: 'Copied.',
    copyFail: 'Copy failed.',
    noResultUrl: 'No direct URL parsed.',
    resultImageAlt: 'Image preview',
  },
};

const state = {
  lang: 'zh-Hans',
  turnstileSiteKey: '',
  turnstileWidgetId: null,
  turnstileToken: '',
  maxUploadBytes: DEFAULT_MAX_BYTES,
  lastFocusedElement: null,
};

const el = {};

document.addEventListener('DOMContentLoaded', bootstrap);

function bootstrap() {
  bindElements();
  state.lang = loadLang();
  el.langSelect.value = state.lang;
  applyI18n();

  restoreCookiePreference();
  bindEvents();
  updatePreview();
  updateSubmitState();

  initConfig();
  window.addEventListener('turnstile-ready', () => {
    renderTurnstileIfReady();
  });
}

function bindElements() {
  el.pageTitle = document.getElementById('pageTitle');
  el.langLabel = document.getElementById('langLabel');
  el.langSelect = document.getElementById('langSelect');

  el.uploadHeading = document.getElementById('uploadHeading');
  el.fileLabel = document.getElementById('fileLabel');
  el.fileInput = document.getElementById('fileInput');
  el.fileHint = document.getElementById('fileHint');

  el.previewCard = document.getElementById('previewCard');
  el.previewName = document.getElementById('previewName');
  el.previewSize = document.getElementById('previewSize');
  el.previewImage = document.getElementById('previewImage');

  el.cookieLabel = document.getElementById('cookieLabel');
  el.cookieInput = document.getElementById('cookieInput');
  el.cookieHint = document.getElementById('cookieHint');
  el.cookieHelp = document.getElementById('cookieHelp');
  el.cookieGuideLink = document.getElementById('cookieGuideLink');
  el.rememberCookie = document.getElementById('rememberCookie');
  el.rememberLabel = document.getElementById('rememberLabel');
  el.clearCookieBtn = document.getElementById('clearCookieBtn');

  el.verifyLabel = document.getElementById('verifyLabel');
  el.verifyHint = document.getElementById('verifyHint');
  el.turnstileBox = document.getElementById('turnstileBox');

  el.submitBtn = document.getElementById('submitBtn');
  el.statusBar = document.getElementById('statusBar');

  el.resultModal = document.getElementById('resultModal');
  el.modalBackdrop = document.getElementById('modalBackdrop');
  el.closeModalBtn = document.getElementById('closeModalBtn');
  el.closeModalBtnBottom = document.getElementById('closeModalBtnBottom');
  el.resultHeading = document.getElementById('resultHeading');
  el.resultDesc = document.getElementById('resultDesc');
  el.resultImage = document.getElementById('resultImage');
  el.urlLabel = document.getElementById('urlLabel');
  el.imageUrlOutput = document.getElementById('imageUrlOutput');
  el.mdLabel = document.getElementById('mdLabel');
  el.markdownOutput = document.getElementById('markdownOutput');
  el.copyUrlBtn = document.getElementById('copyUrlBtn');
  el.copyMdBtn = document.getElementById('copyMdBtn');
  el.openImageLink = document.getElementById('openImageLink');
}

function bindEvents() {
  el.langSelect.addEventListener('change', () => {
    state.lang = el.langSelect.value;
    saveLang(state.lang);
    applyI18n();
  });

  el.fileInput.addEventListener('change', () => {
    updatePreview();
    updateSubmitState();
  });

  el.cookieInput.addEventListener('input', () => {
    syncCookieStorage();
    updateSubmitState();
  });

  el.rememberCookie.addEventListener('change', () => {
    syncCookieStorage();
  });

  el.clearCookieBtn.addEventListener('click', () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.cookie);
      localStorage.removeItem(STORAGE_KEYS.rememberCookie);
    } catch (_) {}
    el.cookieInput.value = '';
    el.rememberCookie.checked = false;
    setStatus(t('cookieCleared'), 'ok');
    updateSubmitState();
  });

  document.getElementById('uploadForm').addEventListener('submit', handleSubmit);

  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      try {
        await navigator.clipboard.writeText(target.value || '');
        setStatus(t('copyOk'), 'ok');
      } catch (_) {
        setStatus(t('copyFail'), 'err');
      }
    });
  });

  el.modalBackdrop.addEventListener('click', closeModal);
  el.closeModalBtn.addEventListener('click', closeModal);
  el.closeModalBtnBottom.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !el.resultModal.hidden) {
      closeModal();
    }
  });
}

async function initConfig() {
  try {
    const resp = await fetch('/api/config', { cache: 'no-store' });
    const data = await resp.json();

    if (!resp.ok || !data?.ok || !data?.turnstileSiteKey) {
      throw new Error(data?.message || t('configFail'));
    }

    state.turnstileSiteKey = data.turnstileSiteKey;
    state.maxUploadBytes = Number(data.maxUploadBytes || DEFAULT_MAX_BYTES);

    updateFileHint();
    renderTurnstileIfReady();
  } catch (err) {
    setVerifyHint('error');
    setStatus(err?.message || t('configFail'), 'err');
  }
}

function renderTurnstileIfReady() {
  if (!window.__turnstileLoaded) return;
  if (!state.turnstileSiteKey) return;
  if (state.turnstileWidgetId !== null) return;
  if (!window.turnstile) return;

  state.turnstileWidgetId = window.turnstile.render('#turnstileBox', {
    sitekey: state.turnstileSiteKey,
    theme: 'auto',
    callback(token) {
      state.turnstileToken = token || '';
      setVerifyHint('ready');
      updateSubmitState();
    },
    'expired-callback'() {
      state.turnstileToken = '';
      setVerifyHint('expired');
      updateSubmitState();
    },
    'timeout-callback'() {
      state.turnstileToken = '';
      setVerifyHint('expired');
      updateSubmitState();
    },
    'error-callback'() {
      state.turnstileToken = '';
      setVerifyHint('error');
      updateSubmitState();
    },
  });

  setVerifyHint('idle');
}

async function handleSubmit(event) {
  event.preventDefault();

  const file = el.fileInput.files?.[0];
  const cookie = el.cookieInput.value.trim();

  if (!file) {
    setStatus(t('pickImage'), 'err');
    return;
  }

  if (!file.type || !file.type.startsWith('image/')) {
    setStatus(t('imageOnly'), 'err');
    return;
  }

  if (file.size > state.maxUploadBytes) {
    setStatus(t('sizeExceeded'), 'err');
    return;
  }

  if (!cookie) {
    setStatus(t('cookieRequired'), 'err');
    return;
  }

  if (!state.turnstileToken) {
    setStatus(t('verifyRequired'), 'err');
    return;
  }

  syncCookieStorage();
  setStatus(t('uploading'));
  el.submitBtn.disabled = true;
  el.submitBtn.setAttribute('aria-busy', 'true');

  const fd = new FormData();
  fd.append('file', file);
  fd.append('cookie', cookie);
  fd.append('cf-turnstile-response', state.turnstileToken);

  try {
    const resp = await fetch('/api/upload', {
      method: 'POST',
      body: fd,
    });

    const text = await resp.text();
    let data = null;

    try {
      data = JSON.parse(text);
    } catch (_) {
      data = { ok: false, message: text || t('uploadFail') };
    }

    if (!resp.ok || !data?.ok) {
      throw new Error(data?.message || t('uploadFail'));
    }

    showResult(data);
    openModal();
    setStatus(t('uploadOk'), 'ok');
  } catch (err) {
    closeModal(true);
    setStatus(err?.message || t('uploadFail'), 'err');
  } finally {
    state.turnstileToken = '';
    if (window.turnstile && state.turnstileWidgetId !== null) {
      window.turnstile.reset(state.turnstileWidgetId);
      setVerifyHint('idle');
    }
    el.submitBtn.removeAttribute('aria-busy');
    updateSubmitState();
  }
}

function showResult(data) {
  const imageUrl = data.imageUrl || '';
  const markdown = data.markdown || '';
  const alt = t('resultImageAlt');

  el.imageUrlOutput.value = imageUrl;
  el.markdownOutput.value = markdown;
  el.openImageLink.href = imageUrl || '#';

  if (imageUrl) {
    el.resultImage.src = imageUrl;
    el.resultImage.alt = alt;
    el.resultImage.hidden = false;
  } else {
    el.resultImage.hidden = true;
    el.resultImage.removeAttribute('src');
  }
}

function openModal() {
  state.lastFocusedElement = document.activeElement;
  el.resultModal.hidden = false;
  el.resultModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    el.closeModalBtn.focus();
  }, 0);
}

function closeModal(silent = false) {
  if (el.resultModal.hidden) return;
  el.resultModal.hidden = true;
  el.resultModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (!silent && state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
    state.lastFocusedElement.focus();
  }
}

function updatePreview() {
  const file = el.fileInput.files?.[0];

  if (!file) {
    el.previewCard.classList.add('empty');
    el.previewName.textContent = t('emptyPreviewName');
    el.previewSize.textContent = '-';
    el.previewImage.hidden = true;
    el.previewImage.removeAttribute('src');
    return;
  }

  el.previewCard.classList.remove('empty');
  el.previewName.textContent = file.name;
  el.previewSize.textContent = formatBytes(file.size);

  if (file.type && file.type.startsWith('image/')) {
    const objectUrl = URL.createObjectURL(file);
    el.previewImage.src = objectUrl;
    el.previewImage.alt = file.name;
    el.previewImage.hidden = false;
    el.previewImage.onload = () => URL.revokeObjectURL(objectUrl);
  } else {
    el.previewImage.hidden = true;
    el.previewImage.removeAttribute('src');
  }
}

function updateSubmitState() {
  const file = el.fileInput.files?.[0];
  const cookie = el.cookieInput.value.trim();
  const ready = !!file && !!cookie && !!state.turnstileToken;
  el.submitBtn.disabled = !ready;
}

function updateFileHint() {
  const mb = (state.maxUploadBytes / 1024 / 1024).toFixed(1);
  const map = {
    'zh-Hans': `单张，小于 ${mb} MB`,
    'zh-Hant': `單張，小於 ${mb} MB`,
    en: `Single image, under ${mb} MB`,
  };
  el.fileHint.textContent = map[state.lang] || map['zh-Hans'];
}

function setVerifyHint(type) {
  let message = t('verifyHintIdle');
  if (type === 'ready') message = t('verifyHintReady');
  if (type === 'expired') message = t('verifyHintExpired');
  if (type === 'error') message = t('verifyHintError');
  el.verifyHint.textContent = message;
}

function applyI18n() {
  document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
  document.title = t('pageTitle');

  el.pageTitle.textContent = t('pageTitle');
  el.langLabel.textContent = t('langLabel');
  el.uploadHeading.textContent = t('uploadHeading');
  el.fileLabel.textContent = t('fileLabel');
  updateFileHint();

  el.cookieLabel.textContent = t('cookieLabel');
  el.cookieHint.textContent = t('cookieHint');
  el.cookieGuideLink.href = COOKIE_GUIDE_URL;
  el.cookieGuideLink.textContent = t('cookieHelpLink');
  el.cookieHelp.innerHTML = `${escapeHtml(t('cookieHelpPrefix'))} <a id="cookieGuideLinkInline" class="inline-link" href="${COOKIE_GUIDE_URL}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(t('cookieHelpLink'))}</a>${escapeHtml(t('cookieHelpSuffix'))}`;
  const inlineLink = document.getElementById('cookieGuideLinkInline');
  if (inlineLink) inlineLink.setAttribute('aria-label', t('cookieHelpLink'));

  el.rememberLabel.textContent = t('rememberLabel');
  el.clearCookieBtn.textContent = t('clearCookieBtn');

  el.verifyLabel.textContent = t('verifyLabel');
  if (!state.turnstileToken) {
    setVerifyHint('idle');
  }

  el.submitBtn.textContent = t('submitBtn');

  el.resultHeading.textContent = t('resultHeading');
  el.resultDesc.textContent = t('resultDesc');
  el.urlLabel.textContent = t('urlLabel');
  el.mdLabel.textContent = t('mdLabel');
  el.copyUrlBtn.textContent = t('copyUrlBtn');
  el.copyMdBtn.textContent = t('copyMdBtn');
  el.openImageLink.textContent = t('openImageLink');
  el.closeModalBtnBottom.textContent = t('closeModal');

  if (!el.fileInput.files?.[0]) {
    el.previewName.textContent = t('emptyPreviewName');
  }
}

function t(key) {
  return I18N[state.lang]?.[key] || I18N['zh-Hans'][key] || key;
}

function loadLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.lang);
    if (stored && I18N[stored]) return stored;
  } catch (_) {}

  const nav = (navigator.language || '').toLowerCase();
  if (nav.includes('hant') || nav.includes('zh-hk') || nav.includes('zh-tw') || nav.includes('zh-mo')) {
    return 'zh-Hant';
  }
  if (nav.startsWith('zh')) return 'zh-Hans';
  return 'en';
}

function saveLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
  } catch (_) {}
}

function restoreCookiePreference() {
  try {
    const remember = localStorage.getItem(STORAGE_KEYS.rememberCookie) === '1';
    const cookie = localStorage.getItem(STORAGE_KEYS.cookie) || '';
    el.rememberCookie.checked = remember;
    if (remember && cookie) {
      el.cookieInput.value = cookie;
    }
  } catch (_) {}
}

function syncCookieStorage() {
  try {
    if (el.rememberCookie.checked) {
      localStorage.setItem(STORAGE_KEYS.rememberCookie, '1');
      localStorage.setItem(STORAGE_KEYS.cookie, el.cookieInput.value);
      if (el.cookieInput.value.trim()) {
        setStatus(t('cookieSaved'), 'ok');
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.rememberCookie);
      localStorage.removeItem(STORAGE_KEYS.cookie);
    }
  } catch (_) {}
}

function setStatus(message, type = '') {
  el.statusBar.textContent = message || '';
  el.statusBar.className = `status-bar ${type}`.trim();
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}