import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import i18n from "./i18n";

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 获取浏览器语言
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language || (navigator as any).userLanguage;
  // 如果浏览器语言以'zh'开头（如zh-CN, zh-TW等），返回'zh'，否则返回'en'
  return browserLang && browserLang.toLowerCase().startsWith("zh") ? "zh" : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(i18n.language || getBrowserLanguage() || "en");

  useEffect(() => {
    // 初始化时设置语言
    const detectedLanguage = getBrowserLanguage();
    if (detectedLanguage && i18n.language !== detectedLanguage) {
      i18n.changeLanguage(detectedLanguage);
    }

    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
