"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCounterStore } from "@/store/useCounterStore";

export const Counter: React.FC = () => {
	const { amount, isAnimating, animationAmount, endAnimation } =
		useCounterStore();
	const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	// Track if counter is visible
	const [isCounterVisible, setIsCounterVisible] = useState(true);

	// Track amount changes and update display value appropriately
	useEffect(() => {
		// If not animating, immediately show the current amount
		if (!isAnimating) {
			setIsCounterVisible(true);
		} else {
			// If animation starts, hide the counter first
			setIsCounterVisible(false);
		}
	}, [isAnimating]);

	// Set up the animation timeout
	useEffect(() => {
		if (isAnimating && animationAmount !== null) {
			// Clear any existing timeout
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}

			// Set a new timeout to end the animation after specified duration
			animationTimeoutRef.current = setTimeout(() => {
				// End the animation
				endAnimation();
				// Updated value is already in amount, just make it visible
				setIsCounterVisible(true);
			}, 400);
		}

		// Cleanup on unmount
		return () => {
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, [isAnimating, animationAmount, endAnimation]);

	return (
		<div className="sticky top-0 z-50 bg-white flex justify-end items-center gap-1 self-end py-2 px-4 w-full">
			<span className="text-[10px] text-black">
				Potential claim earnings
			</span>

			<div className="relative h-8 flex items-center">
				{/* Counter value container with minimum width to prevent layout shifts */}
				<div className="flex justify-end min-w-[80px]">
					{/* Counter value - this is already updated in state but conditionally visible */}
					<AnimatePresence mode="wait">
						{isCounterVisible ? (
							<motion.span
								key="amount"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="text-xl font-medium ml-0.5"
							>
								${amount}
							</motion.span>
						) : (
							<span
								className="text-xl font-medium ml-0.5 opacity-0"
								aria-hidden="true"
							>
								${amount}
							</span>
						)}
					</AnimatePresence>
				</div>

				{/* Animation for the increment amount */}
				<AnimatePresence>
					{isAnimating && animationAmount !== null && (
						<motion.span
							key="animation"
							className="text-2xl font-medium text-[#198754] absolute right-0 top-0"
							initial={{
								scale: 2.5,
								x: 20, // Offset to the right
							}}
							animate={{
								scale: 1,
								x: 0,
								transformOrigin: "right top",
							}}
							transition={{
								duration: 0.4,
								ease: "easeInOut",
							}}
							onAnimationComplete={() => {
								// When animation completes, show the counter
								setIsCounterVisible(true);
							}}
						>
							+${animationAmount}
						</motion.span>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};
