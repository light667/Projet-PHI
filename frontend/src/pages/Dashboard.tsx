import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  Sparkles, Eye, FileText, Grid, Star, MoreHorizontal, 
  ExternalLink, Edit3, Plus, LayoutTemplate, Bot, Clock, 
  ArrowRight, ShieldAlert, CheckCircle2, Circle
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  variation: string;
  icon: LucideIcon;
  colorClass: string;
}

interface PortfolioCardProps {
  title: string;
  status: 'En ligne' | 'Brouillon';
  views?: string;
  gradient: string;
}

interface ActivityItemProps {
  text: string;
  time: string;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = useMemo(
    () => user?.displayName || user?.email?.split('@')[0] || 'Utilisateur',
    [user?.displayName, user?.email],
  );

  return (
    <div className="pb-8">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden bg-[#1a1a2e] rounded-[16px] p-8 md:p-10 mb-8 border border-[rgba(0,0,0,0.08)] shadow-sm">
        {/* Decorations */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] right-[10%] w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-3xl font-extrabold text-white mb-2 font-decorative">
              Bonjour, <span className="text-indigo-400">{displayName}</span> 👋
            </h1>
            <p className="text-slate-300 font-medium text-sm md:text-base">Voici ce qui se passe avec vos portfolios aujourd'hui.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Link to="/dashboard/create/template">
              <button className="bg-white text-[#1a1a2e] hover:bg-slate-100 transition-colors px-6 py-3 rounded-[12px] font-bold flex items-center gap-3">
                Créer depuis un template
                <ArrowRight size={18} className="text-indigo-600" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 2. STATS CARDS (4-column grid) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px] mb-10"
      >
        <StatCard title="Portfolios créés" value="3" variation="+1 ce mois" icon={Grid} colorClass="bg-purple-100 text-purple-600" />
        <StatCard title="Vues totales" value="1,204" variation="+12% vs mois prop." icon={Eye} colorClass="bg-green-100 text-green-600" />
        <StatCard title="Projets publiés" value="12" variation="+2 ce mois" icon={FileText} colorClass="bg-orange-100 text-orange-600" />
        <StatCard title="Taux d'engagement" value="84%" variation="+5% vs mois prop." icon={Star} colorClass="bg-red-100 text-red-600" />
      </motion.div>

      {/* 3. MES PORTFOLIOS (4-column grid) */}
      <div className="mb-4 flex justify-between items-end">
        <h2 className="text-lg font-bold text-[var(--text)]">Mes Portfolios</h2>
        <Link to="/dashboard/portfolios" className="text-sm font-semibold text-[var(--accent)] hover:underline">Tout voir</Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px] mb-12"
      >
        <PortfolioCard title="Tech Lead Backend" status="En ligne" views="842" gradient="from-indigo-500 to-purple-600" />
        <PortfolioCard title="Designer UI/UX" status="Brouillon" gradient="from-rose-400 to-orange-500" />
        <PortfolioCard title="Consultant IA" status="En ligne" views="362" gradient="from-blue-500 to-cyan-500" />
        
        {/* Create Card */}
        <Link to="/dashboard/create/template">
          <div className="h-full min-h-[200px] rounded-[16px] border-2 border-dashed border-[var(--border-color)] hover:border-indigo-400 bg-[var(--bg)] hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
            <div className="p-3 bg-white border border-[var(--border-color)] rounded-full group-hover:scale-110 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all shadow-sm">
              <Plus size={24} className="text-slate-400 group-hover:text-indigo-600"/>
            </div>
            <span className="font-bold text-[var(--text2)] group-hover:text-indigo-600 transition-colors">+ Créer depuis un template</span>
          </div>
        </Link>
      </motion.div>

      {/* 4. CHOIX DU MODE DE CRÉATION */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[var(--text)]">Mode de création</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[22px] mb-12">
        {/* Template Card */}
        <Link to="/dashboard/create/template" className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-6 hover:shadow-md transition-shadow cursor-pointer block">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <LayoutTemplate size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">📋 Template</h3>
              <p className="text-sm text-[var(--text2)] mt-0.5">Partez d'une structure pré-validée par l'industrie.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-[var(--border-color)]">Développeur</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-[var(--border-color)]">Designer</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-[var(--border-color)]">Marketing</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-[var(--border-color)]">Product Manager</span>
          </div>
        </Link>

        {/* IA Card */}
        <Link to="/dashboard/create/ai" className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-6 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer block">
          <div className="absolute right-[-10%] top-[-10%] opacity-5 text-purple-600 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
             <Bot size={180} />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">🤖 Assistant IA</h3>
              <p className="text-sm text-[var(--text2)] mt-0.5">Générez un portfolio parfait en quelques clics via un chat.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4 relative z-10">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CheckCircle2 size={14} className="text-green-500"/> Analyse du parcours professionnel</span>
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CheckCircle2 size={14} className="text-green-500"/> Définition de l'objectif</span>
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Circle size={14} /> Génération de la structure</span>
          </div>
        </Link>
      </div>

      {/* 5. ACTIVITÉ RÉCENTE + SUGGESTIONS IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[22px]">
        {/* Activité récente */}
        <div>
          <h2 className="text-lg font-bold text-[var(--text)] mb-4">Activité récente</h2>
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-6 h-[280px] overflow-hidden">
            <div className="space-y-1">
              <ActivityItem text="Nouveau portfolio 'Tech Lead Backend' publié" time="Aujourd'hui, 09:42" color="bg-green-500" />
              <ActivityItem text="Mise à jour de la section 'Expériences'" time="Hier, 14:20" color="bg-blue-500" />
              <ActivityItem text="Connexion via LinkedIn réussie" time="Il y a 3 jours" color="bg-purple-500" />
            </div>
          </div>
        </div>

        {/* Suggestions IA */}
        <div>
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2 mb-4">
             <Sparkles size={20} className="text-purple-600"/>
             Suggestions IA
          </h2>
          <div className="flex flex-col gap-4 h-[280px] overflow-hidden justify-between">
            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-5 flex items-start gap-4">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg shrink-0 mt-1">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[var(--text)]">Optimisation SEO manquante</h4>
                <p className="text-xs text-[var(--text2)] mt-1 mb-3">Ajoutez une meta description sur 'Designer UI/UX' pour augmenter votre visibilité.</p>
                <button className="text-xs font-bold px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors border border-yellow-200">Appliquer la suggestion</button>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-5 flex items-start gap-4">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-1">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-[var(--text)]">Section "Compétences" vide</h4>
                <p className="text-xs text-[var(--text2)] mt-1 mb-3">L'IA peut suggérer des compétences à partir de vos expériences.</p>
                <button className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors border border-indigo-200">Générer la section</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------
// COMPONENTS HELPER
// ------------------------

const StatCard = memo(function StatCard({ title, value, variation, icon: Icon, colorClass }: StatCardProps) {
  const isPositive = variation.includes('+');
  const variationVal = variation.split(' ')[0];
  const variationText = variation.split(' ').slice(1).join(' ');

  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-6 flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div>
          <div className="text-sm font-semibold text-[var(--text2)] line-clamp-1">{title}</div>
          <div className="text-2xl font-bold text-[var(--text)] mt-0.5">{value}</div>
        </div>
      </div>
      <div className="text-[11px] font-medium text-[var(--text2)] flex items-center gap-1.5">
        {isPositive ? (
           <span className="text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded-md border border-green-200/50">{variationVal}</span>
        ) : (
           <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">{variationVal}</span>
        )}
        <span className="text-[var(--text3)] uppercase tracking-wider text-[10px]">{variationText}</span>
      </div>
    </div>
  );
});

const PortfolioCard = memo(function PortfolioCard({ title, status, views, gradient }: PortfolioCardProps) {
  const isOnline = status === 'En ligne';

  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] p-4 flex flex-col gap-4 group hover:border-[var(--accent)] hover:shadow-md transition-all">
      <div className={`w-full h-32 rounded-[12px] bg-gradient-to-br ${gradient} p-4 relative overflow-hidden shadow-inner`}>
        {/* Glass decoration inside thumbnail */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[20px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-[15px] translate-y-1/3 -translate-x-1/4"></div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2.5">
          <h3 className="font-bold text-[var(--text)] line-clamp-1 flex-1 pr-2 leading-tight">{title}</h3>
          <button className="text-[var(--text3)] hover:text-[var(--text)] p-0.5 mt-[-2px]">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text2)]">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></span>
            {status}
          </div>
          {views && <div className="flex items-center gap-1 text-[var(--text3)]"><Eye size={14}/> {views}</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-[var(--border-color)]">
        <button className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-[var(--border-color)] rounded-[8px] text-[11px] font-bold text-slate-700 transition-colors">
          <Edit3 size={12}/> Modifier
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-[var(--border-color)] rounded-[8px] text-[11px] font-bold text-slate-700 transition-colors">
          <ExternalLink size={12}/> Aperçu
        </button>
      </div>
    </div>
  );
});

const ActivityItem = memo(function ActivityItem({ text, time, color }: ActivityItemProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full ${color} ring-4 ring-white mt-1.5 relative z-10`}></div>
        <div className="w-px h-[45px] bg-[var(--border-color)] mt-1"></div>
      </div>
      <div className="pb-4">
        <p className="text-sm font-semibold text-[var(--text)] leading-snug">{text}</p>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-[var(--text3)]">
          <Clock size={12} /> {time}
        </div>
      </div>
    </div>
  );
});
