// 增强版路由配置 - 独立于原有App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import LoginPageEnhanced from './components/LoginPageEnhanced';
import ChatPageEnhanced from './components/ChatPageEnhanced';
import HomePage from './pages/HomePage';
import DemoDashboard from './components/DemoDashboard';

const AppEnhanced = () => {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          {/* 演示仪表板 - 主页 */}
          <Route path="/" element={<DemoDashboard />} />

          {/* 演示路由 - 带黑板记录功能 */}
          <Route path="/demo/login" element={<LoginPageEnhanced />} />
          <Route path="/demo/chat" element={<ChatPageEnhanced />} />
          <Route path="/demo/home" element={<HomePage />} />

          {/* 快速访问路由 */}
          <Route path="/login" element={<LoginPageEnhanced />} />
          <Route path="/chat" element={<ChatPageEnhanced />} />
          <Route path="/home" element={<HomePage />} />

          {/* 其他路由保持不变 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default AppEnhanced;
