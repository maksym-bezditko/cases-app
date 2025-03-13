"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Case } from "@/types/case";
import { useCounterStore } from "@/store/useCounterStore";
import { motion, AnimatePresence } from "framer-motion";

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
	const backdropRef = useRef<HTMLDivElement>(null);
	// Add state for modal visibility
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// Initialize audio element on client-side only
	useEffect(() => {
		// Only create the audio element on the client side
		audioRef.current = new Audio("/button-pressed.mp3");
	}, []);

	useEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isModalOpen) {
				closeModal();
			}
		};

		// Add event listener when modal is open
		if (isModalOpen) {
			document.addEventListener("keydown", handleEscKey);
		}

		// Clean up event listener when modal closes or component unmounts
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [isModalOpen]);

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
			console.log(name);
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

	// Function to truncate text
	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text;
		return `${text.slice(0, maxLength)}...`;
	};

	// Function to handle More button click
	const handleMoreClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent triggering the container click
		setIsModalOpen(true);
		// Block scroll on body when modal is open
		document.body.style.overflow = "hidden";
	};

	// Function to close modal
	const closeModal = () => {
		setIsModalOpen(false);
		// Restore scrolling when modal is closed
		// We'll let this happen after animation in the AnimatePresence onExitComplete
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (backdropRef.current === e.target) {
			e.stopPropagation();
			closeModal();
		}
	};

	// Handle dialog keyboard events
	const handleDialogKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			closeModal();
		}
	};

	// Determine if description needs truncation
	const isTruncated = description.length > 116;
	const truncatedDescription = isTruncated
		? truncateText(description, 116)
		: description;

	// Animation variants for the dialog
	const dialogVariants = {
		hidden: {
			opacity: 0,
			y: 20,
			transition: {
				duration: 0.25,
				ease: "easeIn",
			},
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeOut",
			},
		},
	};

	// Animation variants for the backdrop
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
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
							className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
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
							<span>{truncatedDescription}</span>
							{isTruncated && (
								<button
									type="button"
									className="text-xs px-1 py-0 underline cursor-pointer"
									onClick={handleMoreClick}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" ||
											e.key === " "
										) {
											e.preventDefault();
											handleMoreClick(
												e as unknown as React.MouseEvent
											);
										}
									}}
									aria-label="Show more details about this case"
								>
									More
								</button>
							)}
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

			{/* Modal with Framer Motion for animations */}
			<AnimatePresence
				onExitComplete={() => {
					// Restore scrolling after exit animation is complete
					document.body.style.overflow = "";
				}}
			>
				{isModalOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							ref={backdropRef}
							className="fixed inset-0 bg-black/70 z-50 cursor-auto"
							onClick={handleBackdropClick}
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={backdropVariants}
						/>

						{/* Dialog - Fixed positioning for better mobile support */}
						<motion.div
							className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[500px] p-6 rounded-lg shadow-lg w-[90%] max-h-[80vh] overflow-y-auto bg-white cursor-auto"
							aria-modal="true"
							aria-labelledby={`case-description-${id}`}
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={dialogVariants}
							onKeyDown={handleDialogKeyDown}
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								className="absolute top-3 left-3 text-gray-500 hover:text-gray-800"
								onClick={closeModal}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										closeModal();
									}
								}}
								aria-label="Close modal"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<title>Close</title>
									<path
										d="M18 6L6 18"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M6 6L18 18"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							<h3
								id={`case-description-${id}`}
								className="text-base font-bold mb-4 text-center"
							>
								{name}
							</h3>
							<p className="text-sm mb-4">{description}</p>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};