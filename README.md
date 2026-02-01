# 牛牛助手 (NiuAssist)

> Photoshop CEP 扩展：网页浏览/采集 + 豆包 AI 面板（图像生成、文本助手、模型配置、历史/预览）。

<div align="center">
  <img src="https://img.shields.io/badge/platform-Windows-0078D4?style=flat-square" />
  <img src="https://img.shields.io/badge/Photoshop-CEP-1E1E1E?style=flat-square" />
  <img src="https://img.shields.io/badge/feature-Python%20Transcode-00B894?style=flat-square" />
  <img src="https://img.shields.io/badge/insert-Quick%20Insert-2EA7FF?style=flat-square" />
</div>

<div align="center">
  <a href="#-功能亮点">功能亮点</a> ·
  <a href="#-豆包-ai-助手">豆包 AI 助手</a> ·
  <a href="#-安装">安装</a> ·
  <a href="#-使用">使用</a> ·
  <a href="#-python-转码依赖">Python 依赖</a> ·
  <a href="#-缓存目录">缓存目录</a>
</div>

---

## ✨ 功能亮点

<table>
  <tr>
    <td>🌐 <b>浏览器面板</b><br/>内置网址输入、收藏夹、最近访问</td>
    <td>🖱️ <b>采集模式</b><br/>右键 / Alt+左键采集 IMG/SVG/CANVAS/背景图</td>
    <td>⚡ <b>快速插入</b><br/>采集后自动插入 PS 文档</td>
  </tr>
  <tr>
    <td>🐍 <b>Python 转码</b><br/>大图下载后转码插入，降低卡顿</td>
    <td>🧊 <b>原图模式</b><br/>PNG 不缩放，保留清晰度</td>
    <td>🧵 <b>压缩控制</b><br/>JPG 质量/最大边可调</td>
  </tr>
  <tr>
    <td>🤖 <b>豆包 AI</b><br/>图像生成/文本助手/模型配置</td>
    <td>🧩 <b>功能选择</b><br/>方块化功能选择器，清晰直观</td>
    <td>🖼️ <b>多图结果</b><br/>多图预览/选中插入/进度显示</td>
  </tr>
  <tr>
    <td>🧭 <b>历史记录</b><br/>历史可随时打开/预览/定位本地</td>
    <td>🔎 <b>预览增强</b><br/>滚轮缩放/拖拽/最大化/提示词复制</td>
    <td>📁 <b>本地缓存</b><br/>图片落盘，插入更顺滑</td>
  </tr>
</table>

---

## 🤖 豆包 AI 助手
- 内置豆包 AI 面板：图像生成 + 文本助手。
- 文本助手支持改写/翻译/关键词与标题生成，并可插入 PS 文本层。
- 可配置自定义模型与接口地址，适配不同需求。

---

## 🧩 适用人群
- 需要从网页快速采集素材的设计师
- 需要在 PS 内完成素材整理的电商/运营
- 处理大图卡顿、希望更顺滑插入的用户

---

## 📦 安装
1. 复制 `NiuAssist` 到：
   `C:\Users\<用户名>\AppData\Roaming\Adobe\CEP\extensions\NiuAssist`
2. 重启 Photoshop。

### 未签名扩展（首次需要）
开启 CEP 调试模式（PowerShell 管理员或普通权限均可）：
```
reg add HKCU\Software\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f
reg add HKCU\Software\Adobe\CSXS.12 /v PlayerDebugMode /t REG_SZ /d 1 /f
```
然后重启 Photoshop。

### 终端快速安装（可选）
```
robocopy "D:\AI-Code\项目开发-JERRY&Codex\PSEX_APP\插件文件-codex\NiuAssist" "C:\Users\<用户名>\AppData\Roaming\Adobe\CEP\extensions\NiuAssist" /MIR
```

---

## 🚀 使用
- 输入网址后点“前往”。
- 开启“采集素材模式”，右键或 Alt+左键采集。
- 大图建议勾选“Python 转码”，需要清晰度时勾选“原图模式”。
- 文本助手：填写输入内容 → 点击“立即生成” → 需要时点“插入PS文本层”。
- 豆包历史：结果区“历史”可随时查看与预览（支持复制提示词/打开本地）。

---

## 🐍 Python 转码依赖
本机需安装 Python + Pillow：
```
python -m pip install pillow
```

---

## 🗂️ 缓存目录
默认缓存目录使用 CEP 返回的 APPDATA 位置（不同机器可能不同）：
`<APPDATA>\NiuAssistCache`  
（以实际系统返回为准，部分环境可能映射到 Photoshop 安装目录附近）

其中：
- `images/` 图片缓存
- `meta/` 元数据
- `text/` 文本历史

> 注：不同机器/环境下 APPDATA 可能被 CEP 指向到不同路径（以实际系统返回为准）。

---

## 🖼️ 截图
（稍后补充）

---

## 📜 免责声明
本插件仅用于便捷插入素材，不支持去除水印，请尊重版权。
