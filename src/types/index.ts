export type Category = 
  | 'Fashion' 
  | 'Beauty / Makeup' 
  | 'Shopping' 
  | 'Food / Diet' 
  | 'Books / Reading' 
  | 'Fitness / Wellness' 
  | 'Entertainment' 
  | 'Social Media' 
  | 'General Lifestyle'
  | 'General';

export type InfluenceDimension = 
  | 'social'
  | 'algorithmic'
  | 'advertising'
  | 'peer'
  | 'status'
  | 'insecurity'
  | 'habitual'
  | 'cultural'
  | 'practical'
  | 'independent';

export type QuestionType = 'mc' | 'graded' | 'binary';

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null;

export interface AnswerOption {
  text: string;
  loads: Partial<Record<InfluenceDimension, number>>;
}

export interface BaseQuestion {
  id: string;
  category: Category | 'General';
  text: string;
  type: QuestionType;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'mc';
  options: AnswerOption[];
}

export interface GradedQuestion extends BaseQuestion {
  type: 'graded';
  loads: Partial<Record<InfluenceDimension, number>>;
  reverse?: InfluenceDimension[];
  // All graded questions are strictly 1..5 scale
}

export interface BinaryQuestion extends BaseQuestion {
  type: 'binary';
  loads: Partial<Record<InfluenceDimension, number>>;
  reverse?: InfluenceDimension[];
}

export type Question = MultipleChoiceQuestion | GradedQuestion | BinaryQuestion;

export interface Observation {
  value: number;
  weight: number;
}

export interface DimensionScoreResult {
  mean: number | null;
  count: number;
  variance: number;
  consistency: number;
  confidence: number;
}

export type EngineScores = Record<InfluenceDimension, DimensionScoreResult>;

// We still keep DimensionScores for simpler numeric passing to UI/Charts
export type DimensionScores = Record<InfluenceDimension, number>;

export interface GenderProfile {
  means: DimensionScores;
  stdDevs: DimensionScores;
  typicalDominant: InfluenceDimension[];
}
