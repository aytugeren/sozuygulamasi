import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import SlugPage from './pages/SlugPage';
import UploadPage from './pages/UploadPage';
import MessagePage from './pages/MessagePage';
import VideoPage from './pages/VideoPage';

function App() {
  const { user } = useAuth();

  return (
    <>
      <Router>
        <Routes>
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

        <Route path="/u/:userId/:slug" element={<SlugPage />} />
        <Route path="/u/:userId/:slug/photos" element={<UploadPage />} />
        <Route path="/u/:userId/:slug/messages" element={<MessagePage />} />
        <Route path="/u/:userId/:slug/video" element={<VideoPage />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
