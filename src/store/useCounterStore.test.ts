import { expect, test, describe, beforeEach } from "bun:test";
import { useCounterStore } from "./useCounterStore";

beforeEach(() => {
	const { setState } = useCounterStore;

	setState({
		amount: 0,
		extraAmount: undefined,
		selectedCases: [],
		isAnimating: false,
		animationAmount: null,
		animationQueue: [],
		increment: useCounterStore.getState().increment,
		toggleCase: useCounterStore.getState().toggleCase,
		startAnimation: useCounterStore.getState().startAnimation,
		endAnimation: useCounterStore.getState().endAnimation,
		processNextAnimation: useCounterStore.getState().processNextAnimation,
	});
});

describe("useCounterStore", () => {
	describe("increment", () => {
		test("should increment the amount by the given value", () => {
			expect(useCounterStore.getState().amount).toBe(0);

			useCounterStore.getState().increment(5);

			expect(useCounterStore.getState().amount).toBe(5);

			useCounterStore.getState().increment(3);

			expect(useCounterStore.getState().amount).toBe(8);
		});

		test("should handle negative values correctly", () => {
			useCounterStore.setState({ amount: 10 });

			useCounterStore.getState().increment(-7);

			expect(useCounterStore.getState().amount).toBe(3);
		});

		test("should handle zero values", () => {
			useCounterStore.setState({ amount: 5 });

			useCounterStore.getState().increment(0);

			expect(useCounterStore.getState().amount).toBe(5);
		});
	});
});
