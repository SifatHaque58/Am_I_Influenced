import { create } from 'zustand';
import type { Category, DimensionScores, Question, InfluenceDimension, Gender, GenderProfile } from '../types';
import { questionBank } from '../data/questions';

export const PROFILES: Record<'male' | 'female', GenderProfile> = {
  male: {
    means: {
      social: 50, algorithmic: 56, advertising: 52, peer: 54,
      status: 58, insecurity: 50, habitual: 56, cultural: 52,
      practical: 60, independent: 58,
    },
    stdDevs: {
      social: 12, algorithmic: 15, advertising: 12, peer: 12,
      status: 14, insecurity: 12, habitual: 10, cultural: 10,
      practical: 10, independent: 12,
    },
    typicalDominant: ['status', 'algorithmic', 'practical', 'independent']
  },
  female: {
    means: {
      social: 55, algorithmic: 54, advertising: 55, peer: 58,
      status: 54, insecurity: 56, habitual: 54, cultural: 54,
      practical: 56, independent: 55,
    },
    stdDevs: {
      social: 14, algorithmic: 15, advertising: 12, peer: 14,
      status: 12, insecurity: 15, habitual: 10, cultural: 10,
      practical: 10, independent: 12,
    },
    typicalDominant: ['social', 'peer', 'insecurity', 'advertising']
  }
};

export const DIMENSION_DESCRIPTIONS: Record<InfluenceDimension, string> = {
  social: "How much social proof and group behavior pull your decisions.",
  algorithmic: "How much content fed to you by apps and feeds shapes what you want.",
  advertising: "How much ads, promotions, and marketing affect your choices.",
  peer: "How much the people directly around you influence what you do.",
  status: "How much desire for status or prestige drives your purchases and behavior.",
  insecurity: "How much self-doubt or fear of missing out pushes your decisions.",
  habitual: "How much routine and brand loyalty drive your choices without reflection.",
  cultural: "How much your cultural environment shapes what feels normal or desirable.",
  practical: "How much your choices are driven by logic, need, and value for money.",
  independent: "How much you consciously resist trends and make choices on your own terms."
};


interface AIState {
  apiKey: string;
  model: string;
  isRemembered: boolean;
}

interface AppState {
  // Setup
  selectedCategories: Category[];
  toggleCategory: (category: Category) => void;
  gender: Gender;
  setGender: (gender: Gender) => void;
  startQuiz: () => void;
  
  // Quiz State
  currentQuestionIndex: number;
  activeQuestions: Question[];
  unaskedQuestions: Question[];
  scores: DimensionScores;
  maxScores: DimensionScores;
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
const countInternalQuestions = (questions: Question[]) => {
  return questions.filter(q => {
    if (q.type === 'multiple_choice') {
      return q.options.some(opt => (opt.scores.practical || 0) >= 3 || (opt.scores.independent || 0) >= 3);
    } else if (q.type === 'yes_no') {
      return (q.yesScores.practical || 0) >= 3 || (q.yesScores.independent || 0) >= 3 || (q.noScores.practical || 0) >= 3 || (q.noScores.independent || 0) >= 3;
    } else if (q.type === 'scale') {
      const minS = q.scoresMapping(1);
      const maxS = q.scoresMapping(10);
      return (minS.practical || 0) >= 3 || (minS.independent || 0) >= 3 || (maxS.practical || 0) >= 3 || (maxS.independent || 0) >= 3;
    }
    return false;
  }).length;
};

const findNextAdaptiveQuestion = (pool: Question[], currentScores: DimensionScores, gender: Gender, activeQuestions: Question[]): Question | null => {
  if (pool.length === 0) return null;

  // Determine if we are starving internal dimensions
  const internalCount = countInternalQuestions(activeQuestions);
  const forceInternal = activeQuestions.length >= 8 && internalCount < 3;

  let topDim: InfluenceDimension = 'social';
  
  if (forceInternal) {
    topDim = currentScores.practical < currentScores.independent ? 'practical' : 'independent';
  } else {
    // Find the top external influence dimension
    const externalInfluenceDims: InfluenceDimension[] = ['social', 'algorithmic', 'advertising', 'peer', 'status', 'insecurity', 'habitual', 'cultural'];
    let topScore = -1;
    
    for (const dim of externalInfluenceDims) {
      if (currentScores[dim] > topScore) {
        topScore = currentScores[dim];
        topDim = dim;
      }
    }
  }

  // Find a question in the pool that tests for this topDim
  const dimensionTargetedPool = pool.filter(q => {
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

  const candidates = dimensionTargetedPool.length > 0 ? dimensionTargetedPool : pool;
  let finalCandidates: Question[] = [];

  if (gender === 'male' || gender === 'female') {
    const preferredRelevance = `${gender}-primary`;
    finalCandidates = candidates.filter(q => q.genderRelevance === preferredRelevance || q.genderRelevance === 'neutral');
    if (finalCandidates.length === 0) {
      finalCandidates = candidates;
    }
  } else {
    finalCandidates = candidates.filter(q => q.genderRelevance === 'neutral');
    if (finalCandidates.length === 0) {
      finalCandidates = candidates;
    }
  }

  if (finalCandidates.length > 0) {
    return SHUFFLE(finalCandidates)[0];
  }

  // Fallback to random
  return SHUFFLE(pool)[0];
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
  
  gender: null,
  setGender: (gender) => set({ gender }),

  currentQuestionIndex: 0,
  activeQuestions: [],
  unaskedQuestions: [],
  scores: { ...initialScores },
  maxScores: { ...initialScores },
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
      maxScores: { ...initialScores },
      answerHistory: [],
      isFinished: false
    });
  },
  
  answerQuestion: (addedScores, answerValue) => set((state) => {
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    
    // Calculate max possible score for currentQ across all dimensions
    const maxPossibles: Partial<Record<InfluenceDimension, number>> = {};
    if (currentQ.type === 'multiple_choice') {
      currentQ.options.forEach(opt => {
        Object.entries(opt.scores).forEach(([dim, val]) => {
          const d = dim as InfluenceDimension;
          maxPossibles[d] = Math.max(maxPossibles[d] || 0, val as number);
        });
      });
    } else if (currentQ.type === 'yes_no') {
      const checkScores = (scores: Partial<Record<InfluenceDimension, number>>) => {
        Object.entries(scores).forEach(([dim, val]) => {
          const d = dim as InfluenceDimension;
          maxPossibles[d] = Math.max(maxPossibles[d] || 0, val as number);
        });
      };
      checkScores(currentQ.yesScores);
      checkScores(currentQ.noScores);
    } else if (currentQ.type === 'scale') {
      for (let i = 1; i <= 10; i++) {
        const mapped = currentQ.scoresMapping(i);
        Object.entries(mapped).forEach(([dim, val]) => {
          const d = dim as InfluenceDimension;
          maxPossibles[d] = Math.max(maxPossibles[d] || 0, val as number);
        });
      }
    }

    // Merge scores
    const newScores = { ...state.scores };
    const newMaxScores = { ...state.maxScores };

    Object.keys(addedScores).forEach(key => {
      const dim = key as InfluenceDimension;
      newScores[dim] = (newScores[dim] || 0) + (addedScores[dim] || 0);
    });

    Object.keys(maxPossibles).forEach(key => {
      const dim = key as InfluenceDimension;
      newMaxScores[dim] = (newMaxScores[dim] || 0) + (maxPossibles[dim] || 0);
    });

    const newHistory = [...state.answerHistory, { questionId: currentQ.id, answer: answerValue, addedScores }];

    let nextQuestions = [...state.activeQuestions];
    let nextPool = [...state.unaskedQuestions];
    let isFinished = false;

    // Determine if we need to add a question. We aim for 15 questions total.
    if (nextQuestions.length < 15) {
       // We still need more questions. Pick one adaptively and add to activeQuestions.
       const nextQ = findNextAdaptiveQuestion(nextPool, newScores, state.gender, nextQuestions);
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
      maxScores: newMaxScores,
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
    maxScores: { ...initialScores },
    answerHistory: [],
    isFinished: false,
    selectedCategories: [],
    gender: null
  }),
  
  aiSettings: {
    apiKey: localStorage.getItem('ai_api_key') || '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',
    model: 'openai/gpt-4o-mini',
    isRemembered: true // Default to true so the key is ready to use
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
