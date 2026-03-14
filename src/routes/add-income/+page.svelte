<script lang="ts">
	import { goto } from '$app/navigation';
	import { categoryStore } from '$lib/features/categories';
	import AddIncomeForm from '$lib/features/transactions/components/AddIncomeForm.svelte';
	import { transactionStore } from '$lib/features/transactions';

	const categories = categoryStore;

	async function saveIncome(draft: Parameters<typeof transactionStore.create>[0]) {
		await transactionStore.create(draft);
		await goto('/dashboard');
	}
</script>

<AddIncomeForm categories={$categories} onSubmit={saveIncome} />
