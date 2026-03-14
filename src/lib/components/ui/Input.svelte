<script lang="ts">
	import { cn } from '$lib/index';

	interface Props {
		id?: string;
		type?: string;
		value?: string | number;
		placeholder?: string;
		min?: string | number;
		step?: string | number;
		required?: boolean;
		class?: string;
	}

	let {
		id,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		min,
		step,
		required = false,
		class: className = ''
	}: Props = $props();
</script>

<input
	{id}
	{type}
	{placeholder}
	{min}
	{step}
	{required}
	bind:value
	class={cn(
		'w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]',
		className
	)}
/>
