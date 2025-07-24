import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../databases/firebase';

const ProCheckout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

const maskedCardNumber = cardNumber
  ? cardNumber
      .split(' ')
      .map((block, i) => (i === 2 ? '****' : block))
      .join(' ')
  : '';

  const handleFakePayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Ödeme başarılı → isPro true yap
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { isPro: true });

      alert('Ödeme başarılı! Pro plana geçtiniz 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Pro geçiş hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pro’ya Geç</h2>
        <p className="text-gray-600 mb-6 text-center">
          Özel slug, video yükleme, sınırsız sayfa ve daha fazlası seni bekliyor!
        </p>

<div className="border rounded-lg p-4 mb-6 text-center bg-pink-50 min-h-[96px] flex flex-col justify-center">
  {maskedCardNumber ? (
<div className="relative bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-2xl p-6 mb-6 shadow-lg min-h-[120px] flex flex-col justify-between">
  {/* Kart numarası */}
  <div className="text-lg font-mono tracking-widest">
    {cardNumber || '•••• •••• •••• ••••'}
  </div>

  {/* Alt detaylar */}
  <div className="flex justify-between items-end text-sm mt-4">
    <span className="opacity-80">
      {expiry || 'MM/YY'}
    </span>
    <span className="text-lg font-semibold">₺89</span>
  </div>
</div>
  ) : (
    <>
      <p className="text-lg font-semibold text-pink-600">Pro Plan</p>
      <p className="text-3xl font-bold text-pink-700">₺89</p>
      <p className="text-gray-500 text-sm">Tek seferlik ödeme</p>
    </>
  )}
</div>

        {/* Dummy ödeme bilgisi */}
<div className="space-y-4 mb-6">
  {/* Kart Numarası */}
<input
  type="text"
  placeholder="Kart Numarası"
  maxLength={16}
  pattern="\d*"
  inputMode="numeric"
  className="w-full border px-4 py-2 rounded-lg tracking-widest placeholder:text-gray-400"
  onInput={(e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  }}
/>

  <div className="flex gap-3">
    {/* Son Kullanma Tarihi */}
<input
  type="text"
  placeholder="MM/YY"
  maxLength={5}
  inputMode="numeric"
  className="w-1/2 border px-4 py-2 rounded-lg placeholder:text-gray-400"
  onInput={(e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    e.target.value = val;
    setExpiry(e.target.value);
  }}
/>

    {/* CVC */}
    <input
      type="text"
      placeholder="CVC"
      maxLength={3}
      inputMode="numeric"
      className="w-1/2 border px-4 py-2 rounded-lg placeholder:text-gray-400"
    />
  </div>
</div>


        <button
          onClick={handleFakePayment}
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
        >
          {loading ? 'İşleniyor...' : '₺89 Öde ve Pro’ya Geç'}
        </button>
      </div>
    </div>
  );
};

export default ProCheckout;
