<template>
  <div class="three-container" ref="containerRef">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ level.name }}构件加载中...</p>
    </div>

    <!-- 操作提示 -->
    <div v-if="!isLoading" class="hint-panel">
      <template v-if="level.type === 'dovetail'">
        <p>⚠️ <b>燕尾榫已旋转 90°</b>，需先按 <b>R</b> 旋转回正方向</p>
        <p>🖱️ 对准后<b>从侧面水平推入</b>卯眼</p>
      </template>
      <template v-else-if="level.type === 'twojoint'">
        <p>🎯 需将<b>两个榫头</b>分别放入对应卯眼</p>
        <p>⚠️ <b>右侧榫头</b>需先按 <b>R</b> 旋转 90° 才能插入</p>
      </template>
      <template v-else>
        <p>🖱️ <b>左键拖拽</b>深色榫头对准卯眼</p>
        <p>🖱️ 悬停后<b>滚轮</b>调整前后深度</p>
      </template>
      <p>🔄 <b>右键</b>旋转视角 &nbsp;|&nbsp; <b>R/E</b> 旋转榫头 ±45°</p>
    </div>

    <!-- 进度指示（多件关卡） -->
    <div v-if="!isLoading && totalPieces > 1" class="progress-bar">
      <span v-for="i in totalPieces" :key="i"
            :class="['progress-dot', { done: i <= placedCount }]"></span>
      <span class="progress-label">{{ placedCount }}/{{ totalPieces }} 已就位</span>
    </div>

    <!-- 重置 + 旋转提示 -->
    <div v-if="!isLoading && !allTriggered" class="bottom-bar">
      <button class="reset-btn" @click="resetAll">↺ 重置</button>
      <div class="rotate-hint">[ R ] 旋转 +45° &nbsp; [ E ] 旋转 -45°</div>
    </div>

    <!-- 教程提示层 -->
    <transition name="fade">
      <div v-if="showTutorialTip" class="tutorial-tip-overlay">
        <div class="tip-avatar">🧔🏻‍♂️</div>
        <div class="tip-content">
          <h4 class="tip-title">匠人提点</h4>
          <p class="tip-text">{{ tutorialTipText }}</p>
          <button class="tip-btn" @click="showTutorialTip = false">明白了</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildLevel } from './ThreeLevelFactory';
import * as Helpers from '../utils/threeHelpers';
import { audioSystem } from '../utils/audioSystem';
import { store } from '../store';

// ── Props & Emits ──────────────────────────────────────────────
const props = defineProps({ level: { type: Object, required: true } });
const emit  = defineEmits(['assemble-success']);

// ── 响应式 UI 状态 ─────────────────────────────────────────────
const containerRef = ref(null);
const isLoading    = ref(true);
const totalPieces  = ref(1);
const placedCount  = ref(0);
const allTriggered = ref(false);

// ── 教程状态 ─────────────────────────────────────────────
const showTutorialTip = ref(false);
const tutorialTipText = ref("");

// ── Three.js 核心 ──────────────────────────────────────────────
let renderer, scene, camera, controls, animationId;
let isSceneActive = true;
let lastFrameTime = 0;
const FRAME_INTERVAL = 1000 / 30;

// ── 多件系统 ──────────────────────────────────────────────────
// 每件：{ mesh: Group, target: Vector3, targetRotY: Number,
//         initPos: Vector3, initRotY: Number, placed: Boolean }
let pieces = [];
let dragTarget  = null;    // 当前正在拖拽的 piece 对象
let hoverPiece  = null;    // 当前悬停的 piece 对象
let mortisePiece = null;

// ── 交互状态 ──────────────────────────────────────────────────
let isDragging    = false;
let hasPlayerMoved = false;
const prevMouse  = new THREE.Vector2();
const raycaster  = new THREE.Raycaster();
const mouse      = new THREE.Vector2();

// ── 关卡共用参数 ───────────────────────────────────────────────
let SNAP_DIST   = 0.6;
let SNAP_ROT    = 0.45;   // 旋转吸附容差（弧度），约 ±26°
let BREATH_AXIS = 'y';


// ═══════════════════════════════════════════════════════════════
//  Three.js 初始化
// ═══════════════════════════════════════════════════════════════
const initThree = () => {
  const container = containerRef.value;
  const W = container.clientWidth, H = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#12100a');
  scene.fog = new THREE.FogExp2('#12100a', 0.04);

  camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled  = true;
  renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace   = THREE.SRGBColorSpace;
  renderer.toneMapping        = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance   = 3;
  controls.maxDistance   = 22;
  controls.mouseButtons  = { LEFT: null, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };

  Helpers.buildLights(scene);
  Helpers.buildGround(scene);

  // 使用工厂构建关卡，并更新本地状态
  const levelData = buildLevel(props.level.type, { scene, camera, controls });
  pieces       = levelData.pieces;
  mortisePiece = levelData.mortisePiece;
  totalPieces.value = levelData.totalPieces;
  BREATH_AXIS  = levelData.breathAxis;
  SNAP_DIST    = levelData.snapDist || 0.6;
  SNAP_ROT     = levelData.snapRot || 0.45;

  const el = renderer.domElement;
  el.addEventListener('mousedown', onMouseDown);
  el.addEventListener('mousemove', onMouseMove);
  el.addEventListener('mouseup',   onMouseUp);
  el.addEventListener('wheel',     onWheel, { passive: false });
  window.addEventListener('resize',  onWindowResize);
  window.addEventListener('keydown', onKeyDown);
  document.addEventListener('visibilitychange', onVisibilityChange);

  isLoading.value = false;
  
  // 教程引导逻辑
  if (props.level.id === 1) {
    showTutorialTip.value = true;
    tutorialTipText.value = "这是最基础的直榫。左键拖拽深色构件，滚轮可以推拉深度。对准后它会‘咔哒’一声扣合入位。";
  }

  animate();
};


// ── 收集 piece 下所有 Mesh ──────────────────────────────────
const getMeshes = (piece) => {
  const r = [];
  piece.mesh.traverse(o => { if (o.isMesh) r.push(o); });
  return r;
};

const getAllTenonMeshes = () => pieces.flatMap(p => getMeshes(p));


// ═══════════════════════════════════════════════════════════════
//  悬停高亮
// ═══════════════════════════════════════════════════════════════
const setHighlight = (piece, active) => {
  if (!piece || piece.placed) return;
  piece.mesh.traverse(o => {
    if (o.isMesh) {
      o.material.emissive = new THREE.Color(active ? '#c07030' : '#000000');
      o.material.emissiveIntensity = active ? 0.28 : 0.0;
    }
  });
  renderer.domElement.style.cursor = active ? 'grab' : 'default';
};


// ═══════════════════════════════════════════════════════════════
//  键盘：R(+45°) / E(-45°) 旋转当前悬停或拖拽中的榫头
// ═══════════════════════════════════════════════════════════════
const onKeyDown = (e) => {
  if (allTriggered.value) return;
  const active = dragTarget || hoverPiece;
  if (!active || active.placed) return;

  const step = Math.PI / 4;   // 45°
  if (e.key === 'r' || e.key === 'R') {
    active.mesh.rotation.y += step;
    audioSystem.playClick();
  }
  if (e.key === 'e' || e.key === 'E') {
    active.mesh.rotation.y -= step;
    audioSystem.playClick();
  }

  // 白色旋转闪烁反馈
  active.mesh.traverse(o => {
    if (!o.isMesh) return;
    o.material.emissive = new THREE.Color('#ffffff');
    o.material.emissiveIntensity = 0.55;
    setTimeout(() => {
      o.material.emissive = new THREE.Color('#c07030');
      o.material.emissiveIntensity = (hoverPiece === active || dragTarget === active) ? 0.28 : 0.0;
    }, 180);
  });
  checkAllSnaps();
};


// ═══════════════════════════════════════════════════════════════
//  鼠标事件
// ═══════════════════════════════════════════════════════════════
const onMouseDown = (e) => {
  if (e.button !== 0 || allTriggered.value) return;
  updateMouse(e);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(getAllTenonMeshes());
  if (hits.length > 0) {
    const hitObj = hits[0].object;
    dragTarget = pieces.find(p => getMeshes(p).includes(hitObj)) || null;
    if (dragTarget && !dragTarget.placed) {
      isDragging = true;
      hasPlayerMoved = true;
      controls.enabled = false;
      prevMouse.set(e.clientX, e.clientY);
      renderer.domElement.style.cursor = 'grabbing';
    }
  }
};

const onMouseMove = (e) => {
  if (allTriggered.value) return;

  if (isDragging && dragTarget) {
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    const dist   = camera.position.distanceTo(dragTarget.mesh.position);
    const fovRad = camera.fov * Math.PI / 180;
    const scale  = (2 * Math.tan(fovRad / 2) * dist) / containerRef.value.clientHeight;
    const right  = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
    const up     = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
    dragTarget.mesh.position.addScaledVector(right, dx * scale);
    dragTarget.mesh.position.addScaledVector(up,  -dy * scale);
    prevMouse.set(e.clientX, e.clientY);
    checkAllSnaps();
  } else {
    // 悬停检测
    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(getAllTenonMeshes());
    const nowHoverPiece = hits.length > 0
      ? pieces.find(p => getMeshes(p).includes(hits[0].object)) || null
      : null;
    if (nowHoverPiece !== hoverPiece) {
      if (hoverPiece) setHighlight(hoverPiece, false);
      hoverPiece = nowHoverPiece;
      if (hoverPiece) setHighlight(hoverPiece, true);
    }
  }

  // 辉光强度更新：每个 piece 对应的卯眼独立更新
  for (const p of pieces) {
    if (p.placed) continue;
    const m = p.mortise || (pieces.length === 1 ? mortisePiece : null);
    if (!m) continue;
    const dist = p.mesh.position.distanceTo(p.target);
    const glow = m.getObjectByName('slotGlow');
    if (glow) glow.material.emissiveIntensity = Math.max(0, 1 - dist / 4.5) * 1.8;
  }
};

const onMouseUp = (e) => {
  if (e.button !== 0) return;
  isDragging = false;
  dragTarget = null;
  controls.enabled = true;
  renderer.domElement.style.cursor = hoverPiece ? 'grab' : 'default';
};

const onWheel = (e) => {
  if (allTriggered.value) return;
  const active = dragTarget || hoverPiece;
  if (active && !active.placed) {
    e.preventDefault();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    active.mesh.position.addScaledVector(forward, -e.deltaY * 0.008);
    checkAllSnaps();
  }
};


// ═══════════════════════════════════════════════════════════════
//  吸附检测：角度 + 距离都满足才吸附
// ═══════════════════════════════════════════════════════════════
const normalizeAngle = (a) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

const isRotOK = (piece) => {
  const cur = normalizeAngle(piece.mesh.rotation.y);
  const tgt = normalizeAngle(piece.targetRotY);
  const diff = Math.abs(cur - tgt);
  return diff < SNAP_ROT || Math.PI * 2 - diff < SNAP_ROT;
};

const checkAllSnaps = () => {
  for (const p of pieces) {
    if (p.placed) continue;
    if (p.mesh.position.distanceTo(p.target) < SNAP_DIST && isRotOK(p)) {
      snapPiece(p);
    }
  }
};

const snapPiece = (piece) => {
  piece.placed = true;
  piece.mesh.position.copy(piece.target);
  piece.mesh.rotation.y = piece.targetRotY;
  placedCount.value++;
  
  // 播放物理扣合音效
  audioSystem.playSnap();

  // 榫头：金色发光（用 emissive 叠加，保留原色以便 reset 还原）
  piece.mesh.traverse(o => {
    if (o.isMesh) {
      o.material.emissive    = new THREE.Color('#c8900a');
      o.material.emissiveIntensity = 1.2;
      o.material.metalness   = 0.5;
      o.material.roughness   = 0.3;
    }
  });

  // 卯眼：对应的 mortise 变金（per-piece 或 fallback 到全局 mortisePiece）
  const targetMortise = piece.mortise || mortisePiece;
  if (targetMortise) {
    targetMortise.traverse(o => {
      if (o.isMesh && o.name !== 'slotGlow') {
        o.material.emissive          = new THREE.Color('#7a5010');
        o.material.emissiveIntensity = 0.7;
      }
    });
    const glow = targetMortise.getObjectByName('slotGlow');
    if (glow) glow.visible = false;
  }

  if (placedCount.value >= pieces.length) {
    allTriggered.value = true;
    setTimeout(() => emit('assemble-success'), 500);
  }
};


// ═══════════════════════════════════════════════════════════════
//  重置
// ═══════════════════════════════════════════════════════════════
const resetAll = () => {
  if (allTriggered.value) return;
  placedCount.value = 0;
  hasPlayerMoved = false;
  pieces.forEach(p => {
    // 位置 & 旋转复位
    p.mesh.position.copy(p.initPos);
    p.mesh.rotation.y = p.initRotY;
    p.placed = false;
    // 材质还原（清除 emissive 金色效果，恢复原始颜色）
    p.mesh.traverse(o => {
      if (o.isMesh) {
        const origHex = p.origColors.get(o.uuid);
        if (origHex !== undefined) o.material.color.setHex(origHex);
        o.material.emissive.set('#000000');
        o.material.emissiveIntensity = 0;
        o.material.metalness = o.material.metalness > 0.1 ? 0 : o.material.metalness;
      }
    });
    // 卯眼辉光恢复可见
    const targetMortise = p.mortise || mortisePiece;
    if (targetMortise) {
      const glow = targetMortise.getObjectByName('slotGlow');
      if (glow) { glow.visible = true; glow.material.emissiveIntensity = 0; }
      targetMortise.traverse(o => {
        if (o.isMesh && o.name !== 'slotGlow') {
          o.material.emissive.set('#000000');
          o.material.emissiveIntensity = 0;
        }
      });
    }
  });
};


// ═══════════════════════════════════════════════════════════════
//  工具
// ═══════════════════════════════════════════════════════════════
const updateMouse = (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
};

const onWindowResize = () => {
  const W = containerRef.value.clientWidth;
  const H = containerRef.value.clientHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
};

const onVisibilityChange = () => {
  isSceneActive = document.visibilityState === 'visible';
};


// ═══════════════════════════════════════════════════════════════
//  动画循环（引导息动画：仅首次未移动时）
// ═══════════════════════════════════════════════════════════════
const animate = (now = 0) => {
  animationId = requestAnimationFrame(animate);
  if (!isSceneActive) return;
  if (now - lastFrameTime < FRAME_INTERVAL) return;
  lastFrameTime = now;

  controls.update();

  if (!allTriggered.value && !hasPlayerMoved) {
    const breath = Math.sin(now * 0.0015) * 0.1;
    pieces.forEach(p => {
      if (p.placed) return;
      if (BREATH_AXIS === 'y') {
        p.mesh.position.set(p.initPos.x, p.initPos.y + breath, p.initPos.z);
      } else {
        p.mesh.position.set(p.initPos.x + breath, p.initPos.y, p.initPos.z);
      }
    });
  }

  renderer.render(scene, camera);
};


// ═══════════════════════════════════════════════════════════════
//  生命周期
// ═══════════════════════════════════════════════════════════════
onMounted(() => { initThree(); });
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  const el = renderer?.domElement;
  el?.removeEventListener('mousedown', onMouseDown);
  el?.removeEventListener('mousemove', onMouseMove);
  el?.removeEventListener('mouseup',   onMouseUp);
  el?.removeEventListener('wheel',     onWheel);
  window.removeEventListener('resize',  onWindowResize);
  window.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  controls?.dispose();
  renderer?.dispose();
});
</script>

<style scoped>
.three-container {
  width: 100%; height: 100%;
  position: absolute; top: 0; left: 0;
  z-index: 1; overflow: hidden;
}
.loading-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #12100a; z-index: 5; gap: 18px;
}
.loading-spinner {
  width: 48px; height: 48px;
  border: 4px solid rgba(200,150,60,0.2); border-top-color: #c89640;
  border-radius: 50%; animation: spin 0.85s linear infinite;
}
.loading-text { color: #c89640; font-family: "楷体", serif; font-size: 18px; letter-spacing: 3px; }
@keyframes spin { to { transform: rotate(360deg); } }

.hint-panel {
  position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: rgba(10,7,3,0.78); border: 1px solid rgba(200,150,60,0.35);
  border-radius: 10px; padding: 10px 24px;
  display: flex; flex-direction: column; gap: 5px;
  color: rgba(220,180,100,0.82); font-size: 13px; line-height: 1.8;
  pointer-events: none; backdrop-filter: blur(8px); z-index: 5; white-space: nowrap;
}
.hint-panel b { color: #e8c060; }

/* 多件进度 */
.progress-bar {
  position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 8px;
  background: rgba(10,7,3,0.7); border: 1px solid rgba(200,150,60,0.3);
  border-radius: 24px; padding: 7px 18px; backdrop-filter: blur(6px); z-index: 5;
}
.progress-dot {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(200,150,60,0.5); background: transparent;
  transition: all 0.4s;
}
.progress-dot.done { background: #c89a5a; border-color: #f0d080; box-shadow: 0 0 8px rgba(240,208,128,0.5); }
.progress-label { font-size: 12px; color: #c89a5a; letter-spacing: 1px; }

/* 底部栏 */
.bottom-bar {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 16px; align-items: center; z-index: 5;
}
.reset-btn {
  padding: 8px 24px;
  background: rgba(10,7,3,0.75); border: 1px solid rgba(200,150,60,0.4);
  border-radius: 24px; color: #c89640; font-family: "楷体", serif; font-size: 15px;
  cursor: pointer; backdrop-filter: blur(6px); transition: all 0.2s;
}
.reset-btn:hover { background: rgba(139,90,30,0.5); transform: translateY(-2px); }
.rotate-hint {
  font-size: 12px; color: rgba(200,160,80,0.55);
  letter-spacing: 1px; white-space: nowrap;
}

/* 教程提示层 */
.tutorial-tip-overlay {
  position: absolute;
  top: 100px;
  right: 32px;
  width: 260px;
  background: linear-gradient(135deg, #2d1c08, #1a0f04);
  border: 1px solid #c89a5a;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 16px;
  z-index: 100;
  box-shadow: 0 12px 40px rgba(0,0,0,0.8);
  backdrop-filter: blur(12px);
  animation: slide-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.tip-avatar {
  font-size: 32px;
  flex-shrink: 0;
}
@keyframes slide-in {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.tip-title {
  font-family: "楷体", serif;
  color: #f0deb0;
  margin: 0 0 6px 0;
  font-size: 16px;
}
.tip-text {
  color: rgba(200, 170, 90, 0.85);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}
.tip-btn {
  background: #c89a5a;
  color: #1a0f04;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
