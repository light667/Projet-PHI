import { motion, useInView } from 'framer-motion';
import { ArrowRight, Bot, Briefcase, Check, ChevronRight, Code, FileText, Globe, GraduationCap, Languages, Mic, Moon, Palette, Sparkles, Star, Sun, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider.js';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

/* ===== Reusable Animated Section Wrapper ===== */
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ===== Section Badge ===== */
function SectionBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-full px-5 py-2 text-sm font-semibold bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm text-slate-600 dark:text-zinc-400 shadow-sm mb-6">
      <Icon size={16} className="text-blue-500" />
      {text}
    </div>
  );
}

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [yearly, setYearly] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* ========== BACKGROUND AMBIENCE ========== */}
      <div className="stars-container opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <div className="star-layer-1 absolute top-0 left-0"></div>
        <div className="star-layer-2 absolute top-0 left-0"></div>
        <div className="star-layer-3 absolute top-0 left-0"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* ========== STICKY NAVBAR ========== */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl px-6 py-3 border border-slate-200/80 dark:border-zinc-800/80 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Phi" className="w-8 h-8 object-contain" />
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Phi</span>
            </Link>
            
            {/* Nav Links (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">{t('nav.features')}</a>
              <a href="#pricing" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">{t('nav.pricing')}</a>
              <a href="#templates" className="text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">{t('nav.templates')}</a>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">
                <Globe size={16} />
                <span className="uppercase">{i18n.language}</span>
              </button>
              <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition rounded-lg">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <div className="w-px h-5 bg-slate-200 dark:bg-zinc-700 hidden sm:block"></div>
              <Link to="/auth" className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">
                {t('nav.login')}
              </Link>
              <Link to="/auth">
                <button className="bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-md">
                  {t('nav.get_started')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="w-full max-w-7xl flex flex-col items-center pt-32 md:pt-40 px-6 z-10 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center w-full flex flex-col items-center"
        >
          <SectionBadge icon={Sparkles} text={t('hero.badge')} />

          {/* Floating Logo */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-[80px] rounded-full scale-[2.5] -z-10"></div>
            <img src="/logo.svg" alt="Phi Logo" className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]" />
          </motion.div>

          {/* Title */}
          <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white mb-6 max-w-5xl">
            {t('hero.title_line1')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              {t('hero.title_highlight')}
            </span>
            <br />{t('hero.title_line2')}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10 font-medium">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 relative z-20">
            <Link to="/auth">
              <button className="group bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-all shadow-2xl dark:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02]">
                {t('hero.cta_primary')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#dual">
              <button className="group bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-slate-200 dark:border-zinc-800 px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-3 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600 transition-all shadow-sm hover:scale-[1.02]">
                {t('hero.cta_secondary')}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>

          {/* Showcase Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-5xl aspect-[16/9] md:aspect-[2/1] rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden relative"
          >
            <div className="w-full flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="px-4 py-1 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono text-slate-500 dark:text-zinc-500">phi-org.web.app</div>
              <div></div>
            </div>
            
            <div className="absolute inset-0 flex justify-center items-center gap-4 md:gap-6 pt-14 px-4">
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="hidden md:block w-56 h-72 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 rotate-[-6deg] overflow-hidden">
                <img src="/mock1.png" alt="Portfolio 1" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="w-64 h-80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-zinc-700 z-10 scale-100 md:scale-110 overflow-hidden">
                <img src="/mock2.png" alt="Portfolio 2" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="hidden md:block w-56 h-72 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 rotate-[6deg] overflow-hidden">
                <img src="/mock3.png" alt="Portfolio 3" className="w-full h-full object-cover hue-rotate-180 brightness-90 contrast-125" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== DUAL PRODUCT SECTION ========== */}
      <section id="dual" className="w-full max-w-7xl px-6 py-24 md:py-32 z-10">
        <AnimatedSection className="text-center mb-16">
          <SectionBadge icon={Zap} text={t('dual.section_badge')} />
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            {t('dual.section_badge')}
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Portfolio Builder */}
          <AnimatedSection delay={0.1}>
            <div className="group h-full p-8 md:p-10 rounded-[2rem] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-[0.03] dark:opacity-[0.04] scale-[3] text-blue-500 group-hover:scale-[3.5] transition-transform duration-700">
                <Code size={200} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                  <Code size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">{t('dual.portfolio_title')}</h3>
                <p className="text-slate-500 dark:text-zinc-400 leading-relaxed mb-8">{t('dual.portfolio_desc')}</p>
                <ul className="space-y-3">
                  {['portfolio_f1', 'portfolio_f2', 'portfolio_f3', 'portfolio_f4'].map((key) => (
                    <li key={key} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-zinc-300">
                      <Check size={16} className="text-blue-500 flex-shrink-0" />
                      {t(`dual.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* AI Coach */}
          <AnimatedSection delay={0.2}>
            <div className="group h-full p-8 md:p-10 rounded-[2rem] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500/40 transition-all duration-500 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-[0.03] dark:opacity-[0.04] scale-[3] text-purple-500 group-hover:scale-[3.5] transition-transform duration-700">
                <Bot size={200} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                  <Bot size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">{t('dual.coach_title')}</h3>
                <p className="text-slate-500 dark:text-zinc-400 leading-relaxed mb-8">{t('dual.coach_desc')}</p>
                <ul className="space-y-3">
                  {['coach_f1', 'coach_f2', 'coach_f3', 'coach_f4'].map((key) => (
                    <li key={key} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-zinc-300">
                      <Check size={16} className="text-purple-500 flex-shrink-0" />
                      {t(`dual.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== FEATURES BENTO GRID ========== */}
      <section id="features" className="w-full max-w-7xl px-6 py-24 md:py-32 z-10">
        <AnimatedSection className="text-center mb-16">
          <SectionBadge icon={Star} text={t('features.badge')} />
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 max-w-3xl mx-auto leading-tight">
            {t('features.title')}
          </h2>
          <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">{t('features.subtitle')}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Palette, color: 'blue', key: 'f1' },
            { icon: Mic, color: 'amber', key: 'f2' },
            { icon: FileText, color: 'green', key: 'f3' },
            { icon: Briefcase, color: 'indigo', key: 'f4' },
            { icon: GraduationCap, color: 'rose', key: 'f5' },
            { icon: Languages, color: 'cyan', key: 'f6' },
          ].map((feature, i) => (
            <AnimatedSection key={feature.key} delay={i * 0.08}>
              <div className={`group h-full p-8 rounded-[1.5rem] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:border-${feature.color}-300 dark:hover:border-${feature.color}-500/40 transition-all duration-400`}>
                <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/40 rounded-xl flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-5`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t(`features.${feature.key}_title`)}</h3>
                <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">{t(`features.${feature.key}_desc`)}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ========== TEMPLATE SHOWCASE ========== */}
      <section id="templates" className="w-full max-w-7xl px-6 py-24 md:py-32 z-10">
        <AnimatedSection className="text-center mb-16">
          <SectionBadge icon={Palette} text={t('templates.badge')} />
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 max-w-3xl mx-auto leading-tight">
            {t('templates.title')}
          </h2>
          <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">{t('templates.subtitle')}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { src: '/mock1.png', name: 'Developer Portfolio', style: '' },
            { src: '/mock2.png', name: 'Creative Agency', style: '' },
            { src: '/mock3.png', name: 'Designer Showcase', style: 'hue-rotate-180 brightness-90 contrast-125' },
          ].map((tmpl, i) => (
            <AnimatedSection key={tmpl.name} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="w-full aspect-[4/3] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative shadow-sm bg-zinc-900">
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
                    <Link to="/auth">
                      <div className="px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition-transform shadow-lg">Use This Template</div>
                    </Link>
                  </div>
                  <img src={tmpl.src} alt={tmpl.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${tmpl.style}`} />
                </div>
                <p className="mt-4 font-bold text-slate-900 dark:text-white text-center group-hover:text-blue-500 transition-colors">{tmpl.name}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="w-full max-w-7xl px-6 py-24 md:py-32 z-10">
        <AnimatedSection className="text-center mb-16">
          <SectionBadge icon={Zap} text={t('pricing.badge')} />
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 max-w-3xl mx-auto leading-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto mb-8">{t('pricing.subtitle')}</p>

          {/* Toggle */}
          <div className="inline-flex bg-slate-100 dark:bg-zinc-900 rounded-full p-1 border border-slate-200 dark:border-zinc-800">
            <button onClick={() => setYearly(false)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!yearly ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-500'}`}>
              {t('pricing.monthly')}
            </button>
            <button onClick={() => setYearly(true)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${yearly ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-500'}`}>
              {t('pricing.yearly')} 🎉
            </button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free */}
          <AnimatedSection delay={0.1}>
            <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t('pricing.free_name')}</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">{t('pricing.free_desc')}</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{t('pricing.currency')}{t('pricing.free_price')}</span>
                <span className="text-sm text-slate-400 dark:text-zinc-500 mb-2">{t('pricing.per_month')}</span>
              </div>
              <Link to="/auth" className="block">
                <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition">{t('pricing.free_cta')}</button>
              </Link>
              <ul className="mt-8 space-y-3">
                {['free_f1', 'free_f2', 'free_f3', 'free_f4'].map(k => (
                  <li key={k} className="flex items-center gap-3 text-sm text-slate-600 dark:text-zinc-400"><Check size={16} className="text-green-500 flex-shrink-0" />{t(`pricing.${k}`)}</li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* Starter — Popular */}
          <AnimatedSection delay={0.2}>
            <div className="relative p-8 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl dark:shadow-[0_20px_60px_rgba(255,255,255,0.1)] scale-[1.03] border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">{t('pricing.popular')}</div>
              <h3 className="text-xl font-bold mb-1">{t('pricing.starter_name')}</h3>
              <p className="text-sm opacity-70 mb-6">{t('pricing.starter_desc')}</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black">{t('pricing.currency')}{yearly ? '4' : t('pricing.starter_price')}</span>
                <span className="text-sm opacity-50 mb-2">{t('pricing.per_month')}</span>
              </div>
              <Link to="/auth" className="block">
                <button className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition shadow-lg">{t('pricing.starter_cta')}</button>
              </Link>
              <ul className="mt-8 space-y-3">
                {['starter_f1', 'starter_f2', 'starter_f3', 'starter_f4', 'starter_f5'].map(k => (
                  <li key={k} className="flex items-center gap-3 text-sm opacity-90"><Check size={16} className="text-blue-400 flex-shrink-0" />{t(`pricing.${k}`)}</li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* Pro */}
          <AnimatedSection delay={0.3}>
            <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t('pricing.pro_name')}</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">{t('pricing.pro_desc')}</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{t('pricing.currency')}{yearly ? '12' : t('pricing.pro_price')}</span>
                <span className="text-sm text-slate-400 dark:text-zinc-500 mb-2">{t('pricing.per_month')}</span>
              </div>
              <Link to="/auth" className="block">
                <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition">{t('pricing.pro_cta')}</button>
              </Link>
              <ul className="mt-8 space-y-3">
                {['pro_f1', 'pro_f2', 'pro_f3', 'pro_f4', 'pro_f5', 'pro_f6'].map(k => (
                  <li key={k} className="flex items-center gap-3 text-sm text-slate-600 dark:text-zinc-400"><Check size={16} className="text-green-500 flex-shrink-0" />{t(`pricing.${k}`)}</li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="w-full max-w-7xl px-6 py-24 z-10">
        <AnimatedSection>
          <div className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center">
            {/* Gradient BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 z-0"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] z-[1]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 max-w-2xl mx-auto leading-tight">
                {t('cta_final.title')}
              </h2>
              <p className="text-lg text-white/70 max-w-md mx-auto mb-10">
                {t('cta_final.subtitle')}
              </p>
              <Link to="/auth">
                <button className="group bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 rounded-2xl font-bold text-base flex items-center gap-3 mx-auto transition-all shadow-2xl hover:scale-[1.03]">
                  {t('cta_final.button')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="w-full border-t border-slate-200 dark:border-zinc-800 z-10 bg-white/50 dark:bg-zinc-950/80 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.svg" alt="Phi" className="w-8 h-8" />
                <span className="font-black text-xl text-slate-900 dark:text-white">Phi</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-500 leading-relaxed">{t('footer.tagline')}</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('footer.product')}</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition">{t('footer.product_features')}</a></li>
                <li><a href="#pricing" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition">{t('footer.product_pricing')}</a></li>
                <li><a href="#templates" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition">{t('footer.product_templates')}</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('footer.company')}</h4>
              <ul className="space-y-2.5">
                <li><span className="text-sm text-slate-400 dark:text-zinc-600">{t('footer.company_about')}</span></li>
                <li><span className="text-sm text-slate-400 dark:text-zinc-600">{t('footer.company_blog')}</span></li>
                <li><span className="text-sm text-slate-400 dark:text-zinc-600">{t('footer.company_contact')}</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('footer.legal')}</h4>
              <ul className="space-y-2.5">
                <li><Link to="/privacy" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition">{t('footer.legal_privacy')}</Link></li>
                <li><Link to="/terms" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition">{t('footer.legal_terms')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-slate-400 dark:text-zinc-600">&copy; {new Date().getFullYear()} Phi. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
