export interface Case {
	id: number;
	name: string;
	description: string;
	proof_needed: boolean;
	close_date: Date;
	payout_amount: string;
}

export interface CaseJSON {
	id: number;
	name: string;
	description: string;
	proof_needed: boolean;
	close_date: string; // In JSON, dates are stored as strings
	payout_amount: string;
}
