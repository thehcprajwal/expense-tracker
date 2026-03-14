import type { RecurringFrequency } from '$lib/types';

export function todayIso() {
	return new Date().toISOString().slice(0, 10);
}

export function monthKey(date: string) {
	return date.slice(0, 7);
}

export function formatMonthLabel(value: string) {
	const date = new Date(`${value}-01T00:00:00`);
	return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date);
}

export function shiftByFrequency(date: string, frequency: RecurringFrequency) {
	const next = new Date(`${date}T00:00:00`);

	if (frequency === 'weekly') next.setDate(next.getDate() + 7);
	if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
	if (frequency === 'quarterly') next.setMonth(next.getMonth() + 3);
	if (frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

	return next.toISOString().slice(0, 10);
}
