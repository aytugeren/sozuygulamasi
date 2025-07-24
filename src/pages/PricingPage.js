import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="w-full bg-white py-20 px-4 sm:px-6 lg:px-24 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Sizin İçin Uygun Planı Seçin
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Ücretsiz başlayın, daha fazla özellik için Pro’ya geçin.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ücretsiz Plan */}
          <div className="border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Ücretsiz</h3>
            <p className="text-4xl font-bold text-pink-500 mb-4">₺0</p>
            <ul className="text-gray-700 text-left space-y-2 mb-6">
              <li>✔️ 1 etkinlik sayfası</li>
              <li>✔️ Slug seçimi (ornek.com/ayse-mehmet)</li>
              <li>✔️ Fotoğraf ve mesaj paylaşımı</li>
              <li>❌ Video ekleme</li>
              <li>❌ Özel alan adı</li>
              <li>❌ Yedekleme desteği</li>
            </ul>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-xl shadow">
              Hemen Başla
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-pink-500 rounded-2xl shadow-md p-8 flex flex-col items-center bg-pink-50">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Pro</h3>
            <p className="text-4xl font-bold text-pink-600 mb-4">₺89</p>
            <ul className="text-gray-700 text-left space-y-2 mb-6">
              <li>✔️ Tüm ücretsiz özellikler</li>
              <li>✔️ Video ekleme alanı</li>
              <li>✔️ Özel alan adı (seninseygünüm.com)</li>
              <li>✔️ 5 adede kadar sayfa oluşturma</li>
              <li>✔️ Yedekleme ve destek</li>
            </ul>
            <button onClick={() => navigate('/pro-odeme')} className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-xl shadow">
              Pro’ya Geç
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;