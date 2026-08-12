import { api } from '$lib/api/client.js';

/**
 * Load the gallery ({ categories, pieces }) on the server for first paint.
 * On failure, return empty collections and a flag so the page shows its
 * error state.
 */
export async function load({ fetch }) {
    try {
        const grouped = await api.galleryGrouped({ fetch });
        return { ...grouped, loadError: false };
    } catch {
        return { categories: [], pieces: [], loadError: true };
    }
}