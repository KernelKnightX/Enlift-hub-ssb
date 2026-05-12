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
import AdminMockTestsPage from '@/pages/admin/AdminMockTestsPage';
import AdminWATUploadPage from '@/pages/admin/AdminWATUploadPage';
import AdminSRTSUploadPage from '@/pages/admin/AdminSRTSUploadPage';
import AdminTATUploadPage from '@/pages/admin/AdminTATUploadPage';
import AdminPPDTUploadPage from '@/pages/admin/AdminPPDTUploadPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';
import AdminMagazinePage from '@/pages/admin/AdminMagazinePage';
import AdminEnglishUploadPage from '@/pages/admin/AdminEnglishUploadPage';
import AdminListeningUploadPage from '@/pages/admin/AdminListeningUploadPage';
import AdminSpeedRecognitionUploadPage from '@/pages/admin/AdminSpeedRecognitionUploadPage';
import DashboardPage from '@/pages/DashboardPage';
import MembershipPage from '@/pages/MembershipPage';
import MentorshipPage from '@/pages/MentorshipPage';
import SSBAboutPage from '@/pages/SSB/SSBAboutPage';
import SSBProcessPage from '@/pages/SSB/SSBProcessPage';
import SSBQualitiesPage from '@/pages/SSB/SSBQualitiesPage';
import SSBAspirantLifestylePage from '@/pages/SSB/SSBAspirantLifestylePage';
import SSBPreparationPage from '@/pages/SSB/SSBPreparationPage';
import SSBInterviewPage from '@/pages/SSB/SSBInterviewPage';
import SSBGroupDiscussionPage from '@/pages/SSB/SSBGroupDiscussionPage';
import SSBGTOPage from '@/pages/SSB/SSBGTOPage';
import SSBLecturettePage from '@/pages/SSB/SSBLecturettePage';
import SSBConferencePage from '@/pages/SSB/SSBConferencePage';
import BlogPage from '@/pages/Blog/BlogPage';
import SubscriptionPage from '@/pages/Subscription/SubscriptionPage';
import SubscriptionSuccessPage from '@/pages/Subscription/SubscriptionSuccessPage';
import EnglishInstructionPage from '@/pages/EnglishTest/InstructionPage';
import EnglishSetSelectionPage from '@/pages/EnglishTest/SetSelectionPage';
import EnglishGrammarVocabularyTestPage from '@/pages/EnglishTest/EnglishGrammarVocabularyTestPage';
import ListeningInstructionPage from '@/pages/ListeningTest/InstructionPage';
import ListeningSetSelectionPage from '@/pages/ListeningTest/SetSelectionPage';
import ListeningTestPage from '@/pages/ListeningTest/ListeningTestPage';
import SpeedRecognitionInstructionPage from '@/pages/SpeedRecognition/InstructionPage';
import SpeedRecognitionSetSelectionPage from '@/pages/SpeedRecognition/SetSelectionPage';
import SpeedRecognitionTestPage from '@/pages/SpeedRecognition/TestPage';

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

import PaperFoldingInstructionPage from '@/pages/PaperFoldingInstructionPage';
import PaperFoldingSetSelectionPage from '@/pages/PaperFoldingSetSelectionPage';
import PaperFoldingTestPage from '@/pages/PaperFoldingTestPage';

import CDSMockTestPage from '@/pages/MockTest/CDS/MockTestPage';
import AFCATMockTestPage from '@/pages/MockTest/AFCAT/MockTestPage';
import AFCATTestInterface from '@/pages/MockTest/AFCAT/TestInterface';
import NDAMockTestPage from '@/pages/MockTest/NDA/MockTestPage';
import NDATestInterface from '@/pages/MockTest/NDA/TestInterface';
import MockTestListingPage from '@/pages/MockTest/MockTestListingPage';
import CDSTestInterface from '@/pages/MockTest/CDS/TestInterface';
import CDSTestAnalysisPage from '@/pages/MockTest/CDS/TestAnalysisPage';
import AFCATTestAnalysisPage from '@/pages/MockTest/AFCAT/TestAnalysisPage';
import NDATestAnalysisPage from '@/pages/MockTest/NDA/TestAnalysisPage';

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
          <Route path="/admissions" element={<Navigate to="/mentorship" replace />} />
          <Route path="/courses" element={<Navigate to="/mentorship" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/ssb-info" element={<BlogPage />} />
          <Route path="/ssb-about" element={<SSBAboutPage />} />
          <Route path="/ssb-process" element={<SSBProcessPage />} />
          <Route path="/ssb-qualities" element={<SSBQualitiesPage />} />
          <Route path="/ssb-lifestyle" element={<SSBAspirantLifestylePage />} />

          <Route path="/ssb-preparation" element={<SSBPreparationPage />} />
          <Route path="/ssb-lecturette" element={<SSBLecturettePage />} />
          <Route path="/ssb-interview" element={<SSBInterviewPage />} />
          <Route path="/ssb-group-discussion" element={<SSBGroupDiscussionPage />} />
          <Route path="/ssb-gto" element={<SSBGTOPage />} />
          <Route path="/ssb-conference" element={<SSBConferencePage />} />

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

          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />

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

          {/* -------- ENGLISH -------- */}
          <Route
            path="/english/instructions"
            element={
              <ProtectedRoute>
                <EnglishInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/english/sets"
            element={
              <ProtectedRoute>
                <EnglishSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/english/test"
            element={
              <ProtectedRoute>
                <EnglishGrammarVocabularyTestPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy route redirect */}
          <Route path="/english-test" element={<Navigate to="/english/instructions" replace />} />

          {/* -------- LISTENING -------- */}
          <Route
            path="/listening/instructions"
            element={
              <ProtectedRoute>
                <ListeningInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listening/sets"
            element={
              <ProtectedRoute>
                <ListeningSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listening/test"
            element={
              <ProtectedRoute>
                <ListeningTestPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy route redirect */}
          <Route path="/listening-test" element={<Navigate to="/listening/instructions" replace />} />

          {/* -------- SPEED RECOGNITION -------- */}
          <Route
            path="/speed-recognition/instructions"
            element={
              <ProtectedRoute>
                <SpeedRecognitionInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/speed-recognition/sets"
            element={
              <ProtectedRoute>
                <SpeedRecognitionSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/speed-recognition/test"
            element={
              <ProtectedRoute>
                <SpeedRecognitionTestPage />
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

          {/* -------- PAPER FOLDING -------- */}
          <Route
            path="/paper-folding/instructions"
            element={
              <ProtectedRoute>
                <PaperFoldingInstructionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paper-folding/sets"
            element={
              <ProtectedRoute>
                <PaperFoldingSetSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paper-folding/test"
            element={
              <ProtectedRoute>
                <PaperFoldingTestPage />
              </ProtectedRoute>
            }
          />

          {/* -------- MOCK TESTS -------- */}
          <Route
            path="/mock-tests"
            element={
              <ProtectedRoute>
                <MockTestListingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test/nda"
            element={
              <ProtectedRoute>
                <NDAMockTestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test/cds"
            element={
              <ProtectedRoute>
                <CDSMockTestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test/afcat"
            element={
              <ProtectedRoute>
                <AFCATMockTestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test/nda/test"
            element={
              <ProtectedRoute>
                <NDATestInterface />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test/nda/analysis"
            element={
              <ProtectedRoute>
                <NDATestAnalysisPage />
              </ProtectedRoute>
            }
          />

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

          {/* -------- ADMIN (PROTECTED) -------- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/wat" element={<AdminWATUploadPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/admin/magazine" element={<AdminMagazinePage />} />
            <Route path="/admin/srt" element={<AdminSRTSUploadPage />} />
            <Route path="/admin/mock" element={<AdminMockTestsPage />} />
            <Route path="/admin/tat" element={<AdminTATUploadPage />} />
            <Route path="/admin/ppdt" element={<AdminPPDTUploadPage />} />
            <Route path="/admin/english" element={<AdminEnglishUploadPage />} />
            <Route path="/admin/listening" element={<AdminListeningUploadPage />} />
            <Route path="/admin/speed-recognition" element={<AdminSpeedRecognitionUploadPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
