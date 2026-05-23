import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, FileText, ArrowDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const AIAnalysisCard: React.FC = () => {
  const { engineScores } = useStore();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

  const loadingMessages = [
    "Analyzing your behavior patterns...",
    "Consulting the psychological oracles...",
    "Decoding your decision-making...",
    "Checking your susceptibility to shiny things...",
    "Calculating peer pressure resistance...",
    "Brewing your personalized insight..."
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    const normalizedScores: Record<string, number> = {};
    const dims = ['social', 'algorithmic', 'advertising', 'peer', 'status', 'insecurity', 'habitual', 'cultural', 'practical', 'independent'];
    dims.forEach(dim => {
      const s = engineScores[dim as keyof typeof engineScores];
      normalizedScores[dim] = s.mean !== null ? Math.round(s.mean * 100) : 0;
    });

    const promptData = {
      dimensionScores: normalizedScores
    };

    let attempts = 0;
    const maxAttempts = 5;
    let finalAnalysis = "";

    while (attempts < maxAttempts) {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(promptData)
        });

        let data;
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          if (!response.ok) {
             throw new Error(`Backend API Error (Status: ${response.status}). If running locally, start Wrangler. If on Cloudflare, ensure _worker.js is deployed.`);
          }
          throw new Error("Invalid response format from server");
        }

        if (!response.ok) {
          throw new Error(data?.error || `Server error: ${response.status}`);
        }

        const content = data.choices?.[0]?.message?.content;
        
        if (content && content.trim() !== "") {
          finalAnalysis = content;
          break; // Success! Exit the retry loop
        } else {
          throw new Error("The AI returned an empty response.");
        }
      } catch (err: unknown) {
        attempts++;
        console.warn(`AI generation attempt ${attempts} failed:`, err);
        
        if (attempts >= maxAttempts) {
          setError((err as Error).message || 'Failed after multiple attempts. Please try again.');
          setIsLoading(false);
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    setAnalysis(finalAnalysis);
    setIsLoading(false);
  };

  return (
    <div className="mt-8">
      {!analysis && !isLoading && (
        <div className="text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 120, damping: 14 }}
            className="relative mb-6 z-10"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl shadow-xl shadow-slate-200 flex items-center gap-2.5 relative"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
              </span>
              <span className="text-xs font-bold tracking-wide">Ready for your deep dive?</span>
              <ArrowDown size={14} className="text-slate-400" />
              
              {/* Sleek downward pointer triangle */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-800 rotate-45 rounded-[2px]" />
            </motion.div>
          </motion.div>

          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-blue hover:from-primary-700 hover:to-accent-blue/80 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary-500/30 transition-transform transform hover:scale-105 active:scale-95"
          >
            <Sparkles size={20} />
            Generate AI Analysis
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 bg-white p-10 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="animate-spin text-primary-500 mb-4" size={40} />
          <div className="min-h-[3rem] sm:min-h-[1.5rem] flex items-center justify-center px-2 w-full max-w-sm">
            <motion.p 
              key={loadingMessageIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-medium text-slate-600 text-center text-sm sm:text-base leading-snug"
            >
              {loadingMessages[loadingMessageIdx]}
            </motion.p>
          </div>
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-accent-blue to-accent-teal" />
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Your Insight Report</h3>
                <p className="text-sm text-slate-500 font-medium">AI-Powered Behavioral Analysis</p>
              </div>
            </div>
          </div>

          <div className="markdown-content prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-primary-700 prose-strong:font-bold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analysis}
            </ReactMarkdown>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-xs text-slate-400 italic">
               Note: This report is generated by AI and should be used for self-reflection only.
             </p>
             <button 
               onClick={() => setAnalysis(null)}
               className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
             >
               Clear Analysis
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

