import type { CategoryRecord, TransactionRecord } from '$lib/types';

function escapeCell(value: string | number) {
	const stringified = String(value ?? '');
	return `"${stringified.replaceAll('"', '""')}"`;
}

export function transactionsToCsv(
	transactions: TransactionRecord[],
	categories: Map<string, CategoryRecord>
) {
	const header = ['Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Note'];
	const rows = transactions.map((transaction) => [
		transaction.date,
		transaction.type,
		categories.get(transaction.category_id)?.name ?? 'Unknown',
		transaction.amount,
		transaction.payment_method,
		transaction.note
	]);

	return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
}
