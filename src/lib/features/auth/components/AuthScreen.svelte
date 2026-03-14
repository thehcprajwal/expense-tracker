<script lang="ts">
	import { Wallet, ShieldCheck } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		authConfigured: boolean;
		errorMessage?: string;
		onLogin: () => Promise<void> | void;
	}

	let { authConfigured, errorMessage = '', onLogin }: Props = $props();
</script>

<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4 py-10">
	<div class="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
		<section class="surface rounded-[36px] p-8 md:p-10">
			<div
				class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[var(--accent)] text-white"
			>
				<Wallet size={24} />
			</div>
			<p class="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
				Expense Tracker
			</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
				Track money with one Google sign-in.
			</h1>
			<p class="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
				Sign in to access your personal balance, transactions, recurring entries, and insights.
			</p>

			<div class="mt-8">
				<Button class="h-13 rounded-[22px] px-6 text-base" onclick={onLogin}>
					Sign in with Google
				</Button>
			</div>

			{#if errorMessage}
				<p class="mt-4 text-sm text-[var(--expense)]">{errorMessage}</p>
			{/if}
		</section>

		<aside class="surface rounded-[36px] p-8">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--accent)]"
				>
					<ShieldCheck size={18} />
				</div>
				<h2 class="text-lg font-semibold">Access control</h2>
			</div>

			<div class="mt-6 grid gap-4 text-sm leading-6 text-[var(--text-muted)]">
				<p>Authentication is required before the app UI becomes available.</p>
				<p>Your account menu and logout remain available after sign-in from the header.</p>
				{#if !authConfigured}
					<p class="text-[var(--expense)]">
						Firebase Auth is not configured in the environment yet, so Google sign-in cannot start.
					</p>
				{/if}
			</div>
		</aside>
	</div>
</div>
