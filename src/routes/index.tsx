import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider as ADMConfigProvider } from 'antd-mobile';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件引入
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

// 后台组件引入
import AdminPanelRefactored from '../components/AdminPanelRefactored';
import AgentManager from '../components/AgentManager';

// 布局组件
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

// 路由配置接口
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
  requireAuth?: boolean;
}

// 移动端路由表 (对应 User API)
const MOBILE_ROUTES: RouteConfig[] = [
  { path: '/login', component: LoginPage, title: '登录' },
  { path: '/home', component: HomePage, title: '首页' },
  { path: '/category', component: CategoryPage, title: '分类' },
  { path: '/chat', component: ChatPageEnhanced, title: 'AI导游' },
  { path: '/spotlist/:type', component: SpotListPage, title: '景点列表' },
  { path: '/spotdetail/:id', component: SpotDetailPage, title: '景点详情' },
  { path: '/checkin/:spotId', component: CheckInPage, title: '打卡' },
  { path: '/figures', component: FiguresCategoryPage, title: '人物志' },
  { path: '/announcements', component: AnnouncementPage, title: '公告' },
  { path: '/profile', component: UserProfilePage, title: '个人中心', requireAuth: true },
  { path: '/red-culture', component: RedCultureListPage, title: '红色文化' },
  { path: '/nature-spots', component: NatureSpotsListPage, title: '自然风光' },
];

// 管理端路由表 (对应 Admin API)
const ADMIN_ROUTES: RouteConfig[] = [
  { path: '/admin', component: AdminPanelRefactored, title: '管理后台', requireAuth: true },
  { path: '/agent', component: AgentManager, title: 'Agent调试', requireAuth: true },
];

// 路由监听器（实现后端需要的行为追踪）
const RouteObserver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // 模拟向后端上报访问日志
    console.log(`[路由钩子] 访问路径: ${location.pathname}, 时间: ${new Date().toISOString()}`);
    // 实际项目中这里会调用 apiService.logVisit(location.pathname)
  }, [location]);

  return <>{children}</>;
};

// 移动端渲染器
const MobileRenderer = () => (
  <ADMConfigProvider locale={zhCN}>
    <ResponsiveLayout>
      <Routes>
        {MOBILE_ROUTES.map((route) => {
          const RouteAny = Route as any;
          return (
            <RouteAny 
              key={route.path} 
              path={route.path} 
              element={<route.component />} 
            />
          );
        })}
      </Routes>
    </ResponsiveLayout>
  </ADMConfigProvider>
);

// 管理端渲染器
const AdminRenderer = () => (
  <ConfigProvider locale={zhCN}>
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Routes>
        {ADMIN_ROUTES.map((route) => {
          const RouteAny = Route as any;
          return (
            <RouteAny 
              key={route.path} 
              path={route.path} 
              element={<route.component />} 
            />
          );
        })}
      </Routes>
    </div>
  </ConfigProvider>
);

// 统一路由入口
const UnifiedRouter = () => {
  return (
    <BrowserRouter>
      <RouteObserver>
        <Routes>
          {/* 管理端路由优先匹配 */}
          <Route path="/admin/*" element={<AdminRenderer />} />
          <Route path="/agent/*" element={<AdminRenderer />} />
          
          {/* 移动端路由作为默认 */}
          <Route path="/*" element={<MobileRenderer />} />
          
          {/* 根路径重定向 */}
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </RouteObserver>
    </BrowserRouter>
  );
};

export default UnifiedRouter;