// 安全Agent包装器 - 在现有Agent系统外包装
import { featureFlags } from '../config/featureFlags';
import { BlackboardManager } from './blackboardManager';

export class SafeAgentWrapper {
  private blackboard: BlackboardManager;

  constructor() {
    this.blackboard = BlackboardManager.getInstance();
  }

  // 安全的用户登录记录
  async safeRecordLogin(loginData: any): Promise<void> {
    try {
      // 如果启用黑板模式，记录到黑板
      if (featureFlags.enableBlackboard) {
        await this.blackboard.recordUserLogin(loginData);

        // 🎯 路演演示：调用真实API验证可用性
        await this.callRealAPIForDemo('login', loginData);
      }

      // 原有逻辑保持不变（不修改现有代码）
      console.log('✅ 用户登录已记录');
    } catch (error) {
      console.error('❌ 安全包装器错误:', error);
      // 错误不会影响原有系统
    }
  }

  // 安全的用户交互记录
  async safeRecordInteraction(interactionData: any): Promise<void> {
    try {
      if (featureFlags.enableBlackboard) {
        await this.blackboard.recordUserInteraction(interactionData);
      }
      console.log('✅ 用户交互已记录');
    } catch (error) {
      console.error('❌ 安全包装器错误:', error);
    }
  }

  // 安全的自动跳转记录
  async safeRecordRedirect(redirectData: any): Promise<void> {
    try {
      if (featureFlags.enableBlackboard) {
        await this.blackboard.recordAutoRedirect(redirectData);
      }
      console.log('✅ 自动跳转已记录');
    } catch (error) {
      console.error('❌ 安全包装器错误:', error);
    }
  }

  // 安全的Agent响应记录
  async safeRecordAgentResponse(responseData: any): Promise<void> {
    try {
      if (featureFlags.enableBlackboard) {
        await this.blackboard.recordAgentResponse(responseData);
      }
      console.log('✅ Agent响应已记录');
    } catch (error) {
      console.error('❌ 安全包装器错误:', error);
    }
  }

  // 获取黑板统计数据（用于演示）
  getBlackboardStats(): any {
    if (!featureFlags.enableBlackboard) {
      return { status: 'disabled', message: '黑板模式未启用' };
    }

    try {
      return {
        status: 'enabled',
        stats: this.blackboard.getStats(),
      };
    } catch (error) {
      return { status: 'error', error: error };
    }
  }

  // 🎯 路演演示：调用真实API验证可用性
  private async callRealAPIForDemo(type: string, data: any): Promise<void> {
    try {
      // 使用代码中的真实MiniMax配置
      const MINIMAX_CONFIG = {
        BASE_URL: 'https://api.minimax.chat/v1',
        API_KEY:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJscyBsbGx5eXlzc3MiLCJVc2VyTmFtZSI6ImxzIGxsbHl5eXNzcyIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTE4Nzk2Mjk4NDAwNTY3NDkyIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkxODc5NjI5ODM5NjM3MzE4OCIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6ImxsbC55eXkuc3NzLjc3QGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTIwIDE1OjUxOjQwIiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.Nvc6I_x53hQk_OSankcxU1uyb2Cek9-EhZoNO44mS1wsyiR2TNiof8FA9JmELCEBjnkomCCho1cxseEb098hAebTNklqRL5PlVl4rxaj4spAZt-1oloxojSSU3g-NoiurR-4dPcSMp43KOp0mc3Ci_piLylbxOG9H2WT3iN4Eaaj_558q7DgsbmpwLmpf3vOiy_j_qBEF5QztVN4gF8xhPasjXWAmT_hox7fmjTubn4PcQMbaAHKVBj95uP8l4VwbrjRpLaajyMIKHGoTS_0JAhmBH2psw49I2CouBNLggZGsOQS9XLepjX7euCtrMPJC7V0kPsUGJuxddLnYLrzJw',
        GROUP_ID: '1918796298396373188',
        MODELS: { AUDIO: 'speech-01-turbo' },
      };

      // 演示API调用（不发送实际数据，只验证连接）
      const response = await fetch(`${MINIMAX_CONFIG.BASE_URL}/check`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${MINIMAX_CONFIG.API_KEY}`,
          GroupId: MINIMAX_CONFIG.GROUP_ID,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ MiniMax API 连接正常 - 路演可用');
      } else {
        console.warn('⚠️ MiniMax API 连接异常 - 请检查配置');
      }
    } catch (error) {
      console.warn('⚠️ API 连接测试失败 - 可能影响路演演示:', error);
    }
  }
}
