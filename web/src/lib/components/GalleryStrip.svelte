<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { api } from '$lib/api/client.js';
  import './GalleryStrip.css';

  /** Horizontally scrollable random selection, used on the homepage. */
  let { limit = 8 } = $props();

  let pieces = $state([]);
  let status = $state('loading'); // loading | ready | empty | error

  onMount(async () => {
    try {
      const data = await api.gallery({ random: true, limit });
      pieces = data ?? [];
      status = pieces.length ? 'ready' : 'empty';
    } catch {
      status = 'error';
    }
  });
</script>

<div class="strip">
  {#if status === 'loading'}
    <div class="strip__track" aria-hidden="true">
      {#each Array(4) as _}
        <div class="strip__item strip__item--skeleton"></div>
      {/each}
    </div>
  {:else if status === 'ready'}
    <ul class="strip__track" in:fade={{ duration: 400 }}>
      {#each pieces as piece, i (piece.id)}
        <li class="strip__item" style="--item-index: {i}">
          <a href="/gallery#{piece.id}" class="strip__link">
            <figure class="strip__figure">
              <img
                src={piece.thumbUrl ?? piece.imageUrl}
                alt={piece.title}
                loading="lazy"
                decoding="async"
                width={piece.width}
                height={piece.height}
              />
              <figcaption class="strip__caption">
                <span class="strip__title">{piece.title}</span>
                <span class="strip__meta">{piece.medium}{piece.year ? `, ${piece.year}` : ''}</span>
              </figcaption>
            </figure>
          </a>
        </li>
      {/each}
    </ul>
  {:else if status === 'empty'}
    <p class="strip__notice">No work published yet.</p>
  {:else}
    <p class="strip__notice">The gallery could not load. Refresh to try again.</p>
  {/if}
</div>
