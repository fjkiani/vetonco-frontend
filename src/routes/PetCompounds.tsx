import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { FlaskConical, Play } from "lucide-react";
import { Button } from "../components/ui/Button";
import { CompoundCard } from "../components/compound/CompoundCard";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import { normalizeCompound } from "../lib/utils";
import type { CompoundData } from "../types/api";

// Standard TCC drug panel — used when no agent run is available
const STANDARD_PANEL = ["toceranib", "piroxicam", "mitoxantrone", "vinblastine", "carboplatin"];

export function PetCompounds() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  // Select raw state — never call functions inside selectors
  const pets = useStore((s) => s.pets);
  const activeRun = useStore((s) => s.activeRun);

  const pet = pets.find((p) => p.id === id);

  const [manualCompounds, setManualCompounds] = useState<CompoundData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  // If the active agent run belongs to this pet and has chembl_data, use it directly
  const agentCompounds: CompoundData[] =
    activeRun.petId === id && activeRun.result?.chembl_data?.length
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (activeRun.result.chembl_data as any[]).map(normalizeCompound)
      : [];

  // Displayed compounds: prefer agent results, fall back to manually fetched
  const compounds = agentCompounds.length > 0 ? agentCompounds : manualCompounds;
  const source = agentCompounds.length > 0 ? "agent" : manualCompounds.length > 0 ? "manual" : "none";

  const handleFetchStandard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      // Backend expects { drugs: string[] }
      const data = await api.compounds({ drugs: STANDARD_PANEL }, token) as { compounds: unknown[] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setManualCompounds((data.compounds ?? []).map((c: any) => normalizeCompound(c)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch compounds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compounds</h1>
          <p className="text-gray-500 mt-1">
            {pet.name} · ChEMBL enrichment
            {source === "agent" && (
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                from agent run
              </span>
            )}
            {source === "manual" && (
              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                standard panel
              </span>
            )}
          </p>
        </div>
        {source !== "agent" && (
          <Button
            icon={<FlaskConical className="h-4 w-4" />}
            loading={loading}
            onClick={handleFetchStandard}
            variant={source === "manual" ? "outline" : "primary"}
          >
            {source === "manual" ? "Refresh" : "Load Standard Panel"}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* No data yet — prompt to run agent or load standard panel */}
      {source === "none" && !loading && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center space-y-4">
          <FlaskConical className="h-12 w-12 text-gray-300 mx-auto" />
          <div>
            <p className="text-gray-700 font-medium">No compound data yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Run the agent analysis to get personalized ChEMBL enrichment for {pet.name}.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link to={`/pets/${id}/analyze`}>
              <Button icon={<Play className="h-4 w-4" />}>Run Agent Analysis</Button>
            </Link>
            <Button variant="outline" icon={<FlaskConical className="h-4 w-4" />} loading={loading} onClick={handleFetchStandard}>
              Load Standard Panel
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Standard panel: {STANDARD_PANEL.join(", ")}
          </p>
        </div>
      )}

      {/* Compound grid */}
      {compounds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {compounds.map((c) => (
            <CompoundCard key={c.drug} compound={c} />
          ))}
        </div>
      )}
    </div>
  );
}
