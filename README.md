# 寻木·榫卯 (SeekWood) 🪵

> **中·国·古·建·筑·益·智·互·动·平·台**  
> 本项目专为 **计算机设计大赛** 打造，旨在通过 Web 3D 互动与 AI 技术，弘扬中国传统榫卯文化与古建筑智慧。

![Vue.js](https://img.shields.io/badge/Vue%203-3.5.32-4FC08D?style=flat-square&logo=vue.js)
![Three.js](https://img.shields.io/badge/Three.js-0.183.2-black?style=flat-square&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-8.0.4-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## 📖 项目背景与立意

榫卯（Mortise and Tenon）是中国古代建筑、家具及其它木制器械的主要结构方式，是中华民族几千年智慧的结晶。
《寻木·榫卯》将传统文化与现代前沿 Web 技术相结合，提供了一个集**学习、互动、拼装、修复**于一体的 3D 沉浸式体验平台。项目致力于让枯燥的理论知识“活”起来，让更多年轻人和古建爱好者能够直观地感受到传统木作的魅力。

## ✨ 核心功能 (Features)

1. **🧩 3D 榫卯互动拼装 (3D Assembly Challenge)**
   - 基于 `Three.js` 打造的物理空间交互。
   - 玩家可以全方位旋转、观察，并亲手将卯榫结构拼装在一起。
   - 拼装成功后即可解锁对应的榫卯结构，并收录至个人图鉴。

2. **🏛️ 造办处 - 古建筑修复 (Building Repair)**
   - 将收集到的榫卯结构应用到实际的古建筑（如：湖广会馆戏台、古风凉亭等）修复中。
   - 结合 AI 修复检测算法，实现榫卯结构与建筑受损部位的智能匹配。

3. **📖 榫卯图鉴 (Guidebook)**
   - 详细记录玩家收集的每一种榫卯结构（如直榫、燕尾榫、十字榫等）。
   - 提供丰富的图文科普，展示其历史渊源与力学原理。

4. **🤖 AI 伴学“问鲁班” (AI Assistant)**
   - 接入 AI 对话能力，化身古代工匠“鲁班”。
   - 玩家在拼装或游玩过程中遇到任何古建问题，都可以随时向 AI 提问，获取专业解答。

5. **🎵 沉浸式视听体验 (Immersive Audio)**
   - 包含精心设计的国风背景音乐与木材拼装的真实音效（`audioSystem.js`）。

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**：Vue 3 (Composition API, `<script setup>`) + Vite
- **3D 渲染引擎**：Three.js
- **状态管理**：基于 Vue 3 `reactive` 的轻量级本地化 Store，支持进度持久化 (localStorage)
- **样式方案**：纯 CSS3，结合过渡动画 (`<transition>`) 打造流畅 UI
- **AI 交互**：基于 Fetch 的轻量级大模型 API 接入机制 (`AIChatBox.vue`)


### 项目构建

```bash
# 构建生产环境代码
npm run build
```
构建完成的文件将输出到 `dist` 目录，可直接部署到 Vercel、GitHub Pages 或任意静态服务器。

## 📁 核心目录结构 (Directory Structure)

```text
SeekWood/
├── public/                # 静态资源 (音频、贴图、模型等)
│   ├── audio/             # 背景音乐与音效
│   └── images/            # UI 素材与场景背景图
├── src/                   # 源代码
│   ├── components/        # Vue 组件库
│   │   ├── AIChatBox.vue          # AI "问鲁班" 伴学组件
│   │   ├── AssemblyView.vue       # 自由拼装视图
│   │   ├── BuildingRepairView.vue # 造办处-古建修复视图
│   │   ├── GuideView.vue          # 榫卯图鉴视图
│   │   └── ThreeViewer.vue        # Three.js 核心渲染画布
│   ├── utils/             # 工具函数库
│   │   ├── aiRepairCheck.js       # AI 修复检测逻辑
│   │   ├── audioSystem.js         # 音频系统封装
│   │   └── threeHelpers.js        # Three.js 辅助类
│   ├── App.vue            # 根组件，控制游戏主流程与 UI 层级
│   ├── main.js            # Vue 应用入口
│   ├── store.js           # 轻量级全局响应式状态管理
│   └── style.css          # 全局样式与动画定义
└── package.json           # 项目配置与依赖
```


*“匠心独运，寻木榫卯。” —— 期待在计算机设计大赛中取得优异成绩！*🏆