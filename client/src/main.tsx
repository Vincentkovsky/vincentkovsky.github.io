import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n"; // Import i18n configuration
import { LanguageProvider } from "./lib/languageContext";

// 处理从404.html的重定向
function handleGitHubPagesRedirect() {
  const url = new URL(window.location.href);
  const redirectParam = url.searchParams.get("redirect");

  if (redirectParam) {
    // 构建新的路径，移除redirect参数，并确保原始的查询参数和哈希值保留
    const newPath = redirectParam;
    url.searchParams.delete("redirect"); // 从URL中移除重定向参数
    const remainingSearchParams = url.searchParams.toString();

    let finalNewUrl = newPath;
    if (remainingSearchParams) {
      finalNewUrl += `?${remainingSearchParams}`;
    }
    finalNewUrl += url.hash;

    console.log(
      `Redirecting from 404.html. Original path: ${redirectParam}, New URL: ${finalNewUrl}`
    );
    window.history.replaceState(null, document.title, finalNewUrl);
  }
}

// 在应用初始化时执行重定向处理
handleGitHubPagesRedirect();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
