<script lang="ts">
	import { goto } from '$app/navigation';
	import { categoryStore } from '$lib/features/categories';
	import AddExpenseForm from '$lib/features/transactions/components/AddExpenseForm.svelte';
	import { transactionStore } from '$lib/features/transactions';

	const categories = categoryStore;

	async function saveExpense(draft: Parameters<typeof transactionStore.create>[0]) {
		await transactionStore.create(draft);
		await goto('/dashboard');
	}
</script>

<AddExpenseForm categories={$categories} onSubmit={saveExpense} />
