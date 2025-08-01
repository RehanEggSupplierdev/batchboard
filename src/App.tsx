import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import PagesManagementPage from './pages/PagesManagementPage';
import PageEditorPage from './pages/PageEditorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/:studentId" element={<StudentProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
          <Route path="/dashboard/change-password" element={<ChangePasswordPage />} />
          <Route path="/dashboard/pages" element={<PagesManagementPage />} />
          <Route path="/dashboard/pages/new" element={<PageEditorPage />} />
          <Route path="/dashboard/pages/edit/:pageId" element={<PageEditorPage />} />
          
          {/* Placeholder routes - will be implemented in next phase */}
          <Route path="/dashboard/media" element={<div>Media Library - Coming Soon</div>} />
          <Route path="/admin" element={<div>Admin Panel - Coming Soon</div>} />
          
          {/* 404 fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;