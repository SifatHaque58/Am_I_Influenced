export type Category = 
  | 'Fashion' 
  | 'Beauty / Makeup' 
  | 'Shopping' 
  | 'Food / Diet' 
  | 'Books / Reading' 
  | 'Fitness / Wellness' 
  | 'Entertainment' 
  | 'Social Media' 
  | 'General Lifestyle';

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

export type QuestionType = 'multiple_choice' | 'scale' | 'yes_no' | 'ranking';

export interface AnswerOption {
  text: string;
  scores: Partial<Record<InfluenceDimension, number>>;
}

export interface BaseQuestion {
  id: string;
  category: Category | 'General';
  text: string;
  type: QuestionType;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: AnswerOption[];
}

export interface ScaleQuestion extends BaseQuestion {
  type: 'scale';
  minLabel: string;
  maxLabel: string;
  scoresMapping: (value: number) => Partial<Record<InfluenceDimension, number>>;
}

export interface YesNoQuestion extends BaseQuestion {
  type: 'yes_no';
  yesScores: Partial<Record<InfluenceDimension, number>>;
  noScores: Partial<Record<InfluenceDimension, number>>;
}

export type Question = MultipleChoiceQuestion | ScaleQuestion | YesNoQuestion;

export interface DimensionScores {
  social: number;
  algorithmic: number;
  advertising: number;
  peer: number;
  status: number;
  insecurity: number;
  habitual: number;
  cultural: number;
  practical: number;
  independent: number;
}
