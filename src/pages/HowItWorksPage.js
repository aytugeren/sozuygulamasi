import React from 'react';
import { FaUserEdit, FaQrcode, FaGift } from 'react-icons/fa';

const HowItWorksPage = () => {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 w-full bg-white py-20 px-4 sm:px-6 lg:px-24 border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          3 Adımda Kendi Etkinlik Sayfanı Oluştur
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Dakikalar içinde kendi özel sayfanı oluştur ve sevdiklerinle paylaş.
        </p>

        <div className="grid md:grid-cols-3 gap-12 md:gap-20">
          {/* Adım 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-pink-100 text-pink-600 p-4 rounded-full text-3xl mb-4 shadow-md">
              <FaUserEdit />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Sayfanı Özelleştir</h3>
            <p className="text-gray-600 max-w-xs">
              İsimleri, başlığı, arka plan görselini ve slug adresini belirle.
            </p>
          </div>

          {/* Adım 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-full text-3xl mb-4 shadow-md">
              <FaQrcode />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. QR Kodunu Paylaş</h3>
            <p className="text-gray-600 max-w-xs">
              Oluşturduğun sayfanın linkini QR kodla davetiyene veya afişine ekle.
            </p>
          </div>

          {/* Adım 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 text-green-600 p-4 rounded-full text-3xl mb-4 shadow-md">
              <FaGift />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Anılar Toplansın</h3>
            <p className="text-gray-600 max-w-xs">
              Katılımcılar fotoğraf paylaşsın, mesaj bıraksın, videonu izlesin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPage;
