import type React from "react";
import { Counter } from "@/components/Counter";
import { CasesListWrapper } from "@/components/CasesListWrapper";

export const HomePage: React.FC = () => {
	return (
		<div className="p-4 relative flex flex-col gap-9 items-center">
			<Counter amount={0} />
			<CasesListWrapper />
		</div>
	);
};
