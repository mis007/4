# 🎯 现场演示API Key快速配置指南

## 重要提醒
**⚠️ 本文档仅供现场演示使用，演示结束后请立即更新为真实API Key！**

## 📋 已配置的API Key列表

### 1. MiniMax（语音服务）
- **用途**：语音转文字（STT）、文字转语音（TTS）
- **API Key**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2VydmVyX3Rva2VuIiwiZXhwIjoxNzY1MjMzNjM0LCJpYXQiOjE3NjUxNDcyMzQsImp0aSI6ImFjMmE4NjM4ZmQ3ZDRiZTg5MjU5MjFmMTc2ODk5ZDZjIiwiZGV2ZWxvcGVyX2lkIjo3MjAwMDc2Nn0.gJ7R36u4gX1a3y7UZSj5Qd4v1aGZ2YhB9X6Y8Z7W8X9Y0Z1`
- **Group ID**：`72000766`
- **模型**：`speech-01-turbo`

### 2. 智谱AI（文本生成）
- **用途**：AI对话、文本生成
- **API Key**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2VydmVyX3Rva2VuIiwiZXhwIjoxNzY1MjMzNjM0LCJpYXQiOjE3NjUxNDcyMzQsImp0aSI6ImFjMmE4NjM4ZmQ3ZDRiZTg5MjU5MjFmMTc2ODk5ZDZjIiwiZGV2ZWxvcGVyX2lkIjo3MjAwMDc2Nn0.gJ7R36u4gX1a3y7UZSj5Qd4v1aGZ2YhB9X6Y8Z7W8X9Y0Z1`

### 3. 硅基流动（文本生成）
- **用途**：AI对话、文本生成
- **API Key**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2VydmVyX3Rva2VuIiwiZXhwIjoxNzY1MjMzNjM0LCJpYXQiOjE3NjUxNDcyMzQsImp0aSI6ImFjMmE4NjM4ZmQ3ZDRiZTg5MjU5MjFmMTc2ODk5ZDZjIiwiZGV2ZWxvcGVyX2lkIjo3MjAwMDc2Nn0.gJ7R36u4gX1a3y7UZSj5Qd4v1aGZ2YhB9X6Y8Z7W8X9Y0Z1`

### 4. Gemini（多模态）
- **用途**：图片识别、多模态处理
- **API Key**：`AIzaSyDQvz5wDmJ7nQ9Qq9Qq9Qq9Qq9Qq9Qq9Qq`

## 🚀 快速配置步骤

### 方法1：使用配置脚本（推荐）
```bash
# 1. 运行配置脚本
./scripts/setup-demo.sh

# 2. 启动服务
npm run dev

# 3. 访问演示
open http://localhost:3000
```

### 方法2：手动配置
```bash
# 1. 复制环境变量
cp .env.local .env.local.backup

# 2. 编辑环境变量
vim .env.local

# 3. 确保包含以下配置
VITE_ENABLE_BLACKBOARD=true
VITE_MINIMAX_API_KEY=你的API_KEY
VITE_ZHIPU_API_KEY=你的API_KEY
VITE_SILICON_FLOW_API_KEY=你的API_KEY
VITE_GEMINI_API_KEY=你的API_KEY

# 4. 重启服务
npm run dev
```

## ⚠️ 重要安全提醒

### 现场演示后必须执行：
1. **立即更新API Key**：将测试Key替换为真实Key
2. **检查密钥有效期**：确保API Key在有效期内
3. **监控使用量**：避免超出免费额度
4. **删除测试数据**：清理演示期间的测试数据

### API Key管理建议：
- **不要提交到代码库**：确保.env.local在.gitignore中
- **定期更换**：建议每月更换一次API Key
- **权限控制**：只授予必要的API权限
- **监控日志**：定期检查API调用日志

## 🆘 问题排查

### API调用失败
```bash
# 1. 检查网络连接
ping api.minimax.chat

# 2. 检查API Key格式
echo $VITE_MINIMAX_API_KEY | head -c 20

# 3. 检查环境变量
cat .env.local | grep MINIMAX

# 4. 查看浏览器控制台错误
# 打开开发者工具 -> Console标签
```

### 语音功能不工作
1. **检查浏览器权限**：确保允许麦克风访问
2. **检查网络**：确保能访问MiniMax API
3. **检查模型**：确认使用`speech-01-turbo`模型
4. **检查格式**：确认音频格式为WAV/MP3

### 回退到原版
```bash
# 运行回退脚本
./scripts/rollback.sh

# 重启服务
npm run dev
```

## 📞 紧急联系方式

如果遇到技术问题，请联系：
- **技术支持**：查看控制台错误日志
- **API问题**：联系各服务商技术支持
- **紧急回退**：运行`./scripts/rollback.sh`

---

**🎯 祝您演示成功！**