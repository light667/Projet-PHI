import type { PortfolioDraft } from './portfolioDraft.js';
import type { PortfolioSection } from '../types/portfolio.js';

export interface EditorHistoryEntry {
  timestamp: number;
  portfolio: PortfolioDraft;
  description: string;
}

export interface EditorState {
  portfolio: PortfolioDraft;
  selectedSectionId: string | null;
  history: EditorHistoryEntry[];
  historyIndex: number;
  isDirty: boolean;
  isSaving: boolean;
  deviceView: 'mobile' | 'tablet' | 'desktop';
}

export const AVAILABLE_SECTION_TYPES = [
  'hero',
  'about',
  'gallery',
  'contact',
  'projects',
  'custom',
] as const;

export const SECTION_TYPE_LABELS: Record<PortfolioSection['type'], string> = {
  hero: 'Hero / Accueil',
  about: 'À propos',
  gallery: 'Galerie',
  contact: 'Contact',
  projects: 'Projets',
  custom: 'Section personnalisée',
};

export const SECTION_TYPE_ICONS: Record<PortfolioSection['type'], string> = {
  hero: '🎯',
  about: '👤',
  gallery: '🖼️',
  contact: '💬',
  projects: '📁',
  custom: '⚙️',
};

export function createNewSection(
  type: PortfolioSection['type'],
  _index: number,
): PortfolioSection {
  const timestamp = Date.now();
  return {
    id: `section-${type}-${timestamp}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    isVisible: true,
    content: {
      label: SECTION_TYPE_LABELS[type],
      headline: `Nouvelle section ${SECTION_TYPE_LABELS[type]}`,
      summary: 'Cliquez pour éditer le contenu de cette section.',
    },
  };
}

export function reorderSections(
  sections: PortfolioSection[],
  fromIndex: number,
  toIndex: number,
): PortfolioSection[] {
  const result = [...sections];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function updateSectionContent(
  sections: PortfolioSection[],
  sectionId: string,
  updates: Partial<PortfolioSection['content']>,
): PortfolioSection[] {
  return sections.map(section =>
    section.id === sectionId
      ? { ...section, content: { ...section.content, ...updates } }
      : section,
  );
}

export function toggleSectionVisibility(
  sections: PortfolioSection[],
  sectionId: string,
): PortfolioSection[] {
  return sections.map(section =>
    section.id === sectionId
      ? { ...section, isVisible: !section.isVisible }
      : section,
  );
}

export function deleteSectionById(
  sections: PortfolioSection[],
  sectionId: string,
): PortfolioSection[] {
  return sections.filter(section => section.id !== sectionId);
}

export function getSectionById(
  sections: PortfolioSection[],
  sectionId: string,
): PortfolioSection | null {
  return sections.find(section => section.id === sectionId) ?? null;
}
