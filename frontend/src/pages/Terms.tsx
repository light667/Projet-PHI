
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} /> {isEn ? "Back to home" : "Retour à l'accueil"}
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black">{isEn ? "Terms of Service" : "Conditions d'utilisation"}</h1>
        </div>
        
        <div className="prose prose-lg dark:prose-invert prose-blue max-w-none bg-[var(--surface)] p-8 md:p-12 rounded-[24px] border border-[var(--border-color)] shadow-sm">
          <p className="text-sm text-[var(--text3)] mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}
          </p>

          <h2>1. Accès au service</h2>
          <p>
            En utilisant la plateforme Phi, vous acceptez les présentes conditions. Le service est fourni "en l'état" pour vous aider dans votre développement de carrière.
          </p>

          <h2>2. Crédits et facturation</h2>
          <p>
            <ul>
              <li>À l'inscription, 50 crédits gratuits vous sont offerts.</li>
              <li>Les achats de packs de crédits (1 000 FCFA pour 100 crédits, 2 000 FCFA pour 250 crédits) sont définitifs et non remboursables.</li>
              <li>Les crédits achetés n'ont pas de date d'expiration tant que le compte reste actif.</li>
              <li>Les tarifs de consommation par fonctionnalité (Coach IA = 1 crédit, Portfolio IA = 10 crédits) sont susceptibles d'évoluer, vous en serez informé.</li>
            </ul>
          </p>

          <h2>3. Contenu généré</h2>
          <p>
            Vous êtes responsable des informations que vous fournissez à l'IA. Bien que nous utilisions les meilleurs modèles du marché, l'IA peut produire des erreurs. Vous devez vérifier les CV, lettres et portfolios générés avant de les utiliser professionnellement. Phi ne peut être tenu responsable d'opportunités de carrière manquées ou d'erreurs textuelles.
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            Le contenu final que vous générez vous appartient entièrement. Vous pouvez l'exporter, le modifier et l'utiliser comme bon vous semble dans le cadre de votre carrière. Les templates de l'application restent la propriété de Phi.
          </p>
        </div>
      </div>
    </div>
  );
}
