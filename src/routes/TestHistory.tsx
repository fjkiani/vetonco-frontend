import { Link, useParams } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { TrendChart } from "../components/tests/TrendChart";
import { GradeIndicator } from "../components/tests/GradeIndicator";
import { useStore } from "../lib/store";
import { formatDate } from "../lib/utils";

export function TestHistory() {
  const { id } = useParams<{ id: string }>();

  // Select raw state — never call functions inside selectors
  const pets = useStore((s) => s.pets);
  const testHistory = useStore((s) => s.testHistory);

  const pet = pets.find((p) => p.id === id);
  const sessions = testHistory[id!] ?? [];

  if (!pet) return <div className="text-gray-500">Patient not found.</div>;

  // Build trend data for CBC sessions
  const cbcSessions = sessions
    .filter((s) => s.test_type.toLowerCase() === "cbc")
    .sort((a, b) => a.date.localeCompare(b.date));

  const trendData = cbcSessions.map((s) => ({
    date: s.date,
    anc: s.values.anc ?? null,
    hgb: s.values.hgb ?? null,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
          <p className="text-gray-500 mt-1">
            {pet.name} · {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to={`/pets/${id}/tests/new`}>
          <Button icon={<Plus className="h-4 w-4" />}>Log Test</Button>
        </Link>
      </div>

      {/* CBC trend chart */}
      {trendData.length >= 2 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">CBC Trends</h2>
          <TrendChart
            data={trendData}
            series={[
              { key: "anc", label: "ANC (×10³/μL)", color: "#3b82f6", threshold: 2.0, thresholdLabel: "ANC G2" },
              { key: "hgb", label: "Hgb (g/dL)", color: "#10b981", threshold: 8.0, thresholdLabel: "Hgb G2" },
            ]}
          />
        </div>
      )}

      {/* Session list */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 rounded-xl border-2 border-dashed border-gray-200">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No tests logged yet</p>
          <Link to={`/pets/${id}/tests/new`}>
            <Button icon={<Plus className="h-4 w-4" />}>Log first test</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {[...sessions].reverse().map((session) => {
            const grades = session.analysis?.vcog_grades ?? {};
            const maxGrade = Object.values(grades).length > 0
              ? Math.max(0, ...Object.values(grades))
              : 0;
            const alertCount = session.analysis?.alerts?.length ?? 0;

            return (
              <Link key={session.session_id} to={`/pets/${id}/tests/${session.session_id}`}>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{session.test_type}</Badge>
                      <span className="text-sm text-gray-600">{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.analysis && <GradeIndicator grade={maxGrade} showDesc />}
                      {alertCount > 0 && (
                        <Badge variant="warning">
                          {alertCount} alert{alertCount > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {session.notes && (
                    <p className="text-xs text-gray-500 mt-2">{session.notes}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {Object.entries(session.values).slice(0, 4).map(([k, v]) => (
                      <span key={k} className="text-xs text-gray-600">
                        <span className="font-medium capitalize">{k.replace(/_/g, " ")}:</span> {String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
