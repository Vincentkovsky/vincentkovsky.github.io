#!/bin/bash
# This script is for LOCAL building and preparation for testing with a local server.
# It ensures Vite uses a relative base path for assets suitable for local serving.

echo "开始本地构建 (for local server testing)..."

# 清理旧的构建文件
echo "清理旧的构建文件 (dist/)..."
rm -rf dist

# 构建项目
# IMPORTANT: We are NOT setting GITHUB_ACTIONS or GITHUB_REPOSITORY here.
# This ensures vite.config.ts uses base: './' (or your default for local builds)
# which means asset paths in index.html will be relative (e.g., ./assets/...).
echo "开始构建项目 (Vite将使用本地/开发环境的 base 路径配置)..."
npm run build

# 确保dist目录存在
if [ ! -d "dist" ]; then
  echo "错误: 构建后未找到 dist 目录!"
  exit 1
fi

# 检查 dist/index.html 是否生成且有内容
if [ ! -f "dist/index.html" ] || ! [ -s "dist/index.html" ]; then
  echo "错误: dist/index.html 未生成或为空! 构建过程可能存在问题。"
  echo "请检查以上构建日志。考虑在此处退出脚本。"
  # exit 1 # Uncomment to exit if index.html is empty/missing
fi

# 复制 404.html
# For local testing, this ensures your SPA routing fallback works if your server is configured for it.
# For actual GitHub Pages deployment, the GitHub Actions workflow handles the 404.html.
if [ -f "client/404.html" ]; then
  echo "使用已有的 client/404.html，复制到 dist/404.html"
  cp client/404.html dist/404.html
elif [ -f "dist/index.html" ]; then # Only if index.html was successfully created
  echo "client/404.html 未找到，从 dist/index.html 复制创建 dist/404.html"
  cp dist/index.html dist/404.html
else
  echo "警告: dist/index.html 和 client/404.html 均未找到，无法创建最终的 dist/404.html"
fi

# 创建 .nojekyll 文件 (harmless locally, but good for consistency if you were to manually push `dist` to gh-pages)
echo "创建 .nojekyll 文件到 dist/ 目录..."
touch dist/.nojekyll

echo ""
echo "本地构建完成。dist 目录已准备好。"
echo "建议使用以下命令之一来测试构建结果:"
echo "  1. npx vite preview --outDir dist  (Vite's recommended preview server)"
echo "  2. npx serve dist                 (Simple static server)"
echo "确保在浏览器控制台中检查是否有错误。"
echo ""
echo "要部署到 GitHub Pages, 请通过提交到 main 分支并让 GitHub Actions 工作流处理。"
echo "GitHub Actions 工作流会正确设置 GITHUB_ACTIONS 和 GITHUB_REPOSITORY 环境变量以进行生产构建。"
