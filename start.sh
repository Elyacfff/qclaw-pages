#!/bin/bash

# QaraKino 一键启动脚本
# 版本: 1.0.0

echo "=========================================="
echo "   🎬 QaraKino - 启动服务"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查 Node.js
echo -e "${BLUE}[检查]${NC} Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装!${NC}"
    echo "请先运行: ./install.sh"
    exit 1
fi
echo -e "${GREEN}✓ Node.js 已就绪${NC}"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}[提示]${NC} 依赖未安装，正在自动安装..."
    ./install.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}依赖安装失败${NC}"
        exit 1
    fi
fi

# 检查各个模块
for dir in "backend" "client" "admin"; do
    if [ ! -d "$dir/node_modules" ]; then
        echo ""
        echo -e "${YELLOW}[提示]${NC} $dir 依赖未安装，正在安装..."
        cd $dir && npm install && cd ..
    fi
done

echo ""
echo "=========================================="
echo -e "${GREEN}🚀 正在启动所有服务...${NC}"
echo "=========================================="
echo ""
echo "📡 后端服务:   http://localhost:5000"
echo "🎬 用户端:     http://localhost:3000"
echo "⚙️  管理后台:   http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "=========================================="
echo ""

npm run dev
