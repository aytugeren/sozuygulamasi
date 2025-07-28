import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../databases/firebase';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import { toPng } from 'html-to-image';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import {toast} from 'react-toastify';
import { BACKGROUND_TEMPLATES } from '../utils/backgroundTemplates';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingSlug, setEditingSlug] = useState(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [titleFont, setTitleFont] = useState('romantic');
  const [titleColor, setTitleColor] = useState('#333333');
  const [subtitleFont, setSubtitleFont] = useState('sans');
  const [subtitleColor, setSubtitleColor] = useState('#555555');
  const [altText, setAltText] = useState('');
  const [altFont, setAltFont] = useState('sans');
  const [altColor, setAltColor] = useState('#888888');
  const [videoLink, setVideoLink] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [bgFile, setBgFile] = useState(null);
  const [bgPreview, setBgPreview] = useState('');
  const [slugExists, setSlugExists] = useState(false);
  const [slugMessage, setSlugMessage] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');

const qrRef = useRef(null);
const invalidSlugRegex = /[^a-zA-Z-]/;

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
  if (!bgFile) return;
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
    }
  } catch (err) {
    console.error('Cloudinary upload failed', err);
  }
};


  const fetchUserPages = useCallback(async () => {
    const pagesRef = collection(db, 'users', user.uid, 'pages');
    const querySnapshot = await getDocs(pagesRef);
    const pagesList = [];
    querySnapshot.forEach((doc) => {
      pagesList.push(doc.data());
    });
    setPages(pagesList);
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      fetchUserPages();
      setLoading(false);
    }
  }, [user, fetchUserPages]);

const deleteCollection = async (collectionRef) => {
  if (!collectionRef) return;
  const snapshot = await getDocs(collectionRef);
  const promises = snapshot.docs.map(docItem => deleteDoc(docItem.ref));
  await Promise.all(promises);
};

 const handleDelete = async (slugToDelete) => {
  if (!user || !user.uid || !slugToDelete) {
    toast.error("Silme işlemi için kullanıcı ve slug bilgisi gerekli!");
    return;
  }
  const confirmed = window.confirm(`"${slugToDelete}" sayfasını silmek istediğinizden emin misiniz?`);
  if (!confirmed) return;

  const pageRef = doc(db, 'users', user.uid, 'pages', slugToDelete);
  const slugRef = doc(db, 'slugs', slugToDelete);
  const messagesRef = collection(db, 'users', user.uid, 'pages', slugToDelete, 'messages');

  await deleteCollection(messagesRef);
  await deleteDoc(pageRef);
  await deleteDoc(slugRef);

  await fetchUserPages();
};

  const handleSave = async () => {
    if (!slug) return;

    createSlug(true,slug);

    if (slugExists) {
      toast.error(slugMessage);
      return;
    }

    await setDoc(doc(db, 'users', user.uid), { initialized: true }, { merge: true });
    
    const pageRef = doc(db, 'users', user.uid, 'pages', slug);
    await setDoc(pageRef, {
      slug,
      title,
      subtitle,
      titleFont,
      titleColor,
      subtitleFont,
      subtitleColor,
      altText,
      altFont,
      altColor,
      videoLink,
      backgroundImage,
      createdAt: new Date(),
    });

    createSlug(false, slug);
    await fetchUserPages();
    setSlug('');
    setTitle('');
    setSubtitle('');
    setVideoLink('');
    setBackgroundImage('');
    setBgPreview('');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  const createSlug = async (isForCheck, value) => {
    if (!value) return;
    const slugRef = doc(db, 'slugs', value);
    const slugSnap = await getDoc(slugRef);

    if (slugSnap.exists()) {
      setSlugExists(true);
      setSlugMessage('Bu slug zaten kullanılıyor. Lütfen farklı bir slug girin.');
      return false;
    }

  if (invalidSlugRegex.test(value)) {
    setSlugExists(true);
    setSlugMessage('Slug sadece İngilizce harf ve tire (-) içerebilir. Türkçe karakter, sayı ve özel karakter kullanılamaz.');
    return false;
  }

    if (value.length < 3 || value.length > 20) {
      setSlugExists(true);
      setSlugMessage('Slug 3-20 karakter arasında olmalıdır.');
      return false;  
    }

    if (!isForCheck) {
      await setDoc(slugRef, { userId: user.uid });
      return true;
    }

    setSlugExists(false);
    setSlugMessage('Bu slug kullanılabilir.');
    return true;
  }

  if (loading) return <div className="text-center p-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#f4ecd8] px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center">🎛️ Kontrol Paneli</h1>
        <p className="text-sm text-center text-gray-500">Hoş geldiniz: {user.email}</p>

        <div>
          <label className="block text-gray-700 mb-1">🔗 Sayfa Linki</label>
          <input
            type="text"
            value={slug}
            onChange={async (e) => {
              setSlug(e.target.value);
              await createSlug(true, e.target.value);
            }}
            className="w-full border rounded px-4 py-2"
            placeholder="örnek: burcufatihsoz"
          />
            {slugExists && (
              <p className="text-red-600 text-sm mt-1">{slugMessage}</p>
            )}
        </div>

        <div>
          <label className="block mb-1">💑 Çift İsmi</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            placeholder="Burcu & Fatih"
          />
        </div>

        <div>
          <label className="block mb-1">🖋️ Başlık Yazı Tipi</label>
          <select value={titleFont} onChange={(e) => setTitleFont(e.target.value)} className="w-full border px-4 py-2 rounded">
            <option value="romantic">💕 Great Vibes (Romantik)</option>
            <option value="romantic2">💝 Dancing Script (Romantik)</option>
            <option value="romantic3">🌸 Pacifico (Romantik)</option>
            <option value="romantic4">🌹 Satisfy (Romantik)</option>
            <option value="elegant">📜 Playfair Display (Klasik)</option>
            <option value="elegant2">🏛️ Cormorant Garamond (Klasik)</option>
            <option value="elegant3">📚 Libre Baskerville (Klasik)</option>
            <option value="elegant4">🎭 Crimson Text (Klasik)</option>
            <option value="modern">⚡ Poppins (Modern)</option>
            <option value="modern2">🚀 Inter (Modern)</option>
            <option value="modern3">💻 Roboto (Modern)</option>
            <option value="modern4">🎯 Open Sans (Modern)</option>
            <option value="decorative">✨ Abril Fatface (Dekoratif)</option>
            <option value="decorative2">🎨 Bebas Neue (Dekoratif)</option>
            <option value="decorative3">🔥 Righteous (Dekoratif)</option>
            <option value="decorative4">🦞 Lobster (Dekoratif)</option>
            <option value="handwriting">✍️ Kalam (El Yazısı)</option>
            <option value="handwriting2">🌺 Indie Flower (El Yazısı)</option>
            <option value="handwriting3">🏠 Architects Daughter (El Yazısı)</option>
            <option value="handwriting4">📝 Caveat (El Yazısı)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">🎨 Başlık Rengi</label>
          <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-16 h-10" />
        </div>

        <div>
          <label className="block mb-1">💬 Alt Mesaj</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            placeholder="Sözümüze hoşgeldiniz.."
          />
        </div>

        <div>
          <label className="block mb-1">🖋️ Alt Yazı Yazı Tipi</label>
          <select value={subtitleFont} onChange={(e) => setSubtitleFont(e.target.value)} className="w-full border px-4 py-2 rounded">
            <option value="romantic">💕 Great Vibes (Romantik)</option>
            <option value="romantic2">💝 Dancing Script (Romantik)</option>
            <option value="romantic3">🌸 Pacifico (Romantik)</option>
            <option value="romantic4">🌹 Satisfy (Romantik)</option>
            <option value="elegant">📜 Playfair Display (Klasik)</option>
            <option value="elegant2">🏛️ Cormorant Garamond (Klasik)</option>
            <option value="elegant3">📚 Libre Baskerville (Klasik)</option>
            <option value="elegant4">🎭 Crimson Text (Klasik)</option>
            <option value="modern">⚡ Poppins (Modern)</option>
            <option value="modern2">🚀 Inter (Modern)</option>
            <option value="modern3">💻 Roboto (Modern)</option>
            <option value="modern4">🎯 Open Sans (Modern)</option>
            <option value="decorative">✨ Abril Fatface (Dekoratif)</option>
            <option value="decorative2">🎨 Bebas Neue (Dekoratif)</option>
            <option value="decorative3">🔥 Righteous (Dekoratif)</option>
            <option value="decorative4">🦞 Lobster (Dekoratif)</option>
            <option value="handwriting">✍️ Kalam (El Yazısı)</option>
            <option value="handwriting2">🌺 Indie Flower (El Yazısı)</option>
            <option value="handwriting3">🏠 Architects Daughter (El Yazısı)</option>
            <option value="handwriting4">📝 Caveat (El Yazısı)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">🎨 Alt Yazı Rengi</label>
          <input type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="w-16 h-10" />
        </div>
        <div>
          <label className="block mb-1">📍 Ek Açıklama (altText)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            placeholder="Örn: 14 Temmuz 2025, İstanbul"
          />
        </div>

        <div>
          <label className="block mb-1">🖋️ Alt Yazı Fontu</label>
          <select
            value={altFont}
            onChange={(e) => setAltFont(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="romantic">💕 Great Vibes (Romantik)</option>
            <option value="romantic2">💝 Dancing Script (Romantik)</option>
            <option value="romantic3">🌸 Pacifico (Romantik)</option>
            <option value="romantic4">🌹 Satisfy (Romantik)</option>
            <option value="elegant">📜 Playfair Display (Klasik)</option>
            <option value="elegant2">🏛️ Cormorant Garamond (Klasik)</option>
            <option value="elegant3">📚 Libre Baskerville (Klasik)</option>
            <option value="elegant4">🎭 Crimson Text (Klasik)</option>
            <option value="modern">⚡ Poppins (Modern)</option>
            <option value="modern2">🚀 Inter (Modern)</option>
            <option value="modern3">💻 Roboto (Modern)</option>
            <option value="modern4">🎯 Open Sans (Modern)</option>
            <option value="decorative">✨ Abril Fatface (Dekoratif)</option>
            <option value="decorative2">🎨 Bebas Neue (Dekoratif)</option>
            <option value="decorative3">🔥 Righteous (Dekoratif)</option>
            <option value="decorative4">🦞 Lobster (Dekoratif)</option>
            <option value="handwriting">✍️ Kalam (El Yazısı)</option>
            <option value="handwriting2">🌺 Indie Flower (El Yazısı)</option>
            <option value="handwriting3">🏠 Architects Daughter (El Yazısı)</option>
            <option value="handwriting4">📝 Caveat (El Yazısı)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">🎨 Alt Yazı Rengi</label>
          <input
            type="color"
            value={altColor}
            onChange={(e) => setAltColor(e.target.value)}
            className="w-16 h-10"
          />
        </div>
        <div>
          <label className="block mb-1">🌆 Arka Plan Fotoğrafı</label>
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
          <input type="file" accept="image/*" onChange={handleBgChange} />
          <button onClick={uploadBackground} className="text-blue-600 text-sm ml-2 underline">Yükle</button>
          {bgPreview && (
            <div className="mt-2 h-32 rounded bg-cover bg-center" style={{ backgroundImage: `url(${bgPreview})` }} />
          )}
        </div>
        <div>
          <label className="block mb-1">🎥 Video Linki</label>
        <input
          type="text"
          placeholder="Alt Mesaj"
          className="w-full border px-4 py-2 rounded"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
        </div>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded shadow"
        >
          🚀 Sayfa Kaydet
        </button>

        {pages.length > 0 && (
          <div className="bg-gray-100 rounded p-4 mt-6">
            <h2 className="text-lg font-semibold mb-2">📄 Sayfalarım</h2>
            <ul className="space-y-1">
              {pages.map((p) => (
          <li key={p.slug} className="flex flex-col gap-1 border-b pb-2 mb-2">
            <div className="flex justify-between items-center">
              <span>🔗 {p.slug}</span>
              <div className="flex items-center gap-2">
                <a
                  href={`/${p.slug}`}
                  className="text-blue-600 underline text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Gör
                </a>
                <button
                  onClick={() => {
                    setQrValue(`${window.location.origin}/${p.slug}`);
                    setQrModalOpen(true);
                  }}
                  className="text-green-600 text-sm hover:underline"
                >
                  QR Kod Oluştur
                </button>
                <button
                  onClick={() => {
                    setEditingSlug(p.slug);
                    setAltColor(p.altColor || '#888888');
                    setAltFont(p.altFont || 'sans');
                    setTitleFont(p.titleFont || 'romantic');
                    setTitleColor(p.titleColor || '#333333');
                    setTitle(p.title || '');
                    setSubtitle(p.subtitle || '');
                    setSubtitleColor(p.subtitleColor || '#555555');
                    setSubtitleFont(p.subtitleFont || 'sans');
                    setVideoLink(p.videoLink || '');
                    setAltText(p.altText || '');
                    setBackgroundImage(p.backgroundImage || '');
                    setBgPreview(p.backgroundImage || '');
                  }}
                  className="text-yellow-600 text-sm hover:underline"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(p.slug)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>

            {editingSlug === p.slug && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Çift İsmi"
                  className="w-full border px-4 py-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                  <label className="block mb-1">🖋️ Başlık Fontu</label>
                  <select value={titleFont} onChange={(e) => setTitleFont(e.target.value)} className="w-full border px-4 py-2 rounded">
                    <option value="romantic">Romantik</option>
                    <option value="elegant">Klasik</option>
                    <option value="sans">Modern</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">🎨 Başlık Rengi</label>
                  <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-16 h-10" />
                </div>
                <input
                  type="text"
                  placeholder="Alt Mesaj"
                  className="w-full border px-4 py-2 rounded"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
                <div>
                  <label className="block mb-1">🖋️ Alt Yazı Fontu</label>
                  <select value={subtitleFont} onChange={(e) => setSubtitleFont(e.target.value)} className="w-full border px-4 py-2 rounded">
                    <option value="romantic">Romantik</option>
                    <option value="elegant">Klasik</option>
                    <option value="sans">Modern</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">🎨 Alt Yazı Rengi</label>
                  <input type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="w-16 h-10" />
                </div>

                <div>
                  <label className="block mb-1">📍 Ek Açıklama (altText)</label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    placeholder="Örn: 14 Temmuz 2025, İstanbul"
                  />
                </div>

                <div>
                  <label className="block mb-1">🖋️ Alt Yazı Fontu</label>
                  <select
                    value={altFont}
                    onChange={(e) => setAltFont(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                  >
                    <option value="romantic">Romantik</option>
                    <option value="elegant">Klasik</option>
                    <option value="sans">Modern</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">🎨 Alt Yazı Rengi</label>
                  <input
                    type="color"
                    value={altColor}
                    onChange={(e) => setAltColor(e.target.value)}
                    className="w-16 h-10"
                  />
                </div>
                <div>
                  <label className="block mb-1">🌆 Arka Plan Fotoğrafı</label>
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
                  <input type="file" accept="image/*" onChange={handleBgChange} />
                  <button onClick={uploadBackground} className="text-blue-600 text-sm ml-2 underline">
                    Yükle
                  </button>
                  {bgPreview && (
                    <div className="mt-2 h-32 rounded bg-cover bg-center" style={{ backgroundImage: `url(${bgPreview})` }} />
                  )}
                </div>
                <div>
                  <label className="block mb-1">🎥 Video Linki</label>
                <input
                  type="text"
                  placeholder="Alt Mesaj"
                  className="w-full border px-4 py-2 rounded"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
                </div>
                <button
                  onClick={async () => {
                    const ref = doc(db, 'users', user.uid, 'pages', p.slug);
                    await updateDoc(ref, {
                      title,
                      subtitle,
                      titleFont,
                      titleColor,
                      subtitleFont,
                      subtitleColor,
                      altText,
                      altFont,
                      altColor,
                      videoLink,
                      backgroundImage
                    });
                     <p className="text-green-600 mb-4">✅ Mesajınız başarıyla gönderildi 🎉</p>
                    setEditingSlug(null);
                    fetchUserPages();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                >
                  💾 Güncelle
                </button>
              </div>
            )}
          </li>
              ))}
            </ul>
{qrModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center relative">
      <button
        onClick={() => setQrModalOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
      >
        ×
      </button>
      <h2 className="text-lg font-semibold mb-4">QR Kod</h2>
      {/* QR kod ve yazı birlikte PNG'ye dahil olacak şekilde bir kapsayıcı div */}
      <div ref={qrRef} className="bg-white p-4 rounded flex flex-col items-center">
        <span
          className="mb-2 text-pink-500 font-bold text-2xl tracking-widest"
          style={{ fontFamily: "'Playwrite Magyarország'" }}
        >
          DAVETLY
        </span>
        <QRCode value={qrValue} size={180} />
      </div>
<a
  href={qrValue}
  target="_blank"
  rel="noreferrer"
  className="mt-4 text-blue-600 underline"
>
  Linki Aç
</a>
<button
  onClick={async () => {
    if (!qrRef.current) return;
    const dataUrl = await toPng(qrRef.current);

    // PNG dosyasını blob'a çevir
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], "qr-kod.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Davetly QR',
        text: 'Davetly sayfamın QR kodunu ve linkini paylaşıyorum!',
        files: [file],
        url: qrValue,
      });
    } else {
      alert('QR kod görseli paylaşımı bu tarayıcıda desteklenmiyor.');
    }
  }}
  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  Paylaş
</button>
<button
  onClick={async () => {
    if (!qrRef.current) return;
    const dataUrl = await toPng(qrRef.current);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qr-kod.png';
    link.click();
  }}
  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
>
  QR'ı PNG Olarak Kaydet
</button>
    </div>
  </div>
)}
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={handleLogout}
            className="text-red-500 underline hover:text-red-600 text-sm"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
