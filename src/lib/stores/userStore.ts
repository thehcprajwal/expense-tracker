import { writable } from 'svelte/store';
import { authStore, guestUser, initializeAuth } from '$lib/services/auth';
import type { UserState } from '$lib/types';

const userState = writable<UserState>(guestUser);

authStore.subscribe((user) => {
	userState.set(user);
});

export const userStore = {
	subscribe: userState.subscribe,
	async initialize() {
		const user = await initializeAuth();
		userState.set(user);
		return user;
	}
};
