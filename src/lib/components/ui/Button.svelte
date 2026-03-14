<script lang="ts">
	import { cn } from '$lib/index';
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		class?: string;
		disabled?: boolean;
		onclick?: ((event: MouseEvent) => void) | undefined;
		children?: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		class: className = '',
		disabled = false,
		onclick,
		children
	}: Props = $props();

	const variants = {
		primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]',
		secondary:
			'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]',
		ghost: 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)]',
		danger: 'bg-[var(--expense)] text-white hover:opacity-90'
	};
</script>

<button
	{type}
	{disabled}
	{onclick}
	class={cn(
		'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
		variants[variant],
		className
	)}
>
	{@render children?.()}
</button>
