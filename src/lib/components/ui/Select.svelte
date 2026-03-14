<script lang="ts">
	import { Select } from 'bits-ui';
	import { Check, ChevronDown } from 'lucide-svelte';
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
	}

	let {
		id,
		value = $bindable(''),
		options = [],
		class: className = '',
		placeholder = 'Select an option'
	}: Props = $props();

	const selectedLabel = $derived(
		value ? (options.find((option) => option.value === value)?.label ?? placeholder) : placeholder
	);
</script>

<Select.Root type="single" bind:value>
	<div class={cn('relative', className)}>
		<Select.Trigger
			{id}
			class="inline-flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-11 text-left text-sm text-[var(--text)] outline-none transition hover:border-[color-mix(in_srgb,var(--accent),transparent_50%)] focus-visible:border-[var(--accent)]"
		>
			<span class={`min-w-0 truncate ${value ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
				{selectedLabel}
			</span>
		</Select.Trigger>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)]"
		>
			<ChevronDown size={16} />
		</div>
	</div>

	<Select.Portal>
		<Select.Content
			sideOffset={8}
			class="z-50 max-h-80 min-w-[var(--bits-select-anchor-width)] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_48px_rgba(16,24,22,0.18)] outline-none"
		>
			<Select.Viewport class="grid gap-1">
				{#each options as option}
					<Select.Item
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
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
