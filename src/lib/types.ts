export type TransactionType = 'income' | 'expense';
export type SyncStatus = 'pending' | 'synced';
export type CategoryType = TransactionType;
export type RecurringFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type RecurringStatus = 'active' | 'paused';
export type PaymentMethod = 'Cash' | 'UPI' | 'Credit Card' | 'Bank Transfer';

export interface TransactionRecord {
	id: string;
	amount: number;
	type: TransactionType;
	category_id: string;
	payment_method: PaymentMethod;
	date: string;
	note: string;
	created_at: string;
	updated_at: string;
	sync_status: SyncStatus;
	deleted: 0 | 1;
}

export interface CategoryRecord {
	id: string;
	name: string;
	type: CategoryType;
	icon: string;
	color: string;
	created_at: string;
	updated_at: string;
	sync_status: SyncStatus;
	deleted: 0 | 1;
}

export interface RecurringTransactionRecord {
	id: string;
	name: string;
	amount: number;
	type: TransactionType;
	category_id: string;
	payment_method: PaymentMethod;
	frequency: RecurringFrequency;
	status: RecurringStatus;
	start_date: string;
	last_generated: string | null;
	note: string;
	created_at: string;
	updated_at: string;
	sync_status: SyncStatus;
	deleted: 0 | 1;
}

export interface SyncMetadataRecord {
	id: 'primary';
	last_sync: string | null;
	last_attempt: string | null;
	device_id: string;
	pending_changes: number;
	status: 'idle' | 'success' | 'offline' | 'disabled' | 'error';
	message: string;
}

export interface SettingsRecord {
	id: 'primary';
	theme: 'light' | 'dark';
	currency: string;
	autoSyncDays: number;
}

export interface UserState {
	id: string | null;
	name: string;
	email: string | null;
	mode: 'guest' | 'authenticated';
}

export interface CategorySeed {
	name: string;
	type: CategoryType;
	icon: string;
	color: string;
}

export interface TransactionDraft {
	amount: number;
	type: TransactionType;
	category_id: string;
	payment_method: PaymentMethod;
	date: string;
	note: string;
}

export interface RecurringDraft {
	name: string;
	amount: number;
	type: TransactionType;
	category_id: string;
	payment_method: PaymentMethod;
	frequency: RecurringFrequency;
	start_date: string;
	note: string;
}
