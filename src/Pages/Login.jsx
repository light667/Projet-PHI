import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const supabaseConfigured = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    return Boolean(url && anonKey)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    setErrorMsg('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 sm:py-12">
      <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-white/50">Connexion</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Connectez-vous à votre espace.
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-white/70">
            Accédez à votre portfolio, gérez vos sections et discutez avec votre assistant
            d&apos;orientation pour avancer vers votre prochaine opportunité.
          </p>

          <div className="mt-8 grid max-w-xl gap-3">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-sm text-white/60">Ce que vous obtenez</p>
              <ul className="mt-2 space-y-1 text-sm text-white/75">
                <li>• Génération de contenu + structure automatique</li>
                <li>• Personnalisation visuelle simple</li>
                <li>• Coach IA : CV, lettres, entretiens, plan compétences</li>
              </ul>
            </div>

            {!supabaseConfigured && (
              <div className="rounded-2xl bg-amber-400/10 p-4 text-amber-50 ring-1 ring-amber-200/20">
                <p className="text-sm font-semibold">Supabase n&apos;est pas configuré.</p>
                <p className="mt-1 text-sm text-amber-100/80">
                  Ajoutez <code className="font-mono">VITE_SUPABASE_URL</code> et{' '}
                  <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> dans votre fichier{' '}
                  <code className="font-mono">.env</code>.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-md lg:justify-self-end">
            <div className="rounded-3xl bg-white/5 p-6 sm:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">Connexion</p>
                  <h2 className="mt-1 text-xl font-semibold">Bienvenue</h2>
                </div>
                <span className="rounded-2xl bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                  Sécurisé
                </span>
              </div>

              {errorMsg ? (
                <div className="mt-5 rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-50 ring-1 ring-rose-200/20">
                  {errorMsg}
                </div>
              ) : null}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loading || !supabaseConfigured}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10 transition disabled:opacity-50"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading || !supabaseConfigured}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10 transition disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
              </div>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-slate-950/0 text-white/60">ou avec email</span>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="nom@exemple.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-white/70 hover:text-white transition"
                    onClick={() => setErrorMsg('Mot de passe oublié : à implémenter.')}
                  >
                    Mot de passe oublié ?
                  </button>
                  <Link to="/" className="text-white/70 hover:text-white transition">
                    Retour
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || !supabaseConfigured}
                  className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90 transition disabled:opacity-50"
                >
                  {loading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-white/60">
                Pas encore de compte ?{' '}
                <Link to="/login" className="font-semibold text-white hover:underline">
                  Commencer gratuitement
                </Link>
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
