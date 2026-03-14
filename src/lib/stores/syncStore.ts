import { writable } from 'svelte/store';
import { initializeSyncMetadata, runSync } from '$lib/services/syncEngine';
import type { SyncMetadataRecord } from '$lib/types';

const initialState: SyncMetadataRecord = {
	id: 'primary',
	last_sync: null,
	last_attempt: null,
	device_id: '',
	pending_changes: 0,
	status: 'idle',
	message: 'Sync has not run yet.'
};

const syncState = writable<SyncMetadataRecord>(initialState);

export const syncStore = {
	subscribe: syncState.subscribe,
	async initialize() {
		const state = await initializeSyncMetadata();
		syncState.set(state);
		return state;
	},
	async run() {
		const state = await runSync();
		syncState.set(state);
		return state;
	}
};
