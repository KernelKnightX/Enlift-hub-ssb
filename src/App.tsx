import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router';

import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AdminRoute from '@/components/AdminRoute';

import LandingPage from '@/pages/LandingPage/LandingPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DirectPasswordResetPage from '@/pages/DirectPasswordResetPage';
import TermsPage from '@/pages/TermsPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminWATUploadPage from '@/pages/admin/AdminWATUploadPage';
import AdminSRTSUploadPage from '@/pages/admin/AdminSRTSUploadPage';
import AdminTATUploadPage from '@/pages/admin/AdminTATUploadPage';
import AdminPPDTUploadPage from '@/pages/admin/AdminPPDTUploadPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';
import DashboardPage from '@/pages/DashboardPage';
import MembershipPage from '@/pages/MembershipPage';
import MentorshipPage from '@/pages/MentorshipPage';
import SSBAboutPage from '@/pages/SSB/SSBAboutPage';
import SSBProcessPage from '@/pages/SSB/SSBProcessPage';
import SSBQualitiesPage from '@/pages/SSB/SSBQualitiesPage';
import SSBAspirantLifestylePage from '@/pages/SSB/SSBAspirantLifestylePage';
import SSBPreparationPage from '@/pages/SSB/SSBPreparationPage';
import BlogPage from '@/pages/Blog/BlogPage';

import PPDTInstructionPage from '@/pages/PPDT/InstructionPage';
import PPDTSetSelectionPage from '@/pages/PPDT/SetSelectionPage';
import PPDTTestPage from '@/pages/PPDT/TestPage';

import TATInstructionPage from '@/pages/TAT/InstructionPage';
import TATSetSelectionPage from '@/pages/TAT/SetSelectionPage';
import TATTestPage from '@/pages/TAT/TestPage';

import WATInstructionPage from '@/pages/WAT/InstructionPage';
import WATSetSelectionPage from '@/pages/WAT/SetSelectionPage';
import WATTestPage from '@/pages/WAT/TestPage';

import SRTInstructionPage from '@/pages/SRT/InstructionPage';
import SRTSetSelectionPage from '@/pages/SRT/SetSelectionPage';
import SRTTestPage from '@/pages/SRT/TestPage';

/* -------------------- ROUTE GUARDS -------------------- */

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

/* -------------------- SCROLL TO TOP COMPONENT -------------------- */

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

/* -------------------- APP -------------------- */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* -------- PUBLIC -------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/ssb-info" element={<BlogPage />} />
          <Route path="/ssb-about" element={<SSBAboutPage />} />
          <Route path="/ssb-process" element={<SSBProcessPage />} />
          <Route path="/ssb-qualities" element={<SSBQualitiesPage />} />
          <Route path="/ssb-lifestyle" element={<SSBAspirantLifestylePage />} />

          <Route path="/ssb-preparation" element={<SSBPreparationPage />} />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/direct-reset-password" element={<DirectPasswordResetPage />} />

          <Route path="/terms" element={<TermsPage />} />

          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* -------- USER DASHBOARD -------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* -------- MEMBERSHIP / MENTORSHIP (PUBLIC) -------- */}
          <Route path="/mentorship" element={<MentorshipPage />} />

          {/* -------- MEMBERSHIP (PROTECTED) -------- */}
          <Route
            path="/membership"
            element={
              <ProtectedRoute>
                <MembershipPage />
              </ProtectedRoute>
            }
          />

          {/* -------- PPDT -------- */}
          <Route
            path="/ppdt/instructions"
            element={
              <ProtectedRoute>
                <PPDTInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ppdt/sets"
            element={
              <ProtectedRoute>
                <PPDTSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ppdt/test"
            element={
              <ProtectedRoute>
                <PPDTTestPage />
              </ProtectedRoute>
            }
          />

          {/* -------- TAT -------- */}
          <Route
            path="/tat/instructions"
            element={
              <ProtectedRoute>
                <TATInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tat/sets"
            element={
              <ProtectedRoute>
                <TATSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tat/test"
            element={
              <ProtectedRoute>
                <TATTestPage />
              </ProtectedRoute>
            }
          />

          {/* -------- WAT -------- */}
          <Route
            path="/wat/instructions"
            element={
              <ProtectedRoute>
                <WATInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wat/sets"
            element={
              <ProtectedRoute>
                <WATSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wat/test"
            element={
              <ProtectedRoute>
                <WATTestPage />
              </ProtectedRoute>
            }
          />

          {/* -------- SRT -------- */}
          <Route
            path="/srt/instructions"
            element={
              <ProtectedRoute>
                <SRTInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/srt/sets"
            element={
              <ProtectedRoute>
                <SRTSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/srt/test"
            element={
              <ProtectedRoute>
                <SRTTestPage />
              </ProtectedRoute>
            }
          />

          {/* -------- ADMIN (PROTECTED) -------- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/wat" element={<AdminWATUploadPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/admin/srt" element={<AdminSRTSUploadPage />} />
            <Route path="/admin/tat" element={<AdminTATUploadPage />} />
            <Route path="/admin/ppdt" element={<AdminPPDTUploadPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
