import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Pill } from "lucide-react";
import { Button } from "../components/ui/Button";
import { DosageCard } from "../components/dosage/DosageCard";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import { normalizeDose } from "../lib/utils";
import type { DoseResult } from "../types/api";

export function PetDosage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  // Select raw state — never call functions inside selectors
  const pets = useStore((s) => s.pets);
  const activeRun = useStore((s) => s.activeRun);

  const pet = pets.find((p) => p.id === id);

  const [manualDoses, setManualDoses] = useState<DoseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable weight override
  const [weight, setWeight] = useState(pet?.weight_kg?.toString() ?? "");
  const [creatinine, setCreatinine] = useState(pet?.creatinine_mg_dl?.toString() ?? "");
  const [alt, setAlt] = useState(pet?.alt_u_l?.toString() ?? "");

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  // If the active agent run belongs to this pet and has dosage_data, use it directly
  const agentDoses: DoseResult[] =
    activeRun.petId === id && activeRun.result?.dosage_data?.length
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (activeRun.result.dosage_data as any[]).map(normalizeDose)
      : [];

  const doses = agentDoses.length > 0 ? agentDoses : manualDoses;
  const source = agentDoses.length > 0 ? "agent" : manualDoses.length > 0 ? "manual" : "none";

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      // Backend returns { dosages: [...] } (not doses)
      const data = await api.dosagePanel(
        {
          weight_kg: parseFloat(weight) || pet.weight_kg,
          creatinine_mg_dl: creatinine ? parseFloat(creatinine) : null,
          alt_u_l: alt ? parseFloat(alt) : null,
          // No drugs param → backend uses full standard panel
        },
        token
      ) as { dosages: unknown[] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setManualDoses((data.dosages ?? []).map((d: any) => normalizeDose(d)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to calculate dosage");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "rounded-lg border border-gray-300 px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dosage Calculator</h1>
        <p className="text-gray-500 mt-1">
          {pet.name} · {pet.breed}
          {source === "agent" && (
            <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              from agent run
            </span>
          )}
        </p>
      </div>

      {/* Parameter inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Patient Parameters</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Weight (kg)</label>
            <input
              className={inputCls}
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Creatinine (mg/dL)</label>
            <input
              className={inputCls}
              type="number"
              step="0.01"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ALT (U/L)</label>
            <input
              className={inputCls}
              type="number"
              step="1"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="optional"
            />
          </div>
        </div>
        <Button icon={<Pill className="h-4 w-4" />} loading={loading} onClick={handleCalculate}>
          {source === "none" ? "Calculate Dosage Panel" : "Recalculate"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {doses.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Dosage Panel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doses.map((dose) => (
              <DosageCard key={dose.drug} dose={dose} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
