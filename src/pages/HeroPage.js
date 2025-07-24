import React from 'react';

const HeroPage = () => {
  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-purple-100 py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Sol içerik */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
            En Özel Gününüzü<br className="hidden md:block" />
            <span className="text-pink-500">Dijitale Taşıyın</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Sevdikleriniz size mesajlar yazsın, fotoğraflar paylaşsın, videonuzu izlesin.
            Hepsi bir QR kodla sayfanızda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href='/mehmetayse'>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow">
              Demo Sayfasını Gör
            </button>
            </a>
            <a href="/auth">            
            <button className="bg-white hover:bg-gray-100 text-pink-500 font-medium py-3 px-6 rounded-xl border border-pink-500 shadow">
              Hemen Başla
            </button>
            </a>
            <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow"
          >
            Nasıl Çalışır?
          </button>
          </div>
        </div>

        {/* Sağ içerik - mockup */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-[300px] h-[600px] bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            {/* Buraya örnek sayfa ekran görüntüsü veya animasyon ekleyebilirsin */}
            <img
              src="https://res.cloudinary.com/dyodwyfu4/image/upload/v1753393079/Untitled_design_2_kxxy0k.png"
              alt="Etkinlik Önizleme"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroPage;
