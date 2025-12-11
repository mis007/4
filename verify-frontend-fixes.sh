#!/bin/bash

# ============================================================
# 前端修复验证脚本
# 用途: 自动检查所有修复是否生效
# 使用: bash verify-frontend-fixes.sh
# ============================================================

echo ""
echo "🔍 开始验证前端修复..."
echo "=================================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASSED=0
FAILED=0

# ============================================================
# 测试1: 验证CDN配置
# ============================================================
echo ""
echo "📋 测试1: CDN配置验证"
echo "---"

# 检查 aistudiocdn.com 是否被移除
if grep -q "aistudiocdn.com" index.html; then
    echo -e "${RED}❌ 失败: index.html 中仍存在 aistudiocdn.com${NC}"
    echo "   位置: $(grep -n 'aistudiocdn' index.html | head -1)"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✅ 通过: aistudiocdn.com 已移除${NC}"
    PASSED=$((PASSED + 1))
fi

# 检查 cdn.jsdelivr.net 是否已添加
if grep -q "cdn.jsdelivr.net" index.html; then
    echo -e "${GREEN}✅ 通过: cdn.jsdelivr.net 已添加${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: index.html 中缺少 cdn.jsdelivr.net${NC}"
    FAILED=$((FAILED + 1))
fi

# 检查 +esm 后缀
if grep -q "cdn.jsdelivr.net.*+esm" index.html; then
    echo -e "${GREEN}✅ 通过: ES模块后缀配置正确${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  警告: 部分CDN缺少 +esm 后缀${NC}"
    FAILED=$((FAILED + 1))
fi

# ============================================================
# 测试2: 验证API路径配置
# ============================================================
echo ""
echo "📋 测试2: API路径配置验证"
echo "---"

# 检查 apiService.ts
if grep -q "const API_BASE_URL = '/api'" src/services/apiService.ts; then
    echo -e "${GREEN}✅ 通过: apiService.ts 使用相对路径 '/api'${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: apiService.ts API_BASE_URL 配置错误${NC}"
    echo "   当前值: $(grep 'const API_BASE_URL' src/services/apiService.ts)"
    FAILED=$((FAILED + 1))
fi

# 检查 config.ts 中的 BASE_URL
if grep -q "BASE_URL.*'/api'" src/services/config.ts; then
    echo -e "${GREEN}✅ 通过: config.ts 使用相对路径 '/api'${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: config.ts BASE_URL 配置错误${NC}"
    echo "   当前值: $(grep 'BASE_URL.*process.env.ADMIN_API_URL' src/services/config.ts)"
    FAILED=$((FAILED + 1))
fi

# 检查是否存在硬编码的 localhost:3001
if grep -r "localhost:3001" src/services/apiService.ts src/services/config.ts 2>/dev/null | grep -q .; then
    echo -e "${RED}❌ 失败: 仍存在硬编码的 localhost:3001${NC}"
    grep -r "localhost:3001" src/services/apiService.ts src/services/config.ts | sed 's/^/   /'
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✅ 通过: 已移除所有硬编码的 localhost:3001${NC}"
    PASSED=$((PASSED + 1))
fi

# ============================================================
# 测试3: 验证Vite代理配置
# ============================================================
echo ""
echo "📋 测试3: Vite代理配置验证"
echo "---"

# 检查代理配置
if grep -q "proxy:" vite.config.ts && grep -q "/api.*localhost:3001" vite.config.ts; then
    echo -e "${GREEN}✅ 通过: Vite代理配置存在且指向 localhost:3001${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: Vite代理配置不完整${NC}"
    FAILED=$((FAILED + 1))
fi

# 检查 changeOrigin 配置
if grep -q "changeOrigin.*true" vite.config.ts; then
    echo -e "${GREEN}✅ 通过: Vite代理 changeOrigin 配置正确${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  警告: Vite代理可能未启用 changeOrigin${NC}"
    FAILED=$((FAILED + 1))
fi

# ============================================================
# 测试4: 验证路由配置
# ============================================================
echo ""
echo "📋 测试4: 路由配置验证"
echo "---"

# 检查移动端路由
if grep -q "const MOBILE_ROUTES" src/routes/index.tsx; then
    echo -e "${GREEN}✅ 通过: 移动端路由定义存在${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: 找不到移动端路由定义${NC}"
    FAILED=$((FAILED + 1))
fi

# 检查管理端路由
if grep -q "const ADMIN_ROUTES" src/routes/index.tsx; then
    echo -e "${GREEN}✅ 通过: 管理端路由定义存在${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: 找不到管理端路由定义${NC}"
    FAILED=$((FAILED + 1))
fi

# 检查路由优先级配置
if grep -q "/admin/\*.*AdminRenderer" src/routes/index.tsx; then
    echo -e "${GREEN}✅ 通过: 管理端路由优先级配置正确${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  警告: 管理端路由优先级配置可能有问题${NC}"
    FAILED=$((FAILED + 1))
fi

# ============================================================
# 测试5: 验证后端文件存在
# ============================================================
echo ""
echo "📋 测试5: 后端文件验证"
echo "---"

if [ -f "backend/server.js" ]; then
    echo -e "${GREEN}✅ 通过: backend/server.js 存在${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: backend/server.js 不存在${NC}"
    FAILED=$((FAILED + 1))
fi

if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✅ 通过: backend/package.json 存在${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: backend/package.json 不存在${NC}"
    FAILED=$((FAILED + 1))
fi

# ============================================================
# 测试6: 验证文档生成
# ============================================================
echo ""
echo "📋 测试6: 文档验证"
echo "---"

if [ -f "FRONTEND_FIX_REPORT.md" ]; then
    echo -e "${GREEN}✅ 通过: FRONTEND_FIX_REPORT.md 已生成${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: FRONTEND_FIX_REPORT.md 不存在${NC}"
    FAILED=$((FAILED + 1))
fi

if [ -f "FRONTEND_QUICK_START.md" ]; then
    echo -e "${GREEN}✅ 通过: FRONTEND_QUICK_START.md 已生成${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ 失败: FRONTEND_QUICK_START.md 不存在${NC}"
    FAILED=$((FAILED + 1))
fi

# ============================================================
# 最终统计
# ============================================================
echo ""
echo "=================================================="
echo "📊 验证结果统计"
echo "---"
echo -e "${GREEN}✅ 通过: $PASSED 项${NC}"
echo -e "${RED}❌ 失败: $FAILED 项${NC}"
TOTAL=$((PASSED + FAILED))
echo "总计: $TOTAL 项"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 恭喜！所有修复都已验证通过！${NC}"
    echo ""
    echo "接下来的步骤:"
    echo "1. 终端1: npm run dev          (启动前端)"
    echo "2. 终端2: cd backend && npm start  (启动后端)"
    echo "3. 访问: http://localhost:3000"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  检测到 $FAILED 个问题，请按上述提示修复${NC}"
    exit 1
fi
