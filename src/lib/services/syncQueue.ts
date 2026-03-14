import { browser } from '$app/environment';

let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function queueSync(delayMs = 1200) {
	if (!browser) return;

	if (syncTimer) {
		clearTimeout(syncTimer);
	}

	syncTimer = setTimeout(async () => {
		syncTimer = null;
		const { syncStore } = await import('$lib/stores/syncStore');
		await syncStore.run();
	}, delayMs);
}
