import React, { useState } from 'react';

const MessagePage = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Şimdilik sadece simülasyon
    alert(`Teşekkürler ${name || 'misafir'}! Mesajınız alındı.`);
    setSent(true);
    setMessage('');
    setName('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6">💌 Dilek Bırak</h1>

      {sent && <p className="text-green-600 mb-4">Mesajınız başarıyla gönderildi 🎉</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Adınız (isteğe bağlı)"
          className="w-full border border-gray-300 px-4 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Güzel dileğinizi buraya yazın..."
          rows={5}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow"
        >
          Gönder
        </button>
      </form>
    </div>
  );
};

export default MessagePage;
