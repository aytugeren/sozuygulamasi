// src/pages/SlugPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../databases/firebase';

const fontMap = {
  romantic: '"Dancing Script", cursive',
  elegant: '"Playfair Display", serif',
  sans: '"Open Sans", sans-serif',
};

const SlugPage = () => {
  const { userId, slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const ref = doc(db, 'users', userId, 'pages', slug);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPage(snap.data());
        }
      } catch (error) {
        console.error('Sayfa verisi alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [userId, slug]);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;
  if (!page) return <div className="text-center py-10 text-red-600">Sayfa bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h2
        className="text-xl mb-2"
        style={{ fontFamily: fontMap[page.subtitleFont], color: page.subtitleColor }}
      >
        {page.subtitle}
      </h2>
      <h1
        className="text-4xl font-bold mb-2"
        style={{ fontFamily: fontMap[page.titleFont], color: page.titleColor }}
      >
        {page.title}
      </h1>
      <p
        className="italic mb-10"
        style={{ fontFamily: fontMap[page.altFont], color: page.altColor }}
      >
        {page.altText}
      </p>

      <div className="space-y-4">
        <button
          onClick={() => navigate(`/u/${userId}/${slug}/photos`)}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full text-lg"
        >
          📸 Fotoğraf Paylaş
        </button>
        <button
          onClick={() => navigate(`/u/${userId}/${slug}/messages`)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full text-lg"
        >
          💬 Mesaj Bırak
        </button>
        <button
          onClick={() => navigate(`/u/${userId}/${slug}/video`)}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full text-lg"
        >
          🎥 Videomuzu İzle
        </button>
      </div>
    </div>
  );
};

export default SlugPage;
