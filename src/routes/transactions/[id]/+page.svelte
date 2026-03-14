<script lang="ts">
	import { goto } from '$app/navigation';
	import { categoryStore } from '$lib/features/categories';
	import TransactionForm from '$lib/features/transactions/components/TransactionForm.svelte';
	import { transactionStore } from '$lib/features/transactions';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { TransactionRecord } from '$lib/types';

	let { params } = $props();

	const categories = categoryStore;
	const settings = settingsStore;

	let transaction = $state<TransactionRecord | null>(null);
	let isEditing = $state(false);

	$effect(() => {
		void loadTransaction();
	});

	async function loadTransaction() {
		transaction = (await transactionStore.getById(params.id)) ?? null;
	}

	async function saveTransaction(draft: Parameters<typeof transactionStore.update>[1]) {
		if (!transaction) return;
		await transactionStore.update(transaction.id, draft);
		await loadTransaction();
		isEditing = false;
	}

	async function deleteTransaction() {
		if (!transaction) return;
		await transactionStore.remove(transaction.id);
		void goto('/transactions');
	}

	const category = $derived(
		transaction ? ($categories.find((item) => item.id === transaction?.category_id) ?? null) : null
	);
</script>

{#if !transaction}
	<Card>
		<p class="text-sm text-[var(--text-muted)]">Transaction not found.</p>
	</Card>
{:else if isEditing}
	<TransactionForm
		title="Edit transaction"
		submitLabel="Save Changes"
		type={transaction.type}
		categories={$categories}
		initialValue={transaction}
		onSubmit={saveTransaction}
	/>
{:else}
	<Card>
		<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
			<div>
				<p class="text-sm text-[var(--text-muted)]">Transaction detail</p>
				<h2 class="mt-2 text-3xl font-semibold">
					{transaction.type === 'income' ? '+' : '-'}{formatCurrency(
						transaction.amount,
						$settings.currency
					)}
				</h2>
			</div>
			<div class="flex gap-3">
				<Button variant="secondary" onclick={() => (isEditing = true)}>Edit</Button>
				<Button variant="danger" onclick={deleteTransaction}>Delete</Button>
			</div>
		</div>

		<div class="mt-8 grid gap-4 md:grid-cols-2">
			<div class="rounded-2xl border border-[var(--border)] p-4">
				<p class="text-sm text-[var(--text-muted)]">Category</p>
				<p class="mt-1 font-medium">{category?.name ?? 'Unknown'}</p>
			</div>
			<div class="rounded-2xl border border-[var(--border)] p-4">
				<p class="text-sm text-[var(--text-muted)]">Payment method</p>
				<p class="mt-1 font-medium">{transaction.payment_method}</p>
			</div>
			<div class="rounded-2xl border border-[var(--border)] p-4">
				<p class="text-sm text-[var(--text-muted)]">Date</p>
				<p class="mt-1 font-medium">{formatDate(transaction.date)}</p>
			</div>
			<div class="rounded-2xl border border-[var(--border)] p-4">
				<p class="text-sm text-[var(--text-muted)]">Type</p>
				<p class="mt-1 font-medium capitalize">{transaction.type}</p>
			</div>
			<div class="rounded-2xl border border-[var(--border)] p-4 md:col-span-2">
				<p class="text-sm text-[var(--text-muted)]">Note</p>
				<p class="mt-1 font-medium">{transaction.note || 'No note added.'}</p>
			</div>
		</div>
	</Card>
{/if}
