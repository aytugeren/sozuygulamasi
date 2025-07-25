import React from 'react';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';

const ContactFooterPage = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Bize Ulaşın</h3>
        <p className="text-gray-600 mb-6">
          Sorularınız, önerileriniz veya iş birliği için bizimle iletişime geçin.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          {/* E-posta */}
          <a
            href="mailto:erenevimm@gmail.com"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition"
          >
            <FaEnvelope />
            erenevimm@gmail.com
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/aytugeren"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition"
          >
            <FaInstagram />
            @aytugeren
          </a>
        </div>

        <hr className="border-t border-gray-100 my-6" />

        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Davetly • Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default ContactFooterPage;
