import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../components/ui/Button";
import { useStore } from "../lib/store";
import { COMMON_BREEDS, BRAF_STATUS_LABELS } from "../types/pet";
import type { Pet, BRAFStatus } from "../types/pet";

export function PetNew() {
  const navigate = useNavigate();
  const addPet = useStore((s) => s.addPet);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    weight_kg: "",
    age_years: "",
    braf_status: "unknown" as BRAFStatus,
    msh2_loss: false,
    prescribing_vet: "",
    creatinine_mg_dl: "",
    alt_u_l: "",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pet: Pet = {
      id: uuidv4(),
      name: form.name,
      breed: form.breed,
      weight_kg: parseFloat(form.weight_kg),
      age_years: form.age_years ? parseFloat(form.age_years) : undefined,
      braf_status: form.braf_status,
      msh2_loss: form.msh2_loss,
      prescribing_vet: form.prescribing_vet,
      creatinine_mg_dl: form.creatinine_mg_dl ? parseFloat(form.creatinine_mg_dl) : undefined,
      alt_u_l: form.alt_u_l ? parseFloat(form.alt_u_l) : undefined,
      created_at: new Date().toISOString(),
    };
    addPet(pet);
    navigate(`/pets/${pet.id}`);
  };

  const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Patient</h1>
        <p className="text-gray-500 mt-1">Enter the dog's clinical profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Patient Name *</label>
            <input className={inputCls} required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Buddy" />
          </div>
          <div>
            <label className={labelCls}>Prescribing Vet</label>
            <input className={inputCls} value={form.prescribing_vet} onChange={(e) => set("prescribing_vet", e.target.value)} placeholder="Dr. Smith" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Breed *</label>
          <select className={inputCls} required value={form.breed} onChange={(e) => set("breed", e.target.value)}>
            <option value="">Select breed</option>
            {COMMON_BREEDS.map((b) => <option key={b} value={b}>{b}</option>)}
            <option value="Mixed">Mixed / Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Weight (kg) *</label>
            <input className={inputCls} type="number" step="0.1" min="1" max="80" required value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} placeholder="e.g. 25" />
          </div>
          <div>
            <label className={labelCls}>Age (years)</label>
            <input className={inputCls} type="number" step="0.5" min="0" max="20" value={form.age_years} onChange={(e) => set("age_years", e.target.value)} placeholder="e.g. 8" />
          </div>
        </div>

        <div>
          <label className={labelCls}>BRAF Status</label>
          <select className={inputCls} value={form.braf_status} onChange={(e) => set("braf_status", e.target.value)}>
            {Object.entries(BRAF_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="msh2"
            checked={form.msh2_loss}
            onChange={(e) => set("msh2_loss", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="msh2" className="text-sm text-gray-700">MSH2 loss detected</label>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Lab Values (optional)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Creatinine (mg/dL)</label>
              <input className={inputCls} type="number" step="0.01" value={form.creatinine_mg_dl} onChange={(e) => set("creatinine_mg_dl", e.target.value)} placeholder="e.g. 1.2" />
            </div>
            <div>
              <label className={labelCls}>ALT (U/L)</label>
              <input className={inputCls} type="number" step="1" value={form.alt_u_l} onChange={(e) => set("alt_u_l", e.target.value)} placeholder="e.g. 45" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">Create Patient</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
