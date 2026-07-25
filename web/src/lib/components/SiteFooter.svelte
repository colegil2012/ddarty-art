<script>
  import './SiteFooter.css';
  const year = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="footer__inner shell">
    <div class="footer__brand">
      <span class="footer__name">Daniel Daugherty</span>
      <p class="footer__line">Digital Artist specialized in stylized illustrations</p>
    </div>

    <nav class="footer__links" aria-label="Footer">
      <a href="/gallery" class="footer__link">Gallery</a>
      <a href="/bio" class="footer__link">About</a>
      <a href="/contact" class="footer__link">Contact</a>
    </nav>
  </div>

  <div class="footer__base shell">
    <span>&copy; {year} Daniel Daugherty</span>
    <a href="/contact" class="link-accent">Commission a piece</a>
  </div>
</footer>
