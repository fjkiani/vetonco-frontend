import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { TestAnalysisPanel } from "../components/tests/TestAnalysisPanel";
import { MonitoringPanel } from "../components/agent/MonitoringPanel";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import { formatDate } from "../lib/utils";
import type { MonitoringResult } from "../types/agent";
import type { MonitoringAlert, TraceEvent } from "../types/agent";

export function TestDetail() {
  const { id, testId } = useParams<{ id: string; testId: string }>();
  const { getToken } = useAuth();
  const pet = useStore((s) => s.getPet(id!));
  const sessions = useStore((s) => s.getTestHistory(id!));
  const setAlerts = useStore((s) => s.setAlerts);

  const session = sessions.find((s) => s.session_id === testId);

  const [monitoringResult, setMonitoringResult] = useState<MonitoringResult | null>(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [monitoringError, setMonitoringError] = useState<string | null>(null);

  if (!pet || !session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Test session not found.</p>
        <Link to={`/pets/${id}/tests`} className="text-blue-500 text-sm mt-2 inline-block">Back to history</Link>
      </div>
    );
  }

  const handleRunMonitoring = async () => {
    setMonitoringLoading(true);
    setMonitoringError(null);
    try {
      const token = await getToken();
      const result = await api.agentMonitor(
        {
          pet_id: pet.id,
          pet_name: pet.name,
          breed: pet.breed,
          weight_kg: pet.weight_kg,
          braf_status: pet.braf_status,
          test_history: sessions.map((s) => ({
            date: s.date,
            test_type: s.test_type,
            values: s.values,
          })),
        },
        token
      ) as MonitoringResult;
      setMonitoringResult(result);
      if (result.alerts?.length > 0) {
        setAlerts(pet.id, result.alerts as MonitoringAlert[]);
      }
    } catch (e) {
      setMonitoringError(e instanceof Error ? e.message : "Monitoring agent failed");
    } finally {
      setMonitoringLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link to={`/pets/${id}/tests`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to history
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{session.test_type}</Badge>
            <span className="text-sm text-gray-500">{formatDate(session.date)}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{pet.name} — {session.test_type}</h1>
        </div>
        <Button
          icon={<Activity className="h-4 w-4" />}
          loading={monitoringLoading}
          onClick={handleRunMonitoring}
          variant="outline"
        >
          Run Monitoring Agent
        </Button>
      </div>

      {/* Test values */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Recorded Values</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(session.values).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs text-gray-400 capitalize">{k.replace(/_/g, " ")}</p>
              <p className="text-sm font-medium text-gray-800">{String(v)}</p>
            </div>
          ))}
        </div>
        {session.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Notes</p>
            <p className="text-sm text-gray-700">{session.notes}</p>
          </div>
        )}
      </div>

      {/* Analysis */}
      {session.analysis && <TestAnalysisPanel result={session.analysis} />}

      {/* Monitoring agent */}
      {monitoringError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{monitoringError}</div>
      )}

      {(monitoringResult || monitoringLoading) && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Monitoring Agent</h2>
          <MonitoringPanel
            alerts={(monitoringResult?.alerts ?? []) as MonitoringAlert[]}
            trace={(monitoringResult?.trace ?? []) as TraceEvent[]}
            summary={monitoringResult?.monitoring_summary ?? undefined}
            loading={monitoringLoading}
          />
        </div>
      )}
    </div>
  );
}
