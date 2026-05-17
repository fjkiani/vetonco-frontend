export type BRAFStatus = "positive" | "negative" | "unknown";

export interface Pet {
  id: string;
  name: string;
  breed: string;
  weight_kg: number;
  braf_status: BRAFStatus;
  msh2_loss: boolean;
  age_years?: number;
  owner_name?: string;
  prescribing_vet?: string;
  creatinine_mg_dl?: number;
  alt_u_l?: number;
  created_at: string;
}

export const BRAF_STATUS_LABELS: Record<BRAFStatus, string> = {
  positive: "BRAF V595E+",
  negative: "BRAF WT",
  unknown: "BRAF Unknown",
};

export const COMMON_BREEDS = [
  "Scottish Terrier",
  "Shetland Sheepdog",
  "Beagle",
  "West Highland White Terrier",
  "Fox Terrier",
  "Airedale Terrier",
  "Labrador Retriever",
  "Golden Retriever",
  "Mixed Breed",
  "Other",
];
