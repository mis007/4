import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CDN Configuration with Fallbacks
const CDN_CONFIG = [
  {
    name: 'react',
    global: 'React',
    url: 'https://cdn.bootcdn.net/ajax/libs/react/18.3.1/umd/react.production.min.js',
    fallback: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js'
  },
  {
    name: 'react-dom',
    global: 'ReactDOM',
    url: 'https://cdn.bootcdn.net/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js',
    fallback: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js'
  },
  {
    name: 'dayjs',
    global: 'dayjs',
    url: 'https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.10/dayjs.min.js',
    fallback: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js'
  },
  {
    name: 'antd',
    global: 'antd',
    url: 'https://cdn.bootcdn.net/ajax/libs/antd/5.15.0/antd.min.js',
    fallback: 'https://cdn.jsdelivr.net/npm/antd@5.15.0/dist/antd.min.js',
    css: 'https://cdn.bootcdn.net/ajax/libs/antd/5.15.0/reset.min.css',
    cssFallback: 'https://cdn.jsdelivr.net/npm/antd@5.15.0/dist/reset.min.css'
  },
  {
    name: '@ant-design/icons',
    global: 'antDesignIcons',
    url: 'https://cdn.bootcdn.net/ajax/libs/ant-design-icons/5.3.1/index.umd.min.js',
    fallback: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@5.3.1/dist/index.umd.min.js'
  },
  {
    name: 'leaflet',
    global: 'L',
    url: 'https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.js',
    fallback: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
    css: 'https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.css',
    cssFallback: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
  }
];

// Custom Plugin to inject CDN links in Production
const htmlCdnPlugin = (): Plugin => {
  return {
    name: 'html-cdn-inject',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;

      const cssLinks = CDN_CONFIG.filter(c => c.css).map(c => 
        `<link rel="stylesheet" href="${c.css}" onerror="this.onerror=null;this.href='${c.cssFallback}'">`
      ).join('\n    ');

      const jsScripts = CDN_CONFIG.map(c => 
        `<script src="${c.url}" crossorigin="anonymous" onerror="this.onerror=null;this.src='${c.fallback}'"></script>`
      ).join('\n    ');

      return html.replace('</head>', `  ${cssLinks}\n  </head>`)
                 .replace('</body>', `  ${jsScripts}\n  </body>`);
    }
  };
};

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  const isProd = command === 'build';

  return {
    plugins: [
      react(),
      htmlCdnPlugin()
    ],
    root: '.',
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        external: isProd ? CDN_CONFIG.map(c => c.name) : [],
        output: {
          globals: isProd ? CDN_CONFIG.reduce((acc, c) => ({ ...acc, [c.name]: c.global }), {}) : {},
          manualChunks: {
            'vendor-utils': ['antd-mobile'],
            'agent-core': [
              './src/services/agentSystem.ts',
            ],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.MINIMAX_API_KEY': JSON.stringify(env.MINIMAX_API_KEY || ''),
      'process.env.MINIMAX_GROUP_ID': JSON.stringify(env.MINIMAX_GROUP_ID || ''),
      'process.env.SILICON_FLOW_API_KEY': JSON.stringify(env.SILICON_FLOW_API_KEY || ''),
      'process.env.ZHIPU_API_KEY': JSON.stringify(env.ZHIPU_API_KEY || ''),
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
});