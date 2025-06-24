# Firebase Functions

这个目录包含了 Firebase Cloud Functions 的代码，用于处理后端功能，如发送邮件通知和定期清理数据。

## 功能列表

1. **sendContactFormEmail**: 当有新的联系表单提交时，自动发送邮件通知。
2. **cleanupOldVisitorData**: 定期清理旧的访问者数据，保留最近 30 天的记录。

## 部署步骤

### 1. 安装依赖

```bash
cd functions
npm install
```

### 2. 配置邮件服务

为了使邮件通知功能正常工作，您需要设置以下环境变量：

```bash
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password" email.recipient="notification-recipient@example.com"
```

> **注意**：如果使用 Gmail，您需要使用"应用专用密码"而不是您的常规密码。
> 您可以在 [Google 账户安全设置](https://myaccount.google.com/security) 中创建应用专用密码。

### 3. 部署 Functions

```bash
firebase deploy --only functions
```

或者使用项目根目录中的部署脚本：

```bash
./deploy-functions.sh
```

## 本地测试

您可以使用 Firebase 模拟器在本地测试 Functions：

```bash
cd functions
npm run serve
```

## 查看日志

部署后，您可以使用以下命令查看 Functions 日志：

```bash
firebase functions:log
```

## 注意事项

- 默认情况下，Firebase Functions 使用 Node.js 18 运行时。
- 免费套餐有一些限制，如果您需要更多资源，可能需要升级到付费套餐。
- 确保您的 Firestore 安全规则正确配置，以允许 Functions 访问必要的数据。
