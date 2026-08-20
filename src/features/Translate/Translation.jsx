import React from 'react'

const isArabic = () => {
    // كشف اللغة: يعيد true إذا كانت الواجهة بالعربية

  try {
    const stored = localStorage.getItem("lang") || localStorage.getItem("i18nextLng");
    if (stored) return stored.startsWith("ar");
    if (typeof document !== "undefined" && document.documentElement?.lang) {
      return document.documentElement.lang.startsWith("ar");
    }
    return typeof navigator !== "undefined" && navigator.language && navigator.language.startsWith("ar");
  } catch (e) {
    console.error("Error detecting language:", e);
    return false;
  }
}

export default isArabic


