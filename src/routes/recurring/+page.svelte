<script lang="ts">
	import { categoryStore } from '$lib/features/categories';
	import RecurringPanel from '$lib/features/transactions/components/RecurringPanel.svelte';
	import { transactionStore } from '$lib/features/transactions';
	import { settingsStore } from '$lib/stores/settingsStore';

	const categories = categoryStore;
	const settings = settingsStore;
	const recurringItems = transactionStore.recurring;

	async function createRecurring(draft: Parameters<typeof transactionStore.createRecurring>[0]) {
		await transactionStore.createRecurring(draft);
	}

	async function pauseRecurring(id: string) {
		await transactionStore.pauseRecurring(id);
	}

	async function resumeRecurring(id: string) {
		await transactionStore.resumeRecurring(id);
	}
</script>

<RecurringPanel
	categories={$categories}
	recurringItems={$recurringItems}
	currency={$settings.currency}
	onCreate={createRecurring}
	onPause={pauseRecurring}
	onResume={resumeRecurring}
/>
