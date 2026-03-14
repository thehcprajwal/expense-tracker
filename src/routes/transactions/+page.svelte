<script lang="ts">
	import { categoryStore } from '$lib/features/categories';
	import TransactionList from '$lib/features/transactions/components/TransactionList.svelte';
	import { transactionStore } from '$lib/features/transactions';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SearchableSelect from '$lib/components/ui/SearchableSelect.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { PAYMENT_METHODS } from '$lib/constants';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { formatMonthLabel } from '$lib/utils/date';

	const categories = categoryStore;
	const settings = settingsStore;
	const transactions = transactionStore;

	let search = $state('');
	let month = $state('');
	let categoryId = $state('');
	let paymentMethod = $state('');
	let dateFrom = $state('');
	let dateTo = $state('');

	const availableMonths = $derived(
		Array.from(new Set($transactions.map((transaction) => transaction.date.slice(0, 7))))
			.sort()
			.reverse()
			.map((value) => ({ label: formatMonthLabel(value), value }))
	);

	const filteredTransactions = $derived(
		$transactions.filter((transaction) => {
			const category = $categories.find((item) => item.id === transaction.category_id);
			const matchesSearch =
				search.trim().length === 0 ||
				[
					category?.name ?? '',
					transaction.note,
					String(transaction.amount),
					transaction.payment_method
				]
					.join(' ')
					.toLowerCase()
					.includes(search.trim().toLowerCase());
			const matchesMonth = !month || transaction.date.startsWith(month);
			const matchesCategory = !categoryId || transaction.category_id === categoryId;
			const matchesPayment = !paymentMethod || transaction.payment_method === paymentMethod;
			const matchesFrom = !dateFrom || transaction.date >= dateFrom;
			const matchesTo = !dateTo || transaction.date <= dateTo;

			return (
				matchesSearch &&
				matchesMonth &&
				matchesCategory &&
				matchesPayment &&
				matchesFrom &&
				matchesTo
			);
		})
	);
</script>

<div class="page-grid">
	<Card>
		<div class="mb-6">
			<p class="text-sm text-[var(--text-muted)]">Search and filters</p>
			<h2 class="text-xl font-semibold">Explore past transactions</h2>
		</div>

		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			<label class="grid gap-2 xl:col-span-3">
				<span class="text-sm font-medium">Search</span>
				<Input bind:value={search} placeholder="Search transactions..." />
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Month</span>
				<Select
					bind:value={month}
					options={[{ label: 'All months', value: '' }, ...availableMonths]}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Category</span>
				<SearchableSelect
					bind:value={categoryId}
					placeholder="All categories"
					searchPlaceholder="Find category"
					emptyMessage="No categories found."
					options={[
						{ label: 'All categories', value: '' },
						...$categories.map((category) => ({ label: category.name, value: category.id }))
					]}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Payment method</span>
				<Select
					bind:value={paymentMethod}
					options={[
						{ label: 'All methods', value: '' },
						...PAYMENT_METHODS.map((method) => ({ label: method, value: method }))
					]}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Date from</span>
				<Input bind:value={dateFrom} type="date" />
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Date to</span>
				<Input bind:value={dateTo} type="date" />
			</label>
		</div>
	</Card>

	<TransactionList
		transactions={filteredTransactions}
		categories={$categories}
		currency={$settings.currency}
	/>
</div>
