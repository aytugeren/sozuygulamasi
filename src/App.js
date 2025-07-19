import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/Sections/HeroSection';
import ButtonsSection from './components/Sections/ButtonSection';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import MessagePage from './pages/MessagePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <ButtonsSection />
          </>
        } />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/message" element={<MessagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
