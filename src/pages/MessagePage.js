// src/pages/MessagePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../databases/firebase';
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';


const emojis = ['😊', '🎉', '💖', '🥳', '🙏', '🎈', '🌟'];

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

  useEffect(() => {
    if (userId) fetchMessages();
  }, [userId, fetchMessages]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!message.trim() || !userId) return;
  setLoading(true);
  try {
    await addDoc(collection(db, 'users', userId, 'pages', slug, 'messages'), {
      name: name.trim() || '🧑 Misafir',
      message: message.trim(),
      emoji,
      createdAt: Timestamp.now(),
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

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="🧑 Adınız (isteğe bağlı)"
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
      </form>

      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-xl font-semibold mb-2 text-left">📜 Dilekler ({messages.length})</h2>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-left shadow">
              <p className="text-sm text-gray-800 mb-1 font-semibold">💬 {msg.name} {msg.emoji}</p>
              <p className="text-gray-700 whitespace-pre-line">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
