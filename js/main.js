(function () {
  'use strict';

  var cs = new CSInterface();
  var SystemPath = CSInterface.SystemPath || window.SystemPath;
  var extPath = cs.getSystemPath(SystemPath.EXTENSION);
  var EXTENSION_ID = cs.getExtensionID();
  var WINDOW_EXTENSION_ID = 'ps.image.capture.window';

  var DEFAULT_URL = 'https://www.iconfont.cn/?spm=a313x.search_index.i3.d4d0a486a.74c03a81eM2SiP';
  var STORAGE_KEY = 'psex_saved_urls';
  var LAST_URL_KEY = 'psex_last_url';
  var SYNC_STORAGE_KEY = 'psex_page_sync';
  var SYNC_MIGRATE_KEY = 'psex_sync_migrated_20260131';
  var SCALE_STORAGE_KEY = 'psex_scale_insert';
  var JPEG_STORAGE_KEY = 'psex_jpeg_insert';
  var PY_STORAGE_KEY = 'psex_python_transcode';
  var ORIG_STORAGE_KEY = 'psex_original_mode';
  var VIEW_STORAGE_KEY = 'psex_view_mode';
  var ZOOM_STORAGE_KEY = 'psex_page_zoom';
  var RECENT_STORAGE_KEY = 'psex_recent_urls';
  var RECENT_MAX = 8;
  var ZOOM_DEFAULT = 1.1;
  var AI_STORAGE_KEY = 'niu_ai_settings';
  var AI_MODEL_KEY = 'niu_ai_models';
  var AI_MODEL_VERSION = '2026-01-30-full';
  var AI_DEBUG_KEY = 'psex_ai_debug';
  var AI_AUTH_COLLAPSE_KEY = 'niu_ai_auth_collapsed';
  var SYNC_DEFAULTS = { enabled: false, interval: 4, timerEnabled: false };
  var SCALE_DEFAULTS = { enabled: true, maxSide: 3000 };
  var JPEG_DEFAULTS = { enabled: false, quality: 85 };
  var PY_DEFAULTS = { enabled: false };
  var ORIG_DEFAULTS = { enabled: false };
  var AI_IMAGE_PRESETS = [
    { ratio: '1:1', orient: '方', sizes: ['2048x2048', '3072x3072', '4096x4096'] },
    { ratio: '16:9', orient: '横', sizes: ['2560x1440', '3200x1800', '3840x2160'] },
    { ratio: '9:16', orient: '竖', sizes: ['1440x2560', '1800x3200', '2160x3840'] },
    { ratio: '4:3', orient: '横', sizes: ['2560x1920', '3200x2400', '4096x3072'] },
    { ratio: '3:4', orient: '竖', sizes: ['1920x2560', '2400x3200', '3072x4096'] },
    { ratio: '3:2', orient: '横', sizes: ['2400x1600', '3000x2000', '3600x2400'] },
    { ratio: '2:3', orient: '竖', sizes: ['1600x2400', '2000x3000', '2400x3600'] }
  ];
  var AI_IMAGE_LABELS = [];
  var AI_IMAGE_LABEL_TO_SIZE = {};
  var AI_IMAGE_SIZE_TO_LABEL = {};
  var AI_IMAGE_SIZES_DEFAULT = [];
  AI_IMAGE_PRESETS.forEach(function (preset) {
    preset.sizes.forEach(function (s) {
      var label = preset.ratio + ' ' + preset.orient + ' (' + s + ')';
      AI_IMAGE_LABELS.push(label);
      AI_IMAGE_LABEL_TO_SIZE[label] = s;
      if (!AI_IMAGE_SIZE_TO_LABEL[s]) AI_IMAGE_SIZE_TO_LABEL[s] = label;
      AI_IMAGE_SIZES_DEFAULT.push(s);
    });
  });
  var AI_IMAGE_SIZES_LARGE = AI_IMAGE_SIZES_DEFAULT.slice();
  var AI_SIZE_MIN_PIXELS = 3686400;
  var AI_SIZE_MAX_PIXELS = 16777216;
  var AI_SIZE_MAX_W = 4096;
  var AI_SIZE_MAX_H = 4096;
  var AI_SIZE_MULTIPLE = 16;
  var AI_MODEL_DEFAULTS = [
    { id: 'doubao-seed-1-8-251228', name: '豆包 Seed 1.8', type: 'text', tier: 'pro' },
    { id: 'glm-4-7-251222', name: 'GLM-4.7', type: 'text', tier: 'pro' },
    { id: 'doubao-seed-code-preview-251028', name: '豆包 Seed Code 预览', type: 'text', tier: 'pro' },
    { id: 'doubao-seed-1-6-vision-250815', name: '豆包 Seed 1.6 Vision', type: 'text', tier: 'pro' },
    { id: 'doubao-seed-1-6-flash-250828', name: '豆包 Seed 1.6 Flash', type: 'text', tier: 'lite' },
    { id: 'doubao-seed-1-6-lite-251015', name: '豆包 Seed 1.6 Lite', type: 'text', tier: 'lite' },
    { id: 'doubao-seed-translation-250915', name: '豆包 Seed 翻译', type: 'text', tier: 'standard' },

    { id: 'doubao-seed-1-6-251015', name: '豆包 Seed 1.6', type: 'text', tier: 'pro' },
    { id: 'doubao-seed-1-6-250615', name: '豆包 Seed 1.6(旧)', type: 'text', tier: 'pro' },
    { id: 'doubao-seed-1-6-flash-250715', name: '豆包 Seed 1.6 Flash(待下线)', type: 'text', tier: 'lite' },
    { id: 'doubao-seed-1-6-flash-250615', name: '豆包 Seed 1.6 Flash(旧)', type: 'text', tier: 'lite' },
    { id: 'doubao-seed-1-6-thinking-250615', name: '豆包 Seed 1.6 Thinking(待下线)', type: 'text', tier: 'pro' },
    { id: 'doubao-seed-1-6-thinking-250715', name: '豆包 Seed 1.6 Thinking(待下线2)', type: 'text', tier: 'pro' },

    { id: 'doubao-1-5-thinking-pro-250415', name: '豆包 1.5 Thinking Pro(待下线)', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-thinking-pro-m-250428', name: '豆包 1.5 Thinking Pro-M(待下线)', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-thinking-vision-pro-250428', name: '豆包 1.5 Thinking Vision Pro(待下线)', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-vision-pro-250328', name: '豆包 1.5 Vision Pro(待下线)', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-vision-pro-32k-250115', name: '豆包 1.5 Vision Pro 32k', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-vision-lite-250315', name: '豆包 1.5 Vision Lite(待下线)', type: 'text', tier: 'lite' },
    { id: 'doubao-1-5-ui-tars-250428', name: '豆包 1.5 UI-TARS(待下线)', type: 'text', tier: 'pro' },

    { id: 'doubao-1-5-pro-32k-250115', name: '豆包 1.5 Pro 32k', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-pro-32k-character-250715', name: '豆包 1.5 Pro 32k 角色', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-pro-32k-character-250228', name: '豆包 1.5 Pro 32k 角色(旧)', type: 'text', tier: 'pro' },
    { id: 'doubao-1-5-lite-32k-250115', name: '豆包 1.5 Lite 32k', type: 'text', tier: 'lite' },
    { id: 'doubao-lite-32k-character-250228', name: '豆包 Lite 32k 角色', type: 'text', tier: 'lite' },

    { id: 'deepseek-v3-2-251201', name: 'DeepSeek V3.2', type: 'text', tier: 'pro' },
    { id: 'deepseek-v3-1-terminus', name: 'DeepSeek V3.1 Terminus', type: 'text', tier: 'pro' },
    { id: 'deepseek-v3-1-250821', name: 'DeepSeek V3.1', type: 'text', tier: 'pro' },
    { id: 'deepseek-v3-250324', name: 'DeepSeek V3(旧)', type: 'text', tier: 'standard' },
    { id: 'deepseek-r1-250528', name: 'DeepSeek R1', type: 'text', tier: 'pro' },

    { id: 'kimi-k2-thinking-251104', name: 'Kimi K2 Thinking', type: 'text', tier: 'pro' },
    { id: 'kimi-k2-250905', name: 'Kimi K2', type: 'text', tier: 'standard' },

    { id: 'doubao-seedream-4-5-251128', name: '即梦 4.5', type: 'image', tier: 'pro' },
    { id: 'doubao-seedream-4-0-250828', name: '即梦 4.0', type: 'image', tier: 'lite' },
    { id: 'doubao-seedream-3-0-t2i-250415', name: '即梦 3.0 文生图', type: 'image', tier: 'standard' },
    { id: 'doubao-seededit-3-0-i2i-250628', name: 'SeedEdit 3.0 图片编辑(待下线)', type: 'image', tier: 'standard' },

    { id: 'doubao-seedance-1-5-pro-251215', name: 'Seedance 1.5 Pro', type: 'video', tier: 'pro' },
    { id: 'doubao-seedance-1-0-pro-250528', name: 'Seedance 1.0 Pro', type: 'video', tier: 'pro' },
    { id: 'doubao-seedance-1-0-pro-fast-251015', name: 'Seedance 1.0 Pro Fast', type: 'video', tier: 'pro' },
    { id: 'doubao-seedance-1-0-lite-t2v-250428', name: 'Seedance 1.0 Lite 文生', type: 'video', tier: 'lite' },
    { id: 'doubao-seedance-1-0-lite-i2v-250428', name: 'Seedance 1.0 Lite 图生', type: 'video', tier: 'lite' },

    { id: 'doubao-seed3d-1-0-250928', name: 'Seed3D 1.0', type: '3d', tier: 'pro' },

    { id: 'doubao-embedding-large-text-250515', name: '向量-文本 Large(待下线)', type: 'embedding', tier: 'pro' },
    { id: 'doubao-embedding-large-text-240915', name: '向量-文本 Large(待下线旧)', type: 'embedding', tier: 'pro' },
    { id: 'doubao-embedding-text-240715', name: '向量-文本(待下线)', type: 'embedding', tier: 'standard' },

    { id: 'doubao-embedding-vision-251215', name: '向量-多模态 251215', type: 'embedding-mm', tier: 'pro' },
    { id: 'doubao-embedding-vision-250615', name: '向量-多模态 250615', type: 'embedding-mm', tier: 'pro' },
    { id: 'doubao-embedding-vision-250328', name: '向量-多模态 250328', type: 'embedding-mm', tier: 'standard' }
  ];
  var AI_FEATURES = [
    { id: 'image', type: 'image', name: '图像生成', category: '图像生成', icon: '🖼️' },
    { id: 'video', type: 'video', name: '视频生成', category: '视频生成', icon: '🎬' },
    { id: 'text', type: 'text', name: '文本助手', category: '文本', icon: '✍️' },
    { id: '3d', type: '3d', name: '3D 模型', category: '3D', icon: '🧊' },
    { id: 'embedding', type: 'embedding', name: '文本向量', category: '向量', icon: '🔎' },
    { id: 'embedding-mm', type: 'embedding-mm', name: '多模态向量', category: '向量', icon: '🌈' }
  ];
  var AI_DEFAULTS = {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/',
    apiKey: '',
    type: 'image',
    tier: 'all',
    imageSize: '2048x2048',
    imageSizeMode: 'preset',
    imageCount: 1,
    imageUseLayer: false,
    imageInsertMode: 'insert',
    aiPythonSpeed: false,
    aiPythonMaxSide: 2000,
    aiPythonQuality: 80,
    textTask: 'rewrite',
    featureParams: {},
    selectedModelMap: {},
    customModelMap: {}
  };

  var appMenuBtn = document.getElementById('appMenuBtn');
  var appMenu = document.getElementById('appMenu');
  var toolLabel = document.getElementById('toolLabel');
  var urlInput = document.getElementById('urlInput');
  var bookmarkBtn = document.getElementById('bookmarkBtn');
  var siteSearchGroup = document.getElementById('siteSearchGroup');
  var siteSearchInput = document.getElementById('siteSearchInput');
  var siteSearchBtn = document.getElementById('siteSearchBtn');
  var captureBusyEl = document.getElementById('captureBusy');
  var captureBusyTextEl = document.getElementById('captureBusyText');
  var captureMenu = document.getElementById('captureMenu');
  var menuCheckOriginal = document.getElementById('menuCheckOriginal');
  var menuCheckCapture = document.getElementById('menuCheckCapture');
  var saveBtn = document.getElementById('saveBtn');
  var clearSiteBtn = document.getElementById('clearSiteBtn');
  var goBtn = document.getElementById('goBtn');
  var siteTitleEl = document.getElementById('siteTitle');
  var captureModeToggle = document.getElementById('captureModeToggle');
  var captureHintEl = document.getElementById('captureHint');
  var favBar = document.querySelector('.fav-bar');
  var favToggleBtn = document.getElementById('favToggle');
  var bookmarkPanel = document.getElementById('bookmarkPanel');
  var bookmarkCloseBtn = document.getElementById('bookmarkClose');
  var bookmarkListEl = document.getElementById('bookmarkList');
  var aiBtn = document.getElementById('aiBtn');
  var aiPanel = document.getElementById('aiPanel');
  var aiCloseBtn = document.getElementById('aiClose');
  var aiAuthSection = document.getElementById('aiAuthSection');
  var aiAuthToggle = document.getElementById('aiAuthToggle');
  var aiAuthBody = document.getElementById('aiAuthBody');
  var aiAuthSummary = document.getElementById('aiAuthSummary');
  var aiAuthStatus = document.getElementById('aiAuthStatus');
  var aiKeyInput = document.getElementById('aiKey');
  var aiBaseUrlInput = document.getElementById('aiBaseUrl');
  var aiSaveBtn = document.getElementById('aiSaveBtn');
  var aiTypeSelect = document.getElementById('aiType');
  var aiTypeDropdown = document.getElementById('aiTypeDropdown');
  var aiTypeToggle = document.getElementById('aiTypeToggle');
  var aiTypePanel = document.getElementById('aiTypePanel');
  var aiTypeLabel = document.getElementById('aiTypeLabel');
  var aiTypeIcon = document.getElementById('aiTypeIcon');
  var aiTypeBadge = document.getElementById('aiTypeBadge');
  var aiTypeSearch = document.getElementById('aiTypeSearch');
  var aiTypeList = document.getElementById('aiTypeList');
  var aiTierSelect = document.getElementById('aiTier');
  var aiModelSelect = document.getElementById('aiModelSelect');
  var aiModelManageBtn = document.getElementById('aiModelManage');
  var aiModelPanel = document.getElementById('aiModelPanel');
  var aiModelListInput = document.getElementById('aiModelList');
  var aiModelSaveBtn = document.getElementById('aiModelSave');
  var aiModelResetBtn = document.getElementById('aiModelReset');
  var aiModelCustomInput = document.getElementById('aiModelCustom');
  var aiModelCustomRow = aiModelCustomInput ? aiModelCustomInput.parentElement : null;
  var aiImageSizeInput = document.getElementById('aiImageSizeInput');
  var aiImageSizeToggle = document.getElementById('aiImageSizeToggle');
  var aiImageSizePanel = document.getElementById('aiImageSizePanel');
  var aiImageCountInput = document.getElementById('aiImageCount');
  var aiUseLayerInput = document.getElementById('aiUseLayer');
  var aiImageInsertModeSelect = document.getElementById('aiImageInsertMode');
  var aiPythonSpeedInput = document.getElementById('aiPythonSpeed');
  var aiPythonMaxSideInput = document.getElementById('aiPythonMaxSide');
  var aiPythonQualityInput = document.getElementById('aiPythonQuality');
  var aiPromptInput = document.getElementById('aiPrompt');
  var aiVideoImageInput = document.getElementById('aiVideoImage');
  var aiTextTaskSelect = document.getElementById('aiTextTask');
  var aiTextInput = document.getElementById('aiTextInput');
  var aiTextOutput = document.getElementById('aiTextOutput');
  var aiTextGenerateBtn = document.getElementById('aiTextGenerate');
  var aiTextInsertBtn = document.getElementById('aiTextInsert');
  var aiGenerateBtn = document.getElementById('aiGenerateBtn');
  var aiResultEl = document.getElementById('aiResult');
  var aiStatusEl = document.getElementById('aiStatus');
  var aiPreviewEl = document.getElementById('aiPreview');
  var aiPreviewImg = document.getElementById('aiPreviewImg');
  var aiPreviewCloseBtn = document.getElementById('aiPreviewClose');
  var aiPreviewFitBtn = document.getElementById('aiPreviewFit');
  var aiPreview50Btn = document.getElementById('aiPreview50');
  var aiPreview100Btn = document.getElementById('aiPreview100');
  var aiPreview200Btn = document.getElementById('aiPreview200');
  var aiPreview400Btn = document.getElementById('aiPreview400');
  var aiPreviewZoomOutBtn = document.getElementById('aiPreviewZoomOut');
  var aiPreviewZoomInBtn = document.getElementById('aiPreviewZoomIn');
  var aiPreviewMaxBtn = document.getElementById('aiPreviewMax');
  var aiPreviewBody = document.getElementById('aiPreviewBody');
  var aiPreviewPromptEl = document.getElementById('aiPreviewPrompt');
  var aiPreviewPromptText = document.getElementById('aiPreviewPromptText');
  var aiPreviewCopyPromptBtn = document.getElementById('aiPreviewCopyPrompt');
  var aiHistoryEl = document.getElementById('aiHistory');
  var aiHistoryCloseBtn = document.getElementById('aiHistoryClose');
  var aiHistoryMaxBtn = document.getElementById('aiHistoryMax');
  var aiHistoryFixedBtn = document.getElementById('aiHistoryFixed');
  var aiHistoryTabs = document.getElementById('aiHistoryTabs');
  var aiHistoryImagesEl = document.getElementById('aiHistoryImages');
  var aiHistoryTextsEl = document.getElementById('aiHistoryTexts');
  var syncToggle = document.getElementById('syncToggle');
  var syncTimerToggle = document.getElementById('syncTimerToggle');
  var syncIntervalInput = document.getElementById('syncInterval');
  var scaleToggle = document.getElementById('scaleToggle');
  var scaleMaxInput = document.getElementById('scaleMax');
  var jpegToggle = document.getElementById('jpegToggle');
  var jpegQualityInput = document.getElementById('jpegQuality');
  var pyToggle = document.getElementById('pyToggle');
  var origToggle = document.getElementById('origToggle');
  var viewToggle = document.getElementById('viewToggle');
  var FAV_COLLAPSE_KEY = 'psex_fav_collapsed';
  var CAPTURE_MODE_KEY = 'psex_capture_mode';
  var homeUrlInput = document.getElementById('homeUrlInput');
  var homeGoBtn = document.getElementById('homeGoBtn');
  var browserHome = document.getElementById('browserHome');
  var recentListEl = document.getElementById('recentList');
  var openBtn = document.getElementById('openBtn');
  var homeBtn = document.getElementById('homeBtn');
  var backBtn = document.getElementById('backBtn');
  var forwardBtn = document.getElementById('forwardBtn');
  var reloadBtn = document.getElementById('reloadBtn');
  var injectBtn = document.getElementById('injectBtn');
  var browser = document.getElementById('browser');
  var statusEl = document.getElementById('status');

  var lastInsertTs = 0;
  var lastInsertUrl = '';
  var lastPageTitle = '';
  var lastPageUrl = '';
  var isEditingUrl = false;
  var pendingUrl = '';
  var urlUserChanged = false;
  var currentMode = 'browser';
  var sideButtons = document.querySelectorAll('.side-btn');
  var aiState = null;
  var aiModels = [];
  var syncState = null;
  var scaleState = null;
  var jpegState = null;
  var pythonState = null;
  var originalState = null;
  var viewState = null;
  var zoomState = { value: 1 };
  var captureModeEnabled = true;
  var navHistory = [];
  var navIndex = -1;
  var lastGoodUrl = '';
  var lastErrorUrl = '';
  var aiSelectedId = null;
  var aiGeneratedImages = [];
  var aiExpectedCount = 0;
  var aiResultItems = [];
  var aiPreviewMode = 'fit';
  var aiPreviewScale = 1;
  var aiPreviewTranslateX = 0;
  var aiPreviewTranslateY = 0;
  var AI_PREVIEW_MIN_SCALE = 0.25;
  var AI_PREVIEW_MAX_SCALE = 4;
  var aiHistoryIsMax = false;
  var aiPreviewItem = null;
  var aiPreviewIsMax = false;
  var aiPreviewDrag = { active: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 };
  var aiInitDone = false;

  var nodeRequire = (typeof window !== 'undefined' && window.require) ? window.require : null;
  var pythonBusy = false;
  var pythonExecCache = '';
  var captureBusyCount = 0;
  var lastContextPoint = null;
  var lastContextUrl = '';
  var lastContextHasImage = false;
  var isBrowserFullscreen = false;
  var pendingViewMode = null;

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'status' + (type ? ' ' + type : '');
  }

  function setCaptureBusy(on) {
    if (on) captureBusyCount += 1;
    else captureBusyCount = Math.max(0, captureBusyCount - 1);
    if (!captureBusyEl) return;
    captureBusyEl.classList.toggle('active', captureBusyCount > 0);
    if (captureBusyCount === 0 && captureBusyTextEl) captureBusyTextEl.textContent = '';
  }

  function setCaptureBusyProgress(value) {
    if (!captureBusyTextEl) return;
    var v = parseInt(value, 10);
    if (isNaN(v)) return;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    captureBusyTextEl.textContent = v > 0 ? (String(v) + '%') : '';
  }

  function setBrowserFullscreen(on) {
    isBrowserFullscreen = !!on;
    document.body.classList.toggle('browser-fullscreen', isBrowserFullscreen);
  }

  function getFullscreenSize() {
    var maxW = 8000;
    var maxH = 4000;
    var sw = (window.screen && (window.screen.availWidth || window.screen.width)) || 3000;
    var sh = (window.screen && (window.screen.availHeight || window.screen.height)) || 2000;
    var w = Math.round(sw);
    var h = Math.round(sh);
    if (w < 1200) w = 1200;
    if (h < 900) h = 900;
    if (w > maxW) w = maxW;
    if (h > maxH) h = maxH;
    return { width: w, height: h };
  }

  function toggleBrowserFullscreen() {
    var shouldEnable = !isBrowserFullscreen;
    setBrowserFullscreen(shouldEnable);
    try {
      if (cs && typeof cs.resizeContent === 'function') {
        if (isBrowserFullscreen) {
          var size = getFullscreenSize();
          cs.resizeContent(size.width, size.height);
        } else {
          if (EXTENSION_ID === WINDOW_EXTENSION_ID) {
            cs.resizeContent(720, 1100);
          } else {
            cs.resizeContent(720, 1100);
          }
        }
      }
    } catch (e) {}
  }

  function sendViewModeFromState() {
    var mode = (viewState && viewState.enabled) ? 'original' : 'capture';
    if (browser && browser.contentWindow) {
      try {
        browser.contentWindow.postMessage({ type: 'PSEX_VIEW_MODE', mode: mode }, '*');
      } catch (e) {}
      pendingViewMode = null;
    } else {
      pendingViewMode = mode;
    }
  }

  function updateCaptureMenuChecks() {
    if (menuCheckOriginal) {
      menuCheckOriginal.classList.toggle('active', !!(viewState && viewState.enabled));
    }
    if (menuCheckCapture) {
      menuCheckCapture.classList.toggle('active', !!captureModeEnabled);
    }
  }

  function hideCaptureMenu() {
    if (!captureMenu) return;
    captureMenu.classList.remove('open');
  }

  function showCaptureMenu(pos, info) {
    if (!captureMenu) return;
    lastContextPoint = pos || null;
    lastContextUrl = (info && info.url) ? info.url : '';
    lastContextHasImage = !!(info && info.hasImage);
    updateCaptureMenuChecks();
    var btnInsert = captureMenu.querySelector('[data-action="insert"]');
    var btnOpen = captureMenu.querySelector('[data-action="open"]');
    if (btnInsert) btnInsert.disabled = !lastContextPoint || !captureModeEnabled;
    if (btnOpen) btnOpen.disabled = !lastContextUrl;
    captureMenu.style.left = Math.max(6, pos.x) + 'px';
    captureMenu.style.top = Math.max(6, pos.y) + 'px';
    captureMenu.classList.add('open');
  }

  function updateUrlInput(url) {
    if (!urlInput || !url) return;
    if (isEditingUrl) {
      if (!urlUserChanged) pendingUrl = url;
      return;
    }
    if (urlInput.value !== url) urlInput.value = url;
    try { localStorage.setItem(LAST_URL_KEY, url); } catch (e) {}
  }

  function shouldIgnoreOpenUrl(url) {
    var v = (url || '').trim();
    if (!v) return true;
    var lower = v.toLowerCase();
    if (lower === '#' || lower === '#/' || lower.charAt(0) === '#' || lower === 'about:blank') return true;
    if (lower.indexOf('javascript:') === 0) return true;
    if (lower.indexOf('mailto:') === 0) return true;
    if (lower.indexOf('tel:') === 0) return true;
    return false;
  }

  var nodeModules = null;
  function getNodeModules() {
    if (nodeModules) return nodeModules;
    if (!nodeRequire) return null;
    try {
      nodeModules = {
        child_process: nodeRequire('child_process'),
        path: nodeRequire('path'),
        os: nodeRequire('os'),
        fs: nodeRequire('fs'),
        process: nodeRequire('process')
      };
      return nodeModules;
    } catch (e) {
      return null;
    }
  }


  function getPythonScriptPath(mods) {
    try {
      return mods.path.join(extPath, 'py', 'transcode.py');
    } catch (e) {
      return '';
    }
  }

  function getPythonCandidates(mods) {
    var list = [];
    try {
      var env = mods.process && mods.process.env ? mods.process.env : {};
      if (env.PYTHON) list.push(env.PYTHON);
      if (env.PYTHON_PATH) list.push(env.PYTHON_PATH);
    } catch (e) {}
    list.push('python');
    list.push('py');
    return list.filter(function (v, i, arr) { return v && arr.indexOf(v) === i; });
  }

  function runPythonTranscode(url, meta, cb) {
    var mods = getNodeModules();
    if (!mods) {
      cb('NodeJS 未启用');
      return;
    }
    var scriptPath = getPythonScriptPath(mods);
    if (!scriptPath) {
      cb('Python 脚本缺失');
      return;
    }
    var originalMode = !!(originalState && originalState.enabled);
    var maxSide = (scaleState && scaleState.enabled && !originalMode) ? parseInt(scaleState.maxSide || SCALE_DEFAULTS.maxSide, 10) : 0;
    if (isNaN(maxSide) || maxSide < 0) maxSide = 0;
    var jpegEnabled = !!(jpegState && jpegState.enabled) && !originalMode;
    var quality = parseInt(jpegState && jpegState.quality || JPEG_DEFAULTS.quality, 10);
    if (isNaN(quality) || quality < 10) quality = JPEG_DEFAULTS.quality;
    if (quality > 100) quality = 100;
    var format = originalMode ? 'png' : (jpegEnabled ? 'jpeg' : 'png');
    var outDir = mods.os.tmpdir();
    var referer = meta && meta.referer ? meta.referer : '';

    if (arguments.length > 3 && arguments[3]) {
      var override = arguments[3] || {};
      if (typeof override.maxSide === 'number') {
        maxSide = override.maxSide;
      }
      if (override.format) {
        format = override.format;
      }
      if (typeof override.quality === 'number') {
        quality = Math.max(10, Math.min(100, parseInt(override.quality, 10)));
      }
    }

    var argsBase = [
      scriptPath,
      '--url', url,
      '--outdir', outDir,
      '--format', format,
      '--quality', String(quality)
    ];
    if (maxSide > 0) {
      argsBase.push('--max-side');
      argsBase.push(String(maxSide));
    }
    if (referer) {
      argsBase.push('--referer');
      argsBase.push(referer);
    }

    var candidates = pythonExecCache ? [pythonExecCache] : getPythonCandidates(mods);
    var idx = 0;

    function tryNext() {
      if (idx >= candidates.length) {
        cb('Python/Pillow 未安装或不可用');
        return;
      }
      var exe = candidates[idx++];
      var proc = mods.child_process.spawn(exe, argsBase, { windowsHide: true });
      var resolvedPath = '';
      var out = '';
      var err = '';
      var buf = '';
      proc.stdout.on('data', function (d) {
        var chunk = d.toString();
        out += chunk;
        buf += chunk;
        var lines = buf.split(/\r?\n/);
        buf = lines.pop() || '';
        lines.forEach(function (line) {
          var text = (line || '').trim();
          if (!text) return;
          if (text.indexOf('PROGRESS:') === 0) {
            setCaptureBusyProgress(text.replace('PROGRESS:', ''));
          } else if (text.indexOf('RESULT:') === 0) {
            resolvedPath = text.replace('RESULT:', '').trim();
          }
        });
      });
      proc.stderr.on('data', function (d) { err += d.toString(); });
      proc.on('error', function () { tryNext(); });
      proc.on('close', function (code) {
        if (code === 0 && (resolvedPath || out.trim())) {
          pythonExecCache = exe;
          cb(null, resolvedPath || out.trim());
          return;
        }
        tryNext();
      });
    }

    tryNext();
  }

  var aiCacheQueue = [];
  var aiCacheBusy = false;
  var aiCacheDir = '';
  var aiCacheRoot = '';

  function ensureDirPath(mods, dir) {
    if (!mods || !mods.fs || !dir) return false;
    try {
      if (!mods.fs.existsSync(dir)) {
        mods.fs.mkdirSync(dir, { recursive: true });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function getAiCacheRoot() {
    if (aiCacheRoot) return aiCacheRoot;
    var mods = getNodeModules();
    if (!mods) return '';
    var base = '';
    try {
      base = cs.getSystemPath(SystemPath.APPDATA);
    } catch (e) {
      base = '';
    }
    var dir = '';
    try {
      if (base) {
        dir = mods.path.join(base, 'NiuAssistCache');
      } else {
        dir = mods.path.join(extPath, 'cache');
      }
    } catch (e2) {
      dir = '';
    }
    if (!dir) return '';
    if (!ensureDirPath(mods, dir)) return '';
    aiCacheRoot = dir;
    return aiCacheRoot;
  }

  function getAiCacheDir() {
    if (aiCacheDir) return aiCacheDir;
    var mods = getNodeModules();
    if (!mods) return '';
    var root = getAiCacheRoot();
    if (!root) return '';
    var dir = '';
    try {
      dir = mods.path.join(root, 'images');
    } catch (e) {
      dir = '';
    }
    if (!dir) return '';
    if (!ensureDirPath(mods, dir)) return '';
    aiCacheDir = dir;
    return aiCacheDir;
  }

  function extractExtFromUrl(url, fallback) {
    var def = fallback || 'png';
    if (!url) return def;
    if (url.indexOf('data:') === 0) {
      var mime = url.slice(5, url.indexOf(';')) || '';
      if (mime.indexOf('jpeg') !== -1 || mime.indexOf('jpg') !== -1) return 'jpg';
      if (mime.indexOf('webp') !== -1) return 'webp';
      if (mime.indexOf('png') !== -1) return 'png';
      return def;
    }
    var clean = url.split('?')[0];
    var match = clean.match(/\.([a-zA-Z0-9]+)$/);
    if (!match) return def;
    return match[1].toLowerCase();
  }

  function dataUrlToUint8(dataUrl) {
    try {
      var comma = dataUrl.indexOf(',');
      if (comma === -1) return null;
      var base64 = dataUrl.slice(comma + 1);
      var binary = atob(base64);
      var len = binary.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      return null;
    }
  }

  function downloadUrlToFile(url, outPath, cb) {
    var mods = getNodeModules();
    if (!mods || !mods.fs) {
      if (cb) cb('NodeJS 未启用');
      return;
    }
    if (!url || !outPath) {
      if (cb) cb('无效路径');
      return;
    }
    if (url.indexOf('data:') === 0) {
      var bytes = dataUrlToUint8(url);
      if (!bytes) {
        if (cb) cb('解析 dataUrl 失败');
        return;
      }
      var payload = (typeof Buffer !== 'undefined') ? Buffer.from(bytes) : bytes;
      mods.fs.writeFile(outPath, payload, function (err) {
        if (cb) cb(err ? String(err) : null, outPath);
      });
      return;
    }
    fetch(url).then(function (res) {
      return res.arrayBuffer();
    }).then(function (buf) {
      var payload = (typeof Buffer !== 'undefined') ? Buffer.from(buf) : buf;
      mods.fs.writeFile(outPath, payload, function (err) {
        if (cb) cb(err ? String(err) : null, outPath);
      });
    }).catch(function (err) {
      if (cb) cb(String(err));
    });
  }

  function queueAiCache(items, settings) {
    if (!items || !items.length) return;
    var dir = getAiCacheDir();
    if (!dir) return;
    var now = Date.now();
    var usePython = !!(settings && settings.aiPythonSpeed);
    var maxSide = parseInt((settings && settings.aiPythonMaxSide) || 2000, 10);
    if (isNaN(maxSide) || maxSide < 800) maxSide = 2000;
    var quality = parseInt((settings && settings.aiPythonQuality) || 80, 10);
    if (isNaN(quality) || quality < 10) quality = 80;
    if (quality > 100) quality = 100;
    var prompt = (aiPromptInput && aiPromptInput.value || '').trim();
    var modelId = settings ? getSelectedModelId(settings) : '';
    var size = settings ? resolveImageSize(settings) : '';
    items.forEach(function (item, idx) {
      if (!item || !item.url) return;
      if (item._cached) return;
      item._cached = true;
      if (typeof item.progress !== 'number' || item.progress < 1) {
        item.progress = 70;
      }
      updateAiJobProgress(item.id, item.progress);
      var ext = extractExtFromUrl(item.url, 'png');
      var baseName = 't2i_' + now + '_' + (idx + 1);
      var rawPath = dir + '/' + baseName + '.' + ext;
      var optExt = usePython ? 'jpg' : ext;
      var optPath = dir + '/' + baseName + '_opt.' + optExt;
      aiCacheQueue.push({
        item: item,
        url: item.url,
        rawPath: rawPath,
        optPath: optPath,
        usePython: usePython,
        maxSide: maxSide,
        quality: quality,
        isData: item.url.indexOf('data:') === 0,
        meta: {
          id: 'img_' + now + '_' + (idx + 1),
          createdAt: now,
          model: modelId,
          size: size,
          prompt: prompt
        }
      });
    });
    processAiCacheQueue();
  }

  function processAiCacheQueue() {
    if (aiCacheBusy) return;
    var job = aiCacheQueue.shift();
    if (!job) return;
    aiCacheBusy = true;
    setAiStatus('正在缓存素材...', '');
    if (job.item) {
      job.item.progress = Math.max(job.item.progress || 0, 75);
      updateAiJobProgress(job.item.id, job.item.progress);
    }
    downloadUrlToFile(job.url, job.rawPath, function (err) {
      if (err) {
        setAiStatus('缓存失败：' + err, 'warn');
        if (job.item) {
          job.item.progress = 100;
          updateAiJobProgress(job.item.id, job.item.progress);
        }
        aiCacheBusy = false;
        setTimeout(processAiCacheQueue, 60);
        return;
      }
      job.item.rawPath = job.rawPath;
      if (!job.usePython || job.isData) {
        job.item.localPath = job.rawPath;
        saveImageHistoryRecord(job);
        setAiStatus('缓存完成，可快速插入。', 'ok');
        if (job.item) {
          job.item.progress = 100;
          updateAiJobProgress(job.item.id, job.item.progress);
        }
        aiCacheBusy = false;
        setTimeout(processAiCacheQueue, 60);
        return;
      }
      if (pythonBusy) {
        aiCacheQueue.unshift(job);
        aiCacheBusy = false;
        setTimeout(processAiCacheQueue, 200);
        return;
      }
      pythonBusy = true;
      setAiStatus('压缩处理中…', '');
      if (job.item) {
        job.item.progress = Math.max(job.item.progress || 0, 85);
        updateAiJobProgress(job.item.id, job.item.progress);
      }
      runPythonTranscode(job.url, { referer: '', title: '' }, function (err2, outPath) {
        pythonBusy = false;
        if (err2 || !outPath) {
          job.item.localPath = job.rawPath;
          setAiStatus('压缩失败，使用原图缓存。', 'warn');
        } else {
          var mods = getNodeModules();
          if (mods && mods.fs) {
            try {
              mods.fs.copyFileSync(outPath, job.optPath);
              job.item.localPath = job.optPath;
            } catch (e) {
              job.item.localPath = outPath;
            }
          } else {
            job.item.localPath = outPath;
          }
          saveImageHistoryRecord(job);
          setAiStatus('压缩完成，可快速插入。', 'ok');
        }
        if (job.item) {
          job.item.progress = 100;
          updateAiJobProgress(job.item.id, job.item.progress);
        }
        aiCacheBusy = false;
        setTimeout(processAiCacheQueue, 60);
      }, { maxSide: job.maxSide, format: 'jpeg', quality: job.quality });
    });
  }

  var aiHistoryIndexPath = '';

  function getAiCacheMetaDir() {
    var mods = getNodeModules();
    if (!mods) return '';
    var root = getAiCacheRoot();
    if (!root) return '';
    var dir = '';
    try {
      dir = mods.path.join(root, 'meta');
    } catch (e) {
      dir = '';
    }
    if (!dir) return '';
    if (!ensureDirPath(mods, dir)) return '';
    return dir;
  }

  function getAiCacheTextDir() {
    var mods = getNodeModules();
    if (!mods) return '';
    var root = getAiCacheRoot();
    if (!root) return '';
    var dir = '';
    try {
      dir = mods.path.join(root, 'text');
    } catch (e) {
      dir = '';
    }
    if (!dir) return '';
    if (!ensureDirPath(mods, dir)) return '';
    return dir;
  }

  function getAiHistoryIndexPath() {
    if (aiHistoryIndexPath) return aiHistoryIndexPath;
    var mods = getNodeModules();
    if (!mods) return '';
    var metaDir = getAiCacheMetaDir();
    if (!metaDir) return '';
    aiHistoryIndexPath = mods.path.join(metaDir, 'index.jsonl');
    return aiHistoryIndexPath;
  }

  function formatFileUrl(filePath) {
    if (!filePath) return '';
    var path = String(filePath).replace(/\\/g, '/');
    if (path.indexOf('file:///') === 0) return path;
    return 'file:///' + path;
  }

  function appendHistoryLine(record) {
    var mods = getNodeModules();
    if (!mods || !mods.fs) return;
    var indexPath = getAiHistoryIndexPath();
    if (!indexPath) return;
    try {
      var line = JSON.stringify(record) + '\n';
      mods.fs.appendFileSync(indexPath, line, 'utf8');
    } catch (e) {}
  }

  function saveImageHistoryRecord(job) {
    if (!job || !job.item) return;
    var mods = getNodeModules();
    if (!mods || !mods.fs) return;
    var metaDir = getAiCacheMetaDir();
    if (!metaDir) return;
    var id = job.meta && job.meta.id ? job.meta.id : ('img_' + Date.now() + '_' + Math.floor(Math.random() * 10000));
    var record = {
      id: id,
      type: 'image',
      createdAt: job.meta && job.meta.createdAt ? job.meta.createdAt : Date.now(),
      model: job.meta && job.meta.model ? job.meta.model : '',
      size: job.meta && job.meta.size ? job.meta.size : '',
      prompt: job.meta && job.meta.prompt ? job.meta.prompt : '',
      url: job.url || '',
      rawPath: job.item.rawPath || job.rawPath || '',
      localPath: job.item.localPath || '',
      insertPath: job.item.localPath || job.item.rawPath || ''
    };
    var metaPath = '';
    try {
      metaPath = mods.path.join(metaDir, id + '.json');
      mods.fs.writeFileSync(metaPath, JSON.stringify(record, null, 2), 'utf8');
    } catch (e) {}
    appendHistoryLine(record);
  }

  function saveTextHistoryRecord(payload, result) {
    var mods = getNodeModules();
    if (!mods || !mods.fs) return;
    var metaDir = getAiCacheMetaDir();
    if (!metaDir) return;
    var id = 'text_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    var record = {
      id: id,
      type: 'text',
      createdAt: Date.now(),
      model: payload && payload.model ? payload.model : '',
      task: payload && payload.task ? payload.task : '',
      prompt: payload && payload.prompt ? payload.prompt : '',
      input: payload && payload.input ? payload.input : '',
      output: result || ''
    };
    var metaPath = '';
    try {
      metaPath = mods.path.join(metaDir, id + '.json');
      mods.fs.writeFileSync(metaPath, JSON.stringify(record, null, 2), 'utf8');
    } catch (e) {}
    appendHistoryLine(record);
  }

  function readHistoryRecords() {
    var mods = getNodeModules();
    if (!mods || !mods.fs) return [];
    var indexPath = getAiHistoryIndexPath();
    if (!indexPath || !mods.fs.existsSync(indexPath)) return [];
    try {
      var text = mods.fs.readFileSync(indexPath, 'utf8');
      var lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
      var items = lines.map(function (line) {
        try { return JSON.parse(line); } catch (e) { return null; }
      }).filter(Boolean);
      return items.reverse();
    } catch (e) {
      return [];
    }
  }

  function getActiveHistoryTab() {
    if (!aiHistoryTabs) return 'image';
    var active = aiHistoryTabs.querySelector('button.active');
    if (active && active.getAttribute) {
      return active.getAttribute('data-tab') || 'image';
    }
    return 'image';
  }

  function deleteHistoryRecord(rec) {
    if (!rec || !rec.id) return;
    var mods = getNodeModules();
    if (!mods || !mods.fs) return;
    try {
      var metaDir = getAiCacheMetaDir();
      if (metaDir) {
        var metaPath = mods.path.join(metaDir, rec.id + '.json');
        if (mods.fs.existsSync(metaPath)) {
          mods.fs.unlinkSync(metaPath);
        }
      }
    } catch (e) {}
    try {
      var indexPath = getAiHistoryIndexPath();
      if (indexPath && mods.fs.existsSync(indexPath)) {
        var content = mods.fs.readFileSync(indexPath, 'utf8');
        var lines = content.split(/\r?\n/).filter(function (l) { return l.trim(); });
        var kept = [];
        lines.forEach(function (line) {
          try {
            var obj = JSON.parse(line);
            if (obj && obj.id !== rec.id) kept.push(JSON.stringify(obj));
          } catch (e) {}
        });
        var out = kept.join('\n');
        if (out) out += '\n';
        mods.fs.writeFileSync(indexPath, out, 'utf8');
      }
    } catch (e2) {}
    openAiHistory(getActiveHistoryTab());
  }

  function renderHistoryImages(records) {
    if (!aiHistoryImagesEl) return;
    aiHistoryImagesEl.innerHTML = '';
    if (!records.length) {
      aiHistoryImagesEl.innerHTML = '<div class="ai-text">暂无图片历史</div>';
      return;
    }
    var mods = getNodeModules();
    var fs = mods && mods.fs ? mods.fs : null;
    function fileExists(p) {
      try { return !!(fs && p && fs.existsSync(p)); } catch (e) { return false; }
    }
    records.forEach(function (rec) {
      var card = document.createElement('div');
      card.className = 'ai-history-item';
      var thumb = document.createElement('div');
      thumb.className = 'ai-history-thumb';
      var localPath = rec.localPath || rec.insertPath || '';
      var rawPath = rec.rawPath || '';
      var showUrl = '';
      var insertPath = '';
      if (fileExists(localPath)) {
        showUrl = formatFileUrl(localPath);
        insertPath = localPath;
      } else if (fileExists(rawPath)) {
        showUrl = formatFileUrl(rawPath);
        insertPath = rawPath;
      } else if (rec.url) {
        showUrl = rec.url;
      }
      function markMissing() {
        thumb.classList.add('missing');
        thumb.textContent = '已过期';
      }
      if (showUrl) {
        var img = document.createElement('img');
        img.src = showUrl;
        img.addEventListener('load', function () {
          var w = img.naturalWidth || img.width || 0;
          var h = img.naturalHeight || img.height || 0;
          if (w > 0 && h > 0) {
            thumb.style.setProperty('--thumb-ratio', w + ' / ' + h);
          }
        });
        img.addEventListener('error', function () {
          if (img && img.parentNode) img.parentNode.removeChild(img);
          markMissing();
        });
        thumb.appendChild(img);
      } else {
        markMissing();
      }
      if (rec.prompt) {
        var infoBtn = document.createElement('button');
        infoBtn.className = 'ai-history-info-btn';
        infoBtn.textContent = 'i';
        infoBtn.title = '提示词';
        infoBtn.addEventListener('click', function (ev) {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          card.classList.toggle('show-prompt');
        });
        thumb.appendChild(infoBtn);
        var promptPanel = document.createElement('div');
        promptPanel.className = 'ai-history-prompt';
        var promptText = document.createElement('div');
        promptText.className = 'ai-history-prompt-text';
        promptText.textContent = rec.prompt;
        promptPanel.appendChild(promptText);
        var promptActions = document.createElement('div');
        promptActions.className = 'ai-history-prompt-actions';
        var copyBtn = document.createElement('button');
        copyBtn.textContent = '复制提示词';
        copyBtn.addEventListener('click', function (ev) {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          copyToClipboard(rec.prompt);
        });
        promptActions.appendChild(copyBtn);
        var polishBtn = document.createElement('button');
        polishBtn.textContent = '润色';
        promptActions.appendChild(polishBtn);
        promptPanel.appendChild(promptActions);
        var polishPanel = buildPromptPolishPanel(rec, card);
        promptPanel.appendChild(polishPanel);
        polishBtn.addEventListener('click', function (ev) {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          if (polishPanel) polishPanel.classList.toggle('open');
        });
        thumb.appendChild(promptPanel);
      }
      card.appendChild(thumb);
      var meta = document.createElement('div');
      meta.className = 'ai-history-meta';
      meta.textContent = rec.model || rec.size || '历史记录';
      card.appendChild(meta);
      var actions = document.createElement('div');
      actions.className = 'ai-history-actions';
      var insertBtn = document.createElement('button');
      insertBtn.textContent = '导入';
      insertBtn.addEventListener('click', function () {
        var item = { url: rec.url || showUrl, localPath: insertPath || '' };
        insertAiImageUrl(item, (aiState && aiState.imageInsertMode === 'replace') ? 'replace' : 'insert');
      });
      actions.appendChild(insertBtn);
      var previewBtn = document.createElement('button');
      previewBtn.textContent = '预览';
      previewBtn.addEventListener('click', function () {
        if (!showUrl) return;
        openAiPreview({ url: showUrl, prompt: rec.prompt, recordId: rec.id });
      });
      actions.appendChild(previewBtn);
      var openBtn = document.createElement('button');
      openBtn.textContent = '打开';
      openBtn.addEventListener('click', function () {
        ensureHistoryLocalFile(rec, function (path) {
          if (!path || !fileExists(path)) {
            setAiStatus('本地文件不存在。', 'err');
            return;
          }
          openFileInExplorer(path);
        });
      });
      actions.appendChild(openBtn);
      card.appendChild(actions);
      aiHistoryImagesEl.appendChild(card);
    });
  }

  function renderHistoryTexts(records) {
    if (!aiHistoryTextsEl) return;
    aiHistoryTextsEl.innerHTML = '';
    if (!records.length) {
      aiHistoryTextsEl.innerHTML = '<div class="ai-text">暂无文本历史</div>';
      return;
    }
    records.forEach(function (rec) {
      var card = document.createElement('div');
      card.className = 'ai-history-text-card';
      var title = document.createElement('div');
      title.className = 'ai-history-meta';
      title.textContent = (rec.task || '文本记录') + ' - ' + (rec.model || '');
      card.appendChild(title);
      var input = document.createElement('pre');
      input.textContent = rec.input || '';
      card.appendChild(input);
      var output = document.createElement('pre');
      output.textContent = rec.output || '';
      card.appendChild(output);
      var actions = document.createElement('div');
      actions.className = 'ai-history-actions';
      var copyBtn = document.createElement('button');
      copyBtn.textContent = '复制输出';
      copyBtn.addEventListener('click', function () {
        copyToClipboard(rec.output || '');
      });
      actions.appendChild(copyBtn);
      var insertBtn = document.createElement('button');
      insertBtn.textContent = '插入文本层';
      insertBtn.addEventListener('click', function () {
        insertTextToPs(rec.output || '');
      });
      actions.appendChild(insertBtn);
      card.appendChild(actions);
      aiHistoryTextsEl.appendChild(card);
    });
  }

  function setHistoryTab(tab) {
    var t = tab === 'text' ? 'text' : 'image';
    if (aiHistoryTabs) {
      var btns = aiHistoryTabs.querySelectorAll('button');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === t);
      });
    }
    if (aiHistoryImagesEl) aiHistoryImagesEl.classList.toggle('hidden', t !== 'image');
    if (aiHistoryTextsEl) aiHistoryTextsEl.classList.toggle('hidden', t !== 'text');
  }

  function openAiHistory(tab) {
    if (!aiHistoryEl) return;
    var all = readHistoryRecords();
    var images = all.filter(function (it) { return it.type === 'image'; });
    var texts = all.filter(function (it) { return it.type === 'text'; });
    renderHistoryImages(images);
    renderHistoryTexts(texts);
    setHistoryTab(tab || 'image');
    aiHistoryEl.classList.add('open');
    setAiHistoryMax(aiHistoryIsMax);
  }

  function closeAiHistory() {
    if (!aiHistoryEl) return;
    aiHistoryEl.classList.remove('open');
  }

  function copyToClipboard(text, cb) {
    var value = text || '';
    if (!value) {
      if (cb) cb(false);
      return;
    }
    var finished = false;
    function finish(ok) {
      if (finished) return;
      finished = true;
      if (cb) cb(ok);
      setAiStatus(ok ? '提示词已复制。' : '复制失败。', ok ? 'ok' : 'err');
    }
    function tryNodeClipboard() {
      try {
        var mods = getNodeModules();
        if (!mods || !mods.child_process || !mods.fs || !mods.path || !mods.os) return false;
        var tmp = mods.path.join(mods.os.tmpdir(), 'niuassist_clip_' + Date.now() + '.txt');
        mods.fs.writeFileSync(tmp, value, 'utf8');
        if (typeof process !== 'undefined' && process.platform === 'darwin') {
          mods.child_process.exec('pbcopy < "' + tmp + '"', function (err) {
            finish(!err);
          });
          return true;
        }
        mods.child_process.exec('cmd /c type "' + tmp + '" | clip', function (err) {
          finish(!err);
        });
        return true;
      } catch (e) {
        return false;
      }
    }
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          finish(true);
        }).catch(function () {
          var ok = false;
          try {
            var area = document.createElement('textarea');
            area.value = value;
            area.setAttribute('readonly', 'readonly');
            area.style.position = 'fixed';
            area.style.left = '-9999px';
            document.body.appendChild(area);
            area.focus();
            area.select();
            ok = document.execCommand('copy');
            document.body.removeChild(area);
          } catch (e2) {}
          if (ok) {
            finish(true);
          } else if (!tryNodeClipboard()) {
            finish(false);
          }
        });
        return;
      }
    } catch (e) {}
    try {
      var area2 = document.createElement('textarea');
      area2.value = value;
      area2.setAttribute('readonly', 'readonly');
      area2.style.position = 'fixed';
      area2.style.left = '-9999px';
      document.body.appendChild(area2);
      area2.focus();
      area2.select();
      var ok2 = document.execCommand('copy');
      document.body.removeChild(area2);
      if (ok2) {
        finish(true);
        return;
      }
    } catch (e3) {}
    if (!tryNodeClipboard()) finish(false);
  }

  function updateHistoryRecord(rec, patch) {
    if (!rec || !rec.id || !patch) return;
    var mods = getNodeModules();
    if (!mods || !mods.fs) return;
    try {
      var metaDir = getAiCacheMetaDir();
      if (metaDir) {
        var metaPath = mods.path.join(metaDir, rec.id + '.json');
        var current = {};
        if (mods.fs.existsSync(metaPath)) {
          try { current = JSON.parse(mods.fs.readFileSync(metaPath, 'utf8')) || {}; } catch (e) {}
        }
        Object.keys(patch).forEach(function (k) { current[k] = patch[k]; });
        mods.fs.writeFileSync(metaPath, JSON.stringify(current, null, 2), 'utf8');
      }
    } catch (e1) {}
    try {
      var indexPath = getAiHistoryIndexPath();
      if (!indexPath || !mods.fs.existsSync(indexPath)) return;
      var content = mods.fs.readFileSync(indexPath, 'utf8');
      var lines = content.split(/\r?\n/).filter(function (l) { return l.trim(); });
      var updated = false;
      var out = lines.map(function (line) {
        try {
          var obj = JSON.parse(line);
          if (obj && obj.id === rec.id) {
            Object.keys(patch).forEach(function (k) { obj[k] = patch[k]; });
            updated = true;
            return JSON.stringify(obj);
          }
        } catch (e) {}
        return line;
      });
      if (updated) {
        var text = out.join('\n');
        if (text) text += '\n';
        mods.fs.writeFileSync(indexPath, text, 'utf8');
      }
    } catch (e2) {}
  }

  function ensureHistoryLocalFile(rec, cb) {
    var mods = getNodeModules();
    var fs = mods && mods.fs ? mods.fs : null;
    function fileExists(p) {
      try { return !!(fs && p && fs.existsSync(p)); } catch (e) { return false; }
    }
    var localPath = rec && (rec.localPath || rec.insertPath) || '';
    var rawPath = rec && rec.rawPath || '';
    if (fileExists(localPath)) {
      if (cb) cb(localPath);
      return;
    }
    if (fileExists(rawPath)) {
      if (cb) cb(rawPath);
      return;
    }
    if (!rec || !rec.url) {
      if (cb) cb('');
      return;
    }
    var dir = getAiCacheDir();
    if (!dir) {
      if (cb) cb('');
      return;
    }
    var ext = extractExtFromUrl(rec.url, 'png');
    var base = rec.id || ('img_' + Date.now());
    var outPath = dir + '/' + base + '.' + ext;
    setAiStatus('正在下载历史图片...', '');
    downloadUrlToFile(rec.url, outPath, function (err) {
      if (err) {
        setAiStatus('历史图片下载失败：' + err, 'err');
        if (cb) cb('');
        return;
      }
      updateHistoryRecord(rec, { localPath: outPath, rawPath: outPath, insertPath: outPath });
      setAiStatus('历史图片已补全。', 'ok');
      if (cb) cb(outPath);
    });
  }

  function placeFileByPath(path, info) {
    if (!path) return;
    var script = 'psexCapture_placeFileByPath(' + JSON.stringify(path) + ');';
    cs.evalScript(script, function (res) {
      if (String(res || '').indexOf('error:') === 0) {
        setStatus('插入失败：' + res.replace(/^error:/, ''), 'err');
        return;
      }
      var notes = [];
      if (info && info.scaled) notes.push('已自动缩放');
      if (info && info.jpeg) notes.push('JPG 压缩');
      var msg = notes.length ? '已插入到 Photoshop（' + notes.join('，') + '）。' : '已插入到 Photoshop。';
      setStatus(msg, 'ok');
    });
  }


  function isChromeErrorUrl(url) {
    var v = (url || '').trim().toLowerCase();
    if (!v) return false;
    if (v.indexOf('chrome-error://') === 0) return true;
    if (v.indexOf('chromewebdata') === 0) return true;
    return false;
  }

  function isBlankUrl(url) {
    var v = (url || '').trim().toLowerCase();
    return !v || v === 'about:blank' || v === 'about:srcdoc';
  }

  function shouldIgnoreHistoryUrl(url) {
    return isBlankUrl(url) || isChromeErrorUrl(url);
  }

  function getRecentList() {
    try {
      var raw = localStorage.getItem(RECENT_STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      return list.filter(function (it) { return it && it.url; });
    } catch (e) {
      return [];
    }
  }

  function openFileInExplorer(filePath) {
    if (!filePath) return;
    var mods = getNodeModules();
    if (!mods || !mods.child_process) return;
    try {
      if (typeof process !== 'undefined' && process.platform === 'darwin') {
        mods.child_process.spawn('open', ['-R', filePath]);
      } else {
        mods.child_process.spawn('explorer.exe', ['/select,' + filePath], { windowsHide: true });
      }
    } catch (e) {
      setAiStatus('打开失败：' + e, 'err');
    }
  }

  function buildPromptPolishPanel(rec, card) {
    var panel = document.createElement('div');
    panel.className = 'ai-history-polish';
    var textModels = AI_MODEL_DEFAULTS.filter(function (m) { return m.type === 'text'; });
    var modelRow = document.createElement('div');
    modelRow.className = 'ai-history-polish-row';
    var modelLabel = document.createElement('span');
    modelLabel.textContent = '模型';
    var modelSelect = document.createElement('select');
    if (!textModels.length) {
      var emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '无可用文本模型';
      modelSelect.appendChild(emptyOpt);
    } else {
      textModels.forEach(function (m) {
        var opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        modelSelect.appendChild(opt);
      });
    }
    modelRow.appendChild(modelLabel);
    modelRow.appendChild(modelSelect);
    panel.appendChild(modelRow);

    var strengthRow = document.createElement('div');
    strengthRow.className = 'ai-history-polish-row';
    var strengthLabel = document.createElement('span');
    strengthLabel.textContent = '强度';
    var strengthSelect = document.createElement('select');
    [
      { value: 'light', label: '轻' },
      { value: 'medium', label: '标准' },
      { value: 'strong', label: '强' }
    ].forEach(function (item) {
      var opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      strengthSelect.appendChild(opt);
    });
    strengthRow.appendChild(strengthLabel);
    strengthRow.appendChild(strengthSelect);
    panel.appendChild(strengthRow);

    var targetRow = document.createElement('div');
    targetRow.className = 'ai-history-polish-row';
    var targetLabel = document.createElement('span');
    targetLabel.textContent = '目标';
    var targetSelect = document.createElement('select');
    [
      { value: 'simple', label: '简约' },
      { value: 'rich', label: '丰富' },
      { value: 'pro', label: '保持但更专业' }
    ].forEach(function (item) {
      var opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      targetSelect.appendChild(opt);
    });
    targetRow.appendChild(targetLabel);
    targetRow.appendChild(targetSelect);
    panel.appendChild(targetRow);

    var actionRow = document.createElement('div');
    actionRow.className = 'ai-history-polish-row';
    var applyBtn = document.createElement('button');
    applyBtn.textContent = '应用润色';
    var undoBtn = document.createElement('button');
    undoBtn.textContent = '撤销';
    actionRow.appendChild(applyBtn);
    actionRow.appendChild(undoBtn);
    panel.appendChild(actionRow);

    var originPrompt = rec && rec.prompt ? String(rec.prompt) : '';
    if (card && originPrompt) card.dataset.originPrompt = originPrompt;

    applyBtn.addEventListener('click', function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      if (!originPrompt) return;
      requestPromptPolish(originPrompt, modelSelect.value, strengthSelect.value, targetSelect.value, function (result) {
        if (!result) return;
        if (aiPromptInput) aiPromptInput.value = result;
        setAiStatus('已写入提示词。', 'ok');
      });
    });
    undoBtn.addEventListener('click', function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      var original = (card && card.dataset && card.dataset.originPrompt) ? card.dataset.originPrompt : originPrompt;
      if (aiPromptInput) aiPromptInput.value = original || '';
      setAiStatus('已撤销到原提示词。', '');
    });
    return panel;
  }

  function requestPromptPolish(prompt, modelId, strength, target, cb) {
    var settings = getAiSettings();
    if (!settings.apiKey) {
      setAiStatus('请先填写 API 密钥。', 'err');
      return;
    }
    if (!modelId) {
      setAiStatus('请选择润色模型。', 'err');
      return;
    }
    var baseUrl = normalizeBaseUrl(settings.baseUrl);
    var targetLabel = target === 'rich' ? '丰富' : (target === 'pro' ? '保持但更专业' : '简约');
    var strengthLabel = strength === 'strong' ? '强' : (strength === 'light' ? '轻' : '标准');
    var polishPrompt = [
      '请对以下提示词进行润色。',
      '目标：' + targetLabel + '。',
      '强度：' + strengthLabel + '。',
      '仅输出润色后的提示词，不要解释。',
      '原提示词：' + prompt
    ].join('\n');
    var useResponses = modelId.indexOf('translation') !== -1;
    var endpoint = useResponses ? 'responses' : 'chat/completions';
    var payload = useResponses
      ? { model: modelId, input: polishPrompt }
      : { model: modelId, messages: [
        { role: 'system', content: '你是提示词润色助手，只输出润色后的提示词，不要解释。' },
        { role: 'user', content: polishPrompt }
      ] };
    setAiStatus('提示词润色中...', '');
    fetchJsonWithStatus(baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + settings.apiKey
      },
      body: JSON.stringify(payload)
    }, function (res) {
      if (!res.ok) {
        setAiStatus('润色失败：' + formatApiError(res), 'err');
        return;
      }
      var json = res.data || {};
      var text = extractTextResult(json);
      if (!text) {
        setAiStatus('润色失败：未返回结果。', 'err');
        return;
      }
      if (cb) cb(String(text).trim());
      setAiStatus('润色完成。', 'ok');
    });
  }

  function saveRecentList(list) {
    try { localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(list || [])); } catch (e) {}
  }

  function getHostFromUrl(url) {
    try {
      return new URL(url).hostname || '';
    } catch (e) {
      return '';
    }
  }

  function getRecentIconUrl(host) {
    if (!host) return '';
    return 'https://api.iowen.cn/favicon/?url=' + encodeURIComponent(host);
  }

  function addRecentUrl(url, title) {
    var v = normalizeUrl(url || '');
    if (!v || shouldIgnoreHistoryUrl(v)) return;
    var list = getRecentList();
    var idx = list.findIndex(function (it) { return it.url === v; });
    var item = idx >= 0 ? list[idx] : { url: v, title: '' };
    if (title && (!item.title || item.title.length < title.length)) item.title = title;
    if (idx >= 0) list.splice(idx, 1);
    list.unshift(item);
    if (list.length > RECENT_MAX) list = list.slice(0, RECENT_MAX);
    saveRecentList(list);
    renderRecentList(list);
  }

  function updateRecentTitle(url, title) {
    if (!title || !url) return;
    var v = normalizeUrl(url || '');
    if (!v || shouldIgnoreHistoryUrl(v)) return;
    var list = getRecentList();
    var idx = list.findIndex(function (it) { return it.url === v; });
    if (idx < 0) return;
    if (list[idx].title !== title) {
      list[idx].title = title;
      saveRecentList(list);
      renderRecentList(list);
    }
  }

  function renderRecentList(list) {
    if (!recentListEl) return;
    var items = Array.isArray(list) ? list.slice(0, RECENT_MAX) : [];
    recentListEl.innerHTML = '';
    if (!items.length) {
      return;
    }
    items.forEach(function (it) {
      var host = getHostFromUrl(it.url);
      var label = (it.title || host || it.url || '').trim();
      var itemEl = document.createElement('button');
      itemEl.className = 'recent-item';
      itemEl.title = it.url;
      var icon = document.createElement('span');
      icon.className = 'recent-icon';
      if (host) {
        var img = document.createElement('img');
        img.src = getRecentIconUrl(host);
        img.alt = host;
        img.onerror = function () {
          if (icon && icon.firstChild === img) {
            icon.removeChild(img);
            icon.textContent = host.charAt(0).toUpperCase();
          }
        };
        icon.appendChild(img);
      } else {
        icon.textContent = label ? label.charAt(0).toUpperCase() : '';
      }
      var text = document.createElement('span');
      text.className = 'recent-label';
      text.textContent = label || '未知';
      itemEl.appendChild(icon);
      itemEl.appendChild(text);
      itemEl.addEventListener('click', function () {
        if (urlInput) urlInput.value = it.url;
        openUrl();
      });
      recentListEl.appendChild(itemEl);
    });
  }

  function recordNav(url, opts) {
    if (!url) return;
    if (shouldIgnoreHistoryUrl(url)) return;
    var v = normalizeUrl(url);
    if (!v || shouldIgnoreHistoryUrl(v)) return;
    var forceNew = !!(opts && opts.forceNew);
    if (!forceNew) {
      if (navIndex >= 0 && navHistory[navIndex] === v) {
        lastGoodUrl = v;
        return;
      }
      var existing = navHistory.lastIndexOf(v);
      if (existing >= 0) {
        navIndex = existing;
        lastGoodUrl = v;
        return;
      }
    }
    if (navIndex < navHistory.length - 1) {
      navHistory = navHistory.slice(0, navIndex + 1);
    }
    navHistory.push(v);
    navIndex = navHistory.length - 1;
    lastGoodUrl = v;
    addRecentUrl(v, '');
  }

  function getSafeBrowserUrl() {
    var url = '';
    try {
      url = browser && browser.contentWindow && browser.contentWindow.location ? browser.contentWindow.location.href : '';
    } catch (e) {
      url = '';
    }
    if (!url) {
      try { url = browser && browser.src ? browser.src : ''; } catch (e2) {}
    }
    return url;
  }

  function updateSiteTitle(title, host, url) {
    var label = title || host || url || '';
    if (label) lastPageTitle = label;
    if (url) lastPageUrl = url;
    if (!siteTitleEl) return;
    var display = label || '-';
    siteTitleEl.textContent = '网站：' + display;
    siteTitleEl.title = display;
    updateUrlInput(url);
    updateSiteSearchVisibility(url, host);
    if (url && label) updateRecentTitle(url, label);
  }

  function isHuabanSite(host, url) {
    var h = (host || '').toLowerCase();
    var u = (url || '').toLowerCase();
    return h.indexOf('huaban.com') !== -1 || u.indexOf('huaban.com') !== -1;
  }

  function updateSiteSearchVisibility(url, host) {
    if (!siteSearchGroup) return;
    var show = isHuabanSite(host, url);
    siteSearchGroup.classList.toggle('hidden', !show);
  }

  function openSiteSearch() {
    if (!siteSearchInput) return;
    var q = (siteSearchInput.value || '').trim();
    if (!q) return;
    var target = 'https://huaban.com/search/?q=' + encodeURIComponent(q);
    if (urlInput) urlInput.value = target;
    openUrl();
  }

  function setFavCollapsed(collapsed, persist) {
    if (!favBar) return;
    favBar.classList.toggle('collapsed', !!collapsed);
    if (favToggleBtn) {
      favToggleBtn.textContent = collapsed ? '▾' : '▴';
      favToggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    if (persist) {
      try {
        localStorage.setItem(FAV_COLLAPSE_KEY, collapsed ? '1' : '0');
      } catch (e) {}
    }
  }

  function setCaptureMode(enabled, persist) {
    var wasEnabled = !!captureModeEnabled;
    captureModeEnabled = !!enabled;
    if (captureModeToggle) captureModeToggle.checked = !!captureModeEnabled;
    if (captureHintEl) captureHintEl.style.display = captureModeEnabled ? 'block' : 'none';
    sendCaptureConfig();
    if (captureModeEnabled && !wasEnabled && currentMode === 'browser') {
      injectCaptureScript();
    }
    if (persist) {
      try { localStorage.setItem(CAPTURE_MODE_KEY, captureModeEnabled ? '1' : '0'); } catch (e) {}
    }
    updateCaptureMenuChecks();
  }

  function initCaptureMode() {
    var enabled = true;
    try {
      var raw = localStorage.getItem(CAPTURE_MODE_KEY);
      if (raw === '0' || raw === '1') enabled = raw === '1';
    } catch (e) {}
    setCaptureMode(enabled, false);
    if (captureModeToggle) {
      captureModeToggle.addEventListener('change', function () {
        setCaptureMode(!!captureModeToggle.checked, true);
      });
    }
  }

  function setAiStatus(msg, type) {
    if (!aiStatusEl) return;
    aiStatusEl.textContent = msg || '';
    aiStatusEl.className = 'ai-status' + (type ? ' ' + type : '');
  }

  function getSyncSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(SYNC_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    var enabled = typeof data.enabled === 'boolean' ? data.enabled : SYNC_DEFAULTS.enabled;
    var timerEnabled = typeof data.timerEnabled === 'boolean' ? data.timerEnabled : SYNC_DEFAULTS.timerEnabled;
    var interval = parseInt(data.interval || SYNC_DEFAULTS.interval, 10);
    var migrated = false;
    try { migrated = localStorage.getItem(SYNC_MIGRATE_KEY) === '1'; } catch (e) {}
    if (!migrated) {
      enabled = false;
      timerEnabled = false;
      try {
        localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify({
          enabled: enabled,
          timerEnabled: timerEnabled,
          interval: interval
        }));
      } catch (e2) {}
      try { localStorage.setItem(SYNC_MIGRATE_KEY, '1'); } catch (e3) {}
    }
    return {
      enabled: enabled,
      timerEnabled: timerEnabled,
      interval: interval
    };
  }

  function saveSyncSettings(settings) {
    try {
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function updateSyncUiState(settings) {
    if (!settings) return;
    var enabled = !!settings.enabled;
    var timerEnabled = !!settings.timerEnabled && enabled;
    if (syncTimerToggle) syncTimerToggle.disabled = !enabled;
    if (syncIntervalInput) syncIntervalInput.disabled = !timerEnabled;
  }

  function applySyncSettings(settings) {
    if (!settings) return;
    if (syncToggle) syncToggle.checked = !!settings.enabled;
    if (syncTimerToggle) syncTimerToggle.checked = !!settings.timerEnabled;
    if (syncIntervalInput) syncIntervalInput.value = settings.interval || SYNC_DEFAULTS.interval;
    updateSyncUiState(settings);
  }

  function initFavCollapse() {
    var collapsed = true;
    try {
      var raw = localStorage.getItem(FAV_COLLAPSE_KEY);
      if (raw === '0' || raw === '1') collapsed = raw === '1';
    } catch (e) {}
    setFavCollapsed(collapsed, false);
    if (favToggleBtn) {
      favToggleBtn.addEventListener('click', function () {
        setFavCollapsed(!favBar.classList.contains('collapsed'), true);
      });
    }
  }

  function readSyncSettingsFromUI() {
    var interval = syncIntervalInput ? parseInt(syncIntervalInput.value || SYNC_DEFAULTS.interval, 10) : SYNC_DEFAULTS.interval;
    if (isNaN(interval) || interval < 1) interval = SYNC_DEFAULTS.interval;
    if (interval > 60) interval = 60;
    var enabled = syncToggle ? !!syncToggle.checked : SYNC_DEFAULTS.enabled;
    var timerEnabled = syncTimerToggle ? !!syncTimerToggle.checked : SYNC_DEFAULTS.timerEnabled;
    if (!enabled) timerEnabled = false;
    return {
      enabled: enabled,
      timerEnabled: timerEnabled,
      interval: interval
    };
  }

  function getScaleSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(SCALE_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    return {
      enabled: typeof data.enabled === 'boolean' ? data.enabled : SCALE_DEFAULTS.enabled,
      maxSide: parseInt(data.maxSide || SCALE_DEFAULTS.maxSide, 10)
    };
  }

  function saveScaleSettings(settings) {
    try {
      localStorage.setItem(SCALE_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function applyScaleSettings(settings) {
    if (!settings) return;
    if (scaleToggle) scaleToggle.checked = !!settings.enabled;
    if (scaleMaxInput) scaleMaxInput.value = settings.maxSide || SCALE_DEFAULTS.maxSide;
  }

  function readScaleSettingsFromUI() {
    var maxSide = scaleMaxInput ? parseInt(scaleMaxInput.value || SCALE_DEFAULTS.maxSide, 10) : SCALE_DEFAULTS.maxSide;
    if (isNaN(maxSide) || maxSide < 800) maxSide = SCALE_DEFAULTS.maxSide;
    if (maxSide > 8000) maxSide = 8000;
    return {
      enabled: scaleToggle ? !!scaleToggle.checked : SCALE_DEFAULTS.enabled,
      maxSide: maxSide
    };
  }

  function getJpegSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(JPEG_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    return {
      enabled: typeof data.enabled === 'boolean' ? data.enabled : JPEG_DEFAULTS.enabled,
      quality: parseInt(data.quality || JPEG_DEFAULTS.quality, 10)
    };
  }

  function saveJpegSettings(settings) {
    try {
      localStorage.setItem(JPEG_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function updateJpegUiState(settings) {
    if (!settings) return;
    if (jpegQualityInput) jpegQualityInput.disabled = !settings.enabled;
  }

  function applyJpegSettings(settings) {
    if (!settings) return;
    if (jpegToggle) jpegToggle.checked = !!settings.enabled;
    if (jpegQualityInput) jpegQualityInput.value = settings.quality || JPEG_DEFAULTS.quality;
    updateJpegUiState(settings);
  }

  function readJpegSettingsFromUI() {
    var quality = jpegQualityInput ? parseInt(jpegQualityInput.value || JPEG_DEFAULTS.quality, 10) : JPEG_DEFAULTS.quality;
    if (isNaN(quality) || quality < 10) quality = JPEG_DEFAULTS.quality;
    if (quality > 100) quality = 100;
    return {
      enabled: jpegToggle ? !!jpegToggle.checked : JPEG_DEFAULTS.enabled,
      quality: quality
    };
  }

  function getPythonSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(PY_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    return {
      enabled: typeof data.enabled === 'boolean' ? data.enabled : PY_DEFAULTS.enabled
    };
  }

  function savePythonSettings(settings) {
    try {
      localStorage.setItem(PY_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function applyPythonSettings(settings) {
    if (!settings) return;
    if (pyToggle) pyToggle.checked = !!settings.enabled;
  }

  function readPythonSettingsFromUI() {
    return {
      enabled: pyToggle ? !!pyToggle.checked : PY_DEFAULTS.enabled
    };
  }

  function getOriginalSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(ORIG_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    return {
      enabled: typeof data.enabled === 'boolean' ? data.enabled : ORIG_DEFAULTS.enabled
    };
  }

  function saveOriginalSettings(settings) {
    try {
      localStorage.setItem(ORIG_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function applyOriginalSettings(settings) {
    if (!settings) return;
    if (origToggle) origToggle.checked = !!settings.enabled;
  }

  function readOriginalSettingsFromUI() {
    return {
      enabled: origToggle ? !!origToggle.checked : ORIG_DEFAULTS.enabled
    };
  }

  function getViewSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(VIEW_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    // 重载插件时强制关闭纯图模式
    try {
      if (data && data.enabled) {
        localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ enabled: false }));
      }
    } catch (e2) {}
    return { enabled: false };
  }

  function saveViewSettings(settings) {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function applyViewSettings(settings) {
    if (!settings) return;
    if (viewToggle) viewToggle.checked = !!settings.enabled;
    sendViewModeFromState();
    updateCaptureMenuChecks();
  }

  function readViewSettingsFromUI() {
    return {
      enabled: viewToggle ? !!viewToggle.checked : false
    };
  }

  function getZoomSettings() {
    var v = ZOOM_DEFAULT;
    try { v = parseFloat(localStorage.getItem(ZOOM_STORAGE_KEY) || String(ZOOM_DEFAULT)); } catch (e) {}
    if (isNaN(v) || v <= 0) v = ZOOM_DEFAULT;
    if (v < 0.25) v = 0.25;
    if (v > 3) v = 3;
    return { value: v };
  }

  function saveZoomSettings(state) {
    try { localStorage.setItem(ZOOM_STORAGE_KEY, String(state && state.value || 1)); } catch (e) {}
  }

  function sendPageInfoConfig() {
    if (!browser || !browser.contentWindow) return;
    var cfg = readSyncSettingsFromUI();
    if (!cfg.interval || cfg.interval < 1) cfg.interval = SYNC_DEFAULTS.interval;
    var timerEnabled = !!cfg.timerEnabled && !!cfg.enabled;
    browser.contentWindow.postMessage({
      type: 'PSEX_PAGE_INFO_CONFIG',
      enabled: !!cfg.enabled,
      timerEnabled: timerEnabled,
      interval: timerEnabled ? cfg.interval * 1000 : 0
    }, '*');
  }

  function sendCaptureConfig() {
    if (!browser || !browser.contentWindow) return;
    var cfg = readScaleSettingsFromUI();
    browser.contentWindow.postMessage({
      type: 'PSEX_CAPTURE_CONFIG',
      enabled: !!cfg.enabled,
      maxSide: cfg.maxSide,
      jpegEnabled: !!(jpegState && jpegState.enabled),
      jpegQuality: parseInt(jpegState && jpegState.quality || JPEG_DEFAULTS.quality, 10),
      preferUrlCapture: !!(pythonState && pythonState.enabled),
      originalMode: !!(originalState && originalState.enabled),
      captureEnabled: !!captureModeEnabled,
      zoomEnabled: currentMode !== 'ai',
      zoom: zoomState && zoomState.value ? zoomState.value : 1
    }, '*');
  }

  function getAiSettings() {
    var data = {};
    try {
      var raw = localStorage.getItem(AI_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }
    var out = {};
    var k;
    for (k in AI_DEFAULTS) out[k] = AI_DEFAULTS[k];
    for (k in data) out[k] = data[k];
    if (!out.selectedModelMap || !Object.keys(out.selectedModelMap).length) {
      var legacyMap = {};
      if (out.imageLite) legacyMap['image:lite'] = out.imageLite;
      if (out.imagePro) legacyMap['image:pro'] = out.imagePro;
      if (out.videoLite) legacyMap['video:lite'] = out.videoLite;
      if (out.videoPro) legacyMap['video:pro'] = out.videoPro;
      out.selectedModelMap = legacyMap;
    }
    if (!out.customModelMap) out.customModelMap = {};
    if (!out.featureParams) out.featureParams = {};
    return out;
  }

  function saveAiSettings(settings) {
    try {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function normalizeModelItem(item) {
    if (!item) return null;
    var out = {};
    if (typeof item === 'string') {
      out.id = item.trim();
      out.name = out.id;
    } else if (typeof item === 'object') {
      out.id = (item.id || item.model || item.value || '').trim();
      out.name = (item.name || item.title || out.id).trim();
      out.type = (item.type || item.category || '').trim();
      out.tier = (item.tier || item.precision || item.level || '').trim();
      out.quota = item.quota || '';
    }
    if (!out.id) return null;
    if (out.type) out.type = out.type.toLowerCase();
    if (out.tier) out.tier = out.tier.toLowerCase();
    if (!out.type) out.type = 'image';
    if (!out.tier) out.tier = 'lite';
    return out;
  }

  function mergeModelLists(baseList, extraList) {
    var out = [];
    var seen = {};
    var addList = function (arr, preferExisting) {
      if (!Array.isArray(arr)) return;
      arr.forEach(function (item) {
        var norm = normalizeModelItem(item);
        if (!norm) return;
        if (seen[norm.id]) {
          if (preferExisting) return;
          var idx = out.findIndex(function (m) { return m.id === norm.id; });
          if (idx >= 0) out[idx] = norm;
          return;
        }
        seen[norm.id] = true;
        out.push(norm);
      });
    };
    addList(baseList, true);
    addList(extraList, false);
    return out;
  }

  function getModelList() {
    var list = [];
    var version = '';
    try {
      var raw = localStorage.getItem(AI_MODEL_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        } else if (parsed && typeof parsed === 'object') {
          version = parsed.version || '';
          list = parsed.list || [];
        }
      }
    } catch (e) {
      list = [];
    }
    var defaults = AI_MODEL_DEFAULTS.slice();
    if (!Array.isArray(list) || list.length === 0) {
      list = defaults;
      saveModelList(list, AI_MODEL_VERSION);
      return list.map(normalizeModelItem).filter(Boolean);
    }
    if (version !== AI_MODEL_VERSION) {
      list = mergeModelLists(list, defaults);
      saveModelList(list, AI_MODEL_VERSION);
    }
    return list.map(normalizeModelItem).filter(Boolean);
  }

  function saveModelList(list, version) {
    try {
      var payload = {
        version: version || AI_MODEL_VERSION,
        list: list
      };
      localStorage.setItem(AI_MODEL_KEY, JSON.stringify(payload));
    } catch (e) {}
  }

  function parseModelListText(text) {
    if (!text) return [];
    var trimmed = text.trim();
    if (!trimmed) return [];
    try {
      var parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeModelItem).filter(Boolean);
      }
    } catch (e) {}
    var lines = trimmed.split(/\r?\n/);
    var out = [];
    lines.forEach(function (line) {
      var t = line.trim();
      if (!t) return;
      var parts = t.split('|');
      var name = (parts[0] || '').trim();
      var id = (parts[1] || '').trim();
      var type = (parts[2] || '').trim() || 'image';
      var tier = (parts[3] || '').trim() || 'lite';
      var quota = (parts[4] || '').trim();
      if (!id && name) id = name;
      if (!name && id) name = id;
      if (id) out.push({ id: id, name: name, type: type, tier: tier, quota: quota });
    });
    return out.map(normalizeModelItem).filter(Boolean);
  }

  function formatModelListText(list) {
    try {
      return JSON.stringify(list, null, 2);
    } catch (e) {
      return '';
    }
  }

  function getModelKey(type, tier) {
    return (type || 'image') + ':' + (tier || 'lite');
  }

  function getSelectedModelId(settings, type, tier) {
    if (!settings) return '';
    var map = settings.selectedModelMap || {};
    var customMap = settings.customModelMap || {};
    var key = getModelKey(type || settings.type, tier || settings.tier);
    var selected = map[key] || '';
    if (selected === '__custom__') {
      return (customMap[key] || '').trim();
    }
    return selected;
  }

  function setSelectedModelForCurrent(id, isCustom) {
    if (!aiState) return;
    var key = getModelKey(aiState.type, aiState.tier);
    aiState.selectedModelMap = aiState.selectedModelMap || {};
    aiState.customModelMap = aiState.customModelMap || {};
    if (isCustom) {
      aiState.selectedModelMap[key] = '__custom__';
      aiState.customModelMap[key] = id || '';
    } else {
      aiState.selectedModelMap[key] = id || '';
    }
    saveAiSettings(aiState);
  }

  function buildTierOptions(list, type) {
    var tiers = {};
    list.forEach(function (m) {
      if (m.type !== type) return;
      if (m.tier) tiers[m.tier] = true;
    });
    var order = ['lite', 'pro', 'standard'];
    var out = [];
    out.push('all');
    order.forEach(function (t) { if (tiers[t]) out.push(t); });
    Object.keys(tiers).forEach(function (t) {
      if (order.indexOf(t) === -1) out.push(t);
    });
    if (out.length === 1) out = ['all', 'lite', 'pro'];
    return out;
  }

  function formatTierLabel(tier) {
    if (tier === 'all') return '全部';
    if (tier === 'lite') return '轻量';
    if (tier === 'pro') return '专业';
    if (tier === 'standard') return '标准';
    return tier;
  }

  function updateTierOptions() {
    if (!aiTierSelect || !aiState) return;
    var type = aiState.type || 'image';
    var tiers = buildTierOptions(aiModels, type);
    var current = aiTierSelect.value || aiState.tier || 'lite';
    var countForTier = 0;
    aiModels.forEach(function (m) {
      if (m.type === type && m.tier === current) countForTier += 1;
    });
    aiTierSelect.innerHTML = '';
    tiers.forEach(function (t) {
      var opt = document.createElement('option');
      opt.value = t;
      opt.textContent = formatTierLabel(t);
      aiTierSelect.appendChild(opt);
    });
    if (tiers.indexOf(current) === -1) current = tiers[0];
    if (current !== 'all' && tiers.indexOf('all') !== -1 && countForTier <= 1) {
      current = 'all';
    }
    aiTierSelect.value = current;
    aiState.tier = current;
    saveAiSettings(aiState);
  }

  function updateModelOptions() {
    if (!aiModelSelect || !aiState) return;
    var type = aiState.type || 'image';
    var tier = aiState.tier || 'lite';
    var list = aiModels.filter(function (m) {
      if (m.type !== type) return false;
      if (!tier || tier === 'all') return true;
      return m.tier === tier;
    });
    aiModelSelect.innerHTML = '';
    list.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.name + ' (' + m.id + ')' + (m.quota ? ' 余量:' + m.quota : '');
      aiModelSelect.appendChild(opt);
    });
    var customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '自定义模型 ID';
    aiModelSelect.appendChild(customOpt);

    var selected = getSelectedModelId(aiState, type, tier);
    var hasSelected = list.some(function (m) { return m.id === selected; });
    if (hasSelected) {
      aiModelSelect.value = selected;
      if (aiModelCustomRow) aiModelCustomRow.classList.add('hidden');
    } else if (selected) {
      aiModelSelect.value = '__custom__';
      if (aiModelCustomInput) aiModelCustomInput.value = selected;
      if (aiModelCustomRow) aiModelCustomRow.classList.remove('hidden');
    } else if (list.length) {
      aiModelSelect.value = list[0].id;
      setSelectedModelForCurrent(list[0].id, false);
      if (aiModelCustomRow) aiModelCustomRow.classList.add('hidden');
    } else {
      aiModelSelect.value = '__custom__';
      if (aiModelCustomRow) aiModelCustomRow.classList.remove('hidden');
    }
  }

  function getImageSizeListForModel(modelId) {
    var id = (modelId || '').toLowerCase();
    if (id.indexOf('seedream-4-5') !== -1) return AI_IMAGE_SIZES_LARGE.slice();
    return AI_IMAGE_SIZES_DEFAULT.slice();
  }

  function getSizeLabel(value) {
    var size = (value || '').trim();
    if (!size) return '';
    return AI_IMAGE_SIZE_TO_LABEL[size] || size;
  }

  function getSizeByRatio(ratio) {
    var r = (ratio || '').trim();
    if (!r) return '';
    for (var i = 0; i < AI_IMAGE_PRESETS.length; i += 1) {
      if (AI_IMAGE_PRESETS[i].ratio === r) {
        return AI_IMAGE_PRESETS[i].sizes[0] || '';
      }
    }
    return '';
  }

  function normalizeSizeValue(value) {
    if (!value) return '';
    var raw = String(value).trim();
    if (!raw) return '';
    if (AI_IMAGE_LABEL_TO_SIZE[raw]) raw = AI_IMAGE_LABEL_TO_SIZE[raw];
    if (raw.indexOf(':') !== -1 && raw.indexOf('x') === -1) {
      var mapped = getSizeByRatio(raw);
      if (mapped) raw = mapped;
    }
    var info = parseSize(raw);
    if (!info) return '';
    var norm = normalizeSize(info.w, info.h);
    if (!norm) return info.w + 'x' + info.h;
    return norm.width + 'x' + norm.height;
  }

  function readImageSizeFromInput() {
    var raw = (aiImageSizeInput && aiImageSizeInput.value || '').trim();
    if (!raw) return { size: AI_DEFAULTS.imageSize || '', mode: 'preset' };
    if (AI_IMAGE_LABEL_TO_SIZE[raw]) {
      return { size: AI_IMAGE_LABEL_TO_SIZE[raw], mode: 'preset' };
    }
    var strict = parseStrictSize(raw);
    if (strict) return { size: strict.w + 'x' + strict.h, mode: 'custom' };
    var loose = parseSize(raw);
    if (loose) {
      var s = loose.w + 'x' + loose.h;
      return { size: s, mode: AI_IMAGE_SIZE_TO_LABEL[s] ? 'preset' : 'custom' };
    }
    return { size: AI_DEFAULTS.imageSize || '', mode: 'preset' };
  }

  function commitImageSizeInput(silent) {
    if (!aiImageSizeInput) return;
    var raw = (aiImageSizeInput.value || '').trim();
    if (!raw) {
      var fallback = normalizeSizeValue(aiState && aiState.imageSize || AI_DEFAULTS.imageSize || '');
      aiImageSizeInput.value = getSizeLabel(fallback);
      return;
    }
    var isPreset = !!AI_IMAGE_LABEL_TO_SIZE[raw];
    var strict = parseStrictSize(raw);
    if (!isPreset && !strict) {
      setAiStatus('尺寸格式无效，请输入如 3000x2000。', 'err');
      var last = normalizeSizeValue(aiState && aiState.imageSize || AI_DEFAULTS.imageSize || '');
      aiImageSizeInput.value = getSizeLabel(last);
      return;
    }
    var sizeStr = isPreset ? AI_IMAGE_LABEL_TO_SIZE[raw] : (strict.w + 'x' + strict.h);
    var normalized = normalizeSizeValue(sizeStr);
    if (!normalized) normalized = sizeStr;
    if (aiState) {
      aiState.imageSize = normalized;
      aiState.imageSizeMode = (isPreset || AI_IMAGE_SIZE_TO_LABEL[normalized]) ? 'preset' : 'custom';
      saveAiSettings(aiState);
    }
    aiImageSizeInput.value = getSizeLabel(normalized);
    if (!silent && normalized !== sizeStr) {
      setAiStatus('尺寸已调整为 ' + normalized + '。', 'warn');
    }
    closeSizePanel();
  }

  var isUpdatingSizeOptions = false;

  function buildSizePanel() {
    if (!aiImageSizePanel) return;
    aiImageSizePanel.innerHTML = '';
    var current = normalizeSizeValue(aiState && aiState.imageSize ? aiState.imageSize : AI_DEFAULTS.imageSize);
    var currentLabel = getSizeLabel(current);
    AI_IMAGE_LABELS.forEach(function (label) {
      var item = document.createElement('div');
      item.className = 'ai-size-option' + (label === currentLabel ? ' selected' : '');
      item.textContent = label;
      item.addEventListener('click', function () {
        if (!aiImageSizeInput) return;
        aiImageSizeInput.value = label;
        if (!aiState) aiState = getAiSettings();
        commitImageSizeInput();
      });
      aiImageSizePanel.appendChild(item);
    });
  }

  function openSizePanel() {
    if (!aiImageSizePanel) return;
    buildSizePanel();
    aiImageSizePanel.classList.remove('hidden');
  }

  function closeSizePanel() {
    if (!aiImageSizePanel) return;
    aiImageSizePanel.classList.add('hidden');
  }

  function toggleSizePanel() {
    if (!aiImageSizePanel) return;
    if (aiImageSizePanel.classList.contains('hidden')) openSizePanel();
    else closeSizePanel();
  }

  function refreshImageSizeOptions(modelId) {
    if (!aiImageSizePanel) return;
    var list = getImageSizeListForModel(modelId);
    isUpdatingSizeOptions = true;
    if (aiImageSizePanel && !aiImageSizePanel.classList.contains('hidden')) {
      buildSizePanel();
    }
    isUpdatingSizeOptions = false;
  }

  function updateImageSizeUI() {
    if (!aiState || !aiImageSizeInput) return;
    var modelId = getSelectedModelId(aiState);
    refreshImageSizeOptions(modelId);
    var size = normalizeSizeValue(aiState.imageSize || AI_DEFAULTS.imageSize);
    if (!size) size = AI_DEFAULTS.imageSize;
    aiImageSizeInput.value = getSizeLabel(size);
  }

  function maskApiKey(value) {
    var t = (value || '').trim();
    if (!t) return '未配置';
    if (t.length <= 8) return '已配置';
    return t.slice(0, 3) + '****' + t.slice(-4);
  }

  function shortUrl(value) {
    var t = (value || '').trim();
    if (!t) return '';
    t = t.replace(/^https?:\/\//i, '');
    var idx = t.indexOf('/');
    if (idx > -1) {
      t = t.slice(0, idx + 1) + '...';
    }
    return t;
  }

  function updateAiAuthSummary() {
    if (!aiAuthSummary || !aiAuthStatus) return;
    var keyVal = aiKeyInput ? aiKeyInput.value.trim() : (aiState ? aiState.apiKey : '');
    var baseVal = aiBaseUrlInput ? aiBaseUrlInput.value.trim() : (aiState ? aiState.baseUrl : '');
    var hasKey = !!keyVal;
    var parts = [];
    parts.push(maskApiKey(keyVal));
    if (baseVal) parts.push(shortUrl(baseVal));
    aiAuthSummary.textContent = parts.join(' · ');
    aiAuthStatus.classList.toggle('ok', hasKey);
  }

  function setAiAuthCollapsed(collapsed, skipStore) {
    if (!aiAuthSection) return;
    if (!aiAuthBody) {
      aiAuthSection.classList.toggle('collapsed', !!collapsed);
    } else if (collapsed) {
      var current = aiAuthBody.scrollHeight;
      aiAuthBody.style.maxHeight = current + 'px';
      aiAuthBody.style.opacity = '1';
      requestAnimationFrame(function () {
        aiAuthSection.classList.add('collapsed');
        aiAuthBody.style.maxHeight = '0px';
        aiAuthBody.style.opacity = '0';
      });
    } else {
      aiAuthSection.classList.remove('collapsed');
      aiAuthBody.style.opacity = '0';
      aiAuthBody.style.maxHeight = '0px';
      requestAnimationFrame(function () {
        var target = aiAuthBody.scrollHeight;
        aiAuthBody.style.maxHeight = target + 'px';
        aiAuthBody.style.opacity = '1';
      });
      var onEnd = function (e) {
        if (e && e.propertyName !== 'max-height') return;
        aiAuthBody.style.maxHeight = 'none';
        aiAuthBody.removeEventListener('transitionend', onEnd);
      };
      aiAuthBody.addEventListener('transitionend', onEnd);
    }
    if (!skipStore) {
      try { localStorage.setItem(AI_AUTH_COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (e) {}
    }
    updateAiAuthSummary();
  }

  function initAiAuthCollapse() {
    if (!aiAuthSection) return;
    var stored = null;
    try { stored = localStorage.getItem(AI_AUTH_COLLAPSE_KEY); } catch (e) {}
    var keyVal = aiKeyInput ? aiKeyInput.value.trim() : (aiState ? aiState.apiKey : '');
    var hasKey = !!keyVal;
    var collapsed = stored === null ? hasKey : stored === '1';
    setAiAuthCollapsed(collapsed, true);
  }

  function getFeatureByType(type) {
    var t = type || 'image';
    for (var i = 0; i < AI_FEATURES.length; i += 1) {
      if (AI_FEATURES[i].type === t) return AI_FEATURES[i];
    }
    return AI_FEATURES[0];
  }

  function updateFeatureToggle() {
    if (!aiTypeLabel || !aiTypeIcon) return;
    var feature = getFeatureByType(aiState ? aiState.type : 'image');
    aiTypeLabel.textContent = feature.name || '图像生成';
    aiTypeIcon.textContent = feature.icon || '🖼️';
    if (aiTypeBadge) {
      aiTypeBadge.textContent = '';
      aiTypeBadge.style.display = 'none';
    }
    if (aiTypeList) renderFeatureList(aiTypeSearch ? aiTypeSearch.value : '');
  }

  function renderFeatureList(keyword) {
    if (!aiTypeList) return;
    var term = (keyword || '').trim().toLowerCase();
    var list = [];
    for (var i = 0; i < AI_FEATURES.length; i += 1) {
      var f = AI_FEATURES[i];
      if (!term) {
        list.push(f);
        continue;
      }
      var hay = (f.name + ' ' + f.category + ' ' + f.id).toLowerCase();
      if (hay.indexOf(term) !== -1) list.push(f);
    }
    var groups = {};
    var order = [];
    for (var j = 0; j < list.length; j += 1) {
      var item = list[j];
      var cat = item.category || '其他';
      if (!groups[cat]) {
        groups[cat] = [];
        order.push(cat);
      }
      groups[cat].push(item);
    }
    aiTypeList.innerHTML = '';
    if (!list.length) {
      var empty = document.createElement('div');
      empty.className = 'ai-feature-empty';
      empty.textContent = '没有匹配功能';
      aiTypeList.appendChild(empty);
      return;
    }
    order.forEach(function (cat) {
      var group = document.createElement('div');
      group.className = 'ai-feature-group';
      var title = document.createElement('div');
      title.className = 'ai-feature-title';
      title.textContent = cat;
      group.appendChild(title);
      var grid = document.createElement('div');
      grid.className = 'ai-feature-grid';
      groups[cat].forEach(function (feature) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-feature-item';
        if (aiState && feature.type === aiState.type) {
          btn.classList.add('selected');
        }
        btn.dataset.value = feature.type;
        btn.innerHTML = '<span class="ai-feature-icon-box"><span class="ai-feature-item-icon">' +
          (feature.icon || '') +
          '</span></span>' +
          '<span class="ai-feature-item-name">' + feature.name + '</span>';
        btn.addEventListener('click', function () {
          selectFeature(feature.type);
        });
        grid.appendChild(btn);
      });
      group.appendChild(grid);
      aiTypeList.appendChild(group);
    });
  }

  function openFeaturePicker() {
    if (!aiTypeDropdown) return;
    aiTypeDropdown.classList.add('open');
    updateLayoutMode();
    if (aiTypeSearch) {
      aiTypeSearch.value = '';
      aiTypeSearch.focus();
    }
    renderFeatureList('');
    requestAnimationFrame(function () {
      positionFeaturePanel();
    });
  }

  function closeFeaturePicker() {
    if (!aiTypeDropdown) return;
    aiTypeDropdown.classList.remove('open');
    resetFeaturePanelPosition();
  }

  function ensureAiInit() {
    if (aiInitDone) return;
    aiInitDone = true;
    var run = function () {
      aiModels = getModelList();
      aiState = getAiSettings();
      applyAiSettings(aiState);
    };
    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      window.requestIdleCallback(run, { timeout: 800 });
    } else {
      setTimeout(run, 0);
    }
  }

  function resetFeaturePanelPosition() {
    if (!aiTypePanel) return;
    aiTypePanel.style.position = '';
    aiTypePanel.style.left = '';
    aiTypePanel.style.top = '';
    aiTypePanel.style.width = '';
    aiTypePanel.style.height = '';
    aiTypePanel.style.maxHeight = '';
  }

  function positionFeaturePanel() {
    if (!aiTypePanel || !aiPanel) return;
    resetFeaturePanelPosition();
    try {
      var footer = aiPanel.querySelector('.ai-footer');
      if (!footer) return;
      var panelRect = aiTypePanel.getBoundingClientRect();
      var footerRect = footer.getBoundingClientRect();
      var available = footerRect.top - panelRect.top - 12;
      if (available < 200) available = 200;
      aiTypePanel.style.maxHeight = available + 'px';
    } catch (e) {}
  }

  function updateLayoutMode() {
    var narrow = false;
    var winW = window.innerWidth || 0;
    if (winW && winW < 520) narrow = true;
    if (aiPanel && aiPanel.classList.contains('open')) {
      try {
        var rect = aiPanel.getBoundingClientRect();
        if (rect && rect.width && rect.width < 460) narrow = true;
      } catch (e) {}
    }
    document.body.classList.toggle('narrow-ui', narrow);
  }

  function cacheFeatureParams(type) {
    if (!aiState) return;
    var key = type || aiState.type || 'image';
    if (!aiState.featureParams) aiState.featureParams = {};
    var sizeInfo = readImageSizeFromInput();
    var sizeMode = sizeInfo.mode || (aiState.imageSizeMode || 'preset');
    var sizeVal = normalizeSizeValue(sizeInfo.size || aiState.imageSize || AI_DEFAULTS.imageSize) || AI_DEFAULTS.imageSize;
    aiState.featureParams[key] = {
      imageSize: sizeVal,
      imageSizeMode: sizeMode,
      imageCount: aiImageCountInput ? parseInt(aiImageCountInput.value || '1', 10) || 1 : aiState.imageCount,
      imageUseLayer: aiUseLayerInput ? !!aiUseLayerInput.checked : aiState.imageUseLayer,
      imageInsertMode: aiImageInsertModeSelect ? aiImageInsertModeSelect.value : aiState.imageInsertMode,
      aiPythonSpeed: aiPythonSpeedInput ? !!aiPythonSpeedInput.checked : aiState.aiPythonSpeed,
      aiPythonMaxSide: aiPythonMaxSideInput ? parseInt(aiPythonMaxSideInput.value || '2000', 10) || 2000 : aiState.aiPythonMaxSide,
      aiPythonQuality: aiPythonQualityInput ? parseInt(aiPythonQualityInput.value || '80', 10) || 80 : aiState.aiPythonQuality,
      prompt: aiPromptInput ? aiPromptInput.value : '',
      videoImage: aiVideoImageInput ? aiVideoImageInput.value : '',
      textTask: aiTextTaskSelect ? aiTextTaskSelect.value : 'rewrite',
      textInput: aiTextInput ? aiTextInput.value : '',
      textOutput: aiTextOutput ? aiTextOutput.value : ''
    };
    saveAiSettings(aiState);
  }

  function restoreFeatureParams(type) {
    if (!aiState || !aiState.featureParams) return;
    var params = aiState.featureParams[type];
    if (!params) return;
    if (aiImageCountInput && params.imageCount != null) aiImageCountInput.value = params.imageCount;
    if (aiUseLayerInput && params.imageUseLayer != null) aiUseLayerInput.checked = !!params.imageUseLayer;
    if (aiImageInsertModeSelect && params.imageInsertMode) aiImageInsertModeSelect.value = params.imageInsertMode;
    if (aiPythonSpeedInput && params.aiPythonSpeed != null) aiPythonSpeedInput.checked = !!params.aiPythonSpeed;
    if (aiPythonMaxSideInput && params.aiPythonMaxSide) aiPythonMaxSideInput.value = params.aiPythonMaxSide;
    if (aiPythonQualityInput && params.aiPythonQuality) aiPythonQualityInput.value = params.aiPythonQuality;
    if (aiPromptInput && params.prompt != null) aiPromptInput.value = params.prompt;
    if (aiVideoImageInput && params.videoImage != null) aiVideoImageInput.value = params.videoImage;
    if (aiTextTaskSelect && params.textTask) aiTextTaskSelect.value = params.textTask;
    if (aiTextInput && params.textInput != null) aiTextInput.value = params.textInput;
    if (aiTextOutput && params.textOutput != null) aiTextOutput.value = params.textOutput;
    if (params.imageSize) aiState.imageSize = params.imageSize;
    if (params.imageSizeMode) aiState.imageSizeMode = params.imageSizeMode;
    updateImageSizeUI();
    syncAiStateFromControls();
  }

  function selectFeature(type) {
    if (!aiTypeSelect) return;
    aiTypeSelect.value = type;
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, false);
    aiTypeSelect.dispatchEvent(evt);
    closeFeaturePicker();
  }

  function applyAiSettings(settings) {
    if (!settings) return;
    if (aiBaseUrlInput) aiBaseUrlInput.value = settings.baseUrl || '';
    if (aiKeyInput) aiKeyInput.value = settings.apiKey || '';
    if (aiTypeSelect) aiTypeSelect.value = settings.type || 'image';
    aiState.type = aiTypeSelect ? aiTypeSelect.value : (settings.type || 'image');
    setAiType(aiState.type);
    updateFeatureToggle();
    updateTierOptions();
    if (aiTierSelect && settings.tier) aiTierSelect.value = settings.tier;
    if (aiTierSelect) aiState.tier = aiTierSelect.value;
    updateModelOptions();
    if (aiImageCountInput) aiImageCountInput.value = settings.imageCount || 1;
    if (aiUseLayerInput) aiUseLayerInput.checked = !!settings.imageUseLayer;
    if (aiImageInsertModeSelect) aiImageInsertModeSelect.value = settings.imageInsertMode || 'insert';
    if (aiPythonSpeedInput) aiPythonSpeedInput.checked = !!settings.aiPythonSpeed;
    if (aiPythonMaxSideInput) aiPythonMaxSideInput.value = settings.aiPythonMaxSide || 2000;
    if (aiPythonQualityInput) aiPythonQualityInput.value = settings.aiPythonQuality || 80;
    if (aiTextTaskSelect) aiTextTaskSelect.value = settings.textTask || 'rewrite';
    updateImageSizeUI();
    updateAiAuthSummary();
    initAiAuthCollapse();
  }

  function syncAiStateFromControls() {
    if (!aiState) aiState = getAiSettings();
    if (aiBaseUrlInput) aiState.baseUrl = aiBaseUrlInput.value.trim();
    if (aiKeyInput) aiState.apiKey = aiKeyInput.value.trim();
    if (aiTypeSelect) aiState.type = aiTypeSelect.value;
    if (aiTierSelect) aiState.tier = aiTierSelect.value;
    if (aiImageCountInput) aiState.imageCount = parseInt(aiImageCountInput.value || '1', 10) || 1;
    if (aiUseLayerInput) aiState.imageUseLayer = !!aiUseLayerInput.checked;
    if (aiImageInsertModeSelect) aiState.imageInsertMode = aiImageInsertModeSelect.value || 'insert';
    if (aiPythonSpeedInput) aiState.aiPythonSpeed = !!aiPythonSpeedInput.checked;
    if (aiPythonMaxSideInput) aiState.aiPythonMaxSide = parseInt(aiPythonMaxSideInput.value || '2000', 10) || 2000;
    if (aiPythonQualityInput) aiState.aiPythonQuality = parseInt(aiPythonQualityInput.value || '80', 10) || 80;
    if (aiTextTaskSelect) aiState.textTask = aiTextTaskSelect.value || 'rewrite';
    var sizeInfo = readImageSizeFromInput();
    aiState.imageSizeMode = sizeInfo.mode || 'preset';
    aiState.imageSize = normalizeSizeValue(sizeInfo.size || aiState.imageSize || AI_DEFAULTS.imageSize) || AI_DEFAULTS.imageSize;
    if (aiModelSelect) {
      if (aiModelSelect.value === '__custom__') {
        setSelectedModelForCurrent((aiModelCustomInput && aiModelCustomInput.value || '').trim(), true);
      } else {
        setSelectedModelForCurrent(aiModelSelect.value, false);
      }
    }
    if (aiState) refreshImageSizeOptions(getSelectedModelId(aiState));
    saveAiSettings(aiState);
    return aiState;
  }

  function setAiType(type) {
    var t = type || 'image';
    var allowed = ['image', 'video', 'text', '3d', 'embedding', 'embedding-mm'];
    if (allowed.indexOf(t) === -1) t = 'image';
    document.body.classList.remove('ai-type-image', 'ai-type-video', 'ai-type-text', 'ai-type-3d', 'ai-type-embedding', 'ai-type-embedding-mm');
    document.body.classList.add('ai-type-' + t);
  }

  function normalizeBaseUrl(value) {
    var v = (value || '').trim();
    if (!v) return '';
    if (v.charAt(v.length - 1) !== '/') v += '/';
    return v;
  }

  function fetchJsonWithStatus(url, options, cb) {
    try {
      fetch(url, options).then(function (r) {
        return r.text().then(function (t) {
          var data = null;
          try { data = JSON.parse(t); } catch (e) {}
          cb({ ok: r.ok, status: r.status, data: data, raw: t });
        });
      }).catch(function (err) {
        cb({ ok: false, status: 0, error: err });
      });
    } catch (e) {
      cb({ ok: false, status: 0, error: e });
    }
  }

  function formatApiError(res) {
    if (!res) return '未知错误';
    if (res.error) return String(res.error);
    var data = res.data || {};
    var err = data.error || data.err || data.message || null;
    if (data && data.error && data.error.message) err = data.error.message;
    if (!err && data && data.msg) err = data.msg;
    if (!err && res.raw) {
      err = res.raw;
    }
    if (typeof err === 'object') {
      if (err.message) err = err.message;
      else err = JSON.stringify(err);
    }
    err = String(err || '').trim();
    if (!err) err = '未知错误';
    if (res.status) err = 'HTTP ' + res.status + ' - ' + err;
    return err;
  }

  function positionAiPanel() {
    if (!aiPanel || !aiBtn) return;
    var rect = aiBtn.getBoundingClientRect();
    var top = Math.max(10, rect.bottom + 6);
    var right = Math.max(10, window.innerWidth - rect.right);
    aiPanel.style.top = top + 'px';
    aiPanel.style.right = right + 'px';
  }

  function showAiPanel(show) {
    if (!aiPanel) return;
    if (show) {
      positionAiPanel();
      aiPanel.classList.add('open');
      if (captureHintEl) captureHintEl.style.display = 'none';
    } else {
      aiPanel.classList.remove('open');
      if (captureHintEl) captureHintEl.style.display = captureModeEnabled ? 'block' : 'none';
    }
  }

  function fetchToDataUrl(url, cb) {
    try {
      if (url.indexOf('data:') === 0) {
        cb(url);
        return;
      }
      fetch(url).then(function (r) { return r.blob(); }).then(function (blob) {
        var reader = new FileReader();
        reader.onload = function () { cb(reader.result); };
        reader.onerror = function () { cb(null); };
        reader.readAsDataURL(blob);
      }).catch(function () { cb(null); });
    } catch (e) {
      cb(null);
    }
  }

  function insertDataUrlToPs(dataUrl) {
    if (!dataUrl) return;
    var script = 'psexCapture_insertImageFromData(' + JSON.stringify(dataUrl) + ');';
    cs.evalScript(script);
  }

  function replaceDataUrlInPs(dataUrl) {
    if (!dataUrl) return;
    var script = 'psexCapture_replaceActiveLayerFromData(' + JSON.stringify(dataUrl) + ');';
    cs.evalScript(script);
  }

  function downscaleDataUrlIfNeeded(dataUrl, cb) {
    if (!dataUrl || !cb) return;
    if (!scaleState || !scaleState.enabled) {
      cb(dataUrl, false);
      return;
    }
    if (dataUrl.indexOf('data:image/svg') === 0) {
      cb(dataUrl, false);
      return;
    }
    var maxSide = parseInt(scaleState.maxSide || SCALE_DEFAULTS.maxSide, 10);
    if (!maxSide || maxSide < 800) {
      cb(dataUrl, false);
      return;
    }
    var img = new Image();
    img.onload = function () {
      try {
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        var maxDim = Math.max(w, h);
        if (!maxDim || maxDim <= maxSide) {
          cb(dataUrl, false);
          return;
        }
        var scale = maxSide / maxDim;
        var tw = Math.max(1, Math.round(w * scale));
        var th = Math.max(1, Math.round(h * scale));
        var canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, tw, th);
        var out = canvas.toDataURL('image/png');
        cb(out, true);
      } catch (e) {
        cb(dataUrl, false);
      }
    };
    img.onerror = function () { cb(dataUrl, false); };
    img.src = dataUrl;
  }

  function processDataUrlForInsert(dataUrl, options, cb) {
    if (!dataUrl || !cb) return;
    var opts = options || {};
    if (dataUrl.indexOf('data:image/svg') === 0) {
      cb(dataUrl, { scaled: false, jpeg: false });
      return;
    }
    var useScale = !!(scaleState && scaleState.enabled) && !opts.skipScale;
    var useJpeg = !!(jpegState && jpegState.enabled) && !opts.skipJpeg;
    var maxSide = parseInt(scaleState && scaleState.maxSide || SCALE_DEFAULTS.maxSide, 10);
    if (!maxSide || maxSide < 800) useScale = false;
    if (!useScale && !useJpeg) {
      cb(dataUrl, { scaled: false, jpeg: false });
      return;
    }
    var img = new Image();
    img.onload = function () {
      try {
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        var maxDim = Math.max(w, h);
        var scaled = false;
        var tw = w;
        var th = h;
        if (useScale && maxDim > maxSide) {
          var scale = maxSide / maxDim;
          tw = Math.max(1, Math.round(w * scale));
          th = Math.max(1, Math.round(h * scale));
          scaled = true;
        }
        if (!scaled && !useJpeg) {
          cb(dataUrl, { scaled: false, jpeg: false });
          return;
        }
        var canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        var ctx = canvas.getContext('2d');
        if (useJpeg) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, tw, th);
        }
        ctx.drawImage(img, 0, 0, tw, th);
        var out = dataUrl;
        if (useJpeg) {
          var quality = parseInt(jpegState && jpegState.quality || JPEG_DEFAULTS.quality, 10);
          if (isNaN(quality) || quality < 10) quality = JPEG_DEFAULTS.quality;
          if (quality > 100) quality = 100;
          out = canvas.toDataURL('image/jpeg', quality / 100);
        } else if (scaled) {
          out = canvas.toDataURL('image/png');
        }
        cb(out, { scaled: scaled, jpeg: useJpeg });
      } catch (e) {
        cb(dataUrl, { scaled: false, jpeg: false });
      }
    };
    img.onerror = function () { cb(dataUrl, { scaled: false, jpeg: false }); };
    img.src = dataUrl;
  }

  function insertTextLayerToPs(text) {
    if (!text) return;
    var script = 'psexCapture_insertTextLayerAtSelection(' + JSON.stringify(text) + ');';
    cs.evalScript(script, function (res) {
      if (!res) return;
      if (String(res).indexOf('replaced:') === 0) {
        var count = res.replace('replaced:', '');
        setAiStatus('已替换 ' + count + ' 个文字图层。', 'ok');
        return;
      }
      if (res === 'inserted') {
        setAiStatus('已在选中图层位置插入文本。', 'ok');
        return;
      }
      if (res === 'ok' || res === 'opened' || res === 'placed') {
        setAiStatus('已插入文本。', 'ok');
        return;
      }
      if (String(res).indexOf('error:') === 0) {
        setAiStatus('插入失败：' + res.replace(/^error:/, ''), 'err');
      }
    });
  }

  function filePathToFileUrl(filePath) {
    if (!filePath) return '';
    var p = String(filePath).replace(/\\/g, '/');
    if (/^[A-Za-z]:/.test(p)) p = '/' + p;
    return 'file://' + p;
  }

  function fileToDataUrl(filePath) {
    var mods = getNodeModules();
    if (!mods || !mods.fs || !mods.path) return '';
    try {
      var ext = mods.path.extname(filePath || '').toLowerCase();
      var mime = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.gif') mime = 'image/gif';
      var buf = mods.fs.readFileSync(filePath);
      return 'data:' + mime + ';base64,' + buf.toString('base64');
    } catch (e) {
      return '';
    }
  }

  function getActiveLayerDataUrl(cb, targetW, targetH) {
    if (!cb) return;
    var mods = getNodeModules();
    if (!mods || !mods.path) {
      cb(null, 'NodeJS 未启用');
      return;
    }
    var dir = getAiCacheDir();
    if (!dir || !ensureDirPath(mods, dir)) {
      cb(null, '缓存目录不可用');
      return;
    }
    var outPath = '';
    try { outPath = mods.path.join(dir, 'layer_' + Date.now() + '.png'); } catch (e) {}
    if (!outPath) {
      cb(null, '无法创建缓存文件');
      return;
    }
    var script = 'psexCapture_exportActiveLayerToFile(' + JSON.stringify(outPath) + ');';
    cs.evalScript(script, function (res) {
      if (!res || typeof res !== 'string') {
        cb(null, '无法读取选中图层。');
        return;
      }
      if (res.indexOf('error:') === 0) {
        var detail = res.replace(/^error:/, '') || '读取失败';
        cb(null, detail);
        return;
      }
      if (res === 'no_doc') {
        cb(null, '没有打开文档。');
        return;
      }
      if (res === 'no_layer') {
        cb(null, '没有选中图层。');
        return;
      }
      if (res !== 'ok') {
        cb(null, '选中图层导出异常。');
        return;
      }
      var maxSide = Math.max(parseInt(targetW || 0, 10) || 0, parseInt(targetH || 0, 10) || 0);
      var usePython = !!(aiState && aiState.aiPythonSpeed);
      if (usePython && maxSide > 0) {
        var fileUrl = filePathToFileUrl(outPath);
        runPythonTranscode(fileUrl, { referer: '', title: '' }, function (err, pyOutPath) {
          if (err) {
            var fallback = fileToDataUrl(outPath);
            if (!fallback) return cb(null, '读取图层失败。');
            cb(fallback);
            return;
          }
          var dataUrl = fileToDataUrl(pyOutPath || outPath);
          if (!dataUrl) return cb(null, '读取图层失败。');
          cb(dataUrl);
        }, {
          maxSide: maxSide,
          format: 'png',
          quality: aiState.aiPythonQuality || 80
        });
        return;
      }
      var dataUrl = fileToDataUrl(outPath);
      if (!dataUrl) {
        cb(null, '读取图层失败。');
        return;
      }
      cb(dataUrl, '');
    });
  }

  function clearAiResult() {
    aiGeneratedImages = [];
    aiResultItems = [];
    aiExpectedCount = 0;
    aiSelectedId = null;
    closeAiPreview();
    if (aiResultEl) aiResultEl.innerHTML = '';
  }

  function isAiDebug() {
    try {
      return localStorage.getItem(AI_DEBUG_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function updatePreviewPrompt(item) {
    if (!aiPreviewPromptEl || !aiPreviewPromptText) return;
    var prompt = item && item.prompt ? String(item.prompt) : '';
    aiPreviewPromptText.textContent = prompt || '';
    aiPreviewPromptEl.classList.toggle('hidden', !prompt);
    if (aiPreviewCopyPromptBtn) {
      aiPreviewCopyPromptBtn.disabled = !prompt;
    }
  }

  function getPreviewMetrics() {
    if (!aiPreviewBody || !aiPreviewImg) return null;
    var iw = aiPreviewImg.naturalWidth || aiPreviewImg.width || 0;
    var ih = aiPreviewImg.naturalHeight || aiPreviewImg.height || 0;
    if (!iw || !ih) return null;
    var vw = aiPreviewBody.clientWidth || 1;
    var vh = aiPreviewBody.clientHeight || 1;
    return { iw: iw, ih: ih, vw: vw, vh: vh };
  }

  function clampPreviewTransform(scale, tx, ty) {
    var m = getPreviewMetrics();
    if (!m) return { scale: scale, x: tx, y: ty };
    var w = m.iw * scale;
    var h = m.ih * scale;
    if (w <= m.vw) tx = (m.vw - w) / 2;
    else tx = Math.min(0, Math.max(m.vw - w, tx));
    if (h <= m.vh) ty = (m.vh - h) / 2;
    else ty = Math.min(0, Math.max(m.vh - h, ty));
    return { scale: scale, x: tx, y: ty };
  }

  function applyPreviewTransform() {
    if (!aiPreviewImg) return;
    var m = getPreviewMetrics();
    if (!m) return;
    aiPreviewImg.style.width = m.iw + 'px';
    aiPreviewImg.style.height = m.ih + 'px';
    var clamped = clampPreviewTransform(aiPreviewScale, aiPreviewTranslateX, aiPreviewTranslateY);
    aiPreviewScale = clamped.scale;
    aiPreviewTranslateX = clamped.x;
    aiPreviewTranslateY = clamped.y;
    aiPreviewImg.style.transform = 'translate(' + Math.round(aiPreviewTranslateX) + 'px,' + Math.round(aiPreviewTranslateY) + 'px) scale(' + aiPreviewScale + ')';
    if (aiPreviewBody) {
      aiPreviewBody.classList.toggle('is-pan', aiPreviewScale > 1.01);
    }
  }

  function setAiPreviewMode(mode) {
    aiPreviewMode = mode === 'fit' ? 'fit' : 'scale';
    var m = getPreviewMetrics();
    if (!m) return;
    if (aiPreviewMode === 'fit') {
      var s = Math.min(m.vw / m.iw, m.vh / m.ih);
      if (!isFinite(s) || s <= 0) s = 1;
      aiPreviewScale = Math.max(AI_PREVIEW_MIN_SCALE, Math.min(AI_PREVIEW_MAX_SCALE, s));
      aiPreviewTranslateX = (m.vw - m.iw * aiPreviewScale) / 2;
      aiPreviewTranslateY = (m.vh - m.ih * aiPreviewScale) / 2;
    }
    applyPreviewTransform();
  }

  function setAiPreviewScale(scale, anchorX, anchorY) {
    var m = getPreviewMetrics();
    if (!m) return;
    var newScale = Math.max(AI_PREVIEW_MIN_SCALE, Math.min(AI_PREVIEW_MAX_SCALE, Number(scale) || 1));
    var ax = (typeof anchorX === 'number') ? anchorX : (m.vw / 2);
    var ay = (typeof anchorY === 'number') ? anchorY : (m.vh / 2);
    var imgX = (ax - aiPreviewTranslateX) / (aiPreviewScale || 1);
    var imgY = (ay - aiPreviewTranslateY) / (aiPreviewScale || 1);
    aiPreviewScale = newScale;
    aiPreviewTranslateX = ax - imgX * newScale;
    aiPreviewTranslateY = ay - imgY * newScale;
    aiPreviewMode = 'scale';
    applyPreviewTransform();
  }

  function zoomPreviewStep(dir, anchorX, anchorY) {
    var levels = [0.5, 1, 2, 4];
    var current = aiPreviewScale || 1;
    var idx = -1;
    for (var i = 0; i < levels.length; i += 1) {
      if (Math.abs(levels[i] - current) < 0.01) { idx = i; break; }
    }
    if (idx === -1) {
      idx = 1;
      for (var j = 0; j < levels.length; j += 1) {
        if (levels[j] >= current) { idx = j; break; }
      }
    }
    var next = idx + (dir > 0 ? 1 : -1);
    if (next < 0) next = 0;
    if (next >= levels.length) next = levels.length - 1;
    setAiPreviewScale(levels[next], anchorX, anchorY);
  }

  function togglePreviewMax() {
    if (!aiPreviewEl) return;
    var card = aiPreviewEl.querySelector('.ai-preview-card');
    if (!card) return;
    aiPreviewIsMax = !aiPreviewIsMax;
    card.classList.toggle('is-max', aiPreviewIsMax);
    if (aiPreviewMaxBtn) aiPreviewMaxBtn.textContent = aiPreviewIsMax ? '还原' : '最大化';
    if (aiPreviewMode === 'fit') setAiPreviewMode('fit');
    else applyPreviewTransform();
  }

  function setAiHistoryMax(force) {
    if (!aiHistoryEl) return;
    var card = aiHistoryEl.querySelector('.ai-history-card');
    if (!card) return;
    aiHistoryIsMax = (typeof force === 'boolean') ? force : !aiHistoryIsMax;
    card.classList.toggle('is-max', aiHistoryIsMax);
    if (aiHistoryMaxBtn) aiHistoryMaxBtn.textContent = aiHistoryIsMax ? '还原' : '最大化';
  }

  function openAiPreview(item) {
    if (!aiPreviewEl || !aiPreviewImg || !item) return;
    aiPreviewItem = item;
    updatePreviewPrompt(item);
    aiPreviewImg.onload = function () {
      if (aiPreviewMode === 'fit') setAiPreviewMode('fit');
      else applyPreviewTransform();
    };
    aiPreviewImg.src = item.url;
    aiPreviewScale = 1;
    aiPreviewTranslateX = 0;
    aiPreviewTranslateY = 0;
    setAiPreviewMode('fit');
    if (aiPreviewBody) {
      aiPreviewBody.classList.remove('dragging');
    }
    if (aiPreviewMaxBtn) {
      aiPreviewMaxBtn.textContent = aiPreviewIsMax ? '还原' : '最大化';
    }
    aiPreviewEl.classList.add('open');
  }

  function closeAiPreview() {
    if (!aiPreviewEl) return;
    aiPreviewEl.classList.remove('open');
    if (aiPreviewBody) {
      aiPreviewBody.classList.remove('dragging');
      aiPreviewBody.classList.remove('is-pan');
    }
    aiPreviewItem = null;
  }

  function selectAiImage(id) {
    aiSelectedId = id || null;
    if (!aiResultEl) return;
    var cards = aiResultEl.querySelectorAll('.ai-result-item');
    Array.prototype.forEach.call(cards, function (el) {
      var isSel = el.getAttribute('data-id') === aiSelectedId;
      el.classList.toggle('selected', isSel);
    });
  }

  function getSelectedAiItem() {
    if (!aiGeneratedImages || !aiGeneratedImages.length) return null;
    var found = null;
    if (aiSelectedId) {
      found = aiGeneratedImages.filter(function (it) { return it.id === aiSelectedId; })[0] || null;
    }
    if (found && found.url) return found;
    var ready = aiGeneratedImages.filter(function (it) { return it.url; })[0] || null;
    return ready || found || aiGeneratedImages[0] || null;
  }

  function insertAiImageUrl(input, insertMode, cb) {
    var item = (input && typeof input === 'object') ? input : { url: input };
    var url = item ? item.url : '';
    var localPath = item && item.localPath ? item.localPath : '';
    if (localPath) {
      placeFileByPath(localPath, { scaled: false, jpeg: false });
      if (cb) cb(true);
      return;
    }
    var isHttp = url && url.indexOf('http') === 0;
    var canPython = !!(pythonState && pythonState.enabled) && isHttp;
    var pySpeed = !!(aiState && aiState.aiPythonSpeed);

    function done(ok) {
      if (cb) cb(ok);
    }

    function insertByDataUrl(dataUrl) {
      if (!dataUrl) return done(false);
      processDataUrlForInsert(dataUrl, {}, function (processedUrl, info) {
        var notes = [];
        if (info && info.scaled) notes.push('已自动压缩大图');
        if (info && info.jpeg) notes.push('已启用JPG压缩');
        if (notes.length) setAiStatus(notes.join('，') + '后插入。', 'ok');
        if (insertMode === 'replace') replaceDataUrlInPs(processedUrl);
        else insertDataUrlToPs(processedUrl);
        done(true);
      });
    }

    function insertByPython() {
      if (!canPython) return done(false);
      if (pythonBusy) {
        setAiStatus('Python 转码中，请稍候…', '');
        return done(false);
      }
      var override = null;
      if (pySpeed) {
        var maxSide = parseInt((aiState && aiState.aiPythonMaxSide) || 2000, 10);
        if (isNaN(maxSide) || maxSide < 800) maxSide = 2000;
        var quality = parseInt((aiState && aiState.aiPythonQuality) || 80, 10);
        if (isNaN(quality) || quality < 10) quality = 80;
        if (quality > 100) quality = 100;
        override = { maxSide: maxSide, format: 'jpeg', quality: quality };
      }
      pythonBusy = true;
      setCaptureBusy(true);
      var msg = (originalState && originalState.enabled) ? '原图模式处理中…' : (pySpeed ? 'Python 转码加速中…' : 'Python 转码中…');
      setAiStatus(msg, '');
      runPythonTranscode(url, { referer: '', title: '' }, function (err, outPath) {
        pythonBusy = false;
        setCaptureBusy(false);
        if (err || !outPath) {
          setAiStatus('Python 转码失败：' + (err || '未知错误'), 'err');
          return done(false);
        }
        placeFileByPath(outPath, {
          scaled: !!(scaleState && scaleState.enabled) && !(originalState && originalState.enabled),
          jpeg: !!(jpegState && jpegState.enabled) && !(originalState && originalState.enabled)
        });
        done(true);
      }, override);
    }

    if (canPython) {
      insertByPython();
      return;
    }

    fetchToDataUrl(url, function (dataUrl) {
      if (!dataUrl) return done(false);
      insertByDataUrl(dataUrl);
    });
  }

  function insertAiImagesSequential(items, insertMode, idx) {
    if (!items || !items.length) return;
    var i = idx || 0;
    if (i >= items.length) return;
    var item = items[i];
    insertAiImageUrl(item, insertMode, function () {
      setTimeout(function () {
        insertAiImagesSequential(items, insertMode, i + 1);
      }, 120);
    });
  }

  function createAiProgressOverlay(progress) {
    var overlay = document.createElement('div');
    overlay.className = 'ai-result-progress';
    var ring = document.createElement('div');
    ring.className = 'ai-progress-ring';
    var text = document.createElement('div');
    text.className = 'ai-progress-text';
    text.textContent = Math.max(0, Math.min(100, Math.round(progress || 0))) + '%';
    overlay.appendChild(ring);
    overlay.appendChild(text);
    return overlay;
  }

  function updateAiJobProgress(id, progress) {
    if (!aiResultEl || !id) return;
    var card = aiResultEl.querySelector('.ai-result-item[data-id="' + id + '"]');
    if (!card) return;
    var overlay = card.querySelector('.ai-result-progress');
    var pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
    if (!overlay && pct < 100) {
      overlay = createAiProgressOverlay(pct);
      card.appendChild(overlay);
    }
    if (overlay) {
      var text = overlay.querySelector('.ai-progress-text');
      if (text) text.textContent = pct + '%';
      overlay.classList.toggle('hidden', pct >= 100);
    }
  }

  function initAiPlaceholders(count, promptText) {
    aiGeneratedImages = [];
    aiResultItems = [];
    var total = count || 1;
    aiExpectedCount = total;
    var now = Date.now();
    for (var i = 0; i < total; i += 1) {
      aiGeneratedImages.push({
        id: 'ai_job_' + now + '_' + i,
        url: '',
        label: '图片' + (i + 1),
        prompt: promptText || '',
        progress: 5,
        status: 'queued',
        _cached: false
      });
    }
    aiSelectedId = aiGeneratedImages[0] ? aiGeneratedImages[0].id : null;
    renderAiResult(aiGeneratedImages, 'image');
    aiGeneratedImages.forEach(function (item) {
      updateAiJobProgress(item.id, item.progress);
    });
  }

  function applyAiResults(items, promptText) {
    var now = Date.now();
    var expected = Math.max(aiExpectedCount || 0, items.length);
    var next = [];
    for (var i = 0; i < expected; i += 1) {
      var it = items[i] || null;
      var prev = aiGeneratedImages[i] || null;
      if (it) {
        next.push({
          id: prev ? prev.id : ('ai_' + now + '_' + i),
          url: it.url || '',
          label: it.label || it.url || ('图片' + (i + 1)),
          prompt: (it.prompt != null ? it.prompt : promptText) || '',
          progress: typeof it.progress === 'number' ? it.progress : (it.url ? 70 : 5),
          status: it.status || (it.url ? 'downloading' : 'queued'),
          localPath: it.localPath || '',
          rawPath: it.rawPath || '',
          _cached: prev ? !!prev._cached : false
        });
      } else if (prev) {
        next.push(prev);
      } else {
        next.push({
          id: 'ai_job_' + now + '_' + i,
          url: '',
          label: '图片' + (i + 1),
          prompt: promptText || '',
          progress: 5,
          status: 'queued',
          _cached: false
        });
      }
    }
    aiGeneratedImages = next;
    var ready = aiGeneratedImages.filter(function (it) { return it.url; })[0] || null;
    aiSelectedId = (ready || aiGeneratedImages[0]) ? (ready || aiGeneratedImages[0]).id : null;
    renderAiResult(aiGeneratedImages, 'image');
  }

  function renderAiResult(items, type) {
    if (!aiResultEl) return;
    aiResultEl.innerHTML = '';
    if (type !== 'image') {
      aiGeneratedImages = [];
      aiSelectedId = null;
    }
    if (!items || !items.length) {
      var empty = document.createElement('div');
      empty.className = 'ai-text';
      empty.textContent = '暂无结果';
      aiResultEl.appendChild(empty);
      return;
    }
    if (type === 'image') {
      var promptText = (aiPromptInput && aiPromptInput.value || '').trim();
      var now = Date.now();
      aiGeneratedImages = items.map(function (it, idx) {
        var id = it.id || ('ai_' + now + '_' + idx);
        var url = it.url || '';
        var progress = (typeof it.progress === 'number') ? it.progress : (url ? 70 : 5);
        return {
          id: id,
          url: url,
          label: it.label || it.url || ('图片' + (idx + 1)),
          prompt: (it.prompt != null ? it.prompt : promptText) || '',
          progress: progress,
          status: it.status || (url ? 'downloading' : 'queued'),
          localPath: it.localPath || '',
          rawPath: it.rawPath || ''
        };
      });
      var firstReady = aiGeneratedImages.filter(function (it) { return it.url; })[0] || null;
      aiSelectedId = (firstReady || aiGeneratedImages[0]) ? (firstReady || aiGeneratedImages[0]).id : null;

      var actionBar = document.createElement('div');
      actionBar.className = 'ai-result-actions';

      var insertMode = aiState && aiState.imageInsertMode === 'replace' ? 'replace' : 'insert';
      var insertBtn = document.createElement('button');
      insertBtn.textContent = insertMode === 'replace' ? '替换图层' : '插入PS';
      insertBtn.addEventListener('click', function () {
        var item = getSelectedAiItem();
        if (!item) return;
        insertAiImageUrl(item, insertMode);
      });
      actionBar.appendChild(insertBtn);

      if (aiGeneratedImages.length > 1) {
        var insertAllBtn = document.createElement('button');
        insertAllBtn.textContent = '插入全部';
        insertAllBtn.addEventListener('click', function () {
          insertAiImagesSequential(aiGeneratedImages, insertMode, 0);
        });
        actionBar.appendChild(insertAllBtn);
      }

      var previewBtn = document.createElement('button');
      previewBtn.textContent = '预览';
      previewBtn.addEventListener('click', function () {
        var item = getSelectedAiItem();
        if (item) openAiPreview(item);
      });
      actionBar.appendChild(previewBtn);

        aiResultEl.appendChild(actionBar);

      var grid = document.createElement('div');
      grid.className = 'ai-result-grid' + (aiGeneratedImages.length === 1 ? ' single' : '');
      aiGeneratedImages.forEach(function (item) {
        var card = document.createElement('div');
        card.className = 'ai-result-item';
        card.setAttribute('data-id', item.id);

        if (item.url) {
          var img = document.createElement('img');
          img.className = 'ai-result-thumb';
          img.src = item.url;
          img.addEventListener('load', function () {
            var w = img.naturalWidth || img.width || 0;
            var h = img.naturalHeight || img.height || 0;
            if (w > 0 && h > 0) {
              card.style.setProperty('--thumb-ratio', w + ' / ' + h);
            }
          });
          card.appendChild(img);
        } else {
          var placeholder = document.createElement('div');
          placeholder.className = 'ai-result-thumb placeholder';
          placeholder.textContent = '生成中';
          card.appendChild(placeholder);
        }

        var meta = document.createElement('div');
        meta.className = 'ai-result-meta';
        meta.textContent = item.label;
        card.appendChild(meta);

        var prog = typeof item.progress === 'number' ? item.progress : (item.url ? 100 : 5);
        if (prog < 100) {
          var overlay = createAiProgressOverlay(prog);
          card.appendChild(overlay);
        }

        if (item.prompt) {
          var tip = document.createElement('div');
          tip.className = 'ai-result-tip';
          var tipText = document.createElement('div');
          tipText.textContent = item.prompt;
          tip.appendChild(tipText);
          var copyBtn = document.createElement('button');
          copyBtn.textContent = '复制提示词';
          copyBtn.addEventListener('click', function (ev) {
            if (ev && ev.stopPropagation) ev.stopPropagation();
            copyToClipboard(item.prompt);
          });
          tip.appendChild(copyBtn);
          card.appendChild(tip);
        }

        card.addEventListener('click', function () {
          selectAiImage(item.id);
        });
        card.addEventListener('dblclick', function () {
          openAiPreview(item);
        });
        grid.appendChild(card);
      });
      aiResultEl.appendChild(grid);
      selectAiImage(aiSelectedId);
      return;
    }

    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'ai-card';
      var text = document.createElement('div');
      text.className = 'ai-text';
      text.textContent = item.label || item.url || '结果';
      card.appendChild(text);
      var actions = document.createElement('div');
      actions.className = 'ai-actions';
      var openBtn2 = document.createElement('button');
      openBtn2.textContent = '打开';
      openBtn2.addEventListener('click', function () {
        if (item.url) {
          try { browser.src = item.url; } catch (e) {}
        }
      });
      actions.appendChild(openBtn2);
      card.appendChild(actions);
      aiResultEl.appendChild(card);
    });
  }

  function extractImageResults(resp) {
    var out = [];
    if (!resp) return out;
    function addItem(it) {
      if (!it) return;
      if (it.url) out.push({ url: it.url });
      if (it.image_url && it.image_url.url) out.push({ url: it.image_url.url });
      if (it.b64_json) out.push({ url: 'data:image/png;base64,' + it.b64_json });
      if (it.base64) out.push({ url: 'data:image/png;base64,' + it.base64 });
      if (it.image_base64) out.push({ url: 'data:image/png;base64,' + it.image_base64 });
    }
    function addArray(arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(function (it) { addItem(it); });
    }

    var data = resp.data || resp.images || resp.result || resp;
    if (Array.isArray(data)) {
      addArray(data);
    } else {
      if (data && Array.isArray(data.data)) addArray(data.data);
      if (data && Array.isArray(data.images)) addArray(data.images);
      if (data && Array.isArray(data.results)) addArray(data.results);
      if (data && Array.isArray(data.outputs)) addArray(data.outputs);
      if (data && data.url) addItem(data);
    }

    if (!out.length && resp && resp.output) {
      if (Array.isArray(resp.output)) addArray(resp.output);
      if (resp.output.images) addArray(resp.output.images);
      if (resp.output.data) addArray(resp.output.data);
    }
    return out;
  }

  function extractVideoResults(resp) {
    var out = [];
    var content = null;
    if (resp && resp.content) content = resp.content;
    if (resp && resp.data && resp.data.content) content = resp.data.content;
    if (Array.isArray(content)) {
      content.forEach(function (it) {
        if (!it) return;
        if (it.video_url && it.video_url.url) out.push({ url: it.video_url.url });
        if (it.image_url && it.image_url.url) out.push({ url: it.image_url.url });
        if (it.url) out.push({ url: it.url });
      });
      return out;
    }
    if (resp && resp.url) out.push({ url: resp.url });
    return out;
  }

  function resolveImageSize(settings) {
    var raw = (aiImageSizeInput && aiImageSizeInput.value || '').trim();
    if (!raw) raw = (settings && settings.imageSize ? String(settings.imageSize).trim() : '');
    if (!raw) return AI_DEFAULTS.imageSize || '';
    if (AI_IMAGE_LABEL_TO_SIZE[raw]) return AI_IMAGE_LABEL_TO_SIZE[raw];
    if (raw.indexOf(':') !== -1 && raw.indexOf('x') === -1) {
      var mapped = getSizeByRatio(raw);
      if (mapped) return mapped;
    }
    var info = parseStrictSize(raw) || parseSize(raw);
    if (info) return info.w + 'x' + info.h;
    return AI_DEFAULTS.imageSize || '';
  }

  function parseStrictSize(size) {
    if (!size) return null;
    var m = String(size).match(/^(\d+)x(\d+)$/);
    if (!m) return null;
    var w = parseInt(m[1], 10);
    var h = parseInt(m[2], 10);
    if (!w || !h) return null;
    return { w: w, h: h, pixels: w * h };
  }

  function parseSize(size) {
    if (!size) return null;
    var m = String(size).toLowerCase().match(/(\d+)\s*x\s*(\d+)/);
    if (!m) return null;
    var w = parseInt(m[1], 10);
    var h = parseInt(m[2], 10);
    if (!w || !h) return null;
    return { w: w, h: h, pixels: w * h };
  }

  function normalizeSize(w, h) {
    if (!w || !h) return null;
    var width = Math.max(1, Math.round(w));
    var height = Math.max(1, Math.round(h));
    var pixels = width * height;
    var scale = 1;
    if (pixels < AI_SIZE_MIN_PIXELS) {
      scale = Math.sqrt(AI_SIZE_MIN_PIXELS / pixels);
      width = width * scale;
      height = height * scale;
    }
    pixels = width * height;
    if (width > AI_SIZE_MAX_W || height > AI_SIZE_MAX_H || pixels > AI_SIZE_MAX_PIXELS) {
      var scaleDown = Math.min(
        AI_SIZE_MAX_W / width,
        AI_SIZE_MAX_H / height,
        Math.sqrt(AI_SIZE_MAX_PIXELS / pixels)
      );
      width = width * scaleDown;
      height = height * scaleDown;
    }
    var downW = Math.floor(width / AI_SIZE_MULTIPLE) * AI_SIZE_MULTIPLE;
    var downH = Math.floor(height / AI_SIZE_MULTIPLE) * AI_SIZE_MULTIPLE;
    if (downW < AI_SIZE_MULTIPLE) downW = AI_SIZE_MULTIPLE;
    if (downH < AI_SIZE_MULTIPLE) downH = AI_SIZE_MULTIPLE;
    if (downW * downH < AI_SIZE_MIN_PIXELS) {
      var upW = Math.ceil(width / AI_SIZE_MULTIPLE) * AI_SIZE_MULTIPLE;
      var upH = Math.ceil(height / AI_SIZE_MULTIPLE) * AI_SIZE_MULTIPLE;
      if (upW <= AI_SIZE_MAX_W && upH <= AI_SIZE_MAX_H && upW * upH <= AI_SIZE_MAX_PIXELS) {
        downW = upW;
        downH = upH;
      }
    }
    return { width: downW, height: downH, pixels: downW * downH };
  }

  function checkReturnedImageSize(items, requestedSize) {
    var info = parseSize(requestedSize);
    if (!info || !items || !items.length) return;
    var url = items[0] && items[0].url;
    if (!url) return;
    try {
      var img = new Image();
      img.onload = function () {
        if (!img.width || !img.height) return;
        if (img.width === info.w && img.height === info.h) return;
        setAiStatus('注意：模型返回尺寸 ' + img.width + 'x' + img.height + '，与请求 ' + requestedSize + ' 不一致，可能不支持该尺寸。', 'warn');
      };
      img.src = url;
    } catch (e) {}
  }

  function fetchExtraImages(baseUrl, settings, payload, remaining, cb, onItem) {
    var results = [];
    var left = remaining || 0;
    if (left <= 0) {
      if (cb) cb(results);
      return;
    }
    function next() {
      if (left <= 0) {
        if (cb) cb(results);
        return;
      }
      var single = {};
      Object.keys(payload || {}).forEach(function (k) { single[k] = payload[k]; });
      single.n = 1;
      single.num_images = 1;
      single.batch_size = 1;
      single.image_count = 1;
        fetchJsonWithStatus(baseUrl + 'images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + settings.apiKey
          },
          body: JSON.stringify(single)
        }, function (res) {
          if (res.ok) {
            var json = res.data || {};
            var items = extractImageResults(json);
            if (items && items.length) {
              results.push(items[0]);
              if (onItem) {
                try { onItem(items[0]); } catch (e) {}
              }
            }
          }
          left -= 1;
          setTimeout(next, 120);
        });
      }
      next();
    }

  function enforceMinPixelsForModel(modelId, size) {
    var info = parseSize(size);
    if (!info) return size;
    var norm = normalizeSize(info.w, info.h);
    if (!norm) return size;
    var normalized = norm.width + 'x' + norm.height;
    if (normalized !== (info.w + 'x' + info.h)) {
      if (aiImageSizeInput) aiImageSizeInput.value = getSizeLabel(normalized);
      if (aiState) {
        aiState.imageSize = normalized;
        aiState.imageSizeMode = AI_IMAGE_SIZE_TO_LABEL[normalized] ? 'preset' : 'custom';
        saveAiSettings(aiState);
      }
      setAiStatus('尺寸已调整为 ' + normalized + '（符合模型要求）。', 'warn');
    }
    return normalized;
  }

  function requestImage(settings) {
    var baseUrl = normalizeBaseUrl(settings.baseUrl);
    var modelId = getSelectedModelId(settings);
    var prompt = (aiPromptInput && aiPromptInput.value || '').trim();
    if (!settings.apiKey) {
      setAiStatus('请先填写 API 密钥。', 'err');
      return;
    }
    if (!modelId) {
      setAiStatus('请先选择模型或填写模型 ID。', 'err');
      return;
    }
    if (!prompt) {
      setAiStatus('请输入提示词。', 'err');
      return;
    }
    commitImageSizeInput(true);
    var size = resolveImageSize(settings);
    var sizeNote = '';
    var originalSize = size || '';
    size = enforceMinPixelsForModel(modelId, size);
    if (originalSize && size && originalSize !== size) {
      sizeNote = '尺寸已调整为 ' + size;
    }
    var count = settings.imageCount || 1;
    if (count < 1) count = 1;
    if (count > 8) count = 8;
    var doRequest = function (imageDataUrl) {
      var payload = { model: modelId, prompt: prompt };
      if (size) payload.size = size;
      if (count) {
        payload.n = count;
        payload.num_images = count;
        payload.batch_size = count;
        payload.image_count = count;
      }
      if (imageDataUrl) payload.image = imageDataUrl;
      setAiStatus('正在生成图像...', '');
      clearAiResult();
      initAiPlaceholders(count, prompt);
      try { console.log('[AI] payload', { model: payload.model, size: payload.size, n: count }); } catch (e) {}
    fetchJsonWithStatus(baseUrl + 'images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + settings.apiKey
      },
      body: JSON.stringify(payload)
    }, function (res) {
      if (!res.ok) {
        setAiStatus('生成失败：' + formatApiError(res), 'err');
        return;
      }
      var json = res.data || {};
      var items = extractImageResults(json);
      try { console.log('[AI] response images', items.length); } catch (e2) {}
      if (!items.length) {
        setAiStatus('生成失败：未返回结果。', 'err');
        return;
      }
      if (count > 1 && items.length < count) {
        var missing = count - items.length;
        setAiStatus('接口返回 ' + items.length + ' 张，正在补齐…', 'warn');
        aiResultItems = items.slice();
        applyAiResults(aiResultItems, prompt);
        queueAiCache(aiGeneratedImages, aiState);
        fetchExtraImages(baseUrl, settings, payload, missing, function () {
          var merged = aiResultItems.slice();
          applyAiResults(merged, prompt);
          queueAiCache(aiGeneratedImages, aiState);
          if (sizeNote) {
            setAiStatus('生成完成（' + sizeNote + '）。', 'ok');
          } else {
            setAiStatus('生成完成。', 'ok');
          }
          checkReturnedImageSize(merged, originalSize || size);
        }, function (item) {
          aiResultItems.push(item);
          applyAiResults(aiResultItems, prompt);
          queueAiCache(aiGeneratedImages, aiState);
        });
        return;
      }
      aiResultItems = items.slice();
      applyAiResults(aiResultItems, prompt);
      queueAiCache(aiGeneratedImages, aiState);
      if (sizeNote) {
        setAiStatus('生成完成（' + sizeNote + '）。', 'ok');
      } else {
        setAiStatus('生成完成。', 'ok');
      }
      checkReturnedImageSize(items, originalSize || size);
    });
    };

    if (settings.imageUseLayer) {
      var sizeInfo = parseStrictSize(size) || parseSize(size);
      var targetW = sizeInfo ? sizeInfo.w : 0;
      var targetH = sizeInfo ? sizeInfo.h : 0;
      setAiStatus('正在读取选中图层...', '');
      getActiveLayerDataUrl(function (dataUrl, errMsg) {
        if (!dataUrl) {
          setAiStatus('获取选中图层失败：' + (errMsg || '请确认已选中图层。'), 'err');
          return;
        }
        doRequest(dataUrl);
      }, targetW, targetH);
    } else {
      doRequest(null);
    }
  }

  function requestVideo(settings) {
    var baseUrl = normalizeBaseUrl(settings.baseUrl);
    var modelId = getSelectedModelId(settings);
    var prompt = (aiPromptInput && aiPromptInput.value || '').trim();
    var imageUrl = (aiVideoImageInput && aiVideoImageInput.value || '').trim();
    if (!settings.apiKey) {
      setAiStatus('请先填写 API 密钥。', 'err');
      return;
    }
    if (!modelId) {
      setAiStatus('请先选择模型或填写模型 ID。', 'err');
      return;
    }
    if (!prompt) {
      setAiStatus('请输入提示词。', 'err');
      return;
    }
    var content = [{ type: 'text', text: prompt }];
    if (imageUrl) {
      content.push({ type: 'image_url', image_url: { url: imageUrl } });
    }
    setAiStatus('正在创建视频任务...', '');
    clearAiResult();
    fetchJsonWithStatus(baseUrl + 'contents/generations/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + settings.apiKey
      },
      body: JSON.stringify({ model: modelId, content: content })
    }, function (res) {
      if (!res.ok) {
        setAiStatus('生成失败：' + formatApiError(res), 'err');
        return;
      }
      var json = res.data || {};
      var id = json.id || (json.data && json.data.id) || json.task_id || json.taskId;
      if (!id) {
        setAiStatus('任务创建失败：未返回任务ID。', 'err');
        return;
      }
      pollVideoTask(baseUrl, settings.apiKey, id, 0);
    });
  }

  function buildTextTaskPrompt(task, input) {
    if (task === 'keywords') {
      return '请基于以下描述输出适合图标搜索的中文关键词，使用逗号分隔，最多10个：\n' + input;
    }
    if (task === 'title') {
      return '请为以下素材生成简洁标题（10-20字，中文）：\n' + input;
    }
    if (task === 'translate') {
      return '请将以下文本翻译为更地道的英文，仅输出翻译结果：\n' + input;
    }
    if (task === 'ps_text') {
      return '请根据以下描述生成适合设计稿的简短文案（不超过20字，中文）：\n' + input;
    }
    return '请将以下文本改写为更通顺的版本，保持原意，仅输出改写后的文本：\n' + input;
  }

  function extractTextResult(resp) {
    if (!resp) return '';
    var choices = resp.choices || (resp.data && resp.data.choices) || [];
    if (choices && choices.length) {
      var msg = choices[0].message || {};
      var content = msg.content || choices[0].text || '';
      return (content || '').trim();
    }
    var output = resp.output || (resp.data && resp.data.output) || null;
    if (output && output.length) {
      for (var i = 0; i < output.length; i++) {
        var item = output[i] || {};
        if (typeof item === 'string') return item.trim();
        var contentList = item.content || [];
        for (var j = 0; j < contentList.length; j++) {
          var part = contentList[j] || {};
          var text = part.text || part.content || part.output_text || '';
          if (text) return String(text).trim();
        }
      }
    }
    if (resp.output_text) return String(resp.output_text).trim();
    return '';
  }

  function requestText(settings) {
    var baseUrl = normalizeBaseUrl(settings.baseUrl);
    var modelId = getSelectedModelId(settings);
    var task = aiTextTaskSelect ? aiTextTaskSelect.value : (settings.textTask || 'rewrite');
    var input = (aiTextInput && aiTextInput.value || '').trim();
    if (!settings.apiKey) {
      setAiStatus('请先填写 API 密钥。', 'err');
      return;
    }
    if (!modelId) {
      setAiStatus('请先选择文本模型或填写模型 ID。', 'err');
      return;
    }
    if (!input) {
      setAiStatus('请输入文本内容。', 'err');
      return;
    }
    var prompt = buildTextTaskPrompt(task, input);
    setAiStatus('正在生成文本...', '');
    if (aiTextOutput) aiTextOutput.value = '';
    clearAiResult();
    var useResponses = modelId.indexOf('translation') !== -1;
    var endpoint = useResponses ? 'responses' : 'chat/completions';
    var payload = null;
    if (useResponses) {
      payload = {
        model: modelId,
        input: prompt
      };
    } else {
      payload = {
        model: modelId,
        messages: [
          { role: 'system', content: '你是设计助手，输出简洁清晰的中文结果。' },
          { role: 'user', content: prompt }
        ]
      };
    }
    if (useResponses) {
      setAiStatus('翻译模型改用 Responses 接口...', '');
    }
    fetchJsonWithStatus(baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + settings.apiKey
      },
      body: JSON.stringify(payload)
    }, function (res) {
      if (!res.ok) {
        setAiStatus('生成失败：' + formatApiError(res), 'err');
        return;
      }
      var json = res.data || {};
      var text = extractTextResult(json);
      if (!text) {
        setAiStatus('生成失败：未返回文本结果。', 'err');
        return;
      }
      if (aiTextOutput) aiTextOutput.value = text;
      setAiStatus('生成完成。', 'ok');
      if (task === 'ps_text') {
        insertTextLayerToPs(text);
      }
    });
  }

  function pollVideoTask(baseUrl, apiKey, id, count) {
    var maxTry = 40;
    setAiStatus('视频生成中...(' + (count + 1) + ')', '');
    fetchJsonWithStatus(baseUrl + 'contents/generations/tasks/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      }
    }, function (res) {
      if (!res.ok) {
        setAiStatus('查询失败：' + formatApiError(res), 'err');
        return;
      }
      var json = res.data || {};
      var status = (json.status || (json.data && json.data.status) || json.state || '').toLowerCase();
      if (status.indexOf('succeed') !== -1 || status.indexOf('complete') !== -1) {
        var items = extractVideoResults(json);
        if (!items.length) {
          setAiStatus('任务完成，但未返回链接。', 'err');
          return;
        }
        renderAiResult(items, 'video');
        setAiStatus('生成完成。', 'ok');
        return;
      }
      if (status.indexOf('fail') !== -1 || status.indexOf('error') !== -1) {
        setAiStatus('生成失败：' + formatApiError({ data: json, status: res.status }), 'err');
        return;
      }
      if (count >= maxTry) {
        setAiStatus('等待超时，可稍后再试。', 'err');
        return;
      }
      setTimeout(function () {
        pollVideoTask(baseUrl, apiKey, id, count + 1);
      }, 3000);
    });
  }

  function normalizeItem(item) {
    if (!item) return null;
    if (typeof item === 'string') {
      return { url: item, note: '' };
    }
    if (typeof item === 'object') {
      var url = item.url || item.href || item.link || '';
      if (!url) return null;
      return { url: url, note: item.note || item.title || '' };
    }
    return null;
  }

  function dedupeItems(items) {
    var seen = {};
    var out = [];
    items.forEach(function (it) {
      var url = it.url;
      if (!url || seen[url]) return;
      seen[url] = true;
      out.push(it);
    });
    return out;
  }

  function getSavedItems() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      var items = list.map(normalizeItem).filter(Boolean);
      return dedupeItems(items);
    } catch (e) {
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function renderBookmarkList(items) {
    if (!bookmarkListEl) return;
    bookmarkListEl.innerHTML = '';
    if (!items || !items.length) {
      var empty = document.createElement('div');
      empty.className = 'bookmark-empty';
      empty.textContent = '暂无书签';
      bookmarkListEl.appendChild(empty);
      return;
    }
    items.forEach(function (it) {
      var item = document.createElement('div');
      item.className = 'bookmark-item';
      item.setAttribute('data-url', it.url);

      var link = document.createElement('button');
      link.className = 'bookmark-link';
      link.textContent = it.note ? it.note : it.url;
      link.title = it.url;

      var edit = document.createElement('button');
      edit.className = 'bookmark-edit';
      edit.textContent = '✎';
      edit.title = '编辑名称';

      var del = document.createElement('button');
      del.className = 'bookmark-del';
      del.textContent = '×';
      del.title = '删除书签';

      item.appendChild(link);
      item.appendChild(edit);
      item.appendChild(del);
      bookmarkListEl.appendChild(item);
    });
  }

  function initUrls() {
    var items = getSavedItems();
    var hasDefault = items.some(function (it) { return it.url === DEFAULT_URL; });
    if (!hasDefault) {
      items.unshift({ url: DEFAULT_URL, note: 'iconfont' });
    }
    if (items.length === 0) {
      items = [{ url: DEFAULT_URL, note: 'iconfont' }];
    }
    saveItems(items);
    renderBookmarkList(items);
    var last = null;
    try { last = localStorage.getItem(LAST_URL_KEY); } catch (e) {}
    var useUrl = last || (items[0] && items[0].url) || DEFAULT_URL;
    if (urlInput) urlInput.value = useUrl;
  }
  function normalizeUrl(value) {
    var v = (value || '').trim();
    if (!v) return 'about:blank';
    if (v.indexOf('//') === 0) {
      return 'https:' + v;
    }
    if (!/^https?:\/\//i.test(v) && !/^file:\/\//i.test(v) && !/^about:/i.test(v)) {
      v = 'https://' + v;
    }
    return v;
  }

  function getDefaultNote() {
    return (lastPageTitle || '').trim();
  }

  function addBookmark(url, note) {
    var value = normalizeUrl(url || '');
    if (!value || value === 'about:blank') return;
    var items = getSavedItems();
    var idx = items.findIndex(function (it) { return it.url === value; });
    var entry;
    if (idx >= 0) {
      entry = items[idx];
      if (note && !entry.note) entry.note = note;
      items.splice(idx, 1);
    } else {
      entry = { url: value, note: note || '' };
    }
    items.unshift(entry);
    saveItems(items);
    renderBookmarkList(items);
  }

  function editBookmark(url) {
    var value = normalizeUrl(url || '');
    if (!value || value === 'about:blank') return;
    var items = getSavedItems();
    var idx = items.findIndex(function (it) { return it.url === value; });
    var current = idx >= 0 ? items[idx] : { url: value, note: '' };
    var note = window.prompt('输入备注（可留空）', current.note || '');
    if (note === null) return;
    current.note = (note || '').trim();
    if (idx >= 0) items[idx] = current;
    else items.unshift(current);
    saveItems(items);
    renderBookmarkList(items);
  }

  function deleteBookmark(url) {
    var value = normalizeUrl(url || '');
    if (!value || value === 'about:blank') return;
    var items = getSavedItems();
    var next = items.filter(function (it) { return it.url !== value; });
    saveItems(next);
    renderBookmarkList(next);
  }

  function openBookmark(url) {
    var value = normalizeUrl(url || '');
    if (!value || value === 'about:blank') return;
    if (urlInput) urlInput.value = value;
    openUrl();
  }

  function findBookmarkItem(node) {
    var cur = node;
    while (cur && cur !== bookmarkListEl) {
      if (cur.classList && cur.classList.contains('bookmark-item')) return cur;
      cur = cur.parentNode;
    }
    return null;
  }

  function positionBookmarkPanel() {
    if (!bookmarkPanel || !bookmarkBtn) return;
    var rect = bookmarkBtn.getBoundingClientRect();
    var top = Math.max(10, rect.bottom + 6);
    var panelWidth = bookmarkPanel.offsetWidth;
    if (!panelWidth) {
      try {
        panelWidth = parseFloat(window.getComputedStyle(bookmarkPanel).width) || 320;
      } catch (e) {
        panelWidth = 320;
      }
    }
    var useCenter = document.body.classList.contains('narrow-ui') || (window.innerWidth - panelWidth) < 60;
    if (useCenter) {
      var leftCenter = Math.max(10, Math.round((window.innerWidth - panelWidth) / 2));
      bookmarkPanel.style.left = leftCenter + 'px';
      bookmarkPanel.style.right = 'auto';
    } else {
      var right = Math.max(10, window.innerWidth - rect.right);
      bookmarkPanel.style.right = right + 'px';
      bookmarkPanel.style.left = 'auto';
    }
    bookmarkPanel.style.top = top + 'px';
  }

  function showBookmarkPanel(show) {
    if (!bookmarkPanel) return;
    if (show) {
      positionBookmarkPanel();
      bookmarkPanel.classList.add('open');
    } else {
      bookmarkPanel.classList.remove('open');
    }
  }

  function maybeCloseBookmarkPanel(target) {
    if (!bookmarkPanel || !bookmarkPanel.classList.contains('open')) return;
    if (target && bookmarkPanel.contains(target)) return;
    if (bookmarkBtn && target && bookmarkBtn.contains(target)) return;
    showBookmarkPanel(false);
  }

  function positionAppMenu() {
    if (!appMenu || !appMenuBtn) return;
    var rect = appMenuBtn.getBoundingClientRect();
    appMenu.style.top = Math.max(8, rect.bottom + 6) + 'px';
    appMenu.style.left = Math.max(8, rect.left) + 'px';
  }

  function showAppMenu(show) {
    if (!appMenu) return;
    if (show) {
      positionAppMenu();
      appMenu.classList.add('open');
    } else {
      appMenu.classList.remove('open');
    }
  }

  function showBrowserHome(show) {
    if (!browserHome) return;
    browserHome.style.display = show ? 'flex' : 'none';
    if (show) renderRecentList(getRecentList());
  }

  function setMode(mode) {
    if (mode === 'ai') currentMode = 'ai';
    else currentMode = 'browser';
    document.body.classList.remove('mode-browser', 'mode-ai');
    if (currentMode === 'ai') document.body.classList.add('mode-ai');
    else document.body.classList.add('mode-browser');
    if (toolLabel) {
      toolLabel.textContent = currentMode === 'ai' ? '豆包功能' : '浏览器助手';
    }
    if (currentMode === 'browser') {
      injectCaptureScript();
      if (homeUrlInput && urlInput) homeUrlInput.value = urlInput.value;
      var showHome = !lastPageUrl || lastPageUrl === 'about:blank';
      showBrowserHome(showHome);
      showAiPanel(false);
    } else {
      ensureAiInit();
      showBrowserHome(false);
      showAiPanel(true);
      if (aiPanel) {
        aiPanel.style.top = '0px';
        aiPanel.style.right = '0px';
        aiPanel.style.left = '0px';
      }
    }
    if (sideButtons && sideButtons.length) {
      sideButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.mode === currentMode);
      });
    }
  }

  function loadHostScript() {
    var jsxPath = extPath.replace(/\\/g, '/') + '/jsx/host.jsx';
    var script = '$.evalFile("' + jsxPath + '")';
    cs.evalScript(script);
  }

  function navigateTo(target, opts) {
    if (!browser) return;
    var url = normalizeUrl(target || '');
    if (!url) return;
    if (!(opts && opts.record === false)) {
      recordNav(url, { forceNew: true });
    }
    if (urlInput && urlInput.value !== url) urlInput.value = url;
    browser.src = url;
    if (!(opts && opts.silent)) {
      var msg = (opts && opts.status) ? opts.status : ('正在打开：' + url);
      setStatus(msg, '');
    }
    updateSiteTitle('', '', url);
    lastPageUrl = url;
    try { localStorage.setItem(LAST_URL_KEY, url); } catch (e) {}
    if (currentMode === 'browser') {
      showBrowserHome(false);
    }
  }

  function navigateHistory(delta) {
    var nextIndex = navIndex + delta;
    if (nextIndex < 0 || nextIndex >= navHistory.length) return false;
    navIndex = nextIndex;
    navigateTo(navHistory[navIndex], { record: false });
    return true;
  }

  function handleChromeError(currentUrl) {
    var cur = currentUrl || '';
    if (cur && cur === lastErrorUrl) return;
    lastErrorUrl = cur || 'chrome-error';
    var fallback = '';
    if (navIndex > 0) {
      navIndex -= 1;
      fallback = navHistory[navIndex];
    } else if (lastGoodUrl && !shouldIgnoreHistoryUrl(lastGoodUrl)) {
      fallback = lastGoodUrl;
    } else if (DEFAULT_URL) {
      fallback = DEFAULT_URL;
    }
    if (fallback) {
      navigateTo(fallback, { record: false, status: '返回上一页…' });
    }
  }

  function injectCaptureScript() {
    try {
      var doc = browser.contentDocument;
      if (!doc || !doc.documentElement) {
        setStatus('注入失败：没有页面。', 'err');
        return;
      }
      if (doc.getElementById('__psex_capture_script')) {
        setStatus('脚本已注入。', 'ok');
        sendPageInfoConfig();
        sendCaptureConfig();
        return;
      }
      var script = doc.createElement('script');
      script.id = '__psex_capture_script';
      script.type = 'text/javascript';
      script.text = '(' + captureScript.toString() + ')();';
      doc.documentElement.appendChild(script);
      setStatus('脚本注入成功。 本插件仅支持便捷插入素材，不支持去除水印，尊重版权。', 'ok');
      sendPageInfoConfig();
      sendCaptureConfig();
    } catch (err) {
      setStatus('注入失败：' + err, 'err');
    }
  }

  function openUrl() {
    if (!urlInput) return;
    var target = normalizeUrl(urlInput.value);
    isEditingUrl = false;
    urlUserChanged = false;
    pendingUrl = '';
    navigateTo(target, { status: '正在加载：' + target });
  }

  function openHome() {
    var target = DEFAULT_URL;
    if (homeUrlInput && homeUrlInput.value) target = homeUrlInput.value;
    if (urlInput) urlInput.value = target;
    openUrl();
  }

  function clearSiteData() {
    if (!browser || !browser.contentWindow) {
      setStatus('退出失败：没有页面。', 'err');
      return;
    }
    try {
      if (!browser.contentDocument || !browser.contentDocument.getElementById('__psex_capture_script')) {
        injectCaptureScript();
      }
    } catch (e) {}
    try {
      browser.contentWindow.postMessage({ type: 'PSEX_CLEAR_SITE' }, '*');
      setStatus('正在清理当前站点登录状态…', '');
    } catch (err) {
      setStatus('退出失败：' + err, 'err');
    }
  }

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      if (bookmarkPanel && bookmarkPanel.classList.contains('open')) {
        showBookmarkPanel(false);
      } else {
        showBookmarkPanel(true);
      }
    });
  }

  if (bookmarkCloseBtn) {
    bookmarkCloseBtn.addEventListener('click', function () {
      showBookmarkPanel(false);
    });
  }

  if (bookmarkListEl) {
    bookmarkListEl.addEventListener('click', function (e) {
      var target = e.target;
      var item = target && target.closest ? target.closest('.bookmark-item') : findBookmarkItem(target);
      if (!item) return;
      var url = item.getAttribute('data-url') || '';
      if (target.classList.contains('bookmark-edit')) {
        editBookmark(url);
        return;
      }
      if (target.classList.contains('bookmark-del')) {
        deleteBookmark(url);
        return;
      }
      if (target.classList.contains('bookmark-link') || target.classList.contains('bookmark-item')) {
        openBookmark(url);
      }
    });
  }

  document.addEventListener('mousedown', function (e) {
    maybeCloseBookmarkPanel(e.target);
  });

  if (browser) {
    browser.addEventListener('mousedown', function (e) {
      maybeCloseBookmarkPanel(e.target);
      hideCaptureMenu();
    });
    browser.addEventListener('focus', function () {
      maybeCloseBookmarkPanel(browser);
      hideCaptureMenu();
    });
  }

  document.addEventListener('mousedown', function (e) {
    if (!captureMenu || !captureMenu.classList.contains('open')) return;
    if (captureMenu.contains(e.target)) return;
    hideCaptureMenu();
  });

  if (captureMenu) {
    captureMenu.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.menu-item') : null;
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (!action) return;
      if (action === 'insert') {
        if (lastContextPoint && browser && browser.contentWindow) {
          browser.contentWindow.postMessage({
            type: 'PSEX_CAPTURE_AT_POINT',
            x: lastContextPoint.x - browser.getBoundingClientRect().left,
            y: lastContextPoint.y - browser.getBoundingClientRect().top
          }, '*');
        }
      } else if (action === 'open') {
        if (lastContextUrl) {
          if (urlInput) urlInput.value = lastContextUrl;
          openUrl();
        }
      } else if (action === 'original') {
        if (!viewState) viewState = { enabled: false };
        viewState.enabled = !viewState.enabled;
        saveViewSettings(viewState);
        if (viewToggle) viewToggle.checked = viewState.enabled;
        updateCaptureMenuChecks();
        sendViewModeFromState();
      } else if (action === 'capture') {
        setCaptureMode(!captureModeEnabled, true);
        sendViewModeFromState();
      } else if (action === 'reload') {
        try { browser.contentWindow.location.reload(); } catch (e2) {}
      } else if (action === 'fullscreen') {
        toggleBrowserFullscreen();
      } else if (action === 'about') {
        var aboutUrl = 'https://github.com/JerryC0820/NiuAssist';
        if (urlInput) urlInput.value = aboutUrl;
        openUrl();
      }
      hideCaptureMenu();
    });
  }

  window.addEventListener('resize', function () {
    updateLayoutMode();
    if (bookmarkPanel && bookmarkPanel.classList.contains('open')) {
      positionBookmarkPanel();
    }
    if (aiPanel && aiPanel.classList.contains('open')) {
      positionAiPanel();
    }
    if (appMenu && appMenu.classList.contains('open')) {
      positionAppMenu();
    }
    if (aiTypeDropdown && aiTypeDropdown.classList.contains('open')) {
      positionFeaturePanel();
    }
  });

  if (aiBtn) {
    aiBtn.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      setMode('ai');
    });
  }

  if (aiCloseBtn) {
    aiCloseBtn.addEventListener('click', function () {
      if (currentMode === 'ai') {
        setMode('browser');
        return;
      }
      showAiPanel(false);
    });
  }

  if (aiSaveBtn) {
    aiSaveBtn.addEventListener('click', function () {
      syncAiStateFromControls();
      setAiStatus('设置已保存。', 'ok');
      updateAiAuthSummary();
    });
  }

  if (aiAuthToggle) {
    aiAuthToggle.addEventListener('click', function () {
      var collapsed = aiAuthSection && aiAuthSection.classList.contains('collapsed');
      setAiAuthCollapsed(!collapsed);
    });
  }

  if (aiKeyInput) {
    aiKeyInput.addEventListener('input', updateAiAuthSummary);
  }

  if (aiBaseUrlInput) {
    aiBaseUrlInput.addEventListener('input', updateAiAuthSummary);
  }

  if (aiTypeToggle) {
    aiTypeToggle.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!aiTypeDropdown) return;
      if (aiTypeDropdown.classList.contains('open')) {
        closeFeaturePicker();
      } else {
        openFeaturePicker();
      }
    });
  }

  if (aiTypeSearch) {
    aiTypeSearch.addEventListener('input', function () {
      renderFeatureList(aiTypeSearch.value || '');
    });
  }

  if (aiTypeSelect) {
    aiTypeSelect.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      var prevType = aiState.type || 'image';
      cacheFeatureParams(prevType);
      aiState.type = aiTypeSelect.value;
      setAiType(aiState.type);
      updateTierOptions();
      updateModelOptions();
      if (aiState.type === 'image') refreshImageSizeOptions(getSelectedModelId(aiState));
      restoreFeatureParams(aiState.type);
      saveAiSettings(aiState);
      updateFeatureToggle();
    });
  }

  if (aiTierSelect) {
    aiTierSelect.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.tier = aiTierSelect.value;
      updateModelOptions();
      if (aiState.type === 'image') refreshImageSizeOptions(getSelectedModelId(aiState));
      saveAiSettings(aiState);
    });
  }

  if (aiModelManageBtn) {
    aiModelManageBtn.addEventListener('click', function () {
      if (!aiModelPanel) return;
      var open = aiModelPanel.classList.contains('open');
      if (open) {
        aiModelPanel.classList.remove('open');
      } else {
        if (aiModelListInput) aiModelListInput.value = formatModelListText(aiModels);
        aiModelPanel.classList.add('open');
      }
    });
  }

  if (aiModelSaveBtn) {
    aiModelSaveBtn.addEventListener('click', function () {
      var next = parseModelListText(aiModelListInput ? aiModelListInput.value : '');
      if (!next.length) {
        setAiStatus('模型列表为空，请检查格式。', 'err');
        return;
      }
      aiModels = next;
      saveModelList(next);
      updateTierOptions();
      updateModelOptions();
      if (aiState && aiState.type === 'image') refreshImageSizeOptions(getSelectedModelId(aiState));
      setAiStatus('模型列表已保存。', 'ok');
    });
  }

  if (aiModelResetBtn) {
    aiModelResetBtn.addEventListener('click', function () {
      aiModels = AI_MODEL_DEFAULTS.slice();
      saveModelList(aiModels);
      updateTierOptions();
      updateModelOptions();
      if (aiState && aiState.type === 'image') refreshImageSizeOptions(getSelectedModelId(aiState));
      if (aiModelListInput) aiModelListInput.value = formatModelListText(aiModels);
      setAiStatus('已恢复默认模型列表。', 'ok');
    });
  }

  if (aiModelSelect) {
    aiModelSelect.addEventListener('change', function () {
      if (aiModelSelect.value === '__custom__') {
        if (aiModelCustomRow) aiModelCustomRow.classList.remove('hidden');
        setSelectedModelForCurrent((aiModelCustomInput && aiModelCustomInput.value || '').trim(), true);
      } else {
        if (aiModelCustomRow) aiModelCustomRow.classList.add('hidden');
        setSelectedModelForCurrent(aiModelSelect.value, false);
      }
      if (aiState) refreshImageSizeOptions(getSelectedModelId(aiState));
    });
  }

  if (aiModelCustomInput) {
    aiModelCustomInput.addEventListener('input', function () {
      if (aiModelSelect) aiModelSelect.value = '__custom__';
      if (aiModelCustomRow) aiModelCustomRow.classList.remove('hidden');
      setSelectedModelForCurrent(aiModelCustomInput.value.trim(), true);
      if (aiState) refreshImageSizeOptions(getSelectedModelId(aiState));
    });
  }

  if (aiImageSizeInput) {
    aiImageSizeInput.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      if (isUpdatingSizeOptions) return;
      commitImageSizeInput();
    });
    aiImageSizeInput.addEventListener('blur', function () {
      if (!aiState) aiState = getAiSettings();
      if (isUpdatingSizeOptions) return;
      commitImageSizeInput();
    });
    aiImageSizeInput.addEventListener('click', function () {
      openSizePanel();
    });
    aiImageSizeInput.addEventListener('focus', function () {
      openSizePanel();
    });
    aiImageSizeInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'Enter') {
        openSizePanel();
      }
    });
  }
  if (aiImageSizeToggle) {
    aiImageSizeToggle.addEventListener('click', function (ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      toggleSizePanel();
    });
  }
  document.addEventListener('click', function (ev) {
    if (!aiImageSizePanel || aiImageSizePanel.classList.contains('hidden')) return;
    if (aiImageSizePanel.contains(ev.target)) return;
    if (aiImageSizeInput && aiImageSizeInput.contains(ev.target)) return;
    if (aiImageSizeToggle && aiImageSizeToggle.contains(ev.target)) return;
    closeSizePanel();
  });
  document.addEventListener('keydown', function (ev) {
    if (!aiImageSizePanel || aiImageSizePanel.classList.contains('hidden')) return;
    if (ev.key === 'Escape') {
      closeSizePanel();
    }
  });

  if (aiImageCountInput) {
    aiImageCountInput.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.imageCount = parseInt(aiImageCountInput.value || '1', 10) || 1;
      saveAiSettings(aiState);
    });
  }

  if (aiUseLayerInput) {
    aiUseLayerInput.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.imageUseLayer = !!aiUseLayerInput.checked;
      saveAiSettings(aiState);
    });
  }

  if (aiPythonSpeedInput) {
    aiPythonSpeedInput.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.aiPythonSpeed = !!aiPythonSpeedInput.checked;
      saveAiSettings(aiState);
    });
  }

  if (aiPythonMaxSideInput) {
    aiPythonMaxSideInput.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.aiPythonMaxSide = parseInt(aiPythonMaxSideInput.value || '2000', 10) || 2000;
      saveAiSettings(aiState);
    });
  }

  if (aiPythonQualityInput) {
    aiPythonQualityInput.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.aiPythonQuality = parseInt(aiPythonQualityInput.value || '80', 10) || 80;
      saveAiSettings(aiState);
    });
  }

  if (aiImageInsertModeSelect) {
    aiImageInsertModeSelect.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.imageInsertMode = aiImageInsertModeSelect.value || 'insert';
      saveAiSettings(aiState);
    });
  }

  if (aiTextTaskSelect) {
    aiTextTaskSelect.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.textTask = aiTextTaskSelect.value || 'rewrite';
      saveAiSettings(aiState);
    });
  }

  if (aiTextGenerateBtn) {
    aiTextGenerateBtn.addEventListener('click', function () {
      var settings = syncAiStateFromControls();
      requestText(settings);
    });
  }

  if (aiTextInsertBtn) {
    aiTextInsertBtn.addEventListener('click', function () {
      var text = (aiTextOutput && aiTextOutput.value || '').trim();
      if (text) insertTextLayerToPs(text);
    });
  }

  if (aiGenerateBtn) {
    aiGenerateBtn.addEventListener('click', function () {
      var settings = syncAiStateFromControls();
      if (settings.type === 'video') requestVideo(settings);
      else if (settings.type === 'text') requestText(settings);
      else if (settings.type === 'image') requestImage(settings);
      else setAiStatus('该类型暂未接入接口，仅展示模型列表。', 'err');
    });
  }

  if (aiPreviewCloseBtn) {
    aiPreviewCloseBtn.addEventListener('click', function () {
      closeAiPreview();
    });
  }
  if (aiPreviewFitBtn) {
    aiPreviewFitBtn.addEventListener('click', function () {
      setAiPreviewMode('fit');
    });
  }
  if (aiPreview50Btn) {
    aiPreview50Btn.addEventListener('click', function () {
      setAiPreviewScale(0.5);
    });
  }
  if (aiPreview100Btn) {
    aiPreview100Btn.addEventListener('click', function () {
      setAiPreviewScale(1);
    });
  }
  if (aiPreview200Btn) {
    aiPreview200Btn.addEventListener('click', function () {
      setAiPreviewScale(2);
    });
  }
  if (aiPreview400Btn) {
    aiPreview400Btn.addEventListener('click', function () {
      setAiPreviewScale(4);
    });
  }
  if (aiPreviewZoomOutBtn) {
    aiPreviewZoomOutBtn.addEventListener('click', function () {
      zoomPreviewStep(-1);
    });
  }
  if (aiPreviewZoomInBtn) {
    aiPreviewZoomInBtn.addEventListener('click', function () {
      zoomPreviewStep(1);
    });
  }
  if (aiPreviewMaxBtn) {
    aiPreviewMaxBtn.addEventListener('click', function () {
      togglePreviewMax();
    });
  }
  if (aiPreviewCopyPromptBtn) {
    aiPreviewCopyPromptBtn.addEventListener('click', function () {
      if (aiPreviewItem && aiPreviewItem.prompt) copyToClipboard(aiPreviewItem.prompt);
    });
  }
  if (aiPreviewEl) {
    aiPreviewEl.addEventListener('click', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('ai-preview-backdrop')) {
        closeAiPreview();
      }
    });
  }
  if (aiPreviewBody) {
    aiPreviewBody.addEventListener('wheel', function (e) {
      if (!e) return;
      if (e.preventDefault) e.preventDefault();
      var rect = aiPreviewBody.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var py = e.clientY - rect.top;
      var factor = e.deltaY < 0 ? 1.1 : 0.9;
      setAiPreviewScale(aiPreviewScale * factor, px, py);
    });
    aiPreviewBody.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      aiPreviewDrag.active = true;
      aiPreviewDrag.startX = e.clientX;
      aiPreviewDrag.startY = e.clientY;
      aiPreviewDrag.scrollLeft = aiPreviewTranslateX;
      aiPreviewDrag.scrollTop = aiPreviewTranslateY;
      aiPreviewBody.classList.add('dragging');
      if (e.preventDefault) e.preventDefault();
    });
    aiPreviewBody.addEventListener('dblclick', function (e) {
      if (!e) return;
      var rect = aiPreviewBody.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var py = e.clientY - rect.top;
      if (aiPreviewMode === 'fit') {
        setAiPreviewScale(1, px, py);
      } else {
        setAiPreviewMode('fit');
      }
    });
  }
  document.addEventListener('mousemove', function (e) {
    if (!aiPreviewDrag.active || !aiPreviewBody) return;
    var dx = e.clientX - aiPreviewDrag.startX;
    var dy = e.clientY - aiPreviewDrag.startY;
    aiPreviewTranslateX = aiPreviewDrag.scrollLeft + dx;
    aiPreviewTranslateY = aiPreviewDrag.scrollTop + dy;
    var clamped = clampPreviewTransform(aiPreviewScale, aiPreviewTranslateX, aiPreviewTranslateY);
    aiPreviewTranslateX = clamped.x;
    aiPreviewTranslateY = clamped.y;
    applyPreviewTransform();
  });
  document.addEventListener('mouseup', function () {
    if (!aiPreviewDrag.active) return;
    aiPreviewDrag.active = false;
    if (aiPreviewBody) aiPreviewBody.classList.remove('dragging');
  });

  if (aiHistoryCloseBtn) {
    aiHistoryCloseBtn.addEventListener('click', function () {
      closeAiHistory();
    });
  }
  if (aiHistoryMaxBtn) {
    aiHistoryMaxBtn.addEventListener('click', function () {
      setAiHistoryMax();
    });
  }
  if (aiHistoryFixedBtn) {
    aiHistoryFixedBtn.addEventListener('click', function () {
      openAiHistory(getActiveHistoryTab());
    });
  }
  if (aiHistoryEl) {
    aiHistoryEl.addEventListener('click', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('ai-history-backdrop')) {
        closeAiHistory();
      }
    });
  }

  document.addEventListener('mousedown', function (e) {
    if (aiModelPanel && aiModelPanel.classList.contains('open')) {
      if (!aiModelPanel.contains(e.target) && !(aiModelManageBtn && aiModelManageBtn.contains(e.target))) {
        aiModelPanel.classList.remove('open');
      }
    }
    if (aiTypeDropdown && aiTypeDropdown.classList.contains('open')) {
      if (!aiTypeDropdown.contains(e.target)) {
        closeFeaturePicker();
      }
    }
    if (currentMode === 'ai') return;
    if (!aiPanel || !aiPanel.classList.contains('open')) return;
    if (aiPanel.contains(e.target)) return;
    if (aiBtn && aiBtn.contains(e.target)) return;
    showAiPanel(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!e || e.key !== 'Escape') return;
    if (aiPreviewEl && aiPreviewEl.classList.contains('open')) {
      closeAiPreview();
      return;
    }
    if (aiHistoryEl && aiHistoryEl.classList.contains('open')) {
      closeAiHistory();
      return;
    }
    if (aiTypeDropdown && aiTypeDropdown.classList.contains('open')) {
      closeFeaturePicker();
      return;
    }
    if (aiImageSizePanel && !aiImageSizePanel.classList.contains('hidden')) {
      closeSizePanel();
      return;
    }
    if (aiModelPanel && aiModelPanel.classList.contains('open')) {
      aiModelPanel.classList.remove('open');
      return;
    }
  });

  // 顶部下拉菜单已移除

  if (sideButtons && sideButtons.length) {
    sideButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-mode') || 'browser';
        setMode(mode);
      });
    });
  }

  // 顶部下拉菜单已移除

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var value = lastPageUrl || (urlInput ? urlInput.value : '');
      addBookmark(value, getDefaultNote());
      try { localStorage.setItem(LAST_URL_KEY, normalizeUrl(value)); } catch (e) {}
    });
  }
  openBtn.addEventListener('click', openUrl);
  if (homeBtn) homeBtn.addEventListener('click', openHome);
  if (goBtn) goBtn.addEventListener('click', openUrl);
  if (clearSiteBtn) clearSiteBtn.addEventListener('click', clearSiteData);
  urlInput.addEventListener('keydown', function (e) {
    isEditingUrl = true;
    if (e.key === 'Enter') {
      urlUserChanged = true;
      openUrl();
    }
  });
  urlInput.addEventListener('mousedown', function () {
    isEditingUrl = true;
    urlUserChanged = false;
  });
  urlInput.addEventListener('focus', function () {
    isEditingUrl = true;
    urlUserChanged = false;
  });
  urlInput.addEventListener('blur', function () {
    isEditingUrl = false;
    if (!urlUserChanged && pendingUrl) {
      var nextUrl = pendingUrl;
      pendingUrl = '';
      updateUrlInput(nextUrl);
    }
    pendingUrl = '';
    urlUserChanged = false;
  });
  urlInput.addEventListener('input', function () {
    urlUserChanged = true;
    pendingUrl = '';
  });

  if (syncToggle) {
    syncToggle.addEventListener('change', function () {
      syncState = readSyncSettingsFromUI();
      saveSyncSettings(syncState);
      updateSyncUiState(syncState);
      sendPageInfoConfig();
    });
  }

  if (syncTimerToggle) {
    syncTimerToggle.addEventListener('change', function () {
      syncState = readSyncSettingsFromUI();
      saveSyncSettings(syncState);
      updateSyncUiState(syncState);
      sendPageInfoConfig();
    });
  }

  if (syncIntervalInput) {
    syncIntervalInput.addEventListener('change', function () {
      syncState = readSyncSettingsFromUI();
      saveSyncSettings(syncState);
      updateSyncUiState(syncState);
      sendPageInfoConfig();
    });
  }

  if (scaleToggle) {
    scaleToggle.addEventListener('change', function () {
      scaleState = readScaleSettingsFromUI();
      saveScaleSettings(scaleState);
      sendCaptureConfig();
    });
  }

  if (scaleMaxInput) {
    scaleMaxInput.addEventListener('change', function () {
      scaleState = readScaleSettingsFromUI();
      saveScaleSettings(scaleState);
      sendCaptureConfig();
    });
  }

  if (jpegToggle) {
    jpegToggle.addEventListener('change', function () {
      jpegState = readJpegSettingsFromUI();
      saveJpegSettings(jpegState);
      updateJpegUiState(jpegState);
      sendCaptureConfig();
    });
  }

  if (jpegQualityInput) {
    jpegQualityInput.addEventListener('change', function () {
      jpegState = readJpegSettingsFromUI();
      saveJpegSettings(jpegState);
      updateJpegUiState(jpegState);
      sendCaptureConfig();
    });
  }

  if (pyToggle) {
    pyToggle.addEventListener('change', function () {
      pythonState = readPythonSettingsFromUI();
      savePythonSettings(pythonState);
      sendCaptureConfig();
    });
  }

  if (origToggle) {
    origToggle.addEventListener('change', function () {
      originalState = readOriginalSettingsFromUI();
      saveOriginalSettings(originalState);
      if (originalState && originalState.enabled) {
        if (scaleToggle) scaleToggle.checked = false;
        if (jpegToggle) jpegToggle.checked = false;
        scaleState = readScaleSettingsFromUI();
        jpegState = readJpegSettingsFromUI();
        saveScaleSettings(scaleState);
        saveJpegSettings(jpegState);
        updateJpegUiState(jpegState);
      }
      sendCaptureConfig();
      updateCaptureMenuChecks();
    });
  }

  if (viewToggle) {
    viewToggle.addEventListener('change', function () {
      viewState = readViewSettingsFromUI();
      saveViewSettings(viewState);
      sendViewModeFromState();
      updateCaptureMenuChecks();
    });
  }

  if (homeGoBtn) {
    homeGoBtn.addEventListener('click', function () {
      if (homeUrlInput && urlInput) urlInput.value = homeUrlInput.value;
      openUrl();
    });
  }
  if (homeUrlInput) {
    homeUrlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (urlInput) urlInput.value = homeUrlInput.value;
        openUrl();
      }
    });
  }

  if (siteSearchBtn) {
    siteSearchBtn.addEventListener('click', function () {
      openSiteSearch();
    });
  }
  if (siteSearchInput) {
    siteSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        openSiteSearch();
      }
    });
  }

  backBtn.addEventListener('click', function () {
    if (navigateHistory(-1)) return;
    if (lastGoodUrl && !shouldIgnoreHistoryUrl(lastGoodUrl)) {
      navigateTo(lastGoodUrl, { record: false, status: '返回上一页…' });
    }
  });
  forwardBtn.addEventListener('click', function () {
    navigateHistory(1);
  });
  reloadBtn.addEventListener('click', function () {
    try { browser.contentWindow.location.reload(); } catch (e) {}
  });
  injectBtn.addEventListener('click', injectCaptureScript);

  browser.addEventListener('load', function () {
    var currentUrl = getSafeBrowserUrl();
    if (isChromeErrorUrl(currentUrl)) {
      handleChromeError(currentUrl);
      return;
    }
    if (currentUrl) {
      updateUrlInput(currentUrl);
      recordNav(currentUrl, { forceNew: false });
    }
    if (currentMode === 'browser') injectCaptureScript();
    sendCaptureConfig();
    sendPageInfoConfig();
    sendViewModeFromState();
    if (currentMode === 'browser') {
      showBrowserHome(false);
    }
  });

  window.addEventListener('message', function (e) {
    var data = e.data || {};
    if (data.type === 'PSEX_OPEN_URL') {
      if (shouldIgnoreOpenUrl(data.url)) return;
      var nextUrl = normalizeUrl(data.url || '');
      var current = '';
      try { current = browser.contentWindow && browser.contentWindow.location ? browser.contentWindow.location.href : ''; } catch (e0) {}
      if (nextUrl && current && nextUrl === current) return;
      if (nextUrl) {
        navigateTo(nextUrl, { status: '正在打开：' + nextUrl });
      }
      return;
    }
    if (data.type === 'PSEX_PAGE_ZOOM') {
      var zv = parseFloat(data.zoom || 1);
      if (isNaN(zv) || zv <= 0) zv = 1;
      if (zv < 0.25) zv = 0.25;
      if (zv > 3) zv = 3;
      zoomState = { value: zv };
      saveZoomSettings(zoomState);
      return;
    }
    if (data.type === 'PSEX_IFRAME_INTERACT') {
      maybeCloseBookmarkPanel(browser || null);
      hideCaptureMenu();
      return;
    }
    if (data.type === 'PSEX_SITE_CLEARED') {
      setStatus('已清理当前站点登录状态，请刷新页面。', 'ok');
      return;
    }
    if (data.type === 'PSEX_PAGE_INFO') {
      updateSiteTitle(data.title || '', data.host || '', data.url || '');
      recordNav(data.url || '', { forceNew: false });
      return;
    }
    if (data.type === 'PSEX_CONTEXT_MENU') {
      if (!browser) return;
      var rect = browser.getBoundingClientRect();
      var pos = {
        x: rect.left + (data.x || 0),
        y: rect.top + (data.y || 0)
      };
      showCaptureMenu(pos, { url: data.url || '', hasImage: !!data.hasImage });
      return;
    }
    if (data.type === 'PSEX_CAPTURE_URL') {
      if (!(pythonState && pythonState.enabled)) {
        setStatus('Python 转码未开启，请勾选“Python 转码”。', 'err');
        return;
      }
      if (pythonBusy) {
        setStatus('Python 转码中，请稍候…', '');
        return;
      }
      var targetUrl = data.url || '';
      if (!targetUrl) {
        setStatus('采集失败：URL 为空。', 'err');
        return;
      }
      pythonBusy = true;
      setCaptureBusy(true);
      setStatus((originalState && originalState.enabled) ? '原图模式处理中…' : 'Python 转码中…', '');
      runPythonTranscode(targetUrl, data.meta || {}, function (err, outPath) {
        pythonBusy = false;
        setCaptureBusy(false);
        if (err || !outPath) {
          setStatus('Python 转码失败：' + (err || '未知错误'), 'err');
          return;
        }
        placeFileByPath(outPath, {
          scaled: !!(scaleState && scaleState.enabled) && !(originalState && originalState.enabled),
          jpeg: !!(jpegState && jpegState.enabled) && !(originalState && originalState.enabled)
        });
      });
      return;
    }
    if (data.type === 'PSEX_CAPTURE') {
      if (!data.dataUrl) {
        setStatus('采集失败：数据为空。', 'err');
        return;
      }
      var now = Date.now();
      if ((now - lastInsertTs) < 900) {
        return;
      }
      lastInsertTs = now;
      lastInsertUrl = data.dataUrl;
      setCaptureBusy(true);
      var skipScale = data.meta && typeof data.meta.scaled === 'boolean';
      var skipJpeg = !!(data.meta && data.meta.jpeg);
      processDataUrlForInsert(data.dataUrl, { skipScale: skipScale, skipJpeg: skipJpeg }, function (processedUrl, info) {
        var script = 'psexCapture_insertImageFromData(' + JSON.stringify(processedUrl) + ');';
        cs.evalScript(script, function () {
          setCaptureBusy(false);
          var notes = [];
          if ((info && info.scaled) || (data.meta && data.meta.scaled)) notes.push('已自动缩放');
          if ((info && info.jpeg) || (data.meta && data.meta.jpeg)) notes.push('JPG 压缩');
          var msg = notes.length ? '已插入到 Photoshop（' + notes.join('，') + '）。' : '已插入到 Photoshop。';
          setStatus(msg, 'ok');
        });
      });
    } else if (data.type === 'PSEX_CAPTURE_ERROR') {
      setCaptureBusy(false);
      setStatus('采集失败：' + data.message, 'err');
    }
  });

  function captureScript() {
    if (window.__psexCaptureInjected) return;
    window.__psexCaptureInjected = true;

    var lastCaptureTs = 0;
    var CAPTURE_GAP = 600;
    var MAX_RASTER_SIDE = 3000;
    var scaleEnabled = true;
    var jpegEnabled = false;
    var jpegQuality = 85;
    var preferUrlCapture = false;
    var originalMode = false;
    var captureEnabled = true;
    var zoomEnabled = true;
    var pageZoom = 1;
    var pageInfoConfig = { enabled: false, timerEnabled: false, interval: 4000 };
    var pageInfoTimer = null;
    var CAPTURE_POINTER_STYLE_ID = '__psex_capture_pointer_none';
    var altPressed = false;

    function canCaptureNow() {
      var now = Date.now();
      if (now - lastCaptureTs < CAPTURE_GAP) return false;
      lastCaptureTs = now;
      return true;
    }

    function ensureFlatScrollbar() {
      try {
        if (document.getElementById('__psex_scrollbar_style')) return;
        var style = document.createElement('style');
        style.id = '__psex_scrollbar_style';
        style.textContent = [
          '*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.35) transparent;}',
          'html,body{scrollbar-width:thin!important;scrollbar-color:rgba(255,255,255,0.35) transparent!important;}',
          '*::-webkit-scrollbar{width:6px!important;height:6px!important;background:transparent!important;}',
          'html::-webkit-scrollbar,body::-webkit-scrollbar{width:6px!important;height:6px!important;background:transparent!important;}',
          '*::-webkit-scrollbar-track{background:transparent!important;box-shadow:none!important;}',
          'html::-webkit-scrollbar-track,body::-webkit-scrollbar-track{background:transparent!important;box-shadow:none!important;}',
          '*::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.22)!important;border-radius:999px!important;border:2px solid transparent!important;background-clip:content-box!important;}',
          'html::-webkit-scrollbar-thumb,body::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.22)!important;border-radius:999px!important;border:2px solid transparent!important;background-clip:content-box!important;}',
          '*::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.38)!important;background-clip:content-box!important;}',
          'html::-webkit-scrollbar-thumb:hover,body::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.38)!important;background-clip:content-box!important;}',
          '::-webkit-scrollbar-corner{background:transparent!important;}'
        ].join('');
        (document.head || document.documentElement).appendChild(style);
      } catch (e) {}
    }

    function ensureCaptureNoHoverTips() {
      try {
        if (document.getElementById('__psex_no_hover_tips')) return;
        var host = (location && location.host) ? location.host : '';
        if (host.indexOf('iconfont') === -1) return;
        var style = document.createElement('style');
        style.id = '__psex_no_hover_tips';
        style.textContent = [
          '[role=\"tooltip\"],',
          '[class*=\"tooltip\"],',
          '[class*=\"popover\"],',
          '[class*=\"hover\"],',
          '[class*=\"tips\"],',
          '[class*=\"hint\"],',
          '[class*=\"action\"],',
          '[class*=\"operate\"],',
          '[class*=\"tool\"],',
          '[class*=\"toolbar\"],',
          '[class*=\"hover\"],',
          '[data-action],',
          '[data-operate],',
          '[data-operation],',
          '[data-collect],',
          '[data-download],',
          '[class*=\"icon-item\"] [class*=\"cart\"],',
          '[class*=\"icon-item\"] [class*=\"collect\"],',
          '[class*=\"icon-item\"] [class*=\"favorite\"],',
          '[class*=\"icon-item\"] [class*=\"fav\"],',
          '[class*=\"icon-item\"] [class*=\"download\"],',
          '[class*=\"icon-item\"] [class*=\"like\"],',
          '[class*=\"icon-item\"] [class*=\"operate\"],',
          '[class*=\"icon-item\"] [class*=\"action\"],',
          '[class*=\"icon-item\"] [class*=\"tool\"],',
          '[class*=\"icon-item\"] [class*=\"toolbar\"],',
          '[class*=\"icon-item\"] [class*=\"hover\"],',
          '[class*=\"icon-item\"] [class*=\"mask\"],',
          '[class*=\"icon-item\"] [class*=\"overlay\"],',
          '[class*=\"icon-item\"] [class*=\"cover\"],',
          '[class*=\"icon-item\"] [class*=\"btn\"],',
          '[class*=\"icon-card\"] [class*=\"cart\"],',
          '[class*=\"icon-card\"] [class*=\"collect\"],',
          '[class*=\"icon-card\"] [class*=\"favorite\"],',
          '[class*=\"icon-card\"] [class*=\"fav\"],',
          '[class*=\"icon-card\"] [class*=\"download\"],',
          '[class*=\"icon-card\"] [class*=\"like\"],',
          '[class*=\"icon-card\"] [class*=\"operate\"],',
          '[class*=\"icon-card\"] [class*=\"action\"],',
          '[class*=\"icon-card\"] [class*=\"tool\"],',
          '[class*=\"icon-card\"] [class*=\"toolbar\"],',
          '[class*=\"icon-card\"] [class*=\"hover\"],',
          '[class*=\"icon-card\"] [class*=\"mask\"],',
          '[class*=\"icon-card\"] [class*=\"overlay\"],',
          '[class*=\"icon-card\"] [class*=\"cover\"],',
          '[class*=\"icon-card\"] [class*=\"btn\"]',
          '{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}'
        ].join('');
        (document.head || document.documentElement).appendChild(style);
      } catch (e) {}
    }

    function applyCapturePointerStyle(enable) {
      try {
        var existing = document.getElementById(CAPTURE_POINTER_STYLE_ID);
        if (enable) {
          if (existing) return;
          var style = document.createElement('style');
          style.id = CAPTURE_POINTER_STYLE_ID;
          style.textContent = [
            '*{pointer-events:none!important;}',
            'img,svg,canvas,video,audio{pointer-events:auto!important;}',
            'button,input,select,textarea,a{pointer-events:auto!important;}',
            '[role=\"button\"],[role=\"slider\"],[role=\"textbox\"]{pointer-events:auto!important;}'
          ].join('');
          (document.head || document.documentElement).appendChild(style);
        } else if (existing && existing.parentNode) {
          existing.parentNode.removeChild(existing);
        }
      } catch (e) {}
    }

    function postError(message) {
      window.parent.postMessage({ type: 'PSEX_CAPTURE_ERROR', message: message }, '*');
    }

    function postDataUrl(dataUrl, meta) {
      if (!dataUrl || typeof dataUrl !== 'string' || dataUrl.indexOf('data:image/') !== 0) {
        postError('未获取到有效图片。');
        return;
      }
      window.parent.postMessage({ type: 'PSEX_CAPTURE', dataUrl: dataUrl, meta: meta || {} }, '*');
    }

    function postCaptureUrl(url, meta) {
      window.parent.postMessage({ type: 'PSEX_CAPTURE_URL', url: url, meta: meta || {} }, '*');
    }

    function postContextMenu(payload) {
      window.parent.postMessage(payload, '*');
    }

    function shouldIgnoreOpenUrl(url) {
      var v = (url || '').trim();
      if (!v) return true;
      var lower = v.toLowerCase();
      if (lower === '#' || lower === '#/' || lower.charAt(0) === '#' || lower === 'about:blank') return true;
      if (lower.indexOf('javascript:') === 0) return true;
      if (lower.indexOf('mailto:') === 0) return true;
      if (lower.indexOf('tel:') === 0) return true;
      return false;
    }

    function normalizeOpenUrl(rawUrl) {
      var v = (rawUrl || '').trim();
      if (!v) return '';
      if (v.indexOf('//') === 0) {
        return (location && location.protocol ? location.protocol : 'https:') + v;
      }
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return v;
      try {
        return new URL(v, location.href).toString();
      } catch (e) {
        return v;
      }
    }

    function resolveLinkHref(node) {
      if (!node) return '';
      var href = node.getAttribute ? node.getAttribute('href') : '';
      if (!href) href = node.href || '';
      if (href && !shouldIgnoreOpenUrl(href)) return href;
      var attrs = ['data-href', 'data-url', 'data-link', 'data-u', 'data-raw-href', 'data-rawurl'];
      for (var i = 0; i < attrs.length; i++) {
        var val = node.getAttribute ? node.getAttribute(attrs[i]) : '';
        if (val && !shouldIgnoreOpenUrl(val)) return val;
      }
      var dataClick = node.getAttribute ? node.getAttribute('data-click') : '';
      if (dataClick && dataClick.indexOf('{') !== -1) {
        try {
          var obj = JSON.parse(dataClick);
          if (obj && obj.url && !shouldIgnoreOpenUrl(obj.url)) return obj.url;
          if (obj && obj.href && !shouldIgnoreOpenUrl(obj.href)) return obj.href;
        } catch (e2) {}
      }
      return '';
    }

    function isRasterUrl(url) {
      var v = (url || '').toLowerCase();
      if (!v) return false;
      if (v.indexOf('data:') === 0) return false;
      if (v.indexOf('blob:') === 0) return false;
      if (v.indexOf('.svg') !== -1) return false;
      return true;
    }

    function postOpenUrl(url) {
      try {
        if (!url || shouldIgnoreOpenUrl(url)) return;
        var next = normalizeOpenUrl(url);
        if (!next || shouldIgnoreOpenUrl(next)) return;
        window.parent.postMessage({ type: 'PSEX_OPEN_URL', url: next }, '*');
      } catch (e) {}
    }

    function postZoom(value) {
      try {
        window.parent.postMessage({ type: 'PSEX_PAGE_ZOOM', zoom: value }, '*');
      } catch (e) {}
    }

    var lastIframeNotify = 0;
    function notifyIframeInteraction() {
      var now = Date.now();
      if (now - lastIframeNotify < 200) return;
      lastIframeNotify = now;
      try { window.parent.postMessage({ type: 'PSEX_IFRAME_INTERACT' }, '*'); } catch (e) {}
    }

    var pureModeActive = false;
    var PURE_OVERLAY_ID = '__psex_pure_overlay';
    var PURE_STYLE_ID = '__psex_pure_overlay_style';
    function restorePureMode() {
      try {
        var overlay = document.getElementById(PURE_OVERLAY_ID);
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        var style = document.getElementById(PURE_STYLE_ID);
        if (style && style.parentNode) style.parentNode.removeChild(style);
        if (document.body && document.body.hasAttribute('data-psex-prev-overflow')) {
          document.body.style.overflow = document.body.getAttribute('data-psex-prev-overflow') || '';
          document.body.removeAttribute('data-psex-prev-overflow');
        }
      } catch (e) {}
      pureModeActive = false;
    }

    function findBestGalleryRoot() {
      try {
        function findGalleryFromMediaNodes() {
          var nodes = document.querySelectorAll('img,svg,canvas');
          if (!nodes || nodes.length < 3) return null;
          var useMap = (typeof Map !== 'undefined');
          var counts = useMap ? new Map() : [];
          function inc(el) {
            if (!el) return;
            if (useMap) {
              counts.set(el, (counts.get(el) || 0) + 1);
              return;
            }
            for (var i = 0; i < counts.length; i++) {
              if (counts[i].el === el) {
                counts[i].count += 1;
                return;
              }
            }
            counts.push({ el: el, count: 1 });
          }
          for (var i = 0; i < nodes.length; i++) {
            var cur = nodes[i];
            var depth = 0;
            while (cur && cur.parentElement && depth < 6) {
              cur = cur.parentElement;
              inc(cur);
              if (cur === document.body) break;
              depth += 1;
            }
          }
          var bodyRect = document.body && document.body.getBoundingClientRect ? document.body.getBoundingClientRect() : null;
          var bodyArea = bodyRect ? (bodyRect.width * bodyRect.height) : 0;
          var best = null;
          var bestCount = 0;
          var bestArea = 0;
          function consider(el, count) {
            if (!el || el === document.body || el === document.documentElement) return;
            var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
            if (!rect || rect.width < 200 || rect.height < 200) return;
            var area = rect.width * rect.height;
            if (bodyArea && area > bodyArea * 0.92) return;
            if (count > bestCount || (count === bestCount && area < bestArea)) {
              best = el;
              bestCount = count;
              bestArea = area;
            }
          }
          if (useMap) {
            counts.forEach(function (count, el) { consider(el, count); });
          } else {
            for (var j = 0; j < counts.length; j++) consider(counts[j].el, counts[j].count);
          }
          return best;
        }

        var fromMedia = findGalleryFromMediaNodes();
        if (fromMedia) return fromMedia;

        var nodes = document.querySelectorAll('main,section,div,ul,ol');
        var best = null;
        var bestScore = 0;
        var limit = 500;
        for (var i = 0; i < nodes.length && limit > 0; i++, limit--) {
          var el = nodes[i];
          if (!el || !el.getBoundingClientRect) continue;
          var imgs = el.querySelectorAll('img,svg,canvas');
          var count = imgs ? imgs.length : 0;
          if (count < 3) continue;
          var rect = el.getBoundingClientRect();
          if (rect.width < 200 || rect.height < 200) continue;
          var score = (count * 10) + (rect.width * rect.height) / 50000;
          if (score > bestScore) {
            bestScore = score;
            best = el;
          }
        }
        return best || document.body;
      } catch (e) {
        return document.body;
      }
    }

    function applyPureMode() {
      try {
        restorePureMode();
        if (document.body && !document.body.hasAttribute('data-psex-prev-overflow')) {
          document.body.setAttribute('data-psex-prev-overflow', document.body.style.overflow || '');
          document.body.style.overflow = 'hidden';
        }
        var style = document.createElement('style');
        style.id = PURE_STYLE_ID;
        style.textContent = [
          '#' + PURE_OVERLAY_ID + '{position:fixed;inset:0;z-index:2147483647;background:#262626;color:#ddd;overflow:auto;font-family:Arial,"Microsoft Yahei",sans-serif;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-top{position:sticky;top:0;display:flex;align-items:center;gap:10px;padding:10px 16px;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);z-index:2;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-badge{background:#2b6cff;color:#fff;border-radius:8px;padding:4px 10px;font-size:12px;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-count{font-size:12px;color:#a0a0a0;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;padding:14px;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-item{background:#333;border-radius:10px;padding:10px;text-align:center;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-item img{max-width:100%;max-height:140px;object-fit:contain;background:#2b2b2b;border-radius:6px;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-size{margin-top:6px;font-size:12px;color:#9b9b9b;}',
          '#' + PURE_OVERLAY_ID + ' .psex-pure-empty{padding:40px 16px;text-align:center;color:#888;}'
        ].join('');
        (document.head || document.documentElement).appendChild(style);

        var overlay = document.createElement('div');
        overlay.id = PURE_OVERLAY_ID;
        overlay.innerHTML = '<div class="psex-pure-top"><span class="psex-pure-badge">已开启 纯图模式</span><span class="psex-pure-count">0 项</span></div><div class="psex-pure-grid"></div>';
        document.body.appendChild(overlay);
        var grid = overlay.querySelector('.psex-pure-grid');
        var countEl = overlay.querySelector('.psex-pure-count');
        var total = 0;
        var seen = {};

        function updateCount() {
          if (countEl) countEl.textContent = total + ' 项';
        }

        function appendItem(src, w, h) {
          if (!src || seen[src]) return;
          seen[src] = 1;
          var item = document.createElement('div');
          item.className = 'psex-pure-item';
          var img = document.createElement('img');
          img.src = src;
          item.appendChild(img);
          var size = document.createElement('div');
          size.className = 'psex-pure-size';
          size.textContent = (w && h) ? (w + 'x' + h) : '';
          item.appendChild(size);
          grid.appendChild(item);
          total += 1;
          updateCount();
        }

        var imgs = Array.prototype.slice.call(document.images || []);
        imgs.forEach(function (img) {
          try {
            var rect = img.getBoundingClientRect();
            if (rect.width < 16 || rect.height < 16) return;
            var src = img.currentSrc || img.src;
            if (!src) return;
            var w = img.naturalWidth || Math.round(rect.width);
            var h = img.naturalHeight || Math.round(rect.height);
            appendItem(src, w, h);
          } catch (e) {}
        });

        var svgs = Array.prototype.slice.call(document.querySelectorAll('svg'));
        var svgLimit = 160;
        var pending = 0;
        svgs.forEach(function (svgEl) {
          if (svgLimit <= 0) return;
          try {
            var rect = svgEl.getBoundingClientRect();
            if (rect.width < 16 || rect.height < 16) return;
            svgLimit -= 1;
            pending += 1;
            svgToDataUrlAsync(svgEl, function (svgUrl) {
              if (svgUrl) {
                appendItem(svgUrl, Math.round(rect.width), Math.round(rect.height));
              }
              pending -= 1;
              if (pending <= 0 && total === 0) {
                var empty = document.createElement('div');
                empty.className = 'psex-pure-empty';
                empty.textContent = '未找到可展示的素材。';
                grid.appendChild(empty);
              }
            });
          } catch (e) {}
        });

        if (pending === 0 && total === 0) {
          var empty2 = document.createElement('div');
          empty2.className = 'psex-pure-empty';
          empty2.textContent = '未找到可展示的素材。';
          grid.appendChild(empty2);
        }
        pureModeActive = true;
      } catch (e) {}
    }

    function applyPageZoom(value) {
      var z = Math.max(0.25, Math.min(3, value || 1));
      pageZoom = z;
      try { document.documentElement.style.zoom = String(z); } catch (e) {}
      try { document.body.style.zoom = String(z); } catch (e2) {}
      try { window.dispatchEvent(new Event('resize')); } catch (e3) {}
      postZoom(z);
    }

    function extractUrlFromStyle(el) {
      try {
        var style = window.getComputedStyle(el);
        var bg = style && style.backgroundImage ? style.backgroundImage : '';
        var match = /url\(["']?(.*?)["']?\)/.exec(bg || '');
        return match ? match[1] : '';
      } catch (e) {
        return '';
      }
    }

    function blobToDataUrl(blob, cb, meta) {
      try {
        var reader = new FileReader();
        reader.onload = function () { cb(reader.result, meta || {}); };
        reader.onerror = function () { cb(null, meta || {}); };
        reader.readAsDataURL(blob);
      } catch (e) {
        cb(null, meta || {});
      }
    }

    function blobToScaledDataUrl(blob, cb) {
      try {
        if ((!scaleEnabled || !MAX_RASTER_SIDE) && !jpegEnabled) {
          blobToDataUrl(blob, cb, { scaled: false, jpeg: false });
          return;
        }
        var objUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        var img = new Image();
        img.onload = function () {
          try {
            var w = img.naturalWidth || img.width;
            var h = img.naturalHeight || img.height;
            var maxSide = Math.max(w, h);
            if (!maxSide || (!jpegEnabled && maxSide <= MAX_RASTER_SIDE)) {
              (window.URL || window.webkitURL).revokeObjectURL(objUrl);
              blobToDataUrl(blob, cb, { scaled: false, jpeg: false, w: w, h: h });
              return;
            }
            var scaled = false;
            var tw = w;
            var th = h;
            if (scaleEnabled && MAX_RASTER_SIDE && maxSide > MAX_RASTER_SIDE) {
              var scale = MAX_RASTER_SIDE / maxSide;
              tw = Math.max(1, Math.round(w * scale));
              th = Math.max(1, Math.round(h * scale));
              scaled = true;
            }
            var canvas = document.createElement('canvas');
            canvas.width = tw;
            canvas.height = th;
            var ctx = canvas.getContext('2d');
            if (jpegEnabled) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, tw, th);
            }
            ctx.drawImage(img, 0, 0, tw, th);
            var dataUrl = jpegEnabled
              ? canvas.toDataURL('image/jpeg', Math.max(0.1, Math.min(1, (jpegQuality || 85) / 100)))
              : canvas.toDataURL('image/png');
            (window.URL || window.webkitURL).revokeObjectURL(objUrl);
            cb(dataUrl, { scaled: scaled, jpeg: !!jpegEnabled, w: w, h: h, tw: tw, th: th });
          } catch (err) {
            (window.URL || window.webkitURL).revokeObjectURL(objUrl);
            blobToDataUrl(blob, cb, { scaled: false, jpeg: false });
          }
        };
        img.onerror = function () {
          try { (window.URL || window.webkitURL).revokeObjectURL(objUrl); } catch (e) {}
          blobToDataUrl(blob, cb, { scaled: false, jpeg: false });
        };
        img.src = objUrl;
      } catch (e) {
        cb(null, { scaled: false, jpeg: false });
      }
    }

    function urlToDataUrl(url, cb) {
      try {
        if (window.fetch) {
          fetch(url).then(function (r) { return r.blob(); }).then(function (blob) {
            blobToScaledDataUrl(blob, cb);
          }).catch(function () { cb(null, { scaled: false }); });
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            blobToScaledDataUrl(xhr.response, cb);
          } else {
            cb(null, { scaled: false });
          }
        };
        xhr.onerror = function () { cb(null, { scaled: false }); };
        xhr.send();
      } catch (e) {
        cb(null, { scaled: false });
      }
    }

    function fetchText(url, cb) {
      try {
        if (window.fetch) {
          fetch(url).then(function (r) { return r.text(); }).then(function (t) {
            cb(t);
          }).catch(function () { cb(null); });
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) cb(xhr.responseText);
          else cb(null);
        };
        xhr.onerror = function () { cb(null); };
        xhr.send();
      } catch (e) {
        cb(null);
      }
    }

    function inlineSvg(svgEl, cb) {
      try {
        var SVG_NS = 'http://www.w3.org/2000/svg';
        var svg = svgEl.cloneNode(true);
        var symbolMap = {};
        try {
          var symbols = svgEl.ownerDocument ? svgEl.ownerDocument.querySelectorAll('symbol[id]') : [];
          if (symbols && symbols.length) {
            Array.prototype.slice.call(symbols).forEach(function (sym) {
              var id = sym.getAttribute('id');
              if (id && !symbolMap[id]) symbolMap[id] = sym;
            });
          }
        } catch (e0) {}
        var uses = svg.querySelectorAll('use');
        if (!uses || uses.length === 0) {
          cb(svg);
          return;
        }
        function extractSvgText(raw) {
          if (!raw) return null;
          var start = raw.indexOf('<svg');
          var end = raw.lastIndexOf('</svg>');
          if (start === -1 || end === -1) return null;
          return raw.slice(start, end + 6);
        }
        var pending = uses.length;
        var done = function () {
          pending -= 1;
          if (pending <= 0) cb(svg);
        };
        var replaceUse = function (useEl, symbolEl) {
          if (!symbolEl) return;
          var g = svg.ownerDocument.createElementNS(SVG_NS, 'g');
          var x = useEl.getAttribute('x') || '0';
          var y = useEl.getAttribute('y') || '0';
          if (x !== '0' || y !== '0') {
            g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
          }
          if (useEl.getAttribute('class')) g.setAttribute('class', useEl.getAttribute('class'));
          if (useEl.getAttribute('fill')) g.setAttribute('fill', useEl.getAttribute('fill'));
          if (useEl.getAttribute('stroke')) g.setAttribute('stroke', useEl.getAttribute('stroke'));
          for (var i = 0; i < symbolEl.childNodes.length; i++) {
            g.appendChild(symbolEl.childNodes[i].cloneNode(true));
          }
          if (useEl.parentNode) useEl.parentNode.replaceChild(g, useEl);
        };
        uses.forEach(function (useEl) {
          var href = useEl.getAttribute('href') || useEl.getAttribute('xlink:href');
          if (!href) {
            done();
            return;
          }
          if (href.charAt(0) === '#') {
            var symId = href.slice(1);
            var sym = svgEl.ownerDocument.getElementById(symId) || symbolMap[symId];
            if (sym) replaceUse(useEl, sym);
            done();
            return;
          }
          if (href.indexOf('#') > -1) {
            var parts = href.split('#');
            var url = parts[0];
            var id = parts[1];
            fetchText(url, function (text) {
              if (!text) {
                var symFallback = symbolMap[id];
                if (symFallback) replaceUse(useEl, symFallback);
                done();
                return;
              }
              try {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, 'image/svg+xml');
                var sym2 = doc.getElementById(id);
                if (!sym2) {
                  var extracted = extractSvgText(text);
                  if (extracted) {
                    var doc2 = parser.parseFromString(extracted, 'image/svg+xml');
                    sym2 = doc2.getElementById(id);
                  }
                }
                if (!sym2 && symbolMap[id]) sym2 = symbolMap[id];
                if (sym2) replaceUse(useEl, sym2);
              } catch (e) {}
              done();
            });
            return;
          }
          done();
        });
      } catch (e) {
        cb(svgEl.cloneNode(true));
      }
    }

    function svgToDataUrlAsync(svgEl, cb) {
      try {
        inlineSvg(svgEl, function (svgClone) {
          if (!svgClone) {
            cb(null);
            return;
          }
          if (!svgClone.getAttribute('xmlns')) {
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          }
          if (!svgClone.getAttribute('xmlns:xlink')) {
            svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
          }
          var xml = new XMLSerializer().serializeToString(svgClone);
          cb('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml));
        });
      } catch (e) {
        cb(null);
      }
    }

    function svgDataUrlToPng(svgUrl, cb) {
      try {
        var img = new Image();
        img.onload = function () {
          try {
            var w = img.naturalWidth || img.width;
            var h = img.naturalHeight || img.height;
            if (!w || !h) {
              cb(null);
              return;
            }
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            cb(canvas.toDataURL('image/png'));
          } catch (e2) {
            cb(null);
          }
        };
        img.onerror = function () { cb(null); };
        img.src = svgUrl;
      } catch (e) {
        cb(null);
      }
    }

    function svgToPngDataUrlAsync(svgEl, cb) {
      svgToDataUrlAsync(svgEl, function (svgUrl) {
        if (!svgUrl) {
          cb(null);
          return;
        }
        svgDataUrlToPng(svgUrl, cb);
      });
    }

    function canvasToDataUrl(canvasEl) {
      try {
        return canvasEl.toDataURL('image/png');
      } catch (e) {
        return null;
      }
    }

    function parseCssContent(content) {
      if (!content) return '';
      var c = content.trim();
      if ((c[0] === '"' && c[c.length - 1] === '"') || (c[0] === "'" && c[c.length - 1] === "'")) {
        c = c.slice(1, -1);
      }
      if (!c || c === 'none' || c === 'normal') return '';
      if (c.indexOf('\\') === 0) {
        var hex = c.replace('\\u', '').replace('\\', '');
        var code = parseInt(hex, 16);
        if (!isNaN(code)) return String.fromCharCode(code);
      }
      return c;
    }

    function isIconFontCandidate(el) {
      try {
        if (!el || !el.tagName) return false;
        var cls = (el.className && el.className.toString()) || '';
        if (cls.indexOf('iconfont') !== -1 || cls.indexOf('icon') !== -1) return true;
        var styleBefore = window.getComputedStyle(el, '::before');
        var styleAfter = window.getComputedStyle(el, '::after');
        var content = parseCssContent(styleBefore && styleBefore.content);
        if (content) return true;
        content = parseCssContent(styleAfter && styleAfter.content);
        return !!content;
      } catch (e) {
        return false;
      }
    }

    function hasBackgroundImage(el) {
      try {
        if (!el || !el.getBoundingClientRect) return false;
        var style = window.getComputedStyle(el);
        var bg = style && style.backgroundImage ? style.backgroundImage : '';
        return !!(bg && bg !== 'none' && bg.indexOf('url(') !== -1);
      } catch (e) {
        return false;
      }
    }

    function iconFontToDataUrl(el) {
      try {
        var styleBefore = window.getComputedStyle(el, '::before');
        var styleAfter = window.getComputedStyle(el, '::after');
        var content = parseCssContent(styleBefore && styleBefore.content);
        var style = styleBefore;
        if (!content) {
          content = parseCssContent(styleAfter && styleAfter.content);
          style = styleAfter;
        }
        if (!content) return null;
        var fontFamily = (style && style.fontFamily) || window.getComputedStyle(el).fontFamily || 'sans-serif';
        var fontSize = parseInt((style && style.fontSize) || window.getComputedStyle(el).fontSize || '64', 10);
        var size = Math.max(fontSize * 4, 128);
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = (style && style.color) || window.getComputedStyle(el).color || '#000';
        ctx.font = Math.floor(size * 0.6) + 'px ' + fontFamily;
        ctx.fillText(content, size / 2, size / 2);
        return canvas.toDataURL('image/png');
      } catch (e) {
        return null;
      }
    }

    function findTarget(el) {
      var cur = el;
      while (cur && cur !== document.documentElement) {
        if (!cur.tagName) { cur = cur.parentNode; continue; }
        var tag = cur.tagName.toUpperCase();
        if (tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS') return cur;
        cur = cur.parentNode;
      }
      return null;
    }

    function normalizeImageUrl(url) {
      if (!url) return '';
      var u = String(url).trim();
      if (!u) return '';
      if (u.indexOf('//') === 0) {
        try { return location.protocol + u; } catch (e) { return 'https:' + u; }
      }
      return u;
    }

    function getImgPreferredUrl(img) {
      try {
        if (!img || !img.getAttribute) return '';
        var attrs = [
          'data-original',
          'data-src',
          'data-srcset',
          'data-url',
          'data-raw',
          'data-img',
          'data-image',
          'data-highres'
        ];
        for (var i = 0; i < attrs.length; i++) {
          var v = img.getAttribute(attrs[i]);
          if (v && v.indexOf('http') === 0) return v;
          if (v && v.indexOf('//') === 0) return normalizeImageUrl(v);
        }
        var srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
        if (srcset) {
          var parts = srcset.split(',');
          var bestUrl = '';
          var bestSize = 0;
          for (var j = 0; j < parts.length; j++) {
            var seg = parts[j].trim();
            if (!seg) continue;
            var segParts = seg.split(/\s+/);
            var segUrl = segParts[0] || '';
            var size = 0;
            if (segParts[1]) {
              var m = segParts[1].match(/(\d+)w/);
              if (m) size = parseInt(m[1], 10) || 0;
            }
            if (size >= bestSize) {
              bestSize = size;
              bestUrl = segUrl;
            }
          }
          if (bestUrl) return normalizeImageUrl(bestUrl);
        }
      } catch (e) {}
      return '';
    }

    function getHuabanModalUrl() {
      try {
        if (!location || !location.href) return '';
        var m = /[?&]modalImg=([^&]+)/i.exec(location.href);
        if (!m || !m[1]) return '';
        return normalizeImageUrl(decodeURIComponent(m[1]));
      } catch (e) {
        return '';
      }
    }

    function handleCapture(target) {
      if (!canCaptureNow()) return;
      if (!target || !target.tagName) {
        postError('未找到可用图片。');
        return;
      }
      if (target && target.querySelectorAll) {
        try {
          var childNodes = target.querySelectorAll('img,svg,canvas');
          if (childNodes && childNodes.length) {
            var childList = Array.prototype.slice.call(childNodes);
            var bestChild = pickLargest(childList);
            if (bestChild && bestChild !== target) {
              handleCapture(bestChild);
              return;
            }
          }
        } catch (e0) {}
      }
      var tag = target.tagName.toUpperCase();
      if (tag === 'IMG') {
        var src = target.currentSrc || target.src;
        var pref = getImgPreferredUrl(target);
        if (pref) src = pref;
        var host0 = (location && location.host) ? location.host : '';
        if (host0.indexOf('huaban.com') !== -1) {
          var modalUrl = getHuabanModalUrl();
          if (modalUrl) src = modalUrl;
        }
        src = normalizeImageUrl(src);
        if (!src) {
          postError('图片没有地址。');
          return;
        }
        if (src.indexOf('data:') === 0) {
          postDataUrl(src);
          return;
        }
        if (preferUrlCapture && isRasterUrl(src) && src.indexOf('http') === 0) {
          if (host0.indexOf('huaban.com') !== -1) {
            postCaptureUrl(src, { referer: location.href || '', title: document.title || '' });
            return;
          }
          try {
            var w0 = target.naturalWidth || target.width || 0;
            var h0 = target.naturalHeight || target.height || 0;
            var max0 = Math.max(w0, h0);
            if (max0 > 0 && max0 <= MAX_RASTER_SIDE) {
              // 小图直接走页面内转码，避免 Python 启动开销
            } else {
              postCaptureUrl(src, { referer: location.href || '', title: document.title || '' });
              return;
            }
          } catch (e0) {
            postCaptureUrl(src, { referer: location.href || '', title: document.title || '' });
            return;
          }
        }
        urlToDataUrl(src, function (dataUrl, meta) {
          if (!dataUrl) postError('获取图片失败。');
          else postDataUrl(dataUrl, meta);
        });
        return;
      }
      if (tag === 'SVG') {
        var host = (location && location.host) ? location.host : '';
        if (host.indexOf('iconfont') !== -1) {
          svgToPngDataUrlAsync(target, function (pngUrl) {
            if (pngUrl) {
              postDataUrl(pngUrl);
            } else {
              svgToDataUrlAsync(target, function (svgUrl) {
                if (!svgUrl) postError('解析 SVG 失败。');
                else postDataUrl(svgUrl);
              });
            }
          });
        } else {
          svgToDataUrlAsync(target, function (svgUrl) {
            if (!svgUrl) postError('解析 SVG 失败。');
            else postDataUrl(svgUrl);
          });
        }
        return;
      }
      if (tag === 'CANVAS') {
        var cUrl = canvasToDataUrl(target);
        if (!cUrl) postError('读取画布失败。');
        else postDataUrl(cUrl);
        return;
      }

      var iconUrl = iconFontToDataUrl(target);
      if (iconUrl) {
        postDataUrl(iconUrl);
        return;
      }

      var bgUrl = extractUrlFromStyle(target);
      if (bgUrl) {
        if (preferUrlCapture && isRasterUrl(bgUrl) && bgUrl.indexOf('http') === 0) {
          postCaptureUrl(bgUrl, { referer: location.href || '', title: document.title || '' });
          return;
        }
        urlToDataUrl(bgUrl, function (dataUrl, meta) {
          if (!dataUrl) postError('获取背景图失败。');
          else postDataUrl(dataUrl, meta);
        });
        return;
      }

      var cur = target.parentNode;
      var steps = 0;
      while (cur && cur !== document.documentElement && steps < 6) {
        steps += 1;
        if (cur.tagName) {
          var t = cur.tagName.toUpperCase();
          if (t === 'IMG') {
            var psrc = cur.currentSrc || cur.src;
            if (psrc) {
              if (psrc.indexOf('data:') === 0) {
                postDataUrl(psrc);
                return;
              }
              if (preferUrlCapture && isRasterUrl(psrc) && psrc.indexOf('http') === 0) {
                postCaptureUrl(psrc, { referer: location.href || '', title: document.title || '' });
                return;
              }
              urlToDataUrl(psrc, function (dataUrl, meta) {
                if (!dataUrl) postError('获取图片失败。');
                else postDataUrl(dataUrl, meta);
              });
              return;
            }
          }
          if (t === 'SVG') {
            var host2 = (location && location.host) ? location.host : '';
            if (host2.indexOf('iconfont') !== -1) {
              svgToPngDataUrlAsync(cur, function (pngUrl) {
                if (pngUrl) {
                  postDataUrl(pngUrl);
                } else {
                  svgToDataUrlAsync(cur, function (svgUrl) {
                    if (!svgUrl) postError('解析 SVG 失败。');
                    else postDataUrl(svgUrl);
                  });
                }
              });
            } else {
              svgToDataUrlAsync(cur, function (svgUrl) {
                if (!svgUrl) postError('解析 SVG 失败。');
                else postDataUrl(svgUrl);
              });
            }
            return;
          }
          if (t === 'CANVAS') {
            var cUrl2 = canvasToDataUrl(cur);
            if (!cUrl2) postError('读取画布失败。');
            else postDataUrl(cUrl2);
            return;
          }
        }
        var iconUrl2 = iconFontToDataUrl(cur);
        if (iconUrl2) {
          postDataUrl(iconUrl2);
          return;
        }
        var bgUrl2 = extractUrlFromStyle(cur);
        if (bgUrl2) {
          if (preferUrlCapture && isRasterUrl(bgUrl2) && bgUrl2.indexOf('http') === 0) {
            postCaptureUrl(bgUrl2, { referer: location.href || '', title: document.title || '' });
            return;
          }
          urlToDataUrl(bgUrl2, function (dataUrl, meta) {
            if (!dataUrl) postError('获取背景图失败。');
            else postDataUrl(dataUrl, meta);
          });
          return;
        }
        cur = cur.parentNode;
      }

      postError('未找到可用图片。');
    }

    function getCandidatesAtPoint(x, y) {
      try {
        if (document.elementsFromPoint) return document.elementsFromPoint(x, y) || [];
      } catch (e) {}
      var el = document.elementFromPoint(x, y);
      return el ? [el] : [];
    }

    function isOverlayNode(el) {
      try {
        if (!el || !el.getAttribute) return false;
        var role = (el.getAttribute('role') || '').toLowerCase();
        if (role === 'tooltip') return true;
        var cls = (el.className && el.className.toString().toLowerCase()) || '';
        if (!cls) return false;
        return cls.indexOf('tooltip') !== -1 ||
          cls.indexOf('popover') !== -1 ||
          cls.indexOf('hover') !== -1 ||
          cls.indexOf('tips') !== -1 ||
          cls.indexOf('hint') !== -1 ||
          cls.indexOf('action') !== -1 ||
          cls.indexOf('operate') !== -1 ||
          cls.indexOf('tool') !== -1 ||
          cls.indexOf('toolbar') !== -1;
      } catch (e) {
        return false;
      }
    }

    function findIconfontCard(el) {
      var cur = el;
      while (cur && cur !== document.documentElement) {
        if (cur.className) {
          var cls = cur.className.toString().toLowerCase();
          if (cls.indexOf('icon-item') !== -1 ||
              cls.indexOf('icon-card') !== -1 ||
              cls.indexOf('icon-glyph') !== -1 ||
              cls.indexOf('icon-box') !== -1 ||
              cls.indexOf('icon-list') !== -1 ||
              cls.indexOf('glyph') !== -1) {
            return cur;
          }
        }
        if (cur.getAttribute) {
          if (cur.getAttribute('data-id') ||
              cur.getAttribute('data-icon') ||
              cur.getAttribute('data-icon-id') ||
              cur.getAttribute('data-name')) {
            return cur;
          }
        }
        cur = cur.parentNode;
      }
      return null;
    }

    function collectIconCandidates(card) {
      if (!card || !card.querySelectorAll) return [];
      var nodes = card.querySelectorAll('svg, img, canvas, i, span, div, a, button');
      var list = nodes && nodes.length ? Array.prototype.slice.call(nodes) : [];
      return list.filter(function (node) {
        if (!node || !node.tagName) return false;
        var tag = node.tagName.toUpperCase();
        if (tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS') return true;
        if (isIconFontCandidate(node)) return true;
        if (hasBackgroundImage(node)) return true;
        return false;
      });
    }

    function pickLargestFromList(list) {
      return pickLargest(list);
    }

    function pickLargestIconInCard(card) {
      var candidates = collectIconCandidates(card);
      if (candidates.length) return pickLargestFromList(candidates);
      return null;
    }

    function containsPoint(el, x, y) {
      try {
        var r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      } catch (e) {
        return false;
      }
    }

    function pickSmallestContaining(list, x, y, predicate) {
      var best = null;
      var bestArea = Infinity;
      var i;
      for (i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el || !el.tagName) continue;
        if (predicate && !predicate(el)) continue;
        if (!containsPoint(el, x, y)) continue;
        var area = rectArea(el);
        if (area > 0 && area < bestArea) {
          best = el;
          bestArea = area;
        }
      }
      return best;
    }

    function pickNearestIconInCard(card, x, y) {
      var list = collectIconCandidates(card);
      if (!list.length) return null;
      var inside = list.filter(function (el) {
        if (!el || !el.tagName) return false;
        var tag = el.tagName.toUpperCase();
        if (tag === 'I' || tag === 'SPAN' || tag === 'DIV' || tag === 'A' || tag === 'BUTTON') {
          return (isIconFontCandidate(el) || hasBackgroundImage(el)) && containsPoint(el, x, y);
        }
        return (tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS') && containsPoint(el, x, y);
      });
      if (inside.length) {
        return pickSmallestContaining(inside, x, y);
      }
      var best = null;
      var bestDist = Infinity;
      list.forEach(function (el) {
        if (!el || !el.getBoundingClientRect) return;
        if (el.tagName && (el.tagName.toUpperCase() === 'I' || el.tagName.toUpperCase() === 'SPAN')) {
          if (!isIconFontCandidate(el)) return;
        }
        var r = el.getBoundingClientRect();
        var cx = (r.left + r.right) / 2;
        var cy = (r.top + r.bottom) / 2;
        var dx = cx - x;
        var dy = cy - y;
        var d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      });
      return best;
    }

    function isVisibleElement(el) {
      try {
        var style = window.getComputedStyle(el);
        if (!style) return true;
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        var op = parseFloat(style.opacity || '1');
        if (!isNaN(op) && op <= 0) return false;
        return true;
      } catch (e) {
        return true;
      }
    }

    function isReasonableIconRect(el) {
      try {
        var r = el.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) return false;
        if (r.width > 420 || r.height > 420) return false;
        return true;
      } catch (e) {
        return false;
      }
    }

    function collectGlobalIconCandidates() {
      var nodes = [];
      try {
        nodes = document.querySelectorAll('svg, img, canvas, i, span, [class*="iconfont"], [class*="icon-"], [data-icon], [data-icon-id]');
      } catch (e) {
        nodes = [];
      }
      var list = nodes && nodes.length ? Array.prototype.slice.call(nodes) : [];
      return list.filter(function (node) {
        if (!node || !node.tagName) return false;
        if (!isVisibleElement(node)) return false;
        if (!isReasonableIconRect(node)) return false;
        var tag = node.tagName.toUpperCase();
        if (tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS') return true;
        if (isIconFontCandidate(node)) return true;
        if (hasBackgroundImage(node)) return true;
        return false;
      });
    }

    function pickNearestIconCandidate(list, x, y) {
      if (!list || !list.length) return null;
      var inside = pickSmallestContaining(list, x, y);
      if (inside) return inside;
      var best = null;
      var bestDist = Infinity;
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el || !el.getBoundingClientRect) continue;
        var r = el.getBoundingClientRect();
        var cx = (r.left + r.right) / 2;
        var cy = (r.top + r.bottom) / 2;
        var dx = cx - x;
        var dy = cy - y;
        var d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }
      return best;
    }

    function pickNearestIconfontGlobal(x, y) {
      var list = collectGlobalIconCandidates();
      return pickNearestIconCandidate(list, x, y);
    }

    function listHasCaptureCandidate(list) {
      if (!list || !list.length) return false;
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el || !el.tagName) continue;
        var tag = el.tagName.toUpperCase();
        if (tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS') return true;
        if (isIconFontCandidate(el)) return true;
        if (hasBackgroundImage(el)) return true;
      }
      return false;
    }

    function rectArea(el) {
      try {
        var r = el.getBoundingClientRect();
        return Math.max(0, r.width) * Math.max(0, r.height);
      } catch (e) {
        return 0;
      }
    }

    function pickLargest(list, predicate) {
      var best = null;
      var bestArea = 0;
      var i;
      for (i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el || !el.tagName) continue;
        if (predicate && !predicate(el)) continue;
        var area = rectArea(el);
        if (area > bestArea) {
          best = el;
          bestArea = area;
        }
      }
      return best;
    }

    function getTargetAtPoint(x, y) {
      var list = getCandidatesAtPoint(x, y);
      if (list && list.length) {
        var filtered = list.filter(function (el) { return !isOverlayNode(el); });
        if (filtered && filtered.length && listHasCaptureCandidate(filtered)) {
          list = filtered;
        }
      }
      try {
        if (location && location.host && location.host.indexOf('iconfont') !== -1 && list && list.length) {
          var i;
          for (i = 0; i < list.length; i++) {
            var card = findIconfontCard(list[i]);
            if (card) {
              var candidates = collectIconCandidates(card);
              var bestInCard = pickSmallestContaining(candidates, x, y) ||
                pickNearestIconInCard(card, x, y) ||
                pickLargestIconInCard(card);
              if (bestInCard) return bestInCard;
            }
          }
          var nearestGlobal = pickNearestIconfontGlobal(x, y);
          if (nearestGlobal) return nearestGlobal;
        }
      } catch (e) {}
      if (location && location.host && location.host.indexOf('iconfont') !== -1 && (!list || !list.length)) {
        var fallbackGlobal = pickNearestIconfontGlobal(x, y);
        if (fallbackGlobal) return fallbackGlobal;
      }
      var bestDirect = pickSmallestContaining(list, x, y, function (el) {
        var tag = el.tagName.toUpperCase();
        return tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS';
      });
      if (bestDirect) return bestDirect;

      var childCandidates = [];
      var i;
      for (i = 0; i < list.length; i++) {
        var el2 = list[i];
        if (!el2 || !el2.querySelectorAll) continue;
        var nodes = el2.querySelectorAll('svg, img, canvas');
        if (nodes && nodes.length) {
          Array.prototype.slice.call(nodes).forEach(function (node) {
            if (containsPoint(node, x, y)) childCandidates.push(node);
          });
        }
      }
      var bestChild = pickSmallestContaining(childCandidates, x, y);
      if (bestChild) return bestChild;

      var bestIcon = pickSmallestContaining(list, x, y, function (el3) { return isIconFontCandidate(el3); });
      if (bestIcon) return bestIcon;
      var elTop = list.length ? list[0] : null;
      if (elTop && elTop.tagName && elTop.tagName.toUpperCase() === 'IFRAME') {
        try {
          var rect = elTop.getBoundingClientRect();
          var x2 = x - rect.left;
          var y2 = y - rect.top;
          if (elTop.contentDocument && elTop.contentDocument.elementFromPoint) {
            var inner = elTop.contentDocument.elementFromPoint(x2, y2);
            return inner || elTop;
          }
        } catch (e) {}
      }
      return elTop;
    }

    function captureAtPoint(x, y, fallbackNode) {
      try {
        var host = (location && location.host) ? location.host : '';
        var isIconfontHost = host.indexOf('iconfont') !== -1;
        if (!isIconfontHost) {
          var t0 = findTarget(fallbackNode);
          if (!t0) {
            var list0 = getCandidatesAtPoint(x, y);
            if (list0 && list0.length) {
              var filtered0 = list0.filter(function (el) { return !isOverlayNode(el); });
              if (filtered0 && filtered0.length) list0 = filtered0;
            }
            var best0 = pickSmallestContaining(list0, x, y, function (el) {
              var tag0 = el.tagName.toUpperCase();
              return tag0 === 'IMG' || tag0 === 'SVG' || tag0 === 'CANVAS';
            });
            if (!best0) {
              var childCandidates0 = [];
              for (var c0 = 0; c0 < (list0 || []).length; c0++) {
                var el0 = list0[c0];
                if (!el0 || !el0.querySelectorAll) continue;
                var nodes0 = el0.querySelectorAll('img,svg,canvas');
                if (nodes0 && nodes0.length) {
                  Array.prototype.slice.call(nodes0).forEach(function (node) {
                    if (containsPoint(node, x, y)) childCandidates0.push(node);
                  });
                }
              }
              best0 = pickSmallestContaining(childCandidates0, x, y);
            }
            if (!best0) {
              best0 = pickSmallestContaining(list0, x, y, function (el1) { return hasBackgroundImage(el1); });
            }
            if (best0) t0 = best0;
          }
          if (!t0) t0 = fallbackNode;
          if (t0) handleCapture(t0);
          else postError('未找到可用图片。');
          return;
        }
        var list = getCandidatesAtPoint(x, y);
        if (!list) list = [];
        if (fallbackNode) list.unshift(fallbackNode);
        if (list && list.length) {
          var filtered = list.filter(function (el) { return !isOverlayNode(el); });
          if (filtered && filtered.length && listHasCaptureCandidate(filtered)) {
            list = filtered;
          }
        }
        var candidates = [];
        function pushCandidate(el) {
          if (!el || !el.tagName) return;
          if (candidates.indexOf(el) !== -1) return;
          candidates.push(el);
        }
        for (var i = 0; i < list.length; i++) {
          var el = list[i];
          pushCandidate(el);
          if (el && el.querySelectorAll) {
            var nodes = el.querySelectorAll('img,svg,canvas');
            if (nodes && nodes.length) {
              Array.prototype.slice.call(nodes).forEach(function (node) {
                pushCandidate(node);
              });
            }
          }
        }
        if (!candidates.length) {
          var t1 = getTargetAtPoint(x, y) || findTarget(fallbackNode) || fallbackNode;
          if (t1) return handleCapture(t1);
          postError('未找到可用图片。');
          return;
        }
        var direct = pickSmallestContaining(candidates, x, y, function (el) {
          var tag = el.tagName.toUpperCase();
          return tag === 'IMG' || tag === 'SVG' || tag === 'CANVAS';
        });
        if (!direct) {
          direct = pickSmallestContaining(candidates, x, y, function (el) {
            return isIconFontCandidate(el) || hasBackgroundImage(el);
          });
        }
        if (!direct) direct = pickSmallestContaining(candidates, x, y);
        if (!direct) direct = pickNearestIconCandidate(candidates, x, y);
        if (direct) {
          handleCapture(direct);
          return;
        }
        var t2 = getTargetAtPoint(x, y) || findTarget(fallbackNode) || fallbackNode;
        if (t2) handleCapture(t2);
        else postError('未找到可用图片。');
      } catch (e) {
        postError('未找到可用图片。');
      }
    }


    function handleRightMouse(e) {
      if (e.button !== 2) return;
      try {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {}
      try {
        var t = getTargetAtPoint(e.clientX, e.clientY) || findTarget(e.target) || e.target;
        var url = '';
        var hasImage = false;
        if (t && t.tagName) {
          var tag = t.tagName.toUpperCase();
          if (tag === 'IMG') {
            url = t.currentSrc || t.src || '';
            hasImage = true;
          } else if (tag === 'SVG' || tag === 'CANVAS') {
            hasImage = true;
          }
        }
        if (!url) {
          var bg = extractUrlFromStyle(t);
          if (bg) {
            url = bg;
            hasImage = true;
          }
        }
        postContextMenu({
          type: 'PSEX_CONTEXT_MENU',
          x: e.clientX || 0,
          y: e.clientY || 0,
          url: url || '',
          hasImage: !!hasImage
        });
      } catch (err2) {}
      return;
    }

    function handleAltLeft(e) {
      if (!captureEnabled) return;
      if (e.button !== 0) return;
      if (!e.altKey) return;
      try {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {}
      captureAtPoint(e.clientX, e.clientY, e.target);
    }

    function handleCtrlWheel(e) {
      if (!zoomEnabled) return;
      if (!e.ctrlKey) return;
      try {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {}
      var delta = e.deltaY || e.wheelDelta || 0;
      if (delta > 0) applyPageZoom(pageZoom - 0.1);
      else applyPageZoom(pageZoom + 0.1);
    }

    function isEditableElement(node) {
      if (!node || !node.tagName) return false;
      var tag = node.tagName.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION' || tag === 'BUTTON') return true;
      if (node.isContentEditable) return true;
      if (node.getAttribute) {
        var role = (node.getAttribute('role') || '').toLowerCase();
        if (role === 'textbox' || role === 'combobox' || role === 'searchbox') return true;
      }
      return false;
    }

    function shouldHandleLink(linkNode) {
      if (!linkNode) return false;
      var target = '';
      try {
        target = (linkNode.getAttribute ? linkNode.getAttribute('target') : '') || linkNode.target || '';
      } catch (e) {
        target = '';
      }
      target = (target || '').toLowerCase();
      if (!target || target === '_self') return false;
      return true;
    }

    function handleLinkClick(e) {
      try {
        if (e.defaultPrevented) return;
        if (typeof e.button === 'number' && e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var node = e.target;
        if (isEditableElement(node)) return;
        var linkNode = null;
        while (node && node !== document.documentElement) {
          if (isEditableElement(node)) return;
          if (node.tagName && node.tagName.toUpperCase() === 'A') {
            linkNode = node;
            break;
          }
          node = node.parentNode;
        }
        if (!linkNode) return;
        var href = resolveLinkHref(linkNode) || linkNode.href || (linkNode.getAttribute ? linkNode.getAttribute('href') : '');
        if (!href || shouldIgnoreOpenUrl(href)) return;
        if (!shouldHandleLink(linkNode)) return;
        var next = normalizeOpenUrl(href);
        if (!next || shouldIgnoreOpenUrl(next)) return;
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
        postOpenUrl(next);
      } catch (err) {}
    }

    document.addEventListener('mousedown', handleRightMouse, true);
    document.addEventListener('mousedown', handleAltLeft, true);
    document.addEventListener('mousedown', notifyIframeInteraction, true);
    document.addEventListener('touchstart', notifyIframeInteraction, true);
    document.addEventListener('wheel', handleCtrlWheel, { passive: false });
    document.addEventListener('click', handleLinkClick, true);
    document.addEventListener('mousemove', function (e) {
      if (altPressed && e && !e.altKey) {
        altPressed = false;
        applyCapturePointerStyle(false);
      }
    }, true);
    document.addEventListener('mousedown', function (e) {
      if (altPressed && e && !e.altKey) {
        altPressed = false;
        applyCapturePointerStyle(false);
      }
    }, true);
    ensureFlatScrollbar();
    ensureCaptureNoHoverTips();

    document.addEventListener('keydown', function (e) {
      if (!captureEnabled) return;
      if (e && e.altKey) {
        if (!altPressed) {
          altPressed = true;
          applyCapturePointerStyle(true);
        }
      }
      if (e && e.key === 'Escape') {
        altPressed = false;
        applyCapturePointerStyle(false);
      }
    }, true);

    document.addEventListener('keyup', function (e) {
      if (!altPressed) return;
      if (!e || !e.altKey) {
        altPressed = false;
        applyCapturePointerStyle(false);
      }
    }, true);

    window.addEventListener('blur', function () {
      if (altPressed) {
        altPressed = false;
        applyCapturePointerStyle(false);
      }
    });

    try {
      var originOpen = window.open;
      window.open = function (url) {
        if (url && !shouldIgnoreOpenUrl(url)) {
          postOpenUrl(url);
        }
        var locationProxy = {
          assign: function (v) { if (v && !shouldIgnoreOpenUrl(v)) postOpenUrl(v); },
          replace: function (v) { if (v && !shouldIgnoreOpenUrl(v)) postOpenUrl(v); }
        };
        Object.defineProperty(locationProxy, 'href', {
          get: function () { return ''; },
          set: function (v) { if (v && !shouldIgnoreOpenUrl(v)) postOpenUrl(v); }
        });
        var fakeWin = {
          closed: false,
          close: function () {},
          focus: function () {},
          location: locationProxy
        };
        Object.defineProperty(fakeWin, 'location', {
          get: function () { return locationProxy; },
          set: function (v) { if (v && !shouldIgnoreOpenUrl(v)) postOpenUrl(v); }
        });
        return fakeWin;
      };
      window.open.toString = function () { return String(originOpen); };
    } catch (e) {}

    function clearSiteData() {
      try { if (window.localStorage) window.localStorage.clear(); } catch (e) {}
      try { if (window.sessionStorage) window.sessionStorage.clear(); } catch (e) {}
      try {
        var cookies = document.cookie ? document.cookie.split(';') : [];
        var host = (location && location.hostname) ? location.hostname : '';
        var parts = host ? host.split('.') : [];
        cookies.forEach(function (c) {
          var eq = c.indexOf('=');
          var name = (eq > -1 ? c.substr(0, eq) : c).trim();
          if (!name) return;
          var expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = name + '=;expires=' + expires + ';path=/';
          if (parts.length > 1) {
            for (var i = 0; i < parts.length - 1; i++) {
              var domain = '.' + parts.slice(i).join('.');
              document.cookie = name + '=;expires=' + expires + ';path=/;domain=' + domain;
            }
          }
        });
      } catch (e2) {}
      try {
        window.parent.postMessage({ type: 'PSEX_SITE_CLEARED' }, '*');
      } catch (e3) {}
    }

    window.addEventListener('message', function (evt) {
      var msg = evt.data || {};
      if (msg.type === 'PSEX_CAPTURE_AT_POINT') {
        captureAtPoint(msg.x, msg.y, null);
        return;
      }
      if (msg.type === 'PSEX_CLEAR_SITE') {
        clearSiteData();
        return;
      }
      if (msg.type === 'PSEX_CAPTURE_CONFIG') {
        if (typeof msg.enabled === 'boolean') scaleEnabled = msg.enabled;
        if (msg.maxSide && !isNaN(msg.maxSide)) MAX_RASTER_SIDE = Math.max(800, parseInt(msg.maxSide, 10));
        if (typeof msg.jpegEnabled === 'boolean') jpegEnabled = msg.jpegEnabled;
        if (!isNaN(msg.jpegQuality)) jpegQuality = Math.max(10, Math.min(100, parseInt(msg.jpegQuality, 10)));
        if (typeof msg.preferUrlCapture === 'boolean') preferUrlCapture = msg.preferUrlCapture;
        if (typeof msg.originalMode === 'boolean') originalMode = msg.originalMode;
        if (typeof msg.captureEnabled === 'boolean') captureEnabled = msg.captureEnabled;
        if (typeof msg.zoomEnabled === 'boolean') zoomEnabled = msg.zoomEnabled;
        if (msg.zoom && !isNaN(msg.zoom)) applyPageZoom(parseFloat(msg.zoom));
        if (!captureEnabled) {
          altPressed = false;
          applyCapturePointerStyle(false);
        }
        return;
      }
      if (msg.type === 'PSEX_PAGE_INFO_CONFIG') {
        if (typeof msg.enabled === 'boolean') pageInfoConfig.enabled = msg.enabled;
        if (typeof msg.timerEnabled === 'boolean') pageInfoConfig.timerEnabled = msg.timerEnabled;
        if (msg.interval && !isNaN(msg.interval)) pageInfoConfig.interval = Math.max(1000, parseInt(msg.interval, 10));
        startPageInfoTimer();
        if (pageInfoConfig.enabled) postPageInfo(true);
      }
      if (msg.type === 'PSEX_VIEW_MODE') {
        try {
          if (msg.mode === 'original') {
            if (!pureModeActive) applyPureMode();
          } else {
            if (pureModeActive) restorePureMode();
          }
        } catch (e2) {}
      }
    });

    document.addEventListener('contextmenu', function (e) {
      try {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
      } catch (err) {}
    }, true);

    function postPageInfo(force) {
      try {
        if (!pageInfoConfig.enabled && !force) return;
        window.parent.postMessage({
          type: 'PSEX_PAGE_INFO',
          title: document.title || '',
          host: location.host || location.hostname || '',
          url: location.href || ''
        }, '*');
      } catch (e) {}
    }

    function startPageInfoTimer() {
      try {
        if (pageInfoTimer) clearInterval(pageInfoTimer);
      } catch (e) {}
      pageInfoTimer = null;
      if (!pageInfoConfig.enabled || !pageInfoConfig.timerEnabled) return;
      var interval = pageInfoConfig.interval || 4000;
      pageInfoTimer = setInterval(function () {
        postPageInfo();
      }, interval);
    }

    function hookHistory() {
      try {
        var pushState = history.pushState;
        var replaceState = history.replaceState;
        if (pushState) {
          history.pushState = function () {
            var r = pushState.apply(this, arguments);
            postPageInfo();
            return r;
          };
        }
        if (replaceState) {
          history.replaceState = function () {
            var r = replaceState.apply(this, arguments);
            postPageInfo();
            return r;
          };
        }
        window.addEventListener('popstate', postPageInfo);
        window.addEventListener('hashchange', postPageInfo);
      } catch (e) {}
    }

    hookHistory();
    postPageInfo(true);
    setTimeout(function () { postPageInfo(true); }, 1000);
    startPageInfoTimer();
    ensureFlatScrollbar();
    ensureCaptureNoHoverTips();
  }

  // AI 初始化延迟到首次打开面板，提升启动速度
  setMode('browser');
  updateLayoutMode();
  syncState = getSyncSettings();
  applySyncSettings(syncState);
  scaleState = getScaleSettings();
  applyScaleSettings(scaleState);
  jpegState = getJpegSettings();
  applyJpegSettings(jpegState);
  pythonState = getPythonSettings();
  applyPythonSettings(pythonState);
  originalState = getOriginalSettings();
  applyOriginalSettings(originalState);
  viewState = getViewSettings();
  applyViewSettings(viewState);
  zoomState = getZoomSettings();
  initFavCollapse();
  initCaptureMode();
  sendPageInfoConfig();
  sendCaptureConfig();
  initUrls();
  renderRecentList(getRecentList());
  setTimeout(function () {
    openUrl();
  }, 0);
  setTimeout(function () {
    loadHostScript();
  }, 10);
})();
