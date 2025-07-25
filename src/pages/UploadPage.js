// src/pages/PhotoPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../databases/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const PhotoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchUploadedCount = useCallback(async () => {
    const snapshot = await getDocs(collection(db, 'photos', slug, 'entries'));
    setUploadedCount(snapshot.size);
  }, [slug]);

  useEffect(() => {
    fetchUploadedCount();
  }, [fetchUploadedCount]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`Geçersiz dosya formatı: ${file.name}`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert(`Dosya çok büyük (max 50MB): ${file.name}`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "soz-uygulamasi");
      data.append("folder", slug);

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dyodwyfu4/auto/upload", {
          method: "POST",
          body: data
        });

        const result = await res.json();

        if (result.secure_url) {
          await addDoc(collection(db, 'photos', slug, 'entries'), {
            url: result.secure_url,
            resource_type: result.resource_type,
            uploadedAt: new Date(),
          });
          await fetchUploadedCount();
        } else {
          console.error("Yükleme başarısız:", result);
        }
      } catch (error) {
        console.error("Cloudinary yükleme hatası:", error);
      }

      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setUploadSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6">📤 Medya Yükle</h1>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-sm text-blue-600 hover:underline"
      >
        ← Geri Dön
      </button>

      <label className="cursor-pointer inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-xl shadow mb-4 transition">
        Dosya Seç (Fotoğraf / Video)
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="image/*,video/*"
          multiple
        />
      </label>

      {selectedFiles.length > 0 && (
        <ul className="mb-4 text-gray-700">
          {selectedFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={handleUpload}
        className={`py-2 px-4 rounded-xl shadow text-white ${uploadSuccess ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}
        disabled={selectedFiles.length === 0 || uploading}
      >
        {uploadSuccess ? '✅ Yüklendi!' : uploading ? `Yükleniyor... %${progress}` : 'Yükle'}
      </button>

      {uploading && (
        <div className="mt-4 w-full max-w-sm">
          <div className="bg-gray-200 h-4 rounded">
            <div
              className="bg-green-500 h-4 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Yükleniyor: %{progress}</p>
        </div>
      )}

      <div className="mt-6 text-gray-700">
        Toplam yüklenen içerik: <strong>{uploadedCount}</strong>
      </div>
    </div>
  );
};

export default PhotoPage;
