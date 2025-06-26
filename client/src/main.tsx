import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import i18n from "./lib/i18n"; // 直接导入i18n实例
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

// 处理URL中的语言参数
function handleLanguageParam() {
  const url = new URL(window.location.href);
  const langParam = url.searchParams.get("lang");

  if (langParam && (langParam === "en" || langParam === "zh")) {
    console.log(`Setting language from URL parameter: ${langParam}`);
    i18n.changeLanguage(langParam);
    // 可选：从URL中移除语言参数
    // url.searchParams.delete("lang");
    // window.history.replaceState(null, document.title, url.toString());
  }
}

// 在应用初始化时执行重定向处理和语言处理
handleGitHubPagesRedirect();
handleLanguageParam();

// 包装应用组件以处理语言变化
const AppWithLanguageHandling = () => {
  useEffect(() => {
    // 监听语言变化，可以在这里执行额外操作
    const handleLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng;
      console.log(`Language changed to: ${lng}`);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    // 设置初始语言
    document.documentElement.lang = i18n.language;

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithLanguageHandling />
  </React.StrictMode>
);
