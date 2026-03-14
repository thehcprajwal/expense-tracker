<script lang="ts">
	import { RotateCw, Tags } from 'lucide-svelte';
	import { categoryStore } from '$lib/features/categories';
	import {
		DataAccountCard,
		ProfileCard,
		SyncStatusCard,
		ThemePreferencesCard
	} from '$lib/features/settings';
	import { transactionStore } from '$lib/features/transactions';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { syncStore } from '$lib/stores/syncStore';
	import { userStore } from '$lib/stores/userStore';
	import { transactionsToCsv } from '$lib/utils/export';
	import { downloadTextFile } from '$lib/utils/browser';

	const settings = settingsStore;
	const sync = syncStore;
	const user = userStore;
	const categories = categoryStore;
	const transactions = transactionStore;

	async function updateTheme(theme: 'light' | 'dark') {
		await settingsStore.update({ theme });
	}

	async function runManualSync() {
		await syncStore.run();
	}

	function exportCsv() {
		const csv = transactionsToCsv(
			$transactions,
			new Map($categories.map((category) => [category.id, category]))
		);
		downloadTextFile(
			csv,
			`transactions-${new Date().toISOString().slice(0, 10)}.csv`,
			'text/csv;charset=utf-8;'
		);
	}
</script>

<div class="page-grid">
	<div class="grid gap-4 lg:grid-cols-2">
		<ProfileCard user={$user} />
		<ThemePreferencesCard theme={$settings.theme} onThemeChange={updateTheme} />
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<SyncStatusCard sync={$sync} onRunSync={runManualSync} />
		<DataAccountCard onExportCsv={exportCsv} />
	</div>

	<div class="grid gap-4 lg:hidden">
		<div class="surface rounded-[28px] p-5 md:p-6">
			<p class="text-sm text-[var(--text-muted)]">More</p>
			<h2 class="mt-2 text-xl font-semibold">Additional sections</h2>
			<div class="mt-5 grid gap-3">
				<a
					href="/recurring"
					class="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-4 transition hover:bg-[var(--surface-muted)]"
				>
					<div class="flex items-center gap-3">
						<div class="rounded-2xl bg-[var(--surface-muted)] p-2 text-[var(--accent)]">
							<RotateCw size={18} />
						</div>
						<div>
							<p class="font-medium">Recurring transactions</p>
							<p class="text-sm text-[var(--text-muted)]">Manage scheduled entries</p>
						</div>
					</div>
				</a>

				<a
					href="/categories"
					class="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-4 transition hover:bg-[var(--surface-muted)]"
				>
					<div class="flex items-center gap-3">
						<div class="rounded-2xl bg-[var(--surface-muted)] p-2 text-[var(--accent)]">
							<Tags size={18} />
						</div>
						<div>
							<p class="font-medium">Categories</p>
							<p class="text-sm text-[var(--text-muted)]">Edit income and expense groups</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>
