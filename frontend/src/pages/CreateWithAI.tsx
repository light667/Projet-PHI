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
import { apiUrl, wakeBackend, fetchWithTimeout } from '../lib/api.js';
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
  const totalSteps = 9;

  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');

  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [yearsExperience, setYearsExperience] = useState<string>('');

  const [experiences, setExperiences] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const [services, setServices] = useState<string[]>([]);
  const [aiProposeServices, setAiProposeServices] = useState(false);

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
  const [waking, setWaking] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email, email]);

  useEffect(() => {
    if (!slugManual) {
      if (fullName && professionalTitle) {
        setSlug(toSlug(`${fullName}-${professionalTitle}`));
      } else if (portfolioTitle) {
        setSlug(toSlug(portfolioTitle));
      }
    }
  }, [fullName, professionalTitle, portfolioTitle, slugManual]);

  useEffect(() => {
    if (step === 9 && !portfolioTitle.trim() && professionalTitle.trim()) {
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
        return true; // Experiences are optional
      case 4:
        return true; // Projects are optional
      case 5:
        return true; // Services are optional
      case 6:
        return true;
      case 7:
        return careerGoal.trim().length >= 5;
      case 8:
        return !!domain;
      case 9:
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

  const addExperience = () => setExperiences(e => [...e, '']);
  const updateExperience = (i: number, val: string) => {
    setExperiences(prev => prev.map((e, idx) => (idx === i ? val : e)));
  };
  const removeExperience = (i: number) => setExperiences(prev => prev.filter((_, idx) => idx !== i));

  const addProject = () => setProjects(p => [...p, emptyProject()]);
  const removeProject = (i: number) => setProjects(p => p.filter((_, idx) => idx !== i));
  const updateProject = (i: number, field: keyof ProjectRow, value: string) => {
    setProjects(prev => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  const addService = () => setServices(s => [...s, '']);
  const updateService = (i: number, val: string) => {
    setServices(prev => prev.map((s, idx) => (idx === i ? val : s)));
  };
  const removeService = (i: number) => setServices(prev => prev.filter((_, idx) => idx !== i));

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image (JPEG, PNG, WebP)');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiUrl('/api/upload/image'), {
        method: 'POST',
        body: formData,
        headers: {
          // Ne pas définir Content-Type, laisse le navigateur le faire pour FormData
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setProfileImageUrl(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload de l\'image. Veuillez réessayer.');
    } finally {
      setUploadingImage(false);
    }
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

    const skillList = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const expList = experiences.map(e => e.trim()).filter(e => e.length > 0);
    const serviceList = services.map(s => s.trim()).filter(s => s.length > 0);

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
      whatsapp: whatsapp.trim() || null,
      location: location.trim(),
      social: {
        linkedin: linkedin.trim() || null,
        github: github.trim() || null,
        website: website.trim() || null,
      },
      bio: bio.trim(),
      skills: skillList,
      experiences: expList,
      years_experience: y,
      projects: proj,
      services: serviceList,
      ai_propose_services: aiProposeServices,
      tone,
      theme_variant: themeVariant,
      accent_color_hint: accentHint.trim() || null,
      career_goal: careerGoal.trim(),
      target_audience: targetAudience.trim(),
      profile_image_url: profileImageUrl.trim() || null,
    };
  };

  const handleGenerate = async () => {
    setApiError('');
    if (!validateSlug(slug)) return;
    if (!canAdvance()) return;

    // Phase 1: Wake up Render backend (free tier may be sleeping)
    setWaking(true);
    setGenerating(true);
    try {
      const alive = await wakeBackend(3, 4000);
      if (!alive) {
        setApiError(t('ai_portfolio.error_server_sleep'));
        setGenerating(false);
        setWaking(false);
        return;
      }
    } catch {
      // Best-effort wake — continue even if ping fails
    }
    setWaking(false);

    // Phase 2: Generate portfolio
    try {
      const res = await fetchWithTimeout(
        apiUrl('/api/portfolios/generate'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload()),
        },
        120_000,
      );

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
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setApiError(t('ai_portfolio.error_timeout'));
      } else {
        setApiError(t('ai_portfolio.error_network'));
      }
    } finally {
      setGenerating(false);
      setWaking(false);
    }
  };

  const stepTitle = (s: number) => {
    const keys = [
      '',
      'ai_portfolio.step1_title',
      'ai_portfolio.step2_title',
      'ai_portfolio.step_exp_title',
      'ai_portfolio.step3_title',
      'ai_portfolio.step_services_title',
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
      'ai_portfolio.step_exp_sub',
      'ai_portfolio.step3_sub',
      'ai_portfolio.step_services_sub',
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
        <button
          type="button"
          onClick={() => {
            if (step > 1) setStep(s => s - 1);
            else navigate('/dashboard');
          }}
          className="p-2 rounded-[10px] border border-[var(--border-color)] hover:bg-[var(--bg)] text-[var(--text2)]"
        >
          <ArrowLeft size={18} />
        </button>
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

      <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-[var(--text2)] overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
          <div key={s} className="flex items-center gap-2 shrink-0">
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
            {s < totalSteps && <div className={`h-0.5 w-4 sm:w-8 ${s < step ? 'bg-green-400' : 'bg-[var(--border-color)]'}`} />}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('ai_portfolio.phone')} value={phone} onChange={setPhone} />
                <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="ex. +229 90000000" />
              </div>
              <Field label={t('ai_portfolio.location')} value={location} onChange={setLocation} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://…" />
                <Field label="GitHub" value={github} onChange={setGithub} placeholder="https://…" />
              </div>
              <Field label={t('ai_portfolio.website')} value={website} onChange={setWebsite} placeholder="https://…" />
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text)]">{t('ai_portfolio.profile_image')}</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-[var(--text2)]">
                      <Loader2 size={16} className="animate-spin" />
                      Upload en cours...
                    </div>
                  )}
                  {profileImageUrl && (
                    <div className="space-y-2">
                      <p className="text-xs text-green-600">Image uploadée avec succès !</p>
                      <div className="relative inline-block">
                        <img
                          src={profileImageUrl}
                          alt="Aperçu"
                          className="w-20 h-20 object-cover rounded-lg border border-[var(--border-color)]"
                        />
                        <button
                          type="button"
                          onClick={() => setProfileImageUrl('')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[var(--text2)]">Formats acceptés: JPEG, PNG, WebP (max 5MB)</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-[var(--text)]">{t('ai_portfolio.bio')}</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-indigo-500"
                placeholder={t('ai_portfolio.bio_ph')}
              />
              <Field label={t('ai_portfolio.skills_label')} value={skills} onChange={setSkills} placeholder="React, Python, Design UI, Marketing..." />
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
              <p className="text-sm text-[var(--text2)] mb-2">{t('ai_portfolio.experiences_hint')}</p>
              {experiences.map((e, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={e}
                    onChange={ev => updateExperience(i, ev.target.value)}
                    className="flex-1 px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-sm outline-none"
                    placeholder="ex. Lead Developer chez Google (2020-2023)"
                  />
                  <button onClick={() => removeExperience(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button onClick={addExperience} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                <Plus size={16} /> {t('ai_portfolio.add_experience')}
              </button>
            </div>
          )}

          {step === 4 && (
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
              <button type="button" onClick={addProject} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                <Plus size={16} /> {t('ai_portfolio.add_project')}
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                <input
                  type="checkbox"
                  id="aiPropose"
                  checked={aiProposeServices}
                  onChange={e => setAiProposeServices(e.target.checked)}
                  className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="aiPropose" className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 cursor-pointer">
                  {t('ai_portfolio.ai_propose_services_label')}
                </label>
              </div>

              {!aiProposeServices && (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--text2)]">{t('ai_portfolio.services_hint')}</p>
                  {services.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={s}
                        onChange={ev => updateService(i, ev.target.value)}
                        className="flex-1 px-4 py-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg)] text-sm outline-none"
                        placeholder="ex. Création de sites Web vitrines"
                      />
                      <button onClick={() => removeService(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button onClick={addService} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
                    <Plus size={16} /> {t('ai_portfolio.add_service')}
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 6 && (
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

          {step === 7 && (
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

          {step === 8 && (
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

          {step === 9 && (
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
                    {waking ? t('ai_portfolio.waking') : t('ai_portfolio.generating')}
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

          {step < 9 && (
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
