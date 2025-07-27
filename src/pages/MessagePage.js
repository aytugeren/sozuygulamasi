// src/pages/MessagePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../databases/firebase';
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { QRCodeCanvas } from 'qrcode.react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const emojis = ['😊', '🎉', '💖', '🥳', '🙏', '🎈', '🌟'];
const SITE_KEY = process.env.REACT_APP_GOOGLE_SITE_KEY;
const MessagePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const messagesPerPage = 5;

const totalPages = Math.ceil(messages.length / messagesPerPage);
const paginatedMessages = messages.slice(
  (currentPage - 1) * messagesPerPage,
  currentPage * messagesPerPage
);

useEffect(() => {
  const fetchUserId = async () => {
    if (!slug) return;
    const slugRef = doc(db, 'slugs', slug);
    const slugSnap = await getDoc(slugRef);
    if (slugSnap.exists()) {
      setUserId(slugSnap.data().userId);
    }
  };
  fetchUserId();
}, [slug]);

  const fetchMessages = useCallback(async () => {
    try {
      if (userId && slug) {
        const q = query(
          collection(db, 'users', userId, 'pages', slug, 'messages'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => doc.data());
        setMessages(list);
      }
    } catch (error) {
      console.error('Mesajlar alınamadı:', error);
    }
  }, [userId, slug]);

  const handleFullscreen = () => {
    setLiveMode(true);
    setTimeout(() => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }, 300);
  };

  useEffect(() => {
    if (userId) fetchMessages();
  }, [userId, fetchMessages]);

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) setLiveMode(false);
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, []);

  const MessageForm = ({
    name,
    setName,
    message,
    setMessage,
    emoji,
    setEmoji,
    loading,
    handleSubmit,
    emojis,
    sent,
    handleFullscreen
  }) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
  
    const wrappedHandleSubmit = async (e) => {
      e.preventDefault();
      if (!executeRecaptcha) return;
      const token = await executeRecaptcha('message_send');
      handleSubmit(e, token);
    };
  
    return (
      <form onSubmit={wrappedHandleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="👨‍🏫 Adınız (isteğe bağlı)"
          className="w-full border border-gray-300 px-4 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="📝 Güzel dileğinizi buraya yazın..."
          rows={5}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="flex flex-wrap gap-2">
          {emojis.map((em, idx) => (
            <button
              type="button"
              key={idx}
              className={`px-3 py-1 rounded-full border ${emoji === em ? 'bg-blue-200' : 'bg-gray-100'}`}
              onClick={() => setEmoji(em)}
            >
              {em}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '⏳ Gönderiliyor...' : '📨 Gönder'}
        </button>
        <button
          onClick={handleFullscreen}
          type="button"
          className="mt-8 px-6 py-3 rounded-xl text-lg font-semibold bg-pink-400 text-white shadow transition animate-pulse hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
          style={{
            boxShadow: '0 0 16px 2px #ec4899, 0 0 32px 4px #f9a8d4',
            border: 'none'
          }}
        >
          <span className="animate__animated animate__heartBeat animate__infinite">💖</span> Canlı Sohbet Modu
        </button>
      </form>
    );
  };

useEffect(() => {
  let interval;
  if (liveMode && userId) {
    // Her 3 saniyede bir mesajları güncelle
    interval = setInterval(() => {
      fetchMessages();
    }, 3000);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
}, [liveMode, userId, fetchMessages]);

const handleSubmit = async (e, token) => {
  e.preventDefault();
  if (!message.trim() || !userId || !token) return;
  setLoading(true);
  try {
    await addDoc(collection(db, 'users', userId, 'pages', slug, 'messages'), {
      name: name.trim() || '👨‍🏫 Misafir',
      message: message.trim(),
      emoji,
      createdAt: Timestamp.now(),
      recaptchaToken: token
    });
    setSent(true);
    setMessage('');
    setName('');
    setEmoji('');
    fetchMessages();
  } catch (error) {
    alert('Mesaj kaydedilirken bir hata oluştu.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const animatedMessageClass = "animate__animated animate__fadeInUp";

if (liveMode) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-purple-100 flex flex-col items-center justify-center z-50">
      {/* Yanıp sönen canlı yayın ışığı */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-4 h-4 rounded-full bg-red-500 animate-pulse"
          style={{
            boxShadow: '0 0 8px 2px #ef4444, 0 0 16px 4px #f87171',
          }}
        ></span>
        <span className="font-bold text-red-500 tracking-widest text-lg animate-pulse">CANLI</span>
      </div>
      {/* Davetly reklamı */}
      <div className="mb-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-pink-500 tracking-widest" style={{ fontFamily: "'Playwrite Magyarország', serif" }}>
          DAVETLY
        </span>
        <span className="text-base text-gray-500 mt-1">En özel gününüzü dijitale taşıyın!</span>
      </div>
      {/* QR Kod Butonu - Sağ Alt Köşe */}
      <div
        className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-2 hover:scale-105 transition cursor-pointer animate-pulse"
        title="Bize kahve ısmarla ☕"
        onClick={() => window.open('https://coff.ee/erenevimmd', '_blank')}
      >
        <QRCodeCanvas
          value="https://coff.ee/erenevimmd"
          size={64}
          bgColor="#ffffff"
          fgColor="#ef4444"
          level="H"
          includeMargin={false}
        />
            <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-[8px] font-bold text-red-600 bg-white bg-opacity-80 px-1 rounded">
        Destek Ol
      </span>
    </div>
      </div>
      <h1 className="text-4xl font-bold text-pink-400 mb-8">💌 Canlı Dilekler</h1>
<div className="w-full max-w-2xl px-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
  {messages.slice(0, 4).map((msg, index) => (
    <div
      key={index}
      className={`bg-white bg-opacity-80 border border-pink-100 rounded-2xl p-6 mb-6 text-center shadow-lg text-2xl ${animatedMessageClass}`}
      style={{
        animationDelay: `${index * 0.2}s`,
        animationDuration: '1.5s',
      }}
    >
      <span className="font-bold text-pink-500">{msg.name} {msg.emoji}</span>
      <div className="mt-2 text-gray-800">{msg.message}</div>
    </div>
  ))}
</div>
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">💌 Dilek Bırak</h1>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-sm text-blue-600 hover:underline"
      >
        ← Geri Dön
      </button>

      {sent && <p className="text-green-600 mb-4">✅ Mesajınız başarıyla gönderildi 🎉</p>}

      <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
        <MessageForm
          name={name}
          setName={setName}
          message={message}
          setMessage={setMessage}
          emoji={emoji}
          setEmoji={setEmoji}
          loading={loading}
          handleSubmit={handleSubmit}
          emojis={emojis}
          sent={sent}
          handleFullscreen={handleFullscreen}
        />
      </GoogleReCaptchaProvider>

      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-xl font-semibold mb-2 text-left">📜 Dilekler ({messages.length})</h2>
    <div className="space-y-4">
        {paginatedMessages.map((msg, index) => (
          <div key={index} className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-left shadow">
            <p className="text-sm text-gray-800 mb-1 font-semibold">💬 {msg.name} {msg.emoji}</p>
            <p className="text-gray-700 whitespace-pre-line">{msg.message}</p>
          </div>
        ))}
      </div>
      </div>
            {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-pink-100 text-pink-700 disabled:opacity-50"
          >
            ← Önceki
          </button>
          <span className="font-semibold">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-pink-100 text-pink-700 disabled:opacity-50"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
