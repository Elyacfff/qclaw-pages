# QaraKino - 维语影视平台

一个完整的维语影视应用，包含用户端和管理后台。

## 技术栈

- **前端**: React + Vite + Tailwind CSS
- **后端**: Node.js + Express
- **文件上传**: Multer (本地存储)
- **部署**: Vercel (可选)

## 项目结构

```
.
├── backend/                 # 后端 API
│   ├── server.js           # 主服务器文件
│   ├── package.json
│   └── uploads/            # 上传文件目录
├── client/                 # 用户端前端
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── VideoPage.jsx
│   │       ├── CategoryPage.jsx
│   │       └── SearchPage.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── admin/                  # 管理后台
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Videos.jsx
│   │       ├── Categories.jsx
│   │       └── Sliders.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json            # 根 package.json
└── README.md
```

## 快速开始

### 1. 安装根依赖

```bash
npm install
```

### 2. 安装各模块依赖

```bash
# 安装后端依赖
cd backend
npm install
cd ..

# 安装用户端依赖
cd client
npm install
cd ..

# 安装管理后台依赖
cd admin
npm install
cd ..
```

### 3. 启动开发服务器

在根目录运行：

```bash
# 启动所有服务（后端 + 用户端 + 管理后台）
npm run dev
```

或者分别启动：

```bash
# 启动后端 (端口 5000)
cd backend && npm run dev

# 启动用户端 (端口 3000)
cd client && npm run dev

# 启动管理后台 (端口 3001)
cd admin && npm run dev
```

## 功能特性

### 用户端
- 🎬 视频浏览和分类
- 📺 高清视频播放器
- 🔍 支持维语和中文搜索
- 🏠 首页轮播图推荐
- 📱 响应式设计，支持移动端

### 管理后台
- 📤 视频上传和管理
- 📁 分类管理
- 🏠 轮播图管理
- 📊 数据统计仪表板

## API 接口

### 视频相关
- `GET /api/videos` - 获取视频列表
- `GET /api/videos/:id` - 获取单个视频
- `POST /api/videos` - 上传新视频
- `PUT /api/videos/:id` - 更新视频
- `DELETE /api/videos/:id` - 删除视频

### 分类相关
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `DELETE /api/categories/:id` - 删除分类

### 轮播图相关
- `GET /api/sliders` - 获取轮播图列表
- `POST /api/sliders` - 创建轮播图
- `DELETE /api/sliders/:id` - 删除轮播图

### 统计
- `GET /api/stats` - 获取统计数据

## 部署

### 后端部署

1. 将 `backend/` 目录部署到 Vercel 或其他 Node.js 托管平台
2. 配置环境变量
3. 对于生产环境，建议使用云存储（如 Cloudflare R2、AWS S3 等）替代本地存储

### 前端部署

1. 构建用户端：
```bash
cd client
npm run build
```

2. 构建管理后台：
```bash
cd admin
npm run build
```

3. 将 `client/dist/` 和 `admin/dist/` 部署到静态托管服务（Vercel、Netlify 等）

## 技术说明

### 文件存储
- 开发环境：使用本地 `uploads/` 目录
- 生产环境：建议配置 Cloudflare R2 或 AWS S3

### 数据库
- 当前使用内存存储（演示用途）
- 生产环境建议使用 PostgreSQL + Prisma ORM

### 安全建议
1. 添加用户认证和授权
2. 配置文件上传限制和类型验证
3. 添加 CORS 限制
4. 使用环境变量管理敏感配置

## 开发说明

- 后端默认端口：`5000`
- 用户端默认端口：`3000`
- 管理后台默认端口：`3001`
- 上传的文件存储在 `backend/uploads/` 目录
