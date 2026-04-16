<template>
  <div class="assembly-wrap">
    <header class="assembly-nav">
      <button class="back-btn" @click="$emit('back')">← 返回游戏</button>
      <div class="nav-center">
        <h1 class="nav-title">⚒ 古建自由拼装</h1>
        <p class="nav-sub">自由选择已解锁构件，把整座房架慢慢拼起来</p>
      </div>
      <button class="finish-btn" @click="checkCompletion">{{ buildMode === 'guide' ? '完工验收 ✓' : '查看创作 ✓' }}</button>
    </header>

    <div class="assembly-body">
      <aside class="palette">
        <div class="palette-title">构件库</div>

        <div class="step-banner">
          <div class="step-label">{{ buildMode === 'guide' ? '教学搭建' : '自由创作' }}</div>
          <div class="step-title">{{ buildMode === 'guide' ? '当前可拼' : '创作模式' }}</div>
          <div class="step-desc">{{ availableTypeLabels }}</div>
        </div>

        <button
          v-if="canEnterFreeMode"
          class="mode-toggle-btn"
          @click="toggleBuildMode"
        >
          {{ buildMode === 'guide' ? '进入自由创作' : '返回教学搭建' }}
        </button>

        <div
          v-for="pt in PART_TYPES"
          :key="pt.id"
          :class="['part-btn', { active: selectedType === pt.id, disabled: !canSelectPart(pt.id), optional: pt.id === 'dougong' && isMainStructureComplete }]"
          @click="selectPart(pt.id)"
        >
          <div class="part-icon" :style="{ background: pt.color }"></div>
          <div class="part-text">
            <span class="part-label">{{ pt.label }}<small v-if="pt.id === 'dougong'">(选修)</small></span>
            <span class="part-count">已装 {{ getProgressText(pt.id) }}</span>
          </div>
        </div>

        <div class="palette-divider"></div>

        <div class="quick-tips">
          <p>🖱️ <b>左键</b>点击{{ buildMode === 'guide' ? '高亮安装点' : '地面任意位置' }}放置构件</p>
          <p>🎯 {{ buildMode === 'guide' ? '先在左侧选择构件，再去寻找对应安装点' : '自由模式下可任选构件，在地面自由组合房架' }}</p>
          <p>🔄 <b>右键拖拽</b>旋转视角，滚轮缩放观察</p>
          <p>⌨️ <b>Q / E</b>{{ buildMode === 'guide' ? '预览自由旋转视角' : '旋转当前待放构件方向' }}</p>
        </div>

        <div class="palette-divider"></div>
        <button class="clear-btn" @click="clearAll">🗑 清空重建</button>
      </aside>

      <div class="canvas-area" ref="containerRef">
        <div class="build-hud">
          <div class="build-step-chip">当前可拼：{{ availableTypeLabels }}</div>
          <div class="placement-message" :class="{ ok: placementState === 'ok', warn: placementState === 'warn' }">
            {{ placementHint }}
          </div>
        </div>

        <div v-if="selectedType" class="placing-indicator">
          <span class="placing-dot"></span>
          正在放置：{{ PART_TYPES.find(p => p.id === selectedType)?.label }}
          <span v-if="buildMode === 'free'" class="rotation-chip">角度 {{ Math.round((freeRotation * 180) / Math.PI) }}°</span>
          <button class="cancel-place" @click="cancelPlacement">✕ 取消</button>
        </div>
        <div v-else class="canvas-hint-top">{{ buildMode === 'guide' ? '从左侧自由选择已解锁构件，寻找高亮安装点' : '自由创作已开启：选择构件后可在地面任意落位' }}</div>
      </div>

      <aside class="blueprint">
        <div class="blueprint-title">{{ buildMode === 'guide' ? '标准房架图纸' : '自由创作参考' }}</div>
        <div class="svg-wrap">
          <svg viewBox="0 0 180 200" class="bp-svg">
            <line x1="5" y1="190" x2="175" y2="190" stroke="#c89a5a" stroke-width="1.5" opacity="0.6"/>
            <rect x="18" y="178" width="22" height="12" fill="#5a5a5a" rx="1" :opacity="isPartHighlighted('foundation') ? 1 : 0.6"/>
            <rect x="57" y="178" width="22" height="12" fill="#5a5a5a" rx="1" :opacity="isPartHighlighted('foundation') ? 1 : 0.6"/>
            <rect x="100" y="178" width="22" height="12" fill="#5a5a5a" rx="1" :opacity="isPartHighlighted('foundation') ? 1 : 0.6"/>
            <rect x="139" y="178" width="22" height="12" fill="#5a5a5a" rx="1" :opacity="isPartHighlighted('foundation') ? 1 : 0.6"/>
            <rect x="25" y="118" width="9" height="60" fill="#8b5a2b" rx="2" :opacity="isPartHighlighted('pillar') ? 1 : 0.6"/>
            <rect x="64" y="118" width="9" height="60" fill="#8b5a2b" rx="2" :opacity="isPartHighlighted('pillar') ? 1 : 0.6"/>
            <rect x="107" y="118" width="9" height="60" fill="#8b5a2b" rx="2" :opacity="isPartHighlighted('pillar') ? 1 : 0.6"/>
            <rect x="146" y="118" width="9" height="60" fill="#8b5a2b" rx="2" :opacity="isPartHighlighted('pillar') ? 1 : 0.6"/>
            <rect x="22" y="110" width="135" height="8" fill="#6b3d18" rx="2" :opacity="isPartHighlighted('beam') ? 1 : 0.6"/>
            <rect x="22" y="100" width="135" height="5" fill="#5a3010" rx="1" opacity="0.7"/>
            <rect x="22" y="105" width="12" height="7" fill="#c08840" rx="1" :opacity="isPartHighlighted('dougong') ? 1 : 0.4"/>
            <rect x="61" y="105" width="12" height="7" fill="#c08840" rx="1" :opacity="isPartHighlighted('dougong') ? 1 : 0.4"/>
            <rect x="104" y="105" width="12" height="7" fill="#c08840" rx="1" :opacity="isPartHighlighted('dougong') ? 1 : 0.4"/>
            <rect x="143" y="105" width="12" height="7" fill="#c08840" rx="1" :opacity="isPartHighlighted('dougong') ? 1 : 0.4"/>
            <polygon points="90,55 20,100 160,100" fill="#4a4a5a" :opacity="isPartHighlighted('roof') ? 1 : 0.85"/>
            <polygon points="90,55 30,98 150,98" fill="#3a3a4a" :opacity="isPartHighlighted('roof') ? 1 : 0.75"/>
            <rect x="60" y="50" width="60" height="8" fill="#5a5a6a" rx="2" :opacity="isPartHighlighted('ridgebeam') ? 1 : 0.6"/>
            <line x1="90" y1="55" x2="90" y2="100" stroke="#f0d080" stroke-width="1" opacity="0.18"/>
          </svg>
        </div>

        <div class="checklist-title">{{ buildMode === 'guide' ? '结构进度' : '创作提示' }}</div>
        <div v-if="buildMode === 'guide'" class="checklist">
          <div v-for="item in CHECKLIST" :key="item.key" :class="['check-item', { done: isChecklistDone(item.key), current: hasUnlockedSlots(item.key) && !isChecklistDone(item.key) }]">
            <span class="check-icon">{{ isChecklistDone(item.key) ? '✓' : hasUnlockedSlots(item.key) ? '➜' : '○' }}</span>
            <span class="check-label">{{ item.label }}</span>
            <span class="check-progress">{{ getProgressText(item.key) }}</span>
          </div>
        </div>
        <div v-else class="free-notes">
          <p>• 主体房架已经完成，现在可以自由重组构件。</p>
          <p>• 使用 <b>Q / E</b> 调整朝向，尝试不同屋面与梁柱组合。</p>
          <p>• 删除键可拆除当前选中的构件，方便反复试验。</p>
          <p>• 图纸仅作参考，你的作品不必完全照着标准样式。</p>
        </div>
      </aside>
    </div>

    <transition name="pop">
      <div v-if="showResult" class="result-overlay" @click.self="showResult = false">
        <div class="result-card">
          <div class="result-score-ring">
            <svg viewBox="0 0 60 60" class="ring-svg">
              <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(200,154,90,0.2)" stroke-width="5"/>
              <circle cx="30" cy="30" r="24" fill="none" :stroke="resultScore >= 4 ? '#f0d080' : '#c89a5a'" stroke-width="5" stroke-linecap="round" :stroke-dasharray="`${Math.min(resultScore, 5) * 30.16} 150.8`" transform="rotate(-90 30 30)" style="transition: stroke-dasharray 0.8s ease"/>
            </svg>
            <div class="ring-text">{{ resultScore }}/5</div>
          </div>

          <div class="result-emoji">{{ resultScore >= 5 ? '🏯' : resultScore >= 4 ? '🏆' : resultScore >= 2 ? '🔨' : '📐' }}</div>
          <h2 class="result-title">{{ resultTitle }}</h2>
          <p class="result-desc">{{ resultDesc }}</p>

          <div class="result-checks">
            <div v-for="item in CHECKLIST" :key="item.key" :class="['rc-item', { pass: isChecklistDone(item.key) }]">
              <span>{{ isChecklistDone(item.key) ? '✓' : '✗' }}</span>
              {{ item.label }}（{{ getProgressText(item.key) }}）
            </div>
          </div>

          <div class="result-actions">
            <button class="ra-btn primary" @click="showResult = false">{{ buildMode === 'guide' ? '继续搭建' : '继续创作' }}</button>
            <button v-if="buildMode === 'guide' && canEnterFreeMode" class="ra-btn accent" @click="showResult = false; buildMode !== 'free' && toggleBuildMode()">进入自由创作</button>
            <button class="ra-btn secondary" @click="clearAll(); showResult = false">重新开始</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audioSystem } from '../utils/audioSystem';

defineEmits(['back']);

const PART_TYPES = [
  { id: 'foundation', label: '础石', color: '#5a5a5a', w: 1.0, h: 0.28, d: 1.0, roughness: 0.95 },
  { id: 'pillar', label: '立柱', color: '#8b5a2b', w: 0.45, h: 3.2, d: 0.45, roughness: 0.72 },
  { id: 'beam', label: '横梁', color: '#6b3d18', w: 4.5, h: 0.48, d: 0.55, roughness: 0.78 },
  { id: 'dougong', label: '斗拱', color: '#c08840', w: 0.85, h: 0.48, d: 0.85, roughness: 0.65 },
  { id: 'ridgebeam', label: '正脊', color: '#4a4a5a', w: 5.2, h: 0.38, d: 0.48, roughness: 0.8 },
  { id: 'roof', label: '屋面', color: '#6f4b36', w: 5.8, h: 0.32, d: 2.8, roughness: 0.88 },
];

const BUILD_SLOTS = {
  foundation: [
    { id: 'f1', x: -3, y: 0.14, z: -2 },
    { id: 'f2', x: 3, y: 0.14, z: -2 },
    { id: 'f3', x: -3, y: 0.14, z: 2 },
    { id: 'f4', x: 3, y: 0.14, z: 2 },
  ],
  pillar: [
    { id: 'p1', x: -3, y: 1.88, z: -2, requires: 'f1' },
    { id: 'p2', x: 3, y: 1.88, z: -2, requires: 'f2' },
    { id: 'p3', x: -3, y: 1.88, z: 2, requires: 'f3' },
    { id: 'p4', x: 3, y: 1.88, z: 2, requires: 'f4' },
  ],
  beam: [
    { id: 'b1', x: 0, y: 3.68, z: -2, rot: 0, requires: ['p1', 'p2'] },
    { id: 'b2', x: 0, y: 3.68, z: 2, rot: 0, requires: ['p3', 'p4'] },
  ],
  ridgebeam: [
    { id: 'r1', x: 0, y: 5.1, z: 0, rot: 90, requires: ['b1', 'b2'] },
  ],
  roof: [
    { id: 'roof-left', x: -1.12, y: 4.94, z: 0, rot: 90, requires: ['r1'] },
    { id: 'roof-right', x: 1.12, y: 4.94, z: 0, rot: 90, requires: ['r1'] },
  ],
  dougong: [
    { id: 'd1', x: -2.42, y: 3.42, z: -2, requires: 'p1' },
    { id: 'd2', x: 2.42, y: 3.42, z: -2, requires: 'p2' },
    { id: 'd3', x: -2.42, y: 3.42, z: 2, requires: 'p3' },
    { id: 'd4', x: 2.42, y: 3.42, z: 2, requires: 'p4' },
  ],
};

const CHECKLIST = [
  { key: 'foundation', label: '柱础定位' },
  { key: 'pillar', label: '立柱竖立' },
  { key: 'beam', label: '横梁架设' },
  { key: 'ridgebeam', label: '正脊封顶' },
  { key: 'roof', label: '屋面铺设' },
  { key: 'dougong', label: '斗拱装饰' },
];

const containerRef = ref(null);
const selectedType = ref('foundation');
const buildMode = ref('guide');
const freeRotation = ref(0);
const hoveredFreePoint = ref(null);
const placedParts = ref([]);
const showResult = ref(false);
const resultScore = ref(0);
const resultTitle = ref('');
const resultDesc = ref('');
const hoveredSlot = ref(null);
const placementHint = ref('先从柱础开始，也可以在已解锁的构件之间自由切换。');
const placementState = ref('warn');

const isGuidedPlacement = (part) => getSlots(part.type).some((slot) => slot.id === part.slotId);
const availableTypeIds = computed(() => buildMode.value === 'free'
  ? PART_TYPES.map((pt) => pt.id)
  : PART_TYPES.filter((pt) => getAvailableSlots(pt.id).length > 0).map((pt) => pt.id)
);
const availableTypeLabels = computed(() => {
  if (buildMode.value === 'free') return '全部构件自由可用';
  return availableTypeIds.value.length
    ? PART_TYPES.filter((pt) => availableTypeIds.value.includes(pt.id)).map((pt) => pt.label).join('、')
    : '所有安装点都已完成';
});
const isMainStructureComplete = computed(() => ['foundation', 'pillar', 'beam', 'ridgebeam', 'roof'].every((key) => isChecklistDone(key)));
const canEnterFreeMode = computed(() => isMainStructureComplete.value);
const canSelectPart = (typeId) => buildMode.value === 'free' || hasUnlockedSlots(typeId);
const isPartHighlighted = (typeId) => buildMode.value === 'free'
  ? selectedType.value === typeId
  : selectedType.value === typeId || (hasUnlockedSlots(typeId) && !selectedType.value);

let renderer, scene, camera, controls, animId;
let isSceneActive = true;
let lastFrameTime = 0;
let lastRenderTime = 0;
const FRAME_INTERVAL = 1000 / 30;
const RENDER_INTERVAL = 1000 / 24;
let ghostMesh = null;
let floorPlane = null;
let hoveredMesh = null;
const placedMeshes = [];
const helperRings = [];
const raycaster = new THREE.Raycaster();
const mousePt = new THREE.Vector2();

const getPartDef = (typeId) => PART_TYPES.find((p) => p.id === typeId);
const getSlots = (typeId) => BUILD_SLOTS[typeId] || [];
const getPartBaseY = (typeId, pointY = 0) => {
  const pt = getPartDef(typeId);
  if (!pt) return pointY;
  if (typeId === 'dougong') return pointY + 3.42;
  if (typeId === 'roof') return pointY + 4.94;
  return pointY + pt.h / 2;
};
const snapToGrid = (value, step = 0.5) => Math.round(value / step) * step;
const isSlotOccupied = (slotId) => placedParts.value.some((part) => part.slotId === slotId);
const isSlotUnlocked = (slot) => {
  if (!slot.requires) return true;
  if (Array.isArray(slot.requires)) return slot.requires.every((req) => isSlotOccupied(req));
  return isSlotOccupied(slot.requires);
};
const getAvailableSlots = (typeId) => getSlots(typeId).filter((slot) => !isSlotOccupied(slot.id) && isSlotUnlocked(slot));
const hasUnlockedSlots = (typeId) => getAvailableSlots(typeId).length > 0;
const getProgress = (typeId) => ({ done: placedParts.value.filter((p) => p.type === typeId).length, total: getSlots(typeId).length });
const getProgressText = (typeId) => {
  if (buildMode.value === 'free') {
    const freeCount = placedParts.value.filter((p) => p.type === typeId && p.mode === 'free').length;
    return `${freeCount}件`;
  }
  const { done, total } = getProgress(typeId);
  return `${done}/${total}`;
};
const isChecklistDone = (typeId) => {
  if (buildMode.value === 'free') return false;
  const { done, total } = getProgress(typeId);
  return total > 0 && done >= total;
};
const updatePlacementHint = (message, state = 'warn') => {
  placementHint.value = message;
  placementState.value = state;
};

const forEachMesh = (obj, callback) => {
  obj?.traverse?.((child) => {
    if (child.isMesh) callback(child);
  });
};

const disposeObject3D = (obj) => {
  forEachMesh(obj, (mesh) => {
    mesh.geometry?.dispose?.();
    if (Array.isArray(mesh.material)) mesh.material.forEach((mat) => mat.dispose?.());
    else mesh.material?.dispose?.();
  });
};

const setObjectMaterialState = (obj, { opacity, emissive, emissiveIntensity }) => {
  forEachMesh(obj, (mesh) => {
    if (opacity != null) mesh.material.opacity = opacity;
    if (emissive != null) mesh.material.emissive?.set(emissive);
    if (emissiveIntensity != null) mesh.material.emissiveIntensity = emissiveIntensity;
  });
};

const getPlacedRoot = (object) => {
  let current = object;
  while (current) {
    if (placedMeshes.includes(current)) return current;
    current = current.parent;
  }
  return null;
};

const getNearestSlot = (typeId, x, z) => {
  const slots = getAvailableSlots(typeId);
  if (!slots.length) return null;
  let best = null;
  let bestDist = Infinity;
  for (const slot of slots) {
    const dx = slot.x - x;
    const dz = slot.z - z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < bestDist) {
      best = slot;
      bestDist = dist;
    }
  }
  return bestDist <= 1.8 ? best : null;
};

const updateHelperRings = () => {
  helperRings.forEach((ring) => {
    if (buildMode.value === 'free') {
      ring.visible = false;
      return;
    }
    const available = !isSlotOccupied(ring.userData.slotId) && isSlotUnlocked(ring.userData.slot);
    const selectedMatches = !selectedType.value || ring.userData.partType === selectedType.value;
    ring.visible = available && selectedMatches;
    ring.material.opacity = ring.userData.slotId === hoveredSlot.value?.id ? 0.95 : 0.4;
    ring.material.color.set(ring.userData.slotId === hoveredSlot.value?.id ? '#f4dd9a' : '#8e6734');
  });
};

const rebuildGhost = () => {
  if (ghostMesh) {
    scene.remove(ghostMesh);
    disposeObject3D(ghostMesh);
    ghostMesh = null;
  }
  hoveredSlot.value = null;
  hoveredFreePoint.value = null;
  if (!selectedType.value) {
    updateHelperRings();
    return;
  }

  const pt = getPartDef(selectedType.value);
  ghostMesh = createPartMesh(pt, null, true);
  ghostMesh.rotation.y = freeRotation.value;
  scene.add(ghostMesh);
  updateHelperRings();
};

const toggleBuildMode = () => {
  if (!canEnterFreeMode.value) return;
  buildMode.value = buildMode.value === 'guide' ? 'free' : 'guide';
  hoveredSlot.value = null;
  hoveredFreePoint.value = null;
  freeRotation.value = 0;
  const fallbackType = buildMode.value === 'free' ? PART_TYPES[0]?.id : availableTypeIds.value[0] ?? 'foundation';
  if (!selectedType.value || !canSelectPart(selectedType.value)) selectedType.value = fallbackType;
  updatePlacementHint(
    buildMode.value === 'free'
      ? '自由创作已开启：可在地面任意位置放置构件，按 Q / E 旋转方向。'
      : '已返回教学搭建，请跟随高亮安装点继续完成标准房架。',
    buildMode.value === 'free' ? 'ok' : 'warn'
  );
  audioSystem.playClick();
  rebuildGhost();
};

const selectPart = (typeId) => {
  if (!canSelectPart(typeId)) {
    updatePlacementHint(`当前没有可放置的${getPartDef(typeId).label}安装点。`, 'warn');
    audioSystem.playClick();
    return;
  }

  selectedType.value = selectedType.value === typeId ? null : typeId;
  if (selectedType.value) {
    updatePlacementHint(
      buildMode.value === 'free'
        ? `正在自由摆放${getPartDef(selectedType.value).label}，可按 Q / E 调整方向。`
        : `正在寻找${getPartDef(selectedType.value).label}的安装点。`,
      'warn'
    );
  } else updatePlacementHint('已取消当前构件，重新自由选择即可。', 'warn');
  audioSystem.playClick();
  rebuildGhost();
};

const cancelPlacement = () => {
  selectedType.value = null;
  updatePlacementHint(
    buildMode.value === 'free'
      ? '已取消当前构件，重新选择后可继续自由创作。'
      : '已取消当前构件，重新自由选择即可。',
    'warn'
  );
  rebuildGhost();
};

const updateMousePt = (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mousePt.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mousePt.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
};

const createPartMesh = (ptDef, slot = null, isGhost = false) => {
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: ptDef.color,
    roughness: ptDef.roughness ?? 0.8,
    transparent: isGhost,
    opacity: isGhost ? 0.45 : 1,
    emissive: new THREE.Color(isGhost ? '#4488ff' : '#000000'),
    emissiveIntensity: isGhost ? 0.4 : 0,
  });

  if (ptDef.id === 'dougong') {
    const dougongGroup = new THREE.Group();
    const bracketMat = new THREE.MeshStandardMaterial({
      color: isGhost ? '#d7a45d' : '#c08840',
      roughness: 0.62,
      transparent: isGhost,
      opacity: isGhost ? 0.45 : 1,
      emissive: new THREE.Color(isGhost ? '#4488ff' : '#000000'),
      emissiveIntensity: isGhost ? 0.28 : 0,
    });

    const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.24, 0.72), bracketMat);
    const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 0.28), bracketMat);
    const armRight = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 0.28), bracketMat);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.14, 0.8), bracketMat);

    baseBlock.position.y = 0;
    armLeft.position.set(-0.34, 0.12, 0);
    armRight.position.set(0.34, 0.12, 0);
    cap.position.y = 0.24;

    dougongGroup.add(baseBlock);
    dougongGroup.add(armLeft);
    dougongGroup.add(armRight);
    dougongGroup.add(cap);
    return dougongGroup;
  }

  if (ptDef.id !== 'roof') {
    return new THREE.Mesh(new THREE.BoxGeometry(ptDef.w, ptDef.h, ptDef.d), baseMaterial);
  }

  const roofGroup = new THREE.Group();
  const tileMat = new THREE.MeshStandardMaterial({
    color: isGhost ? '#8a664c' : '#8f6548',
    roughness: 0.96,
    transparent: isGhost,
    opacity: isGhost ? 0.35 : 1,
    emissive: new THREE.Color(isGhost ? '#305070' : '#000000'),
    emissiveIntensity: isGhost ? 0.15 : 0,
  });

  const roofPivot = new THREE.Group();
  const panel = new THREE.Mesh(new THREE.BoxGeometry(ptDef.w, ptDef.h, ptDef.d), baseMaterial);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(ptDef.w * 0.96, ptDef.h * 0.38, ptDef.d * 0.94), tileMat);

  panel.position.y = 0;
  cap.position.y = ptDef.h * 0.26;

  roofPivot.add(panel);
  roofPivot.add(cap);
  roofGroup.add(roofPivot);

  const slopeDeg = slot?.id === 'roof-left' ? 32 : slot?.id === 'roof-right' ? -32 : 0;
  const slideX = slot?.id === 'roof-left' ? -1.48 : slot?.id === 'roof-right' ? 1.48 : 0;
  const liftY = slot?.id?.startsWith('roof') ? 0.44 : 0;
  roofPivot.position.set(slideX, liftY, 0);
  roofPivot.rotation.z = (slopeDeg * Math.PI) / 180;

  roofGroup.traverse((child) => {
    if (child.isMesh) child.userData.isRoofPiece = true;
  });

  roofGroup.userData.baseY = slot?.y ?? ptDef.h / 2 + liftY;
  return roofGroup;
};

const placePart = (ptDef, slot) => {
  const mesh = createPartMesh(ptDef, slot, false);
  mesh.position.set(slot.x, slot.y, slot.z);
  mesh.rotation.y = ((slot.rot ?? 0) * Math.PI) / 180;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.partType = ptDef.id;
  mesh.userData.slotId = slot.id;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const dropH = ptDef.id === 'roof' ? 0.7 : 1.0;
  mesh.position.y = slot.y + dropH;
  scene.add(mesh);
  placedMeshes.push(mesh);
  placedParts.value.push({ type: ptDef.id, mesh, slotId: slot.id, rotation: mesh.rotation.y, valid: true, mode: 'guide' });
  audioSystem.playSnap();

  const startY = mesh.position.y;
  const startT = performance.now();
  const drop = () => {
    const t = Math.min((performance.now() - startT) / 280, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    mesh.position.y = startY + (slot.y - startY) * ease;
    if (t < 1) requestAnimationFrame(drop);
  };
  drop();

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive?.set('#ffcc44');
      child.material.emissiveIntensity = 0.5;
      setTimeout(() => { child.material.emissiveIntensity = child.material.transparent ? child.material.emissiveIntensity : 0; }, 400);
    }
  });

  if (buildMode.value === 'guide' && !hasUnlockedSlots(selectedType.value)) selectedType.value = availableTypeIds.value[0] ?? null;
  updatePlacementHint(`已安装${ptDef.label}，${buildMode.value === 'free' ? '继续自由创作吧。' : '你可以继续自由补齐其他已解锁构件。'}`, 'ok');
  rebuildGhost();
};

const placeFreePart = (ptDef, point) => {
  const mesh = createPartMesh(ptDef, null, false);
  const baseY = getPartBaseY(ptDef.id, point.y);
  mesh.position.set(snapToGrid(point.x), baseY, snapToGrid(point.z));
  mesh.rotation.y = freeRotation.value;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.partType = ptDef.id;
  mesh.userData.slotId = null;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const dropH = ptDef.id === 'roof' ? 0.7 : 1.0;
  mesh.position.y = baseY + dropH;
  scene.add(mesh);
  placedMeshes.push(mesh);
  placedParts.value.push({
    type: ptDef.id,
    mesh,
    slotId: null,
    rotation: freeRotation.value,
    x: mesh.position.x,
    y: baseY,
    z: mesh.position.z,
    valid: true,
    mode: 'free',
  });
  audioSystem.playSnap();

  const startY = mesh.position.y;
  const startT = performance.now();
  const drop = () => {
    const t = Math.min((performance.now() - startT) / 280, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    mesh.position.y = startY + (baseY - startY) * ease;
    if (t < 1) requestAnimationFrame(drop);
  };
  drop();

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive?.set('#ffcc44');
      child.material.emissiveIntensity = 0.5;
      setTimeout(() => { child.material.emissiveIntensity = child.material.transparent ? child.material.emissiveIntensity : 0; }, 400);
    }
  });

  updatePlacementHint(`已放下${ptDef.label}，你可以继续在场地中自由创作。`, 'ok');
  rebuildGhost();
};

const deleteHovered = () => {
  if (!hoveredMesh) return;
  scene.remove(hoveredMesh);
  disposeObject3D(hoveredMesh);
  const meshIdx = placedMeshes.indexOf(hoveredMesh);
  if (meshIdx !== -1) placedMeshes.splice(meshIdx, 1);
  const partIdx = placedParts.value.findIndex((p) => p.mesh === hoveredMesh);
  if (partIdx !== -1) placedParts.value.splice(partIdx, 1);
  hoveredMesh = null;
  audioSystem.playClick();
  updatePlacementHint(
    buildMode.value === 'free'
      ? '已移除构件，可以继续自由摆放新的组合。'
      : '已移除构件，可以重新选择任意已解锁安装点继续搭建。',
    'warn'
  );
  if (selectedType.value && !canSelectPart(selectedType.value)) selectedType.value = availableTypeIds.value[0] ?? null;
  rebuildGhost();
};

const clearAll = () => {
  [...placedMeshes].forEach((m) => {
    scene.remove(m);
    disposeObject3D(m);
  });
  placedMeshes.length = 0;
  placedParts.value = [];
  hoveredMesh = null;
  hoveredSlot.value = null;
  hoveredFreePoint.value = null;
  buildMode.value = 'guide';
  freeRotation.value = 0;
  selectedType.value = 'foundation';
  updatePlacementHint('先从柱础开始，也可以在已解锁的构件之间自由切换。', 'warn');
  rebuildGhost();
};

const getCompletionStatus = () => {
  const guidedParts = placedParts.value.filter(isGuidedPlacement);
  const foundationDone = guidedParts.filter((p) => p.type === 'foundation').length >= getSlots('foundation').length;
  const pillarDone = guidedParts.filter((p) => p.type === 'pillar').length >= getSlots('pillar').length;
  const beamDone = guidedParts.filter((p) => p.type === 'beam').length >= getSlots('beam').length;
  const ridgeDone = guidedParts.filter((p) => p.type === 'ridgebeam').length >= getSlots('ridgebeam').length;
  const roofDone = guidedParts.filter((p) => p.type === 'roof').length >= getSlots('roof').length;
  const dougongDone = guidedParts.filter((p) => p.type === 'dougong').length >= getSlots('dougong').length;
  const score = [foundationDone, pillarDone, beamDone, ridgeDone, roofDone, dougongDone].filter(Boolean).length;
  return { foundationDone, pillarDone, beamDone, ridgeDone, roofDone, dougongDone, score };
};

const checkCompletion = () => {
  if (buildMode.value === 'free') {
    const freeCount = placedParts.value.filter((part) => part.mode === 'free').length;
    resultScore.value = Math.min(5, Math.max(1, Math.ceil(freeCount / 3)));
    resultTitle.value = freeCount >= 8 ? '创作渐入佳境' : freeCount >= 3 ? '雏形已现，继续发挥' : '开始你的自由构想';
    resultDesc.value = `当前自由创作区已摆放 ${freeCount} 个构件。继续尝试不同组合，搭出属于你的房架样式。`;
    showResult.value = true;
    return;
  }

  const status = getCompletionStatus();
  resultScore.value = status.score;
  if (status.score === 6) {
    resultTitle.value = '形制齐整，房架大成！';
    resultDesc.value = '主体梁架、屋面与斗拱全部归位，这座古建房架已经真正完整落成。';
  } else if (status.roofDone) {
    resultTitle.value = '房架完整，还可锦上添花';
    resultDesc.value = '屋面已经盖好，主体房架完整成立，可继续补齐斗拱，让檐下层次更丰富。';
  } else if (status.ridgeDone) {
    resultTitle.value = '只差盖上屋面';
    resultDesc.value = '正脊已经就位，再把左右两片屋面铺上，这座房架才算完整。';
  } else if (!status.foundationDone) {
    resultTitle.value = '先稳根基';
    resultDesc.value = '四角承重点尚未立稳，请先安放四个柱础。';
  } else if (!status.pillarDone) {
    resultTitle.value = '骨架未立';
    resultDesc.value = '柱础已定，但立柱尚未齐备，请先把四柱竖起。';
  } else if (!status.beamDone) {
    resultTitle.value = '尚未成架';
    resultDesc.value = '房柱已立，还需前后两道横梁把框架连起来。';
  } else {
    resultTitle.value = '只差封顶';
    resultDesc.value = '横梁已成，请将正脊安放到中轴线上完成封顶。';
  }
  showResult.value = true;
};

const onKeyDown = (e) => {
  const key = e.key.toLowerCase();
  if (key === 'delete' || key === 'backspace') deleteHovered();
  if (buildMode.value === 'free' && ghostMesh && (key === 'q' || key === 'e')) {
    freeRotation.value += key === 'q' ? Math.PI / 8 : -Math.PI / 8;
    ghostMesh.rotation.y = freeRotation.value;
    updatePlacementHint(`已调整${getPartDef(selectedType.value)?.label ?? '构件'}方向，可继续放置。`, 'ok');
  }
};

const onMouseMove = (e) => {
  updateMousePt(e);
  raycaster.setFromCamera(mousePt, camera);

  const pmHits = raycaster.intersectObjects(placedMeshes, true);
  const nowHovered = pmHits.length > 0 ? getPlacedRoot(pmHits[0].object) : null;
  if (nowHovered !== hoveredMesh) {
    if (hoveredMesh) setObjectMaterialState(hoveredMesh, { emissiveIntensity: 0 });
    hoveredMesh = nowHovered;
    if (hoveredMesh) {
      hoveredMesh.traverse?.((child) => {
        if (child.isMesh) child.material.emissiveIntensity = child.userData.isRoofPiece ? 0.08 : 0.3;
      });
      renderer.domElement.style.cursor = 'pointer';
    } else {
      renderer.domElement.style.cursor = selectedType.value ? 'crosshair' : 'default';
    }
  }

  if (!selectedType.value || !ghostMesh) {
    hoveredSlot.value = null;
    hoveredFreePoint.value = null;
    updateHelperRings();
    return;
  }

  const groundHits = raycaster.intersectObject(floorPlane);
  if (!groundHits.length) return;

  const pt = groundHits[0].point;

  if (buildMode.value === 'free') {
    hoveredSlot.value = null;
    hoveredFreePoint.value = pt;
    const snapX = snapToGrid(pt.x);
    const snapZ = snapToGrid(pt.z);
    const baseY = getPartBaseY(selectedType.value, pt.y);
    ghostMesh.position.set(snapX, baseY, snapZ);
    ghostMesh.rotation.y = freeRotation.value;
    ghostMesh.userData._baseY = baseY;
    setObjectMaterialState(ghostMesh, { opacity: 0.45, emissive: '#66aaff' });
    updatePlacementHint(`自由摆放${getPartDef(selectedType.value).label}中，点击即可落位。`, 'ok');
    updateHelperRings();
    return;
  }

  const nearestSlot = getNearestSlot(selectedType.value, pt.x, pt.z);
  hoveredFreePoint.value = null;
  hoveredSlot.value = nearestSlot;

  if (!nearestSlot) {
    const freeY = getPartBaseY(selectedType.value, pt.y);
    setObjectMaterialState(ghostMesh, { opacity: 0.2, emissive: '#aa3333' });
    ghostMesh.position.set(pt.x, freeY, pt.z);
    ghostMesh.userData._baseY = freeY;
    updatePlacementHint('请靠近高亮安装点放置构件。', 'warn');
    updateHelperRings();
    return;
  }

  ghostMesh.position.set(nearestSlot.x, nearestSlot.y, nearestSlot.z);
  ghostMesh.rotation.y = ((nearestSlot.rot ?? 0) * Math.PI) / 180;
  ghostMesh.userData._baseY = nearestSlot.y;

  setObjectMaterialState(ghostMesh, { opacity: 0.5, emissive: '#66aaff' });
  updatePlacementHint(`此处可安装${getPartDef(selectedType.value).label}。`, 'ok');
  updateHelperRings();
};

const onCanvasClick = () => {
  if (!selectedType.value) return;
  if (buildMode.value === 'free') {
    if (!hoveredFreePoint.value) {
      updatePlacementHint('请将构件移动到场地内再放下。', 'warn');
      audioSystem.playClick();
      return;
    }
    placeFreePart(getPartDef(selectedType.value), hoveredFreePoint.value);
    return;
  }

  if (!hoveredSlot.value) {
    updatePlacementHint('此处没有可用安装点，请靠近高亮位置。', 'warn');
    audioSystem.playClick();
    return;
  }

  placePart(getPartDef(selectedType.value), hoveredSlot.value);
};

const onContextMenu = (e) => e.preventDefault();

const buildSceneLights = () => {
  scene.add(new THREE.AmbientLight('#ffd890', 0.6));
  const sun = new THREE.DirectionalLight('#fff8e0', 2.0);
  sun.position.set(8, 14, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -14;
  sun.shadow.camera.right = sun.shadow.camera.top = 14;
  sun.shadow.camera.far = 50;
  scene.add(sun);

  const fill = new THREE.DirectionalLight('#c06030', 0.4);
  fill.position.set(-6, 4, -4);
  scene.add(fill);
};

const buildFloor = () => {
  const floorMat = new THREE.MeshStandardMaterial({ color: '#1d1508', roughness: 0.98 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const borderMat = new THREE.LineBasicMaterial({ color: '#3a2a10', opacity: 0.5, transparent: true });
  const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(12, 0.02, 12));
  const border = new THREE.LineSegments(borderGeo, borderMat);
  border.position.y = 0.01;
  scene.add(border);

  const grid = new THREE.GridHelper(12, 24, '#2a1e0a', '#1e1508');
  grid.position.y = 0.01;
  scene.add(grid);

  const axisLineMat = new THREE.LineBasicMaterial({ color: '#4a3520', opacity: 0.4, transparent: true });
  const makeAxis = (pts) => new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, 0.02, z))),
    axisLineMat
  );
  scene.add(makeAxis([[-6, 0], [6, 0]]));
  scene.add(makeAxis([[0, -6], [0, 6]]));
};

const buildHelperRings = () => {
  Object.entries(BUILD_SLOTS).forEach(([typeId, slots]) => {
    slots.forEach((slot) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.48, 32),
        new THREE.MeshBasicMaterial({ color: '#8e6734', transparent: true, opacity: 0.4, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(slot.x, slot.y + 0.02, slot.z);
      ring.userData = { slotId: slot.id, partType: typeId, slot };
      scene.add(ring);
      helperRings.push(ring);
    });
  });
  updateHelperRings();
};

const onResize = () => {
  const el = containerRef.value;
  if (!el) return;
  const W = el.clientWidth;
  const H = el.clientHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
};

const onVisibilityChange = () => {
  isSceneActive = document.visibilityState === 'visible';
};

const animate = (now = 0) => {
  animId = requestAnimationFrame(animate);
  if (!isSceneActive) return;
  if (now - lastFrameTime < FRAME_INTERVAL) return;
  lastFrameTime = now;
  controls.update();

  if (ghostMesh) {
    ghostMesh.userData._baseY = ghostMesh.userData._baseY ?? ghostMesh.position.y;
    ghostMesh.position.y = ghostMesh.userData._baseY + Math.sin(now * 0.003) * 0.06;
  }

  if (now - lastRenderTime < RENDER_INTERVAL) return;
  lastRenderTime = now;
  renderer.render(scene, camera);
};

onMounted(() => {
  const el = containerRef.value;
  const W = el.clientWidth;
  const H = el.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#181208');
  scene.fog = new THREE.FogExp2('#181208', 0.028);

  camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
  camera.position.set(10, 12, 10);
  camera.lookAt(0, 2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  el.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.target.set(0, 2, 0);
  controls.minDistance = 4;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.mouseButtons = { LEFT: null, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
  controls.enablePan = false;

  buildSceneLights();
  buildFloor();
  buildHelperRings();

  const floorGeo = new THREE.PlaneGeometry(40, 40);
  const floorMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
  floorPlane = new THREE.Mesh(floorGeo, floorMat);
  floorPlane.rotation.x = -Math.PI / 2;
  floorPlane.position.y = 0;
  scene.add(floorPlane);

  rebuildGhost();

  const canvas = renderer.domElement;
  canvas.addEventListener('click', onCanvasClick);
  canvas.addEventListener('contextmenu', onContextMenu);
  canvas.addEventListener('mousemove', onMouseMove);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
  const canvas = renderer?.domElement;
  canvas?.removeEventListener('click', onCanvasClick);
  canvas?.removeEventListener('contextmenu', onContextMenu);
  canvas?.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  if (ghostMesh) disposeObject3D(ghostMesh);
  helperRings.forEach((ring) => disposeObject3D(ring));
  placedMeshes.forEach((mesh) => disposeObject3D(mesh));
  disposeObject3D(floorPlane);
  controls?.dispose();
  renderer?.dispose();
});
</script>

<style scoped>
.assembly-wrap {
  position: absolute;
  inset: 0;
  background: #181208;
  z-index: 30;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: hidden;
}

.assembly-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 60px;
  border-bottom: 1px solid rgba(200, 154, 90, 0.2);
  background: rgba(10, 7, 3, 0.7);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  gap: 16px;
}

.back-btn { padding: 7px 18px; background: rgba(139, 90, 43, 0.3); border: 1px solid rgba(200, 154, 90, 0.4); border-radius: 20px; color: #d4a96a; font-family: "楷体", serif; font-size: 14px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.back-btn:hover { background: rgba(139, 90, 43, 0.6); color: #f0d080; }
.nav-center { text-align: center; flex: 1; }
.nav-title { font-family: "楷体", serif; font-size: 20px; color: #f0d080; letter-spacing: 3px; margin: 0; }
.nav-sub { font-size: 11px; color: rgba(200, 160, 80, 0.5); letter-spacing: 2px; margin: 2px 0 0; }
.finish-btn { padding: 9px 22px; background: linear-gradient(135deg, #c89a5a, #8b5a2b); border: none; border-radius: 20px; color: #fff; font-family: "楷体", serif; font-size: 15px; cursor: pointer; white-space: nowrap; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3); transition: all 0.2s; }
.finish-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4); }
.assembly-body { flex: 1; display: flex; overflow: hidden; }
.palette, .blueprint { width: 280px; padding: 18px; background: rgba(15, 10, 5, 0.92); border-right: 1px solid rgba(200, 154, 90, 0.12); overflow-y: auto; }
.blueprint { border-right: none; border-left: 1px solid rgba(200, 154, 90, 0.12); }
.palette-title, .blueprint-title, .checklist-title { font-family: "楷体", serif; font-size: 18px; color: #f0d080; margin-bottom: 14px; letter-spacing: 2px; }
.step-banner { padding: 12px 14px; border: 1px solid rgba(240, 208, 128, 0.22); border-radius: 14px; background: linear-gradient(180deg, rgba(54, 34, 11, 0.9), rgba(25, 16, 8, 0.95)); margin-bottom: 16px; }
.step-label { font-size: 11px; color: rgba(240, 208, 128, 0.55); letter-spacing: 2px; }
.step-title { font-size: 18px; color: #f7de9a; font-family: "楷体", serif; margin-top: 4px; }
.step-desc { margin-top: 6px; color: rgba(234, 206, 144, 0.74); font-size: 12px; line-height: 1.6; }
.part-btn { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; background: rgba(255, 255, 255, 0.03); border: 1px solid transparent; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
.part-btn:hover { border-color: rgba(200, 154, 90, 0.36); transform: translateY(-1px); }
.part-btn.active { border-color: #f0d080; background: rgba(200, 154, 90, 0.12); box-shadow: 0 0 0 1px rgba(240, 208, 128, 0.14) inset; }
.part-btn.disabled { opacity: 0.36; cursor: not-allowed; filter: grayscale(0.2); }
.part-btn.disabled:hover { transform: none; border-color: transparent; }
.part-btn.optional { border-style: dashed; }
.part-icon { width: 18px; height: 18px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.25); flex-shrink: 0; }
.part-text { display: flex; flex-direction: column; min-width: 0; }
.part-label { color: #f1ddb1; font-size: 14px; }
.part-label small { font-size: 11px; color: rgba(240, 208, 128, 0.58); }
.part-count { color: rgba(204, 173, 114, 0.62); font-size: 12px; margin-top: 3px; }
.mode-toggle-btn { width: 100%; margin: -2px 0 14px; padding: 11px 14px; border: 1px solid rgba(240, 208, 128, 0.36); border-radius: 14px; background: linear-gradient(135deg, rgba(126, 83, 34, 0.95), rgba(72, 44, 16, 0.95)); color: #f8e4aa; cursor: pointer; transition: all 0.2s; }
.mode-toggle-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22); }
.palette-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(200, 154, 90, 0.25), transparent); margin: 18px 0; }
.quick-tips p { margin: 8px 0; font-size: 13px; color: rgba(222, 197, 142, 0.76); line-height: 1.5; }
.clear-btn { width: 100%; padding: 12px 16px; border: 1px solid rgba(200, 154, 90, 0.35); border-radius: 14px; background: rgba(104, 50, 20, 0.22); color: #efc887; cursor: pointer; transition: all 0.2s; }
.clear-btn:hover { background: rgba(139, 90, 43, 0.45); }
.canvas-area { position: relative; flex: 1; min-width: 0; }
.build-hud { position: absolute; top: 20px; left: 20px; z-index: 6; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.build-step-chip, .placement-message, .placing-indicator, .canvas-hint-top { background: rgba(10, 7, 3, 0.72); border: 1px solid rgba(200, 154, 90, 0.22); backdrop-filter: blur(10px); }
.build-step-chip { color: #f0d080; border-radius: 999px; padding: 9px 16px; font-size: 13px; letter-spacing: 1px; }
.placement-message { border-radius: 14px; padding: 10px 14px; color: rgba(239, 213, 164, 0.82); font-size: 13px; max-width: 320px; line-height: 1.5; }
.placement-message.ok { border-color: rgba(139, 210, 154, 0.4); color: #d9f7d8; }
.placement-message.warn { border-color: rgba(200, 154, 90, 0.3); }
.placing-indicator, .canvas-hint-top { position: absolute; top: 20px; right: 20px; z-index: 6; border-radius: 999px; padding: 10px 16px; color: #f5ddaa; display: flex; align-items: center; gap: 10px; }
.placing-dot { width: 10px; height: 10px; background: #f0d080; border-radius: 50%; box-shadow: 0 0 8px rgba(240, 208, 128, 0.8); }
.rotation-chip { padding: 4px 10px; border-radius: 999px; background: rgba(240, 208, 128, 0.12); color: #f8e6b6; font-size: 12px; }
.cancel-place { border: none; background: rgba(255, 255, 255, 0.08); color: #f5ddaa; border-radius: 999px; padding: 5px 10px; cursor: pointer; }
.svg-wrap { padding: 14px; border-radius: 14px; background: radial-gradient(circle at top, rgba(73, 48, 18, 0.45), rgba(13, 10, 6, 0.96)); border: 1px solid rgba(200, 154, 90, 0.14); }
.bp-svg { width: 100%; display: block; }
.checklist { display: flex; flex-direction: column; gap: 10px; }
.free-notes { display: flex; flex-direction: column; gap: 10px; padding: 2px 2px 0; }
.free-notes p { margin: 0; line-height: 1.7; color: rgba(233, 212, 166, 0.78); font-size: 13px; }
.check-item { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); color: rgba(233, 212, 166, 0.72); border: 1px solid transparent; }
.check-item.current { border-color: rgba(240, 208, 128, 0.22); }
.check-item.done { background: rgba(116, 90, 34, 0.3); color: #f4dd9a; }
.check-icon { width: 20px; text-align: center; }
.check-label { flex: 1; }
.check-progress { color: rgba(240, 208, 128, 0.72); font-size: 12px; }
.result-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 40; }
.result-card { width: 420px; max-width: calc(100vw - 40px); padding: 28px; border-radius: 24px; background: linear-gradient(180deg, rgba(43, 26, 11, 0.98), rgba(15, 9, 4, 0.98)); border: 1px solid rgba(240, 208, 128, 0.18); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45); text-align: center; }
.result-score-ring { width: 120px; height: 120px; margin: 0 auto 12px; position: relative; }
.ring-svg { width: 100%; height: 100%; }
.ring-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #f3d895; font-size: 24px; font-family: "楷体", serif; }
.result-emoji { font-size: 34px; margin-bottom: 8px; }
.result-title { font-family: "楷体", serif; color: #f4dd9a; margin: 0; }
.result-desc { color: rgba(235, 212, 164, 0.8); line-height: 1.75; white-space: pre-line; }
.result-checks { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; text-align: left; }
.rc-item { padding: 10px 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); color: rgba(235, 212, 164, 0.72); }
.rc-item.pass { background: rgba(120, 92, 30, 0.25); color: #f4dd9a; }
.result-actions { display: flex; gap: 12px; justify-content: center; }
.ra-btn { padding: 10px 18px; border-radius: 999px; border: none; cursor: pointer; }
.ra-btn.primary { background: linear-gradient(135deg, #d0a564, #8d5a2f); color: #fff; }
.ra-btn.accent { background: linear-gradient(135deg, #f0d080, #b67a2d); color: #2d1b0d; }
.ra-btn.secondary { background: rgba(255, 255, 255, 0.08); color: #f5ddaa; }
.pop-enter-active, .pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.96); }
</style>
