import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../components/ui/Button";
import { TestAnalysisPanel } from "../components/tests/TestAnalysisPanel";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import type { TestAnalysisResult } from "../types/api";
import type { TestSession } from "../types/agent";

const TEST_TYPES = ["CBC", "Chemistry", "Urinalysis", "Imaging", "BRAF"];

export function TestNew() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const pets = useStore((s) => s.pets);
  const pet = pets.find((p) => p.id === id);
  const addTestSession = useStore((s) => s.addTestSession);

  const [testType, setTestType] = useState("CBC");
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  const CBC_FIELDS = [
    { key: "anc", label: "ANC (×10³/μL)" },
    { key: "hgb", label: "Hemoglobin (g/dL)" },
    { key: "plt", label: "Platelets (×10³/μL)" },
    { key: "wbc", label: "WBC (×10³/μL)" },
  ];

  const CHEM_FIELDS = [
    { key: "creatinine", label: "Creatinine (mg/dL)" },
    { key: "alt", label: "ALT (U/L)" },
    { key: "bun", label: "BUN (mg/dL)" },
    { key: "albumin", label: "Albumin (g/dL)" },
  ];

  const IMAGING_FIELDS = [
    { key: "tumor_size_cm", label: "Tumor Size (cm)" },
  ];

  const fields =
    testType === "CBC" ? CBC_FIELDS :
    testType === "Chemistry" ? CHEM_FIELDS :
    testType === "Imaging" ? IMAGING_FIELDS : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const numericValues: Record<string, number> = {};
      for (const [k, v] of Object.entries(values)) {
        const n = parseFloat(v);
        if (!isNaN(n)) numericValues[k] = n;
      }

      const body = {
        pet_name: pet.name,
        breed: pet.breed,
        weight_kg: pet.weight_kg,
        test_type: testType,
        values: numericValues,
        notes,
      };

      const analysisResult = await api.analyzeTest(body, token) as TestAnalysisResult;
      setResult(analysisResult);

      // Save to store
      const session: TestSession = {
        session_id: uuidv4(),
        date: new Date().toISOString(),
        test_type: testType,
        values: numericValues,
        notes,
        analysis: analysisResult,
      };
      addTestSession(pet.id, session);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze test");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log Test</h1>
        <p className="text-gray-500 mt-1">{pet.name} · {pet.breed}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
          <div className="flex flex-wrap gap-2">
            {TEST_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTestType(t); setValues({}); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  testType === t
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {fields.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <input
                  className={inputCls}
                  type="number"
                  step="0.01"
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  placeholder="—"
                />
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Clinical observations..."
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>Analyze & Save</Button>
          <Button type="button" variant="outline" onClick={() => navigate(`/pets/${id}/tests`)}>Cancel</Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {result && <TestAnalysisPanel result={result} />}
    </div>
  );
}
