import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, LayoutTemplate, ChevronRight, ChevronLeft } from 'lucide-react';
import { loadPortfolioDraft, savePortfolioDraft } from '../lib/portfolioDraft.js';
import {
  deleteSectionById,
  getSectionById,
  toggleSectionVisibility,
  updateSectionContent,
  EditorHistoryEntry,
} from '../lib/editorState.js';
import EditorTopBar from '../components/Editor/EditorTopBar.js';
import SectionsPanel from '../components/Editor/SectionsPanel.js';
import CanvasPanel from '../components/Editor/CanvasPanel.js';
import PropertiesPanel from '../components/Editor/PropertiesPanel.js';
import type { PortfolioSection } from '../types/portfolio.js';

export default function EditorLayout() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Load initial portfolio
  const [portfolio, setPortfolio] = useState(() => loadPortfolioDraft(id));
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<EditorHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (id) {
      const loaded = loadPortfolioDraft(id);
      setPortfolio(loaded);
      setSelectedSectionId(null);
      setHistory([]);
      setHistoryIndex(-1);
      setIsDirty(false);
    }
  }, [id]);

  const selectedSection = useMemo(
    () => (portfolio && selectedSectionId ? getSectionById(portfolio.sections, selectedSectionId) : null),
    [portfolio, selectedSectionId],
  );

  const saveToHistory = useCallback(() => {
    if (!portfolio) return;
    const newEntry: EditorHistoryEntry = {
      timestamp: Date.now(),
      portfolio,
      description: 'Changement',
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntry);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [portfolio, history, historyIndex]);

  const handleSave = useCallback(async () => {
    if (!portfolio) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    savePortfolioDraft(portfolio);
    setIsDirty(false);
    setIsSaving(false);
  }, [portfolio]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setPortfolio(previousState.portfolio);
      setHistoryIndex(historyIndex - 1);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setPortfolio(nextState.portfolio);
      setHistoryIndex(historyIndex + 1);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const handleTitleChange = useCallback((newTitle: string) => {
    if (!portfolio) return;
    saveToHistory();
    const updated = {
      ...portfolio,
      metadata: { ...portfolio.metadata, title: newTitle },
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(updated);
    setIsDirty(true);
  }, [portfolio, saveToHistory]);

  const handleReorderSections = useCallback((newSections: PortfolioSection[]) => {
    if (!portfolio) return;
    saveToHistory();
    const updated = { ...portfolio, sections: newSections, updatedAt: new Date().toISOString() };
    setPortfolio(updated);
    setIsDirty(true);
  }, [portfolio, saveToHistory]);

  const handleAddSection = useCallback((section: PortfolioSection) => {
    if (!portfolio) return;
    saveToHistory();
    const updated = {
      ...portfolio,
      sections: [...portfolio.sections, section],
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(updated);
    setIsDirty(true);
  }, [portfolio, saveToHistory]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    if (!portfolio) return;
    saveToHistory();
    const updated = {
      ...portfolio,
      sections: deleteSectionById(portfolio.sections, sectionId),
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(updated);
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
    setIsDirty(true);
  }, [portfolio, selectedSectionId, saveToHistory]);

  const handleToggleVisibility = useCallback((sectionId: string) => {
    if (!portfolio) return;
    saveToHistory();
    const updated = {
      ...portfolio,
      sections: toggleSectionVisibility(portfolio.sections, sectionId),
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(updated);
    setIsDirty(true);
  }, [portfolio, saveToHistory]);

  const handleUpdateSectionContent = useCallback((updates: Partial<PortfolioSection['content']>) => {
    if (!portfolio || !selectedSectionId) return;
    const updated = {
      ...portfolio,
      sections: updateSectionContent(portfolio.sections, selectedSectionId, updates),
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(updated);
    setIsDirty(true);
  }, [portfolio, selectedSectionId]);

  const handlePublish = useCallback(() => {
    if (!portfolio) return;
    const published = {
      ...portfolio,
      visibility: 'public' as const,
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(published);
    savePortfolioDraft(published);
    setIsDirty(false);
    alert(`✨ Portfolio "${published.metadata.title}" publié avec succès!`);
  }, [portfolio]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSave]);

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
          <button
            onClick={() => navigate('/dashboard/create/template')}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-colors"
          >
            <LayoutTemplate size={16} />
            Choisir un template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 text-zinc-900 flex flex-col font-sans overflow-hidden">
      {/* TOPBAR */}
      <EditorTopBar
        portfolio={portfolio}
        isDirty={isDirty}
        isSaving={isSaving}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
          isSidebarOpen={isSidebarOpen}
        onBack={() => navigate(portfolio.source === 'ai' ? '/dashboard/create/ai' : '/dashboard/create/template')}
        onSave={handleSave}
        onPublish={handlePublish}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onTitleChange={handleTitleChange}
        onPreview={() => window.open(`/portfolio/${portfolio.slug}`, '_blank')}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 3-COLUMN LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL: Sections Tree (Collapsible) */}
        <motion.div
          animate={{ width: isSidebarOpen ? 200 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="shrink-0 overflow-hidden border-r border-zinc-200/50"
        >
          <SectionsPanel
            portfolio={portfolio}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onReorderSections={handleReorderSections}
            onAddSection={handleAddSection}
            onDeleteSection={handleDeleteSection}
            onToggleVisibility={handleToggleVisibility}
          />
        </motion.div>

        {/* Sidebar Toggle Button */}
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-zinc-200 rounded-r-lg hover:bg-zinc-50 transition-colors shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isSidebarOpen ? 'Fermer la sidebar' : 'Ouvrir la sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={16} className="text-zinc-600" />
          ) : (
            <ChevronRight size={16} className="text-zinc-600" />
          )}
        </motion.button>

        {/* CENTER PANEL: Canvas (flex-1) */}
        <div className="flex-1 overflow-hidden">
          <CanvasPanel
            portfolio={portfolio}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            deviceView={deviceView}
            onChangeDeviceView={setDeviceView}
          />
        </div>

        {/* RIGHT PANEL: Properties (280px) */}
        <div className="w-[280px] shrink-0 overflow-hidden">
          <PropertiesPanel
            section={selectedSection}
            onUpdateContent={handleUpdateSectionContent}
          />
        </div>
      </div>
    </div>
  );
}
