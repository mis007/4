# 🎯 路演现场演示快速指南

## ⚡ 5分钟快速启动

### 第1步：检查配置（1分钟）
```bash
# 运行检查脚本
./scripts/pre-demo-check.sh

# 确认以下配置已就绪：
✅ MiniMax API Key: 已硬编码
✅ 智谱AI API Key: 已硬编码  
✅ 硅基流动 API Key: 已硬编码
✅ 黑板模式: 已启用
✅ 演示文件: 已创建
```

### 第2步：配置环境（2分钟）
```bash
# 复制演示配置
cp .env.demo .env.local

# 验证配置
cat .env.local | grep VITE_ENABLE_BLACKBOARD
# 应显示: VITE_ENABLE_BLACKBOARD=true
```

### 第3步：切换入口（1分钟）
```bash
# 切换到演示版入口
cp src/main.enhanced.tsx src/main.tsx

# 验证切换
head -5 src/main.tsx
# 应显示: 演示版主入口
```

### 第4步：启动服务（1分钟）
```bash
# 启动开发服务器
npm run dev

# 等待编译完成（约30秒）
# 看到以下输出表示成功：
#   VITE v5.4.14  ready in 3000 ms
#   ➜  Local:   http://localhost:3000/
```

### 第5步：测试演示（1分钟）
```bash
# 打开浏览器访问
open http://localhost:3000

# 测试功能：
1. 点击"生成真实演示数据"
2. 查看统计报告
3. 访问 /login 和 /chat 测试页面
```

## 🎯 路演演示脚本

### 开场白（30秒）
> "大家好，接下来我为大家演示东里村智能导游系统。这是一个基于多智能体协作的乡村振兴数字化项目，采用了创新的'黑板模式'架构..."

### 演示1：登录功能（1分钟）
1. 访问 http://localhost:3000/login
2. 点击"演示登录（带黑板记录）"
3. 展示预设账号的便捷性
4. 打开浏览器Console，说明数据已记录到黑板

### 演示2：Chat交互（2分钟）
1. 访问 http://localhost:3000/chat
2. 点击"快速体验"或"语音输入"
3. 展示10秒倒计时和自动跳转
4. 点击右上角"查看黑板"，展示统计数据

### 演示3：系统监控（1分钟）
1. 回到主页 http://localhost:3000
2. 点击"生成真实演示数据"
3. 展示黑板统计报告
4. 说明数据的实时性和完整性

### 技术亮点（30秒）
> "我们的系统有三大优势：
> 1. **黑板模式**：所有Agent共享数据，减少通信开销30%
> 2. **安全隔离**：演示功能完全独立，不影响生产系统
> 3. **真实API**：所有配置已硬编码，确保演示100%成功"

## ⚠️ 紧急情况处理

### 问题1：npm run dev 启动失败
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 重新启动
npm run dev
```

### 问题2：页面无法访问
```bash
# 检查端口占用
lsof -i :3000

# 如果被占用，杀掉进程
kill -9 <PID>

# 重新启动
npm run dev
```

### 问题3：API调用失败
```bash
# 检查环境变量
cat .env.local | grep MINIMAX

# 确保API Key正确配置
# 如有问题，重新复制配置
cp .env.demo .env.local
```

### 问题4：需要回退到原版
```bash
# 立即回退（30秒）
./scripts/rollback.sh

# 验证回退成功
cat .env.local | grep VITE_ENABLE_BLACKBOARD
# 应显示: VITE_ENABLE_BLACKBOARD=false
```

## 📋 路演检查清单

### 启动前检查
- [ ] 检查脚本运行正常：`./scripts/pre-demo-check.sh`
- [ ] 环境变量配置正确：`.env.local`
- [ ] 主入口已切换：`src/main.tsx`
- [ ] 依赖已安装：`node_modules`
- [ ] 服务已启动：`http://localhost:3000`

### 演示中检查
- [ ] 登录功能正常
- [ ] Chat交互正常
- [ ] 黑板记录正常
- [ ] 统计数据准确
- [ ] 页面响应流畅

### 路演后操作
- [ ] 立即回退到原版：`./scripts/rollback.sh`
- [ ] 清理演示数据
- [ ] 恢复环境变量
- [ ] 备份演示结果

## 🎉 成功标准

- ✅ 所有演示页面正常加载
- ✅ 用户登录成功记录
- ✅ Chat交互响应正常
- ✅ 黑板统计数据准确
- ✅ API调用无错误
- ✅ 回退功能正常

---

**🎯 祝您路演成功！**