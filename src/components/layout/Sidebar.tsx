import { NavLink, useParams } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  Dog,
  FlaskConical,
  Pill,
  ClipboardList,
  BookOpen,
  ChevronRight,
  Activity,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useStore } from "../../lib/store";

const topNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

function PetNav({ petId }: { petId: string }) {
  const pet = useStore((s) => s.getPet(petId));
  const name = pet?.name ?? "Pet";

  const links = [
    { to: `/pets/${petId}`, icon: Dog, label: "Overview", end: true },
    { to: `/pets/${petId}/analyze`, icon: Activity, label: "Agent Analysis" },
    { to: `/pets/${petId}/compounds`, icon: FlaskConical, label: "Compounds" },
    { to: `/pets/${petId}/dosage`, icon: Pill, label: "Dosage" },
    { to: `/pets/${petId}/recipe`, icon: ClipboardList, label: "Recipe" },
    { to: `/pets/${petId}/tests`, icon: BookOpen, label: "Test History" },
  ];

  return (
    <div className="mt-4">
      <div className="px-3 mb-1 flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <ChevronRight className="h-3 w-3" />
        {name}
      </div>
      {links.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mx-1",
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )
          }
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { id: petId } = useParams<{ id: string }>();

  return (
    <aside className="flex flex-col w-56 bg-gray-900 min-h-screen">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Dog className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">VetOnco</div>
            <div className="text-gray-400 text-xs">Canine TCC</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1">
        {topNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mx-1",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        {petId && <PetNav petId={petId} />}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-700 flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <span className="text-gray-400 text-xs">Account</span>
      </div>
    </aside>
  );
}
