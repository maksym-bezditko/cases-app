import { expect, test, describe, beforeEach } from "bun:test";
import { useCounterStore } from "./useCounterStore";

// Reset the store before each test
beforeEach(() => {
	// Get the store's setState function
	const { setState } = useCounterStore;

	// Reset to initial state
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
			// Initial state check
			expect(useCounterStore.getState().amount).toBe(0);

			// Call the increment function
			useCounterStore.getState().increment(5);

			// Check if state was updated correctly
			expect(useCounterStore.getState().amount).toBe(5);

			// Increment again to ensure it adds to the current value
			useCounterStore.getState().increment(3);

			// Verify final state
			expect(useCounterStore.getState().amount).toBe(8);
		});

		test("should handle negative values correctly", () => {
			// Set initial state to a positive value
			useCounterStore.setState({ amount: 10 });

			// Call increment with a negative value
			useCounterStore.getState().increment(-7);

			// Verify state was updated correctly
			expect(useCounterStore.getState().amount).toBe(3);
		});

		test("should handle zero values", () => {
			// Set initial state
			useCounterStore.setState({ amount: 5 });

			// Call increment with zero
			useCounterStore.getState().increment(0);

			// Verify state remains unchanged
			expect(useCounterStore.getState().amount).toBe(5);
		});
	});
});
