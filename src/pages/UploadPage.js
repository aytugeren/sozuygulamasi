// src/pages/PhotoPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../databases/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const PhotoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedForDownload, setSelectedForDownload] = useState([]);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const fetchUploadedCount = useCallback(async () => {
    const snapshot = await getDocs(collection(db, 'photos', slug, 'entries'));
    setUploadedCount(snapshot.size);
  }, [slug]);

  const fetchUploadedItems = useCallback(async () => {
    const snapshot = await getDocs(collection(db, 'photos', slug, 'entries'));
    const items = snapshot.docs.map(doc => doc.data());
    setMediaItems(items);
  }, [slug]);

  const toggleSelection = (url) => {
    setSelectedForDownload((prev) =>
      prev.includes(url)
        ? prev.filter(item => item !== url)
        : [...prev, url]
    );
  };

  const downloadSelectedFiles = async () => {
    for (let url of selectedForDownload) {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = url.split('/').pop().split('?')[0];
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setSelectedForDownload([]);
  };

  useEffect(() => {
    fetchUploadedCount();
    fetchUploadedItems();
  }, [fetchUploadedCount, fetchUploadedItems]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    const forbiddenExtensions = ['exe', 'bat', 'js', 'sh', 'php', 'py', 'pl', 'rb', 'jar', 'msi', 'apk', 'cmd', 'com', 'scr', 'vbs', 'ps1', 'cpl', 'gadget', 'wsf'];
    const MAX_SIZE = 100 * 1024 * 1024;

    const validFiles = files.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (forbiddenExtensions.includes(ext)) {
        alert(`Tehlikeli dosya uzantısı engellendi: ${file.name}`);
        return false;
      }
      if (!validTypes.includes(file.type)) {
        alert(`Geçersiz dosya formatı: ${file.name}`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        alert(`Dosya çok büyük (max 100 MB): ${file.name}`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (!executeRecaptcha) {
      alert('reCAPTCHA yüklenemedi. Lütfen sayfayı yenileyin.');
      return;
    }

    const token = await executeRecaptcha('upload');
    if (!token) {
      alert('reCAPTCHA doğrulaması başarısız oldu.');
      return;
    }

    setUploading(true);
    setProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const data = new FormData();
      const fileName = file.name.replace(/\s+/g, '-');
      const cloudinaryName = process.env.REACT_APP_CLOUNDINARY_CLOUD_NAME;
      data.append("file", file);
      data.append("upload_preset", "soz-uygulamasi");
      data.append("folder", slug);
      data.append("public_id", `${slug}/${Date.now()}-${fileName}`);
      data.append("moderation", "webpurify");

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/auto/upload`, {
          method: "POST",
          body: data
        });
        const result = await res.json();

        if (result.moderation && result.moderation[0] && result.moderation[0].status === 'rejected') {
          alert('Yüklenen dosya uygunsuz içerik olarak işaretlendi ve reddedildi.');
          continue;
        }
        if (result.secure_url) {
          await addDoc(collection(db, 'photos', slug, 'entries'), {
            url: result.secure_url,
            public_id: result.public_id,
            original_filename: result.original_filename,
            resource_type: result.resource_type,
            uploadedAt: new Date(),
            recaptchaToken: token
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
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6">📄 Medya Yükle</h1>
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-sm text-blue-600 hover:underline">← Geri Dön</button>
      <label className="cursor-pointer inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-xl shadow mb-4 transition">
        Dosya Seç (Fotoğraf / Video)
        <input type="file" onChange={handleChange} className="hidden" accept="image/*,video/*" multiple />
      </label>
      {selectedFiles.length > 0 && (
        <ul className="mb-4 text-gray-700">
          {selectedFiles.map((file, index) => <li key={index}>{file.name}</li>)}
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
            <div className="bg-green-500 h-4 rounded" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Yükleniyor: %{progress}</p>
        </div>
      )}
      <div className="mt-6 text-gray-700">
        Toplam yüklenen içerik: <strong>{uploadedCount}</strong>
      </div>
      {selectedForDownload.length > 0 && (
        <div className="mb-4">
          <button
            onClick={downloadSelectedFiles}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Seçili {selectedForDownload.length} öğeyi indir
          </button>
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {mediaItems.map((item, idx) => (
          <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow-md relative">
            <input
              type="checkbox"
              checked={selectedForDownload.includes(item.url)}
              onChange={() => toggleSelection(item.url)}
              className="absolute top-2 left-2 w-5 h-5"
            />
            {item.resource_type === 'image' ? (
              <img src={item.url} alt={item.original_filename} className="rounded-md cursor-pointer w-full h-48 object-cover" onClick={() => setSelectedItem(item)} />
            ) : (
              <video controls className="rounded-md w-full h-48 object-cover" src={item.url} />
            )}
            <div className="flex justify-between mt-2 text-sm">
              <button onClick={() => setSelectedItem(item)} className="text-blue-600 hover:underline">Yakından Bak</button>
              <a href={item.url} download className="text-green-600 hover:underline">İndir</a>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-lg max-w-full max-h-full overflow-auto relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-2 right-2 text-white-900 text-2xl">✕</button>
            {selectedItem.resource_type === 'image' ? (
              <img src={selectedItem.url} alt={selectedItem.original_filename} className="max-w-full max-h-[80vh] rounded" />
            ) : (
              <video controls src={selectedItem.url} className="max-w-full max-h-[80vh] rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoPage;
