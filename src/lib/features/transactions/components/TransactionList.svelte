<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { CategoryRecord, SettingsRecord, TransactionRecord } from '$lib/types';

	interface Props {
		transactions?: TransactionRecord[];
		categories?: CategoryRecord[];
		currency?: SettingsRecord['currency'];
	}

	let { transactions = [], categories = [], currency = 'INR' }: Props = $props();

	const categoryMap = $derived(new Map(categories.map((category) => [category.id, category])));
</script>

<Card>
	<div class="mb-5 flex items-center justify-between">
		<div>
			<p class="text-sm text-[var(--text-muted)]">Transactions</p>
			<h2 class="text-xl font-semibold">Recent activity</h2>
		</div>
		<p class="text-sm text-[var(--text-muted)]">{transactions.length} items</p>
	</div>

	<div class="grid gap-3">
		{#if transactions.length === 0}
			<p class="rounded-2xl bg-[var(--surface-muted)] px-4 py-5 text-sm text-[var(--text-muted)]">
				No transactions yet. Add income or expense to get started.
			</p>
		{:else}
			{#each transactions as transaction}
				<a
					href={`/transactions/${transaction.id}`}
					class="grid gap-1 rounded-2xl border border-[var(--border)] px-4 py-4 transition hover:bg-[var(--surface-muted)]"
				>
					<div class="flex items-center justify-between gap-4">
						<div>
							<p class="font-medium">
								{categoryMap.get(transaction.category_id)?.name ?? 'Unknown'}
							</p>
							<p class="text-sm text-[var(--text-muted)]">
								{transaction.payment_method} • {formatDate(transaction.date)}
							</p>
						</div>
						<p
							class={`text-base font-semibold ${transaction.type === 'income' ? 'text-[var(--income)]' : 'text-[var(--expense)]'}`}
						>
							{transaction.type === 'income' ? '+' : '-'}{formatCurrency(
								transaction.amount,
								currency
							)}
						</p>
					</div>
					{#if transaction.note}
						<p class="text-sm text-[var(--text-muted)]">{transaction.note}</p>
					{/if}
				</a>
			{/each}
		{/if}
	</div>
</Card>
