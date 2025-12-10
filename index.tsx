import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 导入统一路由系统
import UnifiedRouter from './src/routes/index';

// 导入全局样式
import './index.css';
import './src/pages/global.css';

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  // Explicitly declare state property
  state: { hasError: boolean; error?: Error } = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 应用错误边界捕获:', error, errorInfo);

    // 记录错误到本地存储
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push(errorLog);

    // 只保留最近50条错误记录
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }

    localStorage.setItem('app_errors', JSON.stringify(errors));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fff5f5',
            color: '#cf1322',
          }}
        >
          <h2>🚨 应用出现错误</h2>
          <p>很抱歉，应用遇到了一个错误。请刷新页面重试。</p>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>错误详情</summary>
            <pre
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
              {this.state.error?.stack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#1677ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 应用初始化组件
const AppInitializer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 开始初始化东里村智能导游系统...');

        // 1. 检查浏览器兼容性
        const checkBrowserCompatibility = () => {
          const requiredFeatures = [
            'fetch',
            'localStorage',
            'sessionStorage',
            'Promise',
            'Map',
            'Set',
          ];

          const missingFeatures = requiredFeatures.filter(
            feature => !(feature in window)
          );

          if (missingFeatures.length > 0) {
            throw new Error(
              `浏览器不支持以下功能: ${missingFeatures.join(', ')}`
            );
          }

          // 检查Web Speech API支持
          const speechSupport = !!(
            navigator.mediaDevices && navigator.mediaDevices.getUserMedia
          );
          localStorage.setItem('speech_support', speechSupport.toString());

          console.log('✅ 浏览器兼容性检查通过', { speechSupport });
        };

        // 2. 加载应用配置
        const loadAppConfig = () => {
          // Cast import.meta to any to avoid type errors if types are missing
          const metaEnv = (import.meta as any).env;
          const config = {
            apiBaseUrl:
              metaEnv.VITE_API_BASE_URL || 'http://localhost:3001/api',
            environment: metaEnv.MODE || 'development',
            version: '1.0.0',
            buildTime: new Date().toISOString(),
          };

          localStorage.setItem('app_config', JSON.stringify(config));
          console.log('✅ 应用配置加载完成', config);
        };

        // 3. 初始化性能监控
        const initPerformanceMonitoring = () => {
          if ('performance' in window) {
            // 监控页面加载性能
            window.addEventListener('load', () => {
              const perfData = performance.getEntriesByType(
                'navigation'
              )[0] as PerformanceNavigationTiming;
              const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

              console.log(`⚡ 页面加载时间: ${loadTime}ms`);

              // 记录性能数据
              const perfLog = {
                timestamp: new Date().toISOString(),
                loadTime,
                domContentLoaded:
                  perfData.domContentLoadedEventEnd -
                  perfData.domContentLoadedEventStart,
                firstPaint:
                  performance.getEntriesByType('paint')[0]?.startTime || 0,
              };

              localStorage.setItem('performance_log', JSON.stringify(perfLog));
            });
          }
        };

        // 4. 初始化路由钩子
        const initRouteHooks = () => {
          // 监听路由变化
          const originalPushState = history.pushState;
          const originalReplaceState = history.replaceState;

          history.pushState = function (...args) {
            originalPushState.apply(history, args);
            window.dispatchEvent(new Event('routechange'));
          };

          history.replaceState = function (...args) {
            originalReplaceState.apply(history, args);
            window.dispatchEvent(new Event('routechange'));
          };

          window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('routechange'));
          });

          console.log('✅ 路由钩子初始化完成');
        };

        // 执行初始化步骤
        checkBrowserCompatibility();
        loadAppConfig();
        initPerformanceMonitoring();
        initRouteHooks();

        // 5. 预加载关键资源
        const preloadCriticalResources = async () => {
          try {
            // 预加载用户认证状态
            const token = localStorage.getItem('auth_token');
            const userInfo = localStorage.getItem('user_info');

            if (token && userInfo) {
              console.log('✅ 用户已登录，预加载用户数据');
            }

            // 预加载Agent系统配置
            const agentConfig = {
              enabled: true,
              costControl: {
                dailyLimit: 10,
                currentUsage: 0,
              },
              features: {
                voiceInteraction:
                  localStorage.getItem('speech_support') === 'true',
                imageRecognition: true,
                smartRecommendation: true,
              },
            };

            localStorage.setItem('agent_config', JSON.stringify(agentConfig));
            console.log('✅ Agent系统配置预加载完成');
          } catch (error) {
            console.warn('⚠️ 资源预加载失败:', error);
          }
        };

        await preloadCriticalResources();

        console.log('🎉 应用初始化完成！');
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ 应用初始化失败:', error);
        setInitError(error instanceof Error ? error.message : '未知错误');
      }
    };

    initializeApp();
  }, []);

  if (initError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fff2e8',
          color: '#d46b08',
        }}
      >
        <h2>⚠️ 应用初始化失败</h2>
        <p>{initError}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#1677ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          重新初始化
        </button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e0f2fe',
            borderTop: '4px solid #0369a1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px',
          }}
        ></div>
        <h2>🏛️ 东里村智能导游系统</h2>
        <p>正在初始化应用...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

// 主应用组件
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppInitializer>
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
          <Suspense
            fallback={
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
                正在加载应用...
              </div>
            }
          >
            <UnifiedRouter />
          </Suspense>
        </ConfigProvider>
      </AppInitializer>
    </ErrorBoundary>
  );
};

// 获取根元素并渲染应用
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('❌ 找不到根元素 #root，请检查 index.html 文件');
}

// 创建React根并渲染应用
const root = ReactDOM.createRoot(rootElement);

// 开发环境下启用React严格模式
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 开发环境下的热重载支持
if ((import.meta as any).hot) {
  (import.meta as any).hot.accept();
}

// 全局错误处理
window.addEventListener('error', event => {
  console.error('🚨 全局JavaScript错误:', event.error);
});

window.addEventListener('unhandledrejection', event => {
  console.error('🚨 未处理的Promise拒绝:', event.reason);
});

console.log('🎉 东里村智能导游系统启动完成！');
console.log('📍 当前环境:', (import.meta as any).env.MODE);
console.log(
  '🔗 API地址:',
  (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api'
);