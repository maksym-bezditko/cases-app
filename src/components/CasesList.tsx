import type { FC } from "react";
import { CaseItem } from "./CaseItem";
import casesData from "@/data/cases.json";
import type { Case, CaseJSON } from "@/types/case";

// Convert string dates from JSON to Date objects
const CASES: Case[] = (casesData as CaseJSON[]).map((caseItem) => ({
	...caseItem,
	close_date: new Date(caseItem.close_date),
}));

export const CasesList: FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-1 mt-6">
			{CASES.map((caseItem) => (
				<CaseItem
					key={caseItem.id}
					name={caseItem.name}
					description={caseItem.description}
					proof_needed={caseItem.proof_needed}
					close_date={caseItem.close_date}
					payout_amount={caseItem.payout_amount}
				/>
			))}
		</div>
	);
};
