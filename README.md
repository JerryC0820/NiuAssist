# 牛牛助手 (NiuAssist)

面向 Photoshop 的 CEP 扩展浏览器/采集工具，提供网页浏览、素材采集、压缩/转码与快速插入。

## 功能简介
- 浏览器面板：内置网址输入、收藏夹、最近访问。
- 采集模式：右键或 Alt + 左键采集图片（IMG/SVG/CANVAS/背景图）。
- Python 转码：大图下载后转码并插入，降低卡顿。
- 原图模式：保留清晰度（PNG、不缩放）。
- JPG 压缩：可控质量，降低文件体积。
- 智能历史：回退/前进避免错误页。

## 安装
1. 复制 `ps-image-capture` 到  
   `C:\Users\<用户名>\AppData\Roaming\Adobe\CEP\extensions\ps-image-capture`
2. 重启 Photoshop。

## 使用
- 输入网址后点“前往”。
- 开启“采集素材模式”，在网页上右键或 Alt+左键采集。
- 大图建议开启“Python 转码”，必要时勾选“原图模式”。

## Python 转码依赖
本机需安装 Python + Pillow：
```
python -m pip install pillow
```

## 截图
（稍后补充）

## 免责声明
本插件仅用于便捷插入素材，不支持去除水印，请尊重版权。
