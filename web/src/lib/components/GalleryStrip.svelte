<script>
  import { fade } from 'svelte/transition';
  import './GalleryStrip.css';

  /** Horizontally scrollable random selection, used on the homepage. */
  let { pieces = [], limit = 8 } = $props();

  // Sample once from whatever the parent's server load provided.
  const sample = $derived(
    [...pieces].sort(() => Math.random() - 0.5).slice(0, limit)
  );
  const status = $derived(sample.length ? 'ready' : 'empty');
</script>

<div class="strip">
  {#if status === 'ready'}
    <ul class="strip__track" in:fade={{ duration: 400 }}>
      {#each sample as piece, i (piece.id)}
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
  {:else}
    <p class="strip__notice">No work published yet.</p>
  {/if}
</div>