import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30 text-slate-900 dark:text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert prose-lg">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>Welcome to Phi. We are committed to protecting your personal information and your right to privacy.</p>
          <h3>1. Information we collect</h3>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products.</p>
          <h3>2. How we use your information</h3>
          <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests.</p>
          <h3>3. Will your information be shared with anyone?</h3>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          <hr className="my-8 border-slate-200 dark:border-zinc-800" />
          <p className="text-sm text-slate-500">Contact us at legal@phi-org.vercel.app if you have questions.</p>
        </div>
      </div>
    </div>
  );
}
