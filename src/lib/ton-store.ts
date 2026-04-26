import { create } from "zustand";

export type TonView = "home" | "brand" | "jobs" | "tender" | "contributor";

interface TonStore {
  currentView: TonView;
  setView: (view: TonView) => void;
  jobFilters: {
    region: string;
    source: string;
  };
  setJobFilter: (key: string, value: string) => void;
  selectedTender: string | null;
  setSelectedTender: (id: string | null) => void;
  tenderAnalysisState: "idle" | "analyzing" | "complete";
  setTenderAnalysisState: (
    state: TonStore["tenderAnalysisState"]
  ) => void;
}

export const useTonStore = create<TonStore>((set) => ({
  currentView: "home",
  setView: (view) => set({ currentView: view }),
  jobFilters: {
    region: "all",
    source: "all",
  },
  setJobFilter: (key, value) =>
    set((state) => ({
      jobFilters: { ...state.jobFilters, [key]: value },
    })),
  selectedTender: null,
  setSelectedTender: (id) =>
    set({ selectedTender: id, tenderAnalysisState: id ? "analyzing" : "idle" }),
  tenderAnalysisState: "idle",
  setTenderAnalysisState: (tenderAnalysisState) => set({ tenderAnalysisState }),
}));
