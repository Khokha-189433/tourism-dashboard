import React, { useEffect, useState } from "react";

/**
 *  مكون عدّاد متحرك
 * يجعل الرقم يصعد من 0 إلى القيمة النهائية بشكل جميل
 * 
 * Props:
 * - value: الرقم النهائي
 * - duration: مدة الحركة بالمللي ثانية
 */
export default function CountUp({ value = 0, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const target = parseFloat(value) || 0;

  useEffect(() => {
    let current = 0;
    const steps = 45;                 // عدد خطوات الحركة
    const stepValue = target / steps; // مقدار الزيادة في كل خطوة

    const timer = setInterval(() => {
      current += stepValue;

      if (current >= target) {
        setDisplay(target);        // وصلنا للنهاية
        clearInterval(timer);      // أوقف العدّاد
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);

    // تنظيف عند إغلاق المكون
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{display.toLocaleString()}</span>;
}