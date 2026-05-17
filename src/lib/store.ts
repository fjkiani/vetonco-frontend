/**
 * VetOnco — Zustand store with localStorage persistence
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pet } from "../types/pet";
import type { TraceEvent, AgentRunResult, MonitoringAlert, TestSession } from "../types/agent";

interface ActiveRun {
  petId: string | null;
  status: "idle" | "running" | "complete" | "error";
  pendingNodes: string[];
  runningNode: string | null;
  trace: TraceEvent[];
  result: AgentRunResult | null;
  error: string | null;
}

interface VetOncoStore {
  // Pets
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  removePet: (id: string) => void;
  getPet: (id: string) => Pet | undefined;

  // Active agent run
  activeRun: ActiveRun;
  startRun: (petId: string, nodes: string[]) => void;
  setRunningNode: (node: string) => void;
  appendTrace: (event: TraceEvent) => void;
  completeRun: (result: AgentRunResult) => void;
  failRun: (error: string) => void;
  resetRun: () => void;

  // Monitoring alerts
  alerts: MonitoringAlert[];
  setAlerts: (petId: string, alerts: MonitoringAlert[]) => void;
  dismissAlert: (alertId: string) => void;

  // Test history (petId → sessions)
  testHistory: Record<string, TestSession[]>;
  addTestSession: (petId: string, session: TestSession) => void;
  getTestHistory: (petId: string) => TestSession[];
}

const INITIAL_RUN: ActiveRun = {
  petId: null,
  status: "idle",
  pendingNodes: [],
  runningNode: null,
  trace: [],
  result: null,
  error: null,
};

export const useStore = create<VetOncoStore>()(
  persist(
    (set, get) => ({
      // Pets
      pets: [],
      addPet: (pet) => set((s) => ({ pets: [...s.pets, pet] })),
      updatePet: (id, updates) =>
        set((s) => ({ pets: s.pets.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      removePet: (id) => set((s) => ({ pets: s.pets.filter((p) => p.id !== id) })),
      getPet: (id) => get().pets.find((p) => p.id === id),

      // Active run (NOT persisted — ephemeral)
      activeRun: INITIAL_RUN,
      startRun: (petId, nodes) =>
        set({ activeRun: { ...INITIAL_RUN, petId, status: "running", pendingNodes: nodes } }),
      setRunningNode: (node) =>
        set((s) => ({
          activeRun: {
            ...s.activeRun,
            runningNode: node,
            pendingNodes: s.activeRun.pendingNodes.filter((n) => n !== node),
          },
        })),
      appendTrace: (event) =>
        set((s) => ({
          activeRun: {
            ...s.activeRun,
            runningNode: null,
            trace: [...s.activeRun.trace, event],
          },
        })),
      completeRun: (result) =>
        set((s) => ({ activeRun: { ...s.activeRun, status: "complete", result, runningNode: null } })),
      failRun: (error) =>
        set((s) => ({ activeRun: { ...s.activeRun, status: "error", error, runningNode: null } })),
      resetRun: () => set({ activeRun: INITIAL_RUN }),

      // Alerts
      alerts: [],
      setAlerts: (_petId, alerts) => set({ alerts }),
      dismissAlert: (alertId) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.alert_id !== alertId) })),

      // Test history
      testHistory: {},
      addTestSession: (petId, session) =>
        set((s) => ({
          testHistory: {
            ...s.testHistory,
            [petId]: [...(s.testHistory[petId] || []), session],
          },
        })),
      getTestHistory: (petId) => get().testHistory[petId] || [],
    }),
    {
      name: "vetonco-store",
      // Only persist pets and test history — not ephemeral run state
      partialize: (s) => ({ pets: s.pets, testHistory: s.testHistory }),
    }
  )
);
