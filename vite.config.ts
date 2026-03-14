import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Expense Tracker',
				short_name: 'Expense Tracker',
				description: 'A personal expense tracker built with SvelteKit.',
				id: '/',
				display: 'standalone',
				background_color: '#F6F1E8',
				theme_color: '#155E63',
				start_url: '/',
				scope: '/',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icon.svg',
						sizes: 'any',
						type: 'image/svg+xml'
					}
				]
			}
		})
	]
});
