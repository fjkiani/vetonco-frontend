import { cn } from "../../lib/utils";

const gradeConfig = [
  { label: "G0", bg: "bg-green-100", text: "text-green-800", desc: "Normal" },
  { label: "G1", bg: "bg-yellow-100", text: "text-yellow-800", desc: "Mild" },
  { label: "G2", bg: "bg-orange-100", text: "text-orange-800", desc: "Moderate" },
  { label: "G3", bg: "bg-red-100", text: "text-red-800", desc: "Severe" },
  { label: "G4", bg: "bg-red-900", text: "text-white", desc: "Life-threatening" },
];

interface GradeIndicatorProps {
  grade: number;
  showDesc?: boolean;
  className?: string;
}

export function GradeIndicator({ grade, showDesc = false, className }: GradeIndicatorProps) {
  const cfg = gradeConfig[Math.min(grade, 4)] ?? gradeConfig[0];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
        cfg.bg,
        cfg.text,
        className
      )}
    >
      {cfg.label}
      {showDesc && <span className="font-normal opacity-75">· {cfg.desc}</span>}
    </span>
  );
}
