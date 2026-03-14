import { DEFAULT_CATEGORIES } from '$lib/constants';

export const TABLES = {
	transactions: 'id, date, category_id, payment_method, amount, updated_at, sync_status, deleted',
	categories: 'id, name, type, updated_at, sync_status, deleted',
	recurring_transactions:
		'id, type, category_id, frequency, status, start_date, last_generated, updated_at, sync_status, deleted',
	sync_metadata: 'id, last_sync, pending_changes',
	settings: 'id, theme, currency'
} as const;

export { DEFAULT_CATEGORIES };
