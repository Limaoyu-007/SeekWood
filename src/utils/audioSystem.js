import { ref } from 'vue';

/**
 * 寻木·榫卯 音频管理系统
 * 负责 BGM 的循环播放与物理音效的实时合成
 */
class AudioSystem {
  constructor() {
    this.context = null;
    this.bgm = null;
    this.isMuted = ref(false);
    this.bgmVolume = 0.45; // 默认音量，留出交互反馈空间
  }

  /**
   * 初始化音频上下文（需在用户交互后调用以绕过浏览器限制）
   */
  init() {
    if (this.context) return;
    
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      
      // 初始化 BGM
      this.bgm = new Audio('/audio/Bgm.mp3');
      this.bgm.loop = true;
      this.bgm.volume = this.isMuted.value ? 0 : this.bgmVolume;
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
    }
  }

  /**
   * 恢复并播放音频
   */
  resume() {
    if (!this.context) this.init();
    
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
    
    if (this.bgm && this.bgm.paused && !this.isMuted.value) {
      this.bgm.play().catch(err => {
        console.warn('BGM autoplay blocked or failed:', err);
      });
    }
  }

  /**
   * 切换静音状态
   */
  toggleMute() {
    this.isMuted.value = !this.isMuted.value;
    if (this.bgm) {
      if (this.isMuted.value) {
        // 静音时平滑淡出并关闭
        this.bgm.pause();
      } else {
        // 取消静音时重新开始
        if (this.context && this.context.state === 'suspended') {
          this.context.resume();
        }
        this.bgm.volume = this.bgmVolume;
        this.bgm.play().catch(() => {});
      }
    }
  }

  /**
   * 播放木块碰撞音效（使用真实采样文件）
   */
  playSnap() {
    if (this.isMuted.value) return;
    const sfx = new Audio('/audio/snap.mp3');
    sfx.volume = 0.75;
    sfx.play().catch(() => {});
  }

  /**
   * 播放轻微点击声 (UI Click)
   */
  playClick() {
    if (!this.context || this.isMuted.value) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const audioSystem = new AudioSystem();
