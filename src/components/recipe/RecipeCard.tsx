import { Printer, Dog } from "lucide-react";
import { Button } from "../ui/Button";
import type { RecipeCard as RecipeCardType } from "../../types/api";

interface RecipeCardProps {
  recipe: RecipeCardType;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const handlePrint = () => window.print();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Dog className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{recipe.pet_name}</h2>
            <p className="text-sm text-gray-500">{recipe.breed} · {recipe.weight_kg} kg</p>
          </div>
        </div>
        <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
          Print
        </Button>
      </div>

      {/* Meta */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex gap-6 text-sm">
        <div>
          <span className="text-gray-400">Prescribing Vet:</span>{" "}
          <span className="font-medium text-gray-800">{recipe.prescribing_vet}</span>
        </div>
        <div>
          <span className="text-gray-400">Date:</span>{" "}
          <span className="font-medium text-gray-800">{recipe.date}</span>
        </div>
      </div>

      {/* Drug table */}
      <div className="px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Prescribed Medications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Drug</th>
                <th className="pb-2 font-medium">Dose</th>
                <th className="pb-2 font-medium">Frequency</th>
                <th className="pb-2 font-medium">Route</th>
                <th className="pb-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recipe.drugs.map((drug, i) => (
                <tr key={i} className="py-2">
                  <td className="py-2 font-medium text-gray-900 capitalize">{drug.drug}</td>
                  <td className="py-2 text-gray-700">{drug.dose_mg} mg</td>
                  <td className="py-2 text-gray-700">{drug.frequency}</td>
                  <td className="py-2 text-gray-700">{drug.route}</td>
                  <td className="py-2 text-gray-700">{drug.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring schedule */}
      {recipe.monitoring_schedule.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Monitoring Schedule</h3>
          <ul className="space-y-1">
            {recipe.monitoring_schedule.map((item, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {recipe.notes && (
        <div className="px-6 py-4 border-t border-gray-100 bg-yellow-50 rounded-b-xl">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">Clinical Notes</h3>
          <p className="text-sm text-yellow-700">{recipe.notes}</p>
        </div>
      )}
    </div>
  );
}
