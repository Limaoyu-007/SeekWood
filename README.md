# 寻木·榫卯 (SeekWood) 🪵

> **中·国·古·建·筑·益·智·互·动·平·台**  
> 本项目专为 **计算机设计大赛** 打造，旨在通过 Web 3D 互动与大模型（LLM）技术，弘扬中国传统榫卯文化与古建筑智慧。

![Vue.js](https://img.shields.io/badge/Vue%203-3.5.32-4FC08D?style=flat-square&logo=vue.js)
![Three.js](https://img.shields.io/badge/Three.js-0.183.2-black?style=flat-square&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-8.0.4-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## 📖 1. 项目简介 (Project Introduction)

榫卯（Mortise and Tenon）是中国古代建筑、家具及其它木制器械的主要结构方式，是中华民族几千年智慧的结晶。无需一根铁钉，不施一滴胶水，却能历经千年风雨而不倒。

**《寻木·榫卯》(SeekWood)** 将传统文化与现代前沿 Web 技术深度融合，提供了一个集**学习、互动、拼装、修复**于一体的沉浸式体验平台。项目致力于让枯燥的理论知识“活”起来，让更多年轻人和古建爱好者能够直观地感受到传统木作的魅力与力学之美。

---

## ✨ 2. 功能特性 (Features)

本项目包含四大核心功能模块与一个沉浸式系统：

1. **🧩 3D 榫卯互动拼装 (3D Assembly Challenge)**
   - **核心引擎**：基于 `Three.js` 打造的物理空间交互。
   - **交互体验**：玩家可以全方位旋转（右键/滚轮）、观察，并亲手将卯榫结构（如直榫、燕尾榫、十字搭接、霸王枨等）拼装在一起。支持键盘快捷键（R/E）旋转构件。
   - **动态提示**：系统根据不同类型的榫卯动态提供专属的核心操作技巧和引导（Level Hints）。
2. **🏛️ 造办处 - 古建筑修复 (Building Repair)**
   - **应用实战**：将收集到的榫卯结构应用到实际的古建筑（如：湖广会馆戏台、古风凉亭、屏风门等）修复中。
   - **AI 判错反馈**：当玩家选择错误的榫卯结构时，系统会调用 AI 大模型，化身古代工匠指出该构件在当前受力环境下的不足，提供极具沉浸感的古风教学反馈。
3. **🤖 AI 伴学“问鲁班” (AI Assistant)**
   - **随时答疑**：接入大模型 API，化身古代工匠“鲁班大师”。玩家在拼装或游玩过程中遇到任何古建问题，都可以随时向 AI 提问，获取专业解答。
4. **📖 榫卯图鉴 (Guidebook)**
   - **知识百科**：详细记录玩家收集的每一种榫卯结构，提供丰富的图文科普，展示其历史渊源、制作工具与力学原理。
5. **🎵 沉浸式视听体验 (Immersive Audio)**
   - **音效系统**：内置定制的国风背景音乐与木材拼装真实的“咔哒”物理扣合音效，利用 Web Audio API 实现细腻的交互反馈。

---

## ⚙️ 3. 环境依赖 (Environment Dependencies)

在运行本项目之前，请确保您的开发环境满足以下要求：

- **Node.js**: `v18.0.0` 或更高版本（推荐使用 LTS 版本）
- **npm**: `v8.0.0` 或更高版本（或使用 `yarn` / `pnpm`）
- **现代浏览器**: 支持 WebGL 2.0 与 ES6 Module 的现代浏览器（如 Chrome, Edge, Firefox, Safari 最新版）

---

## 🚀 4. 安装与运行步骤 (Installation & Run)

### 4.1 克隆项目
```bash
git clone https://github.com/your-username/seekwood.git
cd seekwood
```

### 4.2 安装依赖
```bash
npm install
# 或者使用 yarn / pnpm
# yarn install
# pnpm install
```

### 4.3 启动本地开发服务器
```bash
npm run dev
```
启动成功后，控制台会输出本地访问地址（通常为 `http://localhost:5173`）。在浏览器中打开该地址即可体验。

### 4.4 生产环境构建
```bash
npm run build
```
构建完成后，生成的静态文件将存放在 `dist` 目录中，可直接部署到 Nginx、Vercel、GitHub Pages 等静态服务器上。

---

## 🔧 5. 配置说明 (Configuration)

本项目接入了 AI 大模型能力（用于“问鲁班”与修复判错反馈），需要在本地配置环境变量才能正常调用 AI 接口。

1. 在项目根目录下创建一个 `.env` 文件（请勿将其提交到版本控制库中）。
2. 在 `.env` 文件中添加以下配置项：

```env
# AI 接口密钥 (必填)
VITE_AI_API_KEY=your_api_key_here

# AI 接口基础地址 (如使用 OpenAI 兼容接口，需填入对应的 baseURL，默认指向 deepseek)
VITE_AI_API_URL=https://api.deepseek.com/v1/chat/completions

# AI 模型名称 (默认使用 deepseek-chat)
VITE_AI_MODEL=deepseek-chat
```
*注：目前项目代码支持任何兼容 OpenAI 消息格式（`role/content`）的大模型 API。*

---

## 📁 6. 目录结构 (Directory Structure)

```text
SeekWood/
├── public/                     # 静态资源目录 (不需要被打包构建的资源)
│   ├── audio/                  # 音频文件 (Bgm.mp3, snap.mp3)
│   ├── images/                 # 场景背景图、全景图与 UI 素材
│   ├── favicon.svg             # 网站图标
│   └── icons.svg               # SVG 图标精灵图
├── src/                        # 源代码核心目录
│   ├── assets/                 # 需要经过构建工具处理的静态资源
│   ├── components/             # Vue 组件库
│   │   ├── AIChatBox.vue           # 💬 AI "问鲁班" 伴学浮窗组件
│   │   ├── AssemblyView.vue        # 🧩 自由拼装探索视图
│   │   ├── BuildingRepairView.vue  # 🏛️ 造办处-古建修复实战视图
│   │   ├── GuideView.vue           # 📖 榫卯图鉴百科视图
│   │   ├── ThreeLevelFactory.js    # 🏭 3D 关卡工厂 (负责生成各关卡模型数据)
│   │   └── ThreeViewer.vue         # 🧊 Three.js 核心 3D 渲染与交互组件
│   ├── utils/                  # 工具函数与核心逻辑库
│   │   ├── aiRepairCheck.js        # 🧠 AI 修复检测与 Prompt 生成逻辑
│   │   ├── audioSystem.js          # 🎵 统一音频管理器 (Web Audio API)
│   │   └── threeHelpers.js         # 🛠️ Three.js 材质、灯光与几何体辅助函数
│   ├── App.vue                 # 根组件，控制主路由与 UI 层级叠加
│   ├── main.js                 # Vue 应用入口文件
│   ├── store.js                # 📦 轻量级全局状态管理 (基于 Vue reactive + localStorage)
│   └── style.css               # 全局样式与过渡动画定义
├── index.html                  # HTML 模板入口
├── package.json                # 项目配置文件与依赖清单
├── vite.config.js              # Vite 构建配置
└── README.md                   # 项目说明文档 (本文档)
```

---

## 🧠 7. 核心模块说明 (Core Modules)

### 7.1 3D 渲染与关卡生成 (`ThreeViewer.vue` & `ThreeLevelFactory.js`)
- **ThreeViewer.vue**：负责初始化 Three.js 场景（Scene、Camera、Renderer、OrbitControls），处理鼠标射线检测（Raycaster）以实现拖拽交互，并监听键盘事件（R/E 旋转）。内置了动态的距离与角度吸附（Snapping）逻辑。
- **ThreeLevelFactory.js**：采用工厂模式，根据传入的关卡类型（如 `dovetail`, `crosslap` 等）按需构建特定的 3D 几何体，分配初始位置与目标位置（Target Vector3），并设定特定的吸附容差参数。

### 7.2 造办处实战与 AI 判错 (`BuildingRepairView.vue` & `aiRepairCheck.js`)
- 玩家在 2D 图纸界面选择合适的榫卯填补古建受损部位。
- 若选择错误，`aiRepairCheck.js` 会提取当前建筑部位与玩家选择的错误榫卯，动态拼接 Prompt，请求大模型生成一段符合古代木匠口吻的受力分析反馈，寓教于乐。

### 7.3 全局状态管理 (`store.js`)
为了保证项目的轻量化，没有引入 Vuex 或 Pinia，而是使用 Vue 3 的 `reactive` API 封装了一个全局单例对象。
同时监听状态变化，将玩家的背包数据（已解锁的榫卯）、通关进度实时同步至浏览器的 `localStorage`，确保刷新不丢失进度。

---

## 🎮 8. 使用示例 (Usage Examples)

1. **进入关卡**：在主界面点击“拼装”，系统将加载当前关卡的 3D 模型。
2. **旋转视角**：长按鼠标右键拖动，可以全方位环视模型。
3. **调整构件**：鼠标悬停在深色构件上时，按下键盘 `R` 或 `E` 键可以使构件沿 Y 轴旋转 45 度。
4. **拼接入位**：长按鼠标左键拖拽深色构件，将其对准卯眼；滚动鼠标滚轮可以控制构件的深度推拉。当角度和位置都在容差范围内时，构件会自动“咔哒”一声吸附入位。
5. **AI 求助**：点击右下角的“问鲁班”按钮，在弹出的输入框中输入问题（如：“燕尾榫有什么力学优势？”），AI 将以鲁班的口吻为您解答。

---

## 🧪 9. 测试方法 (Testing)

由于本项目强依赖浏览器环境与 WebGL，测试主要以 E2E (端到端) 手动测试为主：

1. **渲染测试**：启动项目后，检查控制台是否有 Three.js 相关的警告或报错；确保模型材质、纹理和光影能够正常渲染。
2. **交互测试**：进入第一关（直榫），验证鼠标左键拖拽、右键旋转、滚轮缩放/推拉是否灵敏；验证键盘 R/E 旋转反馈。
3. **状态持久化测试**：通关前两关后，刷新浏览器，检查右上角进度与“图鉴”中是否正确保存了已解锁的榫卯。
4. **AI 接口联调测试**：在 `.env` 配置正确的 API Key 后，在“问鲁班”聊天框发送测试信息，确认是否能收到正常的回复流。

---

## 🤝 10. 贡献指南 (Contributing)

欢迎任何对中国古建文化或 Web 3D 技术感兴趣的开发者参与贡献！

1. Fork 本仓库。
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 将您的更改推送到分支 (`git push origin feature/AmazingFeature`)。
5. 开启一个 Pull Request。

**建议的贡献方向**：
- 增加更多种类的榫卯结构 3D 模型生成代码。
- 完善图鉴系统中的历史资料。
- 优化 Three.js 的材质表现（PBR）与阴影质量。

---

## 📄 11. 许可证信息 (License)

本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT) 进行开源。您可以自由地使用、修改和分发本项目的代码，但请保留原作者的版权声明。

---

## 📬 12. 作者与联系方式 (Contact)

- **作者** ： llmmy
- **联系邮箱**：3575543626@qq.com
- **参赛组别**：中国大学生计算机设计大赛 - 数媒赛道
- **项目主页**：http://47.76.149.208/

> “一凸一凹见乾坤，寻木榫卯传古今。” 期待本项目能为您带来启发！
