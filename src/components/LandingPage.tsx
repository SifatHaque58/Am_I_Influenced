import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Category, Gender } from '../types';
import { Check } from 'lucide-react';

const CATEGORIES: Category[] = [
  'Fashion',
  'Beauty / Makeup',
  'Shopping',
  'Food / Diet',
  'Books / Reading',
  'Fitness / Wellness',
  'Entertainment',
  'Social Media',
  'General Lifestyle'
];

const GENDERS: { label: string, value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-Binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' }
];

export const LandingPage: React.FC = () => {
  const { selectedCategories, toggleCategory, startQuiz, gender, setGender, age, setAge } = useStore();

  const handleStart = () => {
    startQuiz();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto w-full bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-blue mb-4 tracking-tight">
          Am I Influenced?
        </h1>
        <p className="text-xl text-slate-700 font-medium mb-2">Discover what shapes your choices.</p>
        <p className="text-slate-500 leading-relaxed max-w-lg mx-auto">
          Answer a few thoughtful questions and see how your habits may be shaped by trends, people, platforms, marketing, and social pressure.
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          Demographics (Optional)
        </h3>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {GENDERS.map((g) => {
            const isSelected = gender === g.value;
            return (
              <button
                key={g.value || 'null'}
                onClick={() => setGender(isSelected ? null : g.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isSelected 
                    ? 'bg-accent-blue/10 text-accent-blue ring-2 ring-accent-blue shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                {g.label}
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mb-10">
          <input 
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 w-28 text-center placeholder:text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
            min="10"
            max="120"
          />
        </div>

        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          Select areas to analyze (optional)
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500 shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                {cat}
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={handleStart}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold py-4 px-10 rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Take the Quiz
        </button>
        <p className="mt-4 text-xs text-slate-400">
          This tool is for self-reflection only and does not store your personal data.
        </p>
      </div>
    </motion.div>
  );
};
