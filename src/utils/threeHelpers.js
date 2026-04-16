import * as THREE from 'three';

/**
 * 创建 Mesh 并启用阴影
 */
export const makeMesh = (geo, mat) => {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  return m;
};

/**
 * 向父级添加一个立方体 Mesh
 */
export const addBox = (parent, w, h, d, x, y, z, mat) => {
  const m = makeMesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
};

/**
 * 添加木材纹理装饰线（用于增加构件细节感）
 */
export const addGrainLines = (parent, x, y, depth, color) => {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 1.0 });
  [-depth / 2 + 0.08, depth / 2 - 0.08].forEach(z => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.12), mat);
    m.position.set(x, y, z);
    parent.add(m);
  });
};

/**
 * 添加卯眼辉光（用于交互提示）
 */
export const addSlotGlow = (parent, w, d, topY, glowColor = '#ffcc44') => {
  const glowMat = new THREE.MeshStandardMaterial({
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: 0.0,
    transparent: true,
    opacity: 0.55,
  });
  const glow = new THREE.Mesh(new THREE.BoxGeometry(w - 0.05, 0.05, d - 0.05), glowMat);
  glow.position.set(0, topY, 0);
  glow.name = 'slotGlow';
  parent.add(glow);
  return glow;
};

/**
 * 创建一个 Piece 记录结构
 */
export const makePiece = (mesh, target, initPos, targetRotY = 0, initRotY = 0, mortise = null) => {
  const origColors = new Map();
  mesh.traverse(o => {
    if (o.isMesh) {
      origColors.set(o.uuid, o.material.color.getHex());
    }
  });

  return {
    mesh,
    target,
    initPos: initPos.clone(),
    targetRotY,
    initRotY,
    placed: false,
    mortise,
    origColors,
  };
};

/**
 * 添加通用场景灯光
 */
export const buildLights = (scene) => {
  scene.add(new THREE.AmbientLight('#ffd890', 0.55));

  const dir = new THREE.DirectionalLight('#fff8e0', 2.2);
  dir.position.set(6, 12, 8);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.left = dir.shadow.camera.bottom = -12;
  dir.shadow.camera.right = dir.shadow.camera.top = 12;
  dir.shadow.camera.near = 1;
  dir.shadow.camera.far = 40;
  scene.add(dir);

  const fill = new THREE.DirectionalLight('#d08040', 0.5);
  fill.position.set(-5, 3, -3);
  scene.add(fill);
};

/**
 * 添加通用场景地面
 */
export const buildGround = (scene) => {
  const mat = new THREE.MeshStandardMaterial({ color: '#1e150a', roughness: 0.95 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1.5;
  mesh.receiveShadow = true;
  scene.add(mesh);
};
