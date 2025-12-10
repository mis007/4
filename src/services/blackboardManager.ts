// 黑板管理器 - 独立于现有Agent系统
import {
  BlackboardSharedPoolImpl,
  BlackboardCategory,
} from './blackboardSharedPool';

export class BlackboardManager {
  private static instance: BlackboardManager;
  private blackboard: BlackboardSharedPoolImpl;

  private constructor() {
    this.blackboard = new BlackboardSharedPoolImpl();
  }

  static getInstance(): BlackboardManager {
    if (!this.instance) {
      this.instance = new BlackboardManager();
    }
    return this.instance;
  }

  // 用户登录记录 - 独立方法
  async recordUserLogin(loginData: any): Promise<void> {
    await this.blackboard.writeToBoard(
      'user_context',
      `login:${loginData.uid}`,
      loginData,
      'BlackboardManager'
    );
  }

  // 用户交互记录 - 独立方法
  async recordUserInteraction(interactionData: any): Promise<void> {
    await this.blackboard.writeToBoard(
      'interaction_log',
      `interaction:${Date.now()}`,
      interactionData,
      'BlackboardManager'
    );
  }

  // 自动跳转记录 - 独立方法
  async recordAutoRedirect(redirectData: any): Promise<void> {
    await this.blackboard.writeToBoard(
      'interaction_log',
      `redirect:${Date.now()}`,
      redirectData,
      'BlackboardManager'
    );
  }

  // Agent响应记录 - 独立方法
  async recordAgentResponse(responseData: any): Promise<void> {
    await this.blackboard.writeToBoard(
      'agent_status',
      `response:${Date.now()}`,
      responseData,
      'BlackboardManager'
    );
  }

  // 获取统计数据 - 用于演示
  getStats(): { totalEntries: number; categories: Record<string, number> } {
    const stats = { totalEntries: 0, categories: {} as Record<string, number> };

    for (const [key, entry] of this.blackboard.storage.entries()) {
      if (!key.includes(':meta')) {
        const category = key.split(':')[0];
        stats.categories[category] = (stats.categories[category] || 0) + 1;
        stats.totalEntries++;
      }
    }

    return stats;
  }
}
