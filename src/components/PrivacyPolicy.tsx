import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const { isPrivacyOpen, setPrivacyOpen } = useStore();

  return (
    <AnimatePresence>
      {isPrivacyOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setPrivacyOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl relative border border-slate-100 p-6 sm:p-8"
          >
            <button
              onClick={() => setPrivacyOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6 border-b border-slate-100 pb-4">Privacy Policy</h2>
              
              <p>Last updated: May 2026</p>
              
              <p>
                Welcome to <strong>Am I Influenced?</strong> ("we", "our", or "us"). We are committed to protecting your privacy and providing transparency about how we handle the information you provide while using our web application.
              </p>

              <h3 className="font-bold text-slate-800 mt-6 mb-3">1. Information We Collect</h3>
              <p>
                To generate your influence profile, our application collects the following information:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4 text-slate-600">
                <li><strong>Demographics (Optional):</strong> Your age and gender, if you choose to provide them.</li>
                <li><strong>Quiz Responses:</strong> The answers you select during the questionnaire.</li>
                <li><strong>Selected Categories:</strong> The specific lifestyle areas you choose to analyze.</li>
              </ul>
              
              <h3 className="font-bold text-slate-800 mt-6 mb-3">2. How We Use Your Information</h3>
              <p>
                We use the information collected solely to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4 text-slate-600">
                <li>Calculate your personal influence dimension scores.</li>
                <li>Compare your scores against aggregate demographic averages (if gender is provided).</li>
                <li>Generate a personalized, AI-driven behavioral analysis report.</li>
              </ul>

              <h3 className="font-bold text-slate-800 mt-6 mb-3">3. Third-Party AI Processing</h3>
              <p>
                To generate your personalized "Deep Analysis" report, your calculated dimension scores, age (if provided), and selected categories are sent securely to a third-party Artificial Intelligence service provider (such as OpenAI or Anthropic) via our backend API. 
              </p>
              <p>
                <strong>Important:</strong> We do not send your name, email, IP address, or any direct identifiers to the AI provider. The data sent is used strictly to generate your temporary report and is not used by the provider to train their models.
              </p>

              <h3 className="font-bold text-slate-800 mt-6 mb-3">4. Data Storage and Retention</h3>
              <p>
                <strong>We do not store your personal data in any permanent database.</strong> Your quiz answers and demographic inputs are held in your device's active memory (browser session) only while you are actively using the application. Once you close the tab, refresh the page, or clear the analysis, your specific answers are gone.
              </p>

              <h3 className="font-bold text-slate-800 mt-6 mb-3">5. Cookies and Tracking</h3>
              <p>
                We do not use tracking cookies or targeted advertising pixels. Your self-reflection journey is your own.
              </p>

              <h3 className="font-bold text-slate-800 mt-6 mb-3">6. Children's Privacy</h3>
              <p>
                Our tool is intended for individuals who are 13 years of age or older. We do not knowingly collect information from children under 13. If you are under 13, please do not use this application.
              </p>

              <h3 className="font-bold text-slate-800 mt-6 mb-3">7. Disclaimer</h3>
              <p>
                This tool is designed for personal entertainment and self-reflection. It does not constitute a clinical psychological diagnosis or professional advice.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setPrivacyOpen(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
