import { writable } from 'svelte/store';
import { db } from '$lib/db/dexie';
import { runRecurringEngine } from '$lib/features/transactions/services/recurringEngine';
import { queueSync } from '$lib/services/syncQueue';
import { createId } from '$lib/utils/id';
import type {
	RecurringDraft,
	RecurringTransactionRecord,
	TransactionDraft,
	TransactionRecord
} from '$lib/types';

const transactionsState = writable<TransactionRecord[]>([]);
const recurringState = writable<RecurringTransactionRecord[]>([]);

async function refreshTransactions() {
	const transactions = await db.transactions
		.filter((transaction) => transaction.deleted === 0)
		.toArray();
	const sorted = [...transactions].sort((left, right) => right.date.localeCompare(left.date));
	transactionsState.set(sorted);
	return sorted;
}

async function refreshRecurring() {
	const recurring = await db.recurring_transactions
		.filter((transaction) => transaction.deleted === 0)
		.toArray();
	const sorted = [...recurring].sort((left, right) =>
		right.start_date.localeCompare(left.start_date)
	);
	recurringState.set(sorted);
	return sorted;
}

export const transactionStore = {
	subscribe: transactionsState.subscribe,
	recurring: {
		subscribe: recurringState.subscribe
	},
	refreshTransactions,
	refreshRecurring,
	async create(draft: TransactionDraft) {
		const timestamp = new Date().toISOString();
		await db.transactions.put({
			id: createId('txn'),
			...draft,
			note: draft.note,
			created_at: timestamp,
			updated_at: timestamp,
			sync_status: 'pending',
			deleted: 0
		});
		queueSync();
		return refreshTransactions();
	},
	async update(id: string, draft: TransactionDraft) {
		await db.transactions.update(id, {
			...draft,
			updated_at: new Date().toISOString(),
			sync_status: 'pending'
		});
		queueSync();
		return refreshTransactions();
	},
	async remove(id: string) {
		await db.transactions.update(id, {
			deleted: 1,
			updated_at: new Date().toISOString(),
			sync_status: 'pending'
		});
		queueSync();
		return refreshTransactions();
	},
	async getById(id: string) {
		return db.transactions.get(id);
	},
	async createRecurring(draft: RecurringDraft) {
		const timestamp = new Date().toISOString();
		await db.recurring_transactions.put({
			id: createId('rec'),
			...draft,
			status: 'active',
			last_generated: null,
			created_at: timestamp,
			updated_at: timestamp,
			sync_status: 'pending',
			deleted: 0
		});
		await runRecurringEngine();
		await refreshTransactions();
		queueSync();
		return refreshRecurring();
	},
	async pauseRecurring(id: string) {
		await db.recurring_transactions.update(id, {
			status: 'paused',
			updated_at: new Date().toISOString(),
			sync_status: 'pending'
		});
		queueSync();
		return refreshRecurring();
	},
	async resumeRecurring(id: string) {
		await db.recurring_transactions.update(id, {
			status: 'active',
			updated_at: new Date().toISOString(),
			sync_status: 'pending'
		});
		await runRecurringEngine();
		await refreshTransactions();
		queueSync();
		return refreshRecurring();
	}
};
