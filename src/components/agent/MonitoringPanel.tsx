import { AlertCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../lib/utils";
import { AgentNode } from "./AgentNode";
import type { MonitoringAlert, TraceEvent } from "../../types/agent";

const MONITORING_NODES = ["load_history_node", "trend_node", "alert_node", "llm_summary_node"];

const severityConfig = {
  CRITICAL: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: AlertCircle, iconColor: "text-red-500" },
  HIGH: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", icon: AlertTriangle, iconColor: "text-orange-500" },
  MODERATE: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", icon: AlertTriangle, iconColor: "text-yellow-500" },
  LOW: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: AlertCircle, iconColor: "text-blue-400" },
};

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "worsening") return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === "improving") return <TrendingDown className="h-4 w-4 text-green-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

interface MonitoringPanelProps {
  alerts: MonitoringAlert[];
  trace: TraceEvent[];
  summary?: string;
  loading?: boolean;
}

export function MonitoringPanel({ alerts, trace, summary, loading }: MonitoringPanelProps) {
  return (
    <div className="space-y-4">
      {/* Agent trace */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Monitoring Agent Trace</h3>
        </div>
        <div className="p-4 space-y-2">
          {MONITORING_NODES.map((node) => {
            const event = trace.find((t) => t.node === node);
            const status = loading && !event
              ? "pending"
              : event
              ? (event.status as "ok" | "error" | "skipped")
              : "pending";
            return <AgentNode key={node} node={node} status={status} event={event} />;
          })}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Clinical Alerts</h3>
          {alerts.map((alert, i) => {
            const cfg = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.LOW;
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className={cn("rounded-lg border p-4", cfg.bg, cfg.border)}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", cfg.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-sm font-semibold", cfg.text)}>
                        {alert.severity} — {alert.parameter}
                      </span>
                      <TrendIcon trend={alert.trend} />
                      <span className="text-xs text-gray-500 capitalize">{alert.trend}</span>
                    </div>
                    <p className={cn("text-sm", cfg.text)}>{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Action:</span> {alert.action}
                    </p>
                    {alert.drug_implicated && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Drug: <span className="font-medium capitalize">{alert.drug_implicated}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LLM summary */}
      {summary && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Monitoring Summary</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {alerts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No alerts generated — all parameters within acceptable range
        </div>
      )}
    </div>
  );
}
