import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ClipboardList } from "lucide-react";
import { Button } from "../components/ui/Button";
import { RecipeCard } from "../components/recipe/RecipeCard";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import type { RecipeCard as RecipeCardType } from "../types/api";

export function PetRecipe() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const pets = useStore((s) => s.pets);
  const pet = pets.find((p) => p.id === id);
  const [recipe, setRecipe] = useState<RecipeCardType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await api.recipe(
        {
          pet_name: pet.name,
          breed: pet.breed,
          weight_kg: pet.weight_kg,
          braf_status: pet.braf_status,
          msh2_loss: pet.msh2_loss,
          expr: {},
          prescribing_vet: pet.prescribing_vet ?? "Unknown",
          creatinine_mg_dl: pet.creatinine_mg_dl ?? null,
          alt_u_l: pet.alt_u_l ?? null,
        },
        token
      ) as RecipeCardType;
      setRecipe(data);
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
          <p className="text-gray-500 mt-1">{pet.name} · {pet.breed}</p>
        </div>
        <Button icon={<ClipboardList className="h-4 w-4" />} loading={loading} onClick={handleGenerate}>
          {recipe ? "Regenerate" : "Generate Recipe"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {!recipe && !loading && (
        <div className="text-center py-16 rounded-xl border-2 border-dashed border-gray-200">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Click "Generate Recipe" to create a printable prescription</p>
        </div>
      )}

      {recipe && <RecipeCard recipe={recipe} />}
    </div>
  );
}
