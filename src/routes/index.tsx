/**
 * 🔧 统一路由系统 - 修复前后端路由钩子对接问题
 *
 * 问题分析：
 * 1. 存在多个路由入口：index.tsx、src/pages/index.tsx、App.tsx、src/pages/App.tsx
 * 2. 路由配置分散，缺乏统一管理
 * 3. 移动端和管理端路由混合，导致钩子失效
 * 4. 缺乏路由守卫和权限控制
 *
 * 解决方案：
 * 1. 统一路由入口和配置
 * 2. 实现路由守卫和权限控制
 * 3. 分离移动端和管理端路由
 * 4. 添加路由钩子和状态管理
 */

import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ConfigProvider as ADMConfigProvider } from 'antd-mobile';

// 导入移动端页面
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import CategoryPage from '../pages/CategoryPage';
import ChatPageEnhanced from '../components/ChatPageEnhanced';
import SpotListPage from '../pages/SpotListPage';
import SpotDetailPage from '../pages/SpotDetailPage';
import UserProfilePage from '../pages/UserProfilePage';
import FiguresCategoryPage from '../pages/FiguresCategoryPage';
import AnnouncementPage from '../pages/AnnouncementPage';
import CheckInPage from '../pages/CheckInPage';
import RedCultureListPage from '../pages/RedCultureListPage';
import NatureSpotsListPage from '../pages/NatureSpotsListPage';

// 导入管理后台组件
import AdminPanelRefactored from '../components/AdminPanelRefactored';
import AgentManager from '../components/AgentManager';

// 导入布局组件
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import VillageLayout from '../components/layout/VillageLayout';

// 路由类型定义
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
  requireAuth?: boolean;
  isAdmin?: boolean;
  isMobile?: boolean;
}

// 路由配置
const MOBILE_ROUTES: RouteConfig[] = [
  { path: '/login', component: LoginPage, title: '登录', isMobile: true },
  { path: '/home', component: HomePage, title: '首页', isMobile: true },
  { path: '/category', component: CategoryPage, title: '分类', isMobile: true },
  {
    path: '/chat',
    component: ChatPageEnhanced,
    title: 'AI对话',
    isMobile: true,
  },
  {
    path: '/spotlist/:type',
    component: SpotListPage,
    title: '景点列表',
    isMobile: true,
  },
  {
    path: '/spotdetail/:id',
    component: SpotDetailPage,
    title: '景点详情',
    isMobile: true,
  },
  {
    path: '/checkin/:spotId',
    component: CheckInPage,
    title: '打卡',
    isMobile: true,
  },
  {
    path: '/figures',
    component: FiguresCategoryPage,
    title: '人物',
    isMobile: true,
  },
  {
    path: '/announcements',
    component: AnnouncementPage,
    title: '公告',
    isMobile: true,
  },
  {
    path: '/profile',
    component: UserProfilePage,
    title: '个人中心',
    requireAuth: true,
    isMobile: true,
  },
  {
    path: '/red-culture',
    component: RedCultureListPage,
    title: '红色文化',
    isMobile: true,
  },
  {
    path: '/nature-spots',
    component: NatureSpotsListPage,
    title: '自然景点',
    isMobile: true,
  },
];

const ADMIN_ROUTES: RouteConfig[] = [
  {
    path: '/admin',
    component: AdminPanelRefactored,
    title: '管理后台',
    isAdmin: true,
  },
  {
    path: '/agent',
    component: AgentManager,
    title: 'Agent管理',
    isAdmin: true,
  },
];

// 路由守卫组件
const RouteGuard: React.FC<{
  config: RouteConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user_info');

      if (config.requireAuth && (!token || !user)) {
        // 需要认证但未登录，跳转到登录页
        navigate('/login', { state: { from: location.pathname } });
        return false;
      }

      setIsAuthenticated(!!token);
      setIsLoading(false);
      return true;
    };

    checkAuth();
  }, [config.requireAuth, location.pathname, navigate]);

  // 设置页面标题
  useEffect(() => {
    if (config.title) {
      document.title = `${config.title} - 东里村智能导游`;
    }
  }, [config.title]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
          color: '#666',
        }}
      >
        正在加载...
      </div>
    );
  }

  return <>{children}</>;
};

// 移动端路由组件
const MobileRoutes: React.FC = () => {
  return (
    <ADMConfigProvider>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontSize: 14,
          },
        }}
      >
        <ResponsiveLayout>
          <Routes>
            {MOBILE_ROUTES.map(route => (
              <React.Fragment key={route.path}>
                <Route
                  path={route.path}
                  element={
                    <RouteGuard config={route}>
                      <route.component />
                    </RouteGuard>
                  }
                />
              </React.Fragment>
            ))}
            {/* 默认路由 */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </ResponsiveLayout>
      </ConfigProvider>
    </ADMConfigProvider>
  );
};

// 管理端路由组件
const AdminRoutes: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <VillageLayout>
        <Routes>
          {ADMIN_ROUTES.map(route => (
            <React.Fragment key={route.path}>
              <Route
                path={route.path}
                element={
                  <RouteGuard config={route}>
                    <route.component />
                  </RouteGuard>
                }
              />
            </React.Fragment>
          ))}
          {/* 默认路由 */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </VillageLayout>
    </ConfigProvider>
  );
};

// 主路由组件
const UnifiedRouter: React.FC = () => {
  const location = useLocation();
  const [appMode, setAppMode] = useState<'mobile' | 'admin'>('mobile');

  useEffect(() => {
    // 根据路径判断应用模式
    const isAdminPath = ADMIN_ROUTES.some(route =>
      location.pathname.startsWith(route.path)
    );

    setAppMode(isAdminPath ? 'admin' : 'mobile');
  }, [location.pathname]);

  // 路由钩子 - 记录页面访问
  useEffect(() => {
    const pageVisit = {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      appMode,
    };

    // 记录到本地存储（可以后续发送到后端）
    const visits = JSON.parse(localStorage.getItem('page_visits') || '[]');
    visits.push(pageVisit);

    // 只保留最近100条记录
    if (visits.length > 100) {
      visits.splice(0, visits.length - 100);
    }

    localStorage.setItem('page_visits', JSON.stringify(visits));

    console.log('🔍 路由钩子记录:', pageVisit);
  }, [location.pathname, appMode]);

  return (
    <Router>{appMode === 'mobile' ? <MobileRoutes /> : <AdminRoutes />}</Router>
  );
};

// 路由工具函数
export const routeUtils = {
  // 判断是否为移动端路由
  isMobileRoute: (path: string): boolean => {
    return MOBILE_ROUTES.some(route =>
      new RegExp(`^${route.path.replace(/:[^/]+/g, '[^/]+')}$`).test(path)
    );
  },

  // 判断是否为管理端路由
  isAdminRoute: (path: string): boolean => {
    return ADMIN_ROUTES.some(route =>
      new RegExp(`^${route.path.replace(/:[^/]+/g, '[^/]+')}$`).test(path)
    );
  },

  // 获取路由配置
  getRouteConfig: (path: string): RouteConfig | null => {
    const allRoutes = [...MOBILE_ROUTES, ...ADMIN_ROUTES];
    return (
      allRoutes.find(route =>
        new RegExp(`^${route.path.replace(/:[^/]+/g, '[^/]+')}$`).test(path)
      ) || null
    );
  },

  // 生成导航链接
  generateNavLinks: (mode: 'mobile' | 'admin') => {
    const routes = mode === 'mobile' ? MOBILE_ROUTES : ADMIN_ROUTES;
    return routes
      .filter(route => !route.path.includes(':')) // 过滤掉动态路由
      .map(route => ({
        path: route.path,
        title: route.title || route.path,
        icon: route.path.includes('/admin')
          ? '🏛️'
          : route.path.includes('/agent')
            ? '🤖'
            : route.path.includes('/home')
              ? '🏠'
              : route.path.includes('/chat')
                ? '💬'
                : route.path.includes('/profile')
                  ? '👤'
                  : '📄',
      }));
  },

  // 获取页面访问统计
  getPageStats: () => {
    const visits = JSON.parse(localStorage.getItem('page_visits') || '[]');

    const stats = visits.reduce((acc: any, visit: any) => {
      const key = visit.path;
      if (!acc[key]) {
        acc[key] = { count: 0, lastVisit: null, appMode: visit.appMode };
      }
      acc[key].count++;
      acc[key].lastVisit = visit.timestamp;
      return acc;
    }, {});

    return stats;
  },
};

export default UnifiedRouter;