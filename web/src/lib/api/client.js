/**
 * Ddarty frontend API client — consumes the centralized Celtech API.
 *
 * All data comes from https://celtechsolutions.tech/api. Gallery reads are
 * public + cached; the contact form POSTs leads to the centralized inquiry
 * endpoint. This site no longer has its own Spring API or database.
 *
 * Unlike the landscaping site, Ddarty has no albums: the gallery is one
 * congruent set of pieces, filterable by tag.
 */

import { env } from '$env/dynamic/public';

const BASE = env.PUBLIC_API_BASE ?? 'https://celtechsolutions.tech';

/** This site's slug on the Celtech platform (the Spaces folder + URL segment). */
const SITE_SLUG = env.PUBLIC_SITE_SLUG ?? 'ddarty';

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function request(path, options = {}) {
  const { fetch: customFetch, ...init } = options;
  const doFetch = customFetch ?? fetch;
  let response;
  try {
    response = await doFetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...init.headers },
      ...init
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0, null);
  }
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    throw new ApiError(body?.message ?? 'Something went wrong. Try again in a moment.', response.status, body);
  }
  return body;
}

/**
 * Maps a Celtech GalleryImage DTO into the "piece" shape the Ddarty gallery
 * expects. Every non-album tag is a filter label; there are no albums here.
 * Fields the centralized model doesn't carry are left undefined — the
 * components already guard for those with optional chaining.
 */
function toPiece(img, tagsById) {
  const tags = (img.tagIds ?? [])
      .map((id) => tagsById[id])
      .filter(Boolean)
      .filter((t) => t.kind !== 'album'); // ignore any album tags entirely
  return {
    id: img.id,
    title: img.caption || 'Untitled',
    imageUrl: img.imageUrl,
    thumbUrl: img.thumbUrl,
    lqip: img.lqip,
    // The gallery filters on `tags`, so expose tag slugs (and keep labels handy).
    tags: tags.map((t) => t.slug),
    tagLabels: tags.map((t) => t.label),
    position: img.position,
    description: img.altText || undefined,
    // Not in the centralized model yet — undefined is fine, components guard:
    medium: undefined,
    year: undefined,
    width: undefined,
    height: undefined
  };
}

/** Splits the raw payload into a sorted piece list + a category lookup, once. */
function normalize(data) {
  const tags = data?.tags ?? [];
  const images = data?.images ?? [];
  const tagsById = Object.fromEntries(tags.map((t) => [t.id, t]));

  const byPosition = (a, b) => a.position - b.position;
  const categories = tags.filter((t) => t.kind !== 'album').sort(byPosition);

  const pieces = images
      .map((img) => toPiece(img, tagsById))
      .sort((a, b) => a.position - b.position);

  return { categories, pieces, tagsById };
}

/**
 * The gallery payload rarely changes within a page load, but several callers
 * (the gallery page, the homepage strip) ask for it. We cache the in-flight
 * promise so they share a single network request; the resolved value stays
 * cached until refreshGallery() clears it.
 */
let galleryCache = null;

function fetchRawGallery({ refresh = false, fetch: customFetch } = {}) {
  // In a SvelteKit load we get a request-scoped fetch; use it directly and
  // skip the shared module cache (which would leak across server requests).
  if (customFetch) {
    return request(`/api/sites/${encodeURIComponent(SITE_SLUG)}/gallery`, { fetch: customFetch });
  }
  if (refresh) galleryCache = null;
  if (!galleryCache) {
    galleryCache = request(
        `/api/sites/${encodeURIComponent(SITE_SLUG)}/gallery`
    ).catch((err) => {
      galleryCache = null; // don't cache failures — let the next caller retry
      throw err;
    });
  }
  return galleryCache;
}

/** Force the next gallery read to hit the network (e.g. after an admin edit). */
export function refreshGallery() {
  galleryCache = null;
}

/** The about-page / site meta payload, cached like the gallery read. */
let metaCache = null;

function fetchRawMeta({ refresh = false } = {}) {
  if (refresh) metaCache = null;
  if (!metaCache) {
    metaCache = request(
        `/api/sites/${encodeURIComponent(SITE_SLUG)}/meta`
    ).catch((err) => {
      metaCache = null;
      throw err;
    });
  }
  return metaCache;
}

/** Force the next meta read to hit the network. */
export function refreshMeta() {
  metaCache = null;
}

export const api = {
  /**
   * @param {{random?: boolean, limit?: number, tag?: string}} opts
   * Fetches the site's gallery and returns a flat, piece-shaped array so the
   * existing components need no structural change.
   */
  async gallery(opts = {}) {
    const data = await fetchRawGallery({ fetch: opts.fetch });
    const { pieces } = normalize(data);

    let result = pieces;
    if (opts.tag && opts.tag !== 'all') {
      result = result.filter((p) => p.tags.includes(opts.tag));
    }
    if (opts.random) {
      result = [...result].sort(() => Math.random() - 0.5);
    }
    if (opts.limit) {
      result = result.slice(0, opts.limit);
    }
    return result;
  },

  /**
   * The whole gallery in one shot, already normalized and sorted:
   * { categories, pieces }. Lets the page render filter chips and the grid
   * without re-deriving anything from the two raw arrays.
   */
  async galleryGrouped(opts = {}) {
    const data = await fetchRawGallery(opts);
    const { categories, pieces } = normalize(data);
    return { categories, pieces };
  },

  /** Single piece by id — resolved from the same gallery payload. */
  async piece(id) {
    const all = await this.gallery();
    return all.find((p) => p.id === id) ?? null;
  },

  /**
   * Site meta (about-page copy + about image), managed in the Celtech portal.
   * Three sections (top/mid/bottom), each { header, section }, plus an
   * aboutHeader for the page header. Ddarty does not use serviceHeader facts.
   */
  async meta(opts = {}) {
    const data = await fetchRawMeta(opts);
    if (!data) return {};

    const section = (s) => ({
      header: s?.header || undefined,
      section: s?.section || undefined
    });

    return {
      aboutHeader: data.aboutHeader || undefined,
      bioSections: (data.bioSections ?? []).map(section).filter((s) => s.header || s.section),
      serviceHeader: (data.serviceHeader ?? []).map(section).filter((s) => s.header || s.section),
      aboutImageUrl: data.aboutImageUrl || undefined,
      aboutImageCaption: data.aboutImageCaption || undefined,
      aboutImageAltText: data.aboutImageAltText || undefined
    };
  },

  /** Contact form → centralized inquiry endpoint for this site. */
  submitInquiry(payload) {
    return request(`/api/sites/${encodeURIComponent(SITE_SLUG)}/inquiries`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};