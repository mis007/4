# 🚀 东里村智能导游系统 - 后端说明书

## 📋 目录

1. [快速开始](#快速开始)
2. [系统架构](#系统架构)
3. [API接口文档](#api接口文档)
4. [数据模型](#数据模型)
5. [部署指南](#部署指南)
6. [运维手册](#运维手册)
7. [故障排查](#故障排查)
8. [扩展开发](#扩展开发)

---

## 🚀 快速开始

### 🎯 系统要求
- **Node.js**：>= 16.0.0
- **npm**：>= 8.0.0
- **内存**：>= 512MB
- **磁盘**：>= 100MB

### ⚡ 快速启动

```bash
# 1. 进入项目目录
cd /path/to/village-guide-ai-system

# 2. 安装依赖
npm install

# 3. 启动后端服务
npm run server

# 4. 验证服务状态
curl http://localhost:3001/api/health
```

### 📍 访问地址
- **后端API**：http://localhost:3001
- **健康检查**：http://localhost:3001/api/health
- **API文档**：http://localhost:3001/api/health

---

## 🏗️ 系统架构

### 📐 技术栈
```
┌─────────────────────────────────────────┐
│           后端技术栈                │
├─────────────────────────────────────────┤
│ Node.js + Express.js               │
│ ┌─────────────┬─────────────────┐    │
│ │   Web服务   │   API服务      │    │
│ │   (CORS)    │   (RESTful)    │    │
│ └─────────────┴─────────────────┘    │
│ ┌─────────────┬─────────────────┐    │
│ │  内存存储   │   静态文件     │    │
│ │ (Arrays)    │   (public)      │    │
│ └─────────────┴─────────────────┘    │
└─────────────────────────────────────────┘
```

### 🗂️ 目录结构
```
后端核心文件：
├── server.cjs              # 🎯 主入口文件
├── package.json            # 📦 依赖配置
├── .env.local             # 🔧 环境变量
└── public/                # 📁 静态资源

数据存储（内存）：
├── drafts[]              # 📝 草稿数据
├── submissions[]         # 📤 提交内容
├── users[]              # 👥 用户数据
├── analytics[]          # 📊 统计数据
└── moderationQueue[]     # ⚖️ 审核队列
```

---

## 📡 API接口文档

### 🔐 认证相关

#### 发送验证码
```http
POST /api/auth/send-code
Content-Type: application/json

{
  "phone": "13800138000"
}

Response:
{
  "success": true,
  "message": "验证码已发送"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "code": "123456"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "phone": "13800138000",
      "nickname": "游客8000",
      "avatar": "😊"
    },
    "token": "token-123-abc"
  },
  "message": "登录成功"
}
```

### 🏞️ 景点相关

#### 获取景点列表
```http
GET /api/spots?category=nature-spots&page=1&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "东里古樟树",
      "type": "nature",
      "category": "nature-spots",
      "desc": "300年树龄的古樟树，见证东里村历史变迁",
      "location": "村口广场东侧",
      "image": "",
      "audioUrl": "",
      "createdAt": "2025-01-01"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

#### 获取景点详情
```http
GET /api/spots/1

Response:
{
  "success": true,
  "data": {
    "id": "1",
    "name": "东里古樟树",
    "type": "nature",
    "category": "nature-spots",
    "desc": "300年树龄的古樟树，见证东里村历史变迁",
    "location": "村口广场东侧",
    "image": "",
    "audioUrl": "",
    "createdAt": "2025-01-01"
  }
}
```

### 👤 人物相关

#### 获取人物列表
```http
GET /api/figures?category=martyrs&page=1&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "张伟烈士",
      "type": "martyr",
      "category": "martyrs",
      "birth": "1920",
      "death": "1945",
      "achievement": "抗日战争中英勇牺牲",
      "story": "在抗日战争中..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### 📢 公告相关

#### 获取公告列表
```http
GET /api/announcements?type=notice&page=1&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "notice",
      "title": "农村环境整治工作安排",
      "summary": "关于开展春季农村人居环境整治...",
      "date": "2025-03-01",
      "source": "村委会"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### 📍 打卡相关

#### 提交打卡
```http
POST /api/checkin
Authorization: Bearer token-123-abc
Content-Type: application/json

{
  "spotId": "1",
  "spotName": "东里古樟树"
}

Response:
{
  "success": true,
  "data": {
    "id": "checkin-123",
    "userId": "user-123",
    "spotId": "1",
    "spotName": "东里古樟树",
    "date": "2025-12-07",
    "time": "2025-12-07T22:47:00.000Z"
  },
  "message": "打卡成功"
}
```

### 🛠️ 管理后台API

#### 内容提交
```http
POST /api/admin/content/submit
Authorization: Bearer admin-token
Content-Type: application/json

{
  "name": "新景点",
  "type": "ecology",
  "desc": "景点描述",
  "location_desc": "位置描述",
  "recommender_name": "推荐人"
}

Response:
{
  "success": true,
  "data": {
    "id": "123",
    "name": "新景点",
    "type": "ecology",
    "desc": "景点描述",
    "location_desc": "位置描述",
    "recommender_name": "推荐人",
    "createdAt": "2025-12-07T22:47:00.000Z",
    "status": "pending"
  },
  "message": "内容提交成功"
}
```

#### 获取仪表板数据
```http
GET /api/admin/analytics/dashboard
Authorization: Bearer admin-token

Response:
{
  "success": true,
  "data": {
    "overview": {
      "totalSubmissions": 10,
      "totalDrafts": 5,
      "totalUsers": 100,
      "todayActive": 75
    },
    "contentStats": {
      "redCulture": 3,
      "ecology": 2,
      "folk": 2,
      "food": 2,
      "celebrity": 1
    },
    "recentActivity": [
      {
        "id": "123",
        "name": "新景点",
        "type": "ecology",
        "createdAt": "2025-12-07T22:47:00.000Z"
      }
    ]
  }
}
```

---

## 📊 数据模型

### 👤 用户模型
```javascript
{
  id: "user-123",              // 用户唯一标识
  phone: "13800138000",        // 手机号
  nickname: "游客8000",         // 昵称
  avatar: "😊",               // 头像
  status: "active",            // 状态：active/inactive/banned
  createdAt: "2025-12-07T22:47:00.000Z",
  updatedAt: "2025-12-07T22:47:00.000Z",
  checkInCount: 5,            // 打卡次数
  statusReason: "正常"          // 状态原因
}
```

### 🏞️ 景点模型
```javascript
{
  id: "1",                    // 景点唯一标识
  name: "东里古樟树",         // 景点名称
  type: "nature",              // 类型：nature/red/culture
  category: "nature-spots",      // 分类
  desc: "300年树龄的古樟树...", // 描述
  location: "村口广场东侧",     // 位置
  image: "",                   // 图片URL
  audioUrl: "",               // 音频URL
  createdAt: "2025-01-01"    // 创建时间
}
```

### 👥 人物模型
```javascript
{
  id: "1",                    // 人物唯一标识
  name: "张伟烈士",           // 姓名
  type: "martyr",             // 类型：martyr/sage/student/contemporary
  category: "martyrs",        // 分类
  birth: "1920",              // 出生年份
  death: "1945",              // 逝世年份（烈士）
  achievement: "抗日战争中英勇牺牲", // 成就
  story: "在抗日战争中...",     // 故事
  university: "清华大学",        // 大学（学生）
  major: "计算机科学",         // 专业（学生）
  year: 2020                  // 年份（学生）
}
```

### 📢 公告模型
```javascript
{
  id: "1",                    // 公告唯一标识
  type: "notice",              // 类型：notice/activity/video
  title: "农村环境整治工作安排", // 标题
  summary: "关于开展春季农村人居环境整治...", // 摘要
  date: "2025-03-01",        // 日期
  source: "村委会"             // 来源
}
```

### 📍 打卡模型
```javascript
{
  id: "checkin-123",          // 打卡唯一标识
  userId: "user-123",         // 用户ID
  spotId: "1",               // 景点ID
  spotName: "东里古樟树",     // 景点名称
  date: "2025-12-07",        // 打卡日期
  time: "2025-12-07T22:47:00.000Z" // 打卡时间
}
```

---

## 🚀 部署指南

### 📦 生产环境部署

#### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2（进程管理）
sudo npm install -g pm2
```

#### 2. 项目部署
```bash
# 克隆项目
git clone <repository-url>
cd village-guide-ai-system

# 安装依赖
npm install --production

# 配置环境变量
cp .env.demo .env.production
# 编辑 .env.production 设置生产环境配置

# 构建前端
npm run build

# 启动服务
pm2 start server.cjs --name "village-guide-api"
pm2 save
pm2 startup
```

#### 3. Nginx配置
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/village-guide-ai-system/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🐳 Docker部署

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动服务
CMD ["npm", "run", "server"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
```

#### Docker部署命令
```bash
# 构建镜像
docker build -t village-guide-api .

# 运行容器
docker run -d \
  --name village-guide-api \
  -p 3001:3001 \
  --restart unless-stopped \
  village-guide-api

# 或使用docker-compose
docker-compose up -d
```

---

## 🔧 运维手册

### 📊 监控指标

#### 系统监控
```bash
# PM2监控
pm2 monit

# 查看日志
pm2 logs village-guide-api

# 重启服务
pm2 restart village-guide-api

# 查看状态
pm2 status
```

#### 健康检查
```bash
# API健康检查
curl -f http://localhost:3001/api/health || echo "API服务异常"

# 端口检查
netstat -tlnp | grep :3001

# 进程检查
ps aux | grep node
```

### 📝 日志管理

#### 日志级别
```javascript
// 在server.cjs中添加日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

#### 日志轮转
```bash
# 安装logrotate
sudo apt install logrotate

# 配置文件 /etc/logrotate.d/village-guide-api
/path/to/village-guide-ai-system/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 🔒 安全配置

#### 环境变量安全
```bash
# 设置文件权限
chmod 600 .env.production

# 确保不在版本控制中
echo ".env.production" >> .gitignore
```

#### API安全
```javascript
// 添加速率限制
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 100次请求
});

app.use('/api/', limiter);
```

---

## 🆘 故障排查

### 🚨 常见问题

#### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3001

# 杀死进程
kill -9 <PID>

# 或修改端口
export PORT=3002
npm run server
```

#### 2. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 3. API连接失败
```bash
# 检查防火墙
sudo ufw status

# 开放端口
sudo ufw allow 3001

# 检查服务状态
curl http://localhost:3001/api/health
```

#### 4. 内存不足
```bash
# 查看内存使用
free -h

# 查看Node.js进程内存
ps aux | grep node | awk '{print $6}' | awk '{sum+=$1} END {print sum/1024 "MB"}'

# 重启服务释放内存
pm2 restart village-guide-api
```

### 🔍 调试模式

#### 启用调试
```bash
# 启动调试模式
DEBUG=* npm run server

# 或设置特定模块
DEBUG=express:* npm run server
```

#### 错误处理
```javascript
// 在server.cjs中添加全局错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});
```

---

## 🔧 扩展开发

### 📦 添加新API

#### 1. 创建路由
```javascript
// 在server.cjs中添加新路由
app.get('/api/new-endpoint', (req, res) => {
  try {
    // 业务逻辑
    const result = processData(req.query);
    
    res.json({
      success: true,
      data: result,
      message: '操作成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

#### 2. 数据验证
```javascript
// 添加输入验证中间件
const validateInput = (req, res, next) => {
  const { required } = req.body;
  if (!required) {
    return res.status(400).json({
      success: false,
      error: '缺少必要参数'
    });
  }
  next();
};

app.post('/api/endpoint', validateInput, (req, res) => {
  // 处理逻辑
});
```

### 🗄️ 数据库集成

#### MongoDB集成
```bash
# 安装MongoDB驱动
npm install mongoose

# 创建模型
const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: String,
  type: String,
  desc: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

const Spot = mongoose.model('Spot', spotSchema);

// 连接数据库
mongoose.connect('mongodb://localhost:27017/village-guide');
```

#### SQLite集成
```bash
# 安装SQLite驱动
npm install sqlite3

# 创建数据库连接
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./village-guide.db');

// 创建表
db.run(`CREATE TABLE IF NOT EXISTS spots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  type TEXT,
  desc TEXT,
  location TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
```

### 🔌 中间件扩展

#### 认证中间件
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: '缺少访问令牌'
    });
  }

  // 验证token逻辑
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: '无效的访问令牌'
      });
    }
    req.user = user;
    next();
  });
};
```

---

## 📞 技术支持

### 🆘 紧急联系

| 问题类型 | 联系方式 |
|---------|----------|
| **系统崩溃** | 查看PM2日志：`pm2 logs` |
| **API异常** | 检查健康状态：`curl /api/health` |
| **性能问题** | 监控资源：`pm2 monit` |
| **安全事件** | 查看访问日志 |

### 📚 参考文档

- [Express.js官方文档](https://expressjs.com/)
- [Node.js官方文档](https://nodejs.org/docs/)
- [PM2文档](https://pm2.keymetrics.io/docs/)
- [Docker文档](https://docs.docker.com/)

---

## 📋 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2025-12-07 | 初始版本，完整API实现 |
| v1.1.0 | 计划中 | 数据库集成优化 |
| v1.2.0 | 计划中 | 性能监控增强 |

---

**🎯 后端系统已准备就绪，可立即投入使用！**

如有问题，请参考故障排查章节或联系技术支持。