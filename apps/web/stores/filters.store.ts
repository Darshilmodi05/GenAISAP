'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
  modules: string[];
  dateRange: { start: string; end: string } | null;
  severity: 'all' | 'critical' | 'warning' | 'info';
  companyCodes: string[];
  setModules: (modules: string[]) => void;
  setDateRange: (range: { start: string; end: string } | null) => void;
  setSeverity: (severity: 'all' | 'critical' | 'warning' | 'info') => void;
  setCompanyCodes: (codes: string[]) => void;
  resetFilters: () => void;
}

const initialFilters = {
  modules: ['FICO', 'MM', 'SD'],
  dateRange: null,
  severity: 'all' as const,
  companyCodes: ['1000', '2000'],
};

export const useFiltersStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialFilters,

      setModules: (modules) => set({ modules }),
      setDateRange: (dateRange) => set({ dateRange }),
      setSeverity: (severity) => set({ severity }),
      setCompanyCodes: (companyCodes) => set({ companyCodes }),
      resetFilters: () => set(initialFilters),
    }),
    {
      name: 'gensap-filters-storage',
      partialize: (state) => ({
        modules: state.modules,
        dateRange: state.dateRange,
        severity: state.severity,
        companyCodes: state.companyCodes,
      }),
    }
  )
);
