import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
import { AISettingsPanel } from './AISettingsPanel';
import { AIAnalysisCard } from './AIAnalysisCard';

export const ResultsDashboard: React.FC = () => {
  const { scores, resetQuiz, activeQuestions } = useStore();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);

  // Normalize scores to calculate a 0-100 overall score.
  // Independent and Practical generally lower the 'influenced' score, others increase it.
  const externalInfluenceDims = ['social', 'algorithmic', 'advertising', 'peer', 'status', 'insecurity', 'habitual', 'cultural'];
  
  let totalExternal = 0;
  let totalInternal = 0;

  Object.entries(scores).forEach(([dim, val]) => {
    if (externalInfluenceDims.includes(dim)) {
      totalExternal += val;
    } else {
      totalInternal += val;
    }
  });

  const totalPossible = totalExternal + totalInternal || 1; // prevent div zero
  const rawInfluenceScore = Math.round((totalExternal / totalPossible) * 100);
  const overallInfluenceScore = Math.min(100, Math.max(0, rawInfluenceScore));

  const chartData = Object.entries(scores).map(([dim, val]) => ({
    dimension: dim.charAt(0).toUpperCase() + dim.slice(1),
    score: val,
    fullMark: Math.max(...Object.values(scores), 10)
  })).sort((a, b) => b.score - a.score);

  const topInfluences = chartData.filter(d => externalInfluenceDims.includes(d.dimension.toLowerCase())).slice(0, 3);

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    
    try {
      // html-to-image is much better at handling SVGs and modern CSS
      const dataUrl = await toPng(dashboardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          backdropFilter: 'none', // Fallback just in case
        }
      });
      
      const link = document.createElement('a');
      link.download = `my-influence-profile-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. This can happen in some browsers. Please try taking a screenshot instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const dataUrl = await toPng(dashboardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'influence-profile.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Influence Profile',
          text: 'I just checked my influence profile on Am I Influenced! Check yours too.',
        });
      } else {
        handleExport();
        if (!navigator.share) {
          alert('Sharing is not supported on this browser. Your result has been downloaded instead.');
        }
      }
    } catch (err) {
      console.error('Share failed:', err);
      handleExport();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <motion.div 
        ref={dashboardRef}
        data-capture-container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 mb-8"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            Your Influence Profile
          </h2>
          <p className="text-slate-500">Based on {activeQuestions.length} responses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-tr from-primary-100 to-accent-blue/10 shadow-inner">
              <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-accent-blue">
                  {overallInfluenceScore}
                </span>
                <span className="text-sm font-medium text-slate-400 mt-1">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-center text-slate-600 max-w-xs leading-relaxed">
              {overallInfluenceScore > 70 ? 'You are highly responsive to external trends, peers, and marketing.' :
               overallInfluenceScore > 40 ? 'You balance personal preference with external inspiration.' :
               'You primarily make decisions independently, driven by practicality.'}
            </p>
          </div>

          {/* Radar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Influences */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Your Strongest Influences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topInfluences.map((inf, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <span className="text-sm font-bold text-primary-600 uppercase tracking-wide mb-1">
                  {inf.dimension}
                </span>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-auto">
                  <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${(inf.score / inf.fullMark) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>

      {/* AI & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAISettings(!showAISettings)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-medium transition-colors shadow-lg"
          >
            <Sparkles size={18} />
            AI Deep Dive
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors shadow-lg"
          >
            <Download size={18} />
            Share Result
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-medium transition-colors"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Save Image'}
          </button>
        </div>

        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <RefreshCw size={18} />
          Retake Quiz
        </button>
      </div>

      <AnimatePresence>
        {showAISettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <AISettingsPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <AIAnalysisCard />
    </div>
  );
};
