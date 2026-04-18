import React, { useState } from 'react';
import { NavLink, useLocation, Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  Menu, 
  Plus,
  Sun,
  Moon,
  LayoutTemplate
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../ThemeProvider.js';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
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
      { name: 'Portfolios', path: '/dashboard/portfolios', icon: Briefcase },
      { name: 'Analytiques', path: '/dashboard/analytics', icon: BarChart3 },
    ]},
    { section: 'Outils', items: [
      { name: 'Créer depuis un template', path: '/dashboard/create/template', icon: LayoutTemplate },
      { name: 'Éditeur IA', path: '/builder', icon: Plus },
    ]},
    { section: 'Compte', items: [
      { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
      { name: 'Aide & Support', path: '/dashboard/help', icon: HelpCircle },
    ]}
  ];

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Vue d\'ensemble';
      case '/dashboard/portfolios': return 'Portfolios';
      case '/dashboard/analytics': return 'Analytiques';
      case '/dashboard/settings': return 'Paramètres';
      case '/dashboard/help': return 'Aide & Support';
      case '/dashboard/create/template': return 'Créer depuis un template';
      case '/builder': return 'Éditeur';
      default: return 'Dashboard';
    }
  };

  const NavContent = () => (
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
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]' 
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
        <div className="flex items-center gap-3 p-2 hover:bg-[var(--accent-light)] rounded-xl cursor-pointer transition-colors group">
          <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--text)] truncate">{displayName}</div>
            <div className="text-xs text-[var(--green)] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full inline-block"></span> Pro Plan
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[220px] shrink-0 border-r border-solid border-[var(--border-color)] bg-[var(--surface)] h-screen sticky top-0 overflow-hidden">
        <NavContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[240px] bg-[var(--surface)] z-50 shadow-xl md:hidden flex flex-col"
            >
               <NavContent />
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
              <div className="text-sm font-semibold text-[var(--text2)]">
                <span className="hidden sm:inline">Phi / </span>
                <span className="text-[var(--text)]">{getBreadcrumb()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 sm:gap-5">
              <button 
                onClick={toggleTheme} 
                className="text-[var(--text2)] hover:text-[var(--text)] transition-colors p-1 hidden sm:block"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="text-[var(--text2)] hover:text-[var(--text)] transition-colors p-1 relative">
                <Search size={20} />
              </button>
              <button className="text-[var(--text2)] hover:text-[var(--text)] transition-colors p-1 relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--red)] rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="w-px h-6 bg-[var(--border-color)] hidden sm:block"></div>
              
              <Link to="/dashboard/create/template">
                <button className="hidden sm:flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--accent2)] transition-colors shadow-sm">
                  <Plus size={16} />
                  Nouveau
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Content */}
        <main className="p-[28px] overflow-auto flex-1 flex flex-col gap-[22px]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
