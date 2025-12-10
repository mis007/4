/**
 * 🔒 CRITICAL_DO_NOT_DELETE - 主题系统
 *
 * 东里村智能导游系统 - 现代化主题配置
 *
 * 设计理念：
 * - 军工品质：严谨、统一、规范
 * - 东里村特色：红色文化 + 生态自然
 * - 现代化：Material Design + Magic UI
 *
 * @author 东里村开发团队
 * @version 2.0.0
 * @since 2025-12-08
 */

import { ThemeConfig as AntdConfig, theme } from 'antd';

// 🎯 东里村主色调 - 基于当地文化特色
export const VillageColors = {
  // 红色文化系列
  red: {
    primary: '#d32f2f', // 主红色 - 革命红
    light: '#ff6b6b', // 浅红色 - 胜利红
    dark: '#a8071a', // 深红色 - 历史红
    gradient: 'linear-gradient(135deg, #d32f2f 0%, #a8071a 100%)',
  },

  // 生态自然系列
  green: {
    primary: '#52c41a', // 主绿色 - 生态绿
    light: '#73d13d', // 浅绿色 - 自然绿
    dark: '#389e0d', // 深绿色 - 森林绿
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
  },

  // 历史厚重系列
  gold: {
    primary: '#faad14', // 主金色 - 古铜金
    light: '#fcd34d', // 浅金色 - 文物金
    dark: '#d48806', // 深金色 - 古建筑金
    gradient: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
  },

  // 现代科技系列
  blue: {
    primary: '#1890ff', // 主蓝色 - 科技蓝
    light: '#40a9ff', // 浅蓝色 - 现代蓝
    dark: '#0050b3', // 深蓝色 - 深海蓝
    gradient: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
  },
};

// 🎯 统一间距系统 - 军工品质的精确规范
export const Spacing = {
  xs: '4px', // 超小间距
  sm: '8px', // 小间距
  md: '16px', // 中等间距
  lg: '24px', // 大间距
  xl: '32px', // 超大间距
  xxl: '48px', // 特大间距

  // 组件内部间距
  padding: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  margin: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
};

// 🎯 字体系统 - 兼顾传统和现代
export const Typography = {
  fontFamily: {
    primary: '"PingFang SC", "Microsoft YaHei", "SimHei", sans-serif', // 中文字体
    secondary: '"Roboto", "Helvetica Neue", Arial, sans-serif', // 英文和数字
    mono: '"Fira Code", "Consolas", "Monaco", monospace', // 等宽字体
  },

  fontSize: {
    xs: '12px', // 辅助文字
    sm: '14px', // 正文文字
    base: '16px', // 基础文字
    lg: '18px', // 重要文字
    xl: '20px', // 标题文字
    xxl: '24px', // 大标题
    xxxl: '32px', // 特大标题
  },

  lineHeight: {
    tight: 1.2, // 紧凑行高
    normal: 1.5, // 正常行高
    relaxed: 1.8, // 宽松行高
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// 🎯 圆角系统 - 现代化设计
export const BorderRadius = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  circle: '50%',

  // 特殊圆角
  card: '8px',
  button: '6px',
  input: '4px',
  modal: '12px',
};

// 🎯 阴影系统 - 增强立体感
export const Shadows = {
  xs: '0 1px 3px rgba(0, 0, 0, 0.12)',
  sm: '0 4px 6px rgba(0, 0, 0, 0.15)',
  md: '0 8px 16px rgba(0, 0, 0, 0.18)',
  lg: '0 12px 24px rgba(0, 0, 0, 0.24)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.32)',

  // 特殊阴影
  card: '0 4px 12px rgba(0, 0, 0, 0.15)',
  button: '0 2px 8px rgba(0, 0, 0, 0.2)',
  modal: '0 16px 32px rgba(0, 0, 0, 0.4)',
};

// 🎯 动画系统 - 流畅交互
export const Animations = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },

  easing: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
};

// 🎯 断点系统 - 响应式设计
export const Breakpoints = {
  xs: '480px', // 手机竖屏
  sm: '576px', // 手机横屏
  md: '768px', // 平板竖屏
  lg: '992px', // 平板横屏
  xl: '1200px', // 小型桌面
  xxl: '1600px', // 大型桌面
};

// 🎯 Ant Design主题配置 - 安全稳定版本
export const AntdTheme: AntdConfig = {
  token: {
    // 🎯 主色调 - 东里村特色
    colorPrimary: VillageColors.red.primary,
    colorSuccess: VillageColors.green.primary,
    colorWarning: VillageColors.gold.primary,
    colorError: '#ff4d4f',
    colorInfo: VillageColors.blue.primary,

    // 🎯 字体系统
    fontFamily: Typography.fontFamily.primary,
    fontSize: parseInt(Typography.fontSize.base),
    lineHeight: Typography.lineHeight.normal,

    // 🎯 圆角和阴影
    borderRadius: parseInt(BorderRadius.md),
    boxShadow: Shadows.sm,

    // 🎯 间距系统
    padding: parseInt(Spacing.md),
    margin: parseInt(Spacing.md),

    // 🎯 组件定制
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // 🎯 动画
    motionDurationSlow: Animations.duration.slow,
    motionDurationMid: Animations.duration.normal,
    motionDurationFast: Animations.duration.fast,
  },

  components: {
    // 🎯 按钮组件
    Button: {
      borderRadius: parseInt(BorderRadius.button),
      boxShadow: Shadows.button,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },

    // 🎯 卡片组件
    Card: {
      borderRadius: parseInt(BorderRadius.card),
      boxShadow: Shadows.card,
      padding: parseInt(Spacing.lg),
    },

    // 🎯 输入框组件
    Input: {
      borderRadius: parseInt(BorderRadius.input),
      boxShadow: 'none',
      padding: parseInt(Spacing.sm), // Simplified padding as number
      controlHeight: 40,
    },

    // 🎯 导航组件
    Menu: {
      borderRadius: parseInt(BorderRadius.md),
      boxShadow: 'none',
    },

    // 🎯 模态框组件
    Modal: {
      borderRadius: parseInt(BorderRadius.modal),
      boxShadow: Shadows.modal,
      padding: parseInt(Spacing.xl),
    },

    // 🎯 表格组件
    Table: {
      borderRadius: parseInt(BorderRadius.sm),
      boxShadow: 'none',
    },
  },

  algorithm: theme.defaultAlgorithm, // 启用算法主题（暗色模式支持）
};

// 🎯 Magic UI主题配置 - 现代化组件
export const MagicUITheme = {
  colors: {
    primary: VillageColors.red.primary,
    secondary: VillageColors.green.primary,
    accent: VillageColors.gold.primary,
    neutral: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
  },

  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  typography: Typography,
  animations: Animations,
  breakpoints: Breakpoints,
};

// 🎯 响应式主题配置
export const ResponsiveTheme = {
  xs: {
    ...AntdTheme,
    token: {
      ...AntdTheme.token,
      fontSize: parseInt(Typography.fontSize.sm),
      controlHeight: 36,
      controlHeightLG: 44,
    },
  },

  sm: {
    ...AntdTheme,
    token: {
      ...AntdTheme.token,
      fontSize: parseInt(Typography.fontSize.base),
      controlHeight: 40,
      controlHeightLG: 48,
    },
  },

  md: {
    ...AntdTheme,
    token: {
      ...AntdTheme.token,
      fontSize: parseInt(Typography.fontSize.lg),
      controlHeight: 44,
      controlHeightLG: 52,
    },
  },

  lg: {
    ...AntdTheme,
    token: {
      ...AntdTheme.token,
      fontSize: parseInt(Typography.fontSize.xl),
      controlHeight: 48,
      controlHeightLG: 56,
    },
  },

  xl: {
    ...AntdTheme,
    token: {
      ...AntdTheme.token,
      fontSize: parseInt(Typography.fontSize.xxl),
      controlHeight: 52,
      controlHeightLG: 60,
    },
  },
};

// 🎯 主题切换配置
export const AppThemeConfig = {
  light: AntdTheme,
  dark: {
    ...AntdTheme,
    token: {
      ...AntdTheme.token,
      colorBgContainer: '#141414',
      colorBgElevated: '#1f1f1f',
      colorBgLayout: '#000000',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorBorder: '#434343',
    },
  },
};

// 🎯 主题工具函数
export const ThemeUtils = {
  // 获取当前主题
  getCurrentTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('village-theme');
      return savedTheme || 'light';
    }
    return 'light';
  },

  // 设置主题
  setTheme: (theme: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('village-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  // 获取响应式主题
  getResponsiveTheme: () => {
    const width = window.innerWidth;
    if (width < parseInt(Breakpoints.md)) return ResponsiveTheme.xs;
    if (width < parseInt(Breakpoints.lg)) return ResponsiveTheme.sm;
    if (width < parseInt(Breakpoints.xl)) return ResponsiveTheme.md;
    if (width < parseInt(Breakpoints.xxl)) return ResponsiveTheme.lg;
    return ResponsiveTheme.xl;
  },

  // 应用主题到组件
  applyThemeToComponent: (component: string, variant: string = 'default') => {
    const theme = ThemeUtils.getCurrentTheme();
    const responsiveTheme = ThemeUtils.getResponsiveTheme();

    return {
      theme,
      responsiveTheme,
      variant,
      colors:
        theme === 'dark' ? AppThemeConfig.dark.token : AppThemeConfig.light.token,
    };
  },
};

export default AntdTheme;