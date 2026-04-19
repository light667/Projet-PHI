import { useState } from 'react';
import { NavLink, useLocation, Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings, 
  Menu, 
  Plus,
  Sun,
  Moon,
  Bot,
  CreditCard,
  LogOut,
  Grid
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../ThemeProvider.js';


export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  
  const getInitials = (name: string | null | undefined) => {
     if (!name) return 'U';
     return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const navLinks = [
    { section: 'Principal', items: [
      { name: 'Vue d\'ensemble', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Coach IA', path: '/dashboard/coach', icon: Bot },
      { name: 'Mes Portfolios', path: '/dashboard/portfolios', icon: Grid },
    ]},
    { section: 'Compte', items: [
      { name: 'Mes Crédits', path: '/dashboard/credits', icon: CreditCard },
      { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
    ]}
  ];

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Vue d\'ensemble';
      case '/dashboard/coach': return 'Coach IA';
      case '/dashboard/portfolios': return 'Portfolios';
      case '/dashboard/credits': return 'Crédits';
      case '/dashboard/settings': return 'Paramètres';
      case '/dashboard/create/template': return 'Nouveau Portfolio';
      default: return 'Dashboard';
    }
  };

  const TopNavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 h-16">
        <img src="/logo.svg" alt="Phi Logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-xl tracking-tight text-[var(--text)]">Phi Workspace</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
        {navLinks.map((group, idx) => (
          <div key={idx}>
            <div className="text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-2 px-2">
              {group.section}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                        : 'text-[var(--text2)] hover:bg-[var(--border-color)]'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={18} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border-color)]">
        <Link to="/dashboard/settings">
          <div className="flex items-center gap-3 p-2 hover:bg-[var(--accent-light)] rounded-xl cursor-pointer transition-colors group">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              {getInitials(displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text)] truncate">{displayName}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                50 Crédits
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[240px] shrink-0 border-r border-solid border-[var(--border-color)] bg-[var(--surface)] h-screen sticky top-0 overflow-hidden">
        <TopNavContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-[var(--surface)] z-50 shadow-xl md:hidden flex flex-col"
            >
               <TopNavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-[var(--surface)]/80 backdrop-blur-md border-b justify-center flex flex-col border-[var(--border-color)] sticky top-0 z-30 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden p-1 -ml-1 text-[var(--text2)]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div className="text-sm font-semibold text-[var(--text2)] flex items-center gap-2">
                <span className="hidden sm:inline">Phi</span>
                <span className="hidden sm:inline text-slate-300 dark:text-zinc-600">/</span>
                <span className="text-[var(--text)]">{getBreadcrumb()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <Link to="/dashboard/credits" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                <CreditCard size={14} /> 50 CR
              </Link>

              <button 
                onClick={toggleTheme} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <div className="w-px h-5 bg-[var(--border-color)] hidden sm:block mx-1"></div>

              <button 
                onClick={signOut}
                className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                title="Déconnexion"
              >
                <LogOut size={18} />
              </button>
              
              <Link to="/dashboard/create/template">
                <button className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm ml-2">
                  <Plus size={16} />
                  Nouveau
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Content */}
        <main className="p-4 sm:p-6 md:p-8 overflow-auto flex-1 flex flex-col relative w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
