import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-white px-6 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <Ghost size={80} className="text-slate-300 dark:text-zinc-700" />
        </motion.div>

        <h1 className="text-[7rem] md:text-[10rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-zinc-600 mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl font-bold text-slate-700 dark:text-zinc-300 mb-2">
          Page not found
        </p>
        <p className="text-sm text-slate-500 dark:text-zinc-500 mb-10 max-w-sm">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <Link to="/">
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl">
            <ArrowLeft size={18} /> Back to Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
