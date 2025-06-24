#!/bin/bash
# 此脚本用于部署 Firebase Functions

# 显示当前工作目录
echo "当前工作目录: $(pwd)"

# 检查是否已登录 Firebase
echo "检查 Firebase 登录状态..."
npx firebase login --interactive

# 安装 Functions 依赖
echo "安装 Functions 依赖..."
cd functions
npm install
cd ..

# 设置 Firebase 配置
echo "设置 Firebase 配置..."
# 替换下面的 YOUR_EMAIL 和 YOUR_APP_PASSWORD 为您的实际值
# 对于 Gmail，您需要使用应用专用密码: https://support.google.com/accounts/answer/185833
npx firebase functions:config:set email.user="vincent.jin@icloud.com" email.pass="YOUR_APP_PASSWORD" email.recipient="vincent.jin@icloud.com"

# 部署 Functions
echo "部署 Firebase Functions..."
npx firebase deploy --only functions

echo "部署完成！"
echo "您可以在 Firebase 控制台查看您的 Functions: https://console.firebase.google.com/project/vincentkovsky/functions"
