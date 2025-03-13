"use client";

import type React from "react";
import { useCounterStore } from "@/store/useCounterStore";

export const Counter: React.FC = () => {
	const { amount } = useCounterStore();

	return (
		<div className="sticky z-50 bg-white flex justify-end items-center gap-1 self-end">
			<span className="text-[10px] text-black">
				Potential claim earnings
			</span>
			<span className="text-xl font-medium ml-0.5">${amount}</span>
		</div>
	);
};
