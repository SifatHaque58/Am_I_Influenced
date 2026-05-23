import { create } from 'zustand';
import type { Category, Question, InfluenceDimension, Gender, GenderProfile, Observation, EngineScores } from '../types';
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
    typicalDominant: ['status', 'algorithmic', 'habitual', 'advertising']
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

const ALL_DIMENSIONS: InfluenceDimension[] = [
  'social', 'algorithmic', 'advertising', 'peer', 'status', 'insecurity', 'habitual', 'cultural', 'practical', 'independent'
];

interface AppState {
  // Setup
  selectedCategories: Category[];
  toggleCategory: (category: Category) => void;
  gender: Gender;
  setGender: (gender: Gender) => void;
  age: string;
  setAge: (age: string) => void;
  startQuiz: () => void;
  
  // Quiz State
  currentQuestionIndex: number;
  activeQuestions: Question[];
  unaskedQuestions: Question[];
  
  observations: Record<InfluenceDimension, Observation[]>;
  engineScores: EngineScores;
  
  answerHistory: Array<{ questionId: string; answer: unknown }>;
  isFinished: boolean;
  targetQuestionCount: number;
  
  // Actions
  answerQuestion: (answerValue: unknown) => void;
  resetQuiz: () => void;
  improveConfidence: () => void;
}

const emptyObservations = (): Record<InfluenceDimension, Observation[]> => {
  const obs: Partial<Record<InfluenceDimension, Observation[]>> = {};
  ALL_DIMENSIONS.forEach(d => obs[d] = []);
  return obs as Record<InfluenceDimension, Observation[]>;
};

const calcScores = (obsRecord: Record<InfluenceDimension, Observation[]>): EngineScores => {
  const result = {} as EngineScores;
  
  ALL_DIMENSIONS.forEach(dim => {
    const obs = obsRecord[dim] || [];
    let sumVW = 0;
    let sumW = 0;
    
    obs.forEach(o => {
      sumVW += o.value * o.weight;
      sumW += o.weight;
    });
    
    const mean = sumW > 0 ? sumVW / sumW : null;
    
    let variance = 0;
    if (mean !== null && sumW > 0) {
      let sumVar = 0;
      obs.forEach(o => {
        sumVar += o.weight * Math.pow(o.value - mean, 2);
      });
      variance = sumVar / sumW;
    }
    
    const info = 1 - Math.exp(-sumW / 2.0);
    // Variance penalty fades out as sample size increases (Law of Large Numbers).
    // This allows confidence to correctly scale to 90%+ when many questions are answered, 
    // even if the user has natural human variance.
    const penalty = (4 * variance) * Math.exp(-sumW / 5.0);
    const consistency = Math.max(0, 1 - penalty);
    const confidence = Math.max(0, Math.min(1, info * consistency));
    
    result[dim] = {
      mean,
      count: obs.length,
      variance,
      consistency,
      confidence
    };
  });
  
  return result;
};

const SHUFFLE = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const selectInitialQuestions = (categories: Category[]): { initial: Question[], pool: Question[] } => {
  const generalPool = questionBank.filter(q => q.category === 'General');
  
  let primaryPool: Question[] = [];
  
  if (categories.length > 0) {
    primaryPool = questionBank.filter(q => q.category !== 'General' && categories.includes(q.category as Category));
  } else {
    primaryPool = questionBank.filter(q => q.category !== 'General');
  }
  
  const allPool = [...SHUFFLE(generalPool), ...SHUFFLE(primaryPool)];
  
  return {
    initial: allPool.slice(0, 5),
    pool: allPool.slice(5)
  };
};

const findNextAdaptiveQuestion = (pool: Question[], engineScores: EngineScores): Question | null => {
  if (pool.length === 0) return null;

  const need: Record<InfluenceDimension, number> = {} as any;

  ALL_DIMENSIONS.forEach(d => {
    const s = engineScores[d];
    const floorBoost = s.count < 2 ? 2 : 0;
    need[d] = floorBoost + (1 - s.confidence);
  });

  let bestScore = -1;
  let candidates: Question[] = [];

  pool.forEach(q => {
    let qDims = new Set<InfluenceDimension>();
    if (q.type === 'graded' || q.type === 'binary') {
      Object.keys(q.loads || {}).forEach(k => qDims.add(k as InfluenceDimension));
    } else if (q.type === 'mc') {
      q.options.forEach(opt => {
        Object.keys(opt.loads || {}).forEach(k => qDims.add(k as InfluenceDimension));
      });
    }

    let candidateScore = 0;
    qDims.forEach(d => {
      candidateScore += need[d];
    });

    if (candidateScore > bestScore) {
      bestScore = candidateScore;
      candidates = [q];
    } else if (candidateScore === bestScore) {
      candidates.push(q);
    }
  });

  if (candidates.length > 0) {
    return SHUFFLE(candidates)[0];
  }

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

  age: '',
  setAge: (age) => set({ age }),

  currentQuestionIndex: 0,
  activeQuestions: [],
  unaskedQuestions: [],
  observations: emptyObservations(),
  engineScores: calcScores(emptyObservations()),
  answerHistory: [],
  isFinished: false,
  targetQuestionCount: 15,
  
  startQuiz: () => {
    const categories = get().selectedCategories;
    const { initial, pool } = selectInitialQuestions(categories);
    const obs = emptyObservations();
    set({
      activeQuestions: initial,
      unaskedQuestions: pool,
      currentQuestionIndex: 0,
      observations: obs,
      engineScores: calcScores(obs),
      answerHistory: [],
      isFinished: false,
      targetQuestionCount: 15
    });
  },
  
  answerQuestion: (answerValue) => set((state) => {
    const currentQ = state.activeQuestions[state.currentQuestionIndex];
    const newObs = JSON.parse(JSON.stringify(state.observations)) as Record<InfluenceDimension, Observation[]>;
    
    const emit = (dim: InfluenceDimension, value: number, weight: number) => {
      if (!newObs[dim]) newObs[dim] = [];
      newObs[dim].push({ value, weight });
    };

    if (currentQ.type === 'graded') {
      const a = Math.max(0, Math.min(1, ((answerValue as number) - 1) / 4));
      Object.entries(currentQ.loads || {}).forEach(([d, w]) => {
        const dim = d as InfluenceDimension;
        const value = currentQ.reverse?.includes(dim) ? (1 - a) : a;
        emit(dim, value, w as number);
      });
    } else if (currentQ.type === 'binary') {
      const a = (answerValue as boolean) ? 1 : 0;
      Object.entries(currentQ.loads || {}).forEach(([d, w]) => {
        const dim = d as InfluenceDimension;
        const value = currentQ.reverse?.includes(dim) ? (1 - a) : a;
        emit(dim, value, (w as number) * 0.5);
      });
    } else if (currentQ.type === 'mc') {
      const selectedOpt = currentQ.options[answerValue as number];
      if (selectedOpt && selectedOpt.loads) {
        let peak = 0;
        Object.values(selectedOpt.loads).forEach(v => {
          if (v && (v as number) > peak) peak = v as number;
        });
        if (peak > 0) {
          Object.entries(selectedOpt.loads).forEach(([d, w]) => {
            const dim = d as InfluenceDimension;
            emit(dim, (w as number) / peak, 1.0);
          });
        }
      }
    }

    const newEngineScores = calcScores(newObs);
    const newHistory = [...state.answerHistory, { questionId: currentQ.id, answer: answerValue }];

    let nextQuestions = [...state.activeQuestions];
    let nextPool = [...state.unaskedQuestions];
    let isFinished = false;

    if (nextQuestions.length < state.targetQuestionCount) {
       const nextQ = findNextAdaptiveQuestion(nextPool, newEngineScores);
       if (nextQ) {
         nextQuestions.push(nextQ);
         nextPool = nextPool.filter(q => q.id !== nextQ.id);
       } else {
         if (state.currentQuestionIndex >= nextQuestions.length - 1) {
            isFinished = true;
         }
       }
    } else if (state.currentQuestionIndex >= nextQuestions.length - 1) {
        isFinished = true;
    }
    
    return {
      observations: newObs,
      engineScores: newEngineScores,
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
    observations: emptyObservations(),
    engineScores: calcScores(emptyObservations()),
    answerHistory: [],
    isFinished: false,
    targetQuestionCount: 15,
    selectedCategories: [],
    gender: null,
    age: ''
  }),

  improveConfidence: () => set((state) => {
    let nextQuestions = [...state.activeQuestions];
    let nextPool = [...state.unaskedQuestions];
    const newTarget = state.targetQuestionCount + 5;
    
    if (nextPool.length > 0) {
      const nextQ = findNextAdaptiveQuestion(nextPool, state.engineScores);
      if (nextQ) {
        nextQuestions.push(nextQ);
        nextPool = nextPool.filter(q => q.id !== nextQ.id);
      }
    }
    
    return {
      targetQuestionCount: newTarget,
      activeQuestions: nextQuestions,
      unaskedQuestions: nextPool,
      isFinished: false,
      currentQuestionIndex: state.activeQuestions.length // Jump to the new question
    };
  })
}));
