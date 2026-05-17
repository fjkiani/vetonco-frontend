import { Link, useParams, useNavigate } from "react-router-dom";
import { Dog, Activity, Pill, FlaskConical, ClipboardList, BookOpen, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardBody } from "../components/ui/Card";
import { useStore } from "../lib/store";
import { BRAF_STATUS_LABELS } from "../types/pet";

export function PetOverview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Select primitives/stable references — never call functions inside selectors
  const pets = useStore((s) => s.pets);
  const allAlerts = useStore((s) => s.alerts);
  const testHistory = useStore((s) => s.testHistory);
  const removePet = useStore((s) => s.removePet);

  const pet = pets.find((p) => p.id === id);
  const sessions = testHistory[id!] ?? [];
  const petAlerts = allAlerts.filter((a) => a.severity === "CRITICAL" || a.severity === "HIGH");

  if (!pet) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Patient not found.</p>
        <Link to="/dashboard" className="text-blue-500 text-sm mt-2 inline-block">Back to dashboard</Link>
      </div>
    );
  }

  const quickLinks = [
    { to: `/pets/${id}/analyze`, icon: Activity, label: "Run Agent Analysis", color: "text-blue-600 bg-blue-50" },
    { to: `/pets/${id}/compounds`, icon: FlaskConical, label: "View Compounds", color: "text-purple-600 bg-purple-50" },
    { to: `/pets/${id}/dosage`, icon: Pill, label: "Calculate Dosage", color: "text-green-600 bg-green-50" },
    { to: `/pets/${id}/recipe`, icon: ClipboardList, label: "Generate Recipe", color: "text-orange-600 bg-orange-50" },
    { to: `/pets/${id}/tests`, icon: BookOpen, label: "Test History", color: "text-gray-600 bg-gray-50" },
  ];

  const handleDelete = () => {
    if (window.confirm(`Delete ${pet.name}? This cannot be undone.`)) {
      removePet(pet.id);
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Dog className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
              {pet.braf_status === "positive" && <Badge variant="warning">BRAF+</Badge>}
              {pet.braf_status === "negative" && <Badge variant="info">BRAF-</Badge>}
              {pet.braf_status === "unknown" && <Badge variant="muted">BRAF unknown</Badge>}
              {pet.msh2_loss && <Badge variant="danger">MSH2 loss</Badge>}
            </div>
            <p className="text-gray-500">
              {pet.breed} · {pet.weight_kg} kg{pet.age_years ? ` · ${pet.age_years}y` : ""}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 className="h-4 w-4 text-red-400" />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      {/* Alerts */}
      {petAlerts.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-red-800">Active Alerts</span>
          </div>
          {petAlerts.map((a, i) => (
            <p key={i} className="text-sm text-red-700">• {a.message}</p>
          ))}
        </div>
      )}

      {/* Clinical profile */}
      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Clinical Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400">BRAF Status</p>
              <p className="text-sm font-medium text-gray-800">{BRAF_STATUS_LABELS[pet.braf_status]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">MSH2</p>
              <p className="text-sm font-medium text-gray-800">{pet.msh2_loss ? "Loss detected" : "Intact"}</p>
            </div>
            {pet.prescribing_vet && (
              <div>
                <p className="text-xs text-gray-400">Prescribing Vet</p>
                <p className="text-sm font-medium text-gray-800">{pet.prescribing_vet}</p>
              </div>
            )}
            {pet.creatinine_mg_dl != null && (
              <div>
                <p className="text-xs text-gray-400">Creatinine</p>
                <p className="text-sm font-medium text-gray-800">{pet.creatinine_mg_dl} mg/dL</p>
              </div>
            )}
            {pet.alt_u_l != null && (
              <div>
                <p className="text-xs text-gray-400">ALT</p>
                <p className="text-sm font-medium text-gray-800">{pet.alt_u_l} U/L</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400">Test Sessions</p>
              <p className="text-sm font-medium text-gray-800">{sessions.length}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-800">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
