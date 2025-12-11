/**
 * 🔒 CRITICAL_DO_NOT_DELETE - 布局组件
 *
 * 东里村智能导游系统 - 现代化布局组件
 *
 * 设计理念：
 * - 军工品质：严谨、统一、规范
 * - 响应式设计：适配所有设备
 * - 模块化：可复用的布局组件
 * - 性能优化：懒加载和代码分割
 *
 * @author 东里村开发团队
 * @version 2.0.0
 * @since 2025-12-08
 */

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeUtils, VillageColors } from '../../styles/theme';

const { Header, Content, Sider } = Layout;

interface VillageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * 🎯 现代化布局组件 - 军工品质设计
 *
 * 特点：
 * - 响应式导航：桌面侧边栏 + 移动底部导航
 * - 主题切换：支持明暗主题
 * - 用户信息：显示用户状态
 * - 面包屑导航：清晰的层级结构
 * - 性能优化：懒加载和缓存
 */
export const VillageLayout: React.FC<VillageLayoutProps> = ({
  children,
  title = '东里村智能导游',
  subtitle = '红色文化 · 生态旅游 · 智能导览',
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 响应式检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setCollapsed(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 🎯 主题切换
  useEffect(() => {
    const savedTheme = ThemeUtils.getCurrentTheme();
    setCurrentTheme((savedTheme as 'light' | 'dark') || 'light');
  }, []);

  // 🎯 导航菜单配置
  const menuItems: any[] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      path: '/',
    },
    {
      key: 'spots',
      icon: <EnvironmentOutlined />,
      label: '景点导览',
      children: [
        {
          key: 'nature-spots',
          label: '自然景观',
          path: '/category/nature-spots',
        },
        {
          key: 'red-culture',
          label: '红色文化',
          path: '/category/red-culture',
        },
        {
          key: 'village-figures',
          label: '村镇人物',
          path: '/category/village-figures',
        },
      ],
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: '智能对话',
      path: '/chat',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      path: '/profile',
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '游览记录',
      path: '/history',
    },
  ];

  // 🎯 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '系统设置',
      icon: <SettingOutlined />,
    },
    {
      key: 'theme',
      label: currentTheme === 'light' ? '暗色主题' : '亮色主题',
      icon: <EnvironmentOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <UserOutlined />,
    },
  ];

  // 🎯 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  // 🎯 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'theme':
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        ThemeUtils.setTheme(newTheme);
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        // 处理退出登录逻辑
        localStorage.removeItem('user-token');
        navigate('/login');
        break;
    }
  };

  // 🎯 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    const keys: string[] = [];

    menuItems.forEach(item => {
      if (item.path === pathname) {
        keys.push(item.key);
      } else if (item.children) {
        item.children.forEach((child: any) => {
          if (child.path === pathname) {
            keys.push(child.key);
          }
        });
      }
    });

    return keys;
  };

  // 🎯 面包屑配置
  const getBreadcrumbItems = () => {
    const pathname = location.pathname;
    const items = [{ title: '首页', path: '/' }];

    if (pathname !== '/') {
      const menuItem = menuItems.find(item => item.path === pathname);
      if (menuItem && menuItem.path) {
        items.push({ title: menuItem.label, path: menuItem.path });

        if (menuItem.children) {
          const childItem = ((menuItem.children as any[]) || []).find(
            (child: any) => child.path === pathname
          );
          if (childItem) {
            items.push({ title: childItem.label, path: childItem.path });
          }
        }
      }
    }

    return items;
  };

  // 🎯 移动端导航
  const MobileNavigation = () => (
    <div className="mobile-navigation">
      <Menu
        mode="horizontal"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '14px',
        }}
      />
    </div>
  );

  // 🎯 桌面端侧边栏
  const DesktopSidebar = () => (
    <div className="desktop-sidebar">
      <div className="logo-section">
        <div
          className="logo"
          style={{
            background: `linear-gradient(135deg, ${VillageColors.red.primary} 0%, ${VillageColors.red.light} 100%)`,
          }}
        >
          <span className="logo-text">东里村</span>
        </div>
        <div className="logo-subtitle">智能导游系统</div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          border: 'none',
          background: 'transparent',
        }}
      />
    </div>
  );

  // 🎯 用户信息区域
  const UserInfo = () => (
    <div className="user-info">
      <Avatar
        size="small"
        style={{
          backgroundColor: VillageColors.gold.primary,
          cursor: 'pointer',
        }}
        icon={<UserOutlined />}
      />
      <Dropdown
        menu={{ items: userMenuItems as any }}
        placement="bottomRight"
        trigger={['click']}
        onOpenChange={() => {}}
      >
        <Button
          type="text"
          icon={<UserOutlined />}
          onClick={(e) => {
            const key = (e.target as any).getAttribute('data-key');
            if (key) handleUserMenuClick({ key });
          }}
          style={{ color: '#ffffff' }}
        >
          游客
        </Button>
      </Dropdown>
    </div>
  );

  // 🎯 主题切换按钮
  const ThemeToggle = () => (
    <Button
      type="text"
      icon={<EnvironmentOutlined />}
      onClick={() => handleUserMenuClick({ key: 'theme' })}
      style={{
        color: '#ffffff',
        border: 'none',
      }}
    >
      {currentTheme === 'light' ? '🌙' : '☀️'}
    </Button>
  );

  return (
    <Layout className={`village-layout ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* 🎯 移动端顶部导航 */}
      {isMobile && (
        <Header className="mobile-header">
          <div className="mobile-header-content">
            <div className="mobile-logo">
              <span className="logo-text">东里村</span>
            </div>
            <UserInfo />
            <ThemeToggle />
          </div>
        </Header>
      )}

      {/* 🎯 桌面端侧边栏 */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          className="desktop-sider"
          style={{
            background: `linear-gradient(180deg, ${VillageColors.red.primary}dd 0%, ${VillageColors.red.primary} 0%)`,
          }}
        >
          <DesktopSidebar />
        </Sider>
      )}

      {/* 🎯 移动端底部导航 */}
      {isMobile && <MobileNavigation />}

      {/* 🎯 主内容区域 */}
      <Layout className="main-layout">
        {/* 🎯 桌面端顶部栏 */}
        {!isMobile && (
          <Header className="desktop-header">
            <div className="desktop-header-content">
              <div className="header-left">
                <Button
                  type="text"
                  icon={collapsed ? <MenuOutlined /> : <MenuOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ color: '#ffffff' }}
                />
              </div>
              <div className="header-center">
                <h1 className="page-title">{title}</h1>
                <p className="page-subtitle">{subtitle}</p>
              </div>
              <div className="header-right">
                <UserInfo />
                <ThemeToggle />
              </div>
            </div>
          </Header>
        )}

        {/* 🎯 面包屑导航 */}
        <div className="breadcrumb-section">
          <div className="breadcrumb-container">
            {getBreadcrumbItems().map((item, index) => (
              <span key={item.path} className="breadcrumb-item">
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                <span
                  className="breadcrumb-text"
                  onClick={() => item.path && navigate(item.path)}
                >
                  {item.title}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* 🎯 主要内容 */}
        <Content className="main-content">
          <div className="content-wrapper">{children}</div>
        </Content>
      </Layout>

      {/* 🎯 移动端底部导航 */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <div className="mobile-nav-item" onClick={() => navigate('/home')}>
            <HomeOutlined />
            <span>首页</span>
          </div>
          <div className="mobile-nav-item" onClick={() => navigate('/chat')}>
            <MessageOutlined />
            <span>对话</span>
          </div>
          <div className="mobile-nav-item" onClick={() => navigate('/profile')}>
            <UserOutlined />
            <span>我的</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VillageLayout;
