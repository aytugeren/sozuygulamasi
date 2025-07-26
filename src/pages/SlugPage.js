// src/pages/SlugPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../databases/firebase';

const SlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

useEffect(() => {
  if (!slug) {
    setLoading(false);
    setPage(null);
    return;
  }
  const fetchPage = async () => {
    try {
      // Slug ile sayfa verisini çekiyoruz
      const slugRef = doc(db, 'slugs', slug);
      const slugSnap = await getDoc(slugRef);
      if (slugSnap.exists()) {
        const { userId } = slugSnap.data();
        if (userId) {
          const pageRef = doc(db, 'users', userId, 'pages', slug);
          const pageSnap = await getDoc(pageRef);
          if (pageSnap.exists()) {
            setPage(pageSnap.data());
            return;
          }
        }
      }
      setPage(null);
    } catch (error) {
      console.error('Sayfa verisi alınamadı:', error);
      setPage(null);
    } finally {
      setLoading(false);
    }
  };
  fetchPage();
}, [slug]);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;
  if (!page) return <div className="text-center py-10 text-red-600">Sayfa bulunamadı.</div>;

 return (
    <div className="min-h-screen bg-white px-4 py-8">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative">
        <p className={`italic text-xl font-${page.subtitleFont} mb-4`} style={{ color: page.subtitleColor }}>
          {page.subtitle}
        </p>
        <h1 className={`text-5xl font-${page.titleFont} mb-3`} style={{ color: page.titleColor }}>
          {page.title}
        </h1>
        <p className={`text-base font-${page.altFont} mt-4`} style={{ color: page.altColor }}>
          {page.altText}
        </p>

        {/* Scroll down arrow */}
        <button
          onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 animate-bounce"
        >
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      <section ref={sectionRef} className="min-h-screen flex flex-col justify-center items-center gap-6">
        <button
          onClick={() => navigate(`/${slug}/photos`)}
          className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-6 py-3 rounded-xl shadow"
        >
          📸 Fotoğraf Paylaş
        </button>
        <button
          onClick={() => navigate(`/${slug}/messages`)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-6 py-3 rounded-xl shadow"
        >
          💬 Mesaj Bırak
        </button>
        <button
          onClick={() => navigate(`/${slug}/video`)}
          className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-xl shadow"
        >
          🎥 Videomuzu İzle
        </button>
      </section>
    </div>
  );
};

export default SlugPage;
