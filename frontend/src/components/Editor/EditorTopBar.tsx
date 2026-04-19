import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Save, Send, Eye, RotateCcw, RotateCw, PanelLeftOpen, PanelLeftClose,
} from 'lucide-react';
import type { PortfolioDraft } from '../../lib/portfolioDraft.js';

interface EditorTopBarProps {
  portfolio: PortfolioDraft;
  isDirty: boolean;
  isSaving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSidebarOpen: boolean;
  onBack: () => void;
  onSave: () => void;
  onPublish: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onTitleChange: (newTitle: string) => void;
  onPreview: () => void;
  onToggleSidebar: () => void;
}

export default function EditorTopBar({
  portfolio,
  isDirty,
  isSaving,
  canUndo,
  canRedo,
  isSidebarOpen,
  onBack,
  onSave,
  onPublish,
  onUndo,
  onRedo,
  onTitleChange,
  onPreview,
  onToggleSidebar,
}: EditorTopBarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(portfolio.metadata.title);

  const handleTitleChange = () => {
    if (titleInput.trim() && titleInput !== portfolio.metadata.title) {
      onTitleChange(titleInput.trim());
    } else {
      setTitleInput(portfolio.metadata.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200/80 flex items-center justify-between px-6 z-20 shrink-0 gap-4">
      {/* Left: Navigation */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onBack}
          className="flex-shrink-0 p-2 text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100"
          title="Retour au dashboard"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="h-6 w-px bg-zinc-200 flex-shrink-0" />

        <button
          onClick={onToggleSidebar}
          className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-sm"
          title={isSidebarOpen ? 'Fermer la sidebar' : 'Ouvrir la sidebar'}
        >
          {isSidebarOpen ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          <span className="hidden sm:inline text-xs font-semibold">Sidebar</span>
        </button>

        {/* Title */}
        {isEditingTitle ? (
          <motion.input
            autoFocus
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={e => {
              if (e.key === 'Enter') handleTitleChange();
              if (e.key === 'Escape') {
                setTitleInput(portfolio.metadata.title);
                setIsEditingTitle(false);
              }
            }}
            className="flex-1 min-w-0 px-3 py-2 bg-indigo-50 border border-indigo-300 rounded-lg text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="flex-1 min-w-0 text-left px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors group"
            title="Cliquez pour éditer le titre"
          >
            <h1 className="text-sm font-semibold text-zinc-900 truncate">{portfolio.metadata.title}</h1>
            <p className="text-xs text-zinc-500">Cliquez pour renommer</p>
          </button>
        )}

        {/* Status Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-amber-700">Brouillon</span>
        </div>

        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-lg"
          >
            Modifications non enregistrées
          </motion.div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-white"
            title="Annuler (Ctrl+Z)"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-white"
            title="Rétablir (Ctrl+Y)"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Preview */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
          title="Aperçu en nouvelle fenêtre"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Aperçu</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 hover:border-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Save size={16} />
              </motion.div>
              <span className="hidden sm:inline">Enregistrement…</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span className="hidden sm:inline">Enregistrer</span>
            </>
          )}
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          className="flex items-center gap-2 px-5 py-2 text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Publier</span>
        </button>
      </div>
    </header>
  );
}
