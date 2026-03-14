import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import {
	GoogleAuthProvider,
	browserLocalPersistence,
	onAuthStateChanged,
	setPersistence,
	signInWithPopup,
	signOut,
	type User
} from 'firebase/auth';
import type { UserState } from '$lib/types';
import { getFirebaseAuth, isFirebaseConfigured } from '$lib/services/firebase';

export const guestUser: UserState = {
	id: null,
	name: 'Offline user',
	email: null,
	mode: 'guest'
};

const authState = writable<UserState>(guestUser);

export const authStore = {
	subscribe: authState.subscribe
};

let listenerInitialized = false;
let initialAuthPromise: Promise<UserState> | null = null;
let resolveInitialAuth: ((user: UserState) => void) | null = null;

function mapFirebaseUser(user: User | null): UserState {
	if (!user) return guestUser;

	return {
		id: user.uid,
		name: user.displayName ?? user.email ?? 'Google user',
		email: user.email,
		mode: 'authenticated'
	};
}

async function ensureAuthListener() {
	if (listenerInitialized || !browser || !isFirebaseConfigured()) return;

	const auth = getFirebaseAuth();
	if (!auth) return;

	listenerInitialized = true;
	initialAuthPromise = new Promise<UserState>((resolve) => {
		resolveInitialAuth = resolve;
	});

	onAuthStateChanged(auth, (user) => {
		const nextUser = mapFirebaseUser(user);
		authState.set(nextUser);

		if (resolveInitialAuth) {
			resolveInitialAuth(nextUser);
			resolveInitialAuth = null;
		}
	});
}

export async function initializeAuth() {
	if (!browser || !isFirebaseConfigured()) {
		authState.set(guestUser);
		return guestUser;
	}

	await ensureAuthListener();
	if (resolveInitialAuth && initialAuthPromise) {
		return initialAuthPromise;
	}

	return get(authState);
}

export async function loginWithGoogle() {
	if (!browser || !isFirebaseConfigured()) {
		throw new Error('Firebase Auth is not configured. Add your public Firebase env vars first.');
	}

	await ensureAuthListener();
	const auth = getFirebaseAuth();
	if (!auth) {
		throw new Error('Unable to initialize Firebase Auth.');
	}

	await setPersistence(auth, browserLocalPersistence);
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
}

export async function logout() {
	if (!browser || !isFirebaseConfigured()) {
		authState.set(guestUser);
		return;
	}

	const auth = getFirebaseAuth();
	if (!auth) {
		authState.set(guestUser);
		return;
	}

	await signOut(auth);
}
