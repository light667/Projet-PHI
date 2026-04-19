
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} /> {isEn ? "Back to home" : "Retour à l'accueil"}
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText size={24} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black">{isEn ? "Privacy Policy" : "Politique de confidentialité"}</h1>
        </div>
        
        <div className="prose prose-lg dark:prose-invert prose-blue max-w-none bg-[var(--surface)] p-8 md:p-12 rounded-[24px] border border-[var(--border-color)] shadow-sm">
          <p className="text-sm text-[var(--text3)] mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}
          </p>

          <h2>1. Collecte des données</h2>
          <p>
            Nous collectons uniquement les données nécessaires au bon fonctionnement de la plateforme :
            <ul>
              <li>Informations de base (nom, email) lors de l'authentification avec Firebase.</li>
              <li>Données professionnelles que vous fournissez au Coach IA et au générateur de portfolio.</li>
              <li>Historique de consommation de vos crédits.</li>
            </ul>
          </p>

          <h2>2. Utilisation de l'IA et traitement des données</h2>
          <p>
            Phi utilise l'API Gemini pour fournir ses services de Coach et de génération. Les données que vous envoyez dans les invites (prompts) sont traitées par nos modèles partenaires. <b>Nous ne vendons aucune de vos données personnelles.</b>
          </p>

          <h2>3. Cookies et Suivi</h2>
          <p>
            Nous utilisons Firebase Analytics pour comprendre l'utilisation de notre plateforme afin de l'améliorer. Vous pouvez gérer vos préférences de cookies à tout moment via la bannière de consentement.
          </p>

          <h2>4. Conservation et Suppression</h2>
          <p>
            Vos données sont conservées de manière sécurisée sur Supabase. Vous pouvez supprimer définitivement votre compte et toutes ses données dans la section "Paramètres" de votre espace personnel.
          </p>
        </div>
      </div>
    </div>
  );
}
