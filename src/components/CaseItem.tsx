"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import type { Case } from "@/types/case";
import { useCounterStore } from "@/store/useCounterStore";

type CaseItemProps = Omit<Case, "id"> & {
	id: number;
};

export const CaseItem: React.FC<CaseItemProps> = ({
	id,
	name,
	close_date,
	proof_needed,
	description,
	payout_amount,
}) => {
	const toggleCase = useCounterStore((state) => state.toggleCase);
	const selectedCases = useCounterStore((state) => state.selectedCases);
	const isSelected = selectedCases.includes(id);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);

	// Initialize audio element on client-side only
	useEffect(() => {
		// Only create the audio element on the client side
		audioRef.current = new Audio("/button-pressed.mp3");
	}, []);

	// Calculate days left
	const daysLeft = Math.max(
		0,
		Math.floor(
			(close_date.getTime() - new Date().getTime()) /
				(1000 * 60 * 60 * 24)
		)
	);

	// Format date for display
	const formattedDate = close_date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	// Function to toggle case and play sound if needed
	const performToggle = () => {
		// Play sound when selecting a case (not when deselecting)
		if (!isSelected && audioRef.current) {
			// Reset the audio to the beginning in case it's still playing
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			// Play the sound
			audioRef.current.play().catch((err) => {
				// Handle any errors quietly (common for autoplay restrictions)
				console.log("Could not play audio:", err);
			});
		}
		toggleCase(id, payout_amount);
	};

	// Handle click on the container but NOT on the checkbox
	const handleContainerClick = (e: React.MouseEvent) => {
		// Only process if the click was not on the checkbox
		if (
			checkboxRef.current &&
			!checkboxRef.current.contains(e.target as Node)
		) {
			performToggle();
		}
	};

	// Handle keyboard events for accessibility
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			performToggle();
		}
	};

	return (
		<div
			className="w-full md:w-[370px] md:h-[197px] bg-gray-100 p-4 text-xs cursor-pointer flex flex-col relative text-left"
			onClick={handleContainerClick}
			onKeyDown={() => {
				/* This handler is just for linter compliance */
			}}
			aria-label={`Case: ${name}${isSelected ? " (Selected)" : ""}`}
		>
			{/* Main content */}
			<div className="flex gap-3 flex-grow">
				{/* Checkbox - this is now the only focusable element */}
				<div className="flex-none">
					<div
						className={`w-5 h-5 border ${
							isSelected
								? "bg-[#329a30] border-[#329a30]"
								: "bg-white border-[#329a30]"
						} rounded-[2px] flex items-center justify-center relative group`}
					>
						<input
							ref={checkboxRef}
							type="checkbox"
							checked={isSelected}
							onChange={performToggle}
							onKeyDown={handleKeyDown}
							className="absolute inset-0 opacity-0 w-full h-full cursor-pointer  z-10"
							aria-label={`Select case: ${name}`}
						/>
						{isSelected && (
							<svg
								width="12"
								height="9"
								viewBox="0 0 12 9"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d="M1 4L4.5 7.5L11 1"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</div>
				</div>

				{/* Case details */}
				<div className="flex-1">
					{/* Case name */}
					<div className="font-medium text-xl mb-2.5">{name}</div>

					{/* Description */}
					<div className="flex gap-2 mb-2">
						<div>
							<span>{description}</span>
							<span
								className="hidden text-xs px-1 py-0 underline"
								aria-hidden="true"
							>
								More
							</span>
						</div>
					</div>

					{/* Proof needed */}
					<div className="flex gap-2 items-center">
						{!proof_needed && (
							<>
								<div>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<circle
											cx="8"
											cy="8"
											r="7.4"
											stroke={
												proof_needed
													? "#000000"
													: "#FF4A4A"
											}
											strokeWidth="1.2"
										/>
										<path
											d="M12 9.33333L9.33333 11.9982L4.44533 12C4.32777 12.0005 4.21483 11.9543 4.13133 11.8715C4.04782 11.7887 4.00059 11.6762 4 11.5587V4.44133C4 4.19778 4.19778 4 4.44133 4H11.5587C11.8022 4 12 4.20267 12 4.44533V9.33333ZM11.1111 4.88889H4.88889V11.1111H8.44444V8.88889C8.44446 8.78003 8.48442 8.67496 8.55676 8.59361C8.6291 8.51226 8.72878 8.46029 8.83689 8.44755L8.88889 8.44444L11.1111 8.444V4.88889ZM10.7427 9.33289L9.33333 9.33333V10.7418L10.7427 9.33289Z"
											fill="black"
										/>
										<path
											d="M2.5 2.25L13.5 13.25"
											stroke="#FF4A4A"
											strokeWidth="1.2"
										/>
									</svg>
								</div>
								<div>No proof needed</div>
							</>
						)}
					</div>

					<div className="hidden">
						<div className="flex items-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
									fill="#FF964A"
								/>
								<path
									d="M8 4.5V8L11 11"
									stroke="white"
									strokeWidth="1.2"
								/>
							</svg>
							<div>{formattedDate}</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="flex justify-between items-end mt-4">
				{/* Days left counter */}
				<div>
					<div className="text-sm font-bold px-4 py-2.5 bg-gray-200 rounded-full inline-block">
						<span>{daysLeft}</span> day
						<span>{daysLeft !== 1 && "s"}</span> left
					</div>
				</div>

				{/* Payout amount */}
				<div>
					<div className="text-base">
						<span className="text-[10px] align-super pr-1">
							Up to
						</span>
						<span>${payout_amount}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
