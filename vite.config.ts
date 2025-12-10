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
        // 核心：配合后端 API 路径，建立代理通道
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      // 注入必要的 API Key，防止运行时 undefined
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || '/api'),
      'process.env.MINIMAX_API_KEY': JSON.stringify(env.VITE_MINIMAX_API_KEY || ''),
      'process.env.MINIMAX_GROUP_ID': JSON.stringify(env.VITE_MINIMAX_GROUP_ID || ''),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
    }
  };
});