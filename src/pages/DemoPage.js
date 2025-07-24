import React from 'react';

const DemoPages = () => {
  const demos = [
    {
      name: 'Burcu & Fatih',
      url: '/burcu-fatih',
      image: '/demo1.png',
    },
    {
      name: 'Elif & Mert',
      url: '/elif-mert',
      image: '/demo2.png',
    },
    {
      name: 'Senin Sayfan',
      url: '/demo',
      image: '/demo3.png',
    },
  ];

  return (
    <section
      id="demo-pages"
      className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-24 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Örnek Etkinlik Sayfaları
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Gerçek kullanıcı sayfalarını görmek için tıklayın veya kendinize ait olanı oluşturun.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {demos.map((demo, index) => (
            <a
              key={index}
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 overflow-hidden"
            >
              <img
                src={demo.image}
                alt={demo.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{demo.name}</h3>
                <p className="text-sm text-pink-500">Sayfayı Gör →</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoPages;
