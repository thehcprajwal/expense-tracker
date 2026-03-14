<script lang="ts">
	import { cn } from '$lib/index';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<section class={cn('surface rounded-[28px] p-5 md:p-6', className)}>
	{@render children?.()}
</section>
