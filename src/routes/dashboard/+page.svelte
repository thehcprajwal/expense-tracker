<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowDownRight, ArrowUpRight, Wallet2 } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { transactionStore } from '$lib/features/transactions';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { monthKey, todayIso } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/format';

	const settings = settingsStore;
	const transactions = transactionStore;

	const currentMonth = monthKey(todayIso());
	const monthlyTransactions = $derived(
		$transactions.filter((transaction) => transaction.date.startsWith(currentMonth))
	);
	const incomeThisMonth = $derived(
		monthlyTransactions
			.filter((transaction) => transaction.type === 'income')
			.reduce((total, transaction) => total + transaction.amount, 0)
	);
	const expenseThisMonth = $derived(
		monthlyTransactions
			.filter((transaction) => transaction.type === 'expense')
			.reduce((total, transaction) => total + transaction.amount, 0)
	);
	const balance = $derived(
		$transactions.reduce(
			(total, transaction) =>
				total + (transaction.type === 'income' ? transaction.amount : -transaction.amount),
			0
		)
	);
</script>

<div class="page-grid">
	<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
		<Card class="home-hero overflow-hidden">
			<div class="grid gap-8">
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
							Current balance
						</p>
						<h2 class="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
							{formatCurrency(balance, $settings.currency)}
						</h2>
						<p class="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)] md:text-base">
							A simple view of where your money stands this month.
						</p>
					</div>

					<div class="home-balance-mark hidden md:flex">
						<Wallet2 size={24} />
					</div>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div class="home-stat-card home-stat-income">
						<div class="home-stat-icon">
							<ArrowUpRight size={16} />
						</div>
						<div class="min-w-0">
							<p class="text-sm font-medium text-[var(--text-muted)]">Income this month</p>
							<p class="mt-2 text-2xl font-semibold text-[var(--income)] md:text-3xl">
								{formatCurrency(incomeThisMonth, $settings.currency)}
							</p>
						</div>
					</div>

					<div class="home-stat-card home-stat-expense">
						<div class="home-stat-icon">
							<ArrowDownRight size={16} />
						</div>
						<div class="min-w-0">
							<p class="text-sm font-medium text-[var(--text-muted)]">Expense this month</p>
							<p class="mt-2 text-2xl font-semibold text-[var(--expense)] md:text-3xl">
								{formatCurrency(expenseThisMonth, $settings.currency)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Card>

		<Card class="home-actions-panel">
			<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
				Quick actions
			</p>

			<div class="mt-5 grid gap-3">
				<Button class="h-13 w-full rounded-[22px] text-base" onclick={() => goto('/add-expense')}>
					Add Expense
				</Button>
				<Button
					variant="secondary"
					class="h-13 w-full rounded-[22px] text-base"
					onclick={() => goto('/add-income')}
				>
					Add Income
				</Button>
			</div>
		</Card>
	</div>
</div>
