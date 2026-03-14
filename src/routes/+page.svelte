<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		void goto('/dashboard');
	});
</script>

<p class="text-sm text-[var(--text-muted)]">Redirecting…</p>
