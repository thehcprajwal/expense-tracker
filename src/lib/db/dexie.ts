import Dexie, { type Table } from 'dexie';
import type {
	CategoryRecord,
	RecurringTransactionRecord,
	SettingsRecord,
	SyncMetadataRecord,
	TransactionRecord
} from '$lib/types';
import { TABLES } from '$lib/db/schema';

class ExpenseTrackerDatabase extends Dexie {
	transactions!: Table<TransactionRecord, string>;
	categories!: Table<CategoryRecord, string>;
	recurring_transactions!: Table<RecurringTransactionRecord, string>;
	sync_metadata!: Table<SyncMetadataRecord, string>;
	settings!: Table<SettingsRecord, string>;

	constructor() {
		super('expense_tracker_db');

		this.version(1).stores(TABLES);
		this.version(2)
			.stores(TABLES)
			.upgrade(async (tx) => {
				await tx
					.table('recurring_transactions')
					.toCollection()
					.modify((record: Partial<RecurringTransactionRecord>) => {
						if (!record.status) {
							record.status = 'active';
						}
					});
			});
	}
}

export const db = new ExpenseTrackerDatabase();
