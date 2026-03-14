<script lang="ts">
	import TransactionForm from '$lib/features/transactions/components/TransactionForm.svelte';
	import type { CategoryRecord, TransactionDraft } from '$lib/types';

	interface Props {
		categories?: CategoryRecord[];
		onSubmit: (value: TransactionDraft) => Promise<void> | void;
	}

	let { categories = [], onSubmit }: Props = $props();
</script>

<TransactionForm
	title="Income capture"
	submitLabel="Save Income"
	type="income"
	{categories}
	{onSubmit}
/>
