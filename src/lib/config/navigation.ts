import {
	ArrowLeftRight,
	ChartColumn,
	LayoutDashboard,
	RotateCw,
	Settings,
	Tags,
	type Icon
} from 'lucide-svelte';

export interface NavigationItem {
	href: string;
	label: string;
	icon: typeof Icon;
}

export interface RouteMeta {
	title: string;
	description: string;
}

export const navigationItems: NavigationItem[] = [
	{ href: '/dashboard', label: 'Home', icon: LayoutDashboard },
	{ href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
	{ href: '/insights', label: 'Insights', icon: ChartColumn },
	{ href: '/recurring', label: 'Recurring', icon: RotateCw },
	{ href: '/categories', label: 'Categories', icon: Tags },
	{ href: '/settings', label: 'Settings', icon: Settings }
];

export const mobileNavigationItems = navigationItems.filter(
	(item) => item.href !== '/recurring' && item.href !== '/categories'
);

export const routeMeta: Record<string, RouteMeta> = {
	'/dashboard': {
		title: 'Home',
		description: 'A calm overview of your balance, monthly totals, and quick actions.'
	},
	'/transactions': {
		title: 'Transactions',
		description: 'Search, filter, and inspect every entry without leaving the page.'
	},
	'/insights': {
		title: 'Insights',
		description: 'Simple breakdowns to understand how money is moving this month.'
	},
	'/recurring': {
		title: 'Recurring',
		description: 'Set up repeated entries so routine money flows stay automatic.'
	},
	'/categories': {
		title: 'Categories',
		description: 'Keep your labels tidy so every transaction stays easy to scan.'
	},
	'/settings': {
		title: 'Settings',
		description: 'Preferences, sync status, exports, and account controls.'
	},
	'/add-expense': {
		title: 'Add Expense',
		description: 'Capture spending quickly and return to your overview.'
	},
	'/add-income': {
		title: 'Add Income',
		description: 'Record incoming money with a clean, focused form.'
	}
};

export const defaultRouteMeta = routeMeta['/dashboard'];
