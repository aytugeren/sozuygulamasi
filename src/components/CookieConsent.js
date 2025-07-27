import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';
const AUTO_ACCEPT_SECONDS = 15;

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_ACCEPT_SECONDS);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
      setCountdown(AUTO_ACCEPT_SECONDS);
      const timer = setTimeout(() => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setVisible(false);
      }, AUTO_ACCEPT_SECONDS * 1000);
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        .cookie-bar-custom {
          position: fixed;
          left: 50%;
          bottom: 32px;
          transform: translateX(-50%);
          max-width: 95vw;
          background: rgba(34, 34, 34, 0.85);
          color: #fff;
          padding: 16px 24px 10px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          z-index: 1000;
          backdrop-filter: blur(6px);
          font-size: 14px;
          gap: 8px;
          transition: all 0.2s;
          overflow: hidden;
        }
        .cookie-bar-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cookie-bar-row span {
          flex: 1 1 0%;
          min-width: 0;
          line-height: 1.5;
          word-break: break-word;
        }
        .cookie-bar-timer {
          font-size: 12px;
          color: #cbd5e1;
          margin-top: 2px;
          width: 100%;
          text-align: left;
        }
        .cookie-bar-btn {
          padding: 8px 20px;
          background: rgba(74, 222, 128, 0.95);
          color: #222;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(74,222,128,0.10);
          transition: background 0.2s;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .cookie-bar-custom {
            left: 8px;
            right: 8px;
            bottom: 80px;
            transform: none;
            width: auto;
            max-width: 98vw;
            padding: 10px 8px 8px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          .cookie-bar-row {
            gap: 8px;
          }
          .cookie-bar-timer {
            font-size: 11px;
          }
        }
      `}</style>
      <div className="cookie-bar-custom">
        <div className="cookie-bar-row">
          <span>
            Bu web sitesi, deneyiminizi geliştirmek için çerezleri kullanır. 
            <a href="/cookie-policy" style={{ color: '#4ade80', textDecoration: 'underline', marginLeft: 4 }}>
              Detaylar için gizlilik politikamıza bakabilirsiniz.
            </a>
          </span>
          <button
            onClick={handleAccept}
            className="cookie-bar-btn"
          >
            Kabul Et
          </button>
        </div>
        <div className="cookie-bar-timer">
          Otomatik olarak kabul edilecek: <b>{countdown}</b> saniye
        </div>
      </div>
    </>
  );
};

export default CookieConsent; 