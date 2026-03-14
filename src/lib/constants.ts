import type { CategorySeed, PaymentMethod } from '$lib/types';

export const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Credit Card', 'Bank Transfer'];

export const DEFAULT_CATEGORIES: CategorySeed[] = [
	{ name: 'Food', type: 'expense', color: '#f97316', icon: 'utensils' },
	{ name: 'Transport', type: 'expense', color: '#3b82f6', icon: 'car' },
	{ name: 'Shopping', type: 'expense', color: '#8b5cf6', icon: 'shopping-bag' },
	{ name: 'Bills', type: 'expense', color: '#ef4444', icon: 'receipt' },
	{ name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'film' },
	{ name: 'Health', type: 'expense', color: '#10b981', icon: 'heart-pulse' },
	{ name: 'Salary', type: 'income', color: '#22c55e', icon: 'wallet' },
	{ name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'briefcase' },
	{ name: 'Investment', type: 'income', color: '#84cc16', icon: 'trending-up' },
	{ name: 'Other', type: 'income', color: '#6366f1', icon: 'sparkles' }
];

export const DEFAULT_SETTINGS = {
	theme: 'light',
	currency: 'INR',
	autoSyncDays: 7
} as const;
