import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
    isActive
      ? 'bg-white/10 text-white'
      : 'text-white/75 hover:bg-white/5 hover:text-white',
  ].join(' ')

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 rounded-lg outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold text-white ring-1 ring-white/15"
            aria-hidden
          >
            Φ
          </span>
          <div className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-white">PHI</span>
            <span className="hidden text-xs text-white/55 sm:block">SaaS portfolio</span>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-1" aria-label="Navigation principale">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          </nav>
          <Link
            to="/login"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:bg-white/90 hover:shadow-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Commencer
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-white/90 ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="phi-mobile-menu"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="phi-mobile-menu"
        className={[
          'border-t border-white/10 bg-slate-950/90 backdrop-blur-xl md:hidden',
          mobileOpen ? 'block' : 'hidden',
        ].join(' ')}
        hidden={!mobileOpen}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Navigation mobile">
          <NavLink
            to="/"
            className={navLinkClass}
            end
            onClick={() => setMobileOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={navLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            Login
          </NavLink>
          <Link
            to="/login"
            className="mt-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-white/90"
            onClick={() => setMobileOpen(false)}
          >
            Commencer
          </Link>
        </nav>
      </div>
    </header>
  )
}
