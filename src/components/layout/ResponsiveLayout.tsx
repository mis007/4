/**
 * 🔒 CRITICAL_DO_NOT_DELETE - 响应式布局组件
 *
 * 东里村智能导游系统 - 响应式布局系统
 *
 * 设计理念：
 * - 军工品质：严谨、统一、规范
 * - 响应式设计：适配所有设备
 * - 性能优化：懒加载和代码分割
 * - 用户体验：友好的交互反馈
 * - 模块化：可复用的布局组件
 *
 * @author 东里村开发团队
 * @version 2.0.0
 * @since 2025-12-08
 */

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  VillageColors,
  Spacing,
  BorderRadius,
  Breakpoints,
} from '../../styles/theme';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * 🎯 响应式布局组件 - 军工品质设计
 *
 * 特点：
 * - 自适应布局：桌面侧边栏 + 移动底部导航
 * - 断点管理：精确的响应式断点
 * - 性能优化：按需加载组件
 * - 用户体验：流畅的布局切换
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title = '东里村智能导游',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 响应式检测
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width < parseInt(Breakpoints.md, 10);
      const collapsed = width < parseInt(Breakpoints.lg, 10);

      setIsMobile(mobile);
      setSidebarCollapsed(collapsed);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // 🎯 移动端导航菜单
  const mobileMenuItems = [
    {
      key: 'home',
      label: '首页',
      path: '/',
      icon: '🏠',
    },
    {
      key: 'spots',
      label: '景点',
      path: '/category/nature-spots',
      icon: '🌳',
    },
    {
      key: 'culture',
      label: '文化',
      path: '/category/red-culture',
      icon: '🏛️',
    },
    {
      key: 'figures',
      label: '人物',
      path: '/category/village-figures',
      icon: '👥',
    },
    {
      key: 'chat',
      label: '对话',
      path: '/chat',
      icon: '💬',
    },
    {
      key: 'profile',
      label: '我的',
      path: '/profile',
      icon: '👤',
    },
  ];

  // 🎯 桌面端导航菜单
  const desktopMenuItems = [
    {
      key: 'dashboard',
      label: '仪表板',
      path: '/admin/dashboard',
      icon: '📊',
    },
    {
      key: 'users',
      label: '用户管理',
      path: '/admin/users',
      icon: '👥',
    },
    {
      key: 'content',
      label: '内容管理',
      path: '/admin/content',
      icon: '📝',
    },
    {
      key: 'analytics',
      label: '数据分析',
      path: '/admin/analytics',
      icon: '📈',
    },
    {
      key: 'settings',
      label: '系统设置',
      path: '/admin/settings',
      icon: '⚙️',
    },
  ];

  // 🎯 处理菜单点击
  const handleMenuClick = (key: string) => {
    const menuItem = [...mobileMenuItems, ...desktopMenuItems].find(
      item => item.key === key
    );
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  // 🎯 获取当前选中的菜单
  const getSelectedKeys = () => {
    const pathname = location.pathname;

    if (isMobile) {
      // 移动端逻辑
      const mobileKey = mobileMenuItems.find(item =>
        pathname.includes(item.path)
      )?.key;
      return mobileKey ? [mobileKey] : [];
    } else {
      // 桌面端逻辑
      const desktopKey = desktopMenuItems.find(item =>
        pathname.includes(item.path)
      )?.key;
      return desktopKey ? [desktopKey] : [];
    }
  };

  // 🎯 渲染移动端布局
  const renderMobileLayout = () => (
    <Layout className="mobile-layout">
      {/* 移动端顶部栏 */}
      <Layout.Header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-logo">
            <span
              style={{
                background: `linear-gradient(135deg, ${VillageColors.red.primary} 0%, ${VillageColors.red.light} 100%)`,
                padding: `${Spacing.xs} ${Spacing.sm}`,
                borderRadius: BorderRadius.md,
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              东里村
            </span>
          </div>
          <div className="mobile-title">{title}</div>
        </div>
      </Layout.Header>

      {/* 移动端主内容 */}
      <Layout.Content className="mobile-content">{children}</Layout.Content>

      {/* 移动端底部导航 */}
      <Layout.Footer className="mobile-footer">
        <div className="mobile-nav">
          {mobileMenuItems.map(item => (
            <div
              key={item.key}
              className={`mobile-nav-item ${getSelectedKeys().includes(item.key) ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.key)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </div>
          ))}
        </div>
      </Layout.Footer>
    </Layout>
  );

  // 🎯 渲染桌面端布局
  const renderDesktopLayout = () => (
    <Layout className="desktop-layout">
      {/* 桌面端侧边栏 */}
      <Layout.Sider
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        width={240}
        className="desktop-sidebar"
        style={{
          background: `linear-gradient(180deg, ${VillageColors.red.primary}dd 0%, ${VillageColors.red.primary} 0%)`,
          borderRight: `1px solid ${VillageColors.red.primary}20`,
        }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span
              style={{
                background: `linear-gradient(135deg, ${VillageColors.gold.light} 0%, ${VillageColors.gold.primary} 100%)`,
                padding: `${Spacing.sm} ${Spacing.md}`,
                borderRadius: BorderRadius.circle,
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              东里村
            </span>
          </div>
          <div className="sidebar-title">{title}</div>
        </div>

        {/* 桌面端导航菜单 */}
        <div className="sidebar-menu">
          {desktopMenuItems.map(item => (
            <div
              key={item.key}
              className={`sidebar-menu-item ${getSelectedKeys().includes(item.key) ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.key)}
              style={{
                padding: `${Spacing.sm} ${Spacing.md}`,
                borderRadius: BorderRadius.md,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${item.key}-hover`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '';
              }}
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              <span className="sidebar-menu-label">{item.label}</span>
            </div>
          ))}
        </div>
      </Layout.Sider>

      {/* 桌面端主内容 */}
      <Layout className="desktop-main">
        <Layout.Header className="desktop-header">
          <div className="desktop-header-content">
            <div className="header-left">
              <div className="header-actions">
                <button
                  className="sidebar-toggle"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  {sidebarCollapsed ? '☰' : '☰'}
                </button>
              </div>
            </div>
            <div className="header-center">
              <h1 className="page-title">{title}</h1>
            </div>
            <div className="header-right">
              {/* 用户信息区域 */}
              <div className="user-info">
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <div className="user-name">管理员</div>
                  <div className="user-role">超级管理员</div>
                </div>
              </div>
            </div>
          </div>
        </Layout.Header>

        <Layout.Content className="desktop-content">{children}</Layout.Content>
      </Layout>
    </Layout>
  );

  return (
    <div className="responsive-layout">
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </div>
  );
};

export default ResponsiveLayout;
