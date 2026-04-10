import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { LogOut, Sparkles, BarChart3, Eye, FileText, MoreHorizontal, Settings } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
     if (!name) return 'U';
     return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30 overflow-x-hidden border-t-[3px] border-blue-500">
      
      {/* Navbar Minimaliste */}
      <nav className="w-full bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-3">
                 <img src="/logo.svg" alt="Phi Logo" className="w-8 h-8 object-contain" />
                 <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">Phi Workspace</span>
              </Link>
           </div>

           <div className="flex items-center gap-4">
              <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">
                 <Settings size={20} />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800"></div>
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-md">
                    {getInitials(displayName)}
                 </div>
                 <button 
                   onClick={handleSignOut}
                   className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition"
                 >
                   <LogOut size={16} /> Sign out
                 </button>
              </div>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        
        {/* Welcome Section & CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                Good to see you, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">{displayName}</span>
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">Here's what is happening with your portfolios today.</p>
           </motion.div>

           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Link to="/builder">
                 <button className="bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform px-6 py-3.5 rounded-xl font-bold shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-3 group">
                   <Sparkles size={18} className="text-yellow-400 dark:text-yellow-500" />
                   Generate New Portfolio
                   <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </Link>
           </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
           {/* Stat 1 */}
           <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                 <Eye size={24} />
              </div>
              <div>
                 <div className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-1">Total Views</div>
                 <div className="text-3xl font-black text-slate-900 dark:text-white">1,204</div>
                 <div className="text-xs font-bold text-green-500 mt-1">+12% this week</div>
              </div>
           </div>

           {/* Stat 2 */}
           <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                 <BarChart3 size={24} />
              </div>
              <div>
                 <div className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-1">Avg. ATS Score</div>
                 <div className="text-3xl font-black text-slate-900 dark:text-white">92%</div>
                 <div className="text-xs font-bold text-green-500 mt-1">Excellent</div>
              </div>
           </div>

           {/* Stat 3 */}
           <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                 <FileText size={24} />
              </div>
              <div>
                 <div className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-1">Active Portfolios</div>
                 <div className="text-3xl font-black text-slate-900 dark:text-white">3</div>
                 <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1">Free Tier Limit</div>
              </div>
           </div>
        </motion.div>

        {/* Recent Portfolios Grids Using Generated Dummy Mockups */}
        <div className="mb-8 flex justify-between items-end">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Portfolios</h2>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
           {/* Card 1 */}
           <div className="group flex flex-col gap-4">
              <div className="w-full aspect-[4/3] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative shadow-sm dark:shadow-none bg-zinc-900 cursor-pointer">
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
                    <div className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm">Edit Portfolio</div>
                 </div>
                 <img src="/mock1.png" alt="Dev Portfolio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10" />
              </div>
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">Software Engineer Base</h3>
                    <div className="text-sm text-slate-500 dark:text-zinc-400">Created 2 days ago</div>
                 </div>
                 <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <MoreHorizontal size={20} />
                 </button>
              </div>
           </div>

           {/* Card 2 */}
           <div className="group flex flex-col gap-4">
              <div className="w-full aspect-[4/3] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative shadow-sm dark:shadow-none bg-zinc-900 cursor-pointer">
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
                    <div className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm">Edit Portfolio</div>
                 </div>
                 <img src="/mock2.png" alt="Agency Portfolio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10" />
              </div>
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">Creative Agency Lead</h3>
                    <div className="text-sm text-slate-500 dark:text-zinc-400">Created 1 week ago</div>
                 </div>
                 <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <MoreHorizontal size={20} />
                 </button>
              </div>
           </div>

           {/* Card 3 */}
           <div className="group flex flex-col gap-4">
              <div className="w-full aspect-[4/3] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative shadow-sm dark:shadow-none bg-zinc-900 cursor-pointer">
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
                    <div className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm">Edit Portfolio</div>
                 </div>
                 <img src="/mock3.png" alt="Design Portfolio" className="w-full h-full object-cover hue-rotate-180 brightness-90 contrast-125 transition-transform duration-700 group-hover:scale-105 z-10" />
              </div>
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">Personal AI Blog</h3>
                    <div className="text-sm text-slate-500 dark:text-zinc-400">Created 1 month ago</div>
                 </div>
                 <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <MoreHorizontal size={20} />
                 </button>
              </div>
           </div>

        </motion.div>
      </main>
    </div>
  );
}

// Emprunts de Lucide: ArrowRight missing above
function ArrowRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
