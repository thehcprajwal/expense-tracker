<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { ChevronDown, LogIn, LogOut } from 'lucide-svelte';
	import type { UserState } from '$lib/types';

	interface Props {
		user: UserState;
		onLogin: () => Promise<void> | void;
		onLogout: () => Promise<void> | void;
	}

	let { user, onLogin, onLogout }: Props = $props();

	const initials = $derived(
		user.name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('') || 'U'
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left transition hover:bg-[var(--surface-muted)]"
	>
		<div
			class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white"
		>
			{initials}
		</div>
		<div class="hidden min-w-0 sm:block">
			<p class="truncate text-sm font-medium">{user.name}</p>
			<p class="text-xs text-[var(--text-muted)] capitalize">{user.mode}</p>
		</div>
		<span class="text-[var(--text-muted)]">
			<ChevronDown size={16} />
		</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			sideOffset={8}
			align="end"
			class="z-50 min-w-60 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_48px_rgba(16,24,22,0.18)] outline-none"
		>
			<div class="px-3 py-2">
				<p class="text-sm font-semibold">{user.name}</p>
				{#if user.email}
					<p class="mt-1 text-xs text-[var(--text-muted)]">{user.email}</p>
				{:else}
					<p class="mt-1 text-xs text-[var(--text-muted)] capitalize">{user.mode}</p>
				{/if}
			</div>
			<DropdownMenu.Separator class="my-1 h-px bg-[var(--border)]" />
			{#if user.mode === 'authenticated'}
				<DropdownMenu.Item
					class="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-[var(--expense)] outline-none transition data-[highlighted]:bg-[var(--surface-muted)]"
					onclick={onLogout}
				>
					<LogOut size={16} />
					<span>Logout</span>
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item
					class="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-[var(--text)] outline-none transition data-[highlighted]:bg-[var(--surface-muted)]"
					onclick={onLogin}
				>
					<LogIn size={16} />
					<span>Sign in with Google</span>
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
