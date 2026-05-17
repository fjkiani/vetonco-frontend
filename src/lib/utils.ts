import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CompoundData, DoseResult, RecipeCard } from "../types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatDate(ts: number | string): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function computeBSA(weight_kg: number): number {
  return parseFloat((0.101 * Math.pow(weight_kg, 0.667)).toFixed(3));
}

/**
 * Normalize a raw compound object from the backend into the frontend CompoundData shape.
 *
 * Backend ChEMBLCompound dataclass uses:
 *   name (not drug), achievable: bool (not achievability: string)
 *
 * Frontend CompoundData uses:
 *   drug, achievability: "ACHIEVABLE" | "MARGINAL" | "UNACHIEVABLE" | "UNKNOWN"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeCompound(raw: any): CompoundData {
  let achievability: CompoundData["achievability"] = "UNKNOWN";
  if (typeof raw.achievability === "string" && raw.achievability) {
    achievability = raw.achievability as CompoundData["achievability"];
  } else if (raw.achievable === true) {
    achievability = "ACHIEVABLE";
  } else if (raw.achievable === false) {
    achievability = raw.gap_ratio != null && raw.gap_ratio < 0.5 ? "MARGINAL" : "UNACHIEVABLE";
  }

  return {
    drug: raw.name ?? raw.drug ?? "unknown",
    chembl_id: raw.chembl_id ?? "",
    mw: raw.mw ?? null,
    ic50_nm: raw.ic50_nm ?? null,
    cmax_nm: raw.cmax_nm ?? null,
    gap_ratio: raw.gap_ratio ?? null,
    achievability,
    smiles: raw.smiles ?? null,
  };
}

/**
 * Normalize a raw dose object from the backend into the frontend DoseResult shape.
 *
 * Backend DoseResult dataclass fields:
 *   drug, weight_kg, bsa_m2, dose_mg, dose_per_kg, schedule, route,
 *   renal_adjustment, hepatic_adjustment, final_dose_mg, notes, warnings
 *
 * Frontend DoseResult fields:
 *   drug, weight_kg, dose_mg, dose_mg_per_kg, frequency, route,
 *   adjustments, hold, hold_reason
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeDose(raw: any): DoseResult {
  const finalDose = raw.final_dose_mg ?? raw.dose_mg ?? 0;
  const isHeld = finalDose === 0 || raw.hold === true;

  const adjustments: string[] = [];
  if (Array.isArray(raw.warnings)) adjustments.push(...raw.warnings);
  if (Array.isArray(raw.adjustments)) adjustments.push(...raw.adjustments);
  if (raw.renal_adjustment && raw.renal_adjustment !== "none") {
    adjustments.push(`Renal adjustment: ${raw.renal_adjustment}`);
  }
  if (raw.hepatic_adjustment && raw.hepatic_adjustment !== "none") {
    adjustments.push(`Hepatic adjustment: ${raw.hepatic_adjustment}`);
  }

  return {
    drug: raw.drug ?? "unknown",
    weight_kg: raw.weight_kg ?? 0,
    dose_mg: finalDose,
    dose_mg_per_kg: raw.dose_per_kg ?? raw.dose_mg_per_kg ?? (finalDose && raw.weight_kg ? finalDose / raw.weight_kg : 0),
    frequency: raw.schedule ?? raw.frequency ?? "—",
    route: raw.route ?? "oral",
    adjustments,
    hold: isHeld,
    hold_reason: isHeld ? (raw.notes ?? raw.hold_reason ?? "Drug held — see clinical notes") : null,
  };
}

/**
 * Normalize a raw recipe card from the backend into the frontend RecipeCard shape.
 *
 * Backend RecipeCard dataclass fields:
 *   pet_name, species, breed, weight_kg, bsa_m2, prescribing_vet,
 *   date_issued, drugs (list[dict] with schedule/final_dose_mg), interactions,
 *   monitoring, printable_text
 *
 * Frontend RecipeCard fields:
 *   pet_name, breed, weight_kg, prescribing_vet, date, drugs (with frequency/dose_mg),
 *   monitoring_schedule, notes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeRecipe(raw: any): RecipeCard {
  // Normalize each drug entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drugs = (raw.drugs ?? []).map((d: any) => ({
    drug: d.drug ?? "unknown",
    dose_mg: d.final_dose_mg ?? d.dose_mg ?? 0,
    frequency: d.schedule ?? d.frequency ?? "—",
    route: d.route ?? "oral",
    duration: d.duration ?? "Per protocol",
  }));

  // Build notes from interactions if present
  const interactions: string[] = raw.interactions ?? [];
  const notes = interactions.length > 0
    ? `Drug interactions: ${interactions.join(" | ")}`
    : (raw.notes ?? "");

  return {
    pet_name: raw.pet_name ?? "",
    breed: raw.breed ?? "",
    weight_kg: raw.weight_kg ?? 0,
    prescribing_vet: raw.prescribing_vet ?? "VetOnco System",
    date: raw.date_issued ?? raw.date ?? new Date().toISOString().slice(0, 10),
    drugs,
    monitoring_schedule: raw.monitoring ?? raw.monitoring_schedule ?? [],
    notes,
  };
}
