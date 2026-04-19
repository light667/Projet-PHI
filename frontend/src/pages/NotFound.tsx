
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="relative inline-block mb-8">
          <div className="text-[120px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-slate-300 to-slate-500 dark:from-zinc-600 dark:to-zinc-800 opacity-60">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-4 rounded-3xl shadow-xl">
              <Search size={48} className="animate-pulse" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          {isEn ? "Page Not Found" : "Page introuvable"}
        </h1>
        <p className="text-[var(--text2)] mb-10 leading-relaxed">
          {isEn 
            ? "Oops! The page you are looking for doesn't exist or has been moved." 
            : "Oups ! La page que vous cherchez n'existe pas ou a été déplacée."}
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg"
        >
          <Home size={20} />
          {isEn ? "Go to Homepage" : "Retour à l'accueil"}
        </Link>
      </div>
    </div>
  );
}
