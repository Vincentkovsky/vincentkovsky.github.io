import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/translation.json";
import zhTranslation from "../locales/zh/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

// 获取浏览器语言
const getBrowserLanguage = () => {
  const browserLang = navigator.language || (navigator as any).userLanguage;
  // 如果浏览器语言以'zh'开头（如zh-CN, zh-TW等），返回'zh'，否则返回'en'
  return browserLang && browserLang.toLowerCase().startsWith("zh") ? "zh" : "en";
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(), // 设置初始语言为浏览器语言
    fallbackLng: "en",
    detection: {
      order: ["navigator", "localStorage", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
