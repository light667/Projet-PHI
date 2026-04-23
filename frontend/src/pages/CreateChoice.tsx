import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, LayoutTemplate, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateChoice() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-[var(--text2)] hover:text-[var(--text)] mb-8 transition-colors group"
      >
        <div className="p-2 rounded-lg border border-[var(--border-color)] group-hover:bg-[var(--surface)] transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium text-sm">Retour au dashboard</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] mb-4">
          Comment souhaitez-vous créer votre portfolio ?
        </h1>
        <p className="text-[var(--text2)] max-w-xl mx-auto">
          Choisissez la méthode qui vous convient le mieux. L'IA est plus rapide et personnalisée, les modèles vous donnent un contrôle total dès le début.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/dashboard/create/ai" 
            className="group relative block bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] p-8 h-full hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors"></div>
            
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={32} />
            </div>

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-black text-[var(--text)]">Créer avec l'IA</h2>
              <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 py-1.5 px-3 rounded-full border border-indigo-100 dark:border-indigo-800">
                10 CR
              </span>
            </div>
            
            <p className="text-[var(--text2)] leading-relaxed mb-10">
              Décrivez votre parcours et laissez notre IA générer un portfolio complet : textes, structure, design et projets adaptés à votre profil.
            </p>

            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-2 transition-transform">
              Commencer avec l'IA <ArrowRight size={20} />
            </div>
          </Link>
        </motion.div>

        {/* Template Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link 
            to="/dashboard/create/template" 
            className="group relative block bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] p-8 h-full hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>

            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500">
              <LayoutTemplate size={32} />
            </div>

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-black text-[var(--text)]">À partir d'un modèle</h2>
              <span className="text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 py-1.5 px-3 rounded-full border border-[var(--border-color)]">
                2 CR
              </span>
            </div>

            <p className="text-[var(--text2)] leading-relaxed mb-10">
              Choisissez parmi nos templates professionnels conçus pour différents métiers et personnalisez-les avec notre éditeur intuitif.
            </p>

            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
              Voir les modèles <ArrowRight size={20} />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
