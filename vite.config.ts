import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve((process as any).cwd(), './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      // Polyfill process.env for browser compatibility
      'process.env': {
        VITE_API_BASE_URL: env.VITE_API_BASE_URL || '/api',
        MINIMAX_API_KEY: env.MINIMAX_API_KEY || env.VITE_MINIMAX_API_KEY || '',
        MINIMAX_GROUP_ID: env.MINIMAX_GROUP_ID || env.VITE_MINIMAX_GROUP_ID || '',
        SILICON_FLOW_API_KEY: env.SILICON_FLOW_API_KEY || env.VITE_SILICON_FLOW_API_KEY || '',
        ZHIPU_API_KEY: env.ZHIPU_API_KEY || env.VITE_ZHIPU_API_KEY || '',
        ADMIN_API_URL: env.ADMIN_API_URL || 'http://localhost:3001',
        VITE_ENABLE_BLACKBOARD: env.VITE_ENABLE_BLACKBOARD || 'false',
        VITE_ENABLE_DEMO_DATA: env.VITE_ENABLE_DEMO_DATA || 'false',
        VITE_ENABLE_ADVANCED_LOGGING: env.VITE_ENABLE_ADVANCED_LOGGING || 'false'
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
    }
  };
});