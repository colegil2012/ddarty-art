<script>
  import { safehtml } from '$lib/safehtml.js';
  import './page.css';

  let { data } = $props();
  const meta = $derived(data.meta ?? {});

  // The three prose sections in render order (only those with content).
  const sections = $derived(
    [meta.topSection, meta.midSection, meta.bottomSection].filter(
      (s) => s && (s.header || s.section)
    )
  );

  // Show the portal copy when present; otherwise fall back to static chrome.
  const hasPortalCopy = $derived(sections.length > 0);
</script>

<svelte:head>
  <title>About | DDarty</title>
  <meta name="description" content="About Daniel, a digital artist specialized in stylized illustrations." />
</svelte:head>

<article class="bio">
  <header class="bio__head shell">
    <span class="eyebrow">About</span>
    <h1 class="bio__title">{@html safehtml(meta.aboutHeader ?? 'Twelve years, one river')}</h1>
  </header>

  <div class="bio__body shell">
    <div class="bio__portrait">
      {#if meta.aboutImageUrl}
        <img
          class="bio__portrait-frame bio__portrait-frame--img"
          src={meta.aboutImageUrl}
          alt={meta.aboutImageAltText ?? meta.aboutImageCaption ?? 'Daniel in the studio'}
          loading="lazy"
          decoding="async"
        />
      {:else}
        <div class="bio__portrait-frame"></div>
      {/if}
      <p class="bio__caption">{meta.aboutImageCaption ?? 'In the studio, February'}</p>
    </div>

    <div class="bio__prose">
      {#if hasPortalCopy}
        {#each sections as sec, i}
          {#if sec.header}
            <h2 class="bio__h2" class:bio__lede={i === 0 && !sec.section}>
              {@html safehtml(sec.header)}
            </h2>
          {/if}
          {#if sec.section}
            <p class:bio__lede={i === 0}>{@html safehtml(sec.section)}</p>
          {/if}
        {/each}
      {:else}
        <p class="bio__lede">
          I paint the Ohio River, mostly. The same four or five miles of it,
          over and over, at whatever hour the light does something I have not
          already recorded.
        </p>
        <p>
          Returning to one subject long enough turns it into a different subject.
          The river in November is not the river in June wearing a coat. It is a
          separate problem with separate colors.
        </p>
        <h2 class="bio__h2">How the work gets made</h2>
        <p>
          Nearly everything starts outdoors on paper — graphite, sometimes ink,
          usually in under an hour. The ones that become paintings get built up
          slowly in oil over several weeks.
        </p>
        <h2 class="bio__h2">Commissions</h2>
        <p>
          I take a small number of commissions each year, mostly landscapes and
          occasionally portraits worked from photographs.
        </p>
      {/if}

      <div class="bio__cta">
        <a href="/contact" class="btn btn--solid">Start a request</a>
        <a href="/gallery" class="btn">See the work first</a>
      </div>
    </div>
  </div>
</article>