import type React from "react";
import { CasesList } from "@/components/CasesList";
export const CasesListWrapper: React.FC = () => {
	return (
		<div className="mt-12  text-left md:w-[760px] flex flex-col">
			<h1 className="text-2xl text-black font-semibold">
				Did you buy any of these products?
			</h1>
			<h4 className="text-sm text-gray-500 pt-1 font-medium">
				Select all claims you believe you qualify for
			</h4>
			<CasesList />
		</div>
	);
};
