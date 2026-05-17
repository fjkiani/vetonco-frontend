import { ExternalLink, Copy } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";
import type { CompoundData } from "../../types/api";

const achievabilityConfig = {
  ACHIEVABLE: { variant: "success" as const, label: "Achievable" },
  MARGINAL: { variant: "warning" as const, label: "Marginal" },
  UNACHIEVABLE: { variant: "danger" as const, label: "Unachievable" },
  UNKNOWN: { variant: "muted" as const, label: "Unknown" },
};

function GapBar({ ratio }: { ratio: number | null }) {
  if (ratio === null) return <span className="text-xs text-gray-400">N/A</span>;
  const pct = Math.min(ratio * 100, 100);
  const color = ratio < 0.1 ? "bg-green-500" : ratio < 0.5 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-gray-600 w-10 text-right">{ratio.toFixed(2)}</span>
    </div>
  );
}

interface CompoundCardProps {
  compound: CompoundData;
}

export function CompoundCard({ compound: c }: CompoundCardProps) {
  const ach = achievabilityConfig[c.achievability] ?? achievabilityConfig.UNKNOWN;

  const copySmiles = () => {
    if (c.smiles) navigator.clipboard.writeText(c.smiles);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 capitalize">{c.drug}</h3>
          {c.chembl_id && (
            <a
              href={`https://www.ebi.ac.uk/chembl/compound_report_card/${c.chembl_id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5"
            >
              {c.chembl_id} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <Badge variant={ach.variant}>{ach.label}</Badge>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-400">Mol. Weight</p>
          <p className="text-sm font-mono text-gray-800">{c.mw ? `${c.mw.toFixed(1)} Da` : "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">IC₅₀</p>
          <p className="text-sm font-mono text-gray-800">{c.ic50_nm != null ? `${c.ic50_nm} nM` : "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Cmax</p>
          <p className="text-sm font-mono text-gray-800">{c.cmax_nm != null ? `${c.cmax_nm} nM` : "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Gap Ratio</p>
          <GapBar ratio={c.gap_ratio} />
        </div>
      </div>

      {/* SMILES */}
      {c.smiles && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">SMILES</p>
            <button onClick={copySmiles} className="text-gray-400 hover:text-gray-600">
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <p className="text-xs font-mono text-gray-600 truncate">{c.smiles}</p>
        </div>
      )}
    </div>
  );
}
