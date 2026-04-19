import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext.js';
import { Settings as SettingsIcon, User, Globe, LogOut, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-10">
      <h1 className="text-3xl font-black text-[var(--text)] mb-8 flex items-center gap-3">
        <SettingsIcon className="text-slate-500" />
        {t('settings.title')}
      </h1>

      <div className="space-y-6">
        {/* Profil */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-slate-50 dark:bg-zinc-800/50 flex items-center gap-3">
            <User size={18} className="text-blue-500" />
            <h2 className="font-bold text-[var(--text)]">{t('settings.profile')}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text2)] mb-1.5">{t('settings.name')}</label>
              <input type="text" disabled value={user?.displayName || 'Utilisateur'} className="w-full bg-slate-100 dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text)] focus:outline-none opacity-70 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text2)] mb-1.5">{t('settings.email')}</label>
              <input type="email" disabled value={user?.email || ''} className="w-full bg-slate-100 dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text)] focus:outline-none opacity-70 cursor-not-allowed" />
            </div>
          </div>
        </motion.div>

        {/* Préférences */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-slate-50 dark:bg-zinc-800/50 flex items-center gap-3">
            <Globe size={18} className="text-purple-500" />
            <h2 className="font-bold text-[var(--text)]">Préférences</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-[var(--text2)] mb-1.5">{t('settings.language')}</label>
            <select 
              value={i18n.language.substring(0, 2)} 
              onChange={handleLanguageChange}
              className="w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text)] focus:outline-none focus:border-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </motion.div>

        {/* Sécurité */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-slate-50 dark:bg-zinc-800/50 flex items-center gap-3">
            <Shield size={18} className="text-amber-500" />
            <h2 className="font-bold text-[var(--text)]">Compte & Sécurité</h2>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={signOut}
              className="w-full py-3 bg-[var(--surface)] border border-[var(--border-color)] hover:bg-slate-50 dark:hover:bg-zinc-800 text-[var(--text)] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> {t('settings.logout')}
            </button>

            <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
              <button className="w-full py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <AlertTriangle size={18} /> {t('settings.delete_account')}
              </button>
              <p className="text-xs text-center text-[var(--text3)] mt-2">
                {t('settings.delete_warning')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
