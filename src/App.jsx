import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import GlobalHeader from './components/GlobalHeader';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KYC from './pages/KYC';
import BankDetails from './pages/BankDetails';
import PMAY from './pages/PMAY';
import PersonalDetails from './pages/PersonalDetails';
import Employment from './pages/Employment';
import Category from './pages/Category';
import CoApplicant from './pages/CoApplicant';
import Documents from './pages/Documents';
import Review from './pages/Review';
import EMDPayment from './pages/EMDPayment';
import FlatSelection from './pages/FlatSelection';
import FlatLock from './pages/FlatLock';
import ConfirmationPayment from './pages/ConfirmationPayment';
import BookingConfirmed from './pages/BookingConfirmed';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="app-card page-enter rounded-3xl px-8 py-6 text-center text-slate-600">
          Loading your session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isDark, isMhdc } = useTheme();

  const textClass = isDark ? 'text-slate-100' : isMhdc ? 'text-[#323232]' : 'text-slate-950';

  return (
    <div className={`relative min-h-screen overflow-hidden ${textClass}`}>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen">
        <GlobalHeader />
        <main className="px-3 pb-6 pt-1 sm:px-5 sm:pb-8 sm:pt-2 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/application/1" element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            } />
            <Route path="/application/2" element={
              <ProtectedRoute>
                <BankDetails />
              </ProtectedRoute>
            } />
            <Route path="/application/3" element={
              <ProtectedRoute>
                <PMAY />
              </ProtectedRoute>
            } />
            <Route path="/application/4" element={
              <ProtectedRoute>
                <PersonalDetails />
              </ProtectedRoute>
            } />
            <Route path="/application/5" element={
              <ProtectedRoute>
                <Employment />
              </ProtectedRoute>
            } />
            <Route path="/application/6" element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            } />
            <Route path="/application/7" element={
              <ProtectedRoute>
                <CoApplicant />
              </ProtectedRoute>
            } />
            <Route path="/application/8" element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/application/9" element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            } />
            <Route path="/application/10" element={
              <ProtectedRoute>
                <EMDPayment />
              </ProtectedRoute>
            } />
            <Route path="/application/11" element={
              <ProtectedRoute>
                <FlatSelection />
              </ProtectedRoute>
            } />
            <Route path="/application/12" element={
              <ProtectedRoute>
                <FlatLock />
              </ProtectedRoute>
            } />
            <Route path="/application/13" element={
              <ProtectedRoute>
                <ConfirmationPayment />
              </ProtectedRoute>
            } />
            <Route path="/application/14" element={
              <ProtectedRoute>
                <BookingConfirmed />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
