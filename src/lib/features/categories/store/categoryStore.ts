import { writable } from 'svelte/store';
import { db } from '$lib/db/dexie';
import { DEFAULT_CATEGORIES } from '$lib/db/schema';
import { queueSync } from '$lib/services/syncQueue';
import { createId } from '$lib/utils/id';
import type { CategoryRecord, CategoryType } from '$lib/types';

const categoriesState = writable<CategoryRecord[]>([]);

async function refresh() {
	const categories = await db.categories
		.filter((category) => category.deleted === 0)
		.sortBy('name');
	categoriesState.set(categories);
	return categories;
}

export const categoryStore = {
	subscribe: categoriesState.subscribe,
	refresh,
	async ensureSeeded() {
		const count = await db.categories.count();
		if (count > 0) return refresh();

		const timestamp = new Date().toISOString();
		await db.categories.bulkAdd(
			DEFAULT_CATEGORIES.map((seed) => ({
				id: createId(`cat_${seed.type}`),
				name: seed.name,
				type: seed.type,
				icon: seed.icon,
				color: seed.color,
				created_at: timestamp,
				updated_at: timestamp,
				sync_status: 'pending',
				deleted: 0
			}))
		);

		return refresh();
	},
	async create(name: string, type: CategoryType) {
		const timestamp = new Date().toISOString();
		await db.categories.put({
			id: createId(`cat_${type}`),
			name,
			type,
			icon: type === 'income' ? 'wallet' : 'receipt',
			color: type === 'income' ? '#22c55e' : '#6366f1',
			created_at: timestamp,
			updated_at: timestamp,
			sync_status: 'pending',
			deleted: 0
		});

		queueSync();
		return refresh();
	},
	async rename(id: string, name: string) {
		await db.categories.update(id, {
			name,
			updated_at: new Date().toISOString(),
			sync_status: 'pending'
		});
		queueSync();
		return refresh();
	}
};
