const fs = require('fs');
const path = require('path');

console.log('🔄 东里村智能导游系统 - 回退到原版');
console.log('==================================');

try {
  // 1. 禁用黑板模式
  const originalEnv = `# 原版配置
VITE_ENABLE_BLACKBOARD=false
VITE_ENABLE_DEMO_DATA=false
VITE_ENABLE_ADVANCED_LOGGING=false
VITE_API_BASE_URL=http://localhost:3001
`;

  fs.writeFileSync('.env.local', originalEnv);
  console.log('✅ 环境变量已禁用');

  // 2. 恢复原版入口
  // 尝试从备份恢复，如果没有备份则创建默认入口
  const originalMainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  if (fs.existsSync('src/main.original.tsx')) {
    fs.copyFileSync('src/main.original.tsx', 'src/main.tsx');
    console.log('✅ 已从备份恢复原版入口');
  } else {
    fs.writeFileSync('src/main.tsx', originalMainContent);
    console.log('✅ 已创建默认原版入口');
  }

  console.log('');
  console.log('🎯 回退完成！');
  console.log('💡 请重启开发服务器: npm run dev');
  console.log('🌐 访问原版地址: http://localhost:3000');
} catch (error) {
  console.error('❌ 回退失败:', error.message);
  process.exit(1);
}
