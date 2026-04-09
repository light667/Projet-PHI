export function DynamicBackground() {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950" />
  
        {/* Glow grid */}
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:72px_72px]" />
  
        {/* Animated blobs */}
        <div className="absolute -top-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/25 blur-3xl phi-blob-1" />
        <div className="absolute top-[-120px] right-[-10%] h-[520px] w-[520px] rounded-full bg-indigo-500/25 blur-3xl phi-blob-2" />
        <div className="absolute bottom-[-220px] left-[20%] h-[560px] w-[560px] rounded-full bg-cyan-400/20 blur-3xl phi-blob-3" />
  
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_20%,rgba(255,255,255,0.10),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(0,0,0,0),rgba(0,0,0,0.55)_70%)]" />
      </div>
    )
  }
  
  