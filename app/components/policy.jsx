"use client";
import React from "react";

export default function Policy({ t }) {
  if (!t) return null;

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">
          {t.privacy}
        </h1>
        <div className="space-y-8 text-gray-600 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{t.policyTitle1 || "Сбор информации"}</h2>
            <p>{t.policyText1 || "Мы собираем минимально необходимое количество данных для обеспечения качественной работы сервиса FastAndTrust."}</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{t.policyTitle2 || "Безопасность"}</h2>
            <p>{t.policyText2 || "Ваша конфиденциальность является нашим приоритетом. Мы используем современные методы шифрования для защиты данных."}</p>
          </section>
          <div className="pt-10 border-t border-gray-100">
            <p className="text-xs text-gray-400">Последнее обновление: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}