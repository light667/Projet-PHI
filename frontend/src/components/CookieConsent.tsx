import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('phi-cookie-consent');
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('phi-cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('phi-cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[9999] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <button
            onClick={decline}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">We value your privacy</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
                We use cookies and analytics to improve your experience and measure site performance. Read our{' '}
                <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={accept}
                  className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:scale-105 transition-transform"
                >
                  Accept all
                </button>
                <button
                  onClick={decline}
                  className="px-5 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
