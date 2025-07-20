import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../databases/firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

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

  useEffect(() => {
    if (user) {
      fetchUserPages();
      setLoading(false);
    }
  }, [user]);

  const fetchUserPages = async () => {
    const pagesRef = collection(db, 'users', user.uid, 'pages');
    const querySnapshot = await getDocs(pagesRef);
    const pagesList = [];
    querySnapshot.forEach((doc) => {
      pagesList.push(doc.data());
    });
    setPages(pagesList);
  };

  const handleDelete = async (slugToDelete) => {
  const confirmed = window.confirm(`"${slugToDelete}" sayfasını silmek istediğinizden emin misiniz?`);
  if (!confirmed) return;

  const pageRef = doc(db, 'users', user.uid, 'pages', slugToDelete);
  await deleteDoc(pageRef);

  // Listeyi güncelle
  await fetchUserPages();
};

  const handleSave = async () => {
    if (!slug) return;

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
      createdAt: new Date(),
    });

    await fetchUserPages();
    setSlug('');
    setTitle('');
    setSubtitle('');
    setVideoLink('');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  if (loading) return <div className="text-center p-10">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#f4ecd8] px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center">🎛️ Kontrol Paneli</h1>
        <p className="text-sm text-center text-gray-500">Hoş geldiniz: {user.email}</p>

        <div>
          <label className="block text-gray-700 mb-1">🔗 Sayfa Linki (slug)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded px-4 py-2"
            placeholder="örnek: burcufatihsoz"
          />
        </div>

        <div>
          <label className="block mb-1">💑 Çift İsmi (başlık)</label>
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
            <option value="romantic">Romantik</option>
            <option value="elegant">Klasik</option>
            <option value="sans">Modern</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">🎨 Başlık Rengi</label>
          <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-16 h-10" />
        </div>

        <div>
          <label className="block mb-1">💬 Alt Mesaj (subtitle)</label>
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
                  href={`/u/${user.uid}/${p.slug}`}
                  className="text-blue-600 underline text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Gör
                </a>
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
                      videoLink
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
