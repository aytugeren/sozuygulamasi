import React, { useState } from 'react';

const faqs = [
  {
    question: 'Fotoğraf ve mesajları kimler görebilir?',
    answer: 'Etkinlik sayfanıza gelen tüm ziyaretçiler paylaşılan fotoğraf ve mesajları görebilir. Dilerseniz bu alanları kapatabilirsiniz.',
  },
  {
    question: 'QR kodu nasıl oluşturuyorum?',
    answer: 'Etkinlik sayfanızı oluşturduktan sonra otomatik olarak sizin için bir QR kod hazırlanır. Bu kodu davetiyenize ekleyebilir ya da sosyal medyada paylaşabilirsiniz.',
  },
  {
    question: 'Video ne kadar uzun olabilir?',
    answer: 'Pro plan kullanıcıları 200MB’a kadar video yükleyebilir. Daha büyük videolar için destek ekibimizle iletişime geçebilirsiniz.',
  },
  {
    question: 'Etkinlik sayfam ne kadar süre yayında kalır?',
    answer: 'Sayfalarınız 3 ay boyunca aktif kalır. Eğer uzun süreli bir sayfa istiyorsanız bizimle iletişime geçebilirsiniz.',
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-24 scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Sık Sorulan Sorular
        </h2>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-white rounded-xl shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-medium text-gray-800"
              >
                {faq.question}
                <span className="text-pink-500 text-xl">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
