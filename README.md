# Personal Web Portfolio | 个人网站作品集

[English](#english) | [中文](#chinese)

<a id="english"></a>

## English

A modern, responsive personal web portfolio built with React, TypeScript, and Tailwind CSS. This project is designed to be easily deployed to GitHub Pages or Firebase with Firebase Firestore for backend services.

### Features

- **Modern Tech Stack**: React, TypeScript, Tailwind CSS
- **Component Library**: Uses Radix UI primitives with custom styling
- **Firebase Integration**: Firestore for contact form submissions and visitor statistics
- **Responsive Design**: Mobile-friendly interface
- **Contact Form**: Integrated with Firebase Firestore
- **Visitor Statistics**: Track and display visitor data with interactive world map
- **Internationalization**: Supports multiple languages (English and Chinese)
- **Auto Language Detection**: Automatically detects user's browser language
- **Fast Development**: Vite for frontend development
- **Multiple Deployment Options**: Deploy to GitHub Pages or Firebase Hosting

### Project Structure

```
/
├── client/                   # Frontend React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions and configuration
│   │   │   ├── firebase.ts   # Firebase configuration
│   │   │   ├── firebaseService.ts # Firebase service functions
│   │   │   ├── i18n.ts       # Internationalization configuration
│   │   │   └── languageContext.tsx # Language context provider
│   │   ├── locales/          # Translation files
│   │   │   ├── en/           # English translations
│   │   │   └── zh/           # Chinese translations
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   └── index.html            # HTML template
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions workflows
│       ├── deploy.yml        # GitHub Pages deployment workflow
│       └── firebase-deploy.yml # Firebase deployment workflow
├── firebase.json             # Firebase configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
├── package.json              # Project dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
└── vite.config.ts            # Vite bundler configuration
```

### Getting Started

#### Prerequisites

- Node.js (v18+)
- npm or yarn
- Firebase account (for Firestore)

#### Installation

1. Clone the repository

   ```
   git clone <repository-url>
   cd PersonalWeb
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up Firebase
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore database
   - Get your Firebase configuration (apiKey, authDomain, etc.)
   - Add your Firebase configuration as environment variables:
     - Create a `.env.local` file at the root with the following:
       ```
       VITE_FIREBASE_API_KEY=your_api_key
       VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
       VITE_FIREBASE_PROJECT_ID=your_project_id
       VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
       VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
       VITE_FIREBASE_APP_ID=your_app_id
       VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
       ```

#### Development

Start the development server:

```
npm run dev
```

This will start the frontend development server. Access the application at http://localhost:5173.

#### Production Build

Build the application for production:

```
npm run build
```

Preview the production build:

```
npm run preview
```

#### Deployment Options

##### GitHub Pages

Deploy to GitHub Pages:

```
npm run deploy:gh-pages
```

Alternatively, pushing to the main branch will trigger the GitHub Actions workflow to automatically deploy to GitHub Pages.

##### Firebase Hosting

1. Login to Firebase (one-time setup):

   ```
   npx firebase login
   ```

2. Initialize Firebase (one-time setup):

   ```
   npx firebase init
   ```

3. Deploy to Firebase:
   ```
   npm run deploy:firebase
   ```

Alternatively, pushing to the main branch will trigger the GitHub Actions workflow to automatically deploy to Firebase (if configured with secrets).

### Project Structure Details

#### Frontend

The frontend is built with React and uses the following organization:

- **Components**: Reusable UI components located in `client/src/components`
- **Pages**: Page-level components in `client/src/pages`
- **Hooks**: Custom React hooks in `client/src/hooks`
- **Lib**: Utility functions and configuration in `client/src/lib`
  - **Firebase**: Firebase configuration and service functions
  - **i18n**: Internationalization configuration

#### Firebase

Firebase Firestore is used for:

- Storing contact form submissions
- Tracking visitor statistics
- (Potentially) User authentication
- (Potentially) Other dynamic data storage needs

#### Internationalization

The project supports multiple languages:

- English (default)
- Chinese

Language detection is automatic based on the user's browser settings, with manual language switching also available.

#### CI/CD

Automated deployment workflows are included for:

- GitHub Pages deployment
- Firebase Hosting deployment

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<a id="chinese"></a>

## 中文

这是一个使用 React、TypeScript 和 Tailwind CSS 构建的现代化、响应式个人网站作品集。该项目设计为可以轻松部署到 GitHub Pages 或 Firebase，并使用 Firebase Firestore 作为后端服务。

### 功能特点

- **现代技术栈**：React、TypeScript、Tailwind CSS
- **组件库**：使用 Radix UI 原语配合自定义样式
- **Firebase 集成**：使用 Firestore 存储联系表单提交和访客统计数据
- **响应式设计**：移动端友好界面
- **联系表单**：与 Firebase Firestore 集成
- **访客统计**：跟踪并显示访客数据，包含交互式世界地图
- **国际化**：支持多语言（英文和中文）
- **自动语言检测**：自动检测用户浏览器语言设置
- **快速开发**：使用 Vite 进行前端开发
- **多种部署选项**：可部署到 GitHub Pages 或 Firebase Hosting

### 项目结构

```
/
├── client/                   # 前端 React 应用
│   ├── src/
│   │   ├── components/       # UI 组件
│   │   │   └── ui/           # 可复用 UI 组件
│   │   ├── pages/            # 页面组件
│   │   ├── hooks/            # 自定义 React hooks
│   │   ├── lib/              # 工具函数和配置
│   │   │   ├── firebase.ts   # Firebase 配置
│   │   │   ├── firebaseService.ts # Firebase 服务函数
│   │   │   ├── i18n.ts       # 国际化配置
│   │   │   └── languageContext.tsx # 语言上下文提供者
│   │   ├── locales/          # 翻译文件
│   │   │   ├── en/           # 英文翻译
│   │   │   └── zh/           # 中文翻译
│   │   ├── App.tsx           # 主应用组件
│   │   └── main.tsx          # 应用入口点
│   └── index.html            # HTML 模板
├── .github/                  # GitHub 配置
│   └── workflows/            # GitHub Actions 工作流
│       ├── deploy.yml        # GitHub Pages 部署工作流
│       └── firebase-deploy.yml # Firebase 部署工作流
├── firebase.json             # Firebase 配置
├── firestore.rules           # Firestore 安全规则
├── firestore.indexes.json    # Firestore 索引
├── package.json              # 项目依赖和脚本
├── tailwind.config.ts        # Tailwind CSS 配置
└── vite.config.ts            # Vite 打包配置
```

### 开始使用

#### 前提条件

- Node.js (v18+)
- npm 或 yarn
- Firebase 账号（用于 Firestore）

#### 安装

1. 克隆仓库

   ```
   git clone <repository-url>
   cd PersonalWeb
   ```

2. 安装依赖

   ```
   npm install
   ```

3. 设置 Firebase
   - 在 [firebase.google.com](https://firebase.google.com) 创建 Firebase 项目
   - 启用 Firestore 数据库
   - 获取 Firebase 配置（apiKey, authDomain 等）
   - 将 Firebase 配置添加为环境变量：
     - 在根目录创建 `.env.local` 文件，内容如下：
       ```
       VITE_FIREBASE_API_KEY=your_api_key
       VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
       VITE_FIREBASE_PROJECT_ID=your_project_id
       VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
       VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
       VITE_FIREBASE_APP_ID=your_app_id
       VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
       ```

#### 开发

启动开发服务器：

```
npm run dev
```

这将启动前端开发服务器。访问 http://localhost:5173 查看应用。

#### 生产构建

构建生产版本：

```
npm run build
```

预览生产构建：

```
npm run preview
```

#### 部署选项

##### GitHub Pages

部署到 GitHub Pages：

```
npm run deploy:gh-pages
```

或者，推送到 main 分支将触发 GitHub Actions 工作流自动部署到 GitHub Pages。

##### Firebase Hosting

1. 登录 Firebase（一次性设置）：

   ```
   npx firebase login
   ```

2. 初始化 Firebase（一次性设置）：

   ```
   npx firebase init
   ```

3. 部署到 Firebase：
   ```
   npm run deploy:firebase
   ```

或者，推送到 main 分支将触发 GitHub Actions 工作流自动部署到 Firebase（如果配置了密钥）。

### 项目结构详情

#### 前端

前端使用 React 构建，采用以下组织方式：

- **组件**：可复用 UI 组件位于 `client/src/components`
- **页面**：页面级组件位于 `client/src/pages`
- **Hooks**：自定义 React hooks 位于 `client/src/hooks`
- **Lib**：工具函数和配置位于 `client/src/lib`
  - **Firebase**：Firebase 配置和服务函数
  - **i18n**：国际化配置

#### Firebase

Firebase Firestore 用于：

- 存储联系表单提交
- 跟踪访客统计数据
- （可能）用户认证
- （可能）其他动态数据存储需求

#### 国际化

项目支持多种语言：

- 英文（默认）
- 中文

语言检测基于用户的浏览器设置自动进行，同时也提供手动语言切换功能。

#### CI/CD

包含自动部署工作流：

- GitHub Pages 部署
- Firebase Hosting 部署

### 贡献

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/your-feature-name`
3. 提交更改：`git commit -am '添加某功能'`
4. 推送分支：`git push origin feature/your-feature-name`
5. 提交拉取请求

### 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。
