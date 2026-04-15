/**
 * ═══════════════════════════════════════════════════════════════
 *  全局状态管理 —— 极简 Store（无 Pinia，纯 Vue 3 reactive）
 * ═══════════════════════════════════════════════════════════════
 *
 * 设计思路：
 *   - 利用 Vue 3 的 `reactive` 创建一个"单例响应式对象"并导出
 *   - 任何组件 import { store } from '@/store' 后，读写都是响应式的
 *   - 提供 localStorage 持久化，玩家刷新或关闭浏览器后进度不丢失
 *
 * 数据字段：
 *   inventory          —— 玩家背包：已收集的榫卯 ID 列表（不可重复）
 *   unlockedBuildings  —— 已修复/解锁的建筑 ID 列表
 *   currentPhase       —— 当前游戏阶段：'3d-challenge' | 'building-repair'
 */

import { reactive, watch } from 'vue';

// ── 本地持久化 Key ──────────────────────────────────────────
const STORAGE_KEY = 'seekwood_game_state';

/**
 * 从 localStorage 恢复上一次保存的状态
 * 如果不存在或解析失败，返回默认值
 */
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        inventory:         Array.isArray(parsed.inventory)         ? parsed.inventory         : [],
        unlockedBuildings: Array.isArray(parsed.unlockedBuildings) ? parsed.unlockedBuildings : [],
        currentPhase:      parsed.currentPhase || '3d-challenge',
        hasSeenTutorial:   parsed.hasSeenTutorial || false,
      };
    }
  } catch (e) {
    console.warn('[Store] localStorage 解析失败，使用默认状态', e);
  }
  // 默认初始状态
  return {
    inventory:         [],  // 例如 ['straight', 'dovetail', 'crosslap']
    unlockedBuildings: [],  // 例如 ['huguang']
    currentPhase:      '3d-challenge',
    hasSeenTutorial:   false,
  };
};

// ── 创建全局响应式 Store ──────────────────────────────────────
export const store = reactive(loadState());

// ── 自动持久化：任何字段变化时写入 localStorage ────────────────
watch(
  () => ({
    inventory:         [...store.inventory],
    unlockedBuildings: [...store.unlockedBuildings],
    currentPhase:      store.currentPhase,
    hasSeenTutorial:   store.hasSeenTutorial,
  }),
  (snapshot) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  },
  { deep: true }
);


// ═══════════════════════════════════════════════════════════════
//  操作方法（Mutations）
// ═══════════════════════════════════════════════════════════════

/**
 * 将一个榫卯 ID 加入背包（去重）
 * @param {string} jointId - 榫卯类型 ID，如 'straight', 'dovetail'
 * @returns {boolean} 是否为首次获得（true = 新增，false = 已拥有）
 *
 * 调用时机：3D 闯关通关成功的回调中
 * 示例：addJoint('dovetail')
 */
export const addJoint = (jointId) => {
  if (!jointId || typeof jointId !== 'string') {
    console.warn('[Store] addJoint: 无效的 jointId', jointId);
    return false;
  }
  if (store.inventory.includes(jointId)) {
    console.log(`[Store] 榫卯「${jointId}」已在背包中，跳过`);
    return false;
  }
  store.inventory.push(jointId);
  console.log(`[Store] ✅ 新榫卯「${jointId}」已存入背包`, store.inventory);
  return true;
};

/**
 * 解锁一座建筑（去重）
 * @param {string} buildingId - 建筑 ID，如 'huguang'
 * @returns {boolean} 是否为首次解锁
 *
 * 调用时机：建筑修复视图中所有热区都修复成功后
 */
export const unlockBuilding = (buildingId) => {
  if (!buildingId || typeof buildingId !== 'string') {
    console.warn('[Store] unlockBuilding: 无效的 buildingId', buildingId);
    return false;
  }
  if (store.unlockedBuildings.includes(buildingId)) {
    console.log(`[Store] 建筑「${buildingId}」已解锁，跳过`);
    return false;
  }
  store.unlockedBuildings.push(buildingId);
  console.log(`[Store] 🏛️ 建筑「${buildingId}」已解锁`, store.unlockedBuildings);
  return true;
};

/**
 * 切换游戏阶段
 * @param {'3d-challenge' | 'building-repair'} phase
 */
export const setPhase = (phase) => {
  store.currentPhase = phase;
  console.log(`[Store] 🔄 游戏阶段切换至：${phase}`);
};

/**
 * 检查背包中是否拥有指定榫卯
 * @param {string} jointId
 * @returns {boolean}
 */
export const hasJoint = (jointId) => {
  return store.inventory.includes(jointId);
};

/**
 * 重置所有状态（调试/重开用）
 */
export const resetStore = () => {
  store.inventory.length = 0;
  store.unlockedBuildings.length = 0;
  store.currentPhase = '3d-challenge';
  store.hasSeenTutorial = false;
  localStorage.removeItem(STORAGE_KEY);
  console.log('[Store] 🗑️ 状态已重置');
};

/**
 * 标记教程已完成
 */
export const completeTutorial = () => {
  store.hasSeenTutorial = true;
  console.log('[Store] ✅ 教程已标记为完成');
};
