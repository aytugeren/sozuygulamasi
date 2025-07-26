import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import SlugPage from './pages/SlugPage';
import UploadPage from './pages/UploadPage';
import MessagePage from './pages/MessagePage';
import VideoPage from './pages/VideoPage';
import MainPage from './pages/MainPage';
import ProCheckout from './pages/ProCheckout';
import { QRCodeCanvas } from 'qrcode.react';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />} />

          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <DashboardPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro-odeme"
            element={
                <ProCheckout />
            }></Route>
        <Route path="/:slug" element={<SlugPage />} />
        <Route path="/:slug/photos" element={<UploadPage />} />
        <Route path="/:slug/messages" element={<MessagePage />} />
        <Route path="/:slug/video" element={<VideoPage />} />

        </Routes>
      </Router>

<div
  className="fixed bottom-4 right-4 p-2 rounded-full shadow-lg cursor-pointer hover:scale-105 transition bg-white"
  title="Bize kahve ısmarla ☕"
  onClick={() => window.open('https://coff.ee/erenevimmd', '_blank')}
>
  <div className="relative w-16 h-16">
    <QRCodeCanvas
      value="https://coff.ee/erenevimmd"
      size={64}
      bgColor="#ffffff"
      fgColor="#ef4444"
      level="H"
      includeMargin={false}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-[8px] font-bold text-red-600 bg-white bg-opacity-80 px-1 rounded">
        Destek Ol
      </span>
    </div>
  </div>
</div>

    </>
  );
}

export default App;
