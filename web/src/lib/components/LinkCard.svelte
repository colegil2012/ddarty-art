<script>
  import './LinkCard.css';

  /**
   * Homepage highlight card. The signature interaction: a panel of ground
   * colour covers the image and wipes away on hover, so the work is
   * "uncovered" rather than merely scaled.
   */
  let { href, eyebrow, title, blurb, cta, image = null, index = 0 } = $props();

  let hovered = $state(false);
</script>

<a
  {href}
  class="card"
  class:card--hovered={hovered}
  style="--card-index: {index}"
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onfocusin={() => (hovered = true)}
  onfocusout={() => (hovered = false)}
>
  <div class="card__media">
    {#if image}
      <img src={image} alt="" loading="lazy" decoding="async" />
    {:else}
      <div class="card__media-fallback"></div>
    {/if}
    <span class="card__curtain"></span>
  </div>

  <div class="card__body">
    <span class="eyebrow">{eyebrow}</span>
    <h3 class="card__title">{title}</h3>
    <p class="card__blurb">{blurb}</p>
    <span class="card__cta">
      {cta}
      <svg class="card__arrow" viewBox="0 0 24 12" aria-hidden="true">
        <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </span>
  </div>
</a>
