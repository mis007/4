#!/bin/bash
# 黑板模式回退脚本

echo "🔄 东里村智能导游系统 - 回退到原版"
echo "=================================="

# 1. 禁用黑板模式
echo "📝 禁用黑板模式..."
cat > .env.local << EOF
# 原版配置
VITE_ENABLE_BLACKBOARD=false
VITE_ENABLE_DEMO_DATA=false
VITE_ENABLE_ADVANCED_LOGGING=false
VITE_API_BASE_URL=http://localhost:3001
EOF

echo "✅ 环境变量已禁用"

# 2. 恢复原版入口
echo "📝 恢复原版入口..."
if [ -f "src/main.original.tsx" ]; then
    cp src/main.original.tsx src/main.tsx
    echo "✅ 已恢复原版入口"
else
    # 尝试从git恢复
    git checkout src/main.tsx 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ 已从git恢复原版入口"
    else
        echo "❌ 无法恢复原版入口，请手动恢复"
        exit 1
    fi
fi

# 3. 重启服务提示
echo ""
echo "🎯 回退完成！"
echo "💡 请重启开发服务器: npm run dev"
echo "🌐 访问原版地址: http://localhost:3000"