# QaraKino - 部署包

这是一个完整的可部署包，包含用户端、管理后台和后端 API。

## 🚀 快速开始

### 在本地运行

```bash
npm install
npm start
```

然后访问：
- 用户端：http://localhost:3000
- 管理后台：http://localhost:3000/admin

### 在本地开发

```bash
# 后端
cd backend
npm install
npm run dev

# 前端
cd client
npm install
npm run dev

# 管理后台
cd admin
npm install
npm run dev
```

## 📦 文件结构

```
├── server.js           # 统一部署服务器
├── package.json        # 依赖配置
├── client/             # 用户端（已构建）
├── admin/              # 管理后台（已构建）
├── backend/            # 后端源代码
├── render.yaml         # Render 部署配置
├── railway.json        # Railway 部署配置
├── start.sh            # Linux/Mac 启动脚本
└── start.bat           # Windows 启动脚本
```

## 🔑 管理后台登录

- 用户名：`admin`
- 密码：`admin123`

## 📖 更多信息

查看根目录下的 [部署指南.md](../部署指南.md) 了解完整部署步骤。

## ✨ 功能特性

- 🎬 视频浏览和播放
- 🔍 搜索和分类
- ❤️ 收藏功能
- 📝 观看历史
- ⭐ 评分和评论
- 📱 PWA 支持
- 🛠️ 完整的管理后台
