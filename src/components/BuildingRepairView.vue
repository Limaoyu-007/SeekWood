<template>
  <div class="repair-container">
    <div class="top-nav">
      <button class="back-btn" @click="$emit('back')">← 退出经典复原模式</button>
      <div class="title-group">
        <h2 class="building-title">【大匠造办】{{ currentChapter.name }}</h2>
        <p class="chapter-subtitle">{{ currentChapter.subtitle }}</p>
      </div>

      <div v-if="!isTutorialChapter" class="chapter-switcher">
        <button
          v-for="chapter in unlockedChapterList"
          :key="chapter.id"
          class="chapter-chip"
          :class="{ active: chapter.id === currentChapterId }"
          @click="switchChapter(chapter.id)"
        >
          {{ chapter.shortName }}
        </button>
      </div>
    </div>

    <div class="building-canvas" :class="{ 'reveal-photo': isFullyRepaired }">
      <transition name="panorama-fade">
        <div v-if="isFullyRepaired" class="panorama-overlay">
          <img :src="currentChapter.panoramaPhoto" alt="建筑全景图" class="panorama-image" />
          <div class="panorama-caption">
            <h3>全景重现</h3>
            <p>{{ currentChapter.name }}已完成修复，昔日风华尽收眼底。</p>
          </div>
        </div>
      </transition>

      <div class="canvas-inner">
        <div class="real-photo-bg" :style="{ backgroundImage: 'url(' + currentChapter.realPhoto + ')' }"></div>

        <div class="blueprint-container">
          <svg
            v-if="currentChapter.id === 'screen-door'"
            class="building-svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g class="blueprint-lines" stroke="#5c3a21" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="188" y="78" width="424" height="444" rx="8" />
              <rect x="214" y="104" width="154" height="392" rx="4" />
              <rect x="432" y="104" width="154" height="392" rx="4" />
              <path d="M 400 94 L 400 522" stroke-width="4" />
              <path d="M 214 180 L 368 180 M 214 300 L 368 300 M 214 420 L 368 420" opacity="0.7" />
              <path d="M 432 180 L 586 180 M 432 300 L 586 300 M 432 420 L 586 420" opacity="0.7" />
              <path d="M 226 118 L 356 482 M 356 118 L 226 482" opacity="0.3" />
              <path d="M 444 118 L 574 482 M 574 118 L 444 482" opacity="0.3" />
              <path d="M 175 522 L 625 522" stroke-width="3" />
              <path d="M 205 548 L 595 548" stroke-width="2" opacity="0.45" />
              <path d="M 232 456 L 370 456" stroke-width="3" />
              <path d="M 232 486 L 370 486" stroke-width="2" opacity="0.6" />
              <path d="M 232 456 L 232 518 M 370 456 L 370 518" stroke-width="2.5" opacity="0.75" />
              <path d="M 232 486 L 268 518" stroke-width="3" />
              <path d="M 370 486 L 334 518" stroke-width="3" />
              <path d="M 430 220 L 430 304" stroke-width="2.5" />
              <path d="M 586 220 L 586 304" stroke-width="2.5" />
              <path d="M 508 220 L 508 304" stroke-width="2" opacity="0.55" />
              <path d="M 458 220 L 558 220" stroke-width="3" />
              <path d="M 452 252 L 552 252" stroke-width="3" />
              <path d="M 470 252 L 470 286 L 540 286 L 540 252" stroke-width="2.5" opacity="0.8" />
            </g>
          </svg>

          <svg
            v-else-if="currentChapter.id === 'garden-pavilion'"
            class="building-svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g class="blueprint-lines" stroke="#5c3a21" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 400 76 L 650 214 L 544 254 L 400 168 L 256 254 L 150 214 Z" stroke-width="3" fill="rgba(92, 58, 33, 0.03)" />
              <path d="M 250 254 L 400 168 L 550 254" stroke-width="3" />
              <path d="M 230 248 L 230 458 M 570 248 L 570 458" stroke-width="4" />
              <path d="M 314 278 L 314 472 M 486 278 L 486 472" stroke-width="3.5" />
              <path d="M 248 258 L 552 258 M 230 330 L 570 330" stroke-width="2.5" />
              <path d="M 230 458 L 314 472 L 400 482 L 486 472 L 570 458" stroke-width="3" />
              <path d="M 314 278 L 400 238 L 486 278" opacity="0.55" />
              <path d="M 286 236 L 350 196 L 400 226 L 344 258" stroke-width="3" />
              <path d="M 400 226 L 448 196 L 514 236" stroke-width="3" />
              <path d="M 336 194 L 400 160 L 462 194" stroke-width="2.5" opacity="0.7" />
              <path d="M 454 364 Q 508 334 568 362" opacity="0.45" />
              <path d="M 462 366 Q 506 340 548 362" stroke-width="3" />
              <path d="M 460 366 L 460 392" stroke-width="2.5" />
              <path d="M 550 364 L 550 392" stroke-width="2.5" />
              <path d="M 460 392 Q 505 412 550 392" stroke-width="2.5" />
              <path d="M 250 506 L 550 506" stroke-width="3" />
            </g>
          </svg>

          <svg
            v-else-if="currentChapter.id === 'ancient-table'"
            class="building-svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g class="blueprint-lines" stroke="#5c3a21" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 216 208 L 602 208 L 650 256 L 264 256 Z" stroke-width="3" fill="rgba(92, 58, 33, 0.03)" />
              <path d="M 264 256 L 264 474 M 602 256 L 602 474" stroke-width="4" />
              <path d="M 300 246 L 300 474 M 530 246 L 530 474" stroke-width="3.5" opacity="0.8" />
              <path d="M 264 318 L 602 318" stroke-width="2.5" />
              <path d="M 286 286 L 352 286 M 478 286 L 544 286" stroke-width="2.5" opacity="0.75" />
              <path d="M 330 214 L 330 252 M 352 214 L 352 252" stroke-width="3" />
              <path d="M 478 214 L 478 252 M 500 214 L 500 252" stroke-width="3" />
              <path d="M 216 208 L 264 256 M 602 208 L 650 256" opacity="0.6" />
              <path d="M 286 364 L 548 364" opacity="0.7" />
              <path d="M 322 474 L 406 404 L 490 474" stroke-width="3" />
              <path d="M 300 474 L 406 392 L 512 474" stroke-width="2.5" opacity="0.55" />
              <path d="M 348 456 L 406 414 L 464 456" opacity="0.65" />
              <path d="M 248 504 L 626 504" stroke-width="3" />
            </g>
          </svg>

          <svg
            v-else-if="currentChapter.id === 'luban-box'"
            class="building-svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g class="blueprint-lines" stroke="#5c3a21" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 258 212 L 470 172 L 592 246 L 372 290 Z" stroke-width="3" fill="rgba(92, 58, 33, 0.03)" />
              <path d="M 258 212 L 258 432 L 372 506 L 372 290" stroke-width="3" />
              <path d="M 372 290 L 592 246 L 592 454 L 372 506" stroke-width="3" />
              <path d="M 470 172 L 470 386" opacity="0.45" />
              <path d="M 314 256 L 414 236 L 476 274 L 378 294 Z" opacity="0.7" />
              <path d="M 332 360 L 356 344 L 356 390 L 332 406 Z" stroke-width="2.5" />
              <path d="M 382 350 L 408 334 L 408 384 L 382 400 Z" stroke-width="2.5" />
              <path d="M 334 382 L 408 368" stroke-width="2.5" opacity="0.7" />
              <path d="M 502 286 L 548 260 L 548 346 L 502 372 Z" stroke-width="3" />
              <path d="M 470 246 L 526 214 L 558 234 L 502 266 Z" stroke-width="2.5" opacity="0.65" />
              <path d="M 494 314 L 592 296" opacity="0.45" />
              <path d="M 352 458 L 422 412 L 490 454" opacity="0.6" />
            </g>
          </svg>

          <svg v-else class="building-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <g class="blueprint-lines" stroke="#5c3a21" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 220 500 L 280 500 M 520 500 L 580 500" stroke-width="3"/>
              <path d="M 230 490 L 270 490 M 530 490 L 570 490" stroke-width="3"/>
              <path d="M 250 490 L 250 250 M 550 490 L 550 250" stroke-width="4" />
              <path d="M 120 490 L 120 300 M 680 490 L 680 300" stroke-width="3" opacity="0.4"/>
              <path d="M 100 320 L 700 320 M 100 290 L 700 290" stroke-width="2"/>
              <path d="M 220 250 L 580 250 M 240 230 L 560 230" stroke-width="3"/>

              <g class="dougong" stroke-width="1.5">
                <path d="M 230 250 L 230 220 L 270 220 L 270 250 M 210 220 L 210 190 L 290 190 L 290 220" />
                <path d="M 190 190 L 190 160 L 310 160 L 310 190" />
                <path d="M 530 250 L 530 220 L 570 220 L 570 250 M 510 220 L 510 190 L 590 190 L 590 220" />
                <path d="M 490 190 L 490 160 L 610 160 L 610 190" />
                <path d="M 380 250 L 380 220 L 420 220 L 420 250 M 360 220 L 360 190 L 440 190 L 440 220"/>
                <path d="M 340 190 L 340 160 L 460 160 L 460 190" />
              </g>

              <path d="M 400 40 Q 600 70 760 180 L 730 210 Q 600 110 400 80 Q 200 110 70 210 L 40 180 Q 200 70 400 40 Z" stroke-width="3" fill="rgba(92, 58, 33, 0.03)" />
              <path d="M 400 40 L 400 80 M 350 45 L 340 90 M 450 45 L 460 90 M 300 55 L 280 105 M 500 55 L 520 105 M 250 70 L 220 130 M 550 70 L 580 130 M 200 90 L 160 160 M 600 90 L 640 160 M 150 120 L 100 190 M 650 120 L 700 190" stroke-width="1.5" opacity="0.6"/>

              <g class="doors" stroke-width="1.5" opacity="0.8">
                <path d="M 320 490 L 320 320 M 480 490 L 480 320" />
                <path d="M 360 490 L 360 320 M 440 490 L 440 320" />
                <path d="M 400 490 L 400 320" />
                <path d="M 320 350 L 480 350 M 320 380 L 480 380 M 320 410 L 480 410" opacity="0.4"/>
              </g>

              <path d="M 80 500 L 720 500 L 740 540 L 60 540 Z" stroke-width="2"/>
              <path d="M 350 540 L 450 540 M 340 560 L 460 560 M 330 580 L 470 580" />
              <path d="M 350 540 L 330 580 M 450 540 L 470 580" />
            </g>
          </svg>
        </div>

        <div
          v-for="spot in currentHotspots"
          :key="`${currentChapter.id}-${spot.id}`"
          class="hotspot"
          :class="{
            repaired: spot.isRepaired,
            'tutorial-glow': isTutorialChapter && !store.hasSeenTutorial && spot.id === 'hs1'
          }"
          :style="{ left: spot.x, top: spot.y }"
          @click="onHotspotClick(spot)"
        >
          <div class="ring"></div>
          <div class="dot"></div>
          <div class="label">{{ spot.label }}</div>
        </div>
      </div>
    </div>

    <div v-if="!isTutorialChapter" class="chapter-progress-panel">
      <div class="panel-head">
        <h3>章节簿</h3>
        <span>{{ repairedCount }}/{{ currentHotspots.length }} 节点已稳固</span>
      </div>
      <p class="panel-desc">{{ currentChapter.intro }}</p>

      <div class="chapter-hotspot-list">
        <div
          v-for="spot in currentHotspots"
          :key="`panel-${currentChapter.id}-${spot.id}`"
          class="chapter-hotspot-item"
          :class="{ done: spot.isRepaired }"
        >
          <div>
            <strong>{{ spot.label }}</strong>
            <p>{{ spot.tip }}</p>
          </div>
          <span>{{ spot.isRepaired ? '已修复' : '待修整' }}</span>
        </div>
      </div>

      <button
        v-if="nextChapterToUnlock"
        class="next-chapter-btn"
        @click="switchChapter(nextChapterToUnlock.id)"
      >
        前往下一章：{{ nextChapterToUnlock.name }}
      </button>
    </div>

    <transition name="fade-slide">
      <div v-if="activeHotspot" class="inventory-modal-bg" @click.self="closeInventory">
        <div class="inventory-modal">
          <div class="modal-header">
            <h3>修复：{{ activeHotspot.label }}</h3>
            <button class="close-btn" @click="closeInventory">✕</button>
          </div>
          <p class="modal-desc">{{ activeHotspot.tip }}</p>
          <p class="modal-subdesc">请选择合适的榫卯构件：</p>

          <div class="inventory-grid">
            <div v-if="store.inventory.length === 0" class="empty-hint">
              你的行囊空空如也，请先去闯关收集榫卯！
            </div>
            <button
              v-else
              v-for="jId in store.inventory"
              :key="jId"
              class="joint-item"
              @click="submitJoint(jId)"
            >
              <span>{{ getJointName(jId) }}</span>
              <small>{{ getJointUsage(jId) }}</small>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="pop">
      <div v-if="aiFeedback" class="feedback-modal" :class="{ 'shake-error': isShake }">
        <div class="luban-avatar">🤖 鲁班</div>
        <div class="feedback-content">
          <p class="typing-text">{{ aiFeedback }}</p>
          <button v-if="showWorkshopJump" class="action-btn primary" @click="handleTutorialJump">
            前往工坊 ➔
          </button>
          <button v-else class="action-btn" @click="aiFeedback = null">领教了</button>
        </div>
      </div>
    </transition>

    <transition name="pop">
      <div v-if="successSpot && !isFullyRepaired" class="success-modal-bg">
        <div class="success-modal">
          <h2>🎉 修复成功！</h2>
          <p class="success-sub">
            结构【{{ successSpot.label }}】已稳固如初。
          </p>

          <div class="culture-card">
            <img
              :src="successSpot.successPhoto || successChapter?.realPhoto || currentChapter.realPhoto"
              alt="实景图"
              class="real-photo"
            />
            <p class="culture-text">
              {{ successChapter?.cultureText || currentChapter.cultureText }}
            </p>
          </div>

          <button class="action-btn primary" @click="closeSuccess">
            继续造办
          </button>
        </div>
      </div>
    </transition>

    <div v-if="isAiThinking" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>鲁班大师沉思中...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { store, unlockBuilding, completeTutorial } from '../store';
import { fetchRepairFeedback } from '../utils/aiRepairCheck';
import { audioSystem } from '../utils/audioSystem';

const emit = defineEmits(['back', 'go-workshop']);

const JOINT_NAMES = {
  straight: '直榫',
  dovetail: '燕尾榫',
  crosslap: '十字搭接',
  doubletenon: '双榫',
  twojoint: '双联卯眼',
  stoppedDovetail: '半隐燕尾榫',
  miteredCorner: '粽角榫',
  cloudJoint: '勾挂榫',
  paWangJoint: '霸王枨',
  lubanLock: '鲁班三才锁'
};

const JOINT_USAGE = {
  straight: '适合纵向插接，稳固柱脚。',
  dovetail: '抗拔出强，常用于边框角接。',
  crosslap: '适合两木交叉齐平的节点。',
  doubletenon: '双点受力，更能抵抗扭转。',
  twojoint: '适合双点同步归位的结构。',
  stoppedDovetail: '外不露头，内里自锁。',
  miteredCorner: '适合转角合缝与多面收边。',
  cloudJoint: '适合挂接受拉的曲梁节点。',
  paWangJoint: '适合桌案斜撑，分力稳架。',
  lubanLock: '多向互锁，讲究整体次序。'
};

const createHotspot = (spot) => ({ ...spot, isRepaired: false });

const CHAPTERS = [
  {
    id: 'huguang-stage',
    shortName: '戏台',
    name: '重庆湖广会馆戏台',
    subtitle: '第一章 · 戏台梁架初修',
    intro: '先从戏台受力最关键的柱础与梁柱节点入手，感受大木作最直接的承重逻辑。',
    realPhoto: '/images/huguang-stage-main.jpg',
    panoramaPhoto: '/images/huguang-stage-main.jpg',
    cultureText: '湖广会馆戏台始建于明末清初，是巴渝地区极具代表性的木结构戏台。柱础与梁架一旦松动，整座戏台的气韵便会随之散去。',
    panoramaText: '当柱础与梁柱交接重新咬合，戏台的承重体系再次闭环。你修复的不只是节点，更是巴渝戏曲空间的精神骨架。',
    requiredJoints: ['straight', 'crosslap'],
    hotspots: [
      {
        id: 'hs1',
        label: '戏台底部柱础',
        x: '31.25%',
        y: '83.33%',
        requiredJoint: 'straight',
        successPhoto: '/images/huguang-stage-hs1.jpg',
        tip: '柱脚受力以纵向插接为主，需用最稳妥的做法先把基础立住。'
      },
      {
        id: 'hs2',
        label: '主梁与檐柱交接点',
        x: '68.75%',
        y: '41.67%',
        requiredJoint: 'crosslap',
        successPhoto: '/images/huguang-stage-hs2.jpg',
        tip: '两木交会需要上下各削半口，既要齐面，也要分担横向压力。'
      }
    ]
  },
  {
    id: 'screen-door',
    shortName: '隔扇',
    name: '明清隔扇门',
    subtitle: '第二章 · 门扇暗合',
    intro: '隔扇门既讲究观感，也讲究暗中的锁合关系。燕尾一明一隐，恰好体现木作的表里功夫。',
    realPhoto: '/images/screen-door-main.jpg',
    panoramaPhoto: '/images/screen-door-main.jpg',
    cultureText: '明清隔扇门兼具礼制与工艺美感，门扇边框与抹头内部多靠精密榫卯维系结构完整。',
    panoramaText: '当外露的燕尾与暗藏的半隐燕尾同时归位，门扇重新恢复了开合有度、纹样不散的完整气象。',
    requiredJoints: ['dovetail', 'stoppedDovetail'],
    hotspots: [
      {
        id: 'hs1',
        label: '门扇边框角接',
        x: '37.63%',
        y: '81%',
        requiredJoint: 'dovetail',
        successPhoto: '/images/screen-door-hs1.jpg',
        tip: '边梃与下抹头在门扇角部相交，此处既承受门扇自重，也反复受启闭拉扯，宜以燕尾榫锁住角接，防止下角松脱外张。'
      },
      {
        id: 'hs2',
        label: '暗藏抹头内槽',
        x: '63.13%',
        y: '43%',
        requiredJoint: 'stoppedDovetail',
        successPhoto: '/images/screen-door-hs2.jpg',
        tip: '中抹头插入边梃腹内的暗槽后，需要在门扇中上段把横向分力悄悄锁住，半隐燕尾榫既能藏头，又能防止抹头被抽脱。'
      }
    ]
  },
  {
    id: 'garden-pavilion',
    shortName: '角亭',
    name: '江南园林角亭',
    subtitle: '第三章 · 飞角合缝',
    intro: '角亭的迷人之处在于转角。只有多面合缝严整，飞角才能轻盈而不散乱。',
    realPhoto: '/images/garden-pavilion-main.jpg',
    panoramaPhoto: '/images/garden-pavilion-main.jpg',
    cultureText: '园林角亭常见飞角、挂落与曲梁相接的复合节点，既是观景之所，也是木作精度的集中展示。',
    panoramaText: '转角与挂落同时归稳之后，角亭重新显出凌空欲起的轻巧气度。看似灵秀，实则靠每一个合缝节点默默托住。',
    requiredJoints: ['miteredCorner', 'cloudJoint'],
    hotspots: [
      {
        id: 'hs1',
        label: '亭角转角合缝',
        x: '43%',
        y: '40.33%',
        requiredJoint: 'miteredCorner',
        successPhoto: '/images/garden-pavilion-hs1.jpg',
        tip: '飞檐转角真正吃力的不是屋面中央，而是斜向角梁、檐口与转角木件汇交的合缝点，需以粽角榫把多面斜角同时咬紧。'
      },
      {
        id: 'hs2',
        label: '挂落曲梁连接',
        x: '63.13%',
        y: '60.83%',
        requiredJoint: 'cloudJoint',
        successPhoto: '/images/garden-pavilion-hs2.jpg',
        tip: '挂落应挂接在柱间下部、靠近曲梁回折的受拉节点上，既要承受自重下坠，也要防止前后摇脱，勾挂榫最合其势。'
      }
    ]
  },
  {
    id: 'ancient-table',
    shortName: '古案',
    name: '古案长桌',
    subtitle: '第四章 · 案架稳骨',
    intro: '大件家具最考验横向晃动与扭转控制。双榫与霸王枨，一静一撑，正是稳案之道。',
    realPhoto: '/images/ancient-table-main.jpg',
    panoramaPhoto: '/images/ancient-table-main.jpg',
    cultureText: '长桌与供案虽非建筑主体，却与古建木作一脉相承。案面、腿足、枨子之间的受力关系最能体现榫卯的力学智慧。',
    panoramaText: '当案面与腿足重新扣牢，霸王枨再度撑起横向分力，这张古案便恢复了沉静稳健的气度。',
    requiredJoints: ['doubletenon', 'paWangJoint'],
    hotspots: [
      {
        id: 'hs1',
        label: '案面与腿足连接',
        x: '37.5%',
        y: '43.33%',
        requiredJoint: 'doubletenon',
        successPhoto: '/images/ancient-table-hs1.jpg',
        tip: '真正承受案面竖向压力与侧向扭转的，是腿足顶端插入束腰和牙板内的连接区，双榫应落在腿足上口而不是案面中央。'
      },
      {
        id: 'hs2',
        label: '桌底霸王枨节点',
        x: '50.63%',
        y: '73.33%',
        requiredJoint: 'paWangJoint',
        successPhoto: '/images/ancient-table-hs2.jpg',
        tip: '霸王枨的关键节点在两侧斜撑汇入中部、共同分担下盘侧向晃动的位置，应落在桌底斜撑交会区，才能体现“撑架稳骨”的力学作用。'
      }
    ]
  },
  {
    id: 'luban-box',
    shortName: '秘匣',
    name: '鲁班秘匣',
    subtitle: '第五章 · 匠心终试',
    intro: '终章不再只修“看得见”的外表，而是挑战多向互锁与组合次序。真正的木作高手，须懂结构也懂机关。',
    realPhoto: '/images/luban-box-main.png',
    panoramaPhoto: '/images/luban-box-main.png',
    cultureText: '鲁班秘匣象征古代匠人对于结构、机关与秩序的极致追求。错一榫，满盘皆乱；归一位，八面自稳。',
    panoramaText: '双联卯眼与三才锁核心机关同时闭合，这只秘匣终于再度严丝合缝。你所修复的，正是榫卯之学的最后一道门。',
    requiredJoints: ['twojoint', 'lubanLock'],
    hotspots: [
      {
        id: 'hs1',
        label: '双联锁眼结构',
        x: '46.25%',
        y: '63.33%',
        requiredJoint: 'twojoint',
        successPhoto: '/images/luban-box-hs1.jpg',
        tip: '双联卯眼应落在匣体正面主锁位附近、两处孔位同时对正的区域，只有前板与内芯一并归中，双联结构才会顺势咬合。'
      },
      {
        id: 'hs2',
        label: '三才锁核心机关',
        x: '68.13%',
        y: '53.33%',
        requiredJoint: 'lubanLock',
        successPhoto: '/images/luban-box-hs2.jpg',
        tip: '三才锁真正的中枢不在表面中央，而在侧板、顶板与内芯互相制约的交界区；节点需贴近上部侧面机关位，才能体现多向互锁的次序。'
      }
    ]
  }
].map((chapter) => ({
  ...chapter,
  joints: chapter.requiredJoints,
  hotspots: chapter.hotspots.map(createHotspot)
}));

const chapterStates = ref(
  CHAPTERS.reduce((acc, chapter) => {
    acc[chapter.id] = chapter.hotspots.map(createHotspot);
    return acc;
  }, {})
);

const activeHotspot = ref(null);
const aiFeedback = ref(null);
const isAiThinking = ref(false);
const successSpot = ref(null);
const successChapter = ref(null);
const isFullyRepaired = ref(false);
const isShake = ref(false);
const currentChapterId = ref(CHAPTERS[0].id);
const pendingChapterId = ref(null);

const getJointName = (id) => JOINT_NAMES[id] || '未知榫卯';
const getJointUsage = (id) => JOINT_USAGE[id] || '各有其位，须审势而用。';

const currentChapter = computed(() => CHAPTERS.find((chapter) => chapter.id === currentChapterId.value) || CHAPTERS[0]);
const currentHotspots = computed(() => chapterStates.value[currentChapterId.value] || []);
const repairedCount = computed(() => currentHotspots.value.filter((spot) => spot.isRepaired).length);
const currentChapterIndex = computed(() => CHAPTERS.findIndex((chapter) => chapter.id === currentChapterId.value));
const isTutorialChapter = computed(() => currentChapter.value.id === CHAPTERS[0].id && !store.hasSeenTutorial);
const isChapterAccessible = (chapter) => {
  if (!chapter) return false;
  const chapterIndex = CHAPTERS.findIndex((item) => item.id === chapter.id);
  return chapterIndex !== -1 && chapterIndex <= currentChapterIndex.value + 1;
};
const unlockedChapterList = computed(() => CHAPTERS.filter((chapter) => isChapterAccessible(chapter)));

const nextChapterToUnlock = computed(() => CHAPTERS[currentChapterIndex.value + 1] || null);
const showWorkshopJump = computed(() => isTutorialChapter.value && !store.inventory.includes('straight'));

const syncChapterRepairState = (chapterId) => {
  const isUnlocked = store.unlockedBuildings.includes(chapterId);
  const chapterHotspots = chapterStates.value[chapterId];
  if (!chapterHotspots) return;

  chapterHotspots.forEach((spot) => {
    if (isUnlocked) {
      spot.isRepaired = true;
    }
  });

  if (chapterId === currentChapterId.value) {
    isFullyRepaired.value = chapterHotspots.every((spot) => spot.isRepaired);
  }
};

const switchChapter = (chapterId) => {
  if (!chapterStates.value[chapterId]) return;

  const targetChapter = CHAPTERS.find((chapter) => chapter.id === chapterId);
  if (!targetChapter || !isChapterAccessible(targetChapter)) return;

  pendingChapterId.value = null;
  currentChapterId.value = chapterId;
  activeHotspot.value = null;
  aiFeedback.value = null;
  successSpot.value = null;
  syncChapterRepairState(chapterId);
};

const closeInventory = () => {
  activeHotspot.value = null;
};

const jumpToWorkshop = (jointType) => {
  activeHotspot.value = null;
  aiFeedback.value = null;
  emit('go-workshop', jointType);
};

const goToNextChapter = () => {
  const nextChapter = CHAPTERS[currentChapterIndex.value + 1];
  if (!nextChapter) return;
  switchChapter(nextChapter.id);
};

const syncPendingChapterAccess = () => {
  if (!pendingChapterId.value) return;
  const pendingChapter = CHAPTERS.find((chapter) => chapter.id === pendingChapterId.value);
  if (!pendingChapter) {
    pendingChapterId.value = null;
    return;
  }
  if (isChapterAccessible(pendingChapter)) {
    switchChapter(pendingChapter.id);
  }
};

const onHotspotClick = (spot) => {
  if (spot.isRepaired) return;

  if (isTutorialChapter.value) {
    if (spot.id !== 'hs1') {
      aiFeedback.value = '莫急，我们先看看这处最吃力的柱础。这里的榫头已经朽烂了。';
      return;
    }

    if (!store.inventory.includes(spot.requiredJoint)) {
      aiFeedback.value = '这就是我说的。直榫已折断，结构岌岌可危。我们需要在工坊里亲手制作一个，快随我出发！';
      return;
    }
  }

  activeHotspot.value = spot;
};

const submitJoint = async (jointId) => {
  const spot = activeHotspot.value;
  if (!spot) return;
  activeHotspot.value = null;

  if (jointId === spot.requiredJoint) {
    isAiThinking.value = false;
    aiFeedback.value = null;
    spot.isRepaired = true;
    successChapter.value = currentChapter.value;

    if (isTutorialChapter.value && spot.id === 'hs1') {
      completeTutorial();
    }

    successSpot.value = spot;
    return;
  }

  isAiThinking.value = true;
  const structureName = `${currentChapter.value.name} · ${spot.label}`;
  const wrongName = getJointName(jointId);
  const rightName = getJointName(spot.requiredJoint);
  const reply = await fetchRepairFeedback(structureName, wrongName, rightName);
  isAiThinking.value = false;
  aiFeedback.value = reply;
  isShake.value = true;
  setTimeout(() => { isShake.value = false; }, 600);
};

const checkBuildingUnlock = () => {
  const allDone = currentHotspots.value.every((spot) => spot.isRepaired);
  if (!allDone) {
    isFullyRepaired.value = false;
    return;
  }

  unlockBuilding(currentChapter.value.id);
  isFullyRepaired.value = true;
};

const closeSuccess = () => {
  successSpot.value = null;
  successChapter.value = null;
  checkBuildingUnlock();
};

const handleTutorialJump = () => {
  if (isTutorialChapter.value && !store.inventory.includes('straight')) {
    jumpToWorkshop('straight');
    return;
  }

  aiFeedback.value = null;
};

CHAPTERS.forEach((chapter) => syncChapterRepairState(chapter.id));
syncPendingChapterAccess();
</script>

<style scoped>
.repair-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background:
    radial-gradient(circle at top, rgba(255, 223, 160, 0.18), transparent 28%),
    linear-gradient(180deg, #f1e4c7 0%, #ead7b0 45%, #dbc192 100%);
  overflow: hidden;
}

.building-canvas {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-inner {
  position: relative;
  width: 90vw;
  height: 67.5vw;
  max-width: 120vh;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panorama-overlay {
  position: absolute;
  inset: 0;
  z-index: 12;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 92px 32px 36px;
  pointer-events: none;
  background: linear-gradient(to top, rgba(16, 10, 4, 0.72), rgba(16, 10, 4, 0.08) 42%, transparent 70%);
}

.panorama-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.08) contrast(1.02);
}

.panorama-caption {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding: 18px 24px;
  border: 1px solid rgba(240, 208, 128, 0.4);
  border-radius: 16px;
  background: rgba(20, 12, 4, 0.58);
  color: #f6e3b0;
  text-align: center;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(6px);
}

.panorama-caption h3 {
  margin: 0 0 8px;
  font-family: '楷体', serif;
  font-size: 28px;
  color: #f7d58f;
  letter-spacing: 2px;
}

.panorama-caption p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
}

.panorama-fade-enter-active,
.panorama-fade-leave-active {
  transition: opacity 0.8s ease;
}

.panorama-fade-enter-from,
.panorama-fade-leave-to {
  opacity: 0;
}

.real-photo-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  z-index: 3;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: opacity 2s ease-in-out, filter 2s;
  filter: sepia(0.5) grayscale(0.5) blur(4px);
  pointer-events: none;
}

.building-canvas.reveal-photo .real-photo-bg {
  opacity: 0.85;
  filter: sepia(0) grayscale(0) blur(0);
}

.blueprint-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  transition: opacity 2s ease-in-out;
}

.building-canvas.reveal-photo .blueprint-container {
  opacity: 0.15;
}

.building-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
}

.blueprint-lines path {
  stroke-dasharray: 4000;
  stroke-dashoffset: 4000;
  animation: draw-sketch 3.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes draw-sketch {
  to { stroke-dashoffset: 0; }
}

.building-canvas::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.62;
  background-image:
    radial-gradient(circle at 50% 50%, transparent 20%, #d8c3a5 100%),
    repeating-linear-gradient(45deg, rgba(139, 90, 43, 0.05) 0px, rgba(139, 90, 43, 0.05) 2px, transparent 2px, transparent 4px),
    repeating-linear-gradient(-45deg, rgba(139, 90, 43, 0.05) 0px, rgba(139, 90, 43, 0.05) 2px, transparent 2px, transparent 4px);
  pointer-events: none;
  z-index: 1;
}

.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 72px;
  background: linear-gradient(to bottom, rgba(18, 12, 6, 0.92), rgba(18, 12, 6, 0.38), transparent);
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 24px;
  z-index: 20;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.back-btn {
  background: transparent;
  border: 1px solid rgba(200, 160, 80, 0.5);
  color: #f0deb0;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
}

.back-btn:hover {
  background: rgba(200, 160, 80, 0.2);
}

.building-title {
  color: #f0d080;
  font-family: '楷体', serif;
  margin: 0;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.chapter-subtitle {
  margin: 0;
  color: rgba(240, 222, 176, 0.76);
  font-size: 13px;
  letter-spacing: 2px;
}

.chapter-switcher {
  margin-left: auto;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.chapter-chip {
  border: 1px solid rgba(213, 169, 106, 0.45);
  background: rgba(38, 24, 10, 0.55);
  color: #efdba8;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.chapter-chip.active,
.chapter-chip:hover {
  background: linear-gradient(135deg, rgba(200, 154, 90, 0.95), rgba(128, 74, 27, 0.95));
  color: #fff6e5;
}

.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  mix-blend-mode: multiply;
}

.hotspot .dot {
  width: 20px;
  height: 20px;
  background: #b22222;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  box-shadow: inset -2px -2px 6px rgba(0, 0, 0, 0.3), 0 0 6px rgba(178, 34, 34, 0.6);
  transition: all 0.5s;
  animation: ink-breathe 4s infinite alternate;
}

@keyframes ink-breathe {
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: scale(1); }
  100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; transform: scale(1.1); }
}

.hotspot .ring {
  position: absolute;
  inset: -12px;
  border: 2px dashed #b22222;
  border-radius: 50%;
  animation: spin 4s linear infinite;
  opacity: 0.7;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.hotspot.tutorial-glow .ring {
  border-width: 3px;
  border-color: #ffd700;
  box-shadow: 0 0 15px #ffd700;
}

.hotspot.repaired .dot {
  background: #2e8b57;
  animation: none;
}

.hotspot.repaired .ring {
  display: none;
}

.hotspot .label,
.hotspot .joint-hint {
  background: rgba(244, 232, 209, 0.92);
  color: #5c3a21;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: '楷体', serif;
  font-size: 14px;
  white-space: nowrap;
  border: 1px solid #c8a165;
}

.hotspot .joint-hint {
  font-size: 12px;
  opacity: 0.95;
}

.chapter-progress-panel {
  position: absolute;
  right: 24px;
  top: 104px;
  width: min(360px, 32vw);
  z-index: 30;
  padding: 18px;
  border-radius: 18px;
  background: rgba(26, 16, 6, 0.72);
  border: 1px solid rgba(212, 169, 106, 0.28);
  color: #f1dfb3;
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.panel-head h3 {
  margin: 0;
  font-family: '楷体', serif;
  font-size: 22px;
  color: #f3d08c;
}

.panel-head span,
.panel-desc {
  font-size: 13px;
  line-height: 1.7;
}

.required-title {
  margin-bottom: 8px;
  color: rgba(240, 222, 176, 0.72);
}

.required-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.joint-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 248, 234, 0.08);
  border: 1px solid rgba(212, 169, 106, 0.24);
  font-size: 13px;
}

.joint-pill b {
  font-weight: 400;
  color: #f7d58f;
}

.chapter-hotspot-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.chapter-hotspot-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 248, 234, 0.06);
  border: 1px solid rgba(212, 169, 106, 0.18);
}

.chapter-hotspot-item.done {
  border-color: rgba(76, 175, 80, 0.35);
  background: rgba(76, 175, 80, 0.12);
}

.chapter-hotspot-item strong {
  display: block;
  margin-bottom: 4px;
}

.chapter-hotspot-item p {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(240, 222, 176, 0.75);
}

.chapter-hotspot-item span {
  white-space: nowrap;
  color: #f6d28d;
}

.next-chapter-btn {
  width: 100%;
  margin-top: 16px;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  color: #fff8ea;
  font-family: '楷体', serif;
  font-size: 16px;
}

.next-chapter-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.inventory-modal-bg,
.success-modal-bg {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.success-modal-bg {
  z-index: 320;
}
.inventory-modal {
  background: #e6e2d3;
  border: 2px solid #8b5a2b;
  border-radius: 12px;
  width: min(460px, 92vw);
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.success-modal {
  width: min(720px, 92vw);
  max-height: 88vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #2d1c08, #1a0f04);
  border: 2px solid #c89a5a;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 18px 48px rgba(0,0,0,0.65);
  color: #f0deb0;
}
.success-modal h2 {
  margin: 0;
  font-family: '楷体', serif;
  font-size: 30px;
  color: #f6d28d;
  text-align: center;
}
.success-sub {
  margin: 10px 0 18px;
  text-align: center;
  color: rgba(240,222,176,0.9);
  font-size: 16px;
}
.culture-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(200,154,90,0.35);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.real-photo {
  width: 100%;
  height: min(280px, 38vh);
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(200,154,90,0.35);
}
.culture-text {
  margin: 0;
  line-height: 1.8;
  font-size: 15px;
  color: #e8d8b0;
}
.chapter-unlock-box {
  margin-top: 16px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 248, 234, 0.06);
  border: 1px solid rgba(200, 154, 90, 0.28);
}
.chapter-unlock-box p {
  margin: 0 0 12px;
  line-height: 1.8;
}
.action-btn.secondary {
  width: 100%;
  background: rgba(255, 248, 234, 0.12);
  color: #f5dfb1;
  border: 1px solid rgba(200, 154, 90, 0.32);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #8b5a2b; padding-bottom: 10px; margin-bottom: 15px;}
.modal-header h3 { margin: 0; font-family: '楷体', serif; color: #8b5a2b; font-size: 22px;}
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #8b5a2b;}
.modal-desc,
.modal-subdesc,
.empty-hint {
  color: #5a4630;
  line-height: 1.7;
}
.modal-subdesc {
  margin-top: 8px;
}
.inventory-grid {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}
.joint-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px;
  background: #f7f5ec;
  border: 1px solid #c8a165;
  border-radius: 8px;
  font-family: '楷体', serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}
.joint-item small {
  color: rgba(92, 58, 33, 0.76);
  font-size: 12px;
}
.joint-item:hover,
.joint-item.recommended { background: #8b5a2b; color: #fff; }
.joint-item:hover small,
.joint-item.recommended small {
  color: rgba(255, 248, 234, 0.82);
}

.feedback-modal {
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: min(360px, 88vw);
  background: rgba(40,25,10,0.9);
  border: 2px solid #d4a96a;
  border-radius: 12px;
  padding: 20px;
  color: #f0deb0;
  z-index: 110;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
}
.luban-avatar {
  font-family: '楷体', serif;
  font-size: 20px;
  margin-bottom: 10px;
  color: #f3d08c;
}
.typing-text {
  margin: 0;
  line-height: 1.9;
}
.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  color: #f0d080;
  pointer-events: none;
}
.loading-spinner {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 3px solid rgba(240, 208, 128, 0.18);
  border-top-color: #f0d080;
  animation: spin 0.9s linear infinite;
  margin-bottom: 12px;
}
.shake-error {
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.action-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: '楷体', serif;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.action-btn:hover {
  transform: translateY(-1px);
}
.action-btn.primary {
  margin-top: 16px;
  width: 100%;
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  color: #fff8ea;
  box-shadow: 0 8px 22px rgba(200,154,90,0.35);
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(20px); }
.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop-in { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); }}

@media (max-width: 1200px) {
  .chapter-progress-panel {
    width: min(320px, 36vw);
  }
}

@media (max-width: 960px) {
  .top-nav {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .chapter-switcher {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }

  .chapter-progress-panel {
    left: 20px;
    right: 20px;
    top: auto;
    bottom: 20px;
    width: auto;
  }
}
</style>
