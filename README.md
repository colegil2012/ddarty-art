# Artist Site

Portfolio and commission-request site for a working painter.

- **Backend** — Java 21 / Spring Boot 3.5, MongoDB, DigitalOcean Spaces for images
- **Frontend** — SvelteKit 2 / Svelte 5

This repo is self-contained. It shares no directory structure with the
landscaping site; the two were built to the same architecture but deploy
independently.

---

## Layout

```
artist-site/
├── api/                        Spring Boot backend
│   ├── src/main/java/com/studio/api/
│   │   ├── config/             Storage, CORS, static resources, seed data
│   │   ├── controller/         REST endpoints + validation error handling
│   │   ├── dto/                Request/response records
│   │   ├── model/              Mongo documents
│   │   ├── repository/         Spring Data repositories
│   │   ├── service/            Business logic
│   │   └── storage/            ImageStore abstraction (local vs Spaces)
│   └── src/main/resources/
│       ├── application.yml     Local profile + defaults
│       └── application-prod.yml
├── local-images/               Image root for local development
└── web/                        SvelteKit frontend
    ├── src/
    │   ├── lib/
    │   │   ├── api/client.js   Fetch wrapper for the Spring API
    │   │   ├── components/     Component + its own CSS, side by side
    │   │   └── styles/root.css Design tokens — every color/size/timing
    │   ├── routes/             One folder per page, each with its page.css
    │   └── scripts/pages/      Page logic split out of components
    └── static/
```

### Where styles live

`src/lib/styles/root.css` holds every design token — colors, type scale,
spacing, motion timings — plus the reset and a few shared primitives
(`.btn`, `.shell`, `.eyebrow`). Nothing downstream hardcodes a literal value.

Each component imports its own stylesheet next to it (`SiteNav.svelte` →
`SiteNav.css`). Each route imports its own `page.css`. Both consume tokens
from `root.css` and never redefine them.

### Where page logic lives

Behaviour that isn't markup goes in `src/scripts/pages/`. The contact form's
validation rules, payload shaping, and submit lifecycle live in
`scripts/pages/contact.js`; the component imports them and stays limited to
rendering and event binding. This keeps the rules unit-testable without
mounting a component.

---

## Running locally

You need Java 21, Node 20+, and MongoDB on `localhost:27017`.

### Backend

```bash
cd api
cp .env.example .env      # then edit
mvn spring-boot:run
```

Runs on `:8080` under the `local` profile. On first start it seeds eight
sample pieces so the frontend has something to render.

Images are read from and written to `../local-images/`, served at
`/images/**`. Drop files in there matching the seeded keys
(`artwork/<slug>.jpg`) to see real images.

### Frontend

```bash
cd web
npm install
npm run dev
```

Runs on `:5173`. Vite proxies `/api` and `/images` to `:8080`, so the browser
sees a single origin and CORS never comes up in development.

---

## API

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/gallery` | All artwork |
| `GET` | `/api/gallery?random=true&limit=8` | Random sample via Mongo `$sample` |
| `GET` | `/api/gallery?featured=true` | Curated selection |
| `GET` | `/api/gallery?tag=ink` | Filter by tag |
| `GET` | `/api/gallery/{id}` | Single piece |
| `POST` | `/api/contact` | Submit a commission request |

Validation failures return `400` with a flat `fields` map the form renders
directly against its inputs:

```json
{
  "status": "invalid",
  "message": "Check the highlighted fields and try again.",
  "fields": { "email": "Enter a valid email address" }
}
```

---

## Images

`ImageStore` is the only thing that knows where images live:

- `LocalImageStore` (`@Profile("local")`) — writes to `local-images/`, served
  by a static resource handler. Guards against path traversal in keys.
- `SpacesImageStore` (`@Profile("prod")`) — DigitalOcean Spaces via the AWS
  SDK v2 with a custom endpoint. Sets a one-year immutable cache header.

Controllers and services depend on the interface, so switching profiles
changes nothing else. Documents store storage *keys*; the service layer
resolves them to URLs when building DTOs.

### Before going live

Generate thumbnails on upload rather than serving full-size images in the
grid — Thumbnailator is already a dependency. Store a real LQIP (a tiny
base64 blur) on each document so tiles don't pop in; the seed data uses a
placeholder. Put the Spaces CDN in front of the bucket and point
`SPACES_CDN_BASE` at it.

---

## Deploying

**API** — `mvn package` produces a jar. Run with `SPRING_PROFILES_ACTIVE=prod`
and the environment variables from `.env.example`. Any container host works;
DigitalOcean App Platform is the path of least resistance alongside Spaces.

**Web** — `npm run build` produces a Node server at `build/index.js` via
`@sveltejs/adapter-node`.

Both components deploy as Docker containers to DigitalOcean App Platform.
See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full walkthrough — app spec,
Dockerfiles, health checks, domains, and troubleshooting.

Quick version:

```bash
# edit .do/app.yaml: set your GitHub repo and the CHANGE_ME values
doctl apps create --spec .do/app.yaml
```

---

## Testing

The contact form's validation is pure and importable:

```js
import { validate, emptyForm } from '$scripts/pages/contact.js';
```

No test runner is wired up yet — add Vitest when you want the suite.
