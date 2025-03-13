export interface Case {
	id: number;
	name: string;
	description: string;
	proof_needed: boolean;
	close_date: Date;
	payout_amount: number;
}

export interface CaseJSON {
	id: number;
	name: string;
	description: string;
	proof_needed: boolean;
	close_date: string;
	payout_amount: number;
}
