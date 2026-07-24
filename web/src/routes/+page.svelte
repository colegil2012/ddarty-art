<script>
  import LinkCard from '$components/LinkCard.svelte';
  import GalleryStrip from '$components/GalleryStrip.svelte';
  import { onMount } from 'svelte';
  import './page.css';

  let mounted = $state(false);
  onMount(() => { mounted = true; });

  const cards = [
    {
      href: '/gallery',
      eyebrow: 'The work',
      title: 'Gallery',
      blurb: 'Paintings, drawings, and studies from the last four years — including the pieces that never left the studio.',
      cta: 'See the gallery'
    },
    {
      href: '/bio',
      eyebrow: 'The person',
      title: 'About Daniel',
      blurb: 'Twelve years of painting the same few miles of river, and why that has not gotten old yet.',
      cta: 'Read more'
    },
    {
      href: '/contact',
      eyebrow: 'Commissions',
      title: 'Get a custom piece',
      blurb: 'Portraits, landscapes, and work made from your own photographs. Currently booking for spring.',
      cta: 'Start a request'
    }
  ];
</script>

<svelte:head>
  <title>Daniel Daugherty — Digital Artist</title>
  <meta name="description" content="Stylized digital art, including portraits, landscapes, and work made from your own photographs." />
</svelte:head>

<section class="hero" class:hero--in={mounted}>
  <div class="hero__inner shell">
    <span class="eyebrow hero__eyebrow">Artist · Bum Fuck, Florida</span>
    <h1 class="hero__title">
      <span class="hero__line">Daniel</span>
      <span class="hero__line hero__line--indent">Daugherty</span>
    </h1>
    <p class="hero__lede">
      Stylized Character portraits, Scenes, Landscapes and whatever else I feel like making.
    </p>
    <div class="hero__actions">
      <a href="/gallery" class="btn btn--solid">See the work</a>
      <a href="/contact" class="btn">Commission a piece</a>
    </div>
  </div>

  <div class="hero__rule" aria-hidden="true"></div>
</section>

<section class="selection">
  <div class="selection__head shell">
    <span class="eyebrow">A different set each visit</span>
    <h2 class="selection__title">Pulled at random from the archive</h2>
  </div>
  <GalleryStrip limit={8} />
</section>

<section class="highlights shell">
  <div class="highlights__grid">
    {#each cards as card, i}
      <LinkCard {...card} index={i} />
    {/each}
  </div>
</section>

<section class="closing shell">
  <p class="closing__text">
    Commissions open for spring. Most pieces take six to ten weeks from first
    conversation to delivery.
  </p>
  <a href="/contact" class="btn btn--solid">Start a request</a>
</section>
