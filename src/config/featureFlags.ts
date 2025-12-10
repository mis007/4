// 功能开关配置 - 完全独立
export interface FeatureFlags {
  enableBlackboard: boolean;
  enableDemoData: boolean;
  enableAdvancedLogging: boolean;
}

// 默认配置
const defaultFlags: FeatureFlags = {
  enableBlackboard: process.env.VITE_ENABLE_BLACKBOARD === 'true',
  enableDemoData: process.env.VITE_ENABLE_DEMO_DATA === 'true',
  enableAdvancedLogging: process.env.VITE_ENABLE_ADVANCED_LOGGING === 'true',
};

export const featureFlags = defaultFlags;

// 环境变量说明：
// VITE_ENABLE_BLACKBOARD=true  - 启用黑板模式
// VITE_ENABLE_DEMO_DATA=true   - 启用演示数据
// VITE_ENABLE_ADVANCED_LOGGING=true - 启用详细日志
