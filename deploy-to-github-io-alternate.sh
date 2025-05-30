#!/bin/bash
# 脚本用于部署到 vincentkovsky.github.io 仓库
# 使用手动克隆和推送的方法，避免 gh-pages 包的问题

set -e  # 遇到错误立即退出

# 显示当前工作目录
echo "当前工作目录: $(pwd)"

# 构建项目
echo "开始构建项目..."
npm run build

# 确保 dist 目录存在
if [ ! -d "dist" ]; then
  echo "错误: 构建后未找到 dist 目录!"
  exit 1
fi

# 检查 dist/index.html 是否生成且有内容
if [ ! -f "dist/index.html" ] || ! [ -s "dist/index.html" ]; then
  echo "错误: dist/index.html 未生成或为空!"
  exit 1
fi

# 创建 404.html
if [ -f "client/404.html" ]; then
  echo "使用 client/404.html 作为 dist/404.html"
  cp client/404.html dist/404.html
else
  echo "从 dist/index.html 创建 dist/404.html"
  cp dist/index.html dist/404.html
fi

# 创建 .nojekyll 文件
echo "创建 .nojekyll 文件"
touch dist/.nojekyll

# 创建临时目录
TEMP_DIR=$(mktemp -d)
echo "创建临时目录: $TEMP_DIR"

# 克隆目标仓库
echo "克隆 vincentkovsky.github.io 仓库..."
git clone git@github.com:Vincentkovsky/vincentkovsky.github.io.git $TEMP_DIR

# 删除所有文件 (保留 .git 目录)
echo "清理仓库中的旧文件..."
find $TEMP_DIR -mindepth 1 -maxdepth 1 -not -path "$TEMP_DIR/.git" -exec rm -rf {} \;

# 复制新构建的文件
echo "复制新构建的文件..."
cp -r dist/* $TEMP_DIR/

# 进入目标目录
cd $TEMP_DIR

# 配置 Git
git config user.name "Deployment Script"
git config user.email "deployment@script.local"

# 添加所有文件并提交
echo "提交更改..."
git add -A
git commit -m "Deploy: $(date)" || { echo "没有变更，无需提交"; exit 0; }

# 推送到 GitHub
echo "推送到 GitHub..."
git push origin main

# 清理
echo "清理临时目录..."
cd -
rm -rf $TEMP_DIR

echo "部署完成！请访问 https://vincentkovsky.github.io/ 查看您的网站。"
