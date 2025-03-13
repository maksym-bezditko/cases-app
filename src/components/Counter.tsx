import type React from "react";

interface CounterProps {
	amount: number;
	extraAmount?: number;
}

export const Counter: React.FC<CounterProps> = ({ amount }: CounterProps) => {
	return (
		<div className="sticky  z-50 bg-white flex justify-end items-center gap-1 self-end">
			<span className="text-[10px] text-black">
				Potential claim earnings
			</span>
			<span className="text-xl font-medium ml-0.5">${amount}</span>
			{/* {extraAmount && (
				<span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium ml-1">
					+{extraAmount}
				</span>
			)} */}
		</div>
	);
};
