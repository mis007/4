const fs = require('fs');
const path = require('path');

console.log('🎯 东里村智能导游系统 - 快速配置');
console.log('==================================');

try {
  // 检查必要文件是否存在
  if (!fs.existsSync('.env.demo')) {
    throw new Error('.env.demo 文件不存在');
  }

  if (!fs.existsSync('src/main.enhanced.tsx')) {
    throw new Error('src/main.enhanced.tsx 文件不存在');
  }

  // 1. 复制环境变量
  fs.copyFileSync('.env.demo', '.env.local');
  console.log('✅ 环境变量配置完成');

  // 2. 切换入口文件
  fs.copyFileSync('src/main.enhanced.tsx', 'src/main.tsx');
  console.log('✅ 演示入口切换完成');

  // 3. 验证配置
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('VITE_ENABLE_BLACKBOARD=true')) {
    console.log('✅ 黑板模式已启用');
  } else {
    console.warn('⚠️ 黑板模式未正确配置');
  }

  console.log('');
  console.log('🚀 配置完成！');
  console.log('💡 请运行: npm run dev');
  console.log('🌐 访问地址: http://localhost:3000');
  console.log('');
  console.log('🎯 演示页面:');
  console.log('  主页: http://localhost:3000');
  console.log('  登录: http://localhost:3000/login');
  console.log('  Chat: http://localhost:3000/chat');
  console.log('');
  console.log('⚠️ 回退命令: npm run demo:rollback');
} catch (error) {
  console.error('❌ 配置失败:', error.message);
  process.exit(1);
}
