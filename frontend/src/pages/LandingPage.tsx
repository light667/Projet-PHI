import { motion } from 'framer-motion';
import { ArrowRight, Bot, Code, Globe, Moon, Palette, Star, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider.js';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="stars-container opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <div className="star-layer-1 absolute top-0 left-0"></div>
        <div className="star-layer-2 absolute top-0 left-0"></div>
        <div className="star-layer-3 absolute top-0 left-0"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0"></div>
      
      {/* Absolute Header */}
      <header className="absolute top-0 w-full p-6 flex justify-end items-center z-50 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-full px-5 py-2.5 border border-slate-200 dark:border-white/10 shadow-sm">
           <button onClick={toggleLanguage} className="flex items-center gap-2 hover:opacity-70 transition font-semibold text-slate-800 dark:text-white">
              <Globe size={18} />
              <span className="uppercase text-sm">{i18n.language}</span>
           </button>
           <div className="w-[1px] h-5 bg-slate-300 dark:bg-white/20"></div>
           <button onClick={toggleTheme} className="hover:opacity-70 transition text-slate-800 dark:text-white">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[1400px] flex flex-col items-center pt-24 px-6 z-10 pb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center w-full flex flex-col items-center"
        >
          {/* Subtle badge */}
          <div className="mb-6 inline-flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-full px-5 py-2 text-sm font-semibold bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-slate-700 dark:text-zinc-300 shadow-sm">
             <Star size={16} className="text-yellow-500" />
             {t('hero.badge')}
          </div>

          {/* Floating Logo */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-[80px] rounded-full scale-[2] -z-10"></div>
            <img src="/logo.svg" alt="Company Logo" className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]" />
          </motion.div>

          {/* Title */}
          <h1 className="text-[5rem] md:text-[8rem] font-black tracking-tight mb-2 text-slate-900 dark:text-white drop-shadow-sm leading-none">
            {t('hero.title')}
          </h1>
          
          {/* Tagline */}
          <motion.p 
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="font-extrabold tracking-[0.25em] md:tracking-[0.4em] text-sm md:text-lg mt-2 mb-8 uppercase max-w-3xl px-4 text-red-500 dark:text-red-400 drop-shadow-md"
          >
            {t('hero.tagline')}
          </motion.p>

          {/* CTA Buttons - Linked to Auth */}
          <div className="flex flex-col sm:flex-row gap-5 mb-14 relative z-20 w-fit mx-auto">
            <Link to="/auth">
              <button className="bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 transition-colors shadow-2xl dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                {t('hero.cta_primary')} <ArrowRight size={22} />
              </button>
            </Link>
            <Link to="/auth">
              <button className="glass-bento px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-sm text-slate-800 dark:text-white">
                Log In
              </button>
            </Link>
          </div>

          {/* Abstract UI Preview Showcasing Portfolios */}
          <motion.div 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
             className="w-full max-w-6xl h-[380px] md:h-[450px] rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden relative flex flex-col items-center"
          >
             <div className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="px-4 py-1.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                   phi.dev/showcase
                </div>
                <div></div>
             </div>
             
             {/* Portfolios Mockups */}
             <div className="absolute inset-0 flex justify-center items-center gap-4 md:gap-8 pt-16 px-4">
                
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="hidden md:flex w-64 h-80 bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 flex-col rotate-[-6deg] overflow-hidden">
                   <img src="/mock1.png" alt="Dev Portfolio" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                </motion.div>

                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="w-72 h-[22rem] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-zinc-700 flex flex-col z-10 scale-100 md:scale-110 overflow-hidden relative">
                   <img src="/mock2.png" alt="Agency Portfolio" className="w-full h-full object-cover" />
                </motion.div>

                <motion.div animate={{ y: [-6, 6, -6], rotate: [6, 6.5, 6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="hidden md:flex w-64 h-80 bg-zinc-50 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 flex-col rotate-[6deg] overflow-hidden">
                   <img src="/mock3.png" alt="Creative Portfolio" className="w-full h-full object-cover hue-rotate-180 brightness-90 contrast-125" />
                </motion.div>

             </div>
          </motion.div>

        </motion.div>

        {/* Bento Grid Features */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-24 max-w-[1200px]">
          <div className="glass-bento p-10 flex flex-col justify-between gap-6 md:col-span-2 group hover:border-[#1E3A8A]/30 dark:hover:border-blue-500/50 transition-colors relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-[0.03] dark:opacity-[0.05] scale-[2] text-[#1E3A8A] dark:text-blue-500 group-hover:scale-[2.2] transition-transform duration-500">
              <Code size={200} />
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-[#1E3A8A] dark:text-blue-400 mb-6">
                 <Code size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('features.f1_title')}</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed max-w-md relative z-10">
                {t('features.f1_desc')}
              </p>
            </div>
          </div>

          <div className="glass-bento p-10 flex flex-col gap-6 group hover:border-[#EAB308]/50 dark:hover:border-yellow-500/50 transition-colors">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/40 rounded-2xl flex items-center justify-center text-[#EAB308] dark:text-yellow-500 mb-4">
               <Bot size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('features.f2_title')}</h3>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                {t('features.f2_desc')}
              </p>
            </div>
          </div>

          <div className="glass-bento p-10 flex flex-col md:flex-row gap-8 justify-between items-center md:col-span-3 group hover:border-[#DC2626]/30 dark:hover:border-red-500/50 transition-colors">
            <div className="flex-1">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-[#DC2626] dark:text-red-400 mb-6">
                 <Palette size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('features.f3_title')}</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed max-w-xl">
                {t('features.f3_desc')}
              </p>
            </div>
            <div className="flex gap-4 opacity-90 group-hover:opacity-100 transition-opacity">
               <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-inner flex items-center justify-center text-slate-400 dark:text-zinc-600">
                  <span className="font-bold text-xl">A</span>
               </div>
               <div className="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-xl flex items-center justify-center scale-110 -translate-y-2 text-[#1E3A8A] dark:text-blue-400">
                  <span className="font-bold text-3xl">B</span>
               </div>
               <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-inner flex items-center justify-center text-slate-400 dark:text-zinc-600">
                  <span className="font-bold text-xl">C</span>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-white/10 py-8 z-10 bg-slate-50/50 dark:bg-black/50 backdrop-blur-md mt-auto">
         <div className="text-center text-sm font-medium text-slate-500 dark:text-zinc-500">
           &copy; {new Date().getFullYear()} Phi. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
