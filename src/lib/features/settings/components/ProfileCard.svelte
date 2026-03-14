<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { UserState } from '$lib/types';

	interface Props {
		user: UserState;
	}

	let { user }: Props = $props();
</script>

<Card>
	<p class="text-sm text-[var(--text-muted)]">Profile</p>
	<h2 class="mt-2 text-xl font-semibold">Account status</h2>
	<div class="mt-5 rounded-2xl border border-[var(--border)] px-4 py-4">
		<p class="font-medium">{user.name}</p>
		<p class="text-sm text-[var(--text-muted)]">Mode: {user.mode}</p>
	</div>
</Card>
