import { create } from "zustand";

type AppStore = {
  sidebarOpen: boolean;
  appLoading: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setAppLoading: (loading: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: false,
  appLoading: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setAppLoading: (loading) => set({ appLoading: loading }),
}));
