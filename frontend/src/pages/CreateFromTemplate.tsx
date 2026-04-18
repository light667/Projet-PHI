import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import {
  X, Eye, ArrowRight, ArrowLeft, Check, Sparkles, Search,
  Code2, Palette, Building2, Camera, Megaphone, TrendingUp,
  GraduationCap, Scale, Stethoscope, BarChart3, Globe, Lock
} from 'lucide-react';
import {
  createPortfolioDraft,
  savePortfolioDraft,
  toSlug,
  type TemplateDefinition,
} from '../lib/portfolioDraft.js';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const DOMAINS = [
  { id: 'all', label: 'Tous', icon: Sparkles, color: 'indigo' },
  { id: 'dev', label: 'Développement Web', icon: Code2, color: 'blue' },
  { id: 'design', label: 'Design UX/UI', icon: Palette, color: 'pink' },
  { id: 'archi', label: 'Architecture', icon: Building2, color: 'stone' },
  { id: 'photo', label: 'Photographie', icon: Camera, color: 'amber' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: 'orange' },
  { id: 'finance', label: 'Finance', icon: TrendingUp, color: 'green' },
  { id: 'student', label: 'Étudiant', icon: GraduationCap, color: 'purple' },
  { id: 'law', label: 'Droit', icon: Scale, color: 'slate' },
  { id: 'medical', label: 'Médecine', icon: Stethoscope, color: 'red' },
  { id: 'data', label: 'Data Science', icon: BarChart3, color: 'cyan' },
];

const TEMPLATES: TemplateDefinition[] = [
  {
    id: 't-dev-1', name: 'Horizon Dev', domain: 'dev', description: 'Portfolio minimaliste pour développeurs full-stack avec mise en avant des projets GitHub.',
    gradient: 'from-blue-500 to-indigo-600', accentColor: 'blue', tags: ['React', 'GitHub', 'API'],
    previewBg: 'bg-slate-900', mockSections: ['À propos', 'Compétences', 'Projets', 'Contact'],
  },
  {
    id: 't-dev-2', name: 'Terminal', domain: 'dev', description: 'Style terminal minimaliste pour les développeurs qui veulent se démarquer.',
    gradient: 'from-green-400 to-emerald-600', accentColor: 'green', tags: ['Backend', 'CLI', 'Dark'],
    previewBg: 'bg-zinc-950', mockSections: ['About', 'Stack', 'Work', 'Blog'],
  },
  {
    id: 't-design-1', name: 'Canvas', domain: 'design', description: 'Vitrine créative avec galerie de projets en plein écran pour les designers UI/UX.',
    gradient: 'from-pink-500 to-rose-500', accentColor: 'pink', tags: ['Figma', 'Behance', 'Galerie'],
    previewBg: 'bg-white', mockSections: ['Accueil', 'Projets', 'Process', 'Contact'],
  },
  {
    id: 't-design-2', name: 'Silk', domain: 'design', description: 'Design épuré et élégant pour les designers seniors et directeurs artistiques.',
    gradient: 'from-purple-400 to-pink-500', accentColor: 'purple', tags: ['DA', 'Senior', 'Motion'],
    previewBg: 'bg-stone-50', mockSections: ['Journal', 'Œuvres', 'Clients', 'Studio'],
  },
  {
    id: 't-archi-1', name: 'Blueprint', domain: 'archi', description: 'Portfolio à la structure rigoureuse pour architectes et urbanistes.',
    gradient: 'from-stone-500 to-stone-700', accentColor: 'stone', tags: ['Plans', 'Réalisations', '3D'],
    previewBg: 'bg-stone-100', mockSections: ['Manifeste', 'Projets', 'Prix', 'Agence'],
  },
  {
    id: 't-photo-1', name: 'Shutter', domain: 'photo', description: 'Galerie immersive plein écran pour les photographes professionnels.',
    gradient: 'from-amber-400 to-orange-500', accentColor: 'amber', tags: ['Studio', 'Mariage', 'Portrait'],
    previewBg: 'bg-neutral-900', mockSections: ['Portfolio', 'Séries', 'Tarifs', 'Book'],
  },
  {
    id: 't-marketing-1', name: 'Growth', domain: 'marketing', description: 'CV portfolio axé sur les métriques et la performance pour les marketeurs.',
    gradient: 'from-orange-400 to-red-500', accentColor: 'orange', tags: ['SEO', 'Ads', 'CRM'],
    previewBg: 'bg-orange-50', mockSections: ['Profil', 'Résultats', 'Campagnes', 'Outils'],
  },
  {
    id: 't-finance-1', name: 'Ledger', domain: 'finance', description: 'Portfolio sobre et crédible pour les professionnels de la finance.',
    gradient: 'from-green-500 to-teal-600', accentColor: 'green', tags: ['Analyse', 'M&A', 'Excel'],
    previewBg: 'bg-slate-50', mockSections: ['Profil', 'Expertise', 'Missions', 'Certifications'],
  },
  {
    id: 't-student-1', name: 'Launch', domain: 'student', description: 'Premier portfolio pour étudiants cherchant un stage ou alternance.',
    gradient: 'from-violet-400 to-purple-600', accentColor: 'purple', tags: ['Stage', 'Alternance', 'CV'],
    previewBg: 'bg-violet-50', mockSections: ['Moi', 'Formation', 'Projets', 'Ambitions'],
  },
  {
    id: 't-law-1', name: 'Lex', domain: 'law', description: 'Portfolio professionnel pour avocats, juristes et professionnels du droit.',
    gradient: 'from-slate-500 to-slate-700', accentColor: 'slate', tags: ['Barreau', 'Cabinet', 'Expertise'],
    previewBg: 'bg-slate-50', mockSections: ['Biographie', 'Domaines', 'Publications', 'Contact'],
  },
  {
    id: 't-medical-1', name: 'Pulse', domain: 'medical', description: 'Portfolio élégant pour médecins, chirurgiens et professionnels de santé.',
    gradient: 'from-red-400 to-rose-600', accentColor: 'red', tags: ['Spécialité', 'Publications', 'Clinique'],
    previewBg: 'bg-red-50', mockSections: ['Parcours', 'Spécialités', 'Publications', 'Consultation'],
  },
  {
    id: 't-data-1', name: 'Datum', domain: 'data', description: 'Portfolio technique pour data scientists, ML engineers et analystes.',
    gradient: 'from-cyan-400 to-blue-500', accentColor: 'cyan', tags: ['Python', 'ML', 'Kaggle'],
    previewBg: 'bg-cyan-950', mockSections: ['Bio', 'Skills', 'Notebooks', 'Publications'],
  },
];

// ---------------------------------------------------------------------------
// DOMAIN CHIP
// ---------------------------------------------------------------------------
function DomainChip({ domain, active, onClick }: { domain: typeof DOMAINS[0]; active: boolean; onClick: () => void }) {
  const Icon = domain.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all duration-200
        ${active
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          : 'bg-[var(--surface)] border-[var(--border-color)] text-[var(--text2)] hover:border-indigo-400 hover:text-indigo-500'
        }
      `}
    >
      <Icon size={15} className={active ? 'text-white' : ''} />
      {domain.label}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// TEMPLATE CARD
// ---------------------------------------------------------------------------
function TemplateCard({ template, onPreview, onUse }: { template: TemplateDefinition; onPreview: () => void; onUse: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      layout
      className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[16px] overflow-hidden group hover:shadow-xl hover:border-indigo-400/60 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${template.gradient} overflow-hidden`}>
        {/* Mock browser chrome */}
        <div className={`absolute inset-2 rounded-[10px] ${template.previewBg} shadow-lg overflow-hidden`}>
          {/* Browser topbar */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-black/10">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div className="ml-2 flex-1 rounded bg-black/10 h-3 text-[7px] flex items-center px-2 font-mono text-black/40">phi.app/~</div>
          </div>
          {/* Fake page content */}
          <div className="px-3 py-2 flex flex-col gap-1.5">
            <div className={`w-1/2 h-3 rounded bg-gradient-to-r ${template.gradient} opacity-80`}></div>
            <div className="w-3/4 h-2 rounded bg-black/8"></div>
            <div className="w-2/3 h-2 rounded bg-black/5"></div>
            <div className="mt-1 flex gap-1.5">
              {template.mockSections.slice(0, 3).map(s => (
                <div key={s} className={`px-2 py-0.5 rounded text-[7px] bg-gradient-to-r ${template.gradient} text-white opacity-90`}>{s}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={onPreview}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md hover:bg-white transition"
          >
            <Eye size={12} /> Aperçu
          </button>
          <button
            onClick={onUse}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md hover:bg-indigo-500 transition"
          >
            Utiliser <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-[var(--text)] text-sm leading-tight">{template.name}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 whitespace-nowrap`}>
            {DOMAINS.find(d => d.id === template.domain)?.label}
          </span>
        </div>
        <p className="text-xs text-[var(--text2)] leading-relaxed mb-3">{template.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.map(t => (
            <span key={t} className="px-2 py-0.5 bg-[var(--bg)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text3)] rounded-full">{t}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onPreview}
            className="flex items-center justify-center gap-1.5 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-[8px] text-xs font-bold text-[var(--text2)] hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <Eye size={12} /> Aperçu
          </button>
          <button
            onClick={onUse}
            className="flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[8px] text-xs font-bold shadow-sm transition-colors"
          >
            Utiliser <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// PREVIEW MODAL
// ---------------------------------------------------------------------------
function PreviewModal({ template, onClose, onUse }: { template: TemplateDefinition; onClose: () => void; onUse: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-[var(--surface)] rounded-[20px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-[var(--border-color)]"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.gradient}`}></div>
              <div>
                <h3 className="font-bold text-[var(--text)]">{template.name}</h3>
                <p className="text-xs text-[var(--text3)]">{DOMAINS.find(d => d.id === template.domain)?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onUse}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-[10px] text-sm font-bold transition-colors shadow-md"
              >
                Utiliser ce template <ArrowRight size={15} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-[10px] hover:bg-[var(--bg)] text-[var(--text2)] hover:text-[var(--text)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* "Browser" Preview */}
          <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="rounded-[14px] border border-[var(--border-color)] overflow-hidden shadow-lg">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg)] border-b border-[var(--border-color)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-2 flex-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-md h-6 flex items-center px-3 gap-2">
                  <Lock size={10} className="text-[var(--text3)]" />
                  <span className="text-xs font-mono text-[var(--text3)]">phi.app/~votre-portfolio</span>
                </div>
                <Globe size={14} className="text-[var(--text3)]" />
              </div>

              {/* Full preview mock */}
              <div className={`${template.previewBg} min-h-[500px] relative overflow-hidden`}>
                {/* Nav mock */}
                <div className={`flex items-center justify-between px-8 py-4 border-b border-black/5`}>
                  <div className={`w-20 h-4 rounded bg-gradient-to-r ${template.gradient}`}></div>
                  <div className="flex gap-4">
                    {template.mockSections.map(s => (
                      <div key={s} className="text-[10px] font-semibold opacity-50" style={{ color: 'inherit' }}>{s}</div>
                    ))}
                  </div>
                </div>

                {/* Hero mock */}
                <div className="px-8 py-12 flex flex-col gap-4">
                  <div className={`w-48 h-6 rounded-lg bg-gradient-to-r ${template.gradient} opacity-90`}></div>
                  <div className="w-2/3 h-3 rounded bg-black/10"></div>
                  <div className="w-1/2 h-3 rounded bg-black/8"></div>
                  <div className="mt-3 flex gap-3">
                    <div className={`w-28 h-9 rounded-lg bg-gradient-to-r ${template.gradient}`}></div>
                    <div className="w-24 h-9 rounded-lg bg-black/10"></div>
                  </div>
                </div>

                {/* Cards mock */}
                <div className="px-8 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-xl bg-black/5 p-4 h-24 flex flex-col justify-between">
                      <div className={`w-10 h-4 rounded bg-gradient-to-r ${template.gradient} opacity-70`}></div>
                      <div className="flex flex-col gap-1">
                        <div className="w-full h-2 rounded bg-black/10"></div>
                        <div className="w-2/3 h-2 rounded bg-black/8"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-center pb-6">
                  <div className="text-white/60 text-xs font-medium">Aperçu du template · {template.name}</div>
                </div>
              </div>
            </div>

            {/* Template info */}
            <div className="mt-5 grid grid-cols-3 gap-4">
              {template.mockSections.map(section => (
                <div key={section} className="bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] p-4 text-center">
                  <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${template.gradient} mb-2`}></div>
                  <div className="text-xs font-bold text-[var(--text)]">{section}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// STEP INDICATOR
// ---------------------------------------------------------------------------
function StepIndicator({ current }: { current: number }) {
  const steps = ['Choisir un domaine', 'Sélectionner un template', 'Nommer ton portfolio'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = current > idx;
        const active = current === idx;
        return (
          <div key={idx} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${active || done ? '' : 'opacity-40'}`}>
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done ? 'bg-green-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-[var(--border-color)] text-[var(--text2)]'}
              `}>
                {done ? <Check size={13} /> : idx}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${active ? 'text-[var(--text)]' : 'text-[var(--text2)]'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-px mx-1 transition-all ${done ? 'bg-green-400' : 'bg-[var(--border-color)]'}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------
export default function CreateFromTemplate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: domain filter + search
  const [activeDomain, setActiveDomain] = useState('all');
  const [search, setSearch] = useState('');

  // Step 2: selected template
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  // Step 3: portfolio naming
  const [portfolioName, setPortfolioName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [creating, setCreating] = useState(false);

  // Filtered templates
  const filtered = TEMPLATES.filter(t => {
    const domainMatch = activeDomain === 'all' || t.domain === activeDomain;
    const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return domainMatch && searchMatch;
  });

  // Auto-generate slug from portfolio name
  useEffect(() => {
    if (!slugManual) {
      setSlug(toSlug(portfolioName));
    }
  }, [portfolioName, slugManual]);

  const validateSlug = useCallback((val: string) => {
    if (!val) { setSlugError('Le slug ne peut pas être vide.'); return false; }
    if (!/^[a-z0-9-]+$/.test(val)) { setSlugError('Uniquement des lettres minuscules, chiffres et tirets.'); return false; }
    setSlugError('');
    return true;
  }, []);

  const handleUseTemplate = (t: TemplateDefinition) => {
    setSelectedTemplate(t);
    setPreviewTemplate(null);
    setStep(3);
  };

  const handleSelectInStep2 = (t: TemplateDefinition) => {
    setSelectedTemplate(t);
    setStep(3);
  };

  const handleCreate = async () => {
    if (!portfolioName.trim() || !validateSlug(slug)) return;
    setCreating(true);

    const draft = createPortfolioDraft({
      template: selectedTemplate!,
      title: portfolioName.trim(),
      slug,
      visibility,
      author: user?.displayName || user?.email?.split('@')[0] || 'Utilisateur',
    });

    savePortfolioDraft(draft);

    await new Promise(r => setTimeout(r, 700));
    navigate(`/dashboard/editor/${draft.id}`);
  };

  return (
    <div className="pb-12">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        {step > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep(s => s - 1)}
            className="p-2 rounded-[10px] border border-[var(--border-color)] hover:bg-[var(--bg)] text-[var(--text2)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft size={18} />
          </motion.button>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Créer depuis un template</h1>
          <p className="text-sm text-[var(--text2)] mt-0.5">Choisissez un point de départ conçu pour votre domaine.</p>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        {/* ===================== STEP 1 + 2: filter + grid (combined view) ===================== */}
        {step <= 2 && (
          <motion.div key="step1-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            {/* STEP 1: Domaine chips */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-[var(--text2)] uppercase tracking-wider mb-3">
                Étape 1 — Filtrer par domaine
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {DOMAINS.map(domain => (
                  <DomainChip
                    key={domain.id}
                    domain={domain}
                    active={activeDomain === domain.id}
                    onClick={() => { setActiveDomain(domain.id); setStep(1); }}
                  />
                ))}
              </div>
            </div>

            {/* STEP 2: search + grid */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-[var(--text2)] uppercase tracking-wider">
                Étape 2 — Choisir un template
              </h2>
              {/* Search */}
              <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-[10px] px-3 py-2 w-64">
                <Search size={14} className="text-[var(--text3)] shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-[var(--text)] placeholder-[var(--text3)] outline-none flex-1 w-full"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--text2)]">
                <Sparkles size={36} className="opacity-30 mb-4" />
                <p className="font-semibold">Aucun template pour ce filtre.</p>
                <button onClick={() => { setActiveDomain('all'); setSearch(''); }} className="mt-3 text-sm text-indigo-500 font-bold hover:underline">Tout afficher</button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map(t => (
                    <TemplateCard
                      key={t.id}
                      template={t}
                      onPreview={() => setPreviewTemplate(t)}
                      onUse={() => handleSelectInStep2(t)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ===================== STEP 3: confirm & name ===================== */}
        {step === 3 && selectedTemplate && (
          <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto"
          >
            {/* Preview of selected template */}
            <div className={`relative rounded-[16px] h-40 bg-gradient-to-br ${selectedTemplate.gradient} overflow-hidden mb-8 shadow-xl`}>
              <div className="absolute inset-4 rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-4 px-6">
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-4 rounded bg-white/70"></div>
                  <div className="w-48 h-2.5 rounded bg-white/40"></div>
                  <div className="w-40 h-2.5 rounded bg-white/30"></div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md flex items-center gap-2">
                <div className={`w-4 h-4 rounded bg-gradient-to-br ${selectedTemplate.gradient}`}></div>
                {selectedTemplate.name}
              </div>
            </div>

            <h2 className="text-sm font-bold text-[var(--text2)] uppercase tracking-wider mb-5">
              Étape 3 — Nommer ton portfolio
            </h2>

            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[20px] p-8 flex flex-col gap-6">
              {/* Portfolio name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[var(--text)]">
                  Nom du portfolio <span className="text-red-500">*</span>
                </label>
                <input
                  id="portfolio-name-input"
                  type="text"
                  placeholder="ex. Mon Portfolio Dev Senior"
                  value={portfolioName}
                  onChange={e => setPortfolioName(e.target.value)}
                  className="w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text3)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm font-medium"
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[var(--text)]">
                  URL publique (slug) <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center border rounded-[12px] overflow-hidden bg-[var(--bg)] transition-all ${slugError ? 'border-red-400' : 'border-[var(--border-color)] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'}`}>
                  <span className="px-3 py-3 text-sm font-semibold text-[var(--text3)] bg-[var(--surface)] border-r border-[var(--border-color)] whitespace-nowrap">
                    phi.app/~
                  </span>
                  <input
                    id="portfolio-slug-input"
                    type="text"
                    placeholder="mon-portfolio"
                    value={slug}
                    onChange={e => {
                      setSlugManual(true);
                      const val = toSlug(e.target.value);
                      setSlug(val);
                      validateSlug(val);
                    }}
                    className="flex-1 px-3 py-3 bg-transparent text-[var(--text)] placeholder-[var(--text3)] outline-none text-sm font-mono"
                  />
                </div>
                {slugError && <p className="text-xs font-semibold text-red-500">{slugError}</p>}
                {!slugError && slug && (
                  <p className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                    <Check size={12} /> Disponible — phi.app/~{slug}
                  </p>
                )}
              </div>

              {/* Visibility toggle */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[var(--text)]">Visibilité</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['public', 'private'] as const).map(v => (
                    <button
                      key={v}
                      id={`visibility-${v}`}
                      onClick={() => setVisibility(v)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border text-sm font-semibold transition-all ${
                        visibility === v
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-[var(--border-color)] bg-[var(--bg)] text-[var(--text2)] hover:border-slate-300'
                      }`}
                    >
                      {v === 'public' ? <Globe size={16} /> : <Lock size={16} />}
                      {v === 'public' ? 'Public' : 'Privé'}
                      {visibility === v && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template summary */}
              <div className="flex items-center gap-3 p-4 bg-[var(--bg)] rounded-[12px] border border-[var(--border-color)]">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedTemplate.gradient} shrink-0`}></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--text)]">Template : {selectedTemplate.name}</div>
                  <div className="text-xs text-[var(--text2)]">{DOMAINS.find(d => d.id === selectedTemplate.domain)?.label}</div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-indigo-500 hover:underline"
                >
                  Changer
                </button>
              </div>

              {/* CTA */}
              <motion.button
                id="create-portfolio-btn"
                onClick={handleCreate}
                disabled={!portfolioName.trim() || !!slugError || !slug || creating}
                whileHover={{ scale: creating ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-[14px] text-base shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-3"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Création en cours…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Créer mon portfolio
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={() => handleUseTemplate(previewTemplate)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
