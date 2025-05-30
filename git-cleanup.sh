#!/bin/bash
# 此脚本用于清理git仓库中的嵌入式git仓库问题

set -e  # 遇到错误立即退出

echo "开始清理git仓库..."

# 移除 node_modules/.cache/gh-pages 目录中的嵌入式git仓库
if [ -d "node_modules/.cache/gh-pages" ]; then
  echo "删除 node_modules/.cache/gh-pages 目录..."
  rm -rf node_modules/.cache/gh-pages
fi

# 移除 .vite 目录
if [ -d ".vite" ]; then
  echo "删除 .vite 目录..."
  rm -rf .vite
fi

# 查找并删除 node_modules 中的所有 .git 目录
echo "查找并删除 node_modules 中的所有嵌入式 .git 目录..."
find node_modules -name ".git" -type d -exec rm -rf {} \; 2>/dev/null || true

# 添加 .gitignore 文件
echo "添加 .gitignore 文件..."
git add .gitignore

# 提交更改
echo "提交更改..."
git commit -m "更新 .gitignore 文件，排除嵌入式git仓库"

echo "清理完成。"
echo "现在可以尝试使用 ./deploy-to-github-io-alternate.sh 进行部署。"
