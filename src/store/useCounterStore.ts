import { create } from "zustand";

interface CounterState {
	amount: number;
	extraAmount?: number;
	selectedCases: number[];
	isAnimating: boolean;
	animationAmount: number | null;
	increment: (value: number) => void;
	toggleCase: (caseId: number, amount: number) => void;
	startAnimation: (amount: number) => void;
	endAnimation: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
	amount: 0,
	extraAmount: undefined,
	selectedCases: [],
	isAnimating: false,
	animationAmount: null,
	increment: (value: number) =>
		set((state) => ({ amount: state.amount + value })),
	toggleCase: (caseId: number, amount: number) =>
		set((state) => {
			const isSelected = state.selectedCases.includes(caseId);

			if (isSelected) {
				// If already selected, remove it and subtract the amount
				return {
					selectedCases: state.selectedCases.filter(
						(id) => id !== caseId
					),
					amount: state.amount - amount,
				};
			}

			// If not selected:
			// 1. Update state immediately (amount & selectedCases)
			// 2. Start animation to visually represent the change
			return {
				selectedCases: [...state.selectedCases, caseId],
				amount: state.amount + amount, // Update amount IMMEDIATELY
				isAnimating: true, // Start animation
				animationAmount: amount, // Amount to show in animation
			};
		}),
	startAnimation: (amount: number) =>
		set((state) => ({
			isAnimating: true,
			animationAmount: amount,
			// Note: amount is already updated prior to this
		})),
	endAnimation: () =>
		set({
			isAnimating: false,
			animationAmount: null,
			// Counter is already updated, just ending animation
		}),
}));
