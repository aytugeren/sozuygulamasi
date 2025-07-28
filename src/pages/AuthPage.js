import React, { useState } from 'react';
import { auth } from '../databases/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { getAuthErrorMessage } from '../utils/authErrors';
import { isPasswordValid } from '../utils/validation';

const SITE_KEY = process.env.REACT_APP_GOOGLE_SITE_KEY; // reCAPTCHA v3 anahtarınız

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid(password)) {
      setError('Şifre en az bir büyük harf, bir küçük harf ve bir noktalama işareti içermelidir.');
      return;
    }

    if (!executeRecaptcha) {
      setError('Recaptcha yüklenemedi');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(getAuthErrorMessage(err.code));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <h1 className="text-3xl font-semibold mb-4">
        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="E-posta"
          className="w-full border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 underline">
          {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </p>
    </div>
  );
};

// Ana bileşeni provider ile sarmalıyoruz
const AuthPage = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
      <AuthForm />
    </GoogleReCaptchaProvider>
  );
};

export default AuthPage;
