export function formatCurrency(amount: number, currency = 'INR') {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatDate(date: string) {
	return new Intl.DateTimeFormat('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(new Date(`${date}T00:00:00`));
}

export function formatDateTime(date: string | null) {
	if (!date) return 'Never';

	return new Intl.DateTimeFormat('en-IN', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(date));
}

export function slugify(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
