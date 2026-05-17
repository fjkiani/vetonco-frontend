import { useState } from "react";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { AgentNode } from "./AgentNode";
import { useStore } from "../../lib/store";

const PIPELINE_NODES = ["score_node", "chembl_node", "dosing_node", "recipe_node", "llm_node"];

type NodeStatus = "pending" | "running" | "ok" | "error" | "skipped";

function getNodeStatus(
  node: string,
  runningNode: string | null,
  trace: { node: string; status: string }[],
  pendingNodes: string[]
): NodeStatus {
  const traceEvent = trace.find((t) => t.node === node);
  if (traceEvent) {
    if (traceEvent.status === "ok") return "ok";
    if (traceEvent.status === "error") return "error";
    if (traceEvent.status === "skipped") return "skipped";
  }
  if (runningNode === node) return "running";
  if (pendingNodes.includes(node)) return "pending";
  return "pending";
}

interface AgentTracePanelProps {
  nodes?: string[];
  className?: string;
}

export function AgentTracePanel({ nodes = PIPELINE_NODES, className }: AgentTracePanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { activeRun } = useStore();
  const { status, trace, runningNode, pendingNodes } = activeRun;

  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isComplete = status === "complete";
  const isError = status === "error";

  const completedCount = trace.filter((t) => t.status === "ok").length;
  const totalCount = nodes.length;

  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-2">
          <Zap
            className={cn(
              "h-4 w-4",
              isRunning ? "text-blue-500 animate-pulse" : isComplete ? "text-green-500" : "text-gray-400"
            )}
          />
          <span className="text-sm font-semibold text-gray-800">Agent Trace</span>
          {isRunning && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
              Live
            </span>
          )}
          {isComplete && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {completedCount}/{totalCount} nodes
            </span>
          )}
          {isError && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Error
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {/* Node list */}
      {!collapsed && (
        <div className="p-4 space-y-2">
          {isIdle && (
            <p className="text-sm text-gray-400 text-center py-4">
              Run the agent to see live execution trace
            </p>
          )}

          {!isIdle &&
            nodes.map((node) => {
              const nodeStatus = getNodeStatus(node, runningNode, trace, pendingNodes);
              const event = trace.find((t) => t.node === node);
              return (
                <AgentNode
                  key={node}
                  node={node}
                  status={nodeStatus}
                  event={event}
                />
              );
            })}

          {/* Error message */}
          {isError && activeRun.error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {activeRun.error}
            </div>
          )}

          {/* Pipeline summary */}
          {isComplete && activeRun.result?.pipeline_summary && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Pipeline Summary</p>
              <p className="text-sm text-gray-700">{activeRun.result.pipeline_summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
