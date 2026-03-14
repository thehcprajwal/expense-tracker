import { categoryStore } from '$lib/features/categories';
import { settingsStore } from '$lib/stores/settingsStore';
import { syncStore } from '$lib/stores/syncStore';
import { userStore } from '$lib/stores/userStore';
import { runRecurringEngine, transactionStore } from '$lib/features/transactions';

export async function initializeApp() {
	await settingsStore.initialize();
	await userStore.initialize();
	await categoryStore.ensureSeeded();
	await runRecurringEngine();
	await Promise.all([transactionStore.refreshTransactions(), transactionStore.refreshRecurring()]);
	await syncStore.initialize();
}
