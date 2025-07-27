import React from 'react';

const CookiePolicyPage = () => (
  <div className="max-w-2xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Çerez Politikası</h1>
    <p className="mb-2">
      Davetlilerinizle dijital anılarınızı paylaşırken, web sitemizin sorunsuz ve kişiselleştirilmiş çalışmasını sağlamak için çerezlerden faydalanıyoruz.
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">Çerez Nedir?</h2>
    <p className="mb-2">
      Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınızda saklanan küçük veri dosyalarıdır. Bu dosyalar sayesinde; sayfa ayarlarınız, kullanıcı giriş bilgileriniz ve paylaşım geçmişiniz gibi veriler hatırlanabilir.
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">Hangi Çerezleri Kullanıyoruz?</h2>
    <ul className="list-disc ml-6 mb-2">
      <li><strong>Oturum Çerezleri:</strong> Etkinliğe giriş yaptıktan sonra sizi tanımamıza yardımcı olur.</li>
      <li><strong>Analitik Çerezler:</strong> Hangi sayfaların daha çok ziyaret edildiğini anlamamıza ve hizmetimizi geliştirmemize destek olur (anonim olarak).</li>
      <li><strong>Tercih Çerezleri:</strong> Kullanıcı olarak tercih ettiğiniz dil, görünüm gibi seçenekleri hatırlarız.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-4 mb-2">Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
    <p className="mb-2">
      Tarayıcınızın ayarları üzerinden çerezleri silebilir veya devre dışı bırakabilirsiniz. Ancak bu, bazı özelliklerin (örneğin fotoğraf yükleme, mesaj gönderme) beklendiği gibi çalışmamasına neden olabilir.
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">Daha Fazla Bilgi</h2>
    <p>
      Çerez kullanımımız hakkında detaylı bilgi almak ya da gizlilikle ilgili sorularınızı iletmek isterseniz <a href="mailto:destek@davetly.com" className="text-blue-500 underline">destek@davetly.com</a> adresinden bize ulaşabilirsiniz.
    </p>
  </div>
);

export default CookiePolicyPage;
