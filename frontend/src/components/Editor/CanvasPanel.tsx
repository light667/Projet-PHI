import { motion } from 'framer-motion';
import {
  Monitor, Smartphone, Tablet,
} from 'lucide-react';
import type { PortfolioDraft } from '../../lib/portfolioDraft.js';
import type { PortfolioSection } from '../../types/portfolio.js';

interface CanvasPanelProps {
  portfolio: PortfolioDraft;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  onChangeDeviceView: (view: 'mobile' | 'tablet' | 'desktop') => void;
}

export default function CanvasPanel({
  portfolio,
  selectedSectionId,
  onSelectSection,
  deviceView,
  onChangeDeviceView,
}: CanvasPanelProps) {
  const getDeviceStyles = () => {
    if (deviceView === 'mobile') {
      return { width: '375px', minHeight: '812px', borderRadius: '40px', border: '8px solid #000' };
    }
    if (deviceView === 'tablet') {
      return { width: '768px', minHeight: '1024px', borderRadius: '12px', border: '1px solid #e4e4e7' };
    }
    return { width: '100%', minHeight: '600px', borderRadius: '8px', border: '1px solid #e4e4e7' };
  };

  const visibleSections = portfolio.sections.filter(s => s.isVisible);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
      {/* Device Selector Topbar */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-200/50 bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Aperçu</span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          {(
            [
              { id: 'mobile', icon: Smartphone, label: 'Mobile' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
            ] as const
          ).map(device => (
            <button
              key={device.id}
              onClick={() => onChangeDeviceView(device.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                deviceView === device.id
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title={device.label}
            >
              <device.icon size={14} />
              <span className="hidden sm:inline">{device.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex flex-col items-center justify-start pt-8 pb-8">
        <div style={{ width: deviceView === 'mobile' ? '375px' : deviceView === 'tablet' ? '768px' : '100%' }} className="transition-all">
          <motion.div
            layout
            style={getDeviceStyles()}
            className="overflow-hidden shadow-2xl bg-white"
          >
            <div className="w-full h-full flex flex-col">
              {/* Portfolio Header */}
              <div className="flex-shrink-0 px-6 py-5 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white">
                <h1 className="text-xl font-bold text-zinc-900">{portfolio.metadata.title}</h1>
                <p className="text-sm text-zinc-600 mt-1">{portfolio.metadata.author}</p>
              </div>

              {/* Sections Preview */}
              <div className="flex-1 overflow-y-auto">
                {visibleSections.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center px-6">
                    <div>
                      <div className="text-4xl mb-3">📋</div>
                      <p className="text-sm font-semibold text-zinc-600 mb-1">Aucune section visible</p>
                      <p className="text-xs text-zinc-500">Ajoutez ou affichez une section pour voir l'aperçu.</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {visibleSections.map((section, index) => (
                      <SectionPreview
                        key={section.id}
                        section={section}
                        isSelected={selectedSectionId === section.id}
                        onClick={() => onSelectSection(section.id)}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SectionPreview({
  section,
  isSelected,
  onClick,
  index,
}: {
  section: PortfolioSection;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const bgColors = [
    'bg-blue-50',
    'bg-indigo-50',
    'bg-purple-50',
    'bg-pink-50',
    'bg-orange-50',
    'bg-emerald-50',
  ];

  const bgColor = bgColors[index % bgColors.length];
  const iconMap: Record<PortfolioSection['type'], string> = {
    hero: '🎯',
    about: '👤',
    gallery: '🖼️',
    contact: '💬',
    projects: '📁',
    custom: '⚙️',
  };

  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer px-6 py-8 transition-all border-l-4 ${
        isSelected
          ? 'border-l-indigo-600 bg-indigo-50'
          : 'border-l-transparent hover:bg-zinc-50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl ${bgColor}`}>
          {iconMap[section.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-zinc-900">
            {section.content.label || `Section ${section.type}`}
          </h3>
          <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
            {section.content.headline || section.content.summary || 'Cliquez pour éditer le contenu.'}
          </p>
          {section.content.tags && Array.isArray(section.content.tags) && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {section.content.tags.slice(0, 3).map((tag: unknown, idx: number) => (
                <span
                  key={idx}
                  className="inline-block px-2.5 py-1 bg-white border border-zinc-200 rounded-full text-xs font-semibold text-zinc-600"
                >
                  {String(tag)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
