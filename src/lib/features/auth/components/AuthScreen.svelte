<script lang="ts">
	import { Wallet } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		authConfigured: boolean;
		errorMessage?: string;
		onLogin: () => Promise<void> | void;
	}

	let { authConfigured, errorMessage = '', onLogin }: Props = $props();
</script>

<div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-4 py-10">
	<section class="surface w-full max-w-3xl rounded-[36px] p-8 text-center md:p-12">
		<div
			class="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[var(--accent)] text-white"
		>
			<Wallet size={28} />
		</div>
		<p class="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
			Expense Tracker
		</p>
		<h1 class="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
			Track money with one Google sign-in.
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
			Sign in to access your personal balance, transactions, recurring entries, and insights.
		</p>

		<div class="mt-8 flex justify-center">
			<Button class="h-13 rounded-[22px] px-6 text-base" onclick={onLogin}>
				Sign in with Google
			</Button>
		</div>

		{#if errorMessage}
			<p class="mt-4 text-sm text-[var(--expense)]">{errorMessage}</p>
		{/if}

		{#if !authConfigured}
			<p class="mt-6 text-sm text-[var(--expense)]">
				Firebase Auth is not configured in the environment yet, so Google sign-in cannot start.
			</p>
		{/if}
	</section>
</div>
