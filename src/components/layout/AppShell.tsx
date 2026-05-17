import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AlertBanner } from "./AlertBanner";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AlertBanner />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
