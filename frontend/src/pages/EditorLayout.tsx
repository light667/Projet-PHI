import { useEffect, useMemo, useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  Monitor, 
  Smartphone, 
  Save, 
  Send,
  ArrowLeft,
  MousePointerSquareDashed,
  BadgeCheck,
  Globe,
  Lock,
  LayoutTemplate,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { listPortfolioDraftSections, loadPortfolioDraft } from '../lib/portfolioDraft.js';
import PortfolioRenderer from '../components/PortfolioRenderer.js';



export default function EditorLayout() {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'settings'>('sections');
  const [portfolio, setPortfolio] = useState(() => loadPortfolioDraft());
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setPortfolio(loadPortfolioDraft(id));
  }, [id]);

  const visibleSections = useMemo(() => (portfolio ? listPortfolioDraftSections(portfolio) : []), [portfolio]);

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-slate-50 text-zinc-900 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white border border-zinc-200 rounded-[20px] p-8 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Portfolio introuvable</h1>
          <p className="text-sm text-zinc-600 mb-6">
            Le portfolio demandé n'existe pas dans cette session. Repars d'un template pour créer un nouveau brouillon.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/dashboard/create/template')}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-colors"
            >
              <LayoutTemplate size={16} />
              Choisir un template
            </button>
            <button
              onClick={() => navigate('/dashboard/create/ai')}
              className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-800 px-4 py-2.5 rounded-md font-medium hover:bg-zinc-50 transition-colors"
            >
              <Sparkles size={16} />
              Génération IA
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 text-zinc-900 flex flex-col font-sans overflow-hidden">
      
      {/* TOPBAR */}
      <header className="h-14 bg-white border-b border-zinc-200/80 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/create/template')}
            className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-100"
          >
             <ArrowLeft size={18} />
          </button>
          <div className="h-4 w-[1px] bg-zinc-200"></div>
          <span className="font-medium text-sm text-zinc-800 tracking-wide">
            {portfolio.metadata.title}
          </span>
          <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full border border-zinc-200">
            {portfolio.visibility === 'public' ? 'Public' : 'Privé'}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500">
          <BadgeCheck size={14} className="text-emerald-600" />
          <span>Template {portfolio.templateName}</span>
          <span className="text-zinc-300">·</span>
          <span>phi.app/~{portfolio.slug}</span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-lg border border-zinc-200/50">
          <button 
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            <Save size={16} />
            <span>Save</span>
          </button>
          <button className="flex items-center gap-2 text-sm font-medium bg-zinc-900 text-white px-4 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm">
            <Send size={16} />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-white border-r border-zinc-200/80 flex flex-col z-10 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Sidebar Tabs */}
          <div className="flex items-center p-2 border-b border-zinc-100 gap-1">
            <button 
              onClick={() => setActiveTab('sections')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-medium transition-all ${activeTab === 'sections' ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50/50'}`}
            >
              <Layers size={18} />
              Sections
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-medium transition-all ${activeTab === 'theme' ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50/50'}`}
            >
              <LayoutDashboard size={18} />
              Theme
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-medium transition-all ${activeTab === 'settings' ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50/50'}`}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Portfolio Sections</h3>
                {visibleSections.map((sec) => (
                  <div key={sec.id} className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-zinc-300 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <MousePointerSquareDashed size={16} className="text-zinc-400 group-hover:text-zinc-600" />
                      <span className="text-sm font-medium text-zinc-700 capitalize">{String(sec.content.label || sec.type)}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-500 font-medium hover:border-zinc-400 hover:text-zinc-700 transition-colors">
                  + Add Section
                </button>
              </div>
            )}
            {activeTab === 'theme' && (
               <div className="space-y-4">
                 <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4">
                   <div className="flex items-center gap-3 mb-3">
                     <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                       <Sparkles size={16} />
                     </div>
                     <div>
                       <div className="text-sm font-semibold text-zinc-900">Palette du template</div>
                       <div className="text-xs text-zinc-500">{portfolio.templateName}</div>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3 text-xs text-zinc-600">
                     <div className="rounded-lg bg-white border border-zinc-200 p-3">Couleur principale</div>
                     <div className="rounded-lg bg-white border border-zinc-200 p-3">Font: {portfolio.theme.fontFamily}</div>
                   </div>
                 </div>
               </div>
            )}
            {activeTab === 'settings' && (
               <div className="space-y-3 text-sm text-zinc-600">
                 <div className="flex items-center gap-2">
                   {portfolio.visibility === 'public' ? <Globe size={16} /> : <Lock size={16} />}
                   <span>Visibilité: {portfolio.visibility === 'public' ? 'Publique' : 'Privée'}</span>
                 </div>
                 <div>Slug: phi.app/~{portfolio.slug}</div>
                 <div>Domaine: {portfolio.domain}</div>
                 {'deploy_readiness' in portfolio && portfolio.deploy_readiness?.summary ? (
                   <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs">
                     <div className="font-bold mb-1">Prêt pour le déploiement</div>
                     <p>{portfolio.deploy_readiness.summary}</p>
                     {Array.isArray(portfolio.deploy_readiness.checklist) && portfolio.deploy_readiness.checklist.length > 0 ? (
                       <ul className="mt-2 list-disc pl-4 space-y-0.5">
                         {portfolio.deploy_readiness.checklist.map((item: string, i: number) => (
                           <li key={i}>{item}</li>
                         ))}
                       </ul>
                     ) : null}
                   </div>
                 ) : null}
               </div>
            )}
          </div>
        </aside>

        {/* CANVAS PREVIEW */}
        <main className="flex-1 bg-slate-100/50 relative overflow-y-auto overflow-x-hidden flex flex-col items-center scroll-smooth">
          {/* Preview Container */}
          <div className={`mt-8 mb-12 transition-all duration-500 ease-in-out ${deviceView === 'desktop' ? 'w-full max-w-5xl px-8' : 'w-[375px] px-0 mt-4'}`}>
            
            {/* The actual Portfolio Preview Frame */}
            <div className={`bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-zinc-200/50 overflow-hidden flex flex-col ${deviceView === 'desktop' ? 'min-h-[800px] rounded-xl' : 'min-h-[812px] rounded-[2.5rem] border-[8px] border-zinc-900 border-t-[24px]'}`}>
              <PortfolioRenderer portfolio={portfolio} />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
