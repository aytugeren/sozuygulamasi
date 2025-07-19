import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ButtonsSection = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="buttons"
      className={`min-h-screen flex flex-col justify-center items-center bg-[#f4ecd8] text-[#4c5b3f] px-4 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-semibold">Bize Katılın</h2>
        <p className="text-md mt-2">Anılarınızı bizimle paylaşın 💫</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-md">
        <Link to="/upload" className="bg-pink-500 hover:bg-pink-600 text-white text-lg font-medium py-3 px-6 rounded-xl text-center shadow-md transition">
          📸 Fotoğraf Paylaş
        </Link>
        <Link to="/message" className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-xl text-center shadow-md transition">
          💌 Güzel Dileklerinizi Paylaşın
        </Link>
        <Link to="/gallery" className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 px-6 rounded-xl text-center shadow-md transition">
          🎥 Hikayemizi İzleyin
        </Link>
      </div>
    </section>
  );
};

export default ButtonsSection;
