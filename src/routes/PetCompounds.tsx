import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { FlaskConical } from "lucide-react";
import { Button } from "../components/ui/Button";
import { CompoundCard } from "../components/compound/CompoundCard";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import type { CompoundData } from "../types/api";

export function PetCompounds() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const pet = useStore((s) => s.getPet(id!));
  const [compounds, setCompounds] = useState<CompoundData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await api.compounds(
        { breed: pet.breed, braf_status: pet.braf_status, msh2_loss: pet.msh2_loss, expr: {} },
        token
      ) as { compounds: CompoundData[] };
      setCompounds(data.compounds ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch compounds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compounds</h1>
          <p className="text-gray-500 mt-1">{pet.name} · ChEMBL enrichment</p>
        </div>
        <Button icon={<FlaskConical className="h-4 w-4" />} loading={loading} onClick={handleFetch}>
          {compounds.length > 0 ? "Refresh" : "Fetch Compounds"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {compounds.length === 0 && !loading && (
        <div className="text-center py-16 rounded-xl border-2 border-dashed border-gray-200">
          <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Click "Fetch Compounds" to load ChEMBL data</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {compounds.map((c) => (
          <CompoundCard key={c.drug} compound={c} />
        ))}
      </div>
    </div>
  );
}
