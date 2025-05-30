#!/bin/bash
# 脚本用于部署到 vincentkovsky.github.io 仓库

# 显示当前工作目录
echo "当前工作目录: $(pwd)"

# 确保 github-pages 远程仓库已配置
if ! git remote | grep -q "^github-pages$"; then
  echo "添加 github-pages 远程仓库..."
  git remote add github-pages git@github.com:Vincentkovsky/vincentkovsky.github.io.git
else
  echo "github-pages 远程仓库已配置"
fi

# 构建项目
echo "开始构建项目..."
# 不再需要设置环境变量，因为我们已经在vite.config.ts中固定了base path为"/"
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

# 创建 .nojekyll 文件以禁用 GitHub Pages 的 Jekyll 处理
echo "创建 .nojekyll 文件"
touch dist/.nojekyll

# 使用 gh-pages 包部署到 github.io 仓库
echo "部署到 vincentkovsky.github.io..."
npx gh-pages -d dist -b main -r git@github.com:Vincentkovsky/vincentkovsky.github.io.git

echo "部署完成！请访问 https://vincentkovsky.github.io/ 查看您的网站。"
