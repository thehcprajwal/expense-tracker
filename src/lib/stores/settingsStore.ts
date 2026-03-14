import { writable } from 'svelte/store';
import { db } from '$lib/db/dexie';
import { DEFAULT_SETTINGS } from '$lib/constants';
import type { SettingsRecord } from '$lib/types';

const settingsState = writable<SettingsRecord>({
	id: 'primary',
	theme: DEFAULT_SETTINGS.theme,
	currency: DEFAULT_SETTINGS.currency,
	autoSyncDays: DEFAULT_SETTINGS.autoSyncDays
});

function normalizeSettings(settings: SettingsRecord): SettingsRecord {
	return {
		...settings,
		currency: DEFAULT_SETTINGS.currency
	};
}

export const settingsStore = {
	subscribe: settingsState.subscribe,
	async initialize() {
		const existing = await db.settings.get('primary');
		if (existing) {
			const normalized = normalizeSettings(existing);
			await db.settings.put(normalized);
			settingsState.set(normalized);
			applyTheme(normalized.theme);
			return normalized;
		}

		const settings = normalizeSettings({
			id: 'primary',
			theme: DEFAULT_SETTINGS.theme,
			currency: DEFAULT_SETTINGS.currency,
			autoSyncDays: DEFAULT_SETTINGS.autoSyncDays
		});
		await db.settings.put(settings);
		settingsState.set(settings);
		applyTheme(settings.theme);
		return settings;
	},
	async update(partial: Partial<Omit<SettingsRecord, 'id'>>) {
		const current = (await db.settings.get('primary')) ?? {
			id: 'primary',
			theme: DEFAULT_SETTINGS.theme,
			currency: DEFAULT_SETTINGS.currency,
			autoSyncDays: DEFAULT_SETTINGS.autoSyncDays
		};
		const next = normalizeSettings({ ...current, ...partial });
		await db.settings.put(next);
		settingsState.set(next);
		applyTheme(next.theme);
		return next;
	}
};

function applyTheme(theme: SettingsRecord['theme']) {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.theme = theme;
}
