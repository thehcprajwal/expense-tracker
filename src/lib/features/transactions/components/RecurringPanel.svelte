<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SearchableSelect from '$lib/components/ui/SearchableSelect.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { PAYMENT_METHODS } from '$lib/constants';
	import { todayIso } from '$lib/utils/date';
	import { formatCurrency } from '$lib/utils/format';
	import type {
		CategoryRecord,
		RecurringDraft,
		RecurringTransactionRecord,
		SettingsRecord
	} from '$lib/types';

	interface Props {
		categories?: CategoryRecord[];
		recurringItems?: RecurringTransactionRecord[];
		currency?: SettingsRecord['currency'];
		onCreate: (value: RecurringDraft) => Promise<void> | void;
		onPause: (id: string) => Promise<void> | void;
		onResume: (id: string) => Promise<void> | void;
	}

	let {
		categories = [],
		recurringItems = [],
		currency = 'INR',
		onCreate,
		onPause,
		onResume
	}: Props = $props();

	let name = $state('');
	let amount = $state('');
	let type = $state<'income' | 'expense'>('expense');
	let categoryId = $state('');
	let paymentMethod = $state<'Cash' | 'UPI' | 'Credit Card' | 'Bank Transfer'>('UPI');
	let frequency = $state<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
	let startDate = $state(todayIso());
	let note = $state('');

	$effect(() => {
		const first = categories.find((category) => category.type === type);
		if (first) categoryId = first.id;
	});

	async function submitRecurring(event: SubmitEvent) {
		event.preventDefault();
		await onCreate({
			name,
			amount: Number(amount),
			type,
			category_id: categoryId,
			payment_method: paymentMethod,
			frequency,
			start_date: startDate,
			note
		});

		name = '';
		amount = '';
		note = '';
		startDate = todayIso();
	}
</script>

<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
	<Card>
		<div class="mb-6">
			<p class="text-sm text-[var(--text-muted)]">Recurring transactions</p>
			<h2 class="text-xl font-semibold">Automate repeated entries</h2>
		</div>

		<form class="grid gap-4 md:grid-cols-2" onsubmit={submitRecurring}>
			<label class="grid gap-2 md:col-span-2">
				<span class="text-sm font-medium">Name</span>
				<Input bind:value={name} placeholder="Rent" required />
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Amount</span>
				<Input bind:value={amount} type="number" min="0" step="0.01" required />
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Type</span>
				<Select
					bind:value={type}
					options={[
						{ label: 'Expense', value: 'expense' },
						{ label: 'Income', value: 'income' }
					]}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Category</span>
				<SearchableSelect
					bind:value={categoryId}
					placeholder="Select category"
					searchPlaceholder="Find category"
					emptyMessage="No categories found."
					options={categories
						.filter((category) => category.type === type)
						.map((category) => ({ label: category.name, value: category.id }))}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Payment method</span>
				<SearchableSelect
					bind:value={paymentMethod}
					placeholder="Select payment method"
					searchPlaceholder="Find payment method"
					emptyMessage="No payment methods found."
					options={PAYMENT_METHODS.map((method) => ({ label: method, value: method }))}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Frequency</span>
				<Select
					bind:value={frequency}
					options={[
						{ label: 'Weekly', value: 'weekly' },
						{ label: 'Monthly', value: 'monthly' },
						{ label: 'Every 3 months', value: 'quarterly' },
						{ label: 'Yearly', value: 'yearly' }
					]}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-sm font-medium">Start date</span>
				<Input bind:value={startDate} type="date" required />
			</label>
			<label class="grid gap-2 md:col-span-2">
				<span class="text-sm font-medium">Note</span>
				<Input bind:value={note} placeholder="Optional note" />
			</label>
			<Button type="submit" class="md:col-span-2">Add Recurring</Button>
		</form>
	</Card>

	<Card>
		<div class="mb-6">
			<p class="text-sm text-[var(--text-muted)]">Scheduled entries</p>
			<h2 class="text-xl font-semibold">Current rules</h2>
		</div>
		<div class="grid gap-3">
			{#if recurringItems.length === 0}
				<p class="rounded-2xl bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--text-muted)]">
					No recurring transactions configured yet.
				</p>
			{:else}
				{#each recurringItems as item}
					<div class="rounded-2xl border border-[var(--border)] px-4 py-4">
						<div class="flex items-start justify-between gap-3">
							<div>
								<div class="flex flex-wrap items-center gap-2">
									<p class="font-medium">{item.name}</p>
									<span
										class={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
											item.status === 'active'
												? 'bg-[color-mix(in_srgb,var(--income),white_84%)] text-[var(--income)]'
												: 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
										}`}
									>
										{item.status}
									</span>
								</div>
								<p class="text-sm text-[var(--text-muted)]">
									{item.frequency} • starts {item.start_date}
								</p>
							</div>
							<div class="flex flex-col items-end gap-3">
								<p
									class={`font-semibold ${item.type === 'income' ? 'text-[var(--income)]' : 'text-[var(--expense)]'}`}
								>
									{formatCurrency(item.amount, currency)}
								</p>
								<Button
									variant={item.status === 'active' ? 'secondary' : 'primary'}
									onclick={() => (item.status === 'active' ? onPause(item.id) : onResume(item.id))}
								>
									{item.status === 'active' ? 'Pause' : 'Resume'}
								</Button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</Card>
</div>
