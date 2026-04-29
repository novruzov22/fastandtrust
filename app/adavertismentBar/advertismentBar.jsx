"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

export default function AdvertismentBar({ lang }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        // Предполагаем, что в Firebase есть коллекция "ads"
        const adsRef = collection(db, "ads");
        const q = query(adsRef, limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          // FirebaseError: Missing or insufficient permissions. Убедитесь, что правила безопасности Firebase разрешают чтение коллекции 'ads'.
          setAd({
            id: querySnapshot.docs[0].id,
            ...data
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке рекламы:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, []);

  if (loading || !ad) return null;

  const label = lang === 'az' ? 'REKLAM' : 'РЕКЛАМА';

  return (
    <div className="sticky top-24 w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-1">
      {/* Обязательная подпись сверху */}
      <div className="bg-slate-50/50 px-6 py-2.5 border-b border-gray-50 flex justify-between items-center">
        <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
          {label}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
      </div>

      <div className="p-5">
        {/* Фото (квадратное или прямоугольное через aspect-ratio) */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden mb-5 bg-slate-50 border border-gray-50 shadow-inner">
          <Image
            src={(Array.isArray(ad.image) && ad.image.length > 0 ? ad.image[0] : ad.image) || "https://via.placeholder.com/400"}
            alt="Advertisement"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </div>

        {/* Текстовое описание */}
        <div className="space-y-3 px-1">
          <h4 className="text-xl font-black text-gray-900 leading-tight">
            {ad.title?.[lang] || ad.title || "FastAndTrust Premium"}
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            {ad.description?.[lang] || ad.description || "Ваше рекламное предложение здесь."}
          </p>
        </div>
      </div>
    </div>
  );
}