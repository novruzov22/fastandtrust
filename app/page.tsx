'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase"; // Импортируем db из нашего файла firebase.ts
import { collection, getDocs } from "firebase/firestore"; // Импортируем функции Firestore
import Footer from "@/app/components/Footer"; 
import Policy from "@/app/components/policy";
import Advertisment from "@/app/components/advertisment";
import SearchBar from "@/app/searchBar/SearchBar"; // Импортируем компонент SearchBar
import AdvertismentBar from "@/app/adavertismentBar/advertismentBar";

// Типизация товара для Firebase
interface Product {
  id: string;
  name: { az: string; ru: string };
  price: number;
  description: { az: string; ru: string }; // Добавили описание
  images: string[]; // Массив фото как ты и просил
}

export default function Home() {
  const [lang, setLang] = useState<'az' | 'ru'>('az');
  const [activeImage, setActiveImage] = useState<{ [key: string]: number }>({});
  const [products, setProducts] = useState<Product[]>([]); // Состояние для хранения загруженных товаров
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Состояние для модального окна
  const [searchTerm, setSearchTerm] = useState(''); // Состояние для поискового запроса
  const [loading, setLoading] = useState(true); // Состояние загрузки для товаров
  const [visibleCount, setVisibleCount] = useState(6); // Лимит отображения товаров для плавности
  const [view, setView] = useState<'home' | 'about' | 'ads' | 'privacy'>('home'); // Управление разделами

  // Контент для локализации (возвращаем внутрь для стабильности дизайна)
  const content = {
    az: {
      heroTitle: "FastAndTrust - Keyfiyyət və Etibar",
      heroSub: "Bakıda ən sərfəli və sürətli alış-veriş",
      currency: "₼",
      order: "Sifariş et",
      products: "Məhsullarımız",
      loadMore: "Daha çox",
      privacy: "Məxfilik siyasəti",
      ads: "Reklam",
      about: "Haqqımızda",
      footerDesc: "FastAndTrust Baku — Keyfiyyətli məhsullar və etibarlı xidmətin ünvanı. Müştəri məmnuniyyəti bizim prioritetimizdir.",
      followUs: "Bizi izləyin",
      back: "Geri qayıtmaq",
      aboutContent: "FastAndTrust 2024-cü ildən Bakıda fəaliyyət göstərir. Bizim məqsədimiz müştərilərimizə ən keyfiyyətli məhsulları ən sürətli şəkildə çatdırmaqdır.",
      adsContent: "Reklam və əməkdaşlıq üçün bizimlə əlaqə saxlayın: info@fastandtrust.az",
      privacyContent: "Biz sizin məlumatlarınızın təhlükəsizliyinə zəmanət veririk. Bütün məlumatlar Azərbaycan qanunvericiliyinə uyğun qorunur.",
      policyTitle1: "Məlumatların toplanması",
      tiktokUrl: "https://tiktok.com/@fastandtrustoficcial",
      whatsappUrl: "https://wa.me/994773117228",
      policyText1: "Biz FastAndTrust xidmətinin keyfiyyətli işini təmin etmək üçün minimum zəruri məlumatları toplayırıq.",
      policyTitle2: "Təhlükəsizlik",
      policyText2: "Sizin məxfiliyiniz bizim prioritetimizdir. Məlumatların qorunması üçün müasir şifrələmə üsullarından istifadə edirik.",
      adsSubtitle: "Bakıda xidmətlərinizi FastAndTrust ilə təbliğ edin",
      premiumPlacement: "Premium yerləşdirmə",
      premiumPlacementDesc: "Elanınız siyahının başında bərkidiləcək və xüsusi nişanla vurğulanacaq.",
      adImage: "https://via.placeholder.com/800x400?text=Your+Ad+Here+AZ", // Placeholder for advertisement image
      socialAds: "Sosial şəbəkələr",
      socialAdsDesc: "WhatsApp və TikTok rəsmi kanallarımızda göndəriş və qeyd.",
    },
    ru: {
      heroTitle: "FastAndTrust - Качество и Доверие",
      heroSub: "Самые выгодные и быстрые покупки в Баку",
      currency: "₼",
      order: "Заказать",
      products: "Наши товары",
      loadMore: "Показать еще",
      privacy: "Политика конфиденциальности",
      ads: "Реклама",
      about: "О нас",
      footerDesc: "FastAndTrust Baku — Ваш надежный партнер в мире качественных товаров. Мы ценим доверие каждого клиента.",
      followUs: "Подписывайтесь на нас",
      back: "Вернуться назад",
      aboutContent: "FastAndTrust работает в Баку с 2024 года. Наша цель — предоставлять клиентам самые качественные товары в кратчайшие сроки.",
      adsContent: "По вопросам рекламы и сотрудничества пишите нам: info@fastandtrust.az",
      privacyContent: "Мы гарантируем безопасность ваших данных. Вся информация защищена в соответствии с законодательством Азербайджана.",
      policyTitle1: "Сбор информации",
      tiktokUrl: "https://tiktok.com/@fastandtrustoficcial",
      whatsappUrl: "https://wa.me/994773117228",
      policyText1: "Мы собираем минимально необходимое количество данных для обеспечения качественной работы сервиса FastAndTrust.",
      policyTitle2: "Безопасность",
      policyText2: "Ваша конфиденциальность является нашим приоритетом. Мы используем современные методы шифрования для защиты данных.",
      adsSubtitle: "Продвигайте свои услуги в Баку вместе с FastAndTrust",
      premiumPlacement: "Премиум размещение",
      premiumPlacementDesc: "Ваше объявление будет закреплено в топе списка и выделено специальным бейджем.",
      adImage: "https://via.placeholder.com/800x400?text=Your+Ad+Here+RU", // Placeholder for advertisement image
      socialAds: "Социальные сети",
      socialAdsDesc: "Рассылка и упоминание в наших официальных каналах WhatsApp и TikTok.",
    }
  };

  const t = content[lang];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const currentIdx = activeImage[selectedProduct.id] || 0;
    setActiveImage(prev => ({ ...prev, [selectedProduct.id]: (currentIdx + 1) % selectedProduct.images.length }));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const currentIdx = activeImage[selectedProduct.id] || 0;
    setActiveImage(prev => ({ ...prev, [selectedProduct.id]: (currentIdx - 1 + selectedProduct.images.length) % selectedProduct.images.length }));
  };

  // Загрузка товаров из Firebase при монтировании компонента
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const querySnapshot = await getDocs(productsCollectionRef);
        const productsData: Product[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          // Вспомогательная функция для гибкой обработки полей с переводами
          const getVal = (val: string | { az?: string; ru?: string } | undefined | null, fallbackAz: string, fallbackRu: string): { az: string; ru: string } => {
            if (typeof val === 'string') return { az: val, ru: val };
            if (val && typeof val === 'object') {
              return {
                az: val.az || val.ru || fallbackAz,
                ru: val.ru || val.az || fallbackRu
              };
            }
            return { az: fallbackAz, ru: fallbackRu };
          };

          return {
            id: doc.id,
            name: getVal(data.name, 'Ad yoxdur', 'Название отсутствует'),
            description: getVal(data.description, 'Təsvir yoxdur', 'Описание отсутствует'),
            price: Number(data.price) || 0,
            images: Array.isArray(data.images) && data.images.length > 0
                    ? data.images as string[]
                    : ['https://via.placeholder.com/400x500?text=No+Image'],
          };
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Ошибка при загрузке товаров из Firebase:", error);
        // Можно добавить обработку ошибок, например, показать сообщение пользователю
      }
    };

    fetchProducts();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  // Функция для перезагрузки всех товаров из Firebase
  const refreshProducts = async () => {
    setLoading(true);
    try {
      const productsCollectionRef = collection(db, "products");
      const querySnapshot = await getDocs(productsCollectionRef);
      const productsData: Product[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        
        const getVal = (val: string | { az?: string; ru?: string } | undefined | null, fallbackAz: string, fallbackRu: string): { az: string; ru: string } => {
          if (typeof val === 'string') return { az: val, ru: val };
          if (val && typeof val === 'object') {
            return {
              az: val.az || val.ru || fallbackAz,
              ru: val.ru || val.az || fallbackRu
            };
          }
          return { az: fallbackAz, ru: fallbackRu };
        };

        return {
          id: doc.id,
          name: getVal(data.name, 'Ad yoxdur', 'Название отсутствует'),
          description: getVal(data.description, 'Təsvir yoxdur', 'Описание отсутствует'),
          price: Number(data.price) || 0,
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images as string[] : ['https://via.placeholder.com/400x500?text=No+Image'],
        };
      });
      setProducts(productsData);
      setVisibleCount(6); // Сбросить количество видимых товаров
      setSearchTerm(''); // Очистить поисковый запрос
    } catch (error) {
      console.error("Ошибка при обновлении товаров из Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для обработки изменения поискового запроса
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Сброс visibleCount при изменении поискового запроса
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm]);

  // Фильтрация товаров на основе поискового запроса
  const filteredProducts = products.filter(product => product.name[lang].toLowerCase().startsWith(searchTerm.toLowerCase()) || product.name[lang].toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <main className="min-h-screen pb-72"> {/* Добавлен padding-bottom для учета высоты фиксированного футера */}
      {/* Навигация */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span 
            className="text-2xl font-black tracking-tighter text-indigo-600 cursor-pointer"
            onClick={() => setView('home')}
          >
            FastAndTrust
          </span>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('privacy')} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">{t.privacy}</button>
            <button onClick={() => setView('ads')} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">{t.ads}</button>
            <button onClick={() => setView('about')} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">{t.about}</button>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setLang(lang === 'az' ? 'ru' : 'az')}
              className="px-4 py-2 rounded-full bg-gray-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors"
            >
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </nav>

      {view === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Fast<span className="text-indigo-600">And</span>Trust
              </h1>
              <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium">
                {t.heroTitle} — {t.heroSub}
              </p>
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchChange} 
                lang={lang}
                className="mt-10 w-full max-w-md mx-auto px-6 py-3 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" // Добавлены стили для видимости
              />
            </div>
          </section>

          {/* Сетка товаров */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Основная часть с товарами */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">{t.products}</h2>
                  <div className="h-1 flex-grow ml-6 bg-gradient-to-r from-indigo-100 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <div 
                      key={product.id} 
                      className="group flex flex-col cursor-pointer bg-slate-100/60 p-5 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-600 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white mb-5 shadow-inner">
                        <Image
                          src={product.images[activeImage[product.id] || 0]}
                          alt={product.name[lang]}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Переключатель фото (точки) */}
                        {product.images.length > 1 && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                            {product.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation(); // Чтобы не открывалась модалка при клике на точку
                                  setActiveImage(prev => ({ ...prev, [product.id]: idx }));
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  (activeImage[product.id] || 0) === idx ? "bg-white w-4" : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="px-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name[lang]}</h3>
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-indigo-600">
                            {product.price} <span className="text-sm ml-0.5">{t.currency}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Кнопка подгрузки */}
                {visibleCount < filteredProducts.length && (
                  <div className="flex justify-center mt-20">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="px-14 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 uppercase tracking-[0.2em] text-sm active:scale-95"
                    >
                      {t.loadMore}
                    </button>
                  </div>
                )}
              </div>

              {/* Правая колонка с рекламой */}
              <aside className="lg:w-80 shrink-0">
                <AdvertismentBar lang={lang} />
              </aside>
            </div>
          </section>
        </>
      ) : (
        <div className="relative min-h-screen">
          <button 
            onClick={() => setView('home')}
            className="absolute top-28 left-4 md:left-10 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-indigo-600 font-bold hover:bg-indigo-50 transition-all border border-indigo-100"
          >
            ← {t.back}
          </button>
          
          {view === 'about' && (
            <section className="max-w-4xl mx-auto px-4 py-32 min-h-[60vh]">
              <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tight">{t.about}</h2>
              <div className="text-xl text-gray-600 leading-relaxed bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">{t.aboutContent}</div>
            </section>
          )}
          {view === 'ads' && <Advertisment t={t} />}
          {view === 'privacy' && <Policy t={t} />}
        </div>
      )}

      <Footer t={t} setView={setView} />

      {/* Модальное окно (Быстрый просмотр) */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-[3rem] max-w-6xl w-full max-h-[95vh] md:h-[80vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl text-gray-900 hover:scale-110 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Левая часть: Изображение */}
            <div className="md:w-2/3 relative h-[40vh] sm:h-[50vh] md:h-full bg-slate-50 flex items-center justify-center group/modal">
              <Image
                src={selectedProduct.images[activeImage[selectedProduct.id] || 0]}
                alt={selectedProduct.name[lang]}
                fill
                className="object-contain p-6 md:p-16 transition-all duration-500"
              />

              {/* Стрелки навигации */}
              {selectedProduct.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-6 p-4 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-indigo-600 opacity-0 group-hover/modal:opacity-100 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform -translate-x-4 group-hover/modal:translate-x-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-6 p-4 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-indigo-600 opacity-0 group-hover/modal:opacity-100 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-x-4 group-hover/modal:translate-x-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Точки переключения в модалке */}
              {selectedProduct.images.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                  {selectedProduct.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(prev => ({ ...prev, [selectedProduct.id]: idx }))}
                      className={`w-2 h-2 rounded-full transition-all ${
                        (activeImage[selectedProduct.id] || 0) === idx ? "bg-indigo-600 w-6" : "bg-indigo-200"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Правая часть: Инфо */}
            <div className="p-4 sm:p-6 md:p-10 lg:p-16 md:w-1/3 flex flex-col justify-between bg-white border-l border-slate-100">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 leading-[1.1]">
                  {selectedProduct.name[lang]}
                </h2>
                <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-600">{selectedProduct.price}</span>
                  <span className="text-xl font-bold text-gray-400">{t.currency}</span>
                </div>

                {/* Блок описания */}
                <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {selectedProduct.description[lang]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}