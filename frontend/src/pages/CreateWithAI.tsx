import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Globe,
  Lock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { apiUrl } from '../lib/api.js';
import { savePortfolioDraft, toSlug, assertPortfolioDraft, type PortfolioVisibility } from '../lib/portfolioDraft.js';

const AI_DOMAINS = [
  { id: 'dev', labelKey: 'ai_portfolio.domains.dev' },
  { id: 'design', labelKey: 'ai_portfolio.domains.design' },
  { id: 'archi', labelKey: 'ai_portfolio.domains.archi' },
  { id: 'photo', labelKey: 'ai_portfolio.domains.photo' },
  { id: 'marketing', labelKey: 'ai_portfolio.domains.marketing' },
  { id: 'finance', labelKey: 'ai_portfolio.domains.finance' },
  { id: 'student', labelKey: 'ai_portfolio.domains.student' },
  { id: 'law', labelKey: 'ai_portfolio.domains.law' },
  { id: 'medical', labelKey: 'ai_portfolio.domains.medical' },
  { id: 'data', labelKey: 'ai_portfolio.domains.data' },
] as const;

type ProjectRow = { name: string; description: string; url: string; stack: string };

const emptyProject = (): ProjectRow => ({ name: '', description: '', url: '', stack: '' });

export default function CreateWithAI() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');

  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState<string>('');

  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const [tone, setTone] = useState<'professional' | 'creative' | 'minimal'>('professional');
  const [themeVariant, setThemeVariant] = useState<'light' | 'dark'>('light');
  const [accentHint, setAccentHint] = useState('');

  const [careerGoal, setCareerGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const [domain, setDomain] = useState('dev');

  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [visibility, setVisibility] = useState<PortfolioVisibility>('public');

  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email, email]);

  useEffect(() => {
    if (!slugManual && portfolioTitle) {
      setSlug(toSlug(portfolioTitle));
    }
  }, [portfolioTitle, slugManual]);

  useEffect(() => {
    if (step === 7 && !portfolioTitle.trim() && professionalTitle.trim()) {
      setPortfolioTitle(`${professionalTitle.trim()} — Portfolio`);
    }
  }, [step, portfolioTitle, professionalTitle]);

  const validateSlug = useCallback((val: string) => {
    if (!val) {
      setSlugError(t('ai_portfolio.slug_empty'));
      return false;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) {
      setSlugError(t('ai_portfolio.slug_invalid'));
      return false;
    }
    setSlugError('');
    return true;
  }, [t]);

  const canAdvance = useCallback(() => {
    switch (step) {
      case 1:
        return fullName.trim().length >= 2 && professionalTitle.trim().length >= 2;
      case 2:
        return bio.trim().length >= 20;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return careerGoal.trim().length >= 5;
      case 6:
        return !!domain;
      case 7:
        return portfolioTitle.trim().length >= 2 && slug.length >= 2 && !slugError;
      default:
        return false;
    }
  }, [
    step,
    fullName,
    professionalTitle,
    bio,
    careerGoal,
    domain,
    portfolioTitle,
    slug,
    slugError,
  ]);

  const addProject = () => setProjects(p => [...p, emptyProject()]);
  const removeProject = (i: number) => setProjects(p => p.filter((_, idx) => idx !== i));
  const updateProject = (i: number, field: keyof ProjectRow, value: string) => {
    setProjects(prev => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  const buildPayload = () => {
    const y =
      yearsExperience.trim() === ''
        ? null
        : (() => {
            const n = parseInt(yearsExperience, 10);
            return Number.isFinite(n) ? Math.min(60, Math.max(0, n)) : null;
          })();
    const proj = projects
      .filter(p => p.name.trim())
      .map(p => ({
        name: p.name.trim(),
        description: p.description.trim(),
        url: p.url.trim() || null,
        stack: p.stack.trim() || null,
      }));
    return {
      userId: user?.uid ?? 'test-user-id',
      title: portfolioTitle.trim(),
      slug: slug.trim(),
      visibility,
      domain,
      full_name: fullName.trim(),
      professional_title: professionalTitle.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      social: {
        linkedin: linkedin.trim() || null,
        github: github.trim() || null,
        website: website.trim() || null,
      },
      bio: bio.trim(),
      years_experience: y,
      projects: proj,
      tone,
      theme_variant: themeVariant,
      accent_color_hint: accentHint.trim() || null,
      career_goal: careerGoal.trim(),
      target_audience: targetAudience.trim(),
    };
  };

  const handleGenerate = async () => {
    setApiError('');
    if (!validateSlug(slug)) return;
    if (!canAdvance()) return;

    setGenerating(true);
    try {
      const res = await fetch(apiUrl('/api/portfolios/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      const raw = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof raw.detail === 'string'
            ? raw.detail
            : Array.isArray(raw.detail)
              ? raw.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(', ')
              : t('ai_portfolio.error_generic');
        setApiError(msg || t('ai_portfolio.error_generic'));
        setGenerating(false);
        return;
      }

      const draft = assertPortfolioDraft(raw.draft);
      if (!draft) {
        setApiError(t('ai_portfolio.error_draft'));
        setGenerating(false);
        return;
      }

      savePortfolioDraft(draft);
      navigate(`/dashboard/editor/${draft.id}`);
    } catch {
      setApiError(t('ai_portfolio.error_network'));
    } finally {
      setGenerating(false);
    }
  };

  const stepTitle = (s: number) => {
    const keys = [
      '',
      'ai_portfolio.step1_title',
      'ai_portfolio.step2_title',
      'ai_portfolio.step3_title',
      'ai_portfolio.step4_title',
      'ai_portfolio.step5_title',
      'ai_portfolio.step6_title',
      'ai_portfolio.step7_title',
    ];
    return t(keys[s] ?? '');
  };

  const stepSubtitle = (s: number) => {
    const keys = [
      '',
      'ai_portfolio.step1_sub',
      'ai_portfolio.step2_sub',
      'ai_portfolio.step3_sub',
      'ai_portfolio.step4_sub',
      'ai_portfolio.step5_sub',
      'ai_portfolio.step6_sub',
      'ai_portfolio.step7_sub',
    ];
    return t(keys[s] ?? '');
  };

  return (
    <div className="pb-16 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className="p-2 rounded-[10px] border border-[var(--border-color)] hover:bg-[var(--bg)] text-[var(--text2)]"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-[10px] border border-[var(--border-color)] hover:bg-[var(--bg)] text-[var(--text2)]"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-[var(--text)]">{t('ai_portfolio.page_title')}</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25">
              {t('ai_portfolio.credit_badge')}
            </span>
          </div>
          <p className="text-sm text-[var(--text2)] mt-1">{t('ai_portfolio.page_sub')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-[var(--text2)]">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
          <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                s === step
                  ? 'bg-indigo-600 text-white'
                  : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-[var(--border-color)] text-[var(--text3)]'
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < totalSteps && <div className={`h-0.5 flex-1 min-w-[8px] ${s < step ? 'bg-green-400' : 'bg-[var(--border-color)]'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[20px] p-6 sm:p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[var(--text)] mb-1">{stepTitle(step)}</h2>
          <p className="text-sm text-[var(--text2)] mb-6">{stepSubtitle(step)}</p>

          {step === 1 && (
            <div className="space-y-4">
              <Field label={t('ai_portfolio.full_name')} value={fullName} onChange={setFullName} required />
              <Field label={t('ai_portfolio.pro_title')} value={professionalTitle} onChange={setProfessionalTitle} required />
              <Field label={t('ai_portfolio.email')} value={email} onChange={setEmail} type="email" />
              <Field label={t('ai_portfolio.phone')} value={phone} onChange={setPhone} />
              <Field label={t('ai_portfolio.location')} value={location} onChange={setLocation} />
              <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://…" />
              <Field label="GitHub" value={github} onChange={setGithub} placeholder="https://…" />
              <Field label={t('ai_portfolio.website')} value={website} onChange={setWebsite} placeholder="https://…" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-[var(--text)]">{t('ai_portfolio.bio')}</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text)] text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                placeholder={t('ai_portfolio.bio_ph')}
              />
              <p className={`text-xs font-medium ${bio.trim().length >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
                {bio.trim().length}/20 min
              </p>
              <Field
                label={t('ai_portfolio.years_xp')}
                value={yearsExperience}
                onChange={setYearsExperience}
                type="number"
                placeholder="ex. 5"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text2)]">{t('ai_portfolio.projects_hint')}</p>
              {projects.map((p, i) => (
                <div key={i} className="p-4 rounded-[14px] border border-[var(--border-color)] bg-[var(--bg)] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--text3)] uppercase">{t('ai_portfolio.project_n', { n: i + 1 })}</span>
                    <button type="button" onClick={() => removeProject(i)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <Field label={t('ai_portfolio.proj_name')} value={p.name} onChange={v => updateProject(i, 'name', v)} />
                  <Field label={t('ai_portfolio.proj_desc')} value={p.description} onChange={v => updateProject(i, 'description', v)} />
                  <Field label="URL" value={p.url} onChange={v => updateProject(i, 'url', v)} />
                  <Field label={t('ai_portfolio.proj_stack')} value={p.stack} onChange={v => updateProject(i, 'stack', v)} />
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus size={16} /> {t('ai_portfolio.add_project')}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-[var(--text)] mb-2">{t('ai_portfolio.tone')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['professional', 'creative', 'minimal'] as const).map(tn => (
                    <button
                      key={tn}
                      type="button"
                      onClick={() => setTone(tn)}
                      className={`px-4 py-3 rounded-[12px] border text-sm font-semibold transition ${
                        tone === tn
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                          : 'border-[var(--border-color)] hover:border-slate-300'
                      }`}
                    >
                      {t(`ai_portfolio.tone_${tn}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)] mb-2">{t('ai_portfolio.theme')}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeVariant('light')}
                    className={`px-4 py-3 rounded-[12px] border text-sm font-semibold ${
                      themeVariant === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' : 'border-[var(--border-color)]'
                    }`}
                  >
                    {t('ai_portfolio.theme_light')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeVariant('dark')}
                    className={`px-4 py-3 rounded-[12px] border text-sm font-semibold ${
                      themeVariant === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' : 'border-[var(--border-color)]'
                    }`}
                  >
                    {t('ai_portfolio.theme_dark')}
                  </button>
                </div>
              </div>
              <Field
                label={t('ai_portfolio.accent')}
                value={accentHint}
                onChange={setAccentHint}
                placeholder="#6366f1 ou « bleu nuit »"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-[var(--text)]">{t('ai_portfolio.goal')}</label>
                <textarea
                  value={careerGoal}
                  onChange={e => setCareerGoal(e.target.value)}
                  rows={5}
                  className="mt-2 w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-sm"
                  placeholder={t('ai_portfolio.goal_ph')}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-[var(--text)]">{t('ai_portfolio.audience')}</label>
                <textarea
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  rows={3}
                  className="mt-2 w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-sm"
                  placeholder={t('ai_portfolio.audience_ph')}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_DOMAINS.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDomain(d.id)}
                  className={`px-3 py-3 rounded-[12px] border text-sm font-semibold text-left transition ${
                    domain === d.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-200'
                      : 'border-[var(--border-color)] hover:border-indigo-300'
                  }`}
                >
                  {t(d.labelKey)}
                </button>
              ))}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-5">
              <Field
                label={t('ai_portfolio.phi_title')}
                value={portfolioTitle}
                onChange={setPortfolioTitle}
                required
                placeholder={t('ai_portfolio.phi_title_ph')}
              />
              <div>
                <label className="text-sm font-bold text-[var(--text)]">{t('ai_portfolio.slug')}</label>
                <div
                  className={`mt-2 flex items-center border rounded-[12px] overflow-hidden bg-[var(--bg)] ${slugError ? 'border-red-400' : 'border-[var(--border-color)]'}`}
                >
                  <span className="px-3 py-3 text-xs font-semibold text-[var(--text3)] bg-[var(--surface)] border-r border-[var(--border-color)] shrink-0">
                    phi.app/~
                  </span>
                  <input
                    value={slug}
                    onChange={e => {
                      setSlugManual(true);
                      const v = toSlug(e.target.value);
                      setSlug(v);
                      validateSlug(v);
                    }}
                    className="flex-1 px-3 py-3 bg-transparent text-sm font-mono outline-none min-w-0"
                  />
                </div>
                {slugError ? <p className="text-xs text-red-500 mt-1">{slugError}</p> : null}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)] mb-2">{t('ai_portfolio.visibility')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['public', 'private'] as const).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVisibility(v)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] border text-sm font-semibold ${
                        visibility === v ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' : 'border-[var(--border-color)]'
                      }`}
                    >
                      {v === 'public' ? <Globe size={16} /> : <Lock size={16} />}
                      {v === 'public' ? t('ai_portfolio.vis_public') : t('ai_portfolio.vis_private')}
                    </button>
                  ))}
                </div>
              </div>

              {apiError ? (
                <div className="flex items-start gap-2 p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canAdvance() || generating}
                onClick={handleGenerate}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold rounded-[14px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('ai_portfolio.generating')}
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    {t('ai_portfolio.cta_generate')}
                  </>
                )}
              </button>
            </div>
          )}

          {step < 7 && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!canAdvance()}
                onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-indigo-600 text-white font-bold text-sm disabled:opacity-40"
              >
                {t('ai_portfolio.next')} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[var(--text)]">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}
