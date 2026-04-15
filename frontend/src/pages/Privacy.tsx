import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-10 font-medium text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
            <Shield size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Privacy Policy</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-500">Last updated: April 15, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p>When you create an account on Phi, we collect information you provide directly, including your name, email address, and any content you generate using our platform. We also automatically collect usage data such as browser type, device information, and interaction patterns to improve our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our AI portfolio generation services</li>
              <li>Personalize your experience and deliver relevant content</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent security incidents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Data Sharing & Third Parties</h2>
            <p>We do not sell your personal data. We may share information with trusted third-party service providers (Firebase/Google for authentication and hosting, AI model providers for portfolio generation) solely to operate our services. All third parties are contractually required to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide our services. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Your Rights (GDPR)</h2>
            <p>If you are located in the European Economic Area, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access, update, or delete your personal information</li>
              <li>Object to or restrict the processing of your data</li>
              <li>Data portability — receive your data in a structured format</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Cookies</h2>
            <p>We use essential cookies for authentication and session management. Analytics cookies (Google Analytics via Firebase) are used only with your consent to help us understand how our platform is used.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS/SSL), secure authentication via Firebase Auth, and strict access controls to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Contact</h2>
            <p>For questions about this Privacy Policy or to exercise your data rights, contact us at: <span className="font-semibold text-blue-500">privacy@phi-org.web.app</span></p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} Phi. All rights reserved.
        </div>
      </div>
    </div>
  );
}
