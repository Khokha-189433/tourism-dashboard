import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./localTrans/Ar.json";
import en from "./localTrans/En.json";

const savedLang = localStorage.getItem("lang") || "ar";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;