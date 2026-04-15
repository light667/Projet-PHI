import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import CookieConsent from './components/CookieConsent.js';
import { trackPageView } from './lib/firebase.js';

// Lazy-loaded pages for code splitting & performance
const LandingPage = lazy(() => import('./pages/LandingPage.js'));
const AuthPage = lazy(() => import('./pages/AuthPage.js'));
const Dashboard = lazy(() => import('./pages/Dashboard.js'));
const Builder = lazy(() => import('./pages/Builder.js'));
const Privacy = lazy(() => import('./pages/Privacy.js'));
const Terms = lazy(() => import('./pages/Terms.js'));
const NotFound = lazy(() => import('./pages/NotFound.js'));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
        <span className="text-sm text-zinc-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}

// Route protection wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
}

// Analytics: track page views on route change
function AnalyticsTracker() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  
  return null;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="phi-ui-theme">
      <AuthProvider>
        <Router>
          <AnalyticsTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                } 
              />
              {/* Catch-all: 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieConsent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
