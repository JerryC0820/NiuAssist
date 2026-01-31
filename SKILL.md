# 牛牛助手（ps-image-capture）技能说明

## 用途
用于 Photoshop 内的“网页浏览 + 图片采集 + 轻量 AI”流程，强调快速采集与直接入 PS。

## 核心能力
- 内置浏览器：打开网址、前进/后退/刷新、主页跳转。
- 收藏夹：手动收藏与备注，点击快速跳转。
- 采集插入：右键或 Alt+左键采集 IMG/SVG/CANVAS 到 PS。
- 大图处理：最大边压缩 + JPEG 质量控制（可选）。
- 网址同步：可手动/定时同步，保持地址栏和页面一致。
- 缩放记忆：Ctrl+滚轮缩放页面，缩放比例保存。
- 豆包内嵌：文本/图像/视频入口与模型管理（轻量版）。

## 关键文件
- `index.html`：主 UI 结构
- `css/style.css`：界面样式
- `js/main.js`：交互逻辑与采集脚本
- `jsx/host.jsx`：PS 端插入与图层操作
- `CSXS/manifest.xml`：面板尺寸/图标

## 常用调整项
- 面板默认尺寸：`CSXS/manifest.xml` 的 Width/Height
- 采集压缩默认值：`js/main.js` 默认参数
- 网址默认主页：`js/main.js` 的 homeUrl

