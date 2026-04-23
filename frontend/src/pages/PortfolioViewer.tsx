import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiUrl } from '../lib/api.js';
import type { PortfolioData } from '../types/portfolio.js';
import PortfolioRenderer from '../components/PortfolioRenderer.js';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PortfolioViewer() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(apiUrl(`/api/portfolios/by-slug/${slug}`));
        if (!res.ok) {
          if (res.status === 404) {
            setError('Portfolio non trouvé');
          } else {
            setError('Une erreur est survenue lors de la récupération du portfolio');
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        
        // The backend returns the DB row, the portfolio content is in content_json
        if (data.content_json) {
          setPortfolio(data.content_json);
        } else {
          setError('Contenu du portfolio invalide');
        }
      } catch (err) {
        setError('Impossible de joindre le serveur');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <h2 className="text-xl font-bold text-zinc-900">Chargement du portfolio...</h2>
        <p className="text-zinc-500 mt-2">Veuillez patienter pendant que nous récupérons les données.</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 mb-4">{error || 'Portfolio introuvable'}</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          Le lien que vous avez suivi est peut-être erroné ou le portfolio a été supprimé.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <ArrowLeft size={18} /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return <PortfolioRenderer portfolio={portfolio} />;
}
