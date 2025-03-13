import { create } from "zustand";

interface AnimationQueueItem {
	amount: number;
	timestamp: number;
}

interface CounterState {
	amount: number;
	extraAmount?: number;
	selectedCases: number[];
	isAnimating: boolean;
	animationAmount: number | null;
	animationQueue: AnimationQueueItem[];
	increment: (value: number) => void;
	toggleCase: (caseId: number, amount: number) => void;
	startAnimation: (amount: number) => void;
	endAnimation: () => void;
	processNextAnimation: () => void;
}

export const useCounterStore = create<CounterState>((set, get) => ({
	amount: 0,
	extraAmount: undefined,
	selectedCases: [],
	isAnimating: false,
	animationAmount: null,
	animationQueue: [],

	increment: (value: number) =>
		set((state) => ({ amount: state.amount + value })),

	toggleCase: (caseId: number, amount: number) =>
		set((state) => {
			const isSelected = state.selectedCases.includes(caseId);

			if (isSelected) {
				return {
					selectedCases: state.selectedCases.filter(
						(id) => id !== caseId
					),
					amount: state.amount - amount,
				};
			}

			if (state.isAnimating) {
				return {
					selectedCases: [...state.selectedCases, caseId],
					amount: state.amount + amount,
					animationQueue: [
						...state.animationQueue,
						{ amount, timestamp: Date.now() },
					],
				};
			}

			return {
				selectedCases: [...state.selectedCases, caseId],
				amount: state.amount + amount,
				isAnimating: true,
				animationAmount: amount,
			};
		}),

	startAnimation: (amount: number) =>
		set(() => ({
			isAnimating: true,
			animationAmount: amount,
		})),

	endAnimation: () =>
		set((state) => {
			if (state.animationQueue.length > 0) {
				const [nextAnimation, ...remainingQueue] = state.animationQueue;
				return {
					isAnimating: true,
					animationAmount: nextAnimation.amount,
					animationQueue: remainingQueue,
				};
			}

			return {
				isAnimating: false,
				animationAmount: null,
				animationQueue: [],
			};
		}),

	processNextAnimation: () => {
		const state = get();
		if (state.animationQueue.length === 0) {
			set({
				isAnimating: false,
				animationAmount: null,
			});
			return;
		}

		const [nextAnimation, ...remainingQueue] = state.animationQueue;
		set({
			animationQueue: remainingQueue,
			animationAmount: nextAnimation.amount,
			isAnimating: true,
		});
	},
}));