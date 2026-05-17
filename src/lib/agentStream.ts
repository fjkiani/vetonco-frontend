/**
 * VetOnco — SSE stream client for LangGraph agent
 * Uses fetch + ReadableStream (not EventSource) because we need POST.
 */
import { API_BASE } from "./api";
import type { TraceEvent, AgentRunResult } from "../types/agent";

export type StreamEvent =
  | { event: "pipeline_start"; nodes: string[]; pet_name: string }
  | { event: "node_start"; node: string; started_at: number }
  | { event: "node_complete"; node: string; status: string; summary: string; duration_ms: number; output_preview: Record<string, unknown>; error?: string }
  | { event: "pipeline_error"; message: string; errors: string[] }
  | { event: "complete"; [key: string]: unknown };

export interface AgentStreamCallbacks {
  onPipelineStart?: (nodes: string[]) => void;
  onNodeStart?: (node: string) => void;
  onNodeComplete?: (event: TraceEvent) => void;
  onComplete?: (result: AgentRunResult) => void;
  onError?: (error: string) => void;
}

export async function streamAgentRun(
  body: object,
  token: string | null | undefined,
  callbacks: AgentStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/canine/agent/run`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    callbacks.onError?.(err instanceof Error ? err.message : "Network error");
    return;
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    callbacks.onError?.(`Backend error ${response.status}: ${errText}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError?.("No response body");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const jsonStr = line.slice(5).trim();
        if (!jsonStr) continue;

        try {
          const evt = JSON.parse(jsonStr) as StreamEvent;

          if (evt.event === "pipeline_start") {
            callbacks.onPipelineStart?.(evt.nodes);
          } else if (evt.event === "node_start") {
            callbacks.onNodeStart?.(evt.node);
          } else if (evt.event === "node_complete") {
            callbacks.onNodeComplete?.(evt as unknown as TraceEvent);
          } else if (evt.event === "pipeline_error") {
            callbacks.onError?.(evt.message);
          } else if (evt.event === "complete") {
            callbacks.onComplete?.(evt as unknown as AgentRunResult);
          }
        } catch {
          // Malformed JSON — skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
