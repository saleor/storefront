import "server-only";

export type SaleorLedgerEntry = {
	op: string;
	mode: string;
	auth: string;
	ok: boolean;
	ms: number;
	at: string;
};

const MAX_ENTRIES = 200;

type LedgerState = {
	entries: SaleorLedgerEntry[];
};

const state: LedgerState = { entries: [] };

export function saleorLedgerEnabled(): boolean {
	return process.env.NODE_ENV === "development" || process.env.PAPER_SALEOR_LEDGER === "1";
}

export function recordSaleorCall(entry: Omit<SaleorLedgerEntry, "at">): void {
	if (!saleorLedgerEnabled()) return;

	const full: SaleorLedgerEntry = { ...entry, at: new Date().toISOString() };
	state.entries.push(full);
	if (state.entries.length > MAX_ENTRIES) {
		state.entries.splice(0, state.entries.length - MAX_ENTRIES);
	}

	console.log(`[paper:saleor] op=${full.op} mode=${full.mode} auth=${full.auth} ok=${full.ok} ms=${full.ms}`);
}

export function recentSaleorCalls(): readonly SaleorLedgerEntry[] {
	return state.entries;
}

export function resetSaleorLedger(): void {
	state.entries.length = 0;
}
