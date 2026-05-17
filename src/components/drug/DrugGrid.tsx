import { DrugRankingCard } from "./DrugRankingCard";
import { Badge } from "../ui/Badge";
import type { DrugRecommendation } from "../../types/api";

interface DrugGridProps {
  drugs: DrugRecommendation[];
  quarantine?: string[];
  onDose?: (drug: string) => void;
}

export function DrugGrid({ drugs, quarantine = [], onDose }: DrugGridProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {drugs.map((drug) => (
          <DrugRankingCard key={drug.drug} drug={drug} rank={drug.rank} onDose={onDose} />
        ))}
      </div>

      {quarantine.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="danger">QUARANTINE</Badge>
            <span className="text-sm font-medium text-red-800">Excluded Drugs</span>
          </div>
          <p className="text-xs text-red-600 mb-2">
            These drugs are excluded from this protocol due to insufficient evidence or safety concerns.
          </p>
          <div className="flex flex-wrap gap-2">
            {quarantine.map((d) => (
              <span
                key={d}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded capitalize line-through"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
