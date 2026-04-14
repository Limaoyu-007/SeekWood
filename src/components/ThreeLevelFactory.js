import * as THREE from 'three';
import * as Helpers from '../utils/threeHelpers';

/**
 * 每一关的 3D 构件工厂
 * 根据 levelType 执行对应的场景搭建，并返回该关卡的状态数据
 */
export const buildLevel = (levelType, { scene, camera, controls }) => {
  let pieces       = [];
  let mortisePiece = null;
  let totalPieces  = 1;
  let breathAxis   = 'y';
  let snapDist     = 0.6;
  let snapRot      = 0.45;

  const context = { scene, camera, controls, pieces, mortisePiece, totalPieces, breathAxis, snapDist, snapRot };

  switch (levelType) {
    case 'straight':
      Object.assign(context, buildStraight(context));
      break;
    case 'dovetail':
      Object.assign(context, buildDovetail(context));
      break;
    case 'crosslap':
      Object.assign(context, buildCrossLap(context));
      break;
    case 'doubletenon':
      Object.assign(context, buildDoubleTenon(context));
      break;
    case 'twojoint':
      Object.assign(context, buildTwoJoint(context));
      break;
    case 'stoppedDovetail':
      Object.assign(context, buildStoppedDovetail(context));
      break;
    case 'miteredCorner':
      Object.assign(context, buildMiteredCorner(context));
      break;
    case 'cloudJoint':
      Object.assign(context, buildCloudJoint(context));
      break;
    case 'paWangJoint':
      Object.assign(context, buildPaWangJoint(context));
      break;
    case 'lubanLock':
      Object.assign(context, buildLubanLock(context));
      break;
  }

  return {
    pieces:       context.pieces,
    mortisePiece: context.mortisePiece,
    totalPieces:  context.totalPieces,
    breathAxis:   context.breathAxis,
    snapDist:     context.snapDist,
    snapRot:      context.snapRot,
  };
};

// ── 第一关：直榫 ────────────────────────────────────────────────
const buildStraight = ({ scene, camera, controls }) => {
  camera.position.set(6, 5, 8);
  controls.target.set(0, 0.3, 0);
  camera.lookAt(0, 0.3, 0);

  const SLOT_W = 1.4, SLOT_Z = 1.8, SLOT_H = 1.5, MORT_H = 2.2;
  const PLUG_W = SLOT_W - 0.10, PLUG_Z = SLOT_Z - 0.10, PLUG_H = SLOT_H;
  const HAT_W = 4.2, HAT_H = 0.6, WALL_W = 1.4;
  const BRIDGE_TOP_Y = -(MORT_H / 2) + (MORT_H - SLOT_H);

  const mortMat = new THREE.MeshStandardMaterial({ color: '#c08840', roughness: 0.85 });
  const mGroup  = new THREE.Group();
  Helpers.addBox(mGroup, WALL_W, MORT_H, SLOT_Z, -(SLOT_W / 2 + WALL_W / 2), 0, 0, mortMat);
  Helpers.addBox(mGroup, WALL_W, MORT_H, SLOT_Z,  (SLOT_W / 2 + WALL_W / 2), 0, 0, mortMat);
  Helpers.addBox(mGroup, SLOT_W, MORT_H - SLOT_H, SLOT_Z, 0, -(MORT_H / 2) + (MORT_H - SLOT_H) / 2, 0, mortMat);
  Helpers.addGrainLines(mGroup, -(SLOT_W / 2 + WALL_W / 2), 0.3, SLOT_Z, '#8a5e28');
  Helpers.addGrainLines(mGroup,  (SLOT_W / 2 + WALL_W / 2), 0.3, SLOT_Z, '#8a5e28');
  Helpers.addSlotGlow(mGroup, SLOT_W, SLOT_Z, MORT_H / 2);
  scene.add(mGroup);

  const tenMat = new THREE.MeshStandardMaterial({ color: '#6b3d18', roughness: 0.75 });
  const tGroup = new THREE.Group();
  Helpers.addBox(tGroup, PLUG_W, PLUG_H, PLUG_Z, 0, 0, 0, tenMat);
  Helpers.addBox(tGroup, HAT_W,  HAT_H,  PLUG_Z, 0, PLUG_H / 2 + HAT_H / 2, 0, tenMat.clone());
  Helpers.addGrainLines(tGroup, 0, 0, PLUG_Z, '#3d1e08');

  const initPos = new THREE.Vector3(3.0, 2.8, 2.5);
  const target  = new THREE.Vector3(0, BRIDGE_TOP_Y + PLUG_H / 2, 0);
  tGroup.position.copy(initPos);
  scene.add(tGroup);

  return {
    pieces: [Helpers.makePiece(tGroup, target, initPos)],
    mortisePiece: mGroup,
    totalPieces: 1,
    breathAxis: 'y'
  };
};

// ── 第二关：燕尾榫 ──────────────────────────────────────────────
const buildDovetail = ({ scene, camera, controls }) => {
  camera.position.set(0, 6, 10);
  controls.target.set(0, 0, 0);

  const SLOT_TOP_W = 1.0, SLOT_BOT_W = 1.6, SLOT_H = 1.4, SLOT_DEPTH = 1.6;
  const BODY_H = 2.2, WALL_THICK = 0.8;
  const BODY_W = SLOT_BOT_W + WALL_THICK * 2;
  const topCapH = (BODY_H - SLOT_H) / 2;
  const slopeW = (SLOT_BOT_W - SLOT_TOP_W) / 2;
  const slopeAngle = Math.atan2(slopeW, SLOT_H);
  const slopeLen   = Math.sqrt(slopeW ** 2 + SLOT_H ** 2);
  const leftBlockW = (BODY_W - SLOT_TOP_W) / 2;

  const mortMat  = new THREE.MeshStandardMaterial({ color: '#c59050', roughness: 0.85 });
  const slopeMat = new THREE.MeshStandardMaterial({ color: '#a87040', roughness: 0.8 });
  const mGroup   = new THREE.Group();

  Helpers.addBox(mGroup, leftBlockW, BODY_H, SLOT_DEPTH, -(SLOT_TOP_W / 2 + leftBlockW / 2), 0, 0, mortMat);
  Helpers.addBox(mGroup, leftBlockW, BODY_H, SLOT_DEPTH,  (SLOT_TOP_W / 2 + leftBlockW / 2), 0, 0, mortMat);
  Helpers.addBox(mGroup, SLOT_BOT_W, topCapH, SLOT_DEPTH, 0,  BODY_H / 2 - topCapH / 2, 0, mortMat);
  Helpers.addBox(mGroup, SLOT_BOT_W, topCapH, SLOT_DEPTH, 0, -BODY_H / 2 + topCapH / 2, 0, mortMat);

  const lSlope = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen, SLOT_DEPTH), slopeMat);
  lSlope.position.set(-(SLOT_TOP_W / 2 + slopeW / 2), 0, 0);
  lSlope.rotation.z = slopeAngle;
  mGroup.add(lSlope);
  const rSlope = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen, SLOT_DEPTH), slopeMat.clone());
  rSlope.position.set( (SLOT_TOP_W / 2 + slopeW / 2), 0, 0);
  rSlope.rotation.z = -slopeAngle;
  mGroup.add(rSlope);

  Helpers.addGrainLines(mGroup, -(SLOT_TOP_W / 2 + leftBlockW / 2), 0.4, SLOT_DEPTH, '#8a5e28');
  Helpers.addSlotGlow(mGroup, SLOT_TOP_W, SLOT_DEPTH, BODY_H / 2 + 0.01);
  scene.add(mGroup);

  const tenMat  = new THREE.MeshStandardMaterial({ color: '#5a3010', roughness: 0.72 });
  const wingMat = new THREE.MeshStandardMaterial({ color: '#6b3d18', roughness: 0.7 });
  const tGroup  = new THREE.Group();
  Helpers.addBox(tGroup, SLOT_TOP_W - 0.06, SLOT_H - 0.06, SLOT_DEPTH - 0.08, 0, 0, 0, tenMat);

  const lWing = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen - 0.08, SLOT_DEPTH - 0.08), wingMat);
  lWing.position.set(-(SLOT_TOP_W / 2 - 0.06 + slopeW / 2), 0, 0);
  lWing.rotation.z = slopeAngle;
  tGroup.add(lWing);
  const rWing = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen - 0.08, SLOT_DEPTH - 0.08), wingMat.clone());
  rWing.position.set( (SLOT_TOP_W / 2 - 0.06 + slopeW / 2), 0, 0);
  rWing.rotation.z = -slopeAngle;
  tGroup.add(rWing);

  const shoulderMat = new THREE.MeshStandardMaterial({ color: '#4a2808', roughness: 0.78 });
  Helpers.addBox(tGroup, BODY_W + 1.4, topCapH * 1.8, SLOT_DEPTH + 0.2, 0,  SLOT_H / 2 + topCapH * 0.9, 0, shoulderMat);
  Helpers.addBox(tGroup, BODY_W + 1.4, topCapH * 1.8, SLOT_DEPTH + 0.2, 0, -SLOT_H / 2 - topCapH * 0.9, 0, shoulderMat.clone());
  Helpers.addGrainLines(tGroup, 0, 0.3, SLOT_DEPTH, '#2a1004');

  const initPos = new THREE.Vector3(5.5, 0, 0);
  tGroup.position.copy(initPos);
  tGroup.rotation.y = -Math.PI / 2;
  scene.add(tGroup);

  return {
    pieces: [Helpers.makePiece(tGroup, new THREE.Vector3(0, 0, 0), initPos, 0, -Math.PI / 2)],
    mortisePiece: mGroup,
    totalPieces: 1,
    breathAxis: 'x',
    snapDist: 0.7
  };
};

// ── 第三关：十字搭接 ────────────────────────────────────────────
const buildCrossLap = ({ scene, camera, controls }) => {
  camera.position.set(5, 9, 7);
  controls.target.set(0, 0, 0);

  const BEAM_H = 1.0, BEAM_W = 1.2, ARM_L = 1.9, HALF_H = 0.5;
  const mortMat = new THREE.MeshStandardMaterial({ color: '#b88030', roughness: 0.85 });
  const mGroup  = new THREE.Group();
  Helpers.addBox(mGroup, ARM_L, BEAM_H, BEAM_W, -(BEAM_W / 2 + ARM_L / 2), 0, 0, mortMat);
  Helpers.addBox(mGroup, ARM_L, BEAM_H, BEAM_W,  (BEAM_W / 2 + ARM_L / 2), 0, 0, mortMat);
  Helpers.addBox(mGroup, BEAM_W, HALF_H, BEAM_W, 0, -HALF_H / 2, 0, mortMat);
  Helpers.addGrainLines(mGroup, -(BEAM_W / 2 + ARM_L / 2), 0.2, BEAM_W, '#8a5e28');
  Helpers.addGrainLines(mGroup,  (BEAM_W / 2 + ARM_L / 2), 0.2, BEAM_W, '#8a5e28');
  Helpers.addSlotGlow(mGroup, BEAM_W - 0.05, BEAM_W - 0.05, HALF_H + 0.01);
  scene.add(mGroup);

  const tenMat = new THREE.MeshStandardMaterial({ color: '#5a2e10', roughness: 0.72 });
  const tGroup = new THREE.Group();
  Helpers.addBox(tGroup, BEAM_W, BEAM_H, ARM_L, 0, 0, -(BEAM_W / 2 + ARM_L / 2), tenMat);
  Helpers.addBox(tGroup, BEAM_W, BEAM_H, ARM_L, 0, 0,  (BEAM_W / 2 + ARM_L / 2), tenMat);
  Helpers.addBox(tGroup, BEAM_W - 0.08, HALF_H, BEAM_W - 0.08, 0, HALF_H / 2, 0, tenMat.clone());
  Helpers.addGrainLines(tGroup, 0, 0.2, BEAM_W, '#2a1004');

  const initPos = new THREE.Vector3(0, 3.8, 0);
  tGroup.position.copy(initPos);
  scene.add(tGroup);

  return {
    pieces: [Helpers.makePiece(tGroup, new THREE.Vector3(0, 0, 0), initPos)],
    mortisePiece: mGroup,
    totalPieces: 1,
    breathAxis: 'y'
  };
};

// ── 第四关：双榫 ────────────────────────────────────────────────
const buildDoubleTenon = ({ scene, camera, controls }) => {
  camera.position.set(5, 7, 9);
  controls.target.set(0, 0, 0);

  const WALL_W = 1.2, DIV_W = 1.0, SLOT_W = 1.1;
  const BODY_H = 2.2, BODY_D = 1.6, SLOT_H = 1.5;
  const FILL_H = BODY_H - SLOT_H;
  const SLOT_CX = DIV_W / 2 + SLOT_W / 2;
  const T_Y = -(BODY_H / 2) + FILL_H + SLOT_H / 2;

  const mortMat = new THREE.MeshStandardMaterial({ color: '#c08840', roughness: 0.85 });
  const mGroup  = new THREE.Group();
  const LX = -(DIV_W / 2 + SLOT_W + WALL_W / 2);
  Helpers.addBox(mGroup, WALL_W, BODY_H, BODY_D, LX, 0, 0, mortMat);
  Helpers.addBox(mGroup, DIV_W,  BODY_H, BODY_D, 0,  0, 0, mortMat);
  Helpers.addBox(mGroup, WALL_W, BODY_H, BODY_D, -LX, 0, 0, mortMat);
  const fillY = -(BODY_H / 2) + FILL_H / 2;
  Helpers.addBox(mGroup, SLOT_W - 0.05, FILL_H, BODY_D, -SLOT_CX, fillY, 0, mortMat);
  Helpers.addBox(mGroup, SLOT_W - 0.05, FILL_H, BODY_D,  SLOT_CX, fillY, 0, mortMat);
  Helpers.addGrainLines(mGroup, LX,  0.3, BODY_D, '#8a5e28');
  Helpers.addGrainLines(mGroup, -LX, 0.3, BODY_D, '#8a5e28');
  Helpers.addSlotGlow(mGroup, SLOT_CX * 2 + SLOT_W * 0.7, BODY_D, BODY_H / 2 + 0.01);
  scene.add(mGroup);

  const tenMat = new THREE.MeshStandardMaterial({ color: '#5a3010', roughness: 0.72 });
  const tGroup = new THREE.Group();
  Helpers.addBox(tGroup, 6.8, 0.55, BODY_D - 0.1, 0, SLOT_H / 2 + 0.28, 0, tenMat.clone());
  Helpers.addBox(tGroup, SLOT_W - 0.12, SLOT_H, BODY_D - 0.12, -SLOT_CX, 0, 0, tenMat);
  Helpers.addBox(tGroup, SLOT_W - 0.12, SLOT_H, BODY_D - 0.12,  SLOT_CX, 0, 0, tenMat.clone());
  Helpers.addGrainLines(tGroup, 0, 0.4, BODY_D, '#2a1004');

  const initPos = new THREE.Vector3(0, 3.8, 0);
  tGroup.position.copy(initPos);
  scene.add(tGroup);

  return {
    pieces: [Helpers.makePiece(tGroup, new THREE.Vector3(0, T_Y, 0), initPos)],
    mortisePiece: mGroup,
    totalPieces: 1,
    breathAxis: 'y'
  };
};

// ── 第五关：双联卯眼 ────────────────────────────────────────────
const buildTwoJoint = ({ scene, camera, controls }) => {
  camera.position.set(0, 8, 12);
  controls.target.set(0, 0, 0);

  const SLOT_W = 1.2, SLOT_Z = 1.6, SLOT_H = 1.4, MORT_H = 2.0;
  const WALL_W = 1.2, BRIDGE_H = MORT_H - SLOT_H;
  const CX = 2.8;

  const makeMortise = (groupOffsetX, glowColor = '#ffcc44') => {
    const mat = new THREE.MeshStandardMaterial({ color: '#c08840', roughness: 0.85 });
    const g   = new THREE.Group();
    Helpers.addBox(g, WALL_W, MORT_H, SLOT_Z, -(SLOT_W / 2 + WALL_W / 2), 0, 0, mat);
    Helpers.addBox(g, WALL_W, MORT_H, SLOT_Z,  (SLOT_W / 2 + WALL_W / 2), 0, 0, mat);
    Helpers.addBox(g, SLOT_W, BRIDGE_H, SLOT_Z, 0, -(MORT_H / 2) + BRIDGE_H / 2, 0, mat);
    Helpers.addGrainLines(g, -(SLOT_W / 2 + WALL_W / 2), 0.3, SLOT_Z, '#8a5e28');
    Helpers.addGrainLines(g,  (SLOT_W / 2 + WALL_W / 2), 0.3, SLOT_Z, '#8a5e28');
    Helpers.addSlotGlow(g, SLOT_W, SLOT_Z, MORT_H / 2, glowColor);
    g.position.x = groupOffsetX;
    scene.add(g);
    return g;
  };

  const leftMortise  = makeMortise(-CX, '#ffcc44');
  const rightMortise = makeMortise( CX, '#44ccff');

  const makeTenon = (colorMain, colorHat) => {
    const mat = new THREE.MeshStandardMaterial({ color: colorMain, roughness: 0.75 });
    const g   = new THREE.Group();
    Helpers.addBox(g, SLOT_W - 0.1, SLOT_H, SLOT_Z - 0.1, 0, 0, 0, mat);
    Helpers.addBox(g, 4.2, 0.6, SLOT_Z - 0.1, 0, SLOT_H / 2 + 0.3, 0,
      new THREE.MeshStandardMaterial({ color: colorHat, roughness: 0.78 }));
    Helpers.addGrainLines(g, 0, 0, SLOT_Z, '#3d1e08');
    return g;
  };

  const leftTenon  = makeTenon('#6b3d18', '#5a3010');
  const rightTenon = makeTenon('#1e4d7a', '#153a5c');

  const lInitPos = new THREE.Vector3(-CX - 3.0, 3.5, 2.5);
  const lTarget  = new THREE.Vector3(-CX, -(MORT_H / 2) + BRIDGE_H + SLOT_H / 2, 0);
  leftTenon.position.copy(lInitPos);
  scene.add(leftTenon);

  const rInitPos = new THREE.Vector3(CX + 3.0, 3.5, 2.5);
  const rTarget  = new THREE.Vector3(CX, -(MORT_H / 2) + BRIDGE_H + SLOT_H / 2, 0);
  rightTenon.position.copy(rInitPos);
  rightTenon.rotation.y = -Math.PI / 2;
  scene.add(rightTenon);

  return {
    pieces: [
      Helpers.makePiece(leftTenon,  lTarget, lInitPos, 0, 0,            leftMortise),
      Helpers.makePiece(rightTenon, rTarget, rInitPos, 0, -Math.PI / 2, rightMortise),
    ],
    mortisePiece: leftMortise,
    totalPieces: 2,
    breathAxis: 'y',
    snapDist: 0.65,
    snapRot: 0.55
  };
};

// ── 第六关：半隐燕尾榫 ──────────────────────────────────────────
const buildStoppedDovetail = ({ scene, camera, controls }) => {
  camera.position.set(6, 6, 8);
  controls.target.set(0, 0, 0);

  const SLOT_TOP_W = 1.0, SLOT_BOT_W = 1.6, SLOT_H = 1.4, SLOT_DEPTH = 1.2;
  const BODY_H = 2.4, BODY_W = 3.2, BODY_D = 2.0;
  const wallThick = (BODY_D - SLOT_DEPTH);

  const mortMat  = new THREE.MeshStandardMaterial({ color: '#b58548', roughness: 0.85 });
  const slopeMat = new THREE.MeshStandardMaterial({ color: '#9a6538', roughness: 0.8 });
  const mGroup   = new THREE.Group();

  const slopeW = (SLOT_BOT_W - SLOT_TOP_W) / 2;
  const slopeAngle = Math.atan2(slopeW, SLOT_H);
  const slopeLen = Math.sqrt(slopeW ** 2 + SLOT_H ** 2);

  const slotZOffset = (BODY_D - SLOT_DEPTH) / 2;
  Helpers.addBox(mGroup, (BODY_W - SLOT_TOP_W) / 2, BODY_H, SLOT_DEPTH, -(SLOT_TOP_W / 2 + (BODY_W - SLOT_TOP_W) / 4), 0, slotZOffset, mortMat);
  Helpers.addBox(mGroup, (BODY_W - SLOT_TOP_W) / 2, BODY_H, SLOT_DEPTH,  (SLOT_TOP_W / 2 + (BODY_W - SLOT_TOP_W) / 4), 0, slotZOffset, mortMat);
  Helpers.addBox(mGroup, SLOT_BOT_W, (BODY_H - SLOT_H) / 2, SLOT_DEPTH, 0,  BODY_H / 2 - (BODY_H - SLOT_H) / 4, slotZOffset, mortMat);
  Helpers.addBox(mGroup, SLOT_BOT_W, (BODY_H - SLOT_H) / 2, SLOT_DEPTH, 0, -BODY_H / 2 + (BODY_H - SLOT_H) / 4, slotZOffset, mortMat);

  Helpers.addBox(mGroup, BODY_W, BODY_H, wallThick, 0, 0, -(BODY_D - wallThick) / 2, mortMat.clone());

  const lSlope = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen, SLOT_DEPTH), slopeMat);
  lSlope.position.set(-(SLOT_TOP_W / 2 + slopeW / 2), 0, slotZOffset);
  lSlope.rotation.z = slopeAngle;
  mGroup.add(lSlope);
  const rSlope = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen, SLOT_DEPTH), slopeMat.clone());
  rSlope.position.set( (SLOT_TOP_W / 2 + slopeW / 2), 0, slotZOffset);
  rSlope.rotation.z = -slopeAngle;
  mGroup.add(rSlope);

  Helpers.addSlotGlow(mGroup, SLOT_TOP_W, SLOT_DEPTH, BODY_H / 2 + 0.01);
  scene.add(mGroup);

  const tenMat = new THREE.MeshStandardMaterial({ color: '#4a2808', roughness: 0.72 });
  const tGroup = new THREE.Group();
  Helpers.addBox(tGroup, SLOT_TOP_W - 0.08, SLOT_H - 0.08, SLOT_DEPTH - 0.1, 0, 0, 0, tenMat);

  const lWing = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen - 0.08, SLOT_DEPTH - 0.1), tenMat.clone());
  lWing.position.set(-(SLOT_TOP_W / 2 - 0.04 + slopeW / 2), 0, 0);
  lWing.rotation.z = slopeAngle;
  tGroup.add(lWing);
  const rWing = Helpers.makeMesh(new THREE.BoxGeometry(0.12, slopeLen - 0.08, SLOT_DEPTH - 0.1), tenMat.clone());
  rWing.position.set( (SLOT_TOP_W / 2 - 0.04 + slopeW / 2), 0, 0);
  rWing.rotation.z = -slopeAngle;
  tGroup.add(rWing);

  Helpers.addBox(tGroup, BODY_W + 1, 0.6, SLOT_DEPTH + 0.2, 0,  SLOT_H / 2 + 0.3, 0, tenMat.clone());
  Helpers.addBox(tGroup, BODY_W + 1, 0.6, SLOT_DEPTH + 0.2, 0, -SLOT_H / 2 - 0.3, 0, tenMat.clone());

  const initPos = new THREE.Vector3(3.5, 4.2, 4.0);
  const target  = new THREE.Vector3(0, 0, slotZOffset);
  tGroup.position.copy(initPos);
  tGroup.rotation.y = Math.PI / 4; // Initial random rotation to add difficulty
  scene.add(tGroup);

  return {
    pieces: [Helpers.makePiece(tGroup, target, initPos, 0, Math.PI / 4)],
    mortisePiece: mGroup,
    totalPieces: 1,
    breathAxis: 'y',
    snapDist: 0.6
  };
};

// ── 第七关：粽角榫 (Mitered Corner Joint) ──────────────────────────
const buildMiteredCorner = ({ scene, camera, controls }) => {
  camera.position.set(8, 8, 10);
  controls.target.set(0, 0, 0);

  const LEG_W = 1.4, LEG_H = 4.0;
  const BEAM_W = 1.2, BEAM_H = 1.2, BEAM_L = 3.2;
  const TENON_W = 0.5, TENON_H = 1.0, TENON_L = 1.0;

  const legMat   = new THREE.MeshStandardMaterial({ color: '#5a2e10', roughness: 0.8 });
  const beamAMat = new THREE.MeshStandardMaterial({ color: '#b58548', roughness: 0.75 });
  const beamBMat = new THREE.MeshStandardMaterial({ color: '#c09050', roughness: 0.75 });

  // ── 立柱 (腿部) ────────────────────────────────────────────────
  const legGroup = new THREE.Group();
  // 底部长柱
  Helpers.addBox(legGroup, LEG_W, LEG_H - BEAM_H, LEG_W, 0, -(BEAM_H / 2), 0, legMat);
  // 顶部中心块 (留出插孔空间)
  Helpers.addBox(legGroup, 0.4, BEAM_H, 0.4, 0, (LEG_H / 2) - (BEAM_H / 2), 0, legMat.clone());

  // 粽角格肩 (45度斜面效果)
  const shoulderSize = Math.sqrt(LEG_W ** 2 + BEAM_H ** 2) * 0.75;
  const miterA = Helpers.makeMesh(new THREE.BoxGeometry(LEG_W, 0.1, shoulderSize), legMat.clone());
  miterA.position.set(0, (LEG_H / 2) - BEAM_H, 0);
  miterA.rotation.x = Math.PI / 4;
  legGroup.add(miterA);

  const miterB = Helpers.makeMesh(new THREE.BoxGeometry(shoulderSize, 0.1, LEG_W), legMat.clone());
  miterB.position.set(0, (LEG_H / 2) - BEAM_H, 0);
  miterB.rotation.z = -Math.PI / 4;
  legGroup.add(miterB);

  // 卯眼提示辉光
  Helpers.addSlotGlow(legGroup, BEAM_W, BEAM_W, LEG_H / 2);
  scene.add(legGroup);

  // ── 横梁 A (X轴方向) ──────────────────────────────────────────
  const tGroupA = new THREE.Group();
  // 横梁主体
  Helpers.addBox(tGroupA, BEAM_L, BEAM_H, BEAM_W, -(BEAM_L / 2 + LEG_W / 2), 0, 0, beamAMat);
  // 榫头
  Helpers.addBox(tGroupA, TENON_L, TENON_H, TENON_W, -LEG_W / 4, 0, 0, beamAMat.clone());
  // 45度斜面
  const beamMiterA = Helpers.makeMesh(new THREE.BoxGeometry(0.1, BEAM_H * 1.5, BEAM_W), beamAMat.clone());
  beamMiterA.position.set(-LEG_W / 2, 0, 0);
  beamMiterA.rotation.z = Math.PI / 4;
  tGroupA.add(beamMiterA);

  const initPosA = new THREE.Vector3(-4.0, 3.0, 4.0);
  const targetA  = new THREE.Vector3(0, (LEG_H / 2) - (BEAM_H / 2), 0);
  tGroupA.position.copy(initPosA);
  tGroupA.rotation.y = -Math.PI / 2; // 错位 90°
  scene.add(tGroupA);

  // ── 横梁 B (Z轴方向) ──────────────────────────────────────────
  const tGroupB = new THREE.Group();
  // 横梁主体
  Helpers.addBox(tGroupB, BEAM_W, BEAM_H, BEAM_L, 0, 0, -(BEAM_L / 2 + LEG_W / 2), beamBMat);
  // 榫头
  Helpers.addBox(tGroupB, TENON_W, TENON_H, TENON_L, 0, 0, -LEG_W / 4, beamBMat.clone());
  // 45度斜面
  const beamMiterB = Helpers.makeMesh(new THREE.BoxGeometry(BEAM_W, BEAM_H * 1.5, 0.1), beamBMat.clone());
  beamMiterB.position.set(0, 0, -LEG_W / 2);
  beamMiterB.rotation.x = -Math.PI / 4;
  tGroupB.add(beamMiterB);

  const initPosB = new THREE.Vector3(4.0, 3.0, -4.0);
  const targetB  = new THREE.Vector3(0, (LEG_H / 2) - (BEAM_H / 2), 0);
  tGroupB.position.copy(initPosB);
  tGroupB.rotation.y = Math.PI; // 错位 180°
  scene.add(tGroupB);

  return {
    pieces: [
      Helpers.makePiece(tGroupA, targetA, initPosA, 0, -Math.PI / 2, legGroup),
      Helpers.makePiece(tGroupB, targetB, initPosB, 0, Math.PI,      legGroup)
    ],
    mortisePiece: legGroup,
    totalPieces: 2,
    breathAxis: 'y',
    snapDist: 0.55,
    snapRot: 0.4
  };
};

// ── 第八关：勾挂榫 (Hooked / Cloud Joint) ──────────────────────────
const buildCloudJoint = ({ scene, camera, controls }) => {
  camera.position.set(0, 8, 12);
  controls.target.set(0, 0, 0);

  const BASE_W = 4.0, BASE_H = 1.2, BASE_D = 1.4;
  const STEP_W = 0.8, STEP_H = 0.5;

  const mMat = new THREE.MeshStandardMaterial({ color: '#3d1e08', roughness: 0.85 }); // 深红木
  const tMat = new THREE.MeshStandardMaterial({ color: '#8b4513', roughness: 0.75 }); // 浅胡桃

  // ── 卯眼基础 (左侧构件) ────────────────────────────────────────
  const mGroup = new THREE.Group();
  // 底部长块
  Helpers.addBox(mGroup, BASE_W / 2, BASE_H, BASE_D, -BASE_W / 4, 0, 0, mMat);
  // 勾状台阶 (上方勾)
  Helpers.addBox(mGroup, STEP_W, STEP_H, BASE_D, STEP_W / 2,  BASE_H / 2 - STEP_H / 2, 0, mMat.clone());
  // 勾状台阶 (下方靠背)
  Helpers.addBox(mGroup, STEP_W, STEP_H, BASE_D, 0, -BASE_H / 2 + STEP_H / 2, 0, mMat.clone());

  Helpers.addGrainLines(mGroup, -BASE_W / 4, 0.4, BASE_D, '#1a0d04');
  Helpers.addSlotGlow(mGroup, STEP_W * 2, BASE_D, BASE_H / 2 + 0.1);
  scene.add(mGroup);

  // ── 榫头 (右侧移动构件) ────────────────────────────────────────
  const tGroup = new THREE.Group();
  // 主体
  Helpers.addBox(tGroup, BASE_W / 2, BASE_H, BASE_D - 0.1, BASE_W / 4, 0, 0, tMat);
  // 互锁台阶 (下方勾)
  Helpers.addBox(tGroup, STEP_W - 0.05, STEP_H - 0.05, BASE_D - 0.1, -STEP_W / 2, -BASE_H / 2 + STEP_H / 2, 0, tMat.clone());
  // 互锁台阶 (上方遮挡)
  Helpers.addBox(tGroup, STEP_W - 0.05, STEP_H - 0.05, BASE_D - 0.1, 0, BASE_H / 2 - STEP_H / 2, 0, tMat.clone());

  Helpers.addGrainLines(tGroup, BASE_W / 4, 0.4, BASE_D, '#4a250b');

  const initPos = new THREE.Vector3(5.0, 2.5, 3.0);
  const target  = new THREE.Vector3(STEP_W, 0, 0); // 与左侧台阶咬合
  tGroup.position.copy(initPos);
  tGroup.rotation.y = Math.PI; // 初始旋转 180°
  scene.add(tGroup);

  return {
    pieces: [Helpers.makePiece(tGroup, target, initPos, 0, Math.PI)],
    mortisePiece: mGroup,
    totalPieces: 1,
    breathAxis: 'x',
    snapDist: 0.5,
    snapRot: 0.4
  };
};

// ── 第九关：霸王枨 + 挂钩楔 (Pa-Wang Joint with Locking Wedge) Remastered ──────────
const buildPaWangJoint = ({ scene, camera, controls }) => {
  camera.position.set(12, 6, 15);
  controls.target.set(2, 0, 0);

  const LEG_W = 1.4, LEG_H = 8.0, APRON_H = 1.6, APRON_D = 1.2;
  const woodMat = new THREE.MeshStandardMaterial({ color: '#5a2010', roughness: 0.8 }); // 更高级的紫檀色
  const wedgeMat = new THREE.MeshStandardMaterial({ color: '#e8d0a0', roughness: 0.4 }); // 象牙/骨色楔子

  // ── 基础：立柱（带明榫孔）与束腰边框 ──────────────────────────
  const baseGroup = new THREE.Group();
  
  // 1. 桌腿：由四块木板拼接成的带有真实榫孔的立柱
  Helpers.addBox(baseGroup, LEG_W, 3.0, LEG_W, 0, -2.5, 0, woodMat); // 下段
  Helpers.addBox(baseGroup, LEG_W, 1.4, 0.4, 0, 0, -0.5, woodMat); // 榫眼壁1
  Helpers.addBox(baseGroup, LEG_W, 1.4, 0.4, 0, 0,  0.5, woodMat); // 榫眼壁2
  Helpers.addBox(baseGroup, LEG_W, 3.5, LEG_W, 0,  2.45, 0, woodMat.clone()); // 上段
  
  // 2. 束腰边框 (Apron)
  Helpers.addBox(baseGroup, 12, 1.8, 1.2, 5.5, 3.5, 0, woodMat.clone()); // 裙板主体
  const waistMat = woodMat.clone();
  waistMat.color.multiplyScalar(0.7);
  Helpers.addBox(baseGroup, 12, 0.4, 1.3, 5.5, 2.6, 0, waistMat); // 束腰细节线
  
  Helpers.addSlotGlow(baseGroup, 1.2, 1.2, 0); // 将引导辉光放入真正的孔洞中
  scene.add(baseGroup);

  // ── 霸王枨 (流畅平滑的 S 曲线，带渐变厚度) ──────────────────
  const braceGroup = new THREE.Group();
  const segments = 20;
  const totalLength = 5.5;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lx = t * totalLength;
    const ly = Math.sin(t * Math.PI) * 2.2 - t * 4.8;
    // 厚度根据曲线位置渐变，中间部分最细最优雅
    const thickness = 0.8 - Math.sin(t * Math.PI) * 0.4;
    Helpers.addBox(braceGroup, 0.4, thickness, thickness, lx, ly, 0, woodMat.clone());
  }
  // 霸王枨顶部的燕尾勾头
  const hookMat = woodMat.clone();
  hookMat.color.offsetHSL(0, 0, 0.05);
  Helpers.addBox(braceGroup, 1.3, 1.3, 1.0, -0.4, 0.8, 0, hookMat);
  Helpers.addGrainLines(braceGroup, 2.5, -1.0, 0.8, '#3a0a04');

  const bInitPos = new THREE.Vector3(8.0, -1.0, 6.0);
  const bTarget  = new THREE.Vector3(LEG_W / 2, 0, 0); // 准确插入桌腿孔洞位置
  braceGroup.position.copy(bInitPos);
  braceGroup.rotation.y = -Math.PI / 2;
  scene.add(braceGroup);

  // ── 锁定挂钩楔 (具有实体感的小楔子) ──────────────────────────
  const wedgeGroup = new THREE.Group();
  Helpers.addBox(wedgeGroup, 0.35, 1.0, 0.6, 0, 0, 0, wedgeMat);
  Helpers.addBox(wedgeGroup, 0.5,  0.2, 0.8, 0, 0.6, 0, wedgeMat.clone()); // 楔子顶盖

  const wInitPos = new THREE.Vector3(3.0, -2.5, 9.0);
  const wTarget  = new THREE.Vector3(LEG_W / 2 + 0.35, 1.2, 0); // 锁在大件勾头正上方
  wedgeGroup.position.copy(wInitPos);
  wedgeGroup.rotation.y = Math.PI / 3;
  scene.add(wedgeGroup);

  return {
    pieces: [
      Helpers.makePiece(braceGroup, bTarget, bInitPos, 0, -Math.PI / 2, baseGroup),
      Helpers.makePiece(wedgeGroup, wTarget, wInitPos, 0, Math.PI / 3,  baseGroup),
    ],
    mortisePiece: baseGroup,
    totalPieces: 2,
    breathAxis: 'y',
    snapDist: 0.75, // 适当放开距离吸附，提升解题体验
    snapRot: 0.45
  };
};

// ── 第十关：终极挑战：鲁班三才锁 (The Luban Lock) ──────────────────────
const buildLubanLock = ({ scene, camera, controls }) => {
  camera.position.set(12, 12, 12);
  controls.target.set(0, 0, 0);

  const L = 6.0, W = 1.2;
  const woodXMat = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.9 }); // 黑檀 (天)
  const woodYMat = new THREE.MeshStandardMaterial({ color: '#8b4513', roughness: 0.8 }); // 黄花梨 (地)
  const woodZMat = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.7 }); // 金丝楠 (人)

  // ── 构件 1：X 轴 (基座 - 平放) ──────────────────────────────────
  const group1 = new THREE.Group();
  Helpers.addBox(group1, (L - W) / 2, W, W, -(L / 4 + W / 4), 0, 0, woodXMat);
  Helpers.addBox(group1, (L - W) / 2, W, W,  (L / 4 + W / 4), 0, 0, woodXMat.clone());
  Helpers.addBox(group1, W, W / 2, W, 0, -W / 4, 0, woodXMat.clone());
  
  Helpers.addSlotGlow(group1, W, W, 0);
  scene.add(group1);

  // ── 构件 2：Y 轴 (跨越件 - 垂直) ────────────────────────────────
  const group2 = new THREE.Group();
  Helpers.addBox(group2, W, (L - W) / 2, W, 0, -(L / 4 + W / 4), 0, woodYMat);
  Helpers.addBox(group2, W, (L - W) / 2, W, 0,  (L / 4 + W / 4), 0, woodYMat.clone());
  Helpers.addBox(group2, W, W, W / 2, 0, 0, -W / 4, woodYMat.clone()); // 后壁

  const initPos2 = new THREE.Vector3(0, 5.0, 4.0);
  const target2  = new THREE.Vector3(0, 0, 0);
  group2.position.copy(initPos2);
  group2.rotation.z = Math.PI / 4; // 随机旋转
  scene.add(group2);

  // ── 构件 3：Z 轴 (锁定件 - 穿梭) ────────────────────────────────
  const group3 = new THREE.Group();
  Helpers.addBox(group3, W - 0.1, W - 0.1, L, 0, 0, 0, woodZMat);
  const zInitPos = new THREE.Vector3(4.0, -3.0, 6.0);
  const zTarget  = new THREE.Vector3(0, 0, 0);
  group3.position.copy(zInitPos);
  group3.rotation.x = -Math.PI / 3; // 随机旋转
  scene.add(group3);

  return {
    pieces: [
      Helpers.makePiece(group2, target2, initPos2, 0, Math.PI / 4, group1),
      Helpers.makePiece(group3, zTarget, zInitPos, 0, -Math.PI / 3, group1),
    ],
    mortisePiece: group1,
    totalPieces: 2,
    breathAxis: 'y',
    snapDist: 0.45,
    snapRot: 0.35
  };
};
