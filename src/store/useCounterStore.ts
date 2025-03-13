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
				// If already selected, deselect it - no animation when deselecting
				return {
					selectedCases: state.selectedCases.filter(
						(id) => id !== caseId
					),
					amount: state.amount - amount,
				};
			}

			// If not selected and we're selecting for the first time:
			if (state.isAnimating) {
				// If an animation is already running, queue this one
				return {
					selectedCases: [...state.selectedCases, caseId],
					amount: state.amount + amount,
					animationQueue: [
						...state.animationQueue,
						{ amount, timestamp: Date.now() },
					],
				};
			}

			// No animation running, start one immediately
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
			// Check if there are more animations in the queue
			if (state.animationQueue.length > 0) {
				// Process the next animation automatically
				get().processNextAnimation();
				return { isAnimating: true }; // Keep animation state on
			}

			// No more animations, turn off animation state
			return {
				isAnimating: false,
				animationAmount: null,
			};
		}),

	processNextAnimation: () => {
		const state = get();
		if (state.animationQueue.length === 0) return;

		// Get the next animation from the queue
		const [nextAnimation, ...remainingQueue] = state.animationQueue;

		// Start the next animation
		set({
			animationQueue: remainingQueue,
			animationAmount: nextAnimation.amount,
		});
	},
}));