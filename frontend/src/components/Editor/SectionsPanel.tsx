import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus, Eye, EyeOff, Trash2, GripVertical, ChevronDown,
} from 'lucide-react';
import type { PortfolioDraft } from '../../lib/portfolioDraft.js';
import {
  createNewSection,
  SECTION_TYPE_ICONS,
  SECTION_TYPE_LABELS,
} from '../../lib/editorState.js';
import type { PortfolioSection } from '../../types/portfolio.js';

interface SectionsPanelProps {
  portfolio: PortfolioDraft;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onReorderSections: (sections: PortfolioSection[]) => void;
  onAddSection: (section: PortfolioSection) => void;
  onDeleteSection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export default function SectionsPanel({
  portfolio,
  selectedSectionId,
  onSelectSection,
  onReorderSections,
  onAddSection,
  onDeleteSection,
  onToggleVisibility,
}: SectionsPanelProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const handleAddSection = (type: PortfolioSection['type']) => {
    const newSection = createNewSection(type, portfolio.sections.length);
    onAddSection(newSection);
    setIsAddMenuOpen(false);
    onSelectSection(newSection.id);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-zinc-100">
        <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wide mb-3">Sections</h3>
        <div className="relative">
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors"
          >
            <Plus size={16} />
            Ajouter
          </button>
          <AnimatePresence>
            {isAddMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 right-0 z-50 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden"
              >
                {(
                  [
                    'hero',
                    'about',
                    'projects',
                    'gallery',
                    'contact',
                    'custom',
                  ] as const
                ).map(type => (
                  <button
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-b-0 flex items-center gap-2"
                  >
                    <span className="text-lg">{SECTION_TYPE_ICONS[type]}</span>
                    {SECTION_TYPE_LABELS[type]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        <Reorder.Group
          axis="y"
          values={portfolio.sections}
          onReorder={onReorderSections}
          className="space-y-2 p-3"
        >
          <AnimatePresence mode="popLayout">
            {portfolio.sections.map(section => (
              <Reorder.Item
                key={section.id}
                value={section}
                className="group"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onSelectSection(section.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    selectedSectionId === section.id
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'border border-transparent hover:bg-zinc-50'
                  }`}
                >
                  <GripVertical
                    size={16}
                    className="text-zinc-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                  />
                  <span className="text-lg flex-shrink-0">{SECTION_TYPE_ICONS[section.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {section.content.label || SECTION_TYPE_LABELS[section.type]}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {SECTION_TYPE_LABELS[section.type]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        onToggleVisibility(section.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-600 transition-colors"
                      title={section.isVisible ? 'Masquer' : 'Afficher'}
                    >
                      {section.isVisible ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        onDeleteSection(section.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {portfolio.sections.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <ChevronDown className="text-zinc-300 mb-2" size={32} />
            <p className="text-sm font-medium text-zinc-600 mb-1">Aucune section</p>
            <p className="text-xs text-zinc-500">Commencez par ajouter une section.</p>
          </div>
        )}
      </div>
    </div>
  );
}
