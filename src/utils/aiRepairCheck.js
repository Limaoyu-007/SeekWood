/**
 * ═══════════════════════════════════════════════════════════════
 *  模块三：AI 智能判错反馈机制核心逻辑
 * ═══════════════════════════════════════════════════════════════
 *
 * 当玩家在建筑修复中选错榫卯时，动态生成 Prompt 给大模型，
 * 返回一段"鲁班大师"的古风点评。
 */

export const fetchRepairFeedback = async (structureName, wrongJointName, rightJointName) => {
  const API_KEY = import.meta.env.VITE_AI_API_KEY;
  const API_URL = import.meta.env.VITE_AI_API_URL;
  const MODEL   = import.meta.env.VITE_AI_MODEL || 'deepseek-chat';

  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return '（缺少 API_KEY）老朽正在打盹，等东家把文书（Key）填好再来吧。';
  }

  // 动态生成 Prompt 模板
  const prompt = `玩家在修复【${structureName}】时，错误地使用了【${wrongJointName}】（正确应为【${rightJointName}】）。请你扮演古代木匠鲁班，用不超过60字的古风语言，指出错误构件在该位置抗拉力/承重不足的缺点，并鼓励他重试。`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一位名叫"鲁班"的古代木匠大师，精通中国古建筑与榫卯结构。回答请务必遵循古朴口吻，指出受力不足的缺点，不超过60字。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const detail = err?.error?.message || err?.message || JSON.stringify(err);
      console.error('[AI Repair] 接口错误:', response.status, detail);
      return `风大听不清（接口错误 ${response.status}），请老弟再试试。`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '老朽一时语塞，你且再琢磨琢磨。';
  } catch (error) {
    console.error('[AI Repair] 网络异常:', error);
    return '老朽身染风寒不便作答（网络异常），请稍后再试。';
  }
};
