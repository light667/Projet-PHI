import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      hero: {
        badge: "New: Intelligent Career Coaching",
        title: "Phi",
        tagline: "THE AI THAT ACTUALLY BUILDS YOUR BRAND.",
        cta_primary: "Create your portfolio",
      },
      features: {
        f1_title: "Effortless Digital Identity",
        f1_desc: "A powerful platform that generates, structures, and hosts your professional portfolio in minutes with stunning aesthetics. Focus on your message, we handle the design.",
        f2_title: "Interactive Career Simulation",
        f2_desc: "Simulate high-stakes interviews with a virtual coach. Get real-time feedback on your answers, refine your pitch, and prepare to ace your next opportunity.",
        f3_title: "Intelligent Opportunities",
        f3_desc: "We analyze your profile and semantically match you with exclusive job offers. Maximize your chances with resumes perfectly tailored for modern recruitment systems.",
      }
    }
  },
  fr: {
    translation: {
      hero: {
        badge: "Nouveau : Coaching Carrière Avancé",
        title: "Phi",
        tagline: "L'IA QUI FAÇONNE RÉELLEMENT VOTRE IMAGE.",
        cta_primary: "Générer mon portfolio",
      },
      features: {
        f1_title: "Identité Numérique Sans Effort",
        f1_desc: "Une plateforme puissante qui génère, structure et héberge votre portfolio avec un design exceptionnel en quelques minutes. Laissez-nous gèrer la technique, concentrez-vous sur votre message.",
        f2_title: "Simulation d'Entretien",
        f2_desc: "Entraînez-vous pour des entretiens décisifs face à un coach virtuel dynamique. Obtenez un feedback en temps réel, affinez votre discours et préparez-vous à briller.",
        f3_title: "Ciblage Opportunités Intelligent",
        f3_desc: "Le système analyse votre profil et vous met en relation de manière pertinente avec des offres exclusives. Augmentez vos chances avec des CV parfaitement optimisés pour le marché moderne.",
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // DEFAULT to English
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
