import { X, AlertTriangle, AlertCircle } from "lucide-react";
import { useStore } from "../../lib/store";
import { cn } from "../../lib/utils";

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: AlertCircle },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: AlertTriangle },
  MODERATE: { bg: "bg-yellow-400", text: "text-gray-900", icon: AlertTriangle },
  LOW: { bg: "bg-blue-100", text: "text-blue-900", icon: AlertCircle },
};

export function AlertBanner() {
  const alerts = useStore((s) => s.alerts);
  const dismiss = useStore((s) => s.dismissAlert);

  const critical = alerts.filter((a) => a.severity === "CRITICAL" || a.severity === "HIGH");
  if (critical.length === 0) return null;

  const top = critical[0];
  const cfg = severityConfig[top.severity as keyof typeof severityConfig] ?? severityConfig.HIGH;
  const Icon = cfg.icon;

  return (
    <div className={cn("flex items-center gap-3 px-4 py-2 text-sm", cfg.bg, cfg.text)}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="font-semibold">{top.severity}:</span>
      <span className="flex-1">{top.message}</span>
      {critical.length > 1 && (
        <span className="opacity-75">+{critical.length - 1} more</span>
      )}
      <button
        onClick={() => dismiss(top.alert_id)}
        className="ml-2 opacity-75 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
