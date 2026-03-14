<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Wallet } from 'lucide-svelte';
	import { registerSW } from 'virtual:pwa-register';
	import AuthScreen from '$lib/features/auth/components/AuthScreen.svelte';
	import { initializeApp } from '$lib/bootstrap/initialize-app';
	import { UserMenu } from '$lib/features/settings';
	import {
		defaultRouteMeta,
		mobileNavigationItems,
		navigationItems,
		routeMeta
	} from '$lib/config/navigation';
	import { isFirebaseConfigured } from '$lib/services/firebase';
	import { loginWithGoogle, logout } from '$lib/services/auth';
	import { syncStore } from '$lib/stores/syncStore';
	import { userStore } from '$lib/stores/userStore';

	let { children } = $props();
	const user = userStore;
	const currentRoute = $derived(routeMeta[page.url.pathname] ?? defaultRouteMeta);
	let appReady = $state(false);
	let authError = $state('');

	async function handleLogout() {
		await logout();
		await userStore.initialize();
		await syncStore.initialize();
	}

	async function handleLogin() {
		authError = '';
		try {
			await loginWithGoogle();
			await userStore.initialize();
			await syncStore.initialize();
			await syncStore.run();
		} catch (error) {
			authError = error instanceof Error ? error.message : 'Unable to sign in with Google.';
		}
	}

	onMount(async () => {
		registerSW({ immediate: true });
		await initializeApp();
		appReady = true;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#155E63" />
	<title>Expense Tracker</title>
</svelte:head>

{#if !appReady}
	<div class="shell">
		<div class="container-app">
			<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">
				<div class="surface rounded-[32px] px-6 py-8 text-center">
					<p class="text-sm text-[var(--text-muted)]">Loading Expense Tracker...</p>
				</div>
			</div>
		</div>
	</div>
{:else if $user.mode !== 'authenticated'}
	<div class="shell">
		<div class="container-app">
			<AuthScreen
				authConfigured={isFirebaseConfigured()}
				errorMessage={authError}
				onLogin={handleLogin}
			/>
		</div>
	</div>
{:else}
	<div class="shell">
		<div class="container-app">
			<div class="layout-shell">
				<aside class="desktop-nav surface hidden rounded-[32px] p-4 lg:flex">
					<div class="mb-8 flex items-center gap-4 px-2 pt-2">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white"
						>
							<Wallet size={22} />
						</div>
						<div>
							<h1 class="text-lg font-semibold">Expense Tracker</h1>
						</div>
					</div>

					<nav class="grid gap-2">
						{#each navigationItems as item}
							<a
								href={item.href}
								class={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
									page.url.pathname === item.href
										? 'bg-[var(--accent)] text-white'
										: 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
								}`}
							>
								<item.icon size={18} />
								<span>{item.label}</span>
							</a>
						{/each}
					</nav>
				</aside>

				<div class="content-shell">
					<div class="mb-6 hidden items-start gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto]">
						<header class="desktop-page-header surface">
							<div>
								<p
									class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]"
								>
									Expense Tracker
								</p>
								<h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em]">
									{currentRoute.title}
								</h2>
								<p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
									{currentRoute.description}
								</p>
							</div>
						</header>
						<div class="surface flex rounded-[28px] p-2">
							<UserMenu user={$user} onLogin={handleLogin} onLogout={handleLogout} />
						</div>
					</div>

					<header class="mobile-header mb-5 lg:hidden">
						<div class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
							<div class="surface flex items-center gap-4 rounded-[28px] px-4 py-4">
								<div
									class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-white"
								>
									<Wallet size={20} />
								</div>
								<div>
									<h1 class="text-lg font-semibold">Expense Tracker</h1>
								</div>
							</div>
							<div class="surface flex rounded-[24px] p-2">
								<UserMenu user={$user} onLogin={handleLogin} onLogout={handleLogout} />
							</div>
						</div>
					</header>

					{@render children()}
				</div>
			</div>
		</div>

		<nav class="mobile-bottom-nav lg:hidden">
			{#each mobileNavigationItems as item}
				<a
					href={item.href}
					class={`mobile-bottom-link ${
						page.url.pathname === item.href ? 'mobile-bottom-link-active' : ''
					}`}
				>
					<item.icon size={16} />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</div>
{/if}
