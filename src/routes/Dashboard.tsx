import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Plus, Dog, Activity, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useStore } from "../lib/store";

export function Dashboard() {
  const { user } = useUser();
  const pets = useStore((s) => s.pets);
  const alerts = useStore((s) => s.alerts);

  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL" || a.severity === "HIGH");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-gray-500 mt-1">Canine TCC oncology dashboard</p>
        </div>
        <Link to="/pets/new">
          <Button icon={<Plus className="h-4 w-4" />}>Add Patient</Button>
        </Link>
      </div>

      {/* Critical alerts */}
      {criticalAlerts.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-red-800">{criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? "s" : ""}</span>
          </div>
          {criticalAlerts.slice(0, 3).map((a, i) => (
            <p key={i} className="text-sm text-red-700">• {a.message}</p>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-gray-900">{pets.length}</p>
            <p className="text-sm text-gray-500 mt-1">Patients</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-gray-900">{criticalAlerts.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active Alerts</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {pets.filter((p) => p.braf_status === "positive").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">BRAF+ Patients</p>
          </CardBody>
        </Card>
      </div>

      {/* Patient list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Patients</h2>
        {pets.length === 0 ? (
          <div className="text-center py-16 rounded-xl border-2 border-dashed border-gray-200">
            <Dog className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No patients yet</p>
            <Link to="/pets/new">
              <Button icon={<Plus className="h-4 w-4" />}>Add first patient</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pets.map((pet) => (
              <Link key={pet.id} to={`/pets/${pet.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardBody className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Dog className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                        {pet.braf_status === "positive" && <Badge variant="warning">BRAF+</Badge>}
                        {pet.braf_status === "negative" && <Badge variant="info">BRAF-</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">{pet.breed} · {pet.weight_kg} kg</p>
                    </div>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
