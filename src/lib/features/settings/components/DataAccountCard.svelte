<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		onExportCsv: () => void;
	}

	let { onExportCsv }: Props = $props();
</script>

<Card>
	<p class="text-sm text-[var(--text-muted)]">Data</p>
	<h2 class="mt-2 text-xl font-semibold">Export</h2>
	<div class="mt-5 grid gap-3">
		<Button variant="secondary" onclick={onExportCsv}>Export CSV</Button>
	</div>
</Card>
