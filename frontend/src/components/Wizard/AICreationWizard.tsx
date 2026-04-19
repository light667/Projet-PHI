import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'domain', title: 'Domaine & Objectif' },
  { id: 'style', title: 'Style & Ton' },
  { id: 'content', title: 'Contenu de base' },
  { id: 'generating', title: 'Génération' }
];

export default function AICreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === STEPS.length - 2) {
        setIsGenerating(true);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    })
  };

  const direction = 1;

  return (
    <div className="min-h-[500px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden flex flex-col font-sans">
      
      {/* Header / Stepper Progress */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold tracking-wide">
             <Sparkles size={20} className="text-zinc-900" />
             <span>PHI Assistant</span>
          </div>
          <span className="text-xs font-semibold text-zinc-400">
             Étape {currentStep + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-zinc-900"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative px-8 py-6 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Quel est votre domaine ?</h2>
                <p className="text-zinc-500">Aidez-nous à personnaliser la structure de votre portfolio.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Photographie', 'Développement Web', 'Design / UI / UX', 'Freelance / Consultant'].map((role) => (
                  <label key={role} className="flex items-center p-4 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-900 transition-colors">
                    <input type="radio" name="domain" className="hidden peer" />
                    <div className="w-5 h-5 rounded-full border border-zinc-300 peer-checked:border-[6px] peer-checked:border-zinc-900 transition-all mr-3"></div>
                    <span className="text-zinc-700 font-medium">{role}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Quel style recherchez-vous ?</h2>
                <p className="text-zinc-500">Ceci influencera les couleurs et la typographie de base.</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Minimaliste', desc: 'Beaucoup d’espace, typographie épurée' },
                  { title: 'Brutaliste', desc: 'Contraste fort, grilles marquées' },
                  { title: 'Élégant / Premium', desc: 'Dégradés subtils, empattements' }
                ].map((style) => (
                  <label key={style.title} className="flex flex-col p-4 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-900 transition-colors group">
                    <input type="radio" name="style" className="hidden peer" />
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full border border-zinc-300 peer-checked:border-[6px] peer-checked:border-zinc-900 transition-all mr-3"></div>
                      <span className="text-zinc-900 font-semibold">{style.title}</span>
                    </div>
                    <p className="text-zinc-500 text-sm ml-8">{style.desc}</p>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Quelques détails</h2>
                <p className="text-zinc-500">L'IA s'en servira pour générer vos premiers textes.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Résumé rapide (Bio)</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none h-28"
                    placeholder="Ex: Je suis un développeur passionné par la création d'interfaces fluides et performantes..."
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={{
                 hidden: { opacity: 0, scale: 0.95 },
                 visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                 exit: { opacity: 0 }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col items-center justify-center text-center py-10"
            >
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-zinc-100 rounded-full animate-ping opacity-50"></div>
                 <div className="relative bg-zinc-900 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl">
                   <Loader2 size={32} className="animate-spin" />
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">Waking up the AI...</h2>
              <p className="text-zinc-500 max-w-sm">
                Génération de votre maquette idéale à partir de vos préférences. Cela ne prendra que quelques secondes.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer / Actions */}
      {!isGenerating && (
        <div className="px-8 py-5 border-t border-zinc-100 flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-zinc-500 font-medium hover:text-zinc-900 transition-colors disabled:opacity-0"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
          
          <button 
            onClick={nextStep}
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            {currentStep === STEPS.length - 2 ? 'Générer mon portfolio' : 'Suivant'}
            {currentStep === STEPS.length - 2 ? <Sparkles size={16} /> : <ArrowRight size={18} />}
          </button>
        </div>
      )}

    </div>
  );
}
