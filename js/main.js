(function () {
  'use strict';

  var cs = new CSInterface();
  var SystemPath = CSInterface.SystemPath || window.SystemPath;
  var extPath = cs.getSystemPath(SystemPath.EXTENSION);

  var DEFAULT_URL = 'https://www.iconfont.cn/?spm=a313x.search_index.i3.d4d0a486a.74c03a81eM2SiP';
  var STORAGE_KEY = 'psex_saved_urls';
  var LAST_URL_KEY = 'psex_last_url';
  var SYNC_STORAGE_KEY = 'psex_page_sync';
  var SYNC_MIGRATE_KEY = 'psex_sync_migrated_20260131';
  var SCALE_STORAGE_KEY = 'psex_scale_insert';
  var JPEG_STORAGE_KEY = 'psex_jpeg_insert';
  var PY_STORAGE_KEY = 'psex_python_transcode';
  var ORIG_STORAGE_KEY = 'psex_original_mode';
  var ZOOM_STORAGE_KEY = 'psex_page_zoom';
  var RECENT_STORAGE_KEY = 'psex_recent_urls';
  var RECENT_MAX = 8;
  var ZOOM_DEFAULT = 1.1;
  var AI_STORAGE_KEY = 'niu_ai_settings';
  var AI_MODEL_KEY = 'niu_ai_models';
  var AI_MODEL_VERSION = '2026-01-30-full';
  var SYNC_DEFAULTS = { enabled: false, interval: 4, timerEnabled: false };
  var SCALE_DEFAULTS = { enabled: true, maxSide: 3000 };
  var JPEG_DEFAULTS = { enabled: false, quality: 85 };
  var PY_DEFAULTS = { enabled: false };
  var ORIG_DEFAULTS = { enabled: false };
  var AI_IMAGE_SIZES_DEFAULT = [
    '1:1',
    '4:3',
    '3:4',
    '16:9',
    '9:16',
    '2:3',
    '3:2'
  ];
  var AI_IMAGE_SIZES_LARGE = AI_IMAGE_SIZES_DEFAULT.slice();
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
  var AI_DEFAULTS = {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/',
    apiKey: '',
    type: 'image',
    tier: 'all',
    imageSize: '1:1',
    imageSizeMode: 'preset',
    imageCount: 1,
    imageUseLayer: false,
    imageInsertMode: 'insert',
    textTask: 'rewrite',
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
  var aiKeyInput = document.getElementById('aiKey');
  var aiBaseUrlInput = document.getElementById('aiBaseUrl');
  var aiSaveBtn = document.getElementById('aiSaveBtn');
  var aiTypeSelect = document.getElementById('aiType');
  var aiTierSelect = document.getElementById('aiTier');
  var aiModelSelect = document.getElementById('aiModelSelect');
  var aiModelManageBtn = document.getElementById('aiModelManage');
  var aiModelPanel = document.getElementById('aiModelPanel');
  var aiModelListInput = document.getElementById('aiModelList');
  var aiModelSaveBtn = document.getElementById('aiModelSave');
  var aiModelResetBtn = document.getElementById('aiModelReset');
  var aiModelCustomInput = document.getElementById('aiModelCustom');
  var aiModelCustomRow = aiModelCustomInput ? aiModelCustomInput.parentElement : null;
  var aiImageSizeSelect = document.getElementById('aiImageSizeSelect');
  var aiImageSizeCustomInput = document.getElementById('aiImageSizeCustom');
  var aiImageCountInput = document.getElementById('aiImageCount');
  var aiUseLayerInput = document.getElementById('aiUseLayer');
  var aiImageInsertModeSelect = document.getElementById('aiImageInsertMode');
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
  var syncToggle = document.getElementById('syncToggle');
  var syncTimerToggle = document.getElementById('syncTimerToggle');
  var syncIntervalInput = document.getElementById('syncInterval');
  var scaleToggle = document.getElementById('scaleToggle');
  var scaleMaxInput = document.getElementById('scaleMax');
  var jpegToggle = document.getElementById('jpegToggle');
  var jpegQualityInput = document.getElementById('jpegQuality');
  var pyToggle = document.getElementById('pyToggle');
  var origToggle = document.getElementById('origToggle');
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
  var zoomState = { value: 1 };
  var captureModeEnabled = true;
  var navHistory = [];
  var navIndex = -1;
  var lastGoodUrl = '';
  var lastErrorUrl = '';

  var nodeRequire = (typeof window !== 'undefined' && window.require) ? window.require : null;
  var pythonBusy = false;
  var pythonExecCache = '';
  var captureBusyCount = 0;

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

  var isUpdatingSizeOptions = false;

  function refreshImageSizeOptions(modelId) {
    if (!aiImageSizeSelect) return;
    var list = getImageSizeListForModel(modelId);
    var current = resolveImageSize(aiState || {}) || '';
    isUpdatingSizeOptions = true;
    aiImageSizeSelect.innerHTML = '';
    list.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      aiImageSizeSelect.appendChild(opt);
    });
    var customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '自定义';
    aiImageSizeSelect.appendChild(customOpt);
    var hasCurrent = list.indexOf(current) !== -1;
    if (hasCurrent) {
      aiImageSizeSelect.value = current;
      if (aiImageSizeCustomInput) aiImageSizeCustomInput.classList.add('hidden');
      aiImageSizeSelect.classList.remove('hidden');
    } else {
      aiImageSizeSelect.value = list[0];
      if (aiImageSizeCustomInput) aiImageSizeCustomInput.classList.add('hidden');
      aiImageSizeSelect.classList.remove('hidden');
      if (aiState) {
        aiState.imageSize = list[0];
        aiState.imageSizeMode = 'preset';
        saveAiSettings(aiState);
      }
    }
    isUpdatingSizeOptions = false;
  }

  function updateImageSizeUI() {
    if (!aiState) return;
    var modelId = getSelectedModelId(aiState);
    refreshImageSizeOptions(modelId);
    if (!aiImageSizeSelect || !aiImageSizeCustomInput) return;
    var size = aiState.imageSize || AI_DEFAULTS.imageSize;
    var mode = aiState.imageSizeMode || 'preset';
    var list = getImageSizeListForModel(modelId);
    var hasPreset = list.indexOf(size) !== -1;
    if (mode === 'custom' || !hasPreset) {
      aiImageSizeSelect.value = '__custom__';
      aiImageSizeCustomInput.classList.remove('hidden');
      aiImageSizeSelect.classList.add('hidden');
      aiImageSizeCustomInput.value = size;
    } else {
      aiImageSizeSelect.value = size;
      aiImageSizeCustomInput.classList.add('hidden');
      aiImageSizeSelect.classList.remove('hidden');
    }
  }

  function applyAiSettings(settings) {
    if (!settings) return;
    if (aiBaseUrlInput) aiBaseUrlInput.value = settings.baseUrl || '';
    if (aiKeyInput) aiKeyInput.value = settings.apiKey || '';
    if (aiTypeSelect) aiTypeSelect.value = settings.type || 'image';
    aiState.type = aiTypeSelect ? aiTypeSelect.value : (settings.type || 'image');
    setAiType(aiState.type);
    updateTierOptions();
    if (aiTierSelect && settings.tier) aiTierSelect.value = settings.tier;
    if (aiTierSelect) aiState.tier = aiTierSelect.value;
    updateModelOptions();
    if (aiImageCountInput) aiImageCountInput.value = settings.imageCount || 1;
    if (aiUseLayerInput) aiUseLayerInput.checked = !!settings.imageUseLayer;
    if (aiImageInsertModeSelect) aiImageInsertModeSelect.value = settings.imageInsertMode || 'insert';
    if (aiTextTaskSelect) aiTextTaskSelect.value = settings.textTask || 'rewrite';
    updateImageSizeUI();
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
    if (aiTextTaskSelect) aiState.textTask = aiTextTaskSelect.value || 'rewrite';
    if (aiImageSizeSelect) {
      if (aiImageSizeSelect.value === '__custom__') {
        aiState.imageSizeMode = 'custom';
        aiState.imageSize = (aiImageSizeCustomInput && aiImageSizeCustomInput.value || '').trim();
      } else {
        aiState.imageSizeMode = 'preset';
        aiState.imageSize = aiImageSizeSelect.value;
      }
    }
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

  function getActiveLayerDataUrl(cb) {
    if (!cb) return;
    var script = 'psexCapture_exportActiveLayerToDataUrl();';
    cs.evalScript(script, function (res) {
      if (!res || typeof res !== 'string') {
        cb(null, '无法读取选中图层。');
        return;
      }
      if (res.indexOf('error:') === 0) {
        var detail = res.replace(/^error:/, '') || '读取失败';
        if (detail === 'bounds') detail = '读取图层范围失败';
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
      if (res === 'no_size') {
        cb(null, '选中图层没有可用像素。');
        return;
      }
      if (res.indexOf('data:') !== 0) {
        cb(null, '选中图层导出异常。');
        return;
      }
      cb(res, '');
    });
  }

  function clearAiResult() {
    if (aiResultEl) aiResultEl.innerHTML = '';
  }

  function renderAiResult(items, type) {
    if (!aiResultEl) return;
    aiResultEl.innerHTML = '';
    if (!items || !items.length) {
      var empty = document.createElement('div');
      empty.className = 'ai-text';
      empty.textContent = '暂无结果';
      aiResultEl.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'ai-card';
      var text = document.createElement('div');
      text.className = 'ai-text';
      text.textContent = item.label || item.url || '结果';
      if (type === 'image') {
        var img = document.createElement('img');
        img.className = 'ai-thumb';
        img.src = item.url;
        card.appendChild(img);
      }
      card.appendChild(text);
      var actions = document.createElement('div');
      actions.className = 'ai-actions';
      if (type === 'image') {
        var insertMode = aiState && aiState.imageInsertMode === 'replace' ? 'replace' : 'insert';
        var insertBtn = document.createElement('button');
        insertBtn.textContent = insertMode === 'replace' ? '替换图层' : '插入PS';
        insertBtn.addEventListener('click', function () {
          fetchToDataUrl(item.url, function (dataUrl) {
            if (!dataUrl) return;
            processDataUrlForInsert(dataUrl, {}, function (processedUrl, info) {
              var notes = [];
              if (info && info.scaled) notes.push('已自动压缩大图');
              if (info && info.jpeg) notes.push('已启用JPG压缩');
              if (notes.length) setAiStatus(notes.join('，') + '后插入。', 'ok');
              if (insertMode === 'replace') replaceDataUrlInPs(processedUrl);
              else insertDataUrlToPs(processedUrl);
            });
          });
        });
        actions.appendChild(insertBtn);
      } else {
        var openBtn2 = document.createElement('button');
        openBtn2.textContent = '打开';
        openBtn2.addEventListener('click', function () {
          if (item.url) {
            try { browser.src = item.url; } catch (e) {}
          }
        });
        actions.appendChild(openBtn2);
      }
      card.appendChild(actions);
      aiResultEl.appendChild(card);
    });
  }

  function extractImageResults(resp) {
    var out = [];
    if (!resp) return out;
    var data = resp.data || resp.images || resp.result || resp;
    if (Array.isArray(data)) {
      data.forEach(function (it) {
        if (it && it.url) out.push({ url: it.url });
        if (it && it.b64_json) out.push({ url: 'data:image/png;base64,' + it.b64_json });
      });
    } else if (data && data.url) {
      out.push({ url: data.url });
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
    if (aiImageSizeCustomInput && !aiImageSizeCustomInput.classList.contains('hidden')) {
      var customVal = (aiImageSizeCustomInput.value || '').trim();
      if (customVal) {
        if (customVal.indexOf(':') !== -1) return '';
        return customVal;
      }
    }
    if (aiImageSizeSelect) {
      var val = aiImageSizeSelect.value;
      if (val === '__custom__') {
        val = (aiImageSizeCustomInput && aiImageSizeCustomInput.value || '').trim();
      }
      if (val && String(val).indexOf(':') !== -1) return '';
      return val;
    }
    var fallback = (settings.imageSize || '').trim();
    if (fallback && fallback.indexOf(':') !== -1) return '';
    return fallback;
  }

  function parseSize(size) {
    if (!size) return null;
    var m = String(size).toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/);
    if (!m) return null;
    var w = parseInt(m[1], 10);
    var h = parseInt(m[2], 10);
    if (!w || !h) return null;
    return { w: w, h: h, pixels: w * h };
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

  function enforceMinPixelsForModel(modelId, size) {
    var id = (modelId || '').toLowerCase();
    if (id.indexOf('seedream-4-5') === -1) return size;
    var info = parseSize(size);
    if (!info) return size;
    var minPixels = 3686400;
    if (info.pixels >= minPixels) return size;
    var fallback = getImageSizeListForModel(modelId)[0] || '2560x1440';
    if (aiImageSizeSelect) {
      refreshImageSizeOptions(modelId);
      var has = Array.prototype.some.call(aiImageSizeSelect.options, function (opt) {
        return opt.value === fallback;
      });
      if (has) {
        aiImageSizeSelect.value = fallback;
        if (aiImageSizeCustomInput) aiImageSizeCustomInput.classList.add('hidden');
      } else {
        aiImageSizeSelect.value = '__custom__';
        if (aiImageSizeCustomInput) {
          aiImageSizeCustomInput.value = fallback;
          aiImageSizeCustomInput.classList.remove('hidden');
        }
      }
    }
    if (aiState) {
      aiState.imageSize = fallback;
      var list = getImageSizeListForModel(modelId);
      aiState.imageSizeMode = list.indexOf(fallback) !== -1 ? 'preset' : 'custom';
      saveAiSettings(aiState);
    }
    setAiStatus('已自动调整为 ' + fallback + '（即梦4.5 最小像素要求）。', 'err');
    return fallback;
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
    var size = resolveImageSize(settings);
    var sizeNote = '';
    var originalSize = size || '';
    size = enforceMinPixelsForModel(modelId, size);
    if (originalSize && size && originalSize !== size) {
      sizeNote = '尺寸已调整为 ' + size;
    }
    var count = settings.imageCount || 1;
    if (count < 1) count = 1;
    if (count > 4) count = 4;
    var doRequest = function (imageDataUrl) {
      var payload = { model: modelId, prompt: prompt };
      if (size) payload.size = size;
      if (count) payload.n = count;
      if (imageDataUrl) payload.image = imageDataUrl;
      setAiStatus('正在生成图像...', '');
      clearAiResult();
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
      if (!items.length) {
        setAiStatus('生成失败：未返回结果。', 'err');
        return;
      }
      renderAiResult(items, 'image');
      if (sizeNote) {
        setAiStatus('生成完成（' + sizeNote + '）。', 'ok');
      } else {
        setAiStatus('生成完成。', 'ok');
      }
      checkReturnedImageSize(items, originalSize || size);
    });
    };

    if (settings.imageUseLayer) {
      setAiStatus('正在读取选中图层...', '');
      getActiveLayerDataUrl(function (dataUrl, errMsg) {
        if (!dataUrl) {
          setAiStatus('获取选中图层失败：' + (errMsg || '请确认已选中图层。'), 'err');
          return;
        }
        doRequest(dataUrl);
      });
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
    var right = Math.max(10, window.innerWidth - rect.right);
    bookmarkPanel.style.top = top + 'px';
    bookmarkPanel.style.right = right + 'px';
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
    });
    browser.addEventListener('focus', function () {
      maybeCloseBookmarkPanel(browser);
    });
  }

  window.addEventListener('resize', function () {
    if (bookmarkPanel && bookmarkPanel.classList.contains('open')) {
      positionBookmarkPanel();
    }
    if (aiPanel && aiPanel.classList.contains('open')) {
      positionAiPanel();
    }
    if (appMenu && appMenu.classList.contains('open')) {
      positionAppMenu();
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
    });
  }

  if (aiTypeSelect) {
    aiTypeSelect.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.type = aiTypeSelect.value;
      setAiType(aiState.type);
      updateTierOptions();
      updateModelOptions();
      if (aiState.type === 'image') refreshImageSizeOptions(getSelectedModelId(aiState));
      saveAiSettings(aiState);
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

  if (aiImageSizeSelect) {
    aiImageSizeSelect.addEventListener('change', function () {
      if (!aiState) aiState = getAiSettings();
      if (aiImageSizeSelect.value === '__custom__') {
        if (isUpdatingSizeOptions) return;
        aiState.imageSizeMode = 'custom';
        if (aiImageSizeCustomInput) aiImageSizeCustomInput.classList.remove('hidden');
        aiImageSizeSelect.classList.add('hidden');
        aiState.imageSize = (aiImageSizeCustomInput && aiImageSizeCustomInput.value || '').trim();
      } else {
        if (isUpdatingSizeOptions) return;
        aiState.imageSizeMode = 'preset';
        aiState.imageSize = aiImageSizeSelect.value;
        if (aiImageSizeCustomInput) aiImageSizeCustomInput.classList.add('hidden');
        aiImageSizeSelect.classList.remove('hidden');
      }
      saveAiSettings(aiState);
    });
  }

  if (aiImageSizeCustomInput) {
    aiImageSizeCustomInput.addEventListener('input', function () {
      if (!aiState) aiState = getAiSettings();
      aiState.imageSizeMode = 'custom';
      aiState.imageSize = aiImageSizeCustomInput.value.trim();
      saveAiSettings(aiState);
    });
    aiImageSizeCustomInput.addEventListener('blur', function () {
      var val = (aiImageSizeCustomInput.value || '').trim();
      if (!val) {
        aiImageSizeCustomInput.classList.add('hidden');
        if (aiImageSizeSelect) {
          aiImageSizeSelect.classList.remove('hidden');
          aiImageSizeSelect.value = getImageSizeListForModel(getSelectedModelId(aiState))[0] || '1:1';
        }
        if (aiState) {
          aiState.imageSizeMode = 'preset';
          aiState.imageSize = aiImageSizeSelect ? aiImageSizeSelect.value : '1:1';
          saveAiSettings(aiState);
        }
      }
    });
  }

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

  document.addEventListener('mousedown', function (e) {
    if (aiModelPanel && aiModelPanel.classList.contains('open')) {
      if (!aiModelPanel.contains(e.target) && !(aiModelManageBtn && aiModelManageBtn.contains(e.target))) {
        aiModelPanel.classList.remove('open');
      }
    }
    if (currentMode === 'ai') return;
    if (!aiPanel || !aiPanel.classList.contains('open')) return;
    if (aiPanel.contains(e.target)) return;
    if (aiBtn && aiBtn.contains(e.target)) return;
    showAiPanel(false);
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
          '*::-webkit-scrollbar{width:6px!important;height:6px!important;}',
          '*::-webkit-scrollbar-track{background:transparent!important;}',
          '*::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.28)!important;border-radius:999px!important;border:2px solid transparent!important;background-clip:content-box!important;}',
          '*::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.4)!important;background-clip:content-box!important;}',
          '::-webkit-scrollbar-corner{background:transparent!important;}',
          'html{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.35) transparent;}'
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
          '[class*=\"hover\"]',
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
            'img,svg,canvas,video{pointer-events:auto!important;}'
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
      window.parent.postMessage({ type: 'PSEX_CAPTURE', dataUrl: dataUrl, meta: meta || {} }, '*');
    }

    function postCaptureUrl(url, meta) {
      window.parent.postMessage({ type: 'PSEX_CAPTURE_URL', url: url, meta: meta || {} }, '*');
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
            var sym = svgEl.ownerDocument.getElementById(href.slice(1));
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

    function handleCapture(target) {
      if (!canCaptureNow()) return;
      if (!target || !target.tagName) {
        postError('未找到可用图片。');
        return;
      }
      var tag = target.tagName.toUpperCase();
      if (tag === 'IMG') {
        var src = target.currentSrc || target.src;
        if (!src) {
          postError('图片没有地址。');
          return;
        }
        if (src.indexOf('data:') === 0) {
          postDataUrl(src);
          return;
        }
        if (preferUrlCapture && isRasterUrl(src) && src.indexOf('http') === 0) {
          postCaptureUrl(src, { referer: location.href || '', title: document.title || '' });
          return;
        }
        urlToDataUrl(src, function (dataUrl, meta) {
          if (!dataUrl) postError('获取图片失败。');
          else postDataUrl(dataUrl, meta);
        });
        return;
      }
      if (tag === 'SVG') {
        svgToDataUrlAsync(target, function (svgUrl) {
          if (!svgUrl) postError('解析 SVG 失败。');
          else postDataUrl(svgUrl);
        });
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

    function pickLargestFromList(list) {
      return pickLargest(list);
    }

    function pickLargestIconInCard(card) {
      if (!card || !card.querySelectorAll) return null;
      var nodes = card.querySelectorAll('svg, img, canvas');
      var candidates = nodes && nodes.length ? Array.prototype.slice.call(nodes) : [];
      if (candidates.length) return pickLargestFromList(candidates);
      var icons = card.querySelectorAll('i, span');
      var iconCandidates = [];
      if (icons && icons.length) {
        icons.forEach(function (node) {
          if (isIconFontCandidate(node)) iconCandidates.push(node);
        });
      }
      if (iconCandidates.length) return pickLargestFromList(iconCandidates);
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
      if (!card || !card.querySelectorAll) return null;
      var nodes = card.querySelectorAll('svg, img, canvas, i, span');
      var list = nodes && nodes.length ? Array.prototype.slice.call(nodes) : [];
      if (!list.length) return null;
      var inside = list.filter(function (el) {
        if (!el || !el.tagName) return false;
        var tag = el.tagName.toUpperCase();
        if (tag === 'I' || tag === 'SPAN') {
          return isIconFontCandidate(el) && containsPoint(el, x, y);
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
        list = list.filter(function (el) { return !isOverlayNode(el); });
      }
      try {
        if (location && location.host && location.host.indexOf('iconfont') !== -1 && list && list.length) {
          var i;
          for (i = 0; i < list.length; i++) {
            var card = findIconfontCard(list[i]);
            if (card) {
              var bestInCard = pickNearestIconInCard(card, x, y) || pickLargestIconInCard(card);
              if (bestInCard) return bestInCard;
            }
          }
        }
      } catch (e) {}
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


    function handleRightMouse(e) {
      if (!captureEnabled) return;
      if (e.button !== 2) return;
      try {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      } catch (err) {}
      var t = getTargetAtPoint(e.clientX, e.clientY) || findTarget(e.target) || e.target;
      if (t) handleCapture(t);
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
      var t = getTargetAtPoint(e.clientX, e.clientY) || findTarget(e.target) || e.target;
      if (t) handleCapture(t);
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
        var t = getTargetAtPoint(msg.x, msg.y);
        if (t) handleCapture(t);
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
    if (typeof msg.captureEnabled === 'boolean') captureEnabled = msg.captureEnabled;
        if (typeof msg.zoomEnabled === 'boolean') zoomEnabled = msg.zoomEnabled;
        if (msg.zoom && !isNaN(msg.zoom)) applyPageZoom(parseFloat(msg.zoom));
        return;
      }
      if (msg.type === 'PSEX_PAGE_INFO_CONFIG') {
        if (typeof msg.enabled === 'boolean') pageInfoConfig.enabled = msg.enabled;
        if (typeof msg.timerEnabled === 'boolean') pageInfoConfig.timerEnabled = msg.timerEnabled;
        if (msg.interval && !isNaN(msg.interval)) pageInfoConfig.interval = Math.max(1000, parseInt(msg.interval, 10));
        startPageInfoTimer();
        if (pageInfoConfig.enabled) postPageInfo(true);
      }
    });

    document.addEventListener('contextmenu', function (e) {
      if (!captureEnabled) return;
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

  aiModels = getModelList();
  aiState = getAiSettings();
  applyAiSettings(aiState);
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
  zoomState = getZoomSettings();
  initFavCollapse();
  initCaptureMode();
  sendPageInfoConfig();
  sendCaptureConfig();
  setMode('browser');
  initUrls();
  renderRecentList(getRecentList());
  openUrl();
  loadHostScript();
})();
