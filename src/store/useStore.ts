import { create } from 'zustand';
import type { Category, DimensionScores, Question, InfluenceDimension } from '../types';
import { questionBank } from '../data/questions';

interface AIState {
  apiKey: string;
  model: string;
  isRemembered: boolean;
}

interface AppState {
  // Setup
  selectedCategories: Category[];
  toggleCategory: (category: Category) => void;
  startQuiz: () => void;
  
  // Quiz State
  currentQuestionIndex: number;
  activeQuestions: Question[];
  unaskedQuestions: Question[];
  scores: DimensionScores;
  answerHistory: Array<{ questionId: string; answer: unknown; addedScores: Partial<Record<InfluenceDimension, number>> }>;
  isFinished: boolean;
  
  // Actions
  answerQuestion: (addedScores: Partial<Record<InfluenceDimension, number>>, answerValue: unknown) => void;
  resetQuiz: () => void;
  
  // AI State
  aiSettings: AIState;
  updateAISettings: (settings: Partial<AIState>) => void;
}

const initialScores: DimensionScores = {
  social: 0,
  algorithmic: 0,
  advertising: 0,
  peer: 0,
  status: 0,
  insecurity: 0,
  habitual: 0,
  cultural: 0,
  practical: 0,
  independent: 0,
};

const SHUFFLE = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Start by giving them 5 questions.
const selectInitialQuestions = (categories: Category[]): { initial: Question[], pool: Question[] } => {
  const generalPool = questionBank.filter(q => q.category === 'General');
  const categoryPool = questionBank.filter(q => categories.includes(q.category as Category));
  
  // If no categories selected, default to all
  const poolToUse = categoryPool.length > 0 ? categoryPool : questionBank.filter(q => q.category !== 'General');
  
  const allPool = SHUFFLE([...generalPool, ...poolToUse]);
  
  return {
    initial: allPool.slice(0, 5),
    pool: allPool.slice(5) // Remaining to pull from dynamically
  };
};

// Find the best next question from the pool based on the user's highest dimension score so far
const findNextAdaptiveQuestion = (pool: Question[], currentScores: DimensionScores): Question | null => {
  if (pool.length === 0) return null;

  // Find the top influence dimension
  const externalInfluenceDims: InfluenceDimension[] = ['social', 'algorithmic', 'advertising', 'peer', 'status', 'insecurity', 'habitual', 'cultural'];
  
  let topDim: InfluenceDimension = 'social';
  let topScore = -1;
  
  for (const dim of externalInfluenceDims) {
    if (currentScores[dim] > topScore) {
      topScore = currentScores[dim];
      topDim = dim;
    }
  }

  // Find a question in the pool that tests for this topDim
  // We do this by seeing if the dimension is mentioned in the scores of the options
  const matchingQuestionIndex = pool.findIndex(q => {
    if (q.type === 'multiple_choice') {
      return q.options.some(opt => opt.scores[topDim] !== undefined);
    } else if (q.type === 'yes_no') {
      return q.yesScores[topDim] !== undefined || q.noScores[topDim] !== undefined;
    } else if (q.type === 'scale') {
      const testScores = q.scoresMapping(10);
      return testScores[topDim] !== undefined;
    }
    return false;
  });

  if (matchingQuestionIndex !== -1) {
    return pool[matchingQuestionIndex];
  }

  // Fallback to random
  return pool[0];
};

export const useStore = create<AppState>((set, get) => ({
  selectedCategories: [],
  toggleCategory: (category) => set((state) => {
    if (state.selectedCategories.includes(category)) {
      return { selectedCategories: state.selectedCategories.filter(c => c !== category) };
    } else {
      return { selectedCategories: [...state.selectedCategories, category] };
    }
  }),
  
  currentQuestionIndex: 0,
  activeQuestions: [],
  unaskedQuestions: [],
  scores: { ...initialScores },
  answerHistory: [],
  isFinished: false,
  
  startQuiz: () => {
    const categories = get().selectedCategories;
    const { initial, pool } = selectInitialQuestions(categories);
    set({
      activeQuestions: initial,
      unaskedQuestions: pool,
      currentQuestionIndex: 0,
      scores: { ...initialScores },
      answerHistory: [],
      isFinished: false
    });
  },
  
  answerQuestion: (addedScores, answerValue) => set((state) => {
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    
    // Merge scores
    const newScores = { ...state.scores };
    Object.keys(addedScores).forEach(key => {
      const dim = key as InfluenceDimension;
      newScores[dim] = (newScores[dim] || 0) + (addedScores[dim] || 0);
    });

    const newHistory = [...state.answerHistory, { questionId: currentQ.id, answer: answerValue, addedScores }];

    let nextQuestions = [...state.activeQuestions];
    let nextPool = [...state.unaskedQuestions];
    let isFinished = false;

    // Determine if we need to add a question. We aim for 15 questions total.
    if (newHistory.length < 15) {
       // We still need more questions. Pick one adaptively and add to activeQuestions.
       const nextQ = findNextAdaptiveQuestion(nextPool, newScores);
       if (nextQ) {
         nextQuestions.push(nextQ);
         nextPool = nextPool.filter(q => q.id !== nextQ.id);
       } else {
         // No more questions available at all
         if (state.currentQuestionIndex >= nextQuestions.length - 1) {
            isFinished = true;
         }
       }
    } else if (state.currentQuestionIndex >= nextQuestions.length - 1) {
        // Reached 15 questions and we're at the end
        isFinished = true;
    }
    
    return {
      scores: newScores,
      answerHistory: newHistory,
      activeQuestions: nextQuestions,
      unaskedQuestions: nextPool,
      currentQuestionIndex: isFinished ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
      isFinished: isFinished
    };
  }),
  
  resetQuiz: () => set({
    currentQuestionIndex: 0,
    activeQuestions: [],
    unaskedQuestions: [],
    scores: { ...initialScores },
    answerHistory: [],
    isFinished: false,
    selectedCategories: []
  }),
  
  aiSettings: {
    apiKey: localStorage.getItem('ai_api_key') || '',
    model: 'openai/gpt-4o-mini',
    isRemembered: !!localStorage.getItem('ai_api_key')
  },
  
  updateAISettings: (settings) => set((state) => {
    const newSettings = { ...state.aiSettings, ...settings };
    if (newSettings.isRemembered && newSettings.apiKey) {
      localStorage.setItem('ai_api_key', newSettings.apiKey);
    } else if (!newSettings.isRemembered) {
      localStorage.removeItem('ai_api_key');
    }
    return { aiSettings: newSettings };
  })
}));
