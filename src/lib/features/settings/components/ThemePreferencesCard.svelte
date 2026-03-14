<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { SettingsRecord } from '$lib/types';

	interface Props {
		theme: SettingsRecord['theme'];
		onThemeChange: (theme: SettingsRecord['theme']) => Promise<void> | void;
	}

	let { theme, onThemeChange }: Props = $props();

	const themeOptions: SettingsRecord['theme'][] = ['light', 'dark'];
</script>

<Card>
	<p class="text-sm text-[var(--text-muted)]">Preferences</p>
	<h2 class="mt-2 text-xl font-semibold">Theme</h2>
	<div class="mt-5 grid gap-4">
		<div class="grid gap-2">
			<span class="text-sm font-medium">Theme</span>
			<div class="grid grid-cols-2 gap-2">
				{#each themeOptions as option}
					<button
						type="button"
						class={`rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition ${
							theme === option
								? 'border-[var(--accent)] bg-[var(--accent)] text-white'
								: 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]'
						}`}
						onclick={() => onThemeChange(option)}
					>
						{option}
					</button>
				{/each}
			</div>
		</div>
		<div class="grid gap-2">
			<span class="text-sm font-medium">Currency</span>
			<div class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
				<p class="text-sm font-medium">INR</p>
				<p class="mt-1 text-sm text-[var(--text-muted)]">Currency is fixed to Indian Rupee.</p>
			</div>
		</div>
	</div>
</Card>
