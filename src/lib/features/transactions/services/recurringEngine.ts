import { db } from '$lib/db/dexie';
import { createId } from '$lib/utils/id';
import { shiftByFrequency, todayIso } from '$lib/utils/date';
import type { RecurringTransactionRecord, TransactionRecord } from '$lib/types';

async function materializeTransaction(recurring: RecurringTransactionRecord, date: string) {
	const timestamp = new Date().toISOString();

	const transaction: TransactionRecord = {
		id: createId('txn'),
		amount: recurring.amount,
		type: recurring.type,
		category_id: recurring.category_id,
		payment_method: recurring.payment_method,
		date,
		note: recurring.note || recurring.name,
		created_at: timestamp,
		updated_at: timestamp,
		sync_status: 'pending',
		deleted: 0
	};

	await db.transactions.put(transaction);
}

export async function runRecurringEngine() {
	const recurringItems = await db.recurring_transactions
		.filter((item) => item.deleted === 0)
		.toArray();
	const today = todayIso();

	for (const recurring of recurringItems) {
		if (recurring.status === 'paused') continue;

		let nextDate = recurring.last_generated
			? shiftByFrequency(recurring.last_generated, recurring.frequency)
			: recurring.start_date;

		while (nextDate <= today) {
			await materializeTransaction(recurring, nextDate);
			recurring.last_generated = nextDate;
			recurring.updated_at = new Date().toISOString();
			recurring.sync_status = 'pending';
			nextDate = shiftByFrequency(nextDate, recurring.frequency);
		}

		await db.recurring_transactions.put(recurring);
	}
}
