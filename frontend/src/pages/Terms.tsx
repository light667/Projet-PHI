import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30 text-slate-900 dark:text-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert prose-lg">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>These Terms of Service constitute a legally binding agreement made between you and Phi concerning your access to and use of the application.</p>
          <h3>1. Agreement to Terms</h3>
          <p>By accessing our application, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service.</p>
          <h3>2. Intellectual Property Rights</h3>
          <p>The application and its original content, features, and functionality are and will remain the exclusive property of Phi and its licensors.</p>
          <h3>3. User Representations</h3>
          <p>By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete.</p>
          <hr className="my-8 border-slate-200 dark:border-zinc-800" />
          <p className="text-sm text-slate-500">Contact us at legal@phi-org.vercel.app if you have questions.</p>
        </div>
      </div>
    </div>
  );
}
