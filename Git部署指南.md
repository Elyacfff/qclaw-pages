# 🎯 Git 部署快速指南

## 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`qarakino`
3. 选择 Public 或 Private
4. 点击 "Create repository"

## 第二步：初始化本地仓库

在你的电脑上（或者使用在线编辑器）：

```bash
cd /workspace/deploy

# 初始化 git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/qarakino.git
git push -u origin main
```

## 第三步：连接到免费平台（二选一）

### 选项 A：Render（推荐，完全免费）

1. 访问 https://render.com/ 并注册
2. 点击 "New +" → "Web Service"
3. 选择你的 GitHub 仓库 `qarakino`
4. 配置如下：
   - Name: `qarakino`
   - Region: 选择离你最近的
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free
5. 点击 "Create Web Service"
6. 等待 2-3 分钟，完成！
7. 你会获得类似 `https://qarakino-abc123.onrender.com` 的网址

### 选项 B：Railway

1. 访问 https://railway.app/
2. 点击 "New Project" → "Deploy from repo"
3. 选择你的仓库
4. 配置：
   - Name: `qarakino`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. 点击 "Deploy"

## 第四步：访问你的网站

部署完成后，你可以：

- 🌐 **用户端**：`https://你的域名/`
- 🔧 **管理后台**：`https://你的域名/admin/`
- 📊 **API 接口**：`https://你的域名/api/`

## 🔑 管理后台登录

- 用户名：`admin`
- 密码：`admin123`

---

## 💡 提示

- 首次部署可能需要 2-3 分钟
- 之后每次 Git 提交会自动重新部署
- 如果有问题，检查平台的部署日志

---

## 📞 需要帮助？

查看 [部署指南.md](./部署指南.md) 获得详细说明！
