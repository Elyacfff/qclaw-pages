#!/bin/bash

# QaraKino 一键安装脚本
# 版本: 1.0.0

echo "=========================================="
echo "   🎬 QaraKino - 维语影视平台"
echo "   一键安装脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${BLUE}[1/6]${NC} 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装!${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js 已安装: $NODE_VERSION${NC}"

# 检查 npm
echo -e "${BLUE}[2/6]${NC} 检查 npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: npm 未安装!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm 已安装: $NPM_VERSION${NC}"

# 安装根依赖
echo ""
echo -e "${BLUE}[3/6]${NC} 安装根目录依赖..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 根目录依赖安装成功${NC}"
else
    echo -e "${RED}✗ 根目录依赖安装失败${NC}"
    exit 1
fi

# 安装后端依赖
echo ""
echo -e "${BLUE}[4/6]${NC} 安装后端依赖..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 后端依赖安装成功${NC}"
else
    echo -e "${RED}✗ 后端依赖安装失败${NC}"
    exit 1
fi
cd ..

# 安装前端依赖
echo ""
echo -e "${BLUE}[5/6]${NC} 安装用户端依赖..."
cd client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 用户端依赖安装成功${NC}"
else
    echo -e "${RED}✗ 用户端依赖安装失败${NC}"
    exit 1
fi
cd ..

# 安装管理后台依赖
echo ""
echo -e "${BLUE}[6/6]${NC} 安装管理后台依赖..."
cd admin
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 管理后台依赖安装成功${NC}"
else
    echo -e "${RED}✗ 管理后台依赖安装失败${NC}"
    exit 1
fi
cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 安装完成!${NC}"
echo "=========================================="
echo ""
echo "快速启动命令:"
echo "  npm run dev          # 启动所有服务"
echo ""
echo "或分别启动:"
echo "  cd backend && npm run dev  # 后端 (端口 5000)"
echo "  cd client && npm run dev   # 用户端 (端口 3000)"
echo "  cd admin && npm run dev    # 管理后台 (端口 3001)"
echo ""
echo "访问地址:"
echo "  用户端:  http://localhost:3000"
echo "  管理后台: http://localhost:3001"
echo "  后端API: http://localhost:5000"
echo ""
echo "=========================================="
