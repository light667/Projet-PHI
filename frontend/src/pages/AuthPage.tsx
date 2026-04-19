import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!isLogin && !termsAccepted) {
        throw new Error("You must accept the Terms of Service and Privacy Policy to create an account.");
      }

      if (isLogin) {
        // MOCK BYPASS
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        // MOCK BYPASS
        setTimeout(() => navigate('/dashboard'), 500);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') setErrorMsg('This email is already registered.');
      else if (error.code === 'auth/invalid-credential') setErrorMsg('Invalid email or password.');
      else if (error.code === 'auth/weak-password') setErrorMsg('Password should be at least 6 characters.');
      else setErrorMsg(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // MOCK BYPASS
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(error.message || 'Error initializing Google Sign-In.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative font-sans overflow-hidden bg-slate-50 dark:bg-zinc-950">

      {/* Background Ambience */}
      <div className="stars-container opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <div className="star-layer-1 absolute top-0 left-0"></div>
        <div className="star-layer-2 absolute top-0 left-0"></div>
        <div className="star-layer-3 absolute top-0 left-0"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0"></div>

      <Link to="/" className="absolute top-8 left-8 z-50 text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300 font-semibold text-sm transition">
        &larr; Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 md:p-10 glass-bento relative z-10 flex flex-col items-center mx-4"
      >
        <Link to="/" className="mb-6">
          <img src="/logo.svg" alt="Phi Logo" className="w-16 h-16 object-contain drop-shadow-md" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 text-center max-w-xs">
          {isLogin
            ? 'Enter your credentials to access your workspace.'
            : 'Start building your professional identity today.'}
        </p>

        {errorMsg && (
          <div className="w-full p-3 mb-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium text-center border border-red-200 dark:border-red-900/50">
            {errorMsg}
          </div>
        )}

        {/* Google SSO Button */}
        <button
          onClick={handleGoogleAuth}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors shadow-sm mb-6"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
            Continue with Google
          </span>
        </button>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1"></div>
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider">or email</span>
          <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1"></div>
        </div>

        {/* Minimalist Form */}
        <form onSubmit={handleAuth} className="w-full flex flex-col gap-4">
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-10 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-slate-400" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-10 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-10 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>

          {!isLogin && (
            <div className="flex items-start gap-3 mt-1 px-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 cursor-pointer accent-slate-900 dark:accent-white"
              />
              <label htmlFor="terms" className="text-xs text-slate-500 dark:text-zinc-400 leading-tight">
                I agree to the <Link to="/terms" target="_blank" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-blue-500 hover:underline">Privacy Policy</Link>.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl py-3 mt-2 font-bold text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-500 dark:text-zinc-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
              setTermsAccepted(false);
            }}
            className="font-bold text-slate-900 dark:text-white hover:underline transition"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>

      </motion.div>
    </div>
  );
}
