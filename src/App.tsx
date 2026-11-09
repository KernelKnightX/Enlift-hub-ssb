import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router';

import { lazy, Suspense, useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import AdminRoute from '@/components/AdminRoute';
import ProtectedRoute from '@/components/ProtectedRoute';
import GuestRoute from '@/components/GuestRoute';
import AppSeo from '@/components/seo/AppSeo';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

import LandingPage from '@/pages/LandingPage/LandingPage';

const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DirectPasswordResetPage = lazy(() => import('@/pages/DirectPasswordResetPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminMockTestsPage = lazy(() => import('@/pages/admin/AdminMockTestsPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PublicMockTestsPage = lazy(() => import('@/pages/MockTest/PublicMockTestsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage/AboutPage'));
const NDAMockTestPage = lazy(() => import('@/pages/MockTest/NDA/MockTestPage'));
const CDSMockTestPage = lazy(() => import('@/pages/MockTest/CDS/MockTestPage'));
const AFCATMockTestPage = lazy(() => import('@/pages/MockTest/AFCAT/MockTestPage'));
const AFCATTestInterface = lazy(() => import('@/pages/MockTest/AFCAT/TestInterface'));
const CDSTestAnalysisPage = lazy(() => import('@/pages/MockTest/CDS/TestAnalysisPage'));
const AFCATTestAnalysisPage = lazy(() => import('@/pages/MockTest/AFCAT/TestAnalysisPage'));

/** Legacy SSB / psychology practice URLs → mock test home */
function LegacyRedirect() {
  return <Navigate to="/dashboard" replace />;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppSeo />
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* -------- PUBLIC -------- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admissions" element={<Navigate to="/dashboard" replace />} />
            <Route path="/courses" element={<Navigate to="/dashboard" replace />} />
            <Route path="/mentorship" element={<Navigate to="/" replace />} />
            <Route path="/membership" element={<Navigate to="/" replace />} />
            <Route path="/blog" element={<Navigate to="/" replace />} />
            <Route path="/blog/*" element={<Navigate to="/" replace />} />
            <Route path="/ssb-info" element={<LegacyRedirect />} />
            <Route path="/ssb-about" element={<LegacyRedirect />} />
            <Route path="/ssb-process" element={<LegacyRedirect />} />
            <Route path="/ssb-qualities" element={<LegacyRedirect />} />
            <Route path="/ssb-lifestyle" element={<LegacyRedirect />} />
            <Route path="/ssb-preparation" element={<LegacyRedirect />} />
            <Route path="/ssb-lecturette" element={<LegacyRedirect />} />
            <Route path="/ssb-interview" element={<LegacyRedirect />} />
            <Route path="/ssb-group-discussion" element={<LegacyRedirect />} />
            <Route path="/ssb-gto" element={<LegacyRedirect />} />
            <Route path="/ssb-conference" element={<LegacyRedirect />} />

            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/direct-reset-password" element={<DirectPasswordResetPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="/english/*" element={<LegacyRedirect />} />
            <Route path="/english-test" element={<LegacyRedirect />} />
            <Route path="/listening/*" element={<LegacyRedirect />} />
            <Route path="/listening-test" element={<LegacyRedirect />} />
            <Route path="/speed-recognition/*" element={<LegacyRedirect />} />
            <Route path="/ppdt/*" element={<LegacyRedirect />} />
            <Route path="/tat/*" element={<LegacyRedirect />} />
            <Route path="/wat/*" element={<LegacyRedirect />} />
            <Route path="/opam/*" element={<LegacyRedirect />} />
            <Route path="/srt/*" element={<LegacyRedirect />} />
            <Route path="/paper-folding/*" element={<LegacyRedirect />} />
            <Route path="/oir/*" element={<LegacyRedirect />} />

            <Route path="/mock-tests" element={<PublicMockTestsPage />} />
            <Route path="/mock-test/nda/*" element={<NDAMockTestPage />} />
            <Route path="/mock-test/cds" element={<CDSMockTestPage />} />
            <Route path="/mock-test/afcat" element={<AFCATMockTestPage />} />

            <Route
              path="/mock-test/cds/test"
              element={
                <ProtectedRoute>
                  <AFCATTestInterface />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-test/cds/analysis"
              element={
                <ProtectedRoute>
                  <CDSTestAnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-test/afcat/test"
              element={
                <ProtectedRoute>
                  <AFCATTestInterface />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-test/afcat/analysis"
              element={
                <ProtectedRoute>
                  <AFCATTestAnalysisPage />
                </ProtectedRoute>
              }
            />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/mock" element={<AdminMockTestsPage />} />
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
