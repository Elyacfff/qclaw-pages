#!/bin/bash
# QaraKino - Quick Start Script
# Usage: ./start.sh [port]

PORT=${1:-3000}

echo "========================================"
echo "  QaraKino Starting..."
echo "  Port: $PORT"
echo "========================================"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start server
PORT=$PORT node server.js
