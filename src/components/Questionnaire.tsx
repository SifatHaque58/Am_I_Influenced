import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { InfluenceDimension } from '../types';

export const Questionnaire: React.FC = () => {
  const { activeQuestions, currentQuestionIndex, answerQuestion } = useStore();
  const currentQ = activeQuestions[currentQuestionIndex];

  // Local state for tracking range inputs before submitting
  const [rangeValue, setRangeValue] = useState<number>(5);

  if (!currentQ) return null;

  const progress = ((currentQuestionIndex) / activeQuestions.length) * 100;

  const handleMultipleChoice = (scores: Partial<Record<InfluenceDimension, number>>) => {
    answerQuestion(scores, 'multiple_choice_selected');
  };

  const handleYesNo = (scores: Partial<Record<InfluenceDimension, number>>, answer: string) => {
    answerQuestion(scores, answer);
  };

  const handleScaleSubmit = () => {
    if (currentQ.type === 'scale') {
      const scores = currentQ.scoresMapping(rangeValue);
      answerQuestion(scores, rangeValue);
      setRangeValue(5); // reset for next
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
          <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
          <span className="uppercase tracking-wider">{currentQ.category}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="bg-primary-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-slate-100"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-tight">
            {currentQ.text}
          </h2>

          <div className="space-y-4">
            {currentQ.type === 'multiple_choice' && (
              <div className="flex flex-col gap-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMultipleChoice(opt.scores)}
                    className="text-left w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'yes_no' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleYesNo(currentQ.yesScores, 'yes')}
                  className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all text-slate-700 font-bold shadow-sm hover:shadow-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleYesNo(currentQ.noScores, 'no')}
                  className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all text-slate-700 font-bold shadow-sm hover:shadow-md"
                >
                  No
                </button>
              </div>
            )}

            {currentQ.type === 'scale' && (
              <div className="py-6 px-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={rangeValue}
                  onChange={(e) => setRangeValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between mt-4 text-sm font-medium text-slate-500">
                  <span>{currentQ.minLabel}</span>
                  <span>{currentQ.maxLabel}</span>
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={handleScaleSubmit}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-full transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
