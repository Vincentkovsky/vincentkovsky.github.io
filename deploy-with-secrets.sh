#!/bin/bash
# 此脚本用于部署到 vincentkovsky.github.io 仓库
# 支持使用环境变量和密钥

set -e  # 遇到错误立即退出

# 环境变量配置文件路径（如果不存在则跳过）
ENV_FILE=".env.deploy"

# 显示当前工作目录
echo "当前工作目录: $(pwd)"

# 加载环境变量（如果存在）
if [ -f "$ENV_FILE" ]; then
  echo "加载环境变量文件: $ENV_FILE"
  source "$ENV_FILE"
else
  echo "环境变量文件不存在，跳过加载"
fi

# 检查是否提供了必要的密钥
if [ -z "$GITHUB_TOKEN" ] && [ -z "$DEPLOY_SSH_KEY" ]; then
  echo "警告: 未设置 GITHUB_TOKEN 或 DEPLOY_SSH_KEY 环境变量"
  echo "将使用当前 git 配置进行身份验证（如已配置SSH密钥）"
  USE_AUTH=false
else
  USE_AUTH=true
  if [ ! -z "$DEPLOY_SSH_KEY" ]; then
    echo "使用 SSH 密钥进行身份验证"
    USE_SSH=true
  elif [ ! -z "$GITHUB_TOKEN" ]; then
    echo "使用 GitHub Token 进行身份验证"
    USE_SSH=false
  fi
fi

# 设置构建参数
if [ ! -z "$BUILD_ENV" ]; then
  echo "使用构建环境: $BUILD_ENV"
  BUILD_COMMAND="npm run build:$BUILD_ENV"
else
  echo "使用默认构建命令"
  BUILD_COMMAND="npm run build"
fi

# 如果提供了API密钥，添加到构建过程
if [ ! -z "$API_KEY" ]; then
  echo "使用提供的API密钥进行构建"
  export VITE_API_KEY="$API_KEY"
fi

# 如果提供了自定义消息，使用它
if [ -z "$COMMIT_MESSAGE" ]; then
  COMMIT_MESSAGE="Deploy: $(date)"
fi

# 构建项目
echo "开始构建项目..."
eval $BUILD_COMMAND

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
if [ "$USE_AUTH" = true ] && [ "$USE_SSH" = true ]; then
  # 使用SSH密钥
  SSH_KEY_FILE="$TEMP_DIR/deploy_key"
  echo "$DEPLOY_SSH_KEY" > "$SSH_KEY_FILE"
  chmod 600 "$SSH_KEY_FILE"

  GIT_SSH_COMMAND="ssh -i $SSH_KEY_FILE -o StrictHostKeyChecking=no" \
    git clone git@github.com:Vincentkovsky/vincentkovsky.github.io.git "$TEMP_DIR/repo"
elif [ "$USE_AUTH" = true ] && [ "$USE_SSH" = false ]; then
  # 使用GitHub Token
  git clone https://${GITHUB_TOKEN}@github.com/Vincentkovsky/vincentkovsky.github.io.git "$TEMP_DIR/repo"
else
  # 使用现有SSH配置
  git clone git@github.com:Vincentkovsky/vincentkovsky.github.io.git "$TEMP_DIR/repo"
fi

# 保存克隆目录的引用
REPO_DIR="$TEMP_DIR/repo"

# 删除所有文件 (保留 .git 目录)
echo "清理仓库中的旧文件..."
find "$REPO_DIR" -mindepth 1 -maxdepth 1 -not -path "$REPO_DIR/.git" -exec rm -rf {} \;

# 复制新构建的文件
echo "复制新构建的文件..."
cp -r dist/* "$REPO_DIR/"

# 进入目标目录
cd "$REPO_DIR"

# 配置 Git
git config user.name "${GIT_USERNAME:-Deployment Script}"
git config user.email "${GIT_EMAIL:-deployment@script.local}"

# 添加所有文件并提交
echo "提交更改..."
git add -A
git commit -m "$COMMIT_MESSAGE" || { echo "没有变更，无需提交"; exit 0; }

# 推送到 GitHub
echo "推送到 GitHub..."
if [ "$USE_AUTH" = true ] && [ "$USE_SSH" = true ]; then
  # 使用SSH密钥
  GIT_SSH_COMMAND="ssh -i $SSH_KEY_FILE -o StrictHostKeyChecking=no" \
    git push origin main
elif [ "$USE_AUTH" = true ] && [ "$USE_SSH" = false ]; then
  # 已经在clone URL中包含了token，可以直接推送
  git push origin main
else
  # 使用现有SSH配置
  git push origin main
fi

# 清理
echo "清理临时目录..."
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo "部署完成！请访问 https://vincentkovsky.github.io/ 查看您的网站。"
