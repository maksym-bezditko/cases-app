import { create } from "zustand";

interface CounterState {
	amount: number;
	extraAmount?: number;
	increment: (value: number) => void;
	reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
	amount: 0,
	extraAmount: undefined,
	increment: (value: number) =>
		set((state) => ({ amount: state.amount + value })),
	reset: () => set({ amount: 0, extraAmount: undefined }),
}));
