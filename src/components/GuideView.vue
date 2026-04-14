<template>
  <div class="guide-wrap">
    <!-- 顶部导航栏 -->
    <header class="guide-nav">
      <button class="back-btn" @click="$emit('back')">← 返回游戏</button>
      <div class="nav-title">榫卯 · 中国古建筑图鉴</div>
      <!-- 页内导航 -->
      <nav class="section-nav">
        <a href="#joints">图鉴</a>
        <a href="#history">历史</a>
        <a href="#tools">工具</a>
        <a href="#buildings">建筑</a>
        <a href="#regions">风格</a>
        <a href="#facts">趣闻</a>
      </nav>
    </header>

    <main class="guide-content">

      <!-- ① Hero -->
      <section class="hero-section">
        <div class="hero-decor top-left">木</div>
        <div class="hero-decor top-right">匠</div>
        <h1 class="hero-title">
          <span class="ch-char">榫</span>
          <span class="ch-char">卯</span>
        </h1>
        <p class="hero-subtitle">藏于木中的千年东方智慧</p>
        <p class="hero-desc">
          不用一根铁钉，不施一滴胶水。千年之前，中国匠人以木为笔，
          以榫卯为墨，书写了令现代结构工程师叹服的建筑传奇。
          榫——凸者；卯——凹者。一凸一凹之间，乾坤自成。
        </p>
        <div class="hero-stats">
          <div class="stat-item"><span class="stat-num">7000+</span><span class="stat-label">年历史</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">100+</span><span class="stat-label">种类型</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">0</span><span class="stat-label">根铁钉</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">2009</span><span class="stat-label">年非遗</span></div>
        </div>
      </section>

      <!-- ② 四大名榫图鉴 -->
      <section id="joints" class="joints-section">
        <h2 class="section-title">
          <span class="deco-line"></span>游戏榫卯图鉴<span class="deco-line"></span>
        </h2>
        <div class="joints-grid">
          <div v-for="joint in joints" :key="joint.id" class="joint-card">
            <div class="joint-svg-wrap">
              <svg :viewBox="joint.viewBox" class="joint-svg" v-html="joint.svg"></svg>
            </div>
            <div class="joint-info">
              <div class="joint-level">第 {{ joint.id }} 关</div>
              <h3 class="joint-name">{{ joint.name }}</h3>
              <p class="joint-en">{{ joint.en }}</p>
              <p class="joint-desc">{{ joint.desc }}</p>
              <div class="joint-tags">
                <span v-for="tag in joint.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ③ 历史时间线 -->
      <section id="history" class="history-section">
        <h2 class="section-title">
          <span class="deco-line"></span>木构建筑简史<span class="deco-line"></span>
        </h2>
        <div class="timeline">
          <div v-for="(era, i) in eras" :key="i" class="era-item">
            <div class="era-dot"></div>
            <div class="era-label">{{ era.period }}</div>
            <div class="era-content">
              <h4 class="era-title">{{ era.title }}</h4>
              <p class="era-desc">{{ era.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ④ 传统工具图鉴（新增） -->
      <section id="tools" class="tools-section">
        <h2 class="section-title">
          <span class="deco-line"></span>匠人工具图鉴<span class="deco-line"></span>
        </h2>
        <p class="section-intro">榫卯的精妙，离不开代代相传的手工工具。每一件工具都是匠人意志的延伸。</p>
        <div class="tools-grid">
          <div v-for="tool in tools" :key="tool.name" class="tool-card">
            <div class="tool-icon-wrap">
              <svg :viewBox="tool.viewBox" class="tool-svg" v-html="tool.svg"></svg>
            </div>
            <div class="tool-body">
              <h4 class="tool-name">{{ tool.name }}</h4>
              <p class="tool-en">{{ tool.en }}</p>
              <p class="tool-desc">{{ tool.desc }}</p>
              <div class="tool-uses">
                <span v-for="u in tool.uses" :key="u" class="tool-use-tag">{{ u }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑤ 地区建筑风格对比（新增） -->
      <section id="regions" class="regions-section">
        <h2 class="section-title">
          <span class="deco-line"></span>地区木构风格<span class="deco-line"></span>
        </h2>
        <p class="section-intro">中国幅员辽阔，南北气候有别，形成了风格迥异的地区木构建筑流派。</p>
        <div class="regions-grid">
          <div v-for="r in regions" :key="r.name" class="region-card">
            <div class="region-badge">{{ r.zone }}</div>
            <h3 class="region-name">{{ r.name }}</h3>
            <div class="region-repr">代表：{{ r.repr }}</div>
            <div class="region-features">
              <div v-for="feat in r.features" :key="feat.label" class="region-feat">
                <span class="feat-icon">{{ feat.icon }}</span>
                <span class="feat-text"><b>{{ feat.label }}</b> {{ feat.val }}</span>
              </div>
            </div>
            <p class="region-desc">{{ r.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ⑥ 经典古建 -->
      <section id="buildings" class="buildings-section">
        <h2 class="section-title">
          <span class="deco-line"></span>经典古建<span class="deco-line"></span>
        </h2>
        <div class="buildings-grid">
          <div v-for="b in buildings" :key="b.name" class="building-card">
            <div class="building-icon">{{ b.icon }}</div>
            <h3 class="building-name">{{ b.name }}</h3>
            <p class="building-loc">📍 {{ b.location }}</p>
            <p class="building-desc">{{ b.desc }}</p>
            <div class="building-tag">{{ b.feat }}</div>
          </div>
        </div>
      </section>

      <!-- ⑦ 冷知识趣味卡（新增） -->
      <section id="facts" class="facts-section">
        <h2 class="section-title">
          <span class="deco-line"></span>你不知道的榫卯<span class="deco-line"></span>
        </h2>
        <div class="facts-grid">
          <div v-for="fact in facts" :key="fact.q" class="fact-card">
            <div class="fact-icon">{{ fact.icon }}</div>
            <div class="fact-q">{{ fact.q }}</div>
            <div class="fact-a">{{ fact.a }}</div>
          </div>
        </div>
      </section>

      <!-- ⑧ CTA -->
      <section class="cta-section">
        <h2 class="cta-title">亲手体验千年匠心</h2>
        <p class="cta-sub">十分钟，走进古匠人的木构世界</p>
        <button class="cta-btn" @click="$emit('back')">🎮 开始拼装挑战</button>
      </section>

    </main>
  </div>
</template>

<script setup>
defineEmits(['back']);

// ── 四大名榫 ──────────────────────────────────────────────────
const joints = [
  {
    id: 1, name: '直榫', en: 'Straight Mortise & Tenon',
    desc: '榫卯中最基础的形制。榫头呈矩形，对应卯眼形状精准，由上而下竖直插入。结构简单，承压能力极强，是柱与梁连接的基础节点，数千年未曾改变。',
    tags: ['基础款', '承压', '竖向插入'],
    viewBox: '0 0 120 140',
    svg: `
      <rect x="10" y="65" width="35" height="60" fill="#c08840" rx="2"/>
      <rect x="75" y="65" width="35" height="60" fill="#c08840" rx="2"/>
      <rect x="35" y="100" width="50" height="25" fill="#c08840" rx="1"/>
      <rect x="15" y="18" width="90" height="18" fill="#6b3d18" rx="3"/>
      <rect x="48" y="36" width="24" height="35" fill="#6b3d18" rx="2"/>
      <line x1="60" y1="72" x2="60" y2="97" stroke="#ffcc44" stroke-width="2.5" stroke-dasharray="4,3"/>
      <polygon points="60,100 55,91 65,91" fill="#ffcc44"/>
      <text x="60" y="12" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">由上而下插入</text>
    `
  },
  {
    id: 2, name: '燕尾榫', en: 'Dovetail Joint',
    desc: '榫头截面呈梯形，形如燕子尾巴，只能从侧面水平滑入，插入后无法垂直拔出。这种"自锁"结构使其具有极强的抗拉拔能力，是古典家具角部连接的不二之选。',
    tags: ['自锁结构', '抗拉拔', '侧向插入'],
    viewBox: '0 0 140 110',
    svg: `
      <rect x="10" y="30" width="30" height="70" fill="#c59050" rx="2"/>
      <rect x="100" y="30" width="30" height="70" fill="#c59050" rx="2"/>
      <polygon points="40,30 100,30 90,100 50,100" fill="#c59050"/>
      <polygon points="48,38 92,38 84,95 56,95" fill="#12100a"/>
      <polygon points="105,55 140,48 140,62 105,68" fill="#5a3010"/>
      <line x1="108" y1="61" x2="88" y2="61" stroke="#ffcc44" stroke-width="2.5" stroke-dasharray="4,3"/>
      <polygon points="85,61 93,56 93,66" fill="#ffcc44"/>
      <text x="124" y="44" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">侧向推入</text>
    `
  },
  {
    id: 3, name: '十字搭接', en: 'Cross-Lap Joint',
    desc: '两根木梁在中央交叉，各自凿出半深缺口，使二者交叉后完全齐平，形如"十"字。结构对称，受力均匀，是建筑框格交叉节点的首选方案，上下两梁共享高度。',
    tags: ['对称结构', '框格节点', '竖向插入'],
    viewBox: '0 0 120 120',
    svg: `
      <rect x="5" y="48" width="110" height="24" fill="#b88030" rx="2"/>
      <rect x="50" y="48" width="20" height="12" fill="#12100a"/>
      <rect x="50" y="5" width="20" height="110" fill="#5a2e10" rx="2"/>
      <rect x="50" y="60" width="20" height="12" fill="#12100a"/>
      <line x1="5" y1="60" x2="50" y2="60" stroke="#ffcc44" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
      <line x1="70" y1="60" x2="115" y2="60" stroke="#ffcc44" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
      <line x1="60" y1="10" x2="60" y2="42" stroke="#ffcc44" stroke-width="2" stroke-dasharray="4,3"/>
      <polygon points="60,45 55,37 65,37" fill="#ffcc44"/>
      <text x="60" y="7" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">由上嵌入</text>
    `
  },
  {
    id: 4, name: '双榫', en: 'Double Tenon Joint',
    desc: '一块木板上制作两个平行榫头，对应两个卯眼同步配合插入。双榫比单榫更能抵抗扭转和剪切力，是大型建筑重要受力节点常用的加强型连接方式。',
    tags: ['加强型', '抗扭转', '精准对齐'],
    viewBox: '0 0 140 130',
    svg: `
      <rect x="10" y="50" width="35" height="70" fill="#c08840" rx="2"/>
      <rect x="55" y="50" width="30" height="70" fill="#c08840" rx="2"/>
      <rect x="95" y="50" width="35" height="70" fill="#c08840" rx="2"/>
      <rect x="32" y="90" width="23" height="30" fill="#c08840"/>
      <rect x="85" y="90" width="23" height="30" fill="#c08840"/>
      <rect x="32" y="50" width="23" height="40" fill="#12100a"/>
      <rect x="85" y="50" width="23" height="40" fill="#12100a"/>
      <rect x="5" y="22" width="130" height="15" fill="#5a3010" rx="3"/>
      <rect x="32" y="37" width="22" height="20" fill="#6b3d18" rx="1"/>
      <rect x="85" y="37" width="22" height="20" fill="#6b3d18" rx="1"/>
      <line x1="43" y1="57" x2="43" y2="47" stroke="#ffcc44" stroke-width="2" stroke-dasharray="3,2"/>
      <line x1="96" y1="57" x2="96" y2="47" stroke="#ffcc44" stroke-width="2" stroke-dasharray="3,2"/>
      <polygon points="43,50 40,58 46,58" fill="#ffcc44"/>
      <polygon points="96,50 93,58 99,58" fill="#ffcc44"/>
      <text x="70" y="15" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">双孔同步对准插入</text>
    `
  },
  {
    id: 5, name: '双联卯眼', en: 'Twin-Mortise Joint',
    desc: '两组互相独立的卯眼与榫头配合，每组方向可不同，需要玩家同时完成旋转与定位。此类复合连接广泛应用于门框、窗框等需同时抵抗多向力的部位。',
    tags: ['复合连接', '多向受力', '旋转插入'],
    viewBox: '0 0 160 130',
    svg: `
      <rect x="5"  y="35" width="22" height="75" fill="#c08840" rx="2"/>
      <rect x="47" y="35" width="22" height="75" fill="#c08840" rx="2"/>
      <rect x="27" y="80" width="20" height="30" fill="#c08840"/>
      <rect x="27" y="35" width="20" height="45" fill="#12100a"/>
      <rect x="91"  y="35" width="22" height="75" fill="#1e4d7a" rx="2"/>
      <rect x="133" y="35" width="22" height="75" fill="#1e4d7a" rx="2"/>
      <rect x="113" y="80" width="20" height="30" fill="#1e4d7a"/>
      <rect x="113" y="35" width="20" height="45" fill="#12100a"/>
      <rect x="10" y="8"  width="52" height="12" fill="#6b3d18" rx="2"/>
      <rect x="27" y="20" width="20" height="18" fill="#8b4a20" rx="1"/>
      <rect x="96" y="8"  width="52" height="12" fill="#153a5c" rx="2"/>
      <rect x="113" y="20" width="20" height="18" fill="#1e5a8a" rx="1"/>
    `
  },
  {
    id: 6, name: '半隐燕尾榫', en: 'Stopped Dovetail',
    desc: '燕尾榫的进阶版。正面看与普通燕尾榫无异，但在侧面却被木料完全遮挡，只留下一道微妙的缝隙。这种结构既保留了燕尾的抗拉力，又保护了家具外观的完整性。',
    tags: ['内藏结构', '外观保护', '高阶木作'],
    viewBox: '0 0 140 130',
    svg: `
      <rect x="20" y="50" width="100" height="60" fill="#8b4513" rx="2"/>
      <path d="M40,50 L100,50 L100,40 L90,20 L50,20 L40,40 Z" fill="#c89a5a"/>
      <rect x="40" y="50" width="60" height="5" fill="#5a3010" opacity="0.3"/>
    `
  },
  {
    id: 7, name: '粽角榫', en: 'Mitered Corner Joint',
    desc: '因外形像粽子的尖角而得名。三个构件在一个转角处汇合，每个构件的出头都削成 45 度斜面。它是制作柜柜、方凳等带束腰家具的灵魂，体现了中国几何学的巅峰。',
    tags: ['三方交汇', '45度格角', '束腰家具'],
    viewBox: '0 0 140 140',
    svg: `
      <rect x="60" y="60" width="20" height="70" fill="#5a2010"/>
      <path d="M60,60 L80,60 L110,30 L90,30 Z" fill="#8b4513"/>
      <path d="M60,60 L60,80 L30,110 L30,90 Z" fill="#8b4513"/>
    `
  },
  {
    id: 8, name: '勾挂榫', en: 'Hooked Joint',
    desc: '又称"云钩榫"。两个构件不再是简单的插入，而是设计成互相勾连的 S 型或 L 型。这种结构在没有外力锁定的情况下就能实现初步的互锁，拆解时需要特定的位移逻辑。',
    tags: ['S型互锁', '曲线造型', '拆解逻辑'],
    viewBox: '0 0 140 120',
    svg: `
      <path d="M20,60 Q40,40 60,60 T100,60" fill="none" stroke="#c89a5a" stroke-width="8"/>
      <path d="M20,65 Q40,45 60,65 T100,65" fill="none" stroke="#5a3010" stroke-width="8" opacity="0.5"/>
    `
  },
  {
    id: 9, name: '霸王枨', en: 'Pa-Wang Joint',
    desc: '家具结构中的加固神器。通过一根呈 S 形弯曲的枨子，将桌腿与裙板（束腰）牢牢锁死。其名字寓意"力大无穷"，不仅是力学支撑，更是中国古典家具的曲线美感担当。',
    tags: ['复合加固', '曲线力学', '锁定楔子'],
    viewBox: '0 0 160 140',
    svg: `
      <rect x="20" y="20" width="15" height="100" fill="#5a2010"/>
      <path d="M35,60 Q70,60 100,20" fill="none" stroke="#8b4513" stroke-width="6"/>
      <rect x="35" y="55" width="10" height="10" fill="#e8d0a0"/>
    `
  },
  {
    id: 10, name: '鲁班三才锁', en: 'Luban/Kongming Lock',
    desc: '中国传统木工技艺的皇冠。三根木柱在空间中垂直交叉，依靠极其精准的切槽实现自我锁定。它无需任何辅助，自成方圆，象征着天、地、人三才合一的智慧。',
    tags: ['三轴合一', '终极益智', '空间逻辑'],
    viewBox: '0 0 140 140',
    svg: `
      <rect x="60" y="20" width="20" height="100" fill="#2a2a2a" opacity="0.8"/>
      <rect x="20" y="60" width="100" height="20" fill="#8b4513" opacity="0.8"/>
      <circle cx="70" cy="70" r="15" fill="#d4af37"/>
    `
  }
];

// ── 历史时间线 ─────────────────────────────────────────────────
const eras = [
  {
    period: '约 7000 年前',
    title: '新石器时代 · 起源',
    desc: '浙江余姚河姆渡遗址出土的干栏式建筑遗存中，发现成熟的榫卯构件，是目前已知最早的榫卯实物证据。彼时先民已能以骨器、石器精准雕凿木材榫卯，令现代考古学家叹为观止。'
  },
  {
    period: '春秋 · 战国',
    title: '先秦 · 理论奠基',
    desc: '《考工记》载："攻木之工七……"，是中国最早系统记录木工工种分类的典籍。鲁班（约公元前 507 年）被奉为木匠祖师，据传其革新了斧、锯、刨等工具，并将榫卯工艺推至新高度。'
  },
  {
    period: '汉 · 唐',
    title: '两汉唐代 · 斗拱成型',
    desc: '斗拱体系趋于成熟，成为中国木构建筑的标志性符号。大明宫含元殿、麟德殿以宏大木构架与精密斗拱着称，奠定了宫殿建筑"间架"制度，深刻影响东亚建筑体系逾千年。'
  },
  {
    period: '宋',
    title: '宋代 · 规范化',
    desc: '李诫奉旨编撰《营造法式》（1103年），将各类斗拱、榫卯的尺寸、比例、做法全面标准化，成为中国历史上第一部完整的建筑技术规范，也是东亚建筑史上的里程碑文献。'
  },
  {
    period: '明 · 清',
    title: '明清 · 巅峰与传承',
    desc: '硬木家具工艺将榫卯推向新的高峰，种类多达百余种。北京故宫（1420年）以数以千计的榫卯节点支撑这座世界最大宫殿群；清代《工程做法则例》进一步将官式建筑技术体系精细化。'
  },
  {
    period: '现代',
    title: '当代 · 活态传承',
    desc: '2009年，中国传统木结构建筑营造技艺列入联合国非物质文化遗产。今天，榫卯的结构美学正被现代建筑师、设计师重新发现，广泛运用于家具设计、装置艺术和数字游戏中。'
  }
];

// ── 传统工具图鉴（新增） ─────────────────────────────────────
const tools = [
  {
    name: '墨斗', en: "Ink Reservoir (Ink Pot)",
    desc: '弹墨线工具，由墨仓、线轴、墨线三部分组成。拉紧蘸墨的细线后再弹起，在木料表面留下笔直的黑线，是木工划线的基础。古称"木工之眼"，无它则无法下刀。',
    uses: ['划直线', '定位', '放样'],
    viewBox: '0 0 100 60',
    svg: `
      <ellipse cx="28" cy="30" rx="22" ry="18" fill="#6b3d18" stroke="#c08840" stroke-width="1.5"/>
      <ellipse cx="28" cy="30" rx="14" ry="10" fill="#3a1e08"/>
      <circle  cx="28" cy="30" r="4"  fill="#c08840"/>
      <line x1="50" y1="30" x2="95" y2="30" stroke="#5a3010" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="95" cy="30" r="3" fill="#8b5a2b"/>
      <line x1="50" y1="28" x2="50" y2="8"  stroke="#c89a5a" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="50" y="55" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">弹线定位</text>
    `
  },
  {
    name: '凿', en: "Wood Chisel",
    desc: '开凿卯眼的专用工具，分为平凿、斜凿、圆凿等。工匠以木槌击打凿柄，凿刃嵌入木材，逐步剔除多余木料直至形成精准的卯眼形状。凿口宽度从 3mm 到 50mm 不等，用途各异。',
    uses: ['开卯眼', '剔槽', '修整'],
    viewBox: '0 0 100 60',
    svg: `
      <rect x="10" y="22" width="50" height="16" fill="#8b5a2b" rx="3"/>
      <rect x="60" y="25" width="20" height="10" fill="#6b3d18" rx="1"/>
      <polygon points="80,25 100,28 100,32 80,35" fill="#c0c0b0"/>
      <rect x="5"  y="20" width="12" height="20" fill="#5a3010" rx="2"/>
      <line x1="98" y1="26" x2="98" y2="34" stroke="#888" stroke-width="1.5"/>
      <text x="50" y="55" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">开凿卯眼</text>
    `
  },
  {
    name: '刨', en: "Hand Plane",
    desc: '刨平木料表面，使榫卯合缝严密的关键工具。推刨时，刨刃切削木纤维，使表面光洁如镜。榫卯的精密配合，往往需要反复用刨微调，直至"插入顺滑、拔出微阻"。',
    uses: ['平整木面', '调整榫头厚度', '精修配合'],
    viewBox: '0 0 100 60',
    svg: `
      <rect x="10" y="20" width="75" height="22" fill="#8b5a2b" rx="4"/>
      <rect x="20" y="14" width="20" height="10" fill="#6b3d18" rx="2"/>
      <rect x="42" y="38" width="34" height="3"  fill="#c0c0b0" rx="1"/>
      <line x1="45" y1="35" x2="65" y2="41" stroke="#888" stroke-width="2"/>
      <line x1="10" y1="43" x2="85" y2="43" stroke="#c89a5a" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.5"/>
      <text x="50" y="57" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">平整木面</text>
    `
  },
  {
    name: '锯', en: "Pull Saw",
    desc: '中国传统木工锯为"拉锯"（向自身拉动时切割），与西式推锯方向相反。锯齿斜向排列，锯路极细，可精准截断木料并尽量减少材料损耗。开料、截榫头均离不开它。',
    uses: ['截断木料', '开料', '锯榫头'],
    viewBox: '0 0 100 60',
    svg: `
      <rect x="5"  y="25" width="60" height="10" fill="#6b3d18" rx="2"/>
      <polyline points="5,35 10,40 15,35 20,40 25,35 30,40 35,35 40,40 45,35 50,40 55,35 60,40 65,35" fill="none" stroke="#c0c0b0" stroke-width="2"/>
      <rect x="65" y="20" width="28" height="20" fill="#8b5a2b" rx="4"/>
      <text x="50" y="57" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">拉锯截料</text>
    `
  },
  {
    name: '木槌', en: "Mallet",
    desc: '与凿配合使用的击打工具，木质槌头不会损伤凿柄。不同于铁锤，木槌对凿刃的冲击更易控制，适合精细木工作业。一手持凿定位，一手执槌击打，是凿卯眼时的标准姿势。',
    uses: ['配合凿', '击打榫头入卯', '拆解榫卯'],
    viewBox: '0 0 100 60',
    svg: `
      <rect x="55" y="12" width="38" height="30" fill="#8b5a2b" rx="5"/>
      <rect x="68" y="42" width="12" height="16" fill="#6b3d18" rx="2"/>
      <line x1="74" y1="56" x2="74" y2="60" stroke="#6b3d18" stroke-width="4" stroke-linecap="round"/>
      <text x="50" y="57" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">击打入卯</text>
    `
  },
  {
    name: '角尺', en: "Try Square",
    desc: '检验直角和画线的工具，由长尺（尺柄）和短尺（尺翼）成 90° 固定而成。榫卯要求极高的精度，凿卯之前必须用角尺反复检验垂直度和角度，差之毫厘即谬以千里。',
    uses: ['检验直角', '画横线', '校正榫肩'],
    viewBox: '0 0 100 60',
    svg: `
      <rect x="10" y="10" width="10" height="46" fill="#c0a060" rx="1.5"/>
      <rect x="10" y="10" width="70" height="10" fill="#c0a060" rx="1.5"/>
      <line x1="20" y1="20" x2="70" y2="20" stroke="#8a7040" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
      <line x1="20" y1="20" x2="20" y2="55" stroke="#8a7040" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
      <text x="55" y="52" text-anchor="middle" fill="#c89a5a" font-size="9" font-family="serif">校验直角</text>
    `
  }
];

// ── 地区风格对比（新增）──────────────────────────────────────
const regions = [
  {
    zone: '北方', name: '官式北方木构',
    repr: '北京故宫、山西民居',
    features: [
      { icon: '🏠', label: '屋顶', val: '庑殿、歇山，坡度平缓' },
      { icon: '🪵', label: '斗拱', val: '硕大，装饰与承重并重' },
      { icon: '🎨', label: '用色', val: '红柱、绿瓦，色彩浓烈' },
      { icon: '🌲', label: '用材', val: '松木、楠木为主' },
    ],
    desc: '北方官式建筑在皇权制度下高度规范化，《工程做法》严格约束每一个尺寸比例。斗拱尺度宏大，象征等级威严，屋宇开阔雄壮，体现帝国气象。'
  },
  {
    zone: '江南', name: '苏式江南木构',
    repr: '苏州园林、徽派民居',
    features: [
      { icon: '🏠', label: '屋顶', val: '硬山、悬山，坡度陡峻利排水' },
      { icon: '🪵', label: '斗拱', val: '小巧精致，以装饰为主' },
      { icon: '🎨', label: '用色', val: '粉墙黛瓦，清雅素净' },
      { icon: '🌲', label: '用材', val: '杉木、榉木、银杏木' },
    ],
    desc: '江南气候温润多雨，屋顶坡度更陡以快速排水。建筑形制灵活，园林建筑尤其重视与自然山水的融合。砖雕、木雕、石雕"三雕"工艺极为精湛，榫卯节点往往兼具结构与艺术价值。'
  },
  {
    zone: '岭南', name: '岭南通透木构',
    repr: '广州陈氏书院、潮汕大厝',
    features: [
      { icon: '🏠', label: '屋顶', val: '镬耳山墙，防台风侧推力' },
      { icon: '🪵', label: '斗拱', val: '灰塑代替木拱，防潮防虫' },
      { icon: '🎨', label: '用色', val: '彩色陶塑、玻璃镶嵌，华丽夺目' },
      { icon: '🌲', label: '用材', val: '坤甸木、菠萝格等南洋硬木' },
    ],
    desc: '岭南气候炎热潮湿，建筑注重通风散热，室内布局通透开敞。受海上贸易影响，西洋元素与中式榫卯工艺巧妙融合，形成独特的"中西合璧"风格，在南洋华人聚居地广泛传播。'
  },
  {
    zone: '西南', name: '干栏穿斗西南木构',
    repr: '云南丽江木楼、侗族风雨桥',
    features: [
      { icon: '🏠', label: '屋顶', val: '悬山吊脚楼，离地防潮防蛇' },
      { icon: '🪵', label: '斗拱', val: '穿斗式，榫卯密集层叠' },
      { icon: '🎨', label: '用色', val: '原木本色，不加彩绘' },
      { icon: '🌲', label: '用材', val: '杉木为主，就地取材' },
    ],
    desc: '西南山地民族的干栏式建筑直接传承自 7000 年前的河姆渡技术。穿斗式结构以密集的细柱和穿枋替代大梁，每根柱子直接承重，榫卯节点数量极多，整体如同一张三维网格，抗震性能出众。'
  }
];

// ── 经典建筑 ──────────────────────────────────────────────────
const buildings = [
  {
    icon: '🏛️', name: '故宫太和殿', location: '北京市故宫博物院',
    desc: '中国木构建筑的巅峰之作，始建于明永乐十八年（1420年）。面阔十一间，屋顶斗拱共 7 层，数以千计的榫卯节点相互咬合，以柔克刚，600余年来经历多次地震而主体完好。',
    feat: '斗拱七层 · 明清皇家 · 600余年'
  },
  {
    icon: '🏞️', name: '颐和园长廊', location: '北京市海淀区',
    desc: '建于清乾隆年间，全长 728 米，共 273 间，是世界上最长的木结构画廊式建筑。廊柱与廊梁之间全部采用榫卯连接，以古法工艺彩绘装饰，荣登吉尼斯世界纪录。',
    feat: '728米 · 273间 · 世界最长廊'
  },
  {
    icon: '🏘️', name: '皖南徽派古民居', location: '安徽省黄山市黟县',
    desc: '以宏村、西递为代表，以"三绝"（马头墙、砖雕门楼、木构楼阁）著称。室内大量运用榫卯结构，雕梁画栋，梁柱之间不着一钉，体现明清南方民间木作工艺的最高水平。',
    feat: '明清民居 · 世界遗产 · 木雕精髓'
  },
  {
    icon: '🌉', name: '侗族风雨桥', location: '广西三江、贵州黔东南',
    desc: '侗族代表性建筑，整桥不用一颗铁钉，全靠穿斗榫卯咬合而成。桥廊、桥亭、桥墩融为一体，集实用与艺术于一身，是穿斗式榫卯结构在公共建筑中的极致体现。',
    feat: '穿斗榫卯 · 无钉无铆 · 活态非遗'
  }
];

// ── 趣味冷知识（新增）────────────────────────────────────────
const facts = [
  {
    icon: '🔩',
    q: '中国古建筑真的一颗铁钉都不用吗？',
    a: '大部分传统木构建筑确实如此——主结构的梁、柱、斗拱全靠榫卯连接。铁钉贵且易锈，而榫卯在受力时会"越挤越紧"，抗震性反而更优于铁钉固定。'
  },
  {
    icon: '🌏',
    q: '榫卯在世界其他地区也有吗？',
    a: '有，但中国的榫卯种类最为丰富，系统最为复杂。古埃及、古希腊也有原始榫卯，但其复杂程度和用途多样性远不及中国。日本传统木构（在来工法）亦深受中国影响。'
  },
  {
    icon: '⚡',
    q: '榫卯为什么抗震？',
    a: '榫卯节点具有一定的"弹性转动能力"，地震时能吸收能量，避免整体倒塌——这与现代建筑"强节点弱构件"的抗震理念不谋而合。结构工程师将这种特性称为"耗能减震"。'
  },
  {
    icon: '📏',
    q: '榫卯的精度能达到多少？',
    a: '顶级工匠可以将榫头与卯眼的配合误差控制在 0.1 毫米以内（肉眼几乎看不出缝隙），却依然能轻松徒手插入拔出——这被称为"松紧适宜，温柔作别"。'
  },
  {
    icon: '🧩',
    q: '中国古代有多少种榫卯？',
    a: '根据文献整理，传统榫卯种类超过 100 种，明清硬木家具中就有 40 余种常见类型。按功能分类，有承压榫、抗拉榫、定位榫、装饰榫等，各有千秋。'
  },
  {
    icon: '🤖',
    q: '现代科技如何看待榫卯？',
    a: '研究人员用有限元分析验证：宋代《营造法式》记载的斗拱节点在地震模拟中表现出色，其"耗能-自复位"机制与现代隔震支座原理惊人地相似，被誉为"古代智慧中的现代力学"。'
  }
];
</script>

<style scoped>
/* ── 基础容器 ── */
.guide-wrap {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #100c05 0%, #1a1208 50%, #0e0904 100%);
  z-index: 30;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* ── 顶部导航 ── */
.guide-nav {
  display: flex; align-items: center;
  padding: 0 24px; height: 60px;
  border-bottom: 1px solid rgba(200,154,90,0.2);
  background: rgba(10,7,3,0.65);
  backdrop-filter: blur(12px);
  flex-shrink: 0; gap: 16px;
}
.back-btn {
  padding: 7px 18px;
  background: rgba(139,90,43,0.3); border: 1px solid rgba(200,154,90,0.4);
  border-radius: 20px; color: #d4a96a;
  font-family: "楷体", serif; font-size: 14px;
  cursor: pointer; transition: all 0.2s; flex-shrink: 0; white-space: nowrap;
}
.back-btn:hover { background: rgba(139,90,43,0.6); color: #f0d080; }
.nav-title {
  flex: 1; text-align: center;
  font-family: "楷体", serif; font-size: 18px;
  color: #d4a96a; letter-spacing: 4px; white-space: nowrap;
}
.section-nav {
  display: flex; gap: 0; flex-shrink: 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(200,154,90,0.18); border-radius: 20px; overflow: hidden;
}
.section-nav a {
  padding: 6px 14px; font-size: 12px; color: rgba(200,154,90,0.65);
  text-decoration: none; letter-spacing: 1px;
  transition: all 0.2s; border-right: 1px solid rgba(200,154,90,0.1);
  font-family: "楷体", serif;
}
.section-nav a:last-child { border-right: none; }
.section-nav a:hover { background: rgba(200,154,90,0.12); color: #f0d080; }

/* ── 主内容 ── */
.guide-content {
  flex: 1; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth;
}
.guide-content::-webkit-scrollbar { width: 4px; }
.guide-content::-webkit-scrollbar-thumb { background: rgba(200,154,90,0.3); border-radius: 2px; }

/* ── 通用标题 ── */
.section-title {
  display: flex; align-items: center; gap: 16px;
  font-family: "楷体", serif; font-size: 26px; color: #f0d080;
  margin: 0 0 36px; justify-content: center;
}
.deco-line {
  display: block; flex: 1; max-width: 80px; height: 1px;
  background: linear-gradient(90deg, transparent, #c89a5a, transparent);
}
.section-intro {
  text-align: center; font-size: 14px; color: rgba(200,170,100,0.6);
  line-height: 2; max-width: 600px; margin: -20px auto 36px; letter-spacing: 1px;
}

/* ── ① Hero ─────────────────────────────── */
.hero-section {
  position: relative; padding: 72px 40px 52px; text-align: center;
  border-bottom: 1px solid rgba(200,154,90,0.12); overflow: hidden;
}
.hero-section::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 30%, rgba(200,140,40,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.hero-decor {
  position: absolute; font-size: 60px;
  color: rgba(200,154,90,0.06); font-family: serif; top: 20px;
}
.hero-decor.top-left { left: 20px; }
.hero-decor.top-right { right: 20px; }
.hero-title { display: flex; justify-content: center; gap: 20px; margin: 0 0 16px; }
.ch-char {
  font-family: "楷体", "STKaiti", serif;
  font-size: clamp(60px, 8vw, 96px); color: #f0d080;
  text-shadow: 0 0 40px rgba(240,208,128,0.3), 2px 4px 0 #5a340a;
  line-height: 1; display: inline-block;
  animation: charFloat 4s ease-in-out infinite alternate;
}
.ch-char:nth-child(2) { animation-delay: 0.8s; }
@keyframes charFloat { from { transform: translateY(0); } to { transform: translateY(-8px); } }
.hero-subtitle {
  font-family: "楷体", serif; font-size: 18px; color: #c89a5a;
  letter-spacing: 4px; margin: 0 0 20px;
}
.hero-desc {
  max-width: 560px; margin: 0 auto 32px;
  font-size: 14px; line-height: 2.0; color: rgba(210,175,110,0.75);
}
.hero-stats {
  display: flex; align-items: center; justify-content: center; gap: 0;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(200,154,90,0.2);
  border-radius: 16px; padding: 16px 32px;
  max-width: 520px; margin: 0 auto;
}
.stat-item { text-align: center; padding: 0 24px; }
.stat-num {
  display: block; font-family: "楷体", serif; font-size: 28px; color: #f0d080;
  line-height: 1.2;
}
.stat-label { display: block; font-size: 11px; color: rgba(200,154,90,0.6); letter-spacing: 2px; }
.stat-divider { width: 1px; height: 36px; background: rgba(200,154,90,0.2); }

/* ── ② 榫卯图鉴 ─────────────────────────── */
.joints-section { padding: 60px 40px; border-bottom: 1px solid rgba(200,154,90,0.1); }
.joints-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px; max-width: 1000px; margin: 0 auto;
}
.joint-card {
  display: flex; gap: 20px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(200,154,90,0.18);
  border-radius: 16px; padding: 22px; transition: all 0.25s;
}
.joint-card:hover { border-color: rgba(200,154,90,0.48); transform: translateY(-3px); }
.joint-svg-wrap {
  flex-shrink: 0; width: 130px; height: 130px;
  background: rgba(0,0,0,0.25); border: 1px solid rgba(200,154,90,0.15);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 8px;
}
.joint-svg { width: 100%; height: 100%; }
.joint-info { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.joint-level {
  font-size: 11px; color: #c89a5a; letter-spacing: 2px;
  background: rgba(200,154,90,0.1); display: inline-block;
  padding: 2px 10px; border-radius: 10px; width: fit-content;
}
.joint-name { font-family: "楷体", serif; font-size: 21px; color: #f0d080; margin: 0; }
.joint-en { font-size: 11px; color: rgba(200,154,90,0.5); margin: 0; font-style: italic; }
.joint-desc { font-size: 12.5px; line-height: 1.85; color: rgba(210,175,110,0.7); margin: 4px 0 0; }
.joint-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
.tag { padding: 3px 10px; font-size: 11px; border: 1px solid rgba(200,154,90,0.3); border-radius: 10px; color: rgba(200,154,90,0.7); }

/* ── ③ 时间线 ─────────────────────────────── */
.history-section { padding: 60px 40px; border-bottom: 1px solid rgba(200,154,90,0.1); }
.timeline { max-width: 700px; margin: 0 auto; position: relative; padding-left: 32px; }
.timeline::before {
  content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px;
  background: linear-gradient(to bottom, transparent, #c89a5a 10%, #c89a5a 90%, transparent);
}
.era-item {
  position: relative; display: grid; grid-template-columns: 110px 1fr;
  gap: 20px; margin-bottom: 32px; align-items: start;
}
.era-item:last-child { margin-bottom: 0; }
.era-dot {
  position: absolute; left: -28px; top: 6px;
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid #c89a5a; background: #1a1208;
  box-shadow: 0 0 8px rgba(200,154,90,0.4);
}
.era-label { font-size: 12px; color: #c89a5a; letter-spacing: 1px; padding-top: 4px; font-style: italic; }
.era-title { font-family: "楷体", serif; font-size: 16px; color: #f0d080; margin: 0 0 7px; }
.era-desc { font-size: 13px; line-height: 1.9; color: rgba(210,175,110,0.65); margin: 0; }

/* ── ④ 工具图鉴 ─────────────────────────── */
.tools-section { padding: 60px 40px; border-bottom: 1px solid rgba(200,154,90,0.1); }
.tools-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px; max-width: 1000px; margin: 0 auto;
}
.tool-card {
  display: flex; gap: 18px; align-items: flex-start;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(200,154,90,0.15);
  border-radius: 14px; padding: 18px; transition: all 0.25s;
}
.tool-card:hover { border-color: rgba(200,154,90,0.4); transform: translateY(-2px); }
.tool-icon-wrap {
  flex-shrink: 0; width: 90px; height: 56px;
  background: rgba(0,0,0,0.25); border: 1px solid rgba(200,154,90,0.12);
  border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 6px;
}
.tool-svg { width: 100%; height: 100%; }
.tool-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.tool-name { font-family: "楷体", serif; font-size: 16px; color: #f0d080; margin: 0; }
.tool-en { font-size: 10px; color: rgba(200,154,90,0.45); margin: 0; font-style: italic; }
.tool-desc { font-size: 12px; line-height: 1.8; color: rgba(210,175,110,0.65); margin: 4px 0 0; }
.tool-uses { display: flex; flex-wrap: wrap; gap: 5px; margin-top: auto; padding-top: 8px; }
.tool-use-tag {
  padding: 2px 9px; font-size: 10px;
  border: 1px solid rgba(200,154,90,0.25); border-radius: 8px; color: rgba(200,154,90,0.6);
}

/* ── ⑤ 地区风格 ─────────────────────────── */
.regions-section { padding: 60px 40px; border-bottom: 1px solid rgba(200,154,90,0.1); }
.regions-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px; max-width: 1080px; margin: 0 auto;
}
.region-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(200,154,90,0.15);
  border-radius: 16px; padding: 24px 20px; transition: all 0.25s; position: relative;
}
.region-card:hover { border-color: rgba(200,154,90,0.4); transform: translateY(-3px); }
.region-badge {
  position: absolute; top: -10px; left: 20px;
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  color: #fff; font-size: 11px; padding: 3px 14px; border-radius: 10px; letter-spacing: 2px;
}
.region-name { font-family: "楷体", serif; font-size: 18px; color: #f0d080; margin: 8px 0 4px; }
.region-repr { font-size: 11px; color: rgba(200,154,90,0.5); margin-bottom: 16px; }
.region-features { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.region-feat { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; }
.feat-icon { flex-shrink: 0; font-size: 14px; }
.feat-text { color: rgba(210,175,110,0.7); line-height: 1.5; }
.feat-text b { color: rgba(200,154,90,0.85); }
.region-desc { font-size: 12px; line-height: 1.85; color: rgba(200,160,90,0.55); margin: 0; border-top: 1px solid rgba(200,154,90,0.12); padding-top: 12px; }

/* ── ⑥ 经典建筑 ─────────────────────────── */
.buildings-section { padding: 60px 40px; border-bottom: 1px solid rgba(200,154,90,0.1); }
.buildings-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px; max-width: 1000px; margin: 0 auto;
}
.building-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(200,154,90,0.15);
  border-radius: 16px; padding: 26px 22px; text-align: center;
  transition: all 0.3s; position: relative; overflow: hidden;
}
.building-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #c89a5a, transparent);
  opacity: 0; transition: opacity 0.3s;
}
.building-card:hover { transform: translateY(-4px); border-color: rgba(200,154,90,0.4); }
.building-card:hover::before { opacity: 1; }
.building-icon { font-size: 44px; margin-bottom: 10px; }
.building-name { font-family: "楷体", serif; font-size: 18px; color: #f0d080; margin: 0 0 6px; }
.building-loc { font-size: 11px; color: rgba(200,154,90,0.5); margin: 0 0 12px; }
.building-desc { font-size: 12.5px; line-height: 1.85; color: rgba(210,175,110,0.65); margin: 0 0 14px; text-align: left; }
.building-tag { display: inline-block; padding: 4px 14px; border: 1px solid rgba(200,154,90,0.3); border-radius: 12px; font-size: 11px; color: #c89a5a; letter-spacing: 1px; }

/* ── ⑦ 冷知识 ─────────────────────────────── */
.facts-section { padding: 60px 40px; border-bottom: 1px solid rgba(200,154,90,0.1); }
.facts-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px; max-width: 1000px; margin: 0 auto;
}
.fact-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(200,154,90,0.15);
  border-radius: 14px; padding: 22px 20px; transition: all 0.25s;
  display: flex; flex-direction: column; gap: 10px;
}
.fact-card:hover { border-color: rgba(200,154,90,0.4); background: rgba(200,154,90,0.04); }
.fact-icon { font-size: 28px; }
.fact-q {
  font-family: "楷体", serif; font-size: 15px; color: #f0d080; line-height: 1.5;
  border-bottom: 1px solid rgba(200,154,90,0.15); padding-bottom: 8px;
}
.fact-a { font-size: 13px; line-height: 1.9; color: rgba(210,175,110,0.7); }

/* ── ⑧ CTA ─────────────────────────────── */
.cta-section { padding: 72px 40px 96px; text-align: center; }
.cta-title { font-family: "楷体", serif; font-size: 30px; color: #f0d080; margin: 0 0 12px; }
.cta-sub { font-size: 14px; color: rgba(200,154,90,0.6); margin: 0 0 32px; letter-spacing: 2px; }
.cta-btn {
  padding: 15px 48px;
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  border: none; border-radius: 12px; color: #fff;
  font-family: "楷体", serif; font-size: 20px; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4); transition: transform 0.2s, box-shadow 0.2s;
}
.cta-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.5); }
</style>
