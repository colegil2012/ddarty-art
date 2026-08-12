<script>
  import { fade, scale } from 'svelte/transition';
  import './page.css';

  let { data } = $props();

  const pieces = $derived(data.pieces ?? []);
  const status = $derived(
    data.loadError ? 'error' : pieces.length ? 'ready' : 'empty'
  );

  let activeTag = $state('all');
  let selected = $state(null);

  const tags = $derived(
    ['all', ...new Set(pieces.flatMap((p) => p.tags ?? []))]
  );

  const visible = $derived(
    activeTag === 'all' ? pieces : pieces.filter((p) => p.tags?.includes(activeTag))
  );

  function onKeydown(event) {
    if (event.key === 'Escape') selected = null;
  }

  /** Turns a tag slug like "cyber-samurai" into "Cyber samurai". */
  function label(tag) {
    if (tag === 'all') return 'all';
    const spaced = (tag ?? '').replace(/-/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }
</script>

<svelte:head>
  <title>Gallery | DDarty</title>
</svelte:head>

<svelte:window on:keydown={onKeydown} />

<header class="gallery-head shell">
  <span class="eyebrow">Everything, in one place</span>
  <h1 class="gallery-head__title">Gallery</h1>

  {#if status === 'ready'}
    <div class="filters" role="group" aria-label="Filter by tag">
      {#each tags as tag}
        <button
          class="filters__tag"
          class:filters__tag--on={activeTag === tag}
          onclick={() => (activeTag = tag)}
        >
          {label(tag)}
        </button>
      {/each}
    </div>
  {/if}
</header>

<div class="gallery shell">
  {#if status === 'ready'}
    <div class="gallery__grid">
      {#each visible as piece (piece.id)}
        <button
          class="tile"
          id={piece.id}
          onclick={() => (selected = piece)}
          in:fade={{ duration: 300 }}
        >
          <img
            src={piece.thumbUrl ?? piece.imageUrl}
            alt={piece.title}
            loading="lazy"
            decoding="async"
            width={piece.width}
            height={piece.height}
          />
          <span class="tile__overlay">
            <span class="tile__title">{piece.title}</span>
            <span class="tile__meta">{piece.medium}{piece.year ? `, ${piece.year}` : ''}</span>
          </span>
        </button>
      {/each}
    </div>
  {:else if status === 'empty'}
    <p class="gallery__notice">No work published yet. Check back soon.</p>
  {:else}
    <p class="gallery__notice">The gallery could not load. Refresh to try again.</p>
  {/if}
</div>

{#if selected}
  <div
    class="lightbox"
    role="dialog"
    aria-modal="true"
    aria-label={selected.title}
    transition:fade={{ duration: 220 }}
  >
    <button class="lightbox__scrim" onclick={() => (selected = null)} aria-label="Close"></button>

    <figure class="lightbox__panel" transition:scale={{ duration: 320, start: 0.96 }}>
      <img src={selected.imageUrl ?? selected.thumbUrl} alt={selected.title} />
      <figcaption class="lightbox__caption">
        <h2 class="lightbox__title">{selected.title}</h2>
        <p class="lightbox__meta">
          {selected.medium}{selected.year ? `, ${selected.year}` : ''}
        </p>
        {#if selected.description}
          <p class="lightbox__desc">{selected.description}</p>
        {/if}
        <a href="/contact" class="link-accent">Ask about this piece</a>
      </figcaption>
      <button class="lightbox__close" onclick={() => (selected = null)}>
        <span class="visually-hidden">Close</span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.5" fill="none" />
        </svg>
      </button>
    </figure>
  </div>
{/if}