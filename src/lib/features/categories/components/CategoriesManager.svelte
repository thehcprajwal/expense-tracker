<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { categoryStore } from '$lib/features/categories';

	const categories = categoryStore;

	let expenseName = $state('');
	let incomeName = $state('');
	let editingId = $state('');
	let editingValue = $state('');

	async function addExpenseCategory() {
		if (!expenseName.trim()) return;
		await categoryStore.create(expenseName.trim(), 'expense');
		expenseName = '';
	}

	async function addIncomeCategory() {
		if (!incomeName.trim()) return;
		await categoryStore.create(incomeName.trim(), 'income');
		incomeName = '';
	}

	async function saveRename() {
		if (!editingId || !editingValue.trim()) return;
		await categoryStore.rename(editingId, editingValue.trim());
		editingId = '';
		editingValue = '';
	}
</script>

<div class="grid gap-4 lg:grid-cols-2">
	<Card>
		<div class="mb-6">
			<p class="text-sm text-[var(--text-muted)]">Expense categories</p>
			<h2 class="text-xl font-semibold">Manage spending labels</h2>
		</div>
		<div class="grid gap-3">
			{#each $categories.filter((category) => category.type === 'expense') as category}
				<div
					class="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] px-4 py-4"
				>
					{#if editingId === category.id}
						<div class="flex flex-1 items-center gap-2">
							<Input bind:value={editingValue} />
							<Button variant="secondary" onclick={saveRename}>Save</Button>
						</div>
					{:else}
						<div>
							<p class="font-medium">{category.name}</p>
							<p class="text-sm text-[var(--text-muted)]">Expense</p>
						</div>
						<Button
							variant="ghost"
							onclick={() => ((editingId = category.id), (editingValue = category.name))}
						>
							Edit
						</Button>
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-6 flex gap-3">
			<Input bind:value={expenseName} placeholder="New expense category" />
			<Button onclick={addExpenseCategory}>Add</Button>
		</div>
	</Card>

	<Card>
		<div class="mb-6">
			<p class="text-sm text-[var(--text-muted)]">Income categories</p>
			<h2 class="text-xl font-semibold">Manage income labels</h2>
		</div>
		<div class="grid gap-3">
			{#each $categories.filter((category) => category.type === 'income') as category}
				<div
					class="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] px-4 py-4"
				>
					{#if editingId === category.id}
						<div class="flex flex-1 items-center gap-2">
							<Input bind:value={editingValue} />
							<Button variant="secondary" onclick={saveRename}>Save</Button>
						</div>
					{:else}
						<div>
							<p class="font-medium">{category.name}</p>
							<p class="text-sm text-[var(--text-muted)]">Income</p>
						</div>
						<Button
							variant="ghost"
							onclick={() => ((editingId = category.id), (editingValue = category.name))}
						>
							Edit
						</Button>
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-6 flex gap-3">
			<Input bind:value={incomeName} placeholder="New income category" />
			<Button onclick={addIncomeCategory}>Add</Button>
		</div>
	</Card>
</div>
