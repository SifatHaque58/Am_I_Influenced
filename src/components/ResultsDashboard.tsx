import React, { useRef, useState } from 'react';
import { useStore, PROFILES, DIMENSION_DESCRIPTIONS } from '../store/useStore';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, RefreshCw, Target } from 'lucide-react';
import { AIAnalysisCard } from './AIAnalysisCard';

export const ResultsDashboard: React.FC = () => {
  const { engineScores, gender, resetQuiz, activeQuestions, unaskedQuestions, improveConfidence, selectedCategories } = useStore();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showGenderAverage, setShowGenderAverage] = useState(false);

  const WEIGHTS = {
    RAW_INFLUENCE: 0.50,
    COHORT_PERCENTILE: 0.30,
    RESISTANCE: 0.20,
    EXTERNAL_SPLIT: 0.65,
    INTERNAL_SPLIT: 0.35
  };

  // 1. Normalize scores (0-100)
  const normalizedScores: Record<string, number> = {};
  const externalInfluenceDims = ['social', 'algorithmic', 'advertising', 'peer', 'status', 'insecurity', 'habitual', 'cultural'];
  const internalInfluenceDims = ['practical', 'independent'];
  const allDims = [...externalInfluenceDims, ...internalInfluenceDims];

  let totalConfidence = 0;
  let dimsWithConfidence = 0;

  allDims.forEach(dim => {
      const s = engineScores[dim as keyof typeof engineScores];
      normalizedScores[dim] = s.mean !== null ? Math.round(s.mean * 100) : 0;
      if (s.count > 0) {
        totalConfidence += s.confidence;
        dimsWithConfidence++;
      }
  });

  const avgConfidence = dimsWithConfidence > 0 ? totalConfidence / dimsWithConfidence : 0;

  // Calculate averages
  const externalScore = externalInfluenceDims.reduce((acc, dim) => acc + normalizedScores[dim], 0) / externalInfluenceDims.length;
  const internalScore = internalInfluenceDims.reduce((acc, dim) => acc + normalizedScores[dim], 0) / internalInfluenceDims.length;

  // Score A: rawInfluenceScore
  const rawInfluenceScore = Math.round((externalScore * WEIGHTS.EXTERNAL_SPLIT) + ((100 - internalScore) * WEIGHTS.INTERNAL_SPLIT));

  // Score B: genderPercentile & Score C: resistanceScore
  let genderPercentile: number | null = null;
  let resistanceScore: number = 0;

  if (gender === 'male' || gender === 'female') {
      const profile = PROFILES[gender];
      let sumPercentile = 0;

      // Only calculate percentile against external influence dimensions
      externalInfluenceDims.forEach(dim => {
          const z = (normalizedScores[dim] - profile.means[dim as keyof typeof profile.means]) / profile.stdDevs[dim as keyof typeof profile.stdDevs];
          // Normal CDF approximation
          const t = 1 / (1 + 0.2316419 * Math.abs(z));
          const d = 0.3989423 * Math.exp(-z * z / 2);
          const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
          const percentile = z > 0 ? (1 - prob) * 100 : prob * 100;
          sumPercentile += percentile;
      });
      genderPercentile = Math.round(sumPercentile / externalInfluenceDims.length);

      const dominantSum = profile.typicalDominant.reduce((acc, dim) => acc + normalizedScores[dim], 0);
      resistanceScore = 100 - Math.round(dominantSum / profile.typicalDominant.length);
  } else {
      // no gender, or non-binary
      const top3Dims = Object.entries(normalizedScores)
          .filter(([dim]) => externalInfluenceDims.includes(dim))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(entry => entry[1]);
      const top3Avg = top3Dims.reduce((a, b) => a + b, 0) / 3;
      resistanceScore = 100 - Math.round(top3Avg);
  }

  // 6. Overall Rating
  const genderComponent = genderPercentile !== null ? genderPercentile : rawInfluenceScore;
  const overallRatingRaw = (rawInfluenceScore * WEIGHTS.RAW_INFLUENCE) + (genderComponent * WEIGHTS.COHORT_PERCENTILE) + ((100 - resistanceScore) * WEIGHTS.RESISTANCE);
  const overallRating = Math.round(overallRatingRaw);

  let ratingLabel = "Heavily Influenced";
  if (overallRating <= 24) ratingLabel = "Highly Independent";
  else if (overallRating <= 41) ratingLabel = "Mostly Independent";
  else if (overallRating <= 57) ratingLabel = "Balanced";
  else if (overallRating <= 73) ratingLabel = "Moderately Influenced";

  const getOverallRatingBody = (label: string) => {
    switch (label) {
      case "Highly Independent": return "Your choices are driven primarily by your own reasoning and values. External pressures have very little effect on your behavior.";
      case "Mostly Independent": return "You lean toward self-driven decisions. Outside influences exist but don't consistently override your own judgment.";
      case "Balanced": return "You show a roughly equal mix of independent thinking and external influence across your decisions.";
      case "Moderately Influenced": return "External forces — social pressure, algorithms, advertising — regularly shape your choices, often without you noticing.";
      case "Heavily Influenced": return "Your decisions are strongly driven by outside forces. Understanding which ones affect you most is a powerful starting point.";
      default: return "";
    }
  };

  const getInfluenceLoadDescription = (score: number) => {
    if (score <= 24) return "You make choices that are largely self-driven. External pressure has little grip on you.";
    if (score <= 41) return "You're mostly independent. Some outside forces nudge you but rarely take over.";
    if (score <= 57) return "A mix of internal reasoning and external pressure guides your decisions.";
    if (score <= 73) return "Outside forces — ads, trends, peers — play a significant role in your choices.";
    return "Your decisions are heavily shaped by external influences. Awareness is the first step.";
  };

  const getPatternResistanceDescription = (score: number) => {
    if (score <= 24) return "You follow the typical influence patterns for your demographic closely.";
    if (score <= 41) return "You resist some of the common pressures for your group, but not consistently.";
    if (score <= 57) return "You push back on your group's typical patterns about half the time.";
    if (score <= 73) return "You resist the influences that usually affect people like you more than most.";
    return "You've largely broken free from the patterns most common for your demographic.";
  };

  const getCohortStandingDescription = (score: number) => {
    if (score <= 24) return "You're among the least influenced in your gender group.";
    if (score <= 41) return "You're less influenced than most people of your gender.";
    if (score <= 57) return "You're close to average for your gender group.";
    if (score <= 73) return "You're more influenced than most people of your gender.";
    return "You're among the most influenced in your gender group.";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dimKey = label.toLowerCase() as keyof typeof DIMENSION_DESCRIPTIONS;
      const desc = DIMENSION_DESCRIPTIONS[dimKey];
      return (
        <div className="bg-white/95 backdrop-blur border border-slate-200 p-3 rounded-xl shadow-lg max-w-[250px]">
          <p className="font-bold text-slate-800 text-sm uppercase mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} style={{ color: entry.color }} className="font-semibold text-sm mb-1">
               {entry.name}: {entry.value} / 100
             </p>
          ))}
          {desc && <p className="text-xs text-slate-500 leading-snug mt-2">{desc}</p>}
        </div>
      );
    }
    return null;
  };

  const chartData = allDims.map((dim) => {
      const dimName = dim as keyof typeof engineScores;
      const dataPoint: any = {
          dimension: dim.charAt(0).toUpperCase() + dim.slice(1),
          score: normalizedScores[dimName],
          fullMark: 100
      };
      if (showGenderAverage && (gender === 'male' || gender === 'female')) {
          dataPoint.average = PROFILES[gender].means[dimName];
      }
      return dataPoint;
  });

  const topInfluences = Object.entries(normalizedScores)
      .filter(([dim]) => externalInfluenceDims.includes(dim))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([dim, score]) => ({ dimension: dim.charAt(0).toUpperCase() + dim.slice(1), score, fullMark: 100 }));

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    
    // Temporarily hide backdrop-blur as html2canvas struggles with it
    const originalStyle = dashboardRef.current.style.backdropFilter;
    dashboardRef.current.style.backdropFilter = 'none';
    
    try {
      const dataUrl = await toPng(dashboardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          backdropFilter: 'none',
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
      dashboardRef.current.style.backdropFilter = originalStyle;
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
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Influence Profile',
          text: 'I just checked my influence profile on Am I Influenced! Check yours too.',
        });
      } else {
        alert('Sharing images directly is not supported on your current browser or device. Please use the "Save Image" button instead.');
      }
    } catch (err: any) {
      console.error('Share failed:', err);
      // Do not show an error if the user intentionally cancelled the share dialog
      if (err.name !== 'AbortError') {
        alert('Sharing failed. Please use the "Save Image" button instead.');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      <motion.div 
        ref={dashboardRef}
        data-capture-container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 md:p-10 shadow-xl border border-slate-100 mb-6 md:mb-8"
      >
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            Your Influence Profile
          </h2>
          <p className="text-sm sm:text-base text-slate-500">Based on {activeQuestions.length} responses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center mb-10 md:mb-12">
          {/* Metrics Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl border border-primary-100 shadow-sm text-center flex flex-col items-center">
                <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wide mb-3">Overall Rating</h3>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-accent-blue mb-4">
                  {overallRating}
                </div>
                <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-bold mb-3 shadow-sm inline-block">
                  {ratingLabel}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                  {getOverallRatingBody(ratingLabel)}
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               {rawInfluenceScore > 70 && resistanceScore > 70 && (
                 <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
                   <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                     <span className="text-xl">⚠️</span> Nuanced Profile
                   </p>
                   <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                     Note: You score highly for external influence overall, but you actively resist the specific patterns most common for your demographic.
                   </p>
                 </div>
               )}
               
               {/* Data Confidence */}
               <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Data Confidence</p>
                      <p className="text-xs text-slate-500">Based on consistency</p>
                    </div>
                    <span className="text-xl font-bold text-slate-800">{Math.round(avgConfidence * 100)}%</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed mt-2 bg-white p-2 rounded border border-slate-100">
                    <p>{avgConfidence >= 0.6 ? "High confidence. Your responses were consistent." : "Low confidence. Your answers showed high variance or thin coverage."}</p>
                  </div>
                  {avgConfidence < 0.6 && unaskedQuestions.length > 0 && (
                    <button 
                      onClick={improveConfidence}
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors border border-indigo-200"
                    >
                      <Target size={14} />
                      Answer 5 more questions to improve accuracy
                    </button>
                  )}
                  {avgConfidence < 0.6 && unaskedQuestions.length < 5 && (
                    <p className="mt-3 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200 leading-tight">
                      We've run out of questions for your selected categories{selectedCategories.length > 0 ? ` (you only selected ${selectedCategories.length})` : ''}. To improve accuracy, try taking the quiz again with more categories.
                    </p>
                  )}
               </div>
               {/* Card 1: Influence Load */}
               <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Influence Load</p>
                      <p className="text-xs text-slate-500">How much outside forces shape your choices</p>
                    </div>
                    <span className="text-xl font-bold text-slate-800">{rawInfluenceScore}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-white p-2 rounded border border-slate-100">
                    {getInfluenceLoadDescription(rawInfluenceScore)}
                  </p>
               </div>
               
               {/* Card 2: Pattern Resistance */}
               <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Pattern Resistance</p>
                      <p className="text-xs text-slate-500">
                        {gender === 'male' || gender === 'female' 
                          ? "How much you resist the influences most common for people like you" 
                          : "How much you resist your own dominant influence patterns"}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-slate-800">{resistanceScore}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-white p-2 rounded border border-slate-100">
                    {getPatternResistanceDescription(resistanceScore)}
                  </p>
               </div>

               {/* Card 3: Cohort Standing */}
               {genderPercentile !== null ? (
                 <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Cohort Standing</p>
                        <p className="text-xs text-slate-500">How you compare to others of your gender</p>
                      </div>
                      <span className="text-xl font-bold text-slate-800">{genderPercentile}<span className="text-xs font-medium text-slate-500 ml-0.5">th %ile</span></span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-white p-2 rounded border border-slate-100">
                      {getCohortStandingDescription(genderPercentile)}
                    </p>
                 </div>
               ) : (
                 <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col items-center text-center justify-center">
                    <p className="text-sm font-bold text-slate-700 mb-1">Cohort Standing Locked</p>
                    <p className="text-xs text-slate-500 mb-4 max-w-xs">Select your gender during setup to see how you compare to your demographic group.</p>
                    <button onClick={resetQuiz} className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
                      Update Settings
                    </button>
                 </div>
               )}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="flex flex-col items-center">
            {(gender === 'male' || gender === 'female') && (
              <div className="mb-4 flex items-center gap-2">
                 <input 
                   type="checkbox" 
                   id="showAvg" 
                   checked={showGenderAverage} 
                   onChange={e => setShowGenderAverage(e.target.checked)} 
                   className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 border-slate-300" 
                 />
                 <label htmlFor="showAvg" className="text-sm text-slate-600 font-medium cursor-pointer select-none">
                   Show gender average
                 </label>
              </div>
            )}
            <div className="h-60 sm:h-64 md:h-72 w-full focus:outline-none" style={{ outline: 'none' }}>
              <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none' }}>
                <RadarChart cx="50%" cy="50%" outerRadius={window.innerWidth < 640 ? "70%" : "80%"} data={chartData} style={{ outline: 'none' }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar name="You" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  {showGenderAverage && (gender === 'male' || gender === 'female') && (
                    <Radar name="Average" dataKey="average" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeDasharray="3 3" />
                  )}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Influences */}
        <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 mb-4 md:mb-8">
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 text-center sm:text-left">Your Strongest Influences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {topInfluences.map((inf, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <span className="text-xs md:text-sm font-bold text-primary-600 uppercase tracking-wide mb-2">
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6 md:mb-8 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl sm:rounded-full font-medium transition-colors shadow-lg w-full sm:w-auto"
          >
            <Download size={18} />
            Share Result
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl sm:rounded-full font-medium transition-colors w-full sm:w-auto"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Save Image'}
          </button>
        </div>

        <button
          onClick={resetQuiz}
          className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 text-slate-500 hover:text-slate-800 font-medium transition-colors w-full sm:w-auto bg-slate-100 sm:bg-transparent rounded-xl sm:rounded-none"
        >
          <RefreshCw size={18} />
          Retake Quiz
        </button>
      </div>

      <AIAnalysisCard />
    </div>
  );
};
