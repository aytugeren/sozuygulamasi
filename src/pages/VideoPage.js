// src/pages/VideoPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../databases/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const convertToEmbedUrl = (url) => {
  if (!url) return '';
  const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  return url; // fallback
};

const VideoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));

        for (const userDoc of usersSnapshot.docs) {
          const pagesRef = collection(db, 'users', userDoc.id, 'pages');
          const pagesSnapshot = await getDocs(pagesRef);

          for (const pageDoc of pagesSnapshot.docs) {
            if (pageDoc.id === slug) {
              const data = pageDoc.data();
              if (data.videoLink) {
                const embedUrl = convertToEmbedUrl(data.videoLink);
                setVideoUrl(embedUrl);
              }
              break;
            }
          }
        }
      } catch (error) {
        console.error('Video verisi alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">🎥 Videomuzu İzle</h1>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-sm text-blue-600 hover:underline"
      >
        ← Geri Dön
      </button>

      {loading ? (
        <p className="text-gray-500 mt-10">Yükleniyor...</p>
      ) : videoUrl ? (
        <div className="w-full max-w-3xl aspect-w-16 aspect-h-9">
          <iframe
            src={videoUrl}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-64 rounded-lg border"
          ></iframe>
        </div>
      ) : (
        <p className="text-gray-500 mt-10">Henüz video eklenmedi.</p>
      )}
    </div>
  );
};

export default VideoPage;
