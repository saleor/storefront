import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CortexData {
	cortexCloudUsername: string;
	cortexFollowConfirmed: boolean;
}

interface CortexDataStore {
	cortexData: CortexData | null;
	setCortexData: (data: CortexData) => void;
	clearCortexData: () => void;
}

export const useCortexDataStore = create<CortexDataStore>()(
	persist(
		(set) => ({
			cortexData: null,
			setCortexData: (data) => set({ cortexData: data }),
			clearCortexData: () => set({ cortexData: null }),
		}),
		{
			name: "cortex-data-storage",
			storage: createJSONStorage(() => {
				// Use sessionStorage for temporary persistence during checkout
				// This ensures data persists during redirects but clears after browser closes
				if (typeof window !== "undefined") {
					return sessionStorage;
				}
				// Fallback for SSR
				return {
					getItem: () => null,
					setItem: () => {},
					removeItem: () => {},
				};
			}),
		},
	),
);
