import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Pill, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { DrugRecommendation } from "../../types/api";

const tierConfig = {
  A: { variant: "success" as const, label: "Tier A" },
  B: { variant: "info" as const, label: "Tier B" },
  C: { variant: "muted" as const, label: "Tier C" },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : pct >= 30 ? "bg-yellow-500" : "bg-gray-300";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

interface DrugRankingCardProps {
  drug: DrugRecommendation;
  rank: number;
  onDose?: (drug: string) => void;
}

export function DrugRankingCard({ drug, rank, onDose }: DrugRankingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tier = tierConfig[drug.tier] ?? tierConfig.C;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600">
            #{rank}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">{drug.drug}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <Badge variant={tier.variant}>{tier.label}</Badge>
              {drug.braf_required && <Badge variant="warning">BRAF required</Badge>}
              {drug.braf_preferred && !drug.braf_required && <Badge variant="outline">BRAF preferred</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDose && (
            <Button size="sm" variant="outline" icon={<Pill className="h-3 w-3" />} onClick={() => onDose(drug.drug)}>
              Dose
            </Button>
          )}
          <button onClick={() => setExpanded((e) => !e)} className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Fit Score</span>
        </div>
        <ScoreBar score={drug.fit_score} />
      </div>

      {/* Targets */}
      {drug.targets.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {drug.targets.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Rationale (expandable) */}
      {expanded && (
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Scoring Rationale</p>
            <p className="text-sm text-gray-700">{drug.rationale}</p>
          </div>
          {drug.llm_rationale && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">AI Rationale</p>
              <p className="text-sm text-gray-700 italic">{drug.llm_rationale}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
