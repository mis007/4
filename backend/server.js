/**
 * 🎯 东里村智能导游系统 - Admin后端服务
 * 
 * 功能：
 * - 用户管理API
 * - 内容管理API
 * - 分析数据API
 * - 草稿管理API
 * 
 * @author 东里村开发团队
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== 中间件配置 ====================

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== 模拟数据库 ====================

let db = {
  users: [
    { 
      id: 'user_001', 
      username: 'admin', 
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2025-01-01')
    },
    { 
      id: 'user_002', 
      username: 'editor', 
      email: 'editor@example.com',
      role: 'editor',
      status: 'active',
      createdAt: new Date('2025-01-05')
    },
    { 
      id: 'user_003', 
      username: 'visitor', 
      email: 'visitor@example.com',
      role: 'user',
      status: 'inactive',
      createdAt: new Date('2025-01-10')
    }
  ],
  
  contents: [
    {
      id: 'content_001',
      title: '红色文化景点介绍',
      type: 'article',
      status: 'published',
      authorId: 'user_001',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: 'content_002',
      title: '自然风光导览',
      type: 'guide',
      status: 'draft',
      authorId: 'user_002',
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-08')
    }
  ],
  
  drafts: [
    {
      id: 'draft_001',
      title: '村镇人物故事',
      content: '这是一个草稿...',
      authorId: 'user_002',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10')
    }
  ],

  analytics: {
    totalUsers: 1250,
    totalVisits: 56800,
    todayActive: 320,
    conversionRate: 0.15,
    pageViews: [
      { page: '/home', views: 15200 },
      { page: '/spots', views: 12500 },
      { page: '/chat', views: 18600 },
      { page: '/profile', views: 10500 }
    ],
    userGrowth: [
      { date: '2025-01-01', newUsers: 50 },
      { date: '2025-01-05', newUsers: 75 },
      { date: '2025-01-10', newUsers: 120 },
      { date: '2025-01-15', newUsers: 95 }
    ]
  }
};

// ==================== 中间件函数 ====================

// 请求日志
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// 模拟认证（生产环境应使用JWT）
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token && req.path !== '/api/admin/health') {
    return res.status(401).json({
      success: false,
      error: '缺少认证令牌',
      code: 'UNAUTHORIZED'
    });
  }
  
  // 模拟token验证
  if (token && token === 'invalid') {
    return res.status(401).json({
      success: false,
      error: 'Token无效',
      code: 'INVALID_TOKEN'
    });
  }
  
  // 简单token解析（生产环境应使用JWT库）
  req.user = {
    id: 'user_001',
    role: 'admin',
    username: 'admin'
  };
  
  next();
};

// ==================== 健康检查 ====================

/**
 * GET /api/admin/health
 * 检查后端服务状态
 */
app.get('/api/admin/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 应用认证中间件
app.use('/api/admin/*', authMiddleware);

// ==================== 用户管理API ====================

/**
 * GET /api/admin/users
 * 获取用户列表（分页）
 */
app.get('/api/admin/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  
  let users = db.users;
  
  // 状态过滤
  if (status) {
    users = users.filter(u => u.status === status);
  }
  
  // 分页处理
  const start = (page - 1) * limit;
  const paginatedUsers = users.slice(start, start + limit);
  
  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: users.length,
      pages: Math.ceil(users.length / limit)
    }
  });
});

/**
 * GET /api/admin/users/:id
 * 获取单个用户详情
 */
app.get('/api/admin/users/:id', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: '用户不存在',
      code: 'USER_NOT_FOUND'
    });
  }
  
  res.json({ success: true, data: user });
});

/**
 * POST /api/admin/users
 * 创建新用户
 */
app.post('/api/admin/users', (req, res) => {
  const { username, email, role = 'user' } = req.body;
  
  if (!username || !email) {
    return res.status(400).json({
      success: false,
      error: '用户名和邮箱不能为空',
      code: 'INVALID_PARAMS'
    });
  }
  
  const newUser = {
    id: `user_${uuidv4()}`,
    username,
    email,
    role,
    status: 'active',
    createdAt: new Date()
  };
  
  db.users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: '用户创建成功'
  });
});

/**
 * PUT /api/admin/users/:id
 * 更新用户信息
 */
app.put('/api/admin/users/:id', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: '用户不存在',
      code: 'USER_NOT_FOUND'
    });
  }
  
  Object.assign(user, req.body, { id: user.id, createdAt: user.createdAt });
  
  res.json({
    success: true,
    data: user,
    message: '用户更新成功'
  });
});

/**
 * DELETE /api/admin/users/:id
 * 删除用户
 */
app.delete('/api/admin/users/:id', (req, res) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: '用户不存在',
      code: 'USER_NOT_FOUND'
    });
  }
  
  const deletedUser = db.users.splice(index, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
    message: '用户删除成功'
  });
});

// ==================== 内容管理API ====================

/**
 * GET /api/admin/contents
 * 获取内容列表
 */
app.get('/api/admin/contents', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  
  let contents = db.contents;
  
  if (status) {
    contents = contents.filter(c => c.status === status);
  }
  
  const start = (page - 1) * limit;
  const paginatedContents = contents.slice(start, start + limit);
  
  res.json({
    success: true,
    data: paginatedContents,
    pagination: {
      page,
      limit,
      total: contents.length,
      pages: Math.ceil(contents.length / limit)
    }
  });
});

/**
 * POST /api/admin/content/submit
 * 提交内容
 */
app.post('/api/admin/content/submit', (req, res) => {
  const { title, content, type = 'article', tags = [] } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: '标题和内容不能为空',
      code: 'INVALID_PARAMS'
    });
  }
  
  const newContent = {
    id: `content_${uuidv4()}`,
    title,
    content,
    type,
    tags,
    status: 'published',
    authorId: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  db.contents.push(newContent);
  
  res.status(201).json({
    success: true,
    data: newContent,
    message: '内容发布成功'
  });
});

// ==================== 草稿管理API ====================

/**
 * GET /api/admin/drafts
 * 获取草稿列表
 */
app.get('/api/admin/drafts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const start = (page - 1) * limit;
  const paginatedDrafts = db.drafts.slice(start, start + limit);
  
  res.json({
    success: true,
    data: paginatedDrafts,
    pagination: {
      page,
      limit,
      total: db.drafts.length,
      pages: Math.ceil(db.drafts.length / limit)
    }
  });
});

/**
 * POST /api/admin/drafts/save
 * 保存草稿
 */
app.post('/api/admin/drafts/save', (req, res) => {
  const { title, content, id } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: '标题和内容不能为空',
      code: 'INVALID_PARAMS'
    });
  }
  
  let draft;
  
  if (id) {
    draft = db.drafts.find(d => d.id === id);
    if (draft) {
      Object.assign(draft, { title, content, updatedAt: new Date() });
    }
  } else {
    draft = {
      id: `draft_${uuidv4()}`,
      title,
      content,
      authorId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.drafts.push(draft);
  }
  
  res.json({
    success: true,
    data: draft,
    message: '草稿保存成功'
  });
});

/**
 * DELETE /api/admin/drafts/:id
 * 删除草稿
 */
app.delete('/api/admin/drafts/:id', (req, res) => {
  const index = db.drafts.findIndex(d => d.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: '草稿不存在',
      code: 'DRAFT_NOT_FOUND'
    });
  }
  
  const deletedDraft = db.drafts.splice(index, 1)[0];
  
  res.json({
    success: true,
    data: deletedDraft,
    message: '草稿删除成功'
  });
});

// ==================== 分析数据API ====================

/**
 * GET /api/admin/analytics/dashboard
 * 获取仪表板数据
 */
app.get('/api/admin/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      summary: {
        totalUsers: db.analytics.totalUsers,
        totalVisits: db.analytics.totalVisits,
        todayActive: db.analytics.todayActive,
        conversionRate: db.analytics.conversionRate
      },
      pageViews: db.analytics.pageViews,
      userGrowth: db.analytics.userGrowth,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /api/admin/analytics/users
 * 获取用户统计
 */
app.get('/api/admin/analytics/users', (req, res) => {
  res.json({
    success: true,
    data: {
      total: db.users.length,
      active: db.users.filter(u => u.status === 'active').length,
      inactive: db.users.filter(u => u.status === 'inactive').length,
      byRole: {
        admin: db.users.filter(u => u.role === 'admin').length,
        editor: db.users.filter(u => u.role === 'editor').length,
        user: db.users.filter(u => u.role === 'user').length
      }
    }
  });
});

// ==================== 系统配置API ====================

/**
 * GET /api/admin/system/config
 * 获取系统配置
 */
app.get('/api/admin/system/config', (req, res) => {
  res.json({
    success: true,
    data: {
      siteName: '东里村智能导游系统',
      version: '1.0.0',
      features: {
        voiceRecognition: true,
        agentSystem: true,
        mapIntegration: true,
        analyticsTracking: true
      },
      apiEndpoints: {
        baseUrl: 'http://localhost:3001',
        mobileApp: 'http://localhost:3000'
      }
    }
  });
});

/**
 * POST /api/admin/system/config
 * 更新系统配置
 */
app.post('/api/admin/system/config', (req, res) => {
  // 在实际项目中，这里应该持久化配置到数据库或文件
  console.log('🔧 系统配置已更新:', req.body);
  
  res.json({
    success: true,
    message: '系统配置已更新',
    data: req.body
  });
});

// ==================== 错误处理 ====================

/**
 * 404处理
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '请求的资源不存在',
    code: 'NOT_FOUND',
    path: req.path
  });
});

/**
 * 全局错误处理
 */
app.use((err, req, res, next) => {
  console.error('❌ 错误:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '服务器内部错误',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🎯 东里村智能导游 - Admin后端服务        ║
║   ✅ 服务运行中                             ║
╚════════════════════════════════════════════╝

📡 API地址: http://localhost:${PORT}

🔗 主要端点:
   • GET  /api/admin/health               - 健康检查
   • GET  /api/admin/users                - 用户列表
   • GET  /api/admin/contents             - 内容列表
   • GET  /api/admin/drafts               - 草稿列表
   • GET  /api/admin/analytics/dashboard  - 仪表板数据
   • POST /api/admin/content/submit       - 发布内容
   • POST /api/admin/drafts/save          - 保存草稿

🌐 前端访问: http://localhost:3000/admin

📝 模拟Token: (不验证，任意字符串)

⚠️  生产环境注意事项:
   1. 使用真实数据库（MongoDB/PostgreSQL）
   2. 实现JWT认证
   3. 添加输入验证和错误处理
   4. 配置速率限制
   5. 启用HTTPS
   6. 添加日志和监控

按 Ctrl+C 停止服务器
  `);
});

module.exports = app;
