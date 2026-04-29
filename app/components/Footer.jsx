"use client";

import React from 'react';

export default function Footer({ t, setView }) {
  const handleViewChange = (newView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Бренд и Описание */}
          <div className="space-y-6">
            <span 
              className="text-2xl font-black tracking-tighter text-indigo-600 cursor-pointer"
              onClick={() => handleViewChange('home')}
            >
              FastAndTrust
            </span>
            <p className="text-gray-500 leading-relaxed max-w-sm text-sm">
              {t.footerDesc}
            </p>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">{t.about}</h4>
            <ul className="space-y-4">
              <li><button onClick={() => handleViewChange('privacy')} className="text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium">{t.privacy}</button></li>
              <li><button onClick={() => handleViewChange('ads')} className="text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium">{t.ads}</button></li>
              <li><button onClick={() => handleViewChange('about')} className="text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium">{t.about}</button></li>
            </ul>
          </div>

          {/* Социальные сети */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">{t.followUs}</h4>
            <div className="flex gap-4"> 
              {/* WhatsApp */}
              <a 
                href={t.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.63 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a 
                href="https://tiktok.com/@fastandtrustoficcial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.35-2.43-.2-3.41.49-.71.51-1.11 1.28-1.25 2.15-.15.93.1 1.93.7 2.65.65.82 1.68 1.22 2.67 1.12 1.18-.08 2.22-.88 2.73-1.94.13-.26.21-.54.23-.83.05-2.73.01-5.46.01-8.2 0-3.32.01-6.64-.01-9.96z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-medium">
            © {new Date().getFullYear()} FastAndTrust Baku. Bütün hüquqlar qorunur.
          </p>
          <div className="flex gap-6 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Premium Service in Baku</span>
          </div>
        </div>
      </div>
    </footer>
  );
}