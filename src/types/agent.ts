import type { TCCResult, DoseResult, RecipeCard, TestAnalysisResult } from "./api";

export interface TraceEvent {
  node: string;
  status: "running" | "ok" | "error" | "skipped";
  started_at: number;
  finished_at: number;
  duration_ms: number;
  summary: string;
  output_preview: Record<string, unknown>;
  error?: string | null;
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

export interface AgentRunResult {
  pet_name: string;
  breed: string;
  braf_status: string;
  score_result: TCCResult;
  chembl_data: CompoundData[];
  dosage_data: DoseResult[];
  recipe_data: RecipeCard;
  rationale_text: string;
  pipeline_summary: string;
  trace: TraceEvent[];
  errors: string[];
  complete: boolean;
}

export interface MonitoringAlert {
  alert_id: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  parameter: string;
  trend: "worsening" | "improving" | "stable";
  message: string;
  action: string;
  drug_implicated?: string | null;
}

export interface MonitoringResult {
  pet_id: string;
  pet_name: string;
  trend_analysis: Record<string, {
    test_type: string;
    values: number[];
    slope: number;
    trend: string;
    latest: number;
    severity: string;
    n_readings: number;
  }>;
  alerts: MonitoringAlert[];
  monitoring_summary: string | null;
  trace: TraceEvent[];
  has_critical: boolean;
}

export interface TestSession {
  session_id: string;
  date: string;
  test_type: string;
  values: Record<string, number>;
  notes?: string;
  analysis?: TestAnalysisResult;
}
