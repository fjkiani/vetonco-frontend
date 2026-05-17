import { Link } from "react-router-dom";
import { Dog, ChevronDown, ExternalLink, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "../components/ui/Button";

// ─── Data ────────────────────────────────────────────────────────────────────

const responseRates = [
  { protocol: "Piroxicam alone", orr: "18%", sd: "53%", mst: "181 days", trial: "Knapp 1994", n: 34 },
  { protocol: "Mitoxantrone + piroxicam", orr: "35%", sd: "46%", mst: "291 days", trial: "Henry 2003", n: 55 },
  { protocol: "Carboplatin + piroxicam", orr: "40%", sd: "45%", mst: "161 days", trial: "Boria 2005", n: 31 },
  { protocol: "Gemcitabine + piroxicam", orr: "26%", sd: "50%", mst: "230 days", trial: "Marconato 2011", n: 38 },
  { protocol: "Toceranib alone", orr: "6.7% PR", sd: "80%", mst: "149 days", trial: "Gustafson 2019", n: 37 },
  { protocol: "Mitoxantrone vs carboplatin (RCT)", orr: "8–13%", sd: "54–69%", mst: "73–106 days PFI", trial: "Allstadt 2015", n: 50 },
];

const sensitivityRows = [
  { drug: "Piroxicam", tier: "A", brafPos: "0.40", brafNeg: "0.40", brafUnk: "0.40", note: "BRAF-agnostic" },
  { drug: "Toceranib", tier: "A", brafPos: "0.64", brafNeg: "0.40", brafUnk: "0.44", note: "Preferred in BRAF+" },
  { drug: "Mitoxantrone", tier: "A", brafPos: "0.40", brafNeg: "0.40", brafUnk: "0.40", note: "BRAF-agnostic" },
  { drug: "Vinblastine", tier: "B", brafPos: "0.28", brafNeg: "0.28", brafUnk: "0.28", note: "Indistinguishable without expression data" },
  { drug: "Carboplatin", tier: "B", brafPos: "0.28", brafNeg: "0.28", brafUnk: "0.28", note: "Indistinguishable without expression data" },
  { drug: "Gemcitabine", tier: "B", brafPos: "0.28", brafNeg: "0.28", brafUnk: "0.28", note: "Indistinguishable without expression data" },
  { drug: "Trametinib", tier: "C", brafPos: "0.56", brafNeg: "0.00", brafUnk: "0.24", note: "MEK inhibitor — BRAF+ only" },
];

const trainingSources = [
  { component: "Gene panel (Tier A/B/C)", source: "Dhawan et al. GSE110661 (RNA-seq)", n: "33 tumors", year: "2018" },
  { component: "Gene expression clusters", source: "Parker et al. BMC Cancer", n: "11 WES + 32 FFPE", year: "2020" },
  { component: "BRAF breed priors (large-scale)", source: "Appenzeller et al. Vet Sciences", n: "8,365 samples", year: "2025" },
  { component: "BRAF breed priors (terrier)", source: "Grassinger et al. Vet Sciences", n: "65 tumors", year: "2019" },
  { component: "BRAF V595E prevalence (ddPCR)", source: "Mochizuki et al. PLoS ONE", n: "48 UC + 27 PC", year: "2015" },
  { component: "BRAF V595E prevalence (IHC)", source: "Aeschlimann et al. Vet Comp Oncol", n: "122 UC", year: "2024" },
  { component: "BRAF-negative UC (MAP2K1)", source: "Thomas et al. PLOS Genetics", n: "28 BRAF-neg UC", year: "2023" },
  { component: "V595E ≠ V600E (cell lines)", source: "Jung et al. IJMS", n: "Canine TCC lines", year: "2021" },
  { component: "Piroxicam evidence tier A", source: "Knapp et al. JVIM", n: "34 dogs", year: "1994" },
  { component: "Mitoxantrone + piroxicam", source: "Henry et al. Clin Cancer Res", n: "55 dogs", year: "2003" },
  { component: "Carboplatin + piroxicam", source: "Boria et al. Vet Comp Oncol", n: "31 dogs", year: "2005" },
  { component: "Mitoxantrone vs carboplatin (RCT)", source: "Allstadt et al. JVIM", n: "50 dogs", year: "2015" },
  { component: "Gemcitabine + piroxicam", source: "Marconato et al. JAVMA", n: "38 dogs", year: "2011" },
  { component: "Toceranib in TCC", source: "Gustafson & Biller JAAHA", n: "37 dogs", year: "2019" },
  { component: "ChEMBL IC50 / MW / SMILES", source: "ChEMBL database (EBI)", n: "—", year: "2024" },
];

const limitations = [
  {
    title: "No prospective validation",
    body: "The scorer has not been tested against a held-out cohort of canine TCC patients with known outcomes. Rankings are derived from published evidence tiers and a hand-crafted scoring formula, not from a trained ML model with cross-validated performance metrics. There is no AUC, sensitivity, or specificity statistic for the ranking itself.",
  },
  {
    title: "Breed BRAF priors from observational submission data",
    body: "Breed-specific BRAF priors (e.g., Shetland Sheepdog 72%) are odds ratios from diagnostic submissions (Appenzeller et al. 2025, n=8,365), not prevalence estimates from confirmed TCC cases. Breeds with high submission rates may have inflated priors.",
  },
  {
    title: "Seed IC50/Cmax data are in vitro proxies",
    body: "ChEMBL IC50 values are from in vitro assays (human or canine cell lines). Cmax values are from published PK studies but do not account for individual patient pharmacokinetics, protein binding, or tumor penetration. The gap ratio is a pharmacological proxy, not a validated PK/PD model.",
  },
  {
    title: "Expression panel is rarely available in clinical practice",
    body: "The 20% target score weight is effectively zero for most clinical cases (no RNA-seq). In practice, the scorer operates as a 2-factor model: evidence tier (40%) + BRAF bonus (40%). The gene panel is included for future-proofing as liquid biopsy and targeted panels become more accessible.",
  },
  {
    title: "Tier B drugs are indistinguishable without expression data",
    body: "Carboplatin, gemcitabine, and vinblastine all score identically (0.28). The Allstadt 2015 RCT confirms no significant difference between mitoxantrone and carboplatin (PFI 106 vs 73.5 days, p=0.62) — so this is scientifically defensible, but the ranking provides no guidance for choosing among Tier B agents.",
  },
  {
    title: "BRAF status does not predict survival",
    body: "Gedon et al. 2021 (n=79) found BRAF mutation status was NOT an independent prognostic factor for overall survival (MST BRAF+ 214 days vs BRAF− 359 days, p=0.055). Treatment type and tumor location were the significant factors. VetOnco uses BRAF to guide drug selection (mechanistically justified) but makes no survival prediction based on BRAF status.",
  },
  {
    title: "Trametinib is off-label with minimal canine-specific data",
    body: "The C-tier designation reflects this. The 0.03 mg/kg dose is extrapolated from human dosing; no published canine TCC clinical trial exists for trametinib. The MEK inhibitor rationale is sound (Thomas 2023 identified MAP2K1 deletions as alternative MAPK activators), but clinical safety and efficacy in dogs are unestablished.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionAccordion({ id, title, subtitle, children }: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <details id={id} className="group border border-gray-700 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer bg-gray-800/60 hover:bg-gray-800 transition-colors list-none">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" />
      </summary>
      <div className="px-6 py-6 bg-gray-900/40 space-y-6">
        {children}
      </div>
    </details>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-800/40 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PipelineStep({ num, title, input, output }: {
  num: number;
  title: string;
  input: string;
  output: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
        {num}
      </div>
      <div className="flex-1 pb-6 border-l border-gray-700 pl-4 -ml-4 ml-0">
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-xs text-gray-500 mb-0.5"><span className="text-gray-400 font-medium">In:</span> {input}</p>
        <p className="text-xs text-gray-500"><span className="text-gray-400 font-medium">Out:</span> {output}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Dog className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">VetOnco</span>
        </Link>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link to="/sign-in"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/sign-up"><Button size="sm">Get started</Button></Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard"><Button size="sm">Dashboard</Button></Link>
          </SignedIn>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">How VetOnco Works</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A transparent look at the science, data sources, and algorithm behind every treatment recommendation — written for pet owners, general practice vets, and veterinary oncologists.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pb-24 space-y-6">

        {/* ── TIER 1: Pet Owner ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-700/50 bg-blue-900/10 p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-blue-700 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">For Pet Owners</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">What is TCC?</h2>
            <p className="text-gray-300 leading-relaxed">
              Transitional cell carcinoma (TCC) — also called urothelial carcinoma — is the most common malignant bladder tumor in dogs. It is typically diagnosed at an advanced stage, and while it cannot usually be cured, the right treatment can significantly extend your dog's quality of life and survival time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">What does VetOnco do?</h2>
            <p className="text-gray-300 leading-relaxed">
              VetOnco analyzes your dog's molecular test results and matches them to the treatments with the strongest published evidence in dogs with the same cancer. It calculates the correct dose for your dog's weight and flags any drug combinations that could cause side effects. Your vet then reviews the recommendations and makes the final decision.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">The three test results VetOnco uses</h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-4 rounded-lg bg-gray-800/60">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">BRAF test result</p>
                  <p className="text-sm text-gray-400 mt-0.5">A DNA test on the tumor. About 80% of dogs with TCC have a specific mutation (BRAF V595E) that changes which drugs work best. Think of it as a "lock" — some drugs only fit this lock.</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 rounded-lg bg-gray-800/60">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">MSH2 test result (optional)</p>
                  <p className="text-sm text-gray-400 mt-0.5">A protein stain on the tumor tissue. If MSH2 is absent, the tumor has a DNA repair defect that may make it more sensitive to certain chemotherapy drugs.</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 rounded-lg bg-gray-800/60">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Gene expression panel (optional)</p>
                  <p className="text-sm text-gray-400 mt-0.5">An RNA test that measures which genes are overactive in the tumor. When available, this helps VetOnco fine-tune which drugs are most likely to hit the tumor's specific vulnerabilities.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">What does the output mean?</h2>
            <p className="text-gray-300 leading-relaxed">
              VetOnco produces a ranked list of drugs, with the dose already calculated for your dog's weight and adjusted for kidney and liver function. It also flags any drug combinations that carry extra risk. Your vet uses this as a starting point for the treatment conversation — not as a final prescription.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-900/20 border border-yellow-700/40">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              <strong>Important:</strong> VetOnco is a clinical decision support tool. All treatment decisions must be made by a licensed veterinarian. VetOnco does not diagnose cancer and does not replace a veterinary consultation.
            </p>
          </div>
        </div>

        {/* ── TIER 2: GP Vet ────────────────────────────────────────────────── */}
        <SectionAccordion
          id="gp-detail"
          title="Clinical Detail"
          subtitle="For general practice veterinarians — pipeline steps, drug panel, interactions"
        >
          <div>
            <h3 className="font-semibold text-white mb-4">The 5-Step Pipeline</h3>
            <div className="space-y-2">
              <PipelineStep
                num={1}
                title="TCC Scorer"
                input="BRAF status, MSH2 loss, breed, gene expression (optional)"
                output="Ranked list of 7 PASS drugs with scores (0–1) and evidence tier; 3 QUARANTINE flags with molecular rationale"
              />
              <PipelineStep
                num={2}
                title="ChEMBL Compound Enrichment"
                input="Top 3 ranked drug names"
                output="MW (Da), IC₅₀ (nM), Cmax (nM), gap ratio (IC₅₀/Cmax), SMILES, achievability flag"
              />
              <PipelineStep
                num={3}
                title="Dose Calculator"
                input="Drug list, weight (kg), creatinine (optional), ALT (optional)"
                output="Per-drug dose (mg), schedule, route; organ-adjusted reductions or hold flags"
              />
              <PipelineStep
                num={4}
                title="Recipe Builder"
                input="Dose list, pet metadata, prescribing vet"
                output="Printable prescription card with drug-drug interaction warnings and monitoring schedule"
              />
              <PipelineStep
                num={5}
                title="LLM Rationale"
                input="Scorer output, BRAF status, breed, dosage"
                output="Plain-English clinical narrative summarizing the algorithm's reasoning (does not make decisions)"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Drug Panel — 7 PASS Drugs</h3>
            <Table
              headers={["Drug", "Mechanism", "Tier", "Typical Dose", "Route"]}
              rows={[
                ["Piroxicam", "COX-2 inhibitor / anti-angiogenic", "A", "0.3 mg/kg q24h", "PO"],
                ["Toceranib", "VEGFR2 / PDGFR / KIT inhibitor", "A", "2.75 mg/kg q48h", "PO"],
                ["Mitoxantrone", "Topoisomerase II inhibitor", "A", "5.5 mg/m² q21d", "IV"],
                ["Vinblastine", "Vinca alkaloid / microtubule inhibitor", "B", "2.0 mg/m² q7d", "IV"],
                ["Carboplatin", "Platinum alkylating agent", "B", "300 mg/m² q21d", "IV"],
                ["Gemcitabine", "Nucleoside analog", "B", "800 mg/m² q7d", "IV"],
                ["Trametinib", "MEK inhibitor (BRAF+ only)", "C", "0.03 mg/kg q24h", "PO"],
              ]}
            />
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">3 QUARANTINE Drugs — Why They Are Excluded</h3>
            <div className="space-y-3">
              {[
                { drug: "Vemurafenib", reason: "Targets human BRAF V600E, not canine V595E. Jung et al. 2021 confirmed paradoxical MAPK activation in canine TCC cell lines — the drug activates rather than inhibits the pathway." },
                { drug: "Dabrafenib", reason: "Same V600E-specific mechanism as vemurafenib. Same molecular mismatch with canine V595E." },
                { drug: "Erdafitinib", reason: "FGFR3 amplification is not validated as a canine TCC driver (Thomas et al. 2023). No canine PK/PD data. Included in human bladder cancer guidelines but not appropriate for canine TCC without further validation." },
              ].map(({ drug, reason }) => (
                <div key={drug} className="flex gap-3 p-4 rounded-lg bg-red-900/10 border border-red-700/30">
                  <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{drug}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Drug-Drug Interaction Warnings</h3>
            <Table
              headers={["Combination", "Risk", "Mitigation"]}
              rows={[
                ["Toceranib + Piroxicam", "GI hemorrhage", "Consider misoprostol prophylaxis; monitor for melena"],
                ["Carboplatin + Piroxicam", "Additive nephrotoxicity", "Monitor BUN/creatinine; pre-hydrate before carboplatin"],
                ["Mitoxantrone + Vinblastine", "Additive myelosuppression", "Stagger administration; CBC nadir monitoring"],
                ["Trametinib + Toceranib", "Overlapping myelosuppression", "CBC q7d; dose-reduce toceranib first if Grade 3+ neutropenia"],
              ]}
            />
          </div>
        </SectionAccordion>

        {/* ── TIER 3: Oncologist ────────────────────────────────────────────── */}
        <SectionAccordion
          id="oncologist-detail"
          title="Algorithm & Evidence"
          subtitle="For veterinary oncologists — scoring formula, sensitivity analysis, published benchmarks, training sources, limitations"
        >
          <div>
            <h3 className="font-semibold text-white mb-3">Scoring Formula</h3>
            <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-blue-300 mb-3">
              score = clip(0.4 × evidence_tier_weight + 0.4 × braf_bonus + 0.2 × target_score, 0, 1)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-800/60">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Evidence Tier Weights</p>
                <p className="text-sm text-gray-300">Tier A (piroxicam, toceranib, mitoxantrone): <span className="text-white font-medium">1.0</span></p>
                <p className="text-sm text-gray-300">Tier B (vinblastine, carboplatin, gemcitabine): <span className="text-white font-medium">0.7</span></p>
                <p className="text-sm text-gray-300">Tier C (trametinib): <span className="text-white font-medium">0.4</span></p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/60">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">BRAF Bonus</p>
                <p className="text-sm text-gray-300">Trametinib + BRAF+: <span className="text-white font-medium">+1.0</span></p>
                <p className="text-sm text-gray-300">Toceranib + BRAF+: <span className="text-white font-medium">+0.6</span></p>
                <p className="text-sm text-gray-300">Toceranib + unknown: <span className="text-white font-medium">+0.2</span></p>
                <p className="text-sm text-gray-300">Trametinib + BRAF−: <span className="text-white font-medium">−0.5</span></p>
                <p className="text-sm text-gray-300">All others: <span className="text-white font-medium">0.0</span></p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/60">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Target Score</p>
                <p className="text-sm text-gray-300">Weighted sum of log2FC for drug targets across 19-gene panel (Tier A weight 1.0, B 0.7, C 0.4). Normalized to [0,1]. Zero when no expression data provided.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Sensitivity Analysis — Score by BRAF Status (no expression data)</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    {["Drug", "Tier", "BRAF+", "BRAF−", "BRAF Unknown", "Note"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sensitivityRows.map((row) => (
                    <tr key={row.drug} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{row.drug}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          row.tier === "A" ? "bg-green-900/50 text-green-300" :
                          row.tier === "B" ? "bg-yellow-900/50 text-yellow-300" :
                          "bg-orange-900/50 text-orange-300"
                        }`}>{row.tier}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-mono">{row.brafPos}</td>
                      <td className="px-4 py-3 text-gray-300 font-mono">{row.brafNeg}</td>
                      <td className="px-4 py-3 text-gray-300 font-mono">{row.brafUnk}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Key finding: BRAF status is the only differentiator between Tier A drugs. Piroxicam and mitoxantrone score identically (0.40) regardless of any input. Tier B drugs are indistinguishable without expression data.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Published Clinical Response Rates (Ground Truth)</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    {["Protocol", "ORR", "Stable Disease", "Median Survival", "Trial", "n"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {responseRates.map((row) => (
                    <tr key={row.trial} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 text-white">{row.protocol}</td>
                      <td className="px-4 py-3 text-green-400 font-medium">{row.orr}</td>
                      <td className="px-4 py-3 text-gray-300">{row.sd}</td>
                      <td className="px-4 py-3 text-gray-300">{row.mst}</td>
                      <td className="px-4 py-3 text-blue-400 text-xs">{row.trial}</td>
                      <td className="px-4 py-3 text-gray-400">{row.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ORR = objective response rate (CR + PR). Stable disease is the dominant outcome across all protocols (46–80%). Survival benefit comes primarily from disease stabilization, not tumor elimination.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Training Sources & Data Provenance</h3>
            <Table
              headers={["Component", "Source", "n", "Year"]}
              rows={trainingSources.map((r) => [r.component, r.source, r.n, r.year])}
            />
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Explicit Limitations</h3>
            <div className="space-y-3">
              {limitations.map((lim, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg bg-gray-800/40 border border-gray-700">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white text-sm">{i + 1}. {lim.title}</p>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{lim.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <ExternalLink className="h-4 w-4 text-gray-500" />
            <p className="text-xs text-gray-500">
              Full transparency report with DOIs available as{" "}
              <span className="text-gray-400 font-medium">report_vetonco_science.md</span>{" "}
              in the VetOnco results archive.
            </p>
          </div>
        </SectionAccordion>

        {/* CTA */}
        <div className="text-center pt-4">
          <SignedOut>
            <Link to="/sign-up">
              <Button size="lg">Get started with VetOnco</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="lg">Go to dashboard</Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
