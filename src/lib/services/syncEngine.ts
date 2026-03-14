import { db } from '$lib/db/dexie';
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from '$lib/services/firebase';
import { categoryStore } from '$lib/features/categories';
import { transactionStore } from '$lib/features/transactions';
import type {
	CategoryRecord,
	RecurringTransactionRecord,
	SyncMetadataRecord,
	TransactionRecord
} from '$lib/types';
import {
	collection,
	doc,
	getDocs,
	serverTimestamp,
	setDoc,
	type DocumentData,
	type Firestore
} from 'firebase/firestore';

type SyncableRecord = TransactionRecord | CategoryRecord | RecurringTransactionRecord;
type CollectionName = 'transactions' | 'categories' | 'recurring_transactions';

const COLLECTIONS: CollectionName[] = ['transactions', 'categories', 'recurring_transactions'];

function createDeviceId() {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	return `device_${Date.now()}`;
}

async function getPendingChangeCount() {
	const [transactions, categories, recurring] = await Promise.all([
		db.transactions.where('sync_status').equals('pending').count(),
		db.categories.where('sync_status').equals('pending').count(),
		db.recurring_transactions.where('sync_status').equals('pending').count()
	]);

	return transactions + categories + recurring;
}

async function upsertMetadata(partial: Partial<SyncMetadataRecord>) {
	const current = await db.sync_metadata.get('primary');
	const next: SyncMetadataRecord = {
		id: 'primary',
		last_sync: current?.last_sync ?? null,
		last_attempt: current?.last_attempt ?? null,
		device_id: current?.device_id ?? createDeviceId(),
		pending_changes: current?.pending_changes ?? 0,
		status: current?.status ?? 'idle',
		message: current?.message ?? 'Sync has not run yet.',
		...partial
	};

	await db.sync_metadata.put(next);
	return next;
}

function getUserScopedCollection(firestore: Firestore, userId: string, name: CollectionName) {
	return collection(firestore, 'users', userId, name);
}

function isRemoteNewer(local: SyncableRecord | undefined, remote: SyncableRecord) {
	if (!local) return true;
	return remote.updated_at > local.updated_at;
}

function normalizeRemoteRecord<T extends SyncableRecord>(record: T): T {
	return {
		...record,
		...('frequency' in record && !record.status ? { status: 'active' } : {}),
		sync_status: 'synced'
	};
}

function mapRemoteDoc<T extends SyncableRecord>(document: DocumentData) {
	const { remote_updated_at: _remoteUpdatedAt, ...record } = document;
	return record as T;
}

async function pushPendingTransactions(firestore: Firestore, userId: string) {
	const pending = await db.transactions.where('sync_status').equals('pending').toArray();
	if (pending.length === 0) return 0;

	for (const record of pending) {
		await setDoc(doc(getUserScopedCollection(firestore, userId, 'transactions'), record.id), {
			...record,
			sync_status: 'synced',
			remote_updated_at: serverTimestamp()
		});

		await db.transactions.update(record.id, { sync_status: 'synced' });
	}

	return pending.length;
}

async function pushPendingCategories(firestore: Firestore, userId: string) {
	const pending = await db.categories.where('sync_status').equals('pending').toArray();
	if (pending.length === 0) return 0;

	for (const record of pending) {
		await setDoc(doc(getUserScopedCollection(firestore, userId, 'categories'), record.id), {
			...record,
			sync_status: 'synced',
			remote_updated_at: serverTimestamp()
		});

		await db.categories.update(record.id, { sync_status: 'synced' });
	}

	return pending.length;
}

async function pushPendingRecurring(firestore: Firestore, userId: string) {
	const pending = await db.recurring_transactions.where('sync_status').equals('pending').toArray();
	if (pending.length === 0) return 0;

	for (const record of pending) {
		await setDoc(doc(getUserScopedCollection(firestore, userId, 'recurring_transactions'), record.id), {
			...record,
			sync_status: 'synced',
			remote_updated_at: serverTimestamp()
		});

		await db.recurring_transactions.update(record.id, { sync_status: 'synced' });
	}

	return pending.length;
}

async function pullTransactions(firestore: Firestore, userId: string) {
	const snapshot = await getDocs(getUserScopedCollection(firestore, userId, 'transactions'));
	const localRecords = await db.transactions.toArray();
	const localMap = new Map(localRecords.map((record) => [record.id, record]));
	const updates: TransactionRecord[] = [];

	for (const remoteDoc of snapshot.docs) {
		const remoteRecord = normalizeRemoteRecord(mapRemoteDoc<TransactionRecord>(remoteDoc.data()));
		if (isRemoteNewer(localMap.get(remoteRecord.id), remoteRecord)) {
			updates.push(remoteRecord);
		}
	}

	if (updates.length > 0) {
		await db.transactions.bulkPut(updates);
	}
}

async function pullCategories(firestore: Firestore, userId: string) {
	const snapshot = await getDocs(getUserScopedCollection(firestore, userId, 'categories'));
	const localRecords = await db.categories.toArray();
	const localMap = new Map(localRecords.map((record) => [record.id, record]));
	const updates: CategoryRecord[] = [];

	for (const remoteDoc of snapshot.docs) {
		const remoteRecord = normalizeRemoteRecord(mapRemoteDoc<CategoryRecord>(remoteDoc.data()));
		if (isRemoteNewer(localMap.get(remoteRecord.id), remoteRecord)) {
			updates.push(remoteRecord);
		}
	}

	if (updates.length > 0) {
		await db.categories.bulkPut(updates);
	}
}

async function pullRecurring(firestore: Firestore, userId: string) {
	const snapshot = await getDocs(getUserScopedCollection(firestore, userId, 'recurring_transactions'));
	const localRecords = await db.recurring_transactions.toArray();
	const localMap = new Map(localRecords.map((record) => [record.id, record]));
	const updates: RecurringTransactionRecord[] = [];

	for (const remoteDoc of snapshot.docs) {
		const remoteRecord = normalizeRemoteRecord(
			mapRemoteDoc<RecurringTransactionRecord>(remoteDoc.data())
		);
		if (isRemoteNewer(localMap.get(remoteRecord.id), remoteRecord)) {
			updates.push(remoteRecord);
		}
	}

	if (updates.length > 0) {
		await db.recurring_transactions.bulkPut(updates);
	}
}

async function refreshLocalStores() {
	await Promise.all([
		transactionStore.refreshTransactions(),
		transactionStore.refreshRecurring(),
		categoryStore.refresh()
	]);
}

export async function initializeSyncMetadata() {
	const pending = await getPendingChangeCount();
	const auth = getFirebaseAuth();
	const userId = auth?.currentUser?.uid ?? null;

	if (!isFirebaseConfigured()) {
		return upsertMetadata({
			pending_changes: pending,
			status: 'disabled',
			message: 'Firebase is not configured yet.'
		});
	}

	if (!userId) {
		return upsertMetadata({
			pending_changes: pending,
			status: 'idle',
			message: 'Sign in with Google to enable Firebase sync.'
		});
	}

	return upsertMetadata({
		pending_changes: pending,
		status: 'idle',
		message: 'Firebase sync is ready.'
	});
}

export async function runSync() {
	const pending = await getPendingChangeCount();
	const lastAttempt = new Date().toISOString();

	if (typeof navigator !== 'undefined' && !navigator.onLine) {
		return upsertMetadata({
			last_attempt: lastAttempt,
			pending_changes: pending,
			status: 'offline',
			message: 'No internet connection. Local data is still available offline.'
		});
	}

	if (!isFirebaseConfigured()) {
		return upsertMetadata({
			last_attempt: lastAttempt,
			pending_changes: pending,
			status: 'disabled',
			message: 'Firebase is not configured yet.'
		});
	}

	const auth = getFirebaseAuth();
	const firestore = getFirebaseFirestore();
	const userId = auth?.currentUser?.uid ?? null;

	if (!firestore || !userId) {
		return upsertMetadata({
			last_attempt: lastAttempt,
			pending_changes: pending,
			status: 'idle',
			message: 'Sign in with Google to enable Firebase sync.'
		});
	}

	try {
		const [pushedTransactions, pushedCategories, pushedRecurring] = await Promise.all([
			pushPendingTransactions(firestore, userId),
			pushPendingCategories(firestore, userId),
			pushPendingRecurring(firestore, userId)
		]);

		await Promise.all([
			pullTransactions(firestore, userId),
			pullCategories(firestore, userId),
			pullRecurring(firestore, userId)
		]);

		await refreshLocalStores();

		const remainingPending = await getPendingChangeCount();
		const syncedAt = new Date().toISOString();
		const totalPushed = pushedTransactions + pushedCategories + pushedRecurring;

		return upsertMetadata({
			last_attempt: lastAttempt,
			last_sync: syncedAt,
			pending_changes: remainingPending,
			status: 'success',
			message:
				totalPushed > 0
					? `Firebase sync completed. ${totalPushed} local change${totalPushed === 1 ? '' : 's'} uploaded.`
					: 'Firebase sync completed. Local and cloud data are in sync.'
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown Firebase sync error.';
		return upsertMetadata({
			last_attempt: lastAttempt,
			pending_changes: await getPendingChangeCount(),
			status: 'error',
			message: `Firebase sync failed: ${message}`
		});
	}
}
