#!/bin/bash
# 黑板模式现场演示快速配置脚本

echo "🎯 东里村智能导游系统 - 现场演示配置"
echo "=================================="

# 检查环境
echo "🔍 检查环境..."
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 1. 启用黑板模式
echo "📝 配置黑板模式..."
cat > .env.local << EOF
# 黑板模式环境变量配置
VITE_ENABLE_BLACKBOARD=true
VITE_ENABLE_DEMO_DATA=true
VITE_ENABLE_ADVANCED_LOGGING=false

# API配置
VITE_API_BASE_URL=http://localhost:3001

# MiniMax语音服务配置（已配置）
VITE_MINIMAX_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2VydmVyX3Rva2VuIiwiZXhwIjoxNzY1MjMzNjM0LCJpYXQiOjE3NjUxNDcyMzQsImp0aSI6ImFjMmE4NjM4ZmQ3ZDRiZTg5MjU5MjFmMTc2ODk5ZDZjIiwiZGV2ZWxvcGVyX2lkIjo3MjAwMDc2Nn0.gJ7R36u4gX1a3y7UZSj5Qd4v1aGZ2YhB9X6Y8Z7W8X9Y0Z1
VITE_MINIMAX_GROUP_ID=72000766

# 智谱AI配置（已配置）
VITE_ZHIPU_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2VydmVyX3Rva2VuIiwiZXhwIjoxNzY1MjMzNjM0LCJpYXQiOjE3NjUxNDcyMzQsImp0aSI6ImFjMmE4NjM4ZmQ3ZDRiZTg5MjU5MjFmMTc2ODk5ZDZjIiwiZGV2ZWxvcGVyX2lkIjo3MjAwMDc2Nn0.gJ7R36u4gX1a3y7UZSj5Qd4v1aGZ2YhB9X6Y8Z7W8X9Y0Z1

# 硅基流动配置（已配置）
VITE_SILICON_FLOW_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2VydmVyX3Rva2VuIiwiZXhwIjoxNzY1MjMzNjM0LCJpYXQiOjE3NjUxNDcyMzQsImp0aSI6ImFjMmE4NjM4ZmQ3ZDRiZTg5MjU5MjFmMTc2ODk5ZDZjIiwiZGV2ZWxvcGVyX2lkIjo3MjAwMDc2Nn0.gJ7R36u4gX1a3y7UZSj5Qd4v1aGZ2YhB9X6Y8Z7W8X9Y0Z1

# Gemini配置（已配置）
VITE_GEMINI_API_KEY=AIzaSyDQvz5wDmJ7nQ9Qq9Qq9Qq9Qq9Qq9Qq9Qq
EOF

echo "✅ 环境变量配置完成"

# 2. 切换到演示入口
echo "📝 切换到演示入口..."
if [ -f "src/main.enhanced.tsx" ]; then
    cp src/main.enhanced.tsx src/main.tsx
    echo "✅ 已切换到演示版入口"
else
    echo "❌ 演示入口文件不存在"
    exit 1
fi

# 3. 检查依赖
echo "🔍 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 4. 启动服务
echo "🚀 启动开发服务器..."
echo "💡 请在新终端窗口运行: npm run dev"
echo ""
echo "🎯 演示地址:"
echo "  主页: http://localhost:3000"
echo "  登录: http://localhost:3000/login"
echo "  Chat: http://localhost:3000/chat"
echo "  首页: http://localhost:3000/home"
echo ""
echo "⚠️  重要：如果需要回退到原版，请运行:"
echo "   ./scripts/rollback.sh"