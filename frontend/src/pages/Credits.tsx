import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Sparkles, History, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

export default function Credits() {
  const { t } = useTranslation();
  const [balance] = useState(50); // Simulé

  // Mock transactions
  const transactions = [
    { id: 1, type: 'recharge', amount: 50, desc: 'Inscription (Offert)', date: 'Aujourd\'hui' },
    { id: 2, type: 'usage', amount: -5, desc: 'Génération Portfolio Template', date: 'Hier' },
    { id: 3, type: 'usage', amount: -1, desc: 'Message Coach IA', date: 'Hier' },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">
      <h1 className="text-3xl font-black text-[var(--text)] mb-8 flex items-center gap-3">
        <CreditCard className="text-blue-500" />
        {t('credits.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[24px] p-8 text-white relative overflow-hidden md:col-span-1 shadow-xl">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-white/70 font-semibold uppercase tracking-wider text-xs mb-2">{t('credits.balance')}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black">{balance}</span>
              <span className="text-lg font-bold text-white/50">CR</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-lg text-sm font-semibold">
               <Sparkles size={14} /> Plan Gratuit Actif
            </div>
          </div>
        </div>

        {/* Packs de recharge (Pack 100 et Pack 250) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] p-6 hover:shadow-lg hover:border-blue-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Package size={24} />
                </div>
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded">Populaire</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-1">Pack Essentiel</h3>
              <p className="text-sm text-[var(--text2)] mb-4">100 crédits valables à vie</p>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-2xl font-black text-[var(--text)]">1 000</span> <span className="text-[var(--text3)] font-semibold">FCFA</span>
              </div>
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                Acheter
              </button>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-purple-500/30 rounded-[24px] p-6 hover:shadow-lg hover:border-purple-500/60 transition-all flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-1">Pack Pro</h3>
              <p className="text-sm text-[var(--text2)] mb-4">250 crédits pour un max de liberté</p>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-2xl font-black text-[var(--text)]">2 000</span> <span className="text-[var(--text3)] font-semibold">FCFA</span>
              </div>
              <button className="w-full py-2.5 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-bold rounded-xl transition-colors">
                Acheter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center gap-3">
          <History size={20} className="text-[var(--text2)]" />
          <h2 className="text-lg font-bold text-[var(--text)]">{t('credits.history')}</h2>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-[var(--text3)]">{t('credits.no_history')}</div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {transactions.map(tx => (
              <div key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'recharge' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                    {tx.type === 'recharge' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-[var(--text)]">{tx.desc}</div>
                    <div className="text-xs text-[var(--text3)] mt-0.5">{tx.date}</div>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'recharge' ? 'text-green-600 dark:text-green-400' : 'text-[var(--text)]'}`}>
                  {tx.type === 'recharge' ? '+' : ''}{tx.amount} CR
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
