# QaraKino - 维语影视平台

一个完整的维语影视平台，包含用户端、管理后台和后端API。

## 📋 功能特性

### 用户端
- 🎬 视频浏览和分类
- 📺 高清视频播放器
- 🔍 支持维语和中文搜索
- 🏠 首页轮播图推荐
- 📱 响应式设计，支持移动端
- ❤️ 收藏功能（即将推出）

### 管理后台
- 📤 视频上传和管理
- 📁 分类管理
- 🏠 轮播图管理
- 📊 数据统计
- ✏️ 视频编辑

### 后端API
- RESTful API 设计
- 视频上传处理
- 内存数据存储（演示版）
- 文件管理

## 🚀 快速开始

### 方式一：一键脚本（推荐）

#### Windows 用户
双击运行 `install.bat`，然后双击 `start.bat`

#### Linux / macOS 用户
```bash
chmod +x install.sh start.sh
./install.sh
./start.sh
```

### 方式二：手动安装

#### 1. 安装依赖
```bash
npm run install:all
```

#### 2. 启动服务
```bash
npm run dev
```

#### 3. 访问应用
- 用户端: http://localhost:3000
- 管理后台: http://localhost:3001
- 后端API: http://localhost:5000

## 📁 项目结构

```
QaraKino/
├── backend/              # 后端 API
│   ├── server.js         # 主服务文件
│   ├── package.json      # 后端依赖
│   └── uploads/          # 上传文件目录
├── client/               # 用户端
│   ├── src/
│   │   ├── App.jsx       # 主应用
│   │   ├── main.jsx      # 入口文件
│   │   ├── index.css     # 样式
│   │   ├── components/   # 组件
│   │   └── pages/        # 页面
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── admin/                # 管理后台
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── pages/
│   ├── index.html
│   └── package.json
├── install.sh/bat        # 安装脚本
├── start.sh/bat          # 启动脚本
├── download.html         # 下载页面
├── package.json          # 根配置
└── README.md
```

## 🔧 可用命令

```bash
# 安装所有依赖
npm run install:all

# 启动所有服务
npm run dev

# 分别启动
npm run dev:backend  # 后端
npm run dev:client   # 用户端
npm run dev:admin    # 管理后台

# 构建生产版本
npm run build:client
npm run build:admin
```

## 📡 API 接口

### 视频接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/videos | 获取视频列表 |
| GET | /api/videos/:id | 获取单个视频 |
| POST | /api/videos | 上传视频 |
| PUT | /api/videos/:id | 更新视频 |
| DELETE | /api/videos/:id | 删除视频 |

### 分类接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/categories | 获取分类列表 |
| POST | /api/categories | 创建分类 |
| DELETE | /api/categories/:id | 删除分类 |

### 轮播图接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/sliders | 获取轮播图 |
| POST | /api/sliders | 创建轮播图 |
| PUT | /api/sliders/:id | 更新轮播图 |
| DELETE | /api/sliders/:id | 删除轮播图 |

### 其他
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/stats | 获取统计数据 |
| GET | /api/health | 健康检查 |

## 🎨 技术栈

- **前端**: React 18 + Vite + Tailwind CSS
- **后端**: Node.js + Express
- **文件上传**: Multer
- **图标**: Lucide React
- **构建工具**: Vite

## 📥 下载安装

访问下载页面获取安装脚本：
- `download.html` - 下载页面（用浏览器打开）
- `install.bat` - Windows 安装脚本
- `install.sh` - Linux / macOS 安装脚本
- `start.bat` / `start.sh` - 启动脚本

## ⚙️ 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- 现代浏览器（Chrome, Firefox, Safari, Edge）

## 🚀 部署建议

生产环境建议：
- 使用 PostgreSQL 或 MongoDB 替代内存存储
- 配置 Nginx 反向代理
- 使用 PM2 管理进程
- 使用云存储（如 Cloudflare R2, AWS S3）存储文件
- 添加用户认证和权限管理
- 配置 HTTPS

## 📝 注意事项

- 当前版本使用内存存储，重启后数据会重置
- 上传文件存储在 `backend/uploads/` 目录
- 生产环境请务必配置安全措施

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**QaraKino** - 维语影视平台 🎬
