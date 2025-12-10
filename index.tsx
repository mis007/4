import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css'; // 确保样式加载

// 引入统一路由（这是我们唯一信任的路由中心）
import UnifiedRouter from './src/routes/index';
import './index.css';
import './src/pages/global.css';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 全局错误边界
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('系统崩溃:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: 'center', marginTop: 50 }}>
          <h2>😅 系统遇到了一点小问题</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// 渲染根节点
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <Suspense fallback={<div style={{ padding: 20, textAlign: 'center' }}>系统初始化中...</div>}>
          <UnifiedRouter />
        </Suspense>
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// 全局配置 Message
message.config({
  top: 50,
  duration: 2,
  maxCount: 3,
});