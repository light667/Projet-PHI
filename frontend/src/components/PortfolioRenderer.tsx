import type { PortfolioData, PortfolioSection } from '../types/portfolio.js';

function SectionBlock({ section, authorName }: { section: PortfolioSection; authorName: string }) {
  const c = section.content || {};
  const label = String(c.label || section.type);

  if (section.type === 'hero') {
    return (
      <section className="border-b border-zinc-100 px-6 py-16 md:px-12 text-center bg-gradient-to-b from-zinc-50 to-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">{authorName}</p>
        <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 max-w-4xl mx-auto leading-tight">
          {String(c.headline || c.title || label)}
        </h1>
        {c.subheadline ? (
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">{String(c.subheadline)}</p>
        ) : null}
        {Array.isArray(c.tags) && c.tags.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {(c.tags as string[]).slice(0, 8).map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {c.ctaPrimary ? (
            <span className="inline-flex items-center rounded-full bg-zinc-900 text-white px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-zinc-800 transition-colors">
              {String(c.ctaPrimary)}
            </span>
          ) : null}
          {c.ctaSecondary ? (
            <span className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
              {String(c.ctaSecondary)}
            </span>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.type === 'about') {
    return (
      <section className="border-b border-zinc-100 px-6 py-14 md:px-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">{String(c.title || label)}</h2>
        {c.body ? (
          <div className="text-zinc-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base">{String(c.body)}</div>
        ) : null}
        {Array.isArray(c.highlights) ? (
          <ul className="mt-8 space-y-2">
            {(c.highlights as string[]).map((h: string, i: number) => (
              <li key={i} className="flex gap-2 text-zinc-700 text-sm">
                <span className="text-emerald-500 font-bold">•</span>
                {h}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  if (section.type === 'projects') {
    const items = Array.isArray(c.items) ? (c.items as Record<string, unknown>[]) : [];
    return (
      <section className="border-b border-zinc-100 px-6 py-14 md:px-12 bg-zinc-50/80">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">{String(c.title || label)}</h2>
        {c.intro ? <p className="text-zinc-600 mb-8 max-w-2xl">{String(c.intro)}</p> : null}
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-zinc-900">{String(it.name || `Projet ${i + 1}`)}</h3>
              {it.description ? <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{String(it.description)}</p> : null}
              {Array.isArray(it.tags) && (it.tags as string[]).length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(it.tags as string[]).map((tg: string) => (
                    <span key={tg} className="text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                      {tg}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === 'contact') {
    return (
      <section className="border-b border-zinc-100 px-6 py-14 md:px-12 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">{String(c.title || label)}</h2>
        <div className="text-sm text-zinc-600 space-y-2">
          {c.email ? <p className="font-medium">{String(c.email)}</p> : null}
          {c.phone ? <p>{String(c.phone)}</p> : null}
          {c.whatsapp ? <p>WhatsApp: {String(c.whatsapp)}</p> : null}
          {c.location ? <p className="text-zinc-400">{String(c.location)}</p> : null}
        </div>
      </section>
    );
  }

  // Handle custom sections like Skills or Services
  if (section.type === 'custom') {
    const items = Array.isArray(c.items) ? (c.items as Record<string, unknown>[]) : [];
    const skills = Array.isArray(c.skills) ? (c.skills as string[]) : [];

    return (
      <section className="border-b border-zinc-100 px-6 py-14 md:px-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">{String(c.title || label)}</h2>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-4 py-2 bg-zinc-100 rounded-lg text-sm font-medium text-zinc-800">
                {s}
              </span>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((it, i) => (
              <div key={i} className="p-6 border border-zinc-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-2">{String(it.title || it.name)}</h3>
                <p className="text-sm text-zinc-500">{String(it.description || it.body || '')}</p>
              </div>
            ))}
          </div>
        )}

        {c.body && !items.length && !skills.length && (
          <p className="text-zinc-600 leading-relaxed">{String(c.body)}</p>
        )}
      </section>
    );
  }

  return (
    <section className="border-b border-zinc-100 px-6 py-10 md:px-12">
      <h2 className="text-lg font-bold text-zinc-800 mb-2 capitalize">{label}</h2>
      {c.body ? <p className="text-sm text-zinc-600 whitespace-pre-wrap">{String(c.body)}</p> : null}
    </section>
  );
}

export default function PortfolioRenderer({ portfolio }: { portfolio: PortfolioData }) {
  const sections = portfolio.sections || [];
  const visibleSections = sections.filter((s: PortfolioSection) => s.isVisible);

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <nav className="h-16 border-b border-zinc-100 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <span className="font-bold text-xl tracking-tight">{portfolio.metadata.author}</span>
        <ul className="hidden md:flex gap-8 text-sm font-bold text-zinc-400">
          {visibleSections.slice(0, 5).map((sec: PortfolioSection) => (
            <li key={sec.id} className="hover:text-zinc-900 cursor-pointer transition-colors">
              {String(sec.content?.label || sec.type).toUpperCase()}
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1">
        {visibleSections.length > 0 ? (
          visibleSections.map((sec: PortfolioSection) => (
            <SectionBlock key={sec.id} section={sec} authorName={portfolio.metadata.author} />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-zinc-900 mb-6 max-w-3xl leading-tight">
              {portfolio.metadata.title}
            </h1>
            <p className="text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed">{portfolio.metadata.description}</p>
          </div>
        )}
      </main>

      <footer className="py-12 px-6 border-t border-zinc-100 text-center text-zinc-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {portfolio.metadata.author}. Propulsé par Phi.</p>
      </footer>
    </div>
  );
}
