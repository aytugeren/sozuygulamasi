import React, { useState } from 'react';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`"${selectedFile.name}" yüklendi (şimdilik simülasyon).`);
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6">📸 Fotoğraf Paylaş</h1>

      {/* Özel stil verilmiş buton */}
      <label className="cursor-pointer inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-xl shadow mb-4 transition">
        Fotoğraf Seç
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="image/*"
        />
      </label>

      {selectedFile && (
        <p className="mb-4 text-gray-700">{selectedFile.name}</p>
      )}

      <button
        onClick={handleUpload}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl shadow"
        disabled={!selectedFile}
      >
        Yükle
      </button>
    </div>
  );
};

export default UploadPage;
