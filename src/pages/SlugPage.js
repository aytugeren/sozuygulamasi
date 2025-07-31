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
  const heroRef = useRef(null);
  const PREVIEW_DIMENSIONS = {
    phone: { width: 375, height: 700 },
    web: { width: 640, height: 720 },
  };
  const DEFAULT_RATIOS = { title: 0.43, subtitle: 0.29, altText: 0.57 };
  const [scaledTitlePos, setScaledTitlePos] = useState(null);
  const [scaledSubtitlePos, setScaledSubtitlePos] = useState(null);
  const [scaledAltTextPos, setScaledAltTextPos] = useState(null);

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

  useEffect(() => {
    if (!page) return;
    const computeScaled = () => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const { width, height } = rect;
      const base = width < 500 ? PREVIEW_DIMENSIONS.phone : PREVIEW_DIMENSIONS.web;
      const clamp = (val, max) => Math.min(Math.max(val, 0), max);
      const scale = (pos, ratio) =>
        pos
          ? {
              x: clamp((pos.x * width) / base.width, width),
              y: clamp((pos.y * height) / base.height, height),

            }
          : { x: width / 2, y: height * ratio };
      setScaledTitlePos(scale(page.titlePos, DEFAULT_RATIOS.title));
      setScaledSubtitlePos(scale(page.subtitlePos, DEFAULT_RATIOS.subtitle));
      setScaledAltTextPos(scale(page.altTextPos, DEFAULT_RATIOS.altText));
    };
    computeScaled();
    window.addEventListener('resize', computeScaled);
    return () => window.removeEventListener('resize', computeScaled);
  }, [page]);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;
  if (!page) return <div className="text-center py-10 text-red-600">Sayfa bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center text-center relative"
      >
        <p
          className={`italic font-${page.subtitleFont} mb-4 absolute`}
          style={{
            color: page.subtitleColor,
            fontSize: page.subtitleSize || 24,
            left: scaledSubtitlePos?.x,
            top: scaledSubtitlePos?.y,
            transform: 'translateX(-50%)',
          }}
        >
          {page.subtitle}
        </p>
        <h1
          className={`font-${page.titleFont} mb-3 absolute`}
          style={{
            color: page.titleColor,
            fontSize: page.titleSize || 48,
            left: scaledTitlePos?.x,
            top: scaledTitlePos?.y,
            transform: 'translateX(-50%)',
          }}
        >
          {page.title}
        </h1>
        <p
          className={`font-${page.altFont} mt-4 absolute`}
          style={{
            color: page.altColor,
            fontSize: page.altTextSize || 16,
            left: scaledAltTextPos?.x,
            top: scaledAltTextPos?.y,
            transform: 'translateX(-50%)',
          }}
        >
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
