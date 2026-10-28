export type QuestionType = 'choice' | 'yes_no' | 'score' | 'box';

export interface QuestionOption {
  label: string;
  description: string;
}

export interface QuestionConfig {
  id: string;
  type: QuestionType;
  question: string;
  key: string;
  options: QuestionOption[];
  score_min?: number;
  score_max?: number;
}

export interface JudgmentOutput {
  question_id: string;
  question_key: string;
  type: QuestionType;
  verdict: string;
  confidence: number;
  score_value?: number;
  bounding_box?: number[];
  probabilities?: Record<string, number>;
  distribution?: Record<string, number>;
  explanation?: string;
}

export interface BenchmarkMetrics {
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  is_live_api?: boolean;
}

export interface ComparisonDelta {
  speedup_ratio: number;
  token_savings_percent: number;
  cost_savings_percent: number;
}

export interface ModelResult {
  model_name: string;
  model_type: string;
  metrics: BenchmarkMetrics;
  judgments: JudgmentOutput[];
  raw_output?: string;
  error?: string;
}

export interface EvaluationResponse {
  jev_result: ModelResult;
  llm_result?: ModelResult;
  comparison_delta?: ComparisonDelta;
}

export interface Preset {
  id: string;
  title: string;
  description: string;
  text_to_judge: string;
  questions: QuestionConfig[];
  version_tag?: string;
  category?: string;
  has_image?: boolean;
  image_url?: string;
}
