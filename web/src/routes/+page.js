import { api } from '$lib/api/client.js';

/**
 * Load the full gallery on the server so the homepage strip and the card
 * thumbnails have data at first paint. Falls back to an empty list.
 */
export async function load({ fetch }) {
    try {
        return { pieces: await api.gallery({ fetch }) };
    } catch {
        return { pieces: [] };
    }
}