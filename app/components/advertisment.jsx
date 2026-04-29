"use client";
import React from "react";

export default function Advertisment({ t }) {
  if (!t) return null;

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-indigo-600 mb-6 tracking-tight">
          {t.ads}
        </h1>
        <p className="text-gray-500 text-lg mb-12">
          {t.adsSubtitle || "Продвигайте свои услуги в Баку вместе с FastAndTrust"}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-gray-100 rounded-3xl bg-slate-50 hover:border-indigo-200 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl mb-6 flex items-center justify-center text-white font-bold">1</div>
            <h3 className="text-xl font-bold mb-4">{t.premiumPlacement || "Премиум размещение"}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t.premiumPlacementDesc || "Ваше объявление будет закреплено в топе списка и выделено специальным бейджем."}</p>
          </div>
          <div className="p-8 border border-gray-100 rounded-3xl bg-slate-50 hover:border-indigo-200 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-2xl mb-6 flex items-center justify-center text-white font-bold">2</div>
            <h3 className="text-xl font-bold mb-4">{t.socialAds || "Социальные сети"}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t.socialAdsDesc || "Рассылка и упоминание в наших официальных каналах WhatsApp и TikTok."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}