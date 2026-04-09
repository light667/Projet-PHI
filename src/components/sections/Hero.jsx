import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section
      className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-xl lg:max-w-none">
        <p
          className="inline-flex animate-phi-fade-up items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 opacity-0 ring-1 ring-white/10 [animation-delay:80ms] motion-reduce:animate-none motion-reduce:opacity-100"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden />
          Nouvelle expérience portfolio + IA
        </p>

        <h1
          id="hero-heading"
          className="mt-6 animate-phi-fade-up text-4xl font-extrabold tracking-tight text-white opacity-0 [animation-delay:140ms] motion-reduce:animate-none motion-reduce:opacity-100 sm:text-5xl lg:text-6xl lg:leading-[1.05]"
        >
          Créez votre portfolio professionnel avec l&apos;IA,{' '}
          <span className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
            sans coder.
          </span>
        </h1>

        <p className="mt-5 animate-phi-fade-up text-lg leading-relaxed text-white/70 opacity-0 [animation-delay:220ms] motion-reduce:animate-none motion-reduce:opacity-100 sm:text-xl">
          PHI vous aide à publier un portfolio moderne en quelques minutes, puis vous accompagne avec un
          assistant d&apos;orientation pour gagner en clarté sur le marché du travail.
        </p>

        <div className="mt-9 flex animate-phi-fade-up flex-col gap-3 opacity-0 [animation-delay:300ms] motion-reduce:animate-none motion-reduce:opacity-100 sm:flex-row sm:items-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-center text-base font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Commencer maintenant
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-6 py-3 text-center text-base font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Se connecter
          </Link>
        </div>
      </div>

      <div
        className="relative mx-auto w-full max-w-md animate-phi-fade-up opacity-0 [animation-delay:200ms] motion-reduce:animate-none motion-reduce:opacity-100 lg:mx-0 lg:max-w-none"
        aria-hidden
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-white/12 to-white/[0.02] p-1 ring-1 ring-white/15">
          <div className="absolute inset-0 rounded-[1.4rem] bg-gradient-to-tr from-indigo-500/20 via-transparent to-fuchsia-500/15" />
          <div className="relative flex h-full flex-col justify-between rounded-[1.35rem] bg-slate-950/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs font-medium text-white/45">preview</span>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-3 w-3/5 max-w-[12rem] rounded-full bg-white/20" />
              <div className="h-3 w-4/5 max-w-[16rem] rounded-full bg-white/12" />
              <div className="h-3 w-2/5 max-w-[8rem] rounded-full bg-white/10" />
            </div>
            <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
              <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/40 to-indigo-500/40" />
                <div className="mt-3 h-2 w-16 rounded bg-white/25" />
                <div className="mt-2 h-2 w-24 rounded bg-white/15" />
              </div>
              <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-400/40 to-rose-500/40" />
                <div className="mt-3 h-2 w-20 rounded bg-white/25" />
                <div className="mt-2 h-2 w-14 rounded bg-white/15" />
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-cyan-400/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-2xl" />
      </div>
    </section>
  )
}
