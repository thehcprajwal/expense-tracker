<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { categoryStore } from '$lib/features/categories';
	import { transactionStore } from '$lib/features/transactions';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { monthKey, todayIso } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/format';

	const categories = categoryStore;
	const settings = settingsStore;
	const transactions = transactionStore;

	const currentMonth = monthKey(todayIso());
	const currentMonthTransactions = $derived(
		$transactions.filter((transaction) => transaction.date.startsWith(currentMonth))
	);
	const income = $derived(
		currentMonthTransactions
			.filter((transaction) => transaction.type === 'income')
			.reduce((total, transaction) => total + transaction.amount, 0)
	);
	const expense = $derived(
		currentMonthTransactions
			.filter((transaction) => transaction.type === 'expense')
			.reduce((total, transaction) => total + transaction.amount, 0)
	);

	const categoryBreakdown = $derived.by(() => {
		const totals = new Map<string, number>();

		for (const transaction of currentMonthTransactions) {
			if (transaction.type !== 'expense') continue;
			totals.set(
				transaction.category_id,
				(totals.get(transaction.category_id) ?? 0) + transaction.amount
			);
		}

		return Array.from(totals.entries())
			.map(([categoryId, total]) => ({
				category: $categories.find((item) => item.id === categoryId)?.name ?? 'Unknown',
				total,
				shareOfExpense: expense > 0 ? (total / expense) * 100 : 0
			}))
			.sort((left, right) => right.total - left.total);
	});

	const paymentBreakdown = $derived.by(() => {
		const totals = new Map<string, number>();
		for (const transaction of currentMonthTransactions) {
			if (transaction.type !== 'expense') continue;
			totals.set(
				transaction.payment_method,
				(totals.get(transaction.payment_method) ?? 0) + transaction.amount
			);
		}

		return Array.from(totals.entries()).sort((left, right) => right[1] - left[1]);
	});

</script>

<div class="page-grid">
	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<p class="text-sm text-[var(--text-muted)]">Monthly income</p>
			<h2 class="mt-3 text-4xl font-semibold text-[var(--income)]">
				{formatCurrency(income, $settings.currency)}
			</h2>
		</Card>
		<Card>
			<p class="text-sm text-[var(--text-muted)]">Monthly expenses</p>
			<h2 class="mt-3 text-4xl font-semibold text-[var(--expense)]">
				{formatCurrency(expense, $settings.currency)}
			</h2>
		</Card>
	</div>

	<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
		<Card>
			<div class="mb-6">
				<p class="text-sm text-[var(--text-muted)]">Spending by category</p>
				<h2 class="text-xl font-semibold">This month</h2>
			</div>
			<div class="grid gap-4">
				{#if categoryBreakdown.length === 0}
					<p
						class="rounded-2xl bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]"
					>
						No expense data available for this month.
					</p>
				{:else}
					{#each categoryBreakdown as item}
						<div class="grid gap-2">
							<div class="flex items-center justify-between text-sm">
								<span>{item.category}</span>
								<div class="text-right">
									<p>{formatCurrency(item.total, $settings.currency)}</p>
									<p class="text-xs text-[var(--text-muted)]">
										{item.shareOfExpense.toFixed(0)}% of monthly expenses
									</p>
								</div>
							</div>
							<div class="h-3 rounded-full bg-[var(--surface-muted)]">
								<div
									class="h-3 rounded-full bg-[var(--accent)]"
									style={`width: ${item.shareOfExpense}%`}
								></div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</Card>

		<Card>
			<div class="mb-6">
				<p class="text-sm text-[var(--text-muted)]">By payment method</p>
				<h2 class="text-xl font-semibold">Expense mix</h2>
			</div>
			<div class="grid gap-3">
				{#if paymentBreakdown.length === 0}
					<p
						class="rounded-2xl bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]"
					>
						Payment method insights appear after you log expenses.
					</p>
				{:else}
					{#each paymentBreakdown as [method, total]}
						<div
							class="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-4"
						>
							<p class="font-medium">{method}</p>
							<p class="text-sm text-[var(--text-muted)]">
								{formatCurrency(total, $settings.currency)}
							</p>
						</div>
					{/each}
				{/if}
			</div>
		</Card>
	</div>
</div>
