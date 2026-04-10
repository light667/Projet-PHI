import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';

export default function Builder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-zinc-400 hover:text-white transition rounded-md hover:bg-zinc-900">
             <ArrowLeft size={18} />
          </button>
          <div className="font-semibold text-white tracking-wide">Phi Architect</div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles size={14} /> AI Connection Active
        </div>
      </header>

      {/* Main Workspace (Split Screen Layout Placeholder) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Side */}
        <div className="w-full md:w-[400px] lg:w-[450px] border-r border-zinc-800 bg-zinc-950 flex flex-col relative z-20">
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
              <h3 className="text-lg font-bold text-white mb-2">Waking up the AI...</h3>
              <p className="text-sm">We are initializing the Generative Language Models to start building your portfolio.</p>
           </div>
        </div>
        
        {/* Right: Live Preview Side */}
        <div className="hidden md:flex flex-1 bg-zinc-900 relative items-center justify-center overflow-hidden">
           {/* Abstract grid background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             className="relative z-10 text-center"
           >
              <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700/50 shadow-2xl backdrop-blur-md">
                 <Sparkles size={40} className="text-blue-500 opacity-50" />
              </div>
              <p className="text-zinc-600 font-medium tracking-widest uppercase text-sm">Live Preview Standing By</p>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
