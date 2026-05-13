import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const AIAnalysisCard: React.FC = () => {
  const { aiSettings, scores, answerHistory } = useStore();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!aiSettings.apiKey) {
      setError('Please enter your OpenRouter API key in the settings panel above.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const promptData = {
      dimensionScores: scores,
      behaviorSummary: answerHistory.map(a => ({
        question: a.questionId,
        answer: a.answer
      }))
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiSettings.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Am I Influenced?',
        },
        body: JSON.stringify({
          model: aiSettings.model,
          messages: [
            {
              role: 'system',
              content: `You are an empathetic behavioral insight assistant for the "Am I Influenced?" app. Analyze the user’s questionnaire profile. Explain possible influence patterns in a non-judgmental way. Do not diagnose the user mentally or medically. Do not claim certainty. Use phrases like 'may suggest,' 'could indicate,' and 'one possible pattern is.' Focus on helping the user make more intentional choices. Format your response using markdown with clear headings, bullet points, and bold text for emphasis.`
            },
            {
              role: 'user',
              content: `Analyze this influence profile:\n\nScores: ${JSON.stringify(promptData.dimensionScores)}\n\nProvide your analysis.`
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch from OpenRouter');
      }

      setAnalysis(data.choices[0].message.content);
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {!analysis && !isLoading && (
        <div className="text-center">
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
          <p className="font-medium animate-pulse">Analyzing your behavior patterns...</p>
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
            <div className="hidden sm:block text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {aiSettings.model.split('/')[1] || aiSettings.model}
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

