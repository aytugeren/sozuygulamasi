// filepath: [HeroPage.js](http://_vscodecontentref_/0)
import React, { useState, useEffect } from 'react';
import DraggableText from '../components/DraggableText';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../databases/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import FontSelector from '../components/FontSelector';
import { getAuthErrorMessage } from '../utils/authErrors';
import { isPasswordValid } from '../utils/validation';
import { BACKGROUND_TEMPLATES } from '../utils/backgroundTemplates';

const HeroPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Sayfa oluşturma formu state'leri
  const [showPageForm, setShowPageForm] = useState(false);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [altText, setAltText] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [slugExists, setSlugExists] = useState(false);
  const [slugMessage, setSlugMessage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [bgFile, setBgFile] = useState(null);
  const [bgPreview, setBgPreview] = useState('');
  const [bgUploading, setBgUploading] = useState(false);
  
  // Font ve renk state'leri
  const [titleFont, setTitleFont] = useState('romantic');
  const [titleColor, setTitleColor] = useState('#333333');
  const [subtitleFont, setSubtitleFont] = useState('modern');
  const [subtitleColor, setSubtitleColor] = useState('#555555');
  const [altFont, setAltFont] = useState('modern');
  const [altColor, setAltColor] = useState('#888888');
  const [subtitlePos, setSubtitlePos] = useState({ x: 0, y: 0 });
  const [titlePos, setTitlePos] = useState({ x: 0, y: 0 });
  const [altPos, setAltPos] = useState({ x: 0, y: 0 });
  
  // QR Kod ve paylaşım state'leri
  const [showQRModal, setShowQRModal] = useState(false);
  const [createdPageUrl, setCreatedPageUrl] = useState('');
  const [previewMode, setPreviewMode] = useState('mobile');

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const forbiddenExt = ['exe', 'bat', 'js', 'sh', 'php', 'py', 'pl', 'rb', 'jar'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (forbiddenExt.includes(ext) || !allowedTypes.includes(file.type)) {
      alert('Yalnızca resim dosyaları yükleyebilirsiniz.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\u0027ı geçemez.');
      return;
    }

    setBgFile(file);
    setBgPreview(URL.createObjectURL(file));
  };

  const uploadBackground = async () => {
    if (!bgFile) {
      toast.error('Lütfen bir dosya seçin');
      return;
    }
    setBgUploading(true);
    const data = new FormData();
    const fileName = bgFile.name.replace(/\s+/g, '-');
    const cloudinaryName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    data.append('file', bgFile);
    data.append('upload_preset', 'soz-uygulamasi');
    data.append('public_id', `${user.uid}/background-${Date.now()}-${fileName}`);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.secure_url) {
        setBackgroundImage(result.secure_url);
        setBgPreview(result.secure_url);
        setBgFile(null);
        toast.success('Arka plan yüklendi!');
      } else {
        toast.error('Yükleme başarısız oldu');
      }
    } catch (err) {
      console.error('Cloudinary upload failed', err);
      toast.error('Yükleme sırasında hata oluştu');
    } finally {
      setBgUploading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && showModal) {
        setShowPageForm(true);
      } else if (showModal) {
        setShowPageForm(false);
      }
    });
    return () => unsubscribe();
  }, [showModal]);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      toast.error(
        'Şifre en az bir büyük harf, bir küçük harf ve bir noktalama işareti içermelidir.'
      );
      return;
    }

    setLoading(true);
    
    try {
      // Önce giriş yapmayı dene
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Giriş başarılı!');
      } catch (loginError) {
        // Giriş başarısızsa hesap oluştur
        if (
          loginError.code === 'auth/user-not-found' ||
          loginError.code === 'auth/invalid-login-credentials' ||
          loginError.code === 'auth/invalid-credential'
        ) {
          await createUserWithEmailAndPassword(auth, email, password);
          toast.success('Hesap oluşturuldu!');
        } else {
          throw loginError;
        }
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const createSlug = async (value) => {
    if (!value) {
      setSlugExists(false);
      setSlugMessage('');
      return;
    }

    const slugRef = doc(db, 'slugs', value);
    const slugDoc = await getDoc(slugRef);
    
    if (slugDoc.exists()) {
      setSlugExists(true);
      setSlugMessage('Bu slug zaten kullanılıyor!');
    } else {
      setSlugExists(false);
      setSlugMessage('Bu slug kullanılabilir!');
    }
  };

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z-]/g, '');
    setSlug(value);
    createSlug(value);
  };

  const handleCreatePage = async () => {
    if (!slug || !user) return;

    if (slugExists) {
      toast.error('Bu slug zaten kullanılıyor!');
      return;
    }

    setLoading(true);
    
    try {
      // Slug'ı kaydet
      await setDoc(doc(db, 'slugs', slug), {
        userId: user.uid,
        createdAt: new Date()
      });

      // Sayfa bilgilerini kaydet
      await setDoc(doc(db, 'users', user.uid, 'pages', slug), {
        slug,
        title: title || 'Hoş Geldiniz',
        subtitle: subtitle || 'Özel gününüzü kutluyoruz',
        altText: altText || 'Teşekkürler',
        videoLink: videoLink || '',
        backgroundImage: backgroundImage || '',
        createdAt: new Date(),
        titleFont,
        titleColor,
        subtitleFont,
        subtitleColor,
        altFont,
        altColor,
        subtitlePos,
        titlePos,
        altPos
      });

      // Kullanıcıyı initialized olarak işaretle
      await setDoc(doc(db, 'users', user.uid), { initialized: true }, { merge: true });

      // QR Kod modal'ını göster
      const pageUrl = `${window.location.origin}/${slug}`;
      setCreatedPageUrl(pageUrl);
      setShowQRModal(true);
      setShowModal(false);
      
      toast.success('Sayfa başarıyla oluşturuldu!');
    } catch (error) {
      toast.error('Sayfa oluşturulurken hata oluştu!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPageForm(false);
    setEmail('');
    setPassword('');
    setSlug('');
    setTitle('');
    setSubtitle('');
    setAltText('');
    setSubtitlePos({ x: 0, y: 0 });
    setTitlePos({ x: 0, y: 0 });
    setAltPos({ x: 0, y: 0 });
    setVideoLink('');
    setSlugExists(false);
    setSlugMessage('');
    // Font ve renk state'lerini sıfırla
    setTitleFont('romantic');
    setTitleColor('#333333');
    setSubtitleFont('sans');
    setSubtitleColor('#555555');
    setAltFont('sans');
    setAltColor('#888888');
    setBackgroundImage('');
    setBgPreview('');
    setBgFile(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Özel Sayfam',
          text: 'Özel sayfama göz atın!',
          url: createdPageUrl,
        });
      } catch (error) {
        toast.error('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: URL'yi panoya kopyala
      navigator.clipboard.writeText(createdPageUrl);
      toast.success('URL panoya kopyalandı!');
    }
  };

  const handleGoToDashboard = () => {
    setShowQRModal(false);
    navigate('/dashboard');
  };

  return (
    <>
      <section className="bg-gradient-to-br from-pink-50 via-white to-purple-100 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Sol içerik */}
          <div className="md:w-1/2 text-left">
            <h2
              className="text-5xl md:text-6xl font-bold mb-2"
              style={{
                color: '#ec4899',
                fontFamily: "'Playwrite Magyarország'",
                letterSpacing: '0.1em',
              }}
            >
              DAVETLY
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4 mt-2">
              En Özel Gününüzü<br className="hidden md:block" />
              <span className="text-pink-500">Dijitale Taşıyın</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Sevdikleriniz size mesajlar yazsın, fotoğraflar paylaşsın, videonuzu izlesin.
              Hepsi bir QR kodla sayfanızda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <a href='/mehmetayse'>
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow">
                  Demo Sayfasını Gör
                </button>
              </a>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-white hover:bg-gray-100 text-pink-500 font-medium py-3 px-6 rounded-xl border border-pink-500 shadow"
              >
                Hemen Başla
              </button>
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
              <img
                src="https://res.cloudinary.com/dyodwyfu4/image/upload/v1753476639/Untitled_design_2_zipbfx.png"
                alt="Etkinlik Önizleme"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
      <div className="flex flex-col lg:flex-row min-h-[80vh]">

        {/* Önizleme - Mobilde Üstte, Masaüstünde Sağda */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-pink-50 to-purple-50 p-6 flex flex-col items-center">
          <button
            onClick={() => setPreviewMode(previewMode === 'mobile' ? 'web' : 'mobile')}
            className="mb-4 bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded shadow"
          >
            {previewMode === 'mobile' ? 'Web Önizleme' : 'Mobil Önizleme'}
          </button>
          {previewMode === 'mobile' ? (
          <div className="w-full max-w-[320px] h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white">
            <div className="h-full flex flex-col">
              <div
                className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-cover bg-center"
                style={bgPreview ? { backgroundImage: `url(${bgPreview})` } : backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
              >
                <DraggableText
                  className={`text-sm mb-8 italic ${subtitleFont ? `font-${subtitleFont}` : 'font-sans'}`}
                  style={{ color: subtitleColor }}
                  pos={subtitlePos}
                  onPosChange={setSubtitlePos}
                >
                  {subtitle || 'Sözümüze Hoşgeldiniz...'}
                </DraggableText>
                <DraggableText
                  className={`text-3xl font-bold mb-8 ${titleFont ? `font-${titleFont}` : 'font-sans'}`}
                  style={{ color: titleColor }}
                  pos={titlePos}
                  onPosChange={setTitlePos}
                >
                  {title || 'Burcu & Fatih'}
                </DraggableText>
                <DraggableText
                  className={`text-sm mb-8 ${altFont ? `font-${altFont}` : 'font-sans'}`}
                  style={{ color: altColor }}
                  pos={altPos}
                  onPosChange={setAltPos}
                >
                  {altText || 'Bizimkisi bir aşk hikayesi..'}
                </DraggableText>
              </div>
              <div className="p-4 text-center border-t">
                <p className="text-xs text-gray-500">
                  {slug ? `${window.location.origin}/${slug}` : 'sayfa-url.com/slug'}
                </p>
              </div>
            </div>
          </div>
          ) : (
            <iframe
              src={slug ? `/${slug}` : '/'}
              title="web preview"
              className="w-full h-[600px] border rounded-xl"
            />
          )}
        </div>

        {/* Form - Mobilde Altta, Masaüstünde Solda */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {showPageForm ? 'Sayfanızı Oluşturun' : 'Hesabınıza Giriş Yapın'}
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {!showPageForm ? (
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? 'İşleniyor...' : 'Devam Et'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Hesabınız varsa giriş yapılacak, yoksa otomatik oluşturulacak
              </p>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa URL'i (slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="ornek-sayfa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {slugMessage && (
                  <p className={`text-sm mt-1 ${slugExists ? 'text-red-500' : 'text-green-500'}`}>
                    {slugMessage}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Çift İsmi (Başlık)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Burcu & Fatih"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FontSelector
                  value={titleFont}
                  onChange={setTitleFont}
                  label="Başlık Yazı Tipi"
                  showPreview={false}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık Rengi</label>
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Üst Mesaj (Alt Başlık)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Sözümüze Hoşgeldiniz..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FontSelector
                  value={subtitleFont}
                  onChange={setSubtitleFont}
                  label="Üst Yazı Tipi"
                  showPreview={false}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Üst Yazı Rengi</label>
                  <input
                    type="color"
                    value={subtitleColor}
                    onChange={(e) => setSubtitleColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Mesaj (Alt Metin)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Bizimkisi bir aşk hikayesi.."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FontSelector
                  value={altFont}
                  onChange={setAltFont}
                  label="Alt Yazı Tipi"
                  showPreview={false}
                />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Yazı Rengi</label>
                <input
                  type="color"
                  value={altColor}
                  onChange={(e) => setAltColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arka Plan Görseli</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {BACKGROUND_TEMPLATES.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="template"
                    onClick={() => {
                      setBackgroundImage(url);
                      setBgPreview(url);
                      setBgFile(null);
                    }}
                    className={`w-16 h-16 object-cover rounded cursor-pointer ${bgPreview===url ? 'ring-2 ring-pink-500' : ''}`}
                  />
                ))}
              </div>
              <label htmlFor="hero-bg-upload" className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1 rounded shadow cursor-pointer inline-block">
                Dosya Seç
              </label>
              <input id="hero-bg-upload" type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
              <button
                onClick={uploadBackground}
                type="button"
                disabled={bgUploading}
                className={`bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1 rounded ml-2 shadow ${bgUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {bgUploading ? 'Yükleniyor...' : 'Yükle'}
              </button>
              {bgPreview && (
                <div className="mt-2 h-32 rounded bg-cover bg-center" style={{ backgroundImage: `url(${bgPreview})` }} />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Linki (isteğe bağlı)</label>
              <input
                type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleCreatePage}
                disabled={loading || !slug || slugExists}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Oluşturuluyor...' : 'Sayfayı Oluştur'}
              </button>
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg mt-2"
              >
                Dashboard'a Geç
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

       {/* QR Kod Modal */}
       {showQRModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
             <div className="mb-6">
               <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Sayfanız Hazır!</h2>
               <p className="text-gray-600">QR kodunu paylaşarak sayfanıza erişim sağlayabilirsiniz</p>
             </div>
             
             <div className="bg-white p-4 rounded-lg border mb-6 flex justify-center">
               <QRCode
                 value={createdPageUrl}
                 size={200}
                 level="H"
                 bgColor="#ffffff"
                 fgColor="#000000"
               />
             </div>
             
             <div className="mb-4">
               <p className="text-sm text-gray-500 mb-2">Sayfa URL'i:</p>
               <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                 {createdPageUrl}
               </p>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={handleShare}
                 className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg"
               >
                 📤 Paylaş
               </button>
               <button
                 onClick={handleGoToDashboard}
                 className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg"
               >
                 🎛️ Dashboard'a Geç
               </button>
             </div>
           </div>
         </div>
       )}
     </>
   );
 };

export default HeroPage;