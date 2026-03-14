<script lang="ts">
	import { Combobox } from 'bits-ui';
	import { Check, Search } from 'lucide-svelte';
	import { cn } from '$lib/index';

	interface Option {
		label: string;
		value: string;
	}

	interface Props {
		id?: string;
		value?: string;
		options?: Option[];
		class?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		emptyMessage?: string;
	}

	let {
		id,
		value = $bindable(''),
		options = [],
		class: className = '',
		placeholder = 'Select an option',
		searchPlaceholder = 'Search...',
		emptyMessage = 'No results found.'
	}: Props = $props();

	let inputValue = $state('');
	let isFocused = $state(false);

	const filteredOptions = $derived.by(() => {
		const query = inputValue.trim().toLowerCase();
		if (!query) return options;
		return options.filter((option) => option.label.toLowerCase().includes(query));
	});

	function handleInput(event: Event) {
		inputValue = (event.currentTarget as HTMLInputElement).value;
	}

	function handleFocus() {
		isFocused = true;
		const selected = options.find((option) => option.value === value);
		if (selected && inputValue === selected.label) {
			inputValue = '';
		}
	}

	function handleBlur() {
		isFocused = false;
		const selected = options.find((option) => option.value === value);
		if (selected && !inputValue.trim()) {
			inputValue = selected.label;
		}
	}

	$effect(() => {
		const selected = options.find((option) => option.value === value);
		if (selected && !isFocused && inputValue !== selected.label) {
			inputValue = selected.label;
		}

		if (!value && !inputValue) {
			inputValue = '';
		}
	});
</script>

<Combobox.Root type="single" bind:value items={filteredOptions} {inputValue}>
	<div class={cn('relative', className)}>
		<Combobox.Input
			{id}
			{placeholder}
			oninput={handleInput}
			onfocus={handleFocus}
			onblur={handleBlur}
			class="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pl-11 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
		/>
		<div
			class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--text-muted)]"
		>
			<Search size={16} />
		</div>
	</div>

	<Combobox.Portal>
		<Combobox.Content
			sideOffset={8}
			class="z-50 max-h-80 min-w-[var(--bits-combobox-anchor-width)] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_48px_rgba(16,24,22,0.18)] outline-none"
		>
			<div
				class="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]"
			>
				{searchPlaceholder}
			</div>
			<Combobox.Viewport class="grid gap-1">
				{#if filteredOptions.length === 0}
					<div class="px-3 py-2.5 text-sm text-[var(--text-muted)]">{emptyMessage}</div>
				{:else}
					{#each filteredOptions as option}
						<Combobox.Item
							value={option.value}
							label={option.label}
							class="flex w-full select-none items-center rounded-2xl px-3 py-2.5 text-sm text-[var(--text)] outline-none transition data-[highlighted]:bg-[var(--surface-muted)]"
						>
							{#snippet children({ selected })}
								<span class="truncate">{option.label}</span>
								{#if selected}
									<span class="ml-auto text-[var(--accent)]">
										<Check size={16} />
									</span>
								{/if}
							{/snippet}
						</Combobox.Item>
					{/each}
				{/if}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
