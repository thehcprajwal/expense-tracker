<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SearchableSelect from '$lib/components/ui/SearchableSelect.svelte';
	import { PAYMENT_METHODS } from '$lib/constants';
	import { todayIso } from '$lib/utils/date';
	import type {
		CategoryRecord,
		PaymentMethod,
		TransactionDraft,
		TransactionType
	} from '$lib/types';

	interface Props {
		title: string;
		submitLabel: string;
		type: TransactionType;
		categories?: CategoryRecord[];
		initialValue?: TransactionDraft | null;
		onSubmit: (value: TransactionDraft) => Promise<void> | void;
	}

	let {
		title,
		submitLabel,
		type,
		categories = [],
		initialValue = null,
		onSubmit
	}: Props = $props();

	let amount = $state('');
	let categoryId = $state('');
	let paymentMethod = $state<PaymentMethod>('UPI');
	let date = $state(todayIso());
	let note = $state('');
	let isSaving = $state(false);
	let lastLoadedKey = $state('');

	$effect(() => {
		if (!initialValue) return;
		const nextKey = `${initialValue.type}-${initialValue.category_id}-${initialValue.date}-${initialValue.amount}`;
		if (lastLoadedKey === nextKey) return;
		lastLoadedKey = nextKey;
		amount = initialValue.amount.toString();
		categoryId = initialValue.category_id;
		paymentMethod = initialValue.payment_method;
		date = initialValue.date;
		note = initialValue.note;
	});

	$effect(() => {
		const firstCategory = categories.find((category) => category.type === type);
		if (!categoryId && firstCategory) categoryId = firstCategory.id;
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSaving = true;
		try {
			await onSubmit({
				amount: Number(amount),
				type,
				category_id: categoryId,
				payment_method: paymentMethod,
				date,
				note
			});

			if (!initialValue) {
				amount = '';
				note = '';
				date = todayIso();
			}
		} finally {
			isSaving = false;
		}
	}
</script>

<Card class="h-full">
	<div class="mb-6 flex items-start justify-between gap-4">
		<div>
			<p class="text-sm font-medium text-[var(--text-muted)]">
				{type === 'expense' ? 'Add expense' : 'Add income'}
			</p>
			<h2 class="mt-1 text-xl font-semibold">{title}</h2>
		</div>
		<div
			class={`rounded-full px-3 py-1 text-xs font-semibold ${
				type === 'income'
					? 'bg-[color-mix(in_srgb,var(--income),white_82%)] text-[var(--income)]'
					: 'bg-[color-mix(in_srgb,var(--expense),white_86%)] text-[var(--expense)]'
			}`}
		>
			{type}
		</div>
	</div>

	<form class="grid gap-4" onsubmit={handleSubmit}>
		<label class="grid gap-2">
			<span class="text-sm font-medium">Amount</span>
			<Input bind:value={amount} type="number" min="0" step="0.01" placeholder="0" required />
		</label>

		<label class="grid gap-2">
			<span class="text-sm font-medium">{type === 'expense' ? 'Category' : 'Source'}</span>
			<SearchableSelect
				bind:value={categoryId}
				placeholder={type === 'expense' ? 'Select category' : 'Select source'}
				searchPlaceholder={type === 'expense' ? 'Find category' : 'Find source'}
				emptyMessage={type === 'expense' ? 'No categories found.' : 'No sources found.'}
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
			<span class="text-sm font-medium">Date</span>
			<Input bind:value={date} type="date" required />
		</label>

		<label class="grid gap-2">
			<span class="text-sm font-medium">Note</span>
			<textarea
				bind:value={note}
				class="min-h-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
				placeholder="Optional"
			></textarea>
		</label>

		<Button type="submit" class="mt-2 w-full" disabled={isSaving}>{submitLabel}</Button>
	</form>
</Card>
