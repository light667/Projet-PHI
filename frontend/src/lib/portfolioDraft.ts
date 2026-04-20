import type { PortfolioData, PortfolioSection } from '../types/portfolio';

export interface TemplateDefinition {
  id: string;
  name: string;
  domain: string;
  description: string;
  gradient: string;
  accentColor: string;
  tags: string[];
  previewBg: string;
  mockSections: string[];
}

export type PortfolioVisibility = 'public' | 'private';

export interface PortfolioDraft extends PortfolioData {
  templateId: string;
  templateName: string;
  slug: string;
  visibility: PortfolioVisibility;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

const DRAFT_STORAGE_PREFIX = 'phi-portfolio-draft';
const CURRENT_DRAFT_KEY = 'phi-current-portfolio-id';

function getDraftStorageKey(id: string) {
  return `${DRAFT_STORAGE_PREFIX}:${id}`;
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function inferSectionType(label: string, index: number): PortfolioSection['type'] {
  const normalized = label.toLowerCase();

  if (index === 0 || normalized.includes('accueil') || normalized.includes('about') || normalized.includes('moi')) {
    return 'hero';
  }

  if (normalized.includes('projet') || normalized.includes('work') || normalized.includes('portfolio')) {
    return 'projects';
  }

  if (normalized.includes('contact')) {
    return 'contact';
  }

  if (normalized.includes('galerie') || normalized.includes('photo') || normalized.includes('séries')) {
    return 'gallery';
  }

  if (normalized.includes('propos') || normalized.includes('bio') || normalized.includes('profil')) {
    return 'about';
  }

  return 'custom';
}

function buildSections(template: TemplateDefinition, title: string): PortfolioSection[] {
  return template.mockSections.map((sectionLabel, index) => ({
    id: `${template.id}-section-${index + 1}`,
    type: inferSectionType(sectionLabel, index),
    isVisible: true,
    content: {
      label: sectionLabel,
      headline: title,
      summary: template.description,
      tags: template.tags,
    },
  }));
}

export function createPortfolioDraft(params: {
  template: TemplateDefinition;
  title: string;
  slug: string;
  visibility: PortfolioVisibility;
  author: string;
}): PortfolioDraft {
  const id = `${params.template.id}-${Date.now()}`;
  const now = new Date().toISOString();

  return {
    id,
    templateId: params.template.id,
    templateName: params.template.name,
    slug: params.slug,
    visibility: params.visibility,
    domain: params.template.domain,
    createdAt: now,
    updatedAt: now,
    metadata: {
      title: params.title,
      description: params.template.description,
      author: params.author,
    },
    theme: {
      primaryColor: '#4f46e5',
      secondaryColor: '#f8fafc',
      fontFamily: 'Inter',
      variant: 'light',
    },
    layout: {
      navigation: 'topbar',
    },
    sections: buildSections(params.template, params.title),
  };
}

export function savePortfolioDraft(draft: PortfolioDraft) {
  if (typeof window === 'undefined') {
    return draft;
  }

  window.localStorage.setItem(getDraftStorageKey(draft.id), JSON.stringify(draft));
  window.localStorage.setItem(CURRENT_DRAFT_KEY, draft.id);

  return draft;
}

export function loadPortfolioDraft(id?: string | null) {
  if (typeof window === 'undefined') {
    return null;
  }

  const draftId = id || window.localStorage.getItem(CURRENT_DRAFT_KEY);
  if (!draftId) {
    return null;
  }

  const raw = window.localStorage.getItem(getDraftStorageKey(draftId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PortfolioDraft;
  } catch {
    return null;
  }
}

export function listPortfolioDraftSections(draft: PortfolioDraft) {
  return draft.sections.filter(section => section.isVisible);
}

/** Brouillon renvoyé par POST /api/portfolios/generate — déjà complet, prêt pour localStorage + éditeur. */
export function assertPortfolioDraft(data: unknown): PortfolioDraft | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as PortfolioDraft;
  if (!d.id || !Array.isArray(d.sections) || !d.metadata) return null;
  return d;
}