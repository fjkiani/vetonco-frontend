/** All API response types from vetonco-backend */

export interface TCCResult {
  subtype: string;
  braf_status: string;
  msh2_loss: boolean;
  ranked_drugs: DrugRecommendation[];
  quarantine_drugs: string[];
  rationale: string;
  confidence: number;
}

export interface DrugRecommendation {
  drug: string;
  rank: number;
  fit_score: number;
  tier: "A" | "B" | "C";
  targets: string[];
  braf_required: boolean;
  braf_preferred: boolean;
  rationale: string;
  llm_rationale?: string;
}

export interface CompoundData {
  drug: string;
  chembl_id: string;
  mw: number;
  ic50_nm: number | null;
  cmax_nm: number | null;
  gap_ratio: number | null;
  achievability: "ACHIEVABLE" | "MARGINAL" | "UNACHIEVABLE" | "UNKNOWN";
  smiles: string | null;
}

export interface DoseResult {
  drug: string;
  weight_kg: number;
  dose_mg: number;
  dose_mg_per_kg: number;
  frequency: string;
  route: string;
  adjustments: string[];
  hold: boolean;
  hold_reason: string | null;
}

export interface RecipeCard {
  pet_name: string;
  breed: string;
  weight_kg: number;
  prescribing_vet: string;
  date: string;
  drugs: RecipeDrug[];
  monitoring_schedule: string[];
  notes: string;
}

export interface RecipeDrug {
  drug: string;
  dose_mg: number;
  frequency: string;
  route: string;
  duration: string;
}

export interface TestAnalysisResult {
  test_type: string;
  vcog_grades: Record<string, number>;
  alerts: TestAlert[];
  narrative: string;
}

export interface TestAlert {
  parameter: string;
  value: number;
  grade: number;
  severity: string;
  action: string;
}

export interface TrendData {
  parameter: string;
  values: number[];
  dates: string[];
  slope: number;
  trend: "improving" | "stable" | "worsening";
}
