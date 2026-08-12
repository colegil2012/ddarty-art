/**
 * Minimal allow-list HTML sanitizer for portal-managed copy.
 *
 * The about-page text comes from the Celtech admin portal and may contain a few
 * formatting tags. We render that with {@html}, which would otherwise be an XSS
 * vector, so we strip everything except a small whitelist of inline tags and
 * drop all attributes. Runs in both browser (DOMParser) and SSR (regex).
 */
const ALLOWED = new Set(['br', 'strong', 'b', 'em', 'i', 'u', 'span', 'sub', 'sup']);

function decodeEntities(s) {
    return s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
}

export function safehtml(input) {
    if (!input) return '';
    const raw = decodeEntities(String(input));

    if (typeof document === 'undefined') {
        return raw.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tag) => {
            const name = tag.toLowerCase();
            if (!ALLOWED.has(name)) return '';
            return match.startsWith('</') ? `</${name}>` : `<${name}>`;
        });
    }

    const doc = new DOMParser().parseFromString(raw, 'text/html');

    const clean = (node) => {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const name = child.tagName.toLowerCase();
                if (!ALLOWED.has(name)) {
                    clean(child);
                    child.replaceWith(...child.childNodes);
                    return;
                }
                [...child.attributes].forEach((attr) => child.removeAttribute(attr.name));
                clean(child);
            }
        });
    };

    clean(doc.body);
    return doc.body.innerHTML;
}