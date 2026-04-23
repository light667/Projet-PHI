import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { apiUrl } from '../lib/api.js';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { 
  Sparkles, Grid, ArrowRight, LayoutTemplate, Bot, 
  CreditCard, MessageSquare
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [credits, setCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Utilisateur';

  // Simulation de récupération des crédits (à connecter au vrai backend plus tard)
  useEffect(() => {
    const fetchCredits = async () => {
      const uid = user?.uid;
      const q = uid ? `?userId=${encodeURIComponent(uid)}` : '';
      try {
        const res = await fetch(apiUrl(`/api/credits/balance${q}`), {
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.balance !== undefined) {
             setCredits(data.balance);
             setLoadingCredits(false);
             return;
          }
        }
        setCredits(50);
        setLoadingCredits(false);
      } catch (e) {
        setCredits(50);
        setLoadingCredits(false);
      }
    };
    fetchCredits();
  }, [user?.uid]);

  return (
    <div className="pb-8 max-w-5xl mx-auto">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[24px] p-8 md:p-10 mb-8 border border-slate-800 shadow-lg">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[10%] w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {t('dashboard.welcome')}, <span className="text-indigo-400">{displayName}</span> 👋
            </h1>
            <p className="text-slate-300 font-medium">{t('dashboard.welcome_sub')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Link to="/dashboard/credits">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3 rounded-[16px] transition-colors cursor-pointer flex items-center gap-4">
                <div>
                  <div className="text-xs text-white/70 font-semibold mb-0.5 uppercase tracking-wider">{t('dashboard.credits_remaining')}</div>
                  <div className="text-2xl font-black text-white leading-none">
                    {loadingCredits ? <span className="animate-pulse">--</span> : credits} <span className="text-sm font-bold text-white/50">CR</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <CreditCard size={20} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* PILIER 1 : COACH IA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] p-8 relative overflow-hidden group hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 flex flex-col"
        >
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-purple-600 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
             <MessageSquare size={200} />
          </div>
          
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
            <Bot size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-[var(--text)] mb-3">{t('dashboard.coach_title')}</h2>
          <p className="text-[var(--text2)] leading-relaxed mb-8 flex-1">
            {t('dashboard.coach_desc')}
          </p>

          <Link to="/dashboard/coach">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {t('dashboard.coach_cta')} <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>

        {/* PILIER 2 : PORTFOLIOS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] p-8 relative overflow-hidden group hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col"
        >
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-blue-600 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
             <Grid size={200} />
          </div>
          
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            <LayoutTemplate size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-[var(--text)] mb-3">{t('dashboard.portfolio_title')}</h2>
          <p className="text-[var(--text2)] leading-relaxed mb-8 flex-1">
            {t('dashboard.portfolio_desc')}
          </p>

          <Link to="/dashboard/create">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {t('dashboard.portfolio_cta')} <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>

      </div>

      {/* CHOIX DU MODE DE CRÉATION - SECTION FACTU */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[var(--text)]">{t('dashboard.creation_mode')}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Card */}
        <Link to="/dashboard/create/template" className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[20px] p-6 hover:shadow-md transition-shadow cursor-pointer block relative">
          <div className="absolute top-6 right-6 text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 py-1 px-3 rounded-full border border-[var(--border-color)]">
            {t('dashboard.credits_cost_template')}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl">
              <LayoutTemplate size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">{t('dashboard.template_mode')}</h3>
              <p className="text-sm text-[var(--text2)] mt-1">{t('dashboard.template_mode_desc')}</p>
            </div>
          </div>
        </Link>

        {/* IA Card */}
        <Link to="/dashboard/create/ai" className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[20px] p-6 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer block">
          <div className="absolute top-6 right-6 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 py-1 px-3 rounded-full border border-indigo-200 dark:border-indigo-800 z-10">
            {t('dashboard.credits_cost_ai')}
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">{t('dashboard.ai_mode')}</h3>
              <p className="text-sm text-[var(--text2)] mt-1">{t('dashboard.ai_mode_desc')}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {t('dashboard.ai_cta')} <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </div>
  );
}
