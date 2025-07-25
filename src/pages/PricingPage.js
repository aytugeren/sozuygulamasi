import React from 'react';

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="w-full bg-white py-20 px-4 sm:px-6 lg:px-24 scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Tamamen Ücretsiz Kullanın
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Tüm özellikler ücretsizdir. Eğer projeyi beğendiyseniz ve destek olmak isterseniz aşağıdan bağış yapabilirsiniz.
        </p>

        <div className="grid md:grid-cols-2 gap-8 justify-center">
          {/* Ücretsiz Plan */}
          <div className="border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Ücretsiz</h3>
            <p className="text-4xl font-bold text-pink-500 mb-4">₺0</p>
            <ul className="text-gray-700 text-left space-y-2 mb-6">
              <li>✔️ Sınırsız etkinlik sayfası</li>
              <li>✔️ Slug seçimi (ornek.com/ayse-mehmet)</li>
              <li>✔️ Fotoğraf ve mesaj paylaşımı</li>
              <li>✔️ Video ekleme</li>
              <li>✔️ Yedekleme ve destek</li>
            </ul>
            <span className="text-green-600 font-semibold">Tüm özellikler ücretsiz!</span>
          </div>

          {/* Destek Ol */}
          <div className="border-2 border-yellow-400 rounded-2xl shadow-md p-8 flex flex-col items-center bg-yellow-50">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Bize Destek Ol</h3>
            <p className="text-lg text-gray-700 mb-4">
              Proje tamamen ücretsizdir. Gelişime katkı sağlamak için bağış yapabilirsiniz.
            </p>
            <a
              href="https://coff.ee/erenevimmd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 px-8 rounded-xl shadow text-lg transition"
            >
              ☕ Bize Destek Ol
            </a>
            <span className="text-xs text-gray-500 mt-4">Bağışlarınız için teşekkürler!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;