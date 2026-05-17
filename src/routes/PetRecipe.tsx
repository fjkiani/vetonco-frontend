import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ClipboardList } from "lucide-react";
import { Button } from "../components/ui/Button";
import { RecipeCard } from "../components/recipe/RecipeCard";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import { normalizeRecipe } from "../lib/utils";
import type { RecipeCard as RecipeCardType } from "../types/api";

// Standard TCC drug panel for recipe generation when no agent run is available
const STANDARD_DRUGS = ["toceranib", "piroxicam", "mitoxantrone"];

export function PetRecipe() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  // Select raw state — never call functions inside selectors
  const pets = useStore((s) => s.pets);
  const activeRun = useStore((s) => s.activeRun);

  const pet = pets.find((p) => p.id === id);

  const [recipe, setRecipe] = useState<RecipeCardType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  // If agent ran for this pet, use its recipe directly (already normalized)
  const agentRecipe: RecipeCardType | null =
    activeRun.petId === id && activeRun.result?.recipe_data
      ? normalizeRecipe(activeRun.result.recipe_data)
      : null;

  const displayRecipe = agentRecipe ?? recipe;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      // Determine drug list: from agent run or standard panel
      const drugs =
        activeRun.petId === id && activeRun.result?.dosage_data?.length
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (activeRun.result.dosage_data as any[]).map((d: any) => d.drug).filter(Boolean)
          : STANDARD_DRUGS;

      // Backend RecipeRequest: { pet_name, species, breed, weight_kg, prescribing_vet, drugs, creatinine_mg_dl?, alt_u_l? }
      const raw = await api.recipe(
        {
          pet_name: pet.name,
          species: "Canis lupus familiaris",
          breed: pet.breed,
          weight_kg: pet.weight_kg,
          prescribing_vet: pet.prescribing_vet ?? "VetOnco System",
          drugs,
          creatinine_mg_dl: pet.creatinine_mg_dl ?? null,
          alt_u_l: pet.alt_u_l ?? null,
        },
        token
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRecipe(normalizeRecipe(raw as any));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescription Recipe</h1>
          <p className="text-gray-500 mt-1">
            {pet.name} · {pet.breed}
            {agentRecipe && (
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                from agent run
              </span>
            )}
          </p>
        </div>
        <Button icon={<ClipboardList className="h-4 w-4" />} loading={loading} onClick={handleGenerate}>
          {displayRecipe ? "Regenerate" : "Generate Recipe"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {!displayRecipe && !loading && (
        <div className="text-center py-16 rounded-xl border-2 border-dashed border-gray-200">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Click "Generate Recipe" to create a printable prescription</p>
        </div>
      )}

      {displayRecipe && <RecipeCard recipe={displayRecipe} />}
    </div>
  );
}
