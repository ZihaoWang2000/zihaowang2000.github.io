<script setup>
useHead({
  title: 'Contact',
})
</script>

<template>
  <article class="contact active" data-page="contact">
    <header>
      <h2 class="h2 article-title">{{ $t('pageTitles.contact') }}</h2>
    </header>

    <section class="mapbox" data-mapbox>
      <figure>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.374516536378!2d6.5460361769091175!3d46.54027777111207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c3138b2e7e215%3A0x3856b620e5f5c937!2sFMEL%3A%20Rainbow%20House!5e0!3m2!1szh-CN!2sch!4v1710455432868!5m2!1szh-CN!2sch"
          width="400" height="300" loading="lazy"></iframe>
      </figure>
    </section>

  </article>
</template>