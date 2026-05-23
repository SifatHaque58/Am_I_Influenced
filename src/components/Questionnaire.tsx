import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export const Questionnaire: React.FC = () => {
  const { activeQuestions, currentQuestionIndex, answerQuestion, targetQuestionCount } = useStore();
  const currentQ = activeQuestions[currentQuestionIndex];

  if (!currentQ) return null;

  const progress = ((currentQuestionIndex + 1) / targetQuestionCount) * 100;

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
            {currentQ.type === 'mc' && (
              <div className="flex flex-col gap-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerQuestion(idx)}
                    className="text-left w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'binary' && (
              <div className="flex gap-4">
                <button
                  onClick={() => answerQuestion(true)}
                  className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all text-slate-700 font-bold shadow-sm hover:shadow-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => answerQuestion(false)}
                  className="flex-1 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all text-slate-700 font-bold shadow-sm hover:shadow-md"
                >
                  No
                </button>
              </div>
            )}

            {currentQ.type === 'graded' && (
              <div className="py-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => answerQuestion(val)}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-slate-200 hover:border-primary-400 hover:bg-primary-50 font-bold text-slate-600 sm:text-xl transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-medium px-2">
                  <span>Never / Strongly Disagree</span>
                  <span>Always / Strongly Agree</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
