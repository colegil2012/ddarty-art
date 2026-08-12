import { api } from '$lib/api/client.js';

/**
 * Fetch the about-page meta so `data.meta` is populated for the component.
 * Falls back to an empty object so the page still renders its static chrome
 * if the read fails.
 */
export async function load() {
    try {
        return { meta: await api.meta() };
    } catch {
        return { meta: {} };
    }
}