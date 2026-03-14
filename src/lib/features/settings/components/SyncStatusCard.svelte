<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { formatDateTime } from '$lib/utils/format';
	import type { SyncMetadataRecord } from '$lib/types';

	interface Props {
		sync: SyncMetadataRecord;
		onRunSync: () => Promise<void> | void;
	}

	let { sync, onRunSync }: Props = $props();
</script>

<Card>
	<p class="text-sm text-[var(--text-muted)]">Sync</p>
	<h2 class="mt-2 text-xl font-semibold">Sync status</h2>
	<div class="mt-5 grid gap-3">
		<div class="rounded-2xl border border-[var(--border)] px-4 py-4">
			<p class="text-sm text-[var(--text-muted)]">Status</p>
			<p class="mt-1 font-medium capitalize">{sync.status}</p>
		</div>
		<div class="rounded-2xl border border-[var(--border)] px-4 py-4">
			<p class="text-sm text-[var(--text-muted)]">Last attempt</p>
			<p class="mt-1 font-medium">{formatDateTime(sync.last_attempt)}</p>
		</div>
		<div class="rounded-2xl border border-[var(--border)] px-4 py-4">
			<p class="text-sm text-[var(--text-muted)]">Pending changes</p>
			<p class="mt-1 font-medium">{sync.pending_changes}</p>
		</div>
		<p class="text-sm text-[var(--text-muted)]">{sync.message}</p>
		<Button onclick={onRunSync}>Sync Now</Button>
	</div>
</Card>
