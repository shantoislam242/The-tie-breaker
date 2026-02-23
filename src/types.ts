export enum AnalysisType {
  PROS_CONS = "PROS_CONS",
  COMPARISON = "COMPARISON",
  SWOT = "SWOT",
}

export interface ProsConsData {
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface ComparisonEntry {
  option: string;
  criterion: string;
  value: string;
}

export interface ComparisonData {
  options: string[];
  criteria: string[];
  entries: ComparisonEntry[];
  verdict: string;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  verdict: string;
}

export type AnalysisResult = 
  | { type: AnalysisType.PROS_CONS; data: ProsConsData }
  | { type: AnalysisType.COMPARISON; data: ComparisonData }
  | { type: AnalysisType.SWOT; data: SWOTData };
