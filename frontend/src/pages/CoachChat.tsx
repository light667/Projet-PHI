import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
};

export default function CoachChat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number>(50); // Simulé
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Fetch user credits on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/credits/balance', {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        if (data.balance !== undefined) {
          setCredits(data.balance);
        }
      })
      .catch(console.error);
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t('coach.welcome_msg')
        }
      ]);
    }
  }, [t, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    if (credits < 1) {
      // Pas assez de crédits
      alert(t('coach.no_credits_desc'));
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Optimistic update
      setCredits(prev => Math.max(0, prev - 1));

      const res = await fetch('http://localhost:8000/api/coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-id',
          message: content.trim(),
          history: messages.filter(m => m.id !== 'welcome').map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!res.ok) throw new Error('Erreur API');
      
      const data = await res.json();
      
      if (data.credits_remaining !== undefined) {
          setCredits(data.credits_remaining);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "Désolé, je n'ai pas pu générer de réponse."
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Désolé, une erreur s'est produite lors de la connexion.",
        isError: true
      }]);
    }
  };

  const suggestions = [
    t('coach.suggestion1'),
    t('coach.suggestion2'),
    t('coach.suggestion3'),
    t('coach.suggestion4')
  ];

  const formatText = (text: string) => {
    // Simple bold formatting pour les messages (ex: **texte**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-[24px] shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-[var(--text)]">{t('coach.title')}</h2>
            <p className="text-xs text-[var(--text2)]">{t('coach.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800">
          <Sparkles size={16} />
          {credits} Crédits
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : msg.isError 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-tl-none'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-[var(--border-color)]'
            }`}>
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {formatText(msg.content)}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <Bot size={18} />
            </div>
            <div className="bg-slate-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none px-5 py-4 border border-[var(--border-color)]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface)]">
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4 px-2">
            {suggestions.map((sug, i) => (
              <button 
                key={i}
                onClick={() => handleSend(sug)}
                className="text-xs bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full border border-[var(--border-color)] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center max-w-4xl mx-auto">
          {credits < 1 && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs py-1.5 px-4 rounded-full flex items-center gap-2 font-bold shadow-sm whitespace-nowrap">
              <AlertCircle size={14} /> {t('coach.no_credits')}
            </div>
          )}
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputValue);
              }
            }}
            placeholder={t('coach.placeholder')}
            disabled={isLoading || credits < 1}
            className="w-full bg-slate-50 dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl py-3.5 pl-4 pr-14 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none overflow-hidden h-[52px] min-h-[52px] max-h-[150px] transition-all disabled:opacity-60"
            rows={1}
            style={{ height: 'auto' }}
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isLoading || credits < 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:dark:bg-zinc-700 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} className="translate-x-[1px]" />}
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
            {t('coach.credit_per_msg')}
          </span>
        </div>
      </div>

    </div>
  );
}
