import type React from "react";
import { Counter } from "./Counter";
import { CasesListWrapper } from "./CasesListWrapper";

export const HomePage: React.FC = () => {
	return (
		<div className="p-4 relative flex flex-col gap-9 items-center">
			<Counter />
			<CasesListWrapper />
		</div>
	);
};
