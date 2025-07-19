import React from 'react';
import './HeroAnimation.css';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-800 relative px-4">
      <div className="text-center max-w-2xl">
        <p className="italic text-xl font-romantic mb-4">Bir aşk hikayesi..</p>

        {/* Elle yazılıyor efektiyle */}
        <h1 className="typewriter text-5xl md:text-6xl font-romantic leading-tight tracking-wide mb-6">
          Burcu & Fatih
        </h1>

        {/* Araya biraz boşluk bırakarak aşağı alıyoruz */}
        <p className="text-lg font-romantic mt-6">Sözümüze hoşgeldiniz..</p>
      </div>

      <a href="#buttons" className="absolute bottom-8 animate-bounce">
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
};

export default HeroSection;
