import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  Sparkles,
  Loader2,
  Brain,
  Briefcase,
  Code2,
  LayoutDashboard,
  Palette,
  Search,
  ShieldCheck,
  WandSparkles,
  UserRound,
  GraduationCap,
  FolderKanban,
  Stars,
  Layers3,
  Mic,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { createAIPortfolioDraft, savePortfolioDraft, toSlug, type AIGeneratedPortfolioDraft } from '../lib/portfolioDraft.js';

type WizardStep = 1 | 2 | 3 | 4 | 5;
type ToneOption = 'professionnel' | 'premium' | 'chaleureux' | 'audacieux';
type VisualStyleOption = 'minimaliste' | 'editorial' | 'tech' | 'premium';
type LayoutOption = 'topbar' | 'sidebar' | 'minimal';

interface AIWizardFormState {
  fullName: string;
  currentRole: string;
  targetRole: string;
  domain: string;
  audience: string;
  location: string;
  identitySummary: string;
  experienceSummary: string;
  educationSummary: string;
  projectHighlights: string;
  projectImpact: string;
  skills: string;
  tools: string;
  seoFocus: string;
  tone: ToneOption;
  visualStyle: VisualStyleOption;
  palette: string;
  layout: LayoutOption;
  fontFamily: string;
  language: string;
}

interface AIBackendPayload {
  identity: {
    fullName: string;
    currentRole: string;
    targetRole: string;
    domain: string;
    audience: string;
    location: string;
    summary: string;
    language: string;
  };
  experience: {
    summary: string;
    education: string;
  };
  projects: {
    highlights: string[];
    impact: string;
  };
  skills: {
    skills: string[];
    tools: string[];
    seoFocus: string[];
  };
  style: {
    tone: ToneOption;
    visualStyle: VisualStyleOption;
    palette: string;
    layout: LayoutOption;
    fontFamily: string;
  };
}

interface AIBackendResponse {
  title?: string;
  description?: string;
  domain?: string;
  tone?: string;
  style?: string;
  model?: string;
  seoKeywords?: string[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    variant: 'light' | 'dark';
  };
  layout?: {
    navigation: LayoutOption;
  };
  sections?: Array<{
    id: string;
    type: 'hero' | 'about' | 'gallery' | 'contact' | 'projects' | 'custom';
    isVisible: boolean;
    content: Record<string, unknown>;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const STEPS: Array<{ id: WizardStep; title: string; subtitle: string; icon: typeof UserRound }> = [
  { id: 1, title: 'Identité', subtitle: 'Votre base narrative', icon: UserRound },
  { id: 2, title: 'Expériences & Formation', subtitle: 'Le parcours à valoriser', icon: GraduationCap },
  { id: 3, title: 'Projets & Réalisations', subtitle: 'Ce que Claude doit mettre en avant', icon: FolderKanban },
  { id: 4, title: 'Compétences & Outils', subtitle: 'Stack et mots-clés SEO', icon: Code2 },
  { id: 5, title: 'Style & Tonalité', subtitle: 'L’ambiance visuelle à générer', icon: Palette },
];

const TONE_OPTIONS: Array<{ id: ToneOption; label: string; description: string }> = [
  { id: 'professionnel', label: 'Professionnel', description: 'Direct, crédible, structuré' },
  { id: 'premium', label: 'Premium', description: 'Raffiné, éditorial, haut de gamme' },
  { id: 'chaleureux', label: 'Chaleureux', description: 'Humain, accessible, rassurant' },
  { id: 'audacieux', label: 'Audacieux', description: 'Fort contraste, affirmé, mémorable' },
];

const STYLE_OPTIONS: Array<{ id: VisualStyleOption; label: string; description: string }> = [
  { id: 'minimaliste', label: 'Minimaliste', description: 'Respiration, hiérarchie nette, peu d’éléments' },
  { id: 'editorial', label: 'Editorial', description: 'Titres forts, blocs narratifs, mise en page premium' },
  { id: 'tech', label: 'Tech', description: 'Grille précise, signal fort, lisibilité maximale' },
  { id: 'premium', label: 'Premium', description: 'Finitions riches, contraste doux, motion élégante' },
];

const LAYOUT_OPTIONS: Array<{ id: LayoutOption; label: string; description: string }> = [
  { id: 'topbar', label: 'Topbar', description: 'Navigation claire et compacte' },
  { id: 'sidebar', label: 'Sidebar', description: 'Navigation latérale pour contenu dense' },
  { id: 'minimal', label: 'Minimal', description: 'Navigation discrète et immersive' },
];

const INITIAL_FORM: AIWizardFormState = {
  fullName: '',
  currentRole: '',
  targetRole: '',
  domain: 'Développement web',
  audience: 'Recruteurs, clients et partenaires',
  location: '',
  identitySummary: '',
  experienceSummary: '',
  educationSummary: '',
  projectHighlights: '',
  projectImpact: '',
  skills: '',
  tools: '',
  seoFocus: '',
  tone: 'professionnel',
  visualStyle: 'minimaliste',
  palette: 'Bleu nuit, ivoire, acier',
  layout: 'topbar',
  fontFamily: 'Inter',
  language: 'français',
};

const loadingStages = [
  'Analyse du parcours et des objectifs',
  'Construction de la structure éditoriale',
  'Rédaction et optimisation des sections',
  'Finalisation du brouillon prêt à éditer',
];

function splitList(value: string) {
  return value
    .split(/[\n,;]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function buildFallbackGeneratedDraft(form: AIWizardFormState): AIGeneratedPortfolioDraft {
  const title = form.fullName ? `${form.fullName} — ${form.currentRole || form.targetRole || 'Portfolio'}` : 'Portfolio généré par Claude';
  const description = form.identitySummary || form.experienceSummary || 'Portfolio généré automatiquement à partir du questionnaire IA.';
  const skills = splitList(form.skills);
  const tools = splitList(form.tools);
  const highlights = splitList(form.projectHighlights);
  const seoKeywords = splitList(form.seoFocus);

  return {
    title,
    description,
    domain: form.domain,
    tone: form.tone,
    style: form.visualStyle,
    model: 'local-fallback',
    seoKeywords,
    theme: {
      primaryColor: form.tone === 'audacieux' ? '#0f172a' : '#1d4ed8',
      secondaryColor: form.tone === 'premium' ? '#f7f3ed' : '#f8fafc',
      fontFamily: form.fontFamily,
      variant: 'light',
    },
    layout: {
      navigation: form.layout,
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        isVisible: true,
        content: {
          label: 'Accueil',
          headline: title,
          summary: description,
          cta: 'Découvrir le portfolio',
          tags: skills.slice(0, 4),
        },
      },
      {
        id: 'about',
        type: 'about',
        isVisible: true,
        content: {
          label: 'À propos',
          headline: 'Parcours et positionnement',
          summary: form.experienceSummary || form.identitySummary,
          education: form.educationSummary,
        },
      },
      {
        id: 'projects',
        type: 'projects',
        isVisible: true,
        content: {
          label: 'Projets',
          headline: 'Réalisations clés',
          items: highlights.map((item, index) => ({
            title: item,
            description: form.projectImpact || `Impact attendu pour le projet ${index + 1}`,
          })),
        },
      },
      {
        id: 'skills',
        type: 'custom',
        isVisible: true,
        content: {
          label: 'Compétences',
          headline: 'Stack et outils',
          skills,
          tools,
        },
      },
      {
        id: 'contact',
        type: 'contact',
        isVisible: true,
        content: {
          label: 'Contact',
          headline: 'Échanger sur un projet',
          summary: `Destiné à ${form.audience.toLowerCase()}.`,
          keywords: seoKeywords,
        },
      },
    ],
  };
}

function buildPreviewSections(form: AIWizardFormState) {
  const skills = splitList(form.skills);
  const tools = splitList(form.tools);
  const highlights = splitList(form.projectHighlights);

  return [
    { title: 'Accueil', detail: form.identitySummary || form.currentRole || 'Votre bio optimisée par Claude' },
    { title: 'Expériences', detail: form.experienceSummary || 'Expériences et formation structurées' },
    { title: 'Projets', detail: highlights[0] || 'Réalisations et cas concrets' },
    { title: 'Compétences', detail: skills[0] || tools[0] || 'Stack et outils clés' },
  ];
}

async function generateWithClaude(payload: AIBackendPayload): Promise<AIBackendResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/portfolio/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI generation failed with status ${response.status}`);
  }

  return response.json() as Promise<AIBackendResponse>;
}

function StepPill({ index, active, done }: { index: number; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active || done ? 'opacity-100' : 'opacity-50'}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          done ? 'bg-emerald-500 text-white' : active ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' : 'bg-zinc-200 text-zinc-500'
        }`}
      >
        {done ? <Check size={16} /> : index}
      </div>
      <div className="hidden lg:block">
        <div className="text-sm font-semibold text-zinc-100">{STEPS[index - 1].title}</div>
        <div className="text-xs text-zinc-400">{STEPS[index - 1].subtitle}</div>
      </div>
    </div>
  );
}

export default function CreateFromAI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<AIWizardFormState>(INITIAL_FORM);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isGenerating) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setLoadingStage(current => (current + 1) % loadingStages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Utilisateur';
  const author = displayName;

  const normalizedSlug = useMemo(() => {
    const base = form.fullName || form.currentRole || 'portfolio-ia';
    return toSlug(base);
  }, [form.currentRole, form.fullName]);

  const canAdvance = useMemo(() => {
    if (step === 1) {
      return Boolean(form.fullName.trim() && form.currentRole.trim());
    }

    if (step === 2) {
      return Boolean(form.experienceSummary.trim() || form.educationSummary.trim());
    }

    if (step === 3) {
      return Boolean(form.projectHighlights.trim());
    }

    if (step === 4) {
      return Boolean(form.skills.trim() || form.tools.trim());
    }

    return true;
  }, [form.educationSummary, form.experienceSummary, form.fullName, form.projectHighlights, form.currentRole, form.skills, form.tools, step]);

  const buildPayload = (): AIBackendPayload => ({
    identity: {
      fullName: form.fullName.trim(),
      currentRole: form.currentRole.trim(),
      targetRole: form.targetRole.trim(),
      domain: form.domain.trim(),
      audience: form.audience.trim(),
      location: form.location.trim(),
      summary: form.identitySummary.trim(),
      language: form.language.trim(),
    },
    experience: {
      summary: form.experienceSummary.trim(),
      education: form.educationSummary.trim(),
    },
    projects: {
      highlights: splitList(form.projectHighlights),
      impact: form.projectImpact.trim(),
    },
    skills: {
      skills: splitList(form.skills),
      tools: splitList(form.tools),
      seoFocus: splitList(form.seoFocus),
    },
    style: {
      tone: form.tone,
      visualStyle: form.visualStyle,
      palette: form.palette.trim(),
      layout: form.layout,
      fontFamily: form.fontFamily.trim(),
    },
  });

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    const fallbackDraft = buildFallbackGeneratedDraft(form);

    try {
      const response = await generateWithClaude(buildPayload());
      const generated: AIGeneratedPortfolioDraft = {
        title: response.title || fallbackDraft.title,
        description: response.description || fallbackDraft.description,
        domain: response.domain || fallbackDraft.domain,
        tone: response.tone || fallbackDraft.tone,
        style: response.style || fallbackDraft.style,
        model: response.model || 'claude',
        seoKeywords: response.seoKeywords || fallbackDraft.seoKeywords,
        theme: response.theme || fallbackDraft.theme,
        layout: response.layout || fallbackDraft.layout,
        sections: response.sections || fallbackDraft.sections,
      };

      const draft = createAIPortfolioDraft({
        generated,
        slug: normalizedSlug,
        visibility: 'public',
        author,
      });

      savePortfolioDraft(draft);
      window.setTimeout(() => navigate(`/dashboard/editor/${draft.id}`), 500);
    } catch (generationError) {
      const draft = createAIPortfolioDraft({
        generated: fallbackDraft,
        slug: normalizedSlug,
        visibility: 'public',
        author,
      });

      savePortfolioDraft(draft);
      setError(generationError instanceof Error ? generationError.message : 'Impossible de contacter Claude, utilisation du fallback local.');
      window.setTimeout(() => navigate(`/dashboard/editor/${draft.id}`), 700);
    }
  };

  const previewSections = buildPreviewSections(form);

  return (
    <div className="min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(160deg,#09090b_0%,#111827_48%,#0f172a_100%)] text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Retour dashboard
          </button>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <Bot size={14} />
            Claude connecté
          </div>
        </div>
      </div>

      {isGenerating ? (
        <div className="grid min-h-[calc(100vh-5rem)] place-items-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-w-xl rounded-[28px] border border-white/10 bg-white/8 p-8 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-[0_0_0_18px_rgba(255,255,255,0.03)]">
              <Loader2 size={34} className="animate-spin text-sky-300" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">L’IA construit votre portfolio...</p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Préparation de votre brouillon Claude</h1>
            <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
              {loadingStages[loadingStage]}. Les sections, le ton et la structure sont assemblés avant l’ouverture de l’éditeur.
            </p>
            <div className="mt-8 space-y-3 text-left">
              {loadingStages.map((label, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all ${
                    index === loadingStage ? 'border-sky-400/30 bg-sky-400/10 text-white' : 'border-white/10 bg-white/5 text-zinc-400'
                  }`}
                >
                  <div className={`h-2.5 w-2.5 rounded-full ${index === loadingStage ? 'bg-sky-300' : 'bg-white/20'}`} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:px-8 lg:py-8">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200/90">
                    <Stars size={14} />
                    Création par IA
                  </div>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">FLOW CRÉATION PAR IA</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                    Répondez à ces 5 étapes, puis Claude génère un portfolio éditorial prêt à être affiné dans l’éditeur.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
                  <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Slug suggéré</div>
                  <div className="mt-1 font-mono text-white">phi.app/~{normalizedSlug || 'portfolio-ia'}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {STEPS.map((item, index) => (
                  <div key={item.id} className="flex-1 min-w-[160px] rounded-2xl border border-white/10 bg-white/5 p-4">
                    <StepPill index={index + 1} active={step === item.id} done={step > item.id} />
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur-xl sm:p-7"
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <StepHeader icon={UserRound} title="ÉTAPE 1 — Identité" description="Claude a besoin d’une base claire pour écrire un portfolio qui vous ressemble." />
                    <InputGrid>
                      <TextField label="Nom / marque personnelle" value={form.fullName} onChange={value => setForm(current => ({ ...current, fullName: value }))} placeholder="Ex. Amine Benali" />
                      <TextField label="Poste actuel" value={form.currentRole} onChange={value => setForm(current => ({ ...current, currentRole: value }))} placeholder="Ex. Product Designer" />
                      <TextField label="Poste ciblé" value={form.targetRole} onChange={value => setForm(current => ({ ...current, targetRole: value }))} placeholder="Ex. Senior UX Designer" />
                      <TextField label="Localisation" value={form.location} onChange={value => setForm(current => ({ ...current, location: value }))} placeholder="Ex. Paris, remote, Casablanca" />
                    </InputGrid>
                    <TextAreaField label="Bio de départ" value={form.identitySummary} onChange={value => setForm(current => ({ ...current, identitySummary: value }))} placeholder="Décrivez votre parcours en quelques phrases. Claude réécrira ensuite cette base." />
                    <TextAreaField label="Audience principale" value={form.audience} onChange={value => setForm(current => ({ ...current, audience: value }))} placeholder="Recruteurs, clients, agences..." />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <StepHeader icon={Briefcase} title="ÉTAPE 2 — Expériences & Formation" description="Ajoutez les éléments que l’IA doit hiérarchiser, synthétiser et transformer en narration." />
                    <TextAreaField label="Expériences clés" value={form.experienceSummary} onChange={value => setForm(current => ({ ...current, experienceSummary: value }))} placeholder="Missions, rôles, secteurs, résultats, responsabilités." />
                    <TextAreaField label="Formation / certifications" value={form.educationSummary} onChange={value => setForm(current => ({ ...current, educationSummary: value }))} placeholder="Diplômes, bootcamps, certifications, ateliers." />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoCard icon={Brain} title="Ce que Claude fera" text="Réécrire le parcours en version claire, concise et crédible." />
                      <InfoCard icon={ShieldCheck} title="Sortie attendue" text="Des sections lisibles et un storytelling orienté impact." />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <StepHeader icon={FolderKanban} title="ÉTAPE 3 — Projets & Réalisations" description="Donnez à l’IA les projets dont elle peut extraire des cas concrets et des bénéfices mesurables." />
                    <TextAreaField label="Projets principaux" value={form.projectHighlights} onChange={value => setForm(current => ({ ...current, projectHighlights: value }))} placeholder="Décrivez les projets, produits ou livrables les plus parlants." />
                    <TextAreaField label="Impact / résultats" value={form.projectImpact} onChange={value => setForm(current => ({ ...current, projectImpact: value }))} placeholder="Résultats chiffrés, feedback, valeur créée, impact business." />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoCard icon={WandSparkles} title="Optimisation Claude" text="Des descriptions plus percutantes, orientées action et valeur." />
                      <InfoCard icon={Layers3} title="Structure générée" text="Un ordre de sections pensé pour l’attention et la conversion." />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <StepHeader icon={Code2} title="ÉTAPE 4 — Compétences & Outils" description="La stack, les mots-clés SEO et les outils servent à enrichir le contenu et le positionnement." />
                    <InputGrid>
                      <TextField label="Compétences" value={form.skills} onChange={value => setForm(current => ({ ...current, skills: value }))} placeholder="React, TypeScript, design system" />
                      <TextField label="Outils / plateformes" value={form.tools} onChange={value => setForm(current => ({ ...current, tools: value }))} placeholder="Figma, GitHub, Notion" />
                      <TextField label="Cibles SEO" value={form.seoFocus} onChange={value => setForm(current => ({ ...current, seoFocus: value }))} placeholder="portfolio design, UX UI, consultant freelance" />
                      <TextField label="Langue" value={form.language} onChange={value => setForm(current => ({ ...current, language: value }))} placeholder="français" />
                    </InputGrid>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoCard icon={Search} title="SEO" text="Claude transformera vos mots-clés en hiérarchie et métadonnées utiles." />
                      <InfoCard icon={Mic} title="Voix éditoriale" text="Le contenu reste cohérent avec votre domaine et votre audience." />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <StepHeader icon={Palette} title="ÉTAPE 5 — Style & Tonalité" description="Choisissez la direction visuelle et la voix du portfolio avant la génération." />

                    <div className="grid gap-4 lg:grid-cols-2">
                      <OptionGroup title="Ton" options={TONE_OPTIONS} selected={form.tone} onSelect={value => setForm(current => ({ ...current, tone: value as ToneOption }))} />
                      <OptionGroup title="Style visuel" options={STYLE_OPTIONS} selected={form.visualStyle} onSelect={value => setForm(current => ({ ...current, visualStyle: value as VisualStyleOption }))} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <OptionGroup title="Layout" options={LAYOUT_OPTIONS} selected={form.layout} onSelect={value => setForm(current => ({ ...current, layout: value as LayoutOption }))} />
                      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 lg:col-span-2">
                        <div className="mb-3 text-sm font-semibold text-white">Palette & typographie</div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TextField label="Palette" value={form.palette} onChange={value => setForm(current => ({ ...current, palette: value }))} placeholder="Bleu nuit, ivoire, cuivre" />
                          <TextField label="Police principale" value={form.fontFamily} onChange={value => setForm(current => ({ ...current, fontFamily: value }))} placeholder="Inter, Manrope, Fraunces" />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                        {error}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <button
                    onClick={() => setStep(current => (current > 1 ? ((current - 1) as WizardStep) : current))}
                    disabled={step === 1}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={16} />
                    Retour
                  </button>

                  {step < 5 ? (
                    <button
                      onClick={() => setStep(current => (current + 1) as WizardStep)}
                      disabled={!canAdvance}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-zinc-950 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuer
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-sm font-extrabold text-zinc-950 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.01]"
                    >
                      Générer avec Claude
                      <Sparkles size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                  <LayoutDashboard size={22} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Aperçu avant génération</div>
                  <div className="text-xs text-zinc-400">Ce que Claude va assembler dans le brouillon</div>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-zinc-500">
                  <span>Portfolio IA</span>
                  <span className="font-mono text-sky-200">phi.app/~{normalizedSlug || 'portfolio-ia'}</span>
                </div>
                <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 p-5">
                  <div className="text-lg font-black tracking-tight text-white">{form.fullName || 'Votre nom'}</div>
                  <div className="mt-1 text-sm text-zinc-300">{form.currentRole || 'Votre rôle actuel'}</div>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    {form.identitySummary || 'Une bio réécrite et optimisée par Claude apparaîtra ici.'}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {previewSections.map(section => (
                    <div key={section.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{section.title}</div>
                      <div className="mt-2 text-sm font-semibold text-white">{section.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MetricCard label="Étapes" value={`${step}/5`} />
                <MetricCard label="Style" value={form.visualStyle} />
                <MetricCard label="Ton" value={form.tone} />
                <MetricCard label="Layout" value={form.layout} />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-sky-500/15 to-cyan-400/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Ce qui sera généré</div>
                  <div className="text-xs text-zinc-300">Titre, bio, sections, SEO et direction éditoriale</div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-zinc-200">
                <ChecklistItem label="Titre accrocheur" />
                <ChecklistItem label="Bio réécrite et optimisée" />
                <ChecklistItem label="Descriptions de projets enrichies" />
                <ChecklistItem label="Structure de sections recommandée" />
                <ChecklistItem label="Mots-clés SEO" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepHeader({ icon: Icon, title, description }: { icon: typeof UserRound; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-300">{description}</p>
      </div>
    </div>
  );
}

function InputGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-zinc-100">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/15"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-zinc-100">{label}</span>
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white placeholder:text-zinc-500 outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/15"
      />
    </label>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Brain; title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
          <Icon size={18} />
        </div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
        <Check size={14} />
      </div>
      <span>{label}</span>
    </div>
  );
}

function OptionGroup<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: Array<{ id: T; label: string; description: string }>;
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 text-sm font-semibold text-white">{title}</div>
      <div className="space-y-3">
        {options.map(option => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                active ? 'border-sky-400/40 bg-sky-400/10 text-white' : 'border-white/10 bg-black/15 text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{option.label}</div>
                  <div className="mt-1 text-xs leading-5 text-zinc-400">{option.description}</div>
                </div>
                {active && <Check size={16} className="text-sky-300" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}