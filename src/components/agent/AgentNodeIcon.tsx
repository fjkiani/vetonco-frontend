import { Dna, FlaskConical, Pill, ClipboardList, Bot, AlertCircle, Loader2 } from "lucide-react";

const NODE_ICONS: Record<string, React.ElementType> = {
  score_node: Dna,
  chembl_node: FlaskConical,
  dosing_node: Pill,
  recipe_node: ClipboardList,
  llm_node: Bot,
  error_node: AlertCircle,
  load_history_node: ClipboardList,
  trend_node: Dna,
  alert_node: AlertCircle,
  llm_summary_node: Bot,
};

const NODE_LABELS: Record<string, string> = {
  score_node: "TCC Scorer",
  chembl_node: "ChEMBL Enrichment",
  dosing_node: "Dose Calculator",
  recipe_node: "Recipe Builder",
  llm_node: "AI Rationale",
  error_node: "Error Handler",
  load_history_node: "Load History",
  trend_node: "Trend Analysis",
  alert_node: "Alert Generator",
  llm_summary_node: "AI Summary",
};

interface AgentNodeIconProps {
  node: string;
  status: "pending" | "running" | "ok" | "error" | "skipped";
  className?: string;
}

export function AgentNodeIcon({ node, status, className }: AgentNodeIconProps) {
  if (status === "running") {
    return <Loader2 className={`animate-spin ${className ?? "h-5 w-5"}`} />;
  }
  const Icon = NODE_ICONS[node] ?? Bot;
  return <Icon className={className ?? "h-5 w-5"} />;
}

export function getNodeLabel(node: string): string {
  return NODE_LABELS[node] ?? node.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
