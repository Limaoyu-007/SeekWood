<template>
  <div class="assembly-wrap">
    <!-- ── 顶部导航 ── -->
    <header class="assembly-nav">
      <button class="back-btn" @click="$emit('back')">← 返回游戏</button>
      <div class="nav-center">
        <h1 class="nav-title">⚒ 古建自由拼装</h1>
        <p class="nav-sub">选择构件，自由搭建属于你的古建房架</p>
      </div>
      <button class="finish-btn" @click="checkCompletion">完工验收 ✓</button>
    </header>

    <div class="assembly-body">
      <!-- ── 左侧：构件库 ── -->
      <aside class="palette">
        <div class="palette-title">构件库</div>

        <div
          v-for="pt in PART_TYPES" :key="pt.id"
          :class="['part-btn', { active: selectedType === pt.id }]"
          @click="selectPart(pt.id)"
        >
          <div class="part-icon" :style="{ background: pt.color }"></div>
          <div class="part-text">
            <span class="part-label">{{ pt.label }}</span>
            <span class="part-count">已放 {{ getCount(pt.id) }}</span>
          </div>
        </div>

        <div class="palette-divider"></div>

        <div class="quick-tips">
          <p>🖱️ <b>左键</b>点击放置构件</p>
          <p>⌨️ <b>R 键</b>旋转构件方向</p>
          <p>⌨️ <b>Delete</b>删除悬停构件</p>
          <p>🔄 <b>右键拖拽</b>旋转视角</p>
          <p>🏗️ <b>堆叠</b>点击已有构件上方</p>
        </div>

        <div class="palette-divider"></div>
        <button class="clear-btn" @click="clearAll">🗑 清空重建</button>
      </aside>

      <!-- ── 中央：3D 画布 ── -->
      <div class="canvas-area" ref="containerRef">
        <div v-if="selectedType" class="placing-indicator">
          <span class="placing-dot"></span>
          正在放置：{{ PART_TYPES.find(p => p.id === selectedType)?.label }}
          <span class="orientation-tag">方向: {{ currentRotDeg }}°</span>
          <button class="cancel-place" @click="cancelPlacement">✕ 取消</button>
        </div>
        <div v-else class="canvas-hint-top">从左侧选择构件开始放置</div>
      </div>

      <!-- ── 右侧：参考图纸 ── -->
      <aside class="blueprint">
        <div class="blueprint-title">标准房架图纸</div>

        <!-- 正面视图 SVG -->
        <div class="svg-wrap">
          <svg viewBox="0 0 180 200" class="bp-svg">
            <!-- 地面线 -->
            <line x1="5" y1="190" x2="175" y2="190" stroke="#c89a5a" stroke-width="1.5" opacity="0.6"/>

            <!-- 础石 (4块) -->
            <rect x="18" y="178" width="22" height="12" fill="#5a5a5a" rx="1"/>
            <rect x="57" y="178" width="22" height="12" fill="#5a5a5a" rx="1"/>
            <rect x="100" y="178" width="22" height="12" fill="#5a5a5a" rx="1"/>
            <rect x="139" y="178" width="22" height="12" fill="#5a5a5a" rx="1"/>

            <!-- 立柱 (4根) -->
            <rect x="25" y="118" width="9" height="60" fill="#8b5a2b" rx="2"/>
            <rect x="64" y="118" width="9" height="60" fill="#8b5a2b" rx="2"/>
            <rect x="107" y="118" width="9" height="60" fill="#8b5a2b" rx="2"/>
            <rect x="146" y="118" width="9" height="60" fill="#8b5a2b" rx="2"/>

            <!-- 额枋/横梁 (2根横跨) -->
            <rect x="22" y="110" width="135" height="8" fill="#6b3d18" rx="2"/>
            <rect x="22" y="100" width="135" height="5" fill="#5a3010" rx="1" opacity="0.7"/>

            <!-- 斗拱 (4组) -->
            <rect x="22" y="105" width="12" height="7" fill="#c08840" rx="1"/>
            <rect x="61" y="105" width="12" height="7" fill="#c08840" rx="1"/>
            <rect x="104" y="105" width="12" height="7" fill="#c08840" rx="1"/>
            <rect x="143" y="105" width="12" height="7" fill="#c08840" rx="1"/>

            <!-- 屋顶脊线 -->
            <polygon points="90,55 20,100 160,100" fill="#4a4a5a" opacity="0.85"/>
            <polygon points="90,55 30,98 150,98" fill="#3a3a4a"/>

            <!-- 正脊 -->
            <rect x="60" y="50" width="60" height="8" fill="#5a5a6a" rx="2"/>

            <!-- 标注线 -->
            <line x1="8" y1="178" x2="18" y2="178" stroke="#c89a5a" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.5"/>
            <line x1="8" y1="190" x2="8" y2="178" stroke="#c89a5a" stroke-width="0.8" opacity="0.5"/>
            <text x="2" y="185" fill="#c89a5a" font-size="5" opacity="0.7">础</text>

            <line x1="8" y1="118" x2="20" y2="118" stroke="#c89a5a" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.5"/>
            <line x1="8" y1="178" x2="8" y2="118" stroke="#c89a5a" stroke-width="0.8" opacity="0.5"/>
            <text x="2" y="150" fill="#c89a5a" font-size="5" opacity="0.7">柱</text>
          </svg>
        </div>

        <!-- 进度清单 -->
        <div class="checklist-title">完工清单</div>
        <div class="checklist">
          <div
            v-for="item in CHECKLIST" :key="item.key"
            :class="['check-item', { done: getCount(item.key) >= item.min }]"
          >
            <span class="check-icon">{{ getCount(item.key) >= item.min ? '✓' : '○' }}</span>
            <span class="check-label">{{ item.label }}</span>
            <span class="check-progress">{{ Math.min(getCount(item.key), item.min) }}/{{ item.min }}</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- ── 完工验收弹窗 ── -->
    <transition name="pop">
      <div v-if="showResult" class="result-overlay" @click.self="showResult = false">
        <div class="result-card">
          <div class="result-score-ring">
            <svg viewBox="0 0 60 60" class="ring-svg">
              <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(200,154,90,0.2)" stroke-width="5"/>
              <circle cx="30" cy="30" r="24" fill="none"
                :stroke="resultScore >= 4 ? '#f0d080' : '#c89a5a'"
                stroke-width="5" stroke-linecap="round"
                :stroke-dasharray="`${resultScore * 37.7} 150.8`"
                transform="rotate(-90 30 30)"
                style="transition: stroke-dasharray 0.8s ease"/>
            </svg>
            <div class="ring-text">{{ resultScore }}/4</div>
          </div>

          <div class="result-emoji">{{ resultScore >= 4 ? '🏆' : resultScore >= 2 ? '🔨' : '📐' }}</div>
          <h2 class="result-title">{{ resultTitle }}</h2>
          <p class="result-desc">{{ resultDesc }}</p>

          <div class="result-checks">
            <div v-for="item in CHECKLIST" :key="item.key"
                 :class="['rc-item', { pass: getCount(item.key) >= item.min }]">
              <span>{{ getCount(item.key) >= item.min ? '✓' : '✗' }}</span>
              {{ item.label }}
            </div>
          </div>

          <div class="result-actions">
            <button class="ra-btn primary" @click="showResult = false">继续搭建</button>
            <button class="ra-btn secondary" @click="clearAll(); showResult = false">重新开始</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

defineEmits(['back']);

// ── 构件定义 ────────────────────────────────────────────────────
const PART_TYPES = [
  { id: 'foundation', label: '础石',  color: '#5a5a5a', w: 1.0,  h: 0.28, d: 1.0,  roughness: 0.95 },
  { id: 'pillar',     label: '立柱',  color: '#8b5a2b', w: 0.45, h: 3.2,  d: 0.45, roughness: 0.72 },
  { id: 'beam',       label: '横梁',  color: '#6b3d18', w: 4.5,  h: 0.48, d: 0.55, roughness: 0.78 },
  { id: 'dougong',    label: '斗拱',  color: '#c08840', w: 0.85, h: 0.48, d: 0.85, roughness: 0.65 },
  { id: 'ridgebeam',  label: '正脊',  color: '#4a4a5a', w: 5.2,  h: 0.38, d: 0.48, roughness: 0.80 },
];

const CHECKLIST = [
  { key: 'foundation', label: '柱础就位 ×4', min: 4 },
  { key: 'pillar',     label: '立柱竖立 ×4', min: 4 },
  { key: 'beam',       label: '横梁横跨 ×2', min: 2 },
  { key: 'ridgebeam',  label: '正脊就位 ×1', min: 1 },
];

// ── 响应式状态 ──────────────────────────────────────────────────
const containerRef  = ref(null);
const selectedType  = ref(null);
const placedParts   = ref([]);   // { type, mesh }
const showResult    = ref(false);
const resultScore   = ref(0);
const resultTitle   = ref('');
const resultDesc    = ref('');

const getCount = (typeId) => placedParts.value.filter(p => p.type === typeId).length;

// ── 新增：旋转与动态高度状态 ────────────────────────────────────
const currentRotDeg = ref(0);
const targetSnapY   = ref(0); // 实时计算的吸附高度

// ── Three.js 变量 ───────────────────────────────────────────────
let renderer, scene, camera, controls, animId;
let ghostMesh     = null;   // 放置预览虚影
let floorPlane    = null;   // 射线检测地面
let hoveredMesh   = null;   // 当前悬停中的已放置构件
const placedMeshes = [];    // 保存所有已放置 mesh（与 placedParts 同步）

// ── 网格吸附（X/Z 方向 0.5 单位） ────────────────────────────
const GRID = 0.5;
const snapXZ = (v) => Math.round(v / GRID) * GRID;

// ── 键盘处理：R 旋转 / Delete 删除 ─────────────────────────────
const onKeyDown = (e) => {
  const key = e.key.toLowerCase();
  if (key === 'r') {
    currentRotDeg.value = (currentRotDeg.value + 90) % 360;
    if (ghostMesh) {
      ghostMesh.rotation.y = (currentRotDeg.value * Math.PI) / 180;
    }
  }
  if (key === 'delete' || key === 'backspace') {
    deleteHovered();
  }
};

// ── 初始化 ─────────────────────────────────────────────────────
onMounted(() => {
  const el = containerRef.value;
  const W = el.clientWidth, H = el.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#181208');
  scene.fog = new THREE.FogExp2('#181208', 0.028);

  camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
  camera.position.set(10, 12, 10);
  camera.lookAt(0, 2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  // 射线检测用的隐形地面平面
  const floorGeo = new THREE.PlaneGeometry(40, 40);
  const floorMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
  floorPlane = new THREE.Mesh(floorGeo, floorMat);
  floorPlane.rotation.x = -Math.PI / 2;
  floorPlane.position.y = 0;
  scene.add(floorPlane);

  const canvas = renderer.domElement;
  canvas.addEventListener('click',     onCanvasClick);
  canvas.addEventListener('contextmenu', onContextMenu);
  canvas.addEventListener('mousemove', onMouseMove);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize);

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
  controls?.dispose();
  renderer?.dispose();
});

// ── 场景灯光 ────────────────────────────────────────────────────
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

// ── 地面与网格 ──────────────────────────────────────────────────
const buildFloor = () => {
  // 地面板
  const floorMat = new THREE.MeshStandardMaterial({ color: '#1d1508', roughness: 0.98 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // 外边框
  const borderMat = new THREE.LineBasicMaterial({ color: '#3a2a10', opacity: 0.5, transparent: true });
  const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(12, 0.02, 12));
  const border = new THREE.LineSegments(borderGeo, borderMat);
  border.position.y = 0.01;
  scene.add(border);

  // 网格线（GridHelper）
  const grid = new THREE.GridHelper(12, 24, '#2a1e0a', '#1e1508');
  grid.position.y = 0.01;
  scene.add(grid);

  // 中心标记十字
  const axisLineMat = new THREE.LineBasicMaterial({ color: '#4a3520', opacity: 0.4, transparent: true });
  const makeAxis = (pts) => new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, 0.02, z))),
    axisLineMat
  );
  scene.add(makeAxis([[-6, 0], [6, 0]]));
  scene.add(makeAxis([[0, -6], [0, 6]]));
};


// ── 鼠标工具 ─────────────────────────────────────────────────
const raycaster  = new THREE.Raycaster();
const mousePt    = new THREE.Vector2();

const updateMousePt = (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mousePt.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  mousePt.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
};

// ── 鼠标移动：更新虚影位置 + 悬停高亮 + 动态堆叠检测 ──────────
const onMouseMove = (e) => {
  updateMousePt(e);
  raycaster.setFromCamera(mousePt, camera);

  // 1. 获取悬停对象（Delete 键删除用）
  const pmHits = raycaster.intersectObjects(placedMeshes, false);
  const nowHovered = pmHits.length > 0 ? pmHits[0].object : null;
  if (nowHovered !== hoveredMesh) {
    if (hoveredMesh) hoveredMesh.material.emissiveIntensity = 0;
    hoveredMesh = nowHovered;
    if (hoveredMesh) {
      hoveredMesh.material.emissive = new THREE.Color('#ff3300');
      hoveredMesh.material.emissiveIntensity = 0.3;
      renderer.domElement.style.cursor = 'pointer';
    } else {
      renderer.domElement.style.cursor = selectedType.value ? 'crosshair' : 'default';
    }
  }

  // 2. 更新虚影位置与计算堆叠高度
  if (selectedType.value && ghostMesh) {
    const pt_def = PART_TYPES.find(p => p.id === selectedType.value);
    
    // 优先检测是否鼠标放在已有的构件上（堆叠逻辑）
    const stackHits = raycaster.intersectObjects(placedMeshes, false);
    if (stackHits.length > 0) {
      const hit = stackHits[0];
      const box = new THREE.Box3().setFromObject(hit.object);
      // 新构件底部贴在旧构件顶部，XZ 用鼠标命中点（网格吸附），允许偏移放置
      targetSnapY.value = box.max.y + pt_def.h / 2;
      ghostMesh.position.set(snapXZ(hit.point.x), targetSnapY.value, snapXZ(hit.point.z));
      ghostMesh.userData._baseY = targetSnapY.value;
    } else {
      // 否则检测地面
      const groundHits = raycaster.intersectObject(floorPlane);
      if (groundHits.length > 0) {
        const pt = groundHits[0].point;
        targetSnapY.value = pt_def.h / 2;
        ghostMesh.position.set(snapXZ(pt.x), targetSnapY.value, snapXZ(pt.z));
        ghostMesh.userData._baseY = targetSnapY.value;
      }
    }
  }
};

// ── 左键点击：根据计算出的 targetSnapY 放置构件 ──────────────────
const onCanvasClick = (e) => {
  if (!selectedType.value) return;
  updateMousePt(e);
  raycaster.setFromCamera(mousePt, camera);
  
  const stackHits = raycaster.intersectObjects(placedMeshes, false);
  let finalX, finalY, finalZ;
  const pt_def = PART_TYPES.find(p => p.id === selectedType.value);

  if (stackHits.length > 0) {
    const hit = stackHits[0];
    const box = new THREE.Box3().setFromObject(hit.object);
    finalX = snapXZ(hit.point.x);
    finalY = box.max.y + pt_def.h / 2;
    finalZ = snapXZ(hit.point.z);
  } else {
    const groundHits = raycaster.intersectObject(floorPlane);
    if (groundHits.length === 0) return;
    const pt = groundHits[0].point;
    finalX = snapXZ(pt.x);
    finalY = pt_def.h / 2;
    finalZ = snapXZ(pt.z);
  }

  placePart(pt_def, finalX, finalY, finalZ);
};

// ── 右键菜单：仅阻止默认菜单，不再执行删除 ─────────────────────
const onContextMenu = (e) => {
  e.preventDefault();
};

// ── 删除悬停中的构件（Delete / Backspace 触发） ─────────────────
const deleteHovered = () => {
  if (!hoveredMesh) return;
  scene.remove(hoveredMesh);
  hoveredMesh.geometry.dispose();
  hoveredMesh.material.dispose();
  const idx = placedMeshes.indexOf(hoveredMesh);
  if (idx !== -1) {
    placedMeshes.splice(idx, 1);
    placedParts.value.splice(idx, 1);
  }
  hoveredMesh = null;
};

// ── 取消放置（清除虚影 + 重置选中状态）─────────────────────────
const cancelPlacement = () => {
  selectedType.value = null;
  rebuildGhost();
};

// ── 放置构件 ────────────────────────────────────────────────────
const placePart = (pt_def, x, y, z) => {
  const mat = new THREE.MeshStandardMaterial({
    color: pt_def.color, roughness: pt_def.roughness ?? 0.8,
    emissive: new THREE.Color('#000000'), emissiveIntensity: 0,
  });
  const geo  = new THREE.BoxGeometry(pt_def.w, pt_def.h, pt_def.d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = (currentRotDeg.value * Math.PI) / 180;
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.userData.partType = pt_def.id;

  // 落下动画
  const dropH = 1.0;
  mesh.position.y = y + dropH;
  scene.add(mesh);
  placedMeshes.push(mesh);
  placedParts.value.push({ type: pt_def.id, mesh });

  const startY = mesh.position.y;
  const startT = performance.now();
  const drop = () => {
    const t = Math.min((performance.now() - startT) / 280, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    mesh.position.y = startY + (y - startY) * ease;
    if (t < 1) requestAnimationFrame(drop);
  };
  drop();

  mat.emissive.set('#ffcc44');
  mat.emissiveIntensity = 0.5;
  setTimeout(() => { mat.emissiveIntensity = 0; }, 400);
};


// ── 虚影：选中构件类型时创建 / 切换时重建 ──────────────────────
const selectPart = (typeId) => {
  selectedType.value = selectedType.value === typeId ? null : typeId;
  rebuildGhost();
};

const rebuildGhost = () => {
  if (ghostMesh) {
    scene.remove(ghostMesh);
    ghostMesh.geometry.dispose();
    ghostMesh.material.dispose();
    ghostMesh = null;
  }
  if (!selectedType.value) return;
  const pt_def = PART_TYPES.find(p => p.id === selectedType.value);
  ghostMesh = new THREE.Mesh(
    new THREE.BoxGeometry(pt_def.w, pt_def.h, pt_def.d),
    new THREE.MeshStandardMaterial({
      color: pt_def.color, transparent: true, opacity: 0.45,
      emissive: new THREE.Color('#4488ff'), emissiveIntensity: 0.4,
    })
  );
  ghostMesh.rotation.y = (currentRotDeg.value * Math.PI) / 180;
  scene.add(ghostMesh);
};

// ── 清空 ────────────────────────────────────────────────────────
const clearAll = () => {
  [...placedMeshes].forEach(m => {
    scene.remove(m);
    m.geometry.dispose();
    m.material.dispose();
  });
  placedMeshes.length = 0;
  placedParts.value = [];
  hoveredMesh = null;
};

// ── 完工验收 ────────────────────────────────────────────────────
const checkCompletion = () => {
  const score = CHECKLIST.filter(c => getCount(c.key) >= c.min).length;
  resultScore.value = score;

  if (score === 4) {
    resultTitle.value = '房架建成！恭喜！';
    resultDesc.value = '四大构件全部就位，一座完整的抬梁式木构房架已然成形。\n古匠人的智慧就在你手中传承。';
  } else if (score >= 2) {
    resultTitle.value = '初具雏形，继续加油！';
    resultDesc.value = '房架框架已现，但仍有构件缺失，\n请参照右侧图纸补齐剩余构件。';
  } else {
    resultTitle.value = '万事起于基础';
    resultDesc.value = '先从础石和立柱开始，一步一步搭建。\n对照右侧"完工清单"完成每一步。';
  }
  showResult.value = true;
};


// ── 窗口自适应 ──────────────────────────────────────────────────
const onResize = () => {
  const el = containerRef.value;
  if (!el) return;
  const W = el.clientWidth, H = el.clientHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
};

// ── 动画循环 ────────────────────────────────────────────────────
const animate = () => {
  animId = requestAnimationFrame(animate);
  controls.update();

  // 虚影悬浮动效（使用赋值而非累加，避免漂移）
  if (ghostMesh) {
    ghostMesh.userData._baseY = ghostMesh.userData._baseY ?? ghostMesh.position.y;
    ghostMesh.position.y = ghostMesh.userData._baseY + Math.sin(Date.now() * 0.003) * 0.06;
  }

  renderer.render(scene, camera);
};
</script>

<style scoped>
/* ── 整体布局 ── */
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

/* ── 顶部导航 ── */
.assembly-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 60px;
  border-bottom: 1px solid rgba(200,154,90,0.2);
  background: rgba(10,7,3,0.7);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  gap: 16px;
}
.back-btn {
  padding: 7px 18px;
  background: rgba(139,90,43,0.3);
  border: 1px solid rgba(200,154,90,0.4);
  border-radius: 20px;
  color: #d4a96a;
  font-family: "楷体", serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.back-btn:hover { background: rgba(139,90,43,0.6); color: #f0d080; }
.nav-center { text-align: center; flex: 1; }
.nav-title {
  font-family: "楷体", serif;
  font-size: 20px;
  color: #f0d080;
  letter-spacing: 3px;
  margin: 0;
}
.nav-sub {
  font-size: 11px;
  color: rgba(200,160,80,0.5);
  letter-spacing: 2px;
  margin: 2px 0 0;
}
.finish-btn {
  padding: 9px 22px;
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-family: "楷体", serif;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(0,0,0,0.3);
  transition: all 0.2s;
}
.finish-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.4); }

/* ── 主体三列 ── */
.assembly-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── 左侧构件库 ── */
.palette {
  width: 148px;
  flex-shrink: 0;
  background: rgba(10,7,3,0.75);
  border-right: 1px solid rgba(200,154,90,0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 10px;
  overflow-y: auto;
}
.palette::-webkit-scrollbar { width: 3px; }
.palette::-webkit-scrollbar-thumb { background: rgba(200,154,90,0.2); border-radius: 2px; }
.palette-title {
  font-family: "楷体", serif;
  font-size: 14px;
  color: #c89a5a;
  letter-spacing: 3px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(200,154,90,0.2);
}
.part-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 8px;
  border-radius: 8px;
  border: 1px solid rgba(200,154,90,0.15);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  transition: all 0.2s;
}
.part-btn:hover { border-color: rgba(200,154,90,0.4); background: rgba(255,255,255,0.07); }
.part-btn.active {
  border-color: #c89a5a;
  background: rgba(200,154,90,0.12);
  box-shadow: 0 0 10px rgba(200,154,90,0.15);
}
.part-icon {
  width: 22px; height: 22px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.1);
}
.part-text { display: flex; flex-direction: column; gap: 2px; }
.part-label { font-family: "楷体", serif; font-size: 13px; color: #d4a96a; }
.part-count { font-size: 10px; color: rgba(200,154,90,0.5); }
.palette-divider {
  height: 1px;
  background: rgba(200,154,90,0.12);
  margin: 4px 0;
}
.quick-tips {
  display: flex; flex-direction: column; gap: 4px;
  font-size: 10px; line-height: 1.7;
  color: rgba(200,154,90,0.45);
  padding: 4px 2px;
}
.quick-tips b { color: rgba(200,154,90,0.7); }
.clear-btn {
  margin-top: auto;
  padding: 8px 0;
  background: rgba(200,50,30,0.12);
  border: 1px solid rgba(200,50,30,0.25);
  border-radius: 8px;
  color: rgba(200,100,80,0.7);
  font-family: "楷体", serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.clear-btn:hover { background: rgba(200,50,30,0.25); color: #ff8060; }

/* ── 中央画布 ── */
.canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.placing-indicator {
  position: absolute;
  top: 14px; left: 50%; transform: translateX(-50%);
  background: rgba(10,7,3,0.8);
  border: 1px solid rgba(200,154,90,0.5);
  border-radius: 24px;
  padding: 7px 18px;
  color: #c89a5a;
  font-size: 13px;
  letter-spacing: 1px;
  display: flex; align-items: center; gap: 10px;
  backdrop-filter: blur(8px);
  z-index: 5;
}
.placing-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #c89a5a;
  animation: blink 0.9s ease-in-out infinite alternate;
}
@keyframes blink { from { opacity: 0.3; } to { opacity: 1; } }
.orientation-tag {
  background: rgba(200, 154, 90, 0.2);
  border: 1px solid rgba(200, 154, 90, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #f0d080;
}
.cancel-place {
  background: none; border: 1px solid rgba(200,154,90,0.3);
  border-radius: 12px; padding: 2px 10px;
  color: rgba(200,154,90,0.7); font-size: 12px; cursor: pointer;
}
.canvas-hint-top {
  position: absolute;
  top: 14px; left: 50%; transform: translateX(-50%);
  background: rgba(10,7,3,0.65);
  border: 1px solid rgba(200,154,90,0.2);
  border-radius: 20px; padding: 6px 18px;
  color: rgba(200,154,90,0.5); font-size: 12px; letter-spacing: 1px;
  pointer-events: none; z-index: 5;
}

/* ── 右侧图纸 ── */
.blueprint {
  width: 168px;
  flex-shrink: 0;
  background: rgba(8,5,2,0.8);
  border-left: 1px solid rgba(200,154,90,0.15);
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  gap: 8px;
  overflow-y: auto;
}
.blueprint::-webkit-scrollbar { width: 3px; }
.blueprint::-webkit-scrollbar-thumb { background: rgba(200,154,90,0.2); border-radius: 2px; }
.blueprint-title {
  font-family: "楷体", serif;
  font-size: 13px; color: #c89a5a;
  letter-spacing: 2px; text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(200,154,90,0.15);
}
.svg-wrap {
  background: rgba(0,20,40,0.3);
  border: 1px solid rgba(100,150,200,0.2);
  border-radius: 8px;
  padding: 6px;
}
.bp-svg { width: 100%; height: auto; }
.checklist-title {
  font-family: "楷体", serif;
  font-size: 12px; color: rgba(200,154,90,0.6);
  letter-spacing: 2px; text-align: center;
}
.checklist { display: flex; flex-direction: column; gap: 6px; }
.check-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: rgba(200,154,90,0.45);
  padding: 5px 6px;
  border: 1px solid rgba(200,154,90,0.1);
  border-radius: 6px;
  transition: all 0.3s;
}
.check-item.done {
  color: #c89a5a;
  border-color: rgba(200,154,90,0.4);
  background: rgba(200,154,90,0.07);
}
.check-icon {
  font-size: 12px; min-width: 14px; text-align: center;
  color: inherit; font-weight: bold;
}
.check-label { flex: 1; }
.check-progress {
  font-size: 10px;
  color: rgba(200,154,90,0.4);
  white-space: nowrap;
}
.check-item.done .check-progress { color: #c89a5a; }

/* ── 完工弹窗 ── */
.result-overlay {
  position: absolute; inset: 0; z-index: 50;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
}
.result-card {
  background: linear-gradient(145deg, #2a1a08, #180e04);
  border: 2px solid #c89a5a;
  border-radius: 20px;
  padding: 40px 50px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  min-width: 340px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,220,120,0.12);
}
.result-score-ring { position: relative; width: 80px; height: 80px; }
.ring-svg { width: 80px; height: 80px; }
.ring-text {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: "楷体", serif; font-size: 19px; color: #f0d080;
}
.result-emoji { font-size: 52px; }
.result-title { font-family: "楷体", serif; font-size: 28px; color: #f0d080; margin: 0; }
.result-desc { font-size: 13px; color: rgba(200,170,100,0.75); line-height: 2; white-space: pre-line; margin: 0; }
.result-checks {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
}
.rc-item {
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid rgba(200,50,50,0.3);
  color: rgba(200,80,80,0.7);
  background: rgba(200,50,50,0.06);
}
.rc-item.pass {
  border-color: rgba(200,154,90,0.4);
  color: #c89a5a;
  background: rgba(200,154,90,0.08);
}
.result-actions { display: flex; gap: 12px; margin-top: 4px; }
.ra-btn {
  padding: 11px 28px; border: none; border-radius: 10px;
  font-family: "楷体", serif; font-size: 16px; cursor: pointer; transition: all 0.2s;
}
.ra-btn.primary { background: linear-gradient(135deg, #c89a5a, #a0724a); color: #fff; }
.ra-btn.secondary { background: rgba(255,255,255,0.07); border: 1px solid rgba(200,154,90,0.35); color: #d4a96a; }
.ra-btn:hover { transform: translateY(-2px); }

/* ── 弹窗过渡 ── */
.pop-enter-active, .pop-leave-active { transition: all 0.3s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.88); }
</style>
