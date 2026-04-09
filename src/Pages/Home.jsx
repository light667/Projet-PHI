import { Link } from 'react-router-dom'
import { Hero } from '../components/sections/Hero'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <Hero />
      </main>

      <footer className="mt-auto border-t border-white/10 bg-slate-950/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-white/60 sm:px-6">
          <p>© 2026 PHI Platform. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
