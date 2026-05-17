import { useState } from "react";
import { CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { AgentNodeIcon, getNodeLabel } from "./AgentNodeIcon";
import type { TraceEvent } from "../../types/agent";

type NodeStatus = "pending" | "running" | "ok" | "error" | "skipped";

interface AgentNodeProps {
  node: string;
  status: NodeStatus;
  event?: TraceEvent;
}

const statusConfig: Record<NodeStatus, { border: string; bg: string; text: string; iconColor: string }> = {
  pending: {
    border: "border-gray-200",
    bg: "bg-gray-50",
    text: "text-gray-400",
    iconColor: "text-gray-300",
  },
  running: {
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    iconColor: "text-blue-500",
  },
  ok: {
    border: "border-green-200",
    bg: "bg-white",
    text: "text-gray-800",
    iconColor: "text-green-500",
  },
  error: {
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-700",
    iconColor: "text-red-500",
  },
  skipped: {
    border: "border-gray-100",
    bg: "bg-gray-50",
    text: "text-gray-400",
    iconColor: "text-gray-300",
  },
};

function StatusIcon({ status }: { status: NodeStatus }) {
  if (status === "ok") return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />;
  if (status === "skipped") return <MinusCircle className="h-4 w-4 text-gray-300" />;
  return null;
}

export function AgentNode({ node, status, event }: AgentNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[status];
  const label = getNodeLabel(node);

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-all duration-300",
        cfg.border,
        cfg.bg,
        status === "running" && "shadow-md shadow-blue-100"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Node icon */}
        <div className={cn("flex-shrink-0", cfg.iconColor)}>
          <AgentNodeIcon node={node} status={status} className="h-5 w-5" />
        </div>

        {/* Label + summary */}
        <div className="flex-1 min-w-0">
          <div className={cn("text-sm font-medium", cfg.text, status === "skipped" && "line-through")}>
            {label}
          </div>
          {event?.summary && status !== "pending" && (
            <div className="text-xs text-gray-500 truncate mt-0.5">{event.summary}</div>
          )}
          {status === "running" && (
            <div className="text-xs text-blue-500 mt-0.5 animate-pulse">Running...</div>
          )}
        </div>

        {/* Right side: status icon + duration + expand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {event?.duration_ms != null && (
            <span className="text-xs text-gray-400 font-mono">{event.duration_ms}ms</span>
          )}
          <StatusIcon status={status} />
          {event?.output_preview && Object.keys(event.output_preview).length > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded output preview */}
      {expanded && event?.output_preview && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(event.output_preview).map(([k, v]) => (
              <div key={k} className="flex gap-1 text-xs">
                <span className="text-gray-400 font-medium capitalize">{k.replace(/_/g, " ")}:</span>
                <span className="text-gray-700 truncate">{String(v)}</span>
              </div>
            ))}
          </div>
          {event.error && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 rounded p-2">{event.error}</div>
          )}
        </div>
      )}
    </div>
  );
}
