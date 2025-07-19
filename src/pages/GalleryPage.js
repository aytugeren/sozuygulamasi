import React from 'react';

const dummyImages = [
  "https://via.placeholder.com/300x200?text=Foto1",
  "https://via.placeholder.com/300x200?text=Foto2",
  "https://via.placeholder.com/300x200?text=Foto3",
];

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-[#f4ecd8] p-6">
      <h1 className="text-3xl text-center font-semibold mb-6">🖼️ Fotoğraf Galerisi</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dummyImages.map((url, index) => (
          <img key={index} src={url} alt={`foto-${index}`} className="rounded-lg shadow" />
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
