import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Type, Palette, Plus,
} from 'lucide-react';
import type { PortfolioSection } from '../../types/portfolio.js';
import { SECTION_TYPE_LABELS } from '../../lib/editorState.js';

interface PropertiesPanelProps {
  section: PortfolioSection | null;
  onUpdateContent: (content: Partial<PortfolioSection['content']>) => void;
}

export default function PropertiesPanel({
  section,
  onUpdateContent,
}: PropertiesPanelProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null);

  if (!section) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-zinc-200 overflow-hidden items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">✨</div>
        <p className="text-sm font-semibold text-zinc-700 mb-2">Aucune section sélectionnée</p>
        <p className="text-xs text-zinc-500">Cliquez sur une section dans la liste de gauche pour la modifier.</p>
      </div>
    );
  }

  const fields = Object.entries(section.content);

  return (
    <div className="flex flex-col h-full bg-white border-l border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-zinc-100">
        <div className="text-xs font-bold text-zinc-600 uppercase tracking-wide mb-2">Propriétés</div>
        <div className="flex items-center gap-2">
          <div className="text-2xl">{section.type === 'hero' ? '🎯' : section.type === 'about' ? '👤' : section.type === 'projects' ? '📁' : section.type === 'gallery' ? '🖼️' : section.type === 'contact' ? '💬' : '⚙️'}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-900">{section.content.label || SECTION_TYPE_LABELS[section.type]}</p>
            <p className="text-xs text-zinc-500">{section.id.slice(0, 12)}…</p>
          </div>
        </div>
      </div>

      {/* Content Fields */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-4">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <p className="text-sm">Aucun champ à éditer</p>
            </div>
          ) : (
            fields.map(([key, value]) => (
              <PropertyField
                key={key}
                fieldName={key}
                value={value}
                isExpanded={expandedField === key}
                onToggle={() => setExpandedField(expandedField === key ? null : key)}
                onUpdate={newValue => onUpdateContent({ [key]: newValue })}
              />
            ))
          )}
        </div>
      </div>

      {/* AI Enhancement */}
      <div className="flex-shrink-0 border-t border-zinc-100 p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-sm">
          <Zap size={16} />
          Améliorer avec l'IA
        </button>
      </div>
    </div>
  );
}

function PropertyField({
  fieldName,
  value,
  isExpanded,
  onToggle,
  onUpdate,
}: {
  fieldName: string;
  value: unknown;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (value: unknown) => void;
}) {
  const isText = typeof value === 'string';
  const isArray = Array.isArray(value);
  const isObject = typeof value === 'object' && value !== null && !isArray;

  return (
    <motion.div
      layout
      className="rounded-lg border border-zinc-200 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {isText && <Type size={14} className="text-blue-600" />}
          {isArray && <Plus size={14} className="text-green-600" />}
          {isObject && <Palette size={14} className="text-purple-600" />}
          <span className="text-xs font-semibold text-zinc-700 capitalize">
            {fieldName.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="border-t border-zinc-200"
          >
            <div className="p-3">
              {isText && (
                <textarea
                  value={value}
                  onChange={e => onUpdate(e.target.value)}
                  rows={3}
                  placeholder="Entrez le contenu…"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              )}
              {isArray && (
                <div className="space-y-2">
                  {(value as unknown[]).map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={String(item || '')}
                      onChange={e => {
                        const newArray = [...(value as unknown[])];
                        newArray[index] = e.target.value;
                        onUpdate(newArray);
                      }}
                      placeholder={`Élément ${index + 1}`}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ))}
                  <button
                    onClick={() => onUpdate([...(value as unknown[]), ''])}
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-zinc-300 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    <Plus size={12} />
                    Ajouter
                  </button>
                </div>
              )}
              {isObject && (
                <div className="text-xs text-zinc-600 bg-zinc-100 rounded p-2 font-mono">
                  {JSON.stringify(value, null, 2)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
