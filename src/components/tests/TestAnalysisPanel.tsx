import { AlertTriangle, CheckCircle } from "lucide-react";
import { GradeIndicator } from "./GradeIndicator";
import type { TestAnalysisResult } from "../../types/api";

interface TestAnalysisPanelProps {
  result: TestAnalysisResult;
}

export function TestAnalysisPanel({ result }: TestAnalysisPanelProps) {
  const hasAlerts = result.alerts.length > 0;

  return (
    <div className="space-y-4">
      {/* VCOG Grades */}
      {Object.keys(result.vcog_grades).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">VCOG-CTCAE Grades</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(result.vcog_grades).map(([param, grade]) => (
              <div key={param} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{param.replace(/_/g, " ")}</span>
                <GradeIndicator grade={grade} showDesc />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {hasAlerts ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Clinical Alerts</h3>
          {result.alerts.map((alert, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 flex items-start gap-3 ${
                alert.grade >= 3
                  ? "bg-red-50 border-red-200"
                  : alert.grade >= 2
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  alert.grade >= 3 ? "text-red-500" : alert.grade >= 2 ? "text-yellow-500" : "text-blue-400"
                }`}
              />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-800 capitalize">
                    {alert.parameter.replace(/_/g, " ")}
                  </span>
                  <GradeIndicator grade={alert.grade} />
                  <span className="text-xs text-gray-500">= {alert.value}</span>
                </div>
                <p className="text-sm text-gray-700">{alert.action}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
          <CheckCircle className="h-4 w-4 text-green-500" />
          All parameters within acceptable range
        </div>
      )}

      {/* Narrative */}
      {result.narrative && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Clinical Narrative</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{result.narrative}</p>
        </div>
      )}
    </div>
  );
}
