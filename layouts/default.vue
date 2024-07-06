<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })

useHead({
  htmlAttrs: {
    lang: locale,
  },
  titleTemplate: (pageTitle) => {
    return pageTitle ? `${pageTitle} - Zihao Wang ` : 'Zihao Wang'
  },
  meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'Personal site about Zihao Wang.' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'og:image', content: 'https://raw.githubusercontent.com/ZihaoWang2000/zihaoblog/main/IMG_3050.jpeg' }
    ],
  link: [
    {
      rel: 'icon', type: 'image/jpg', href: '../images/icon.jpg',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap',
      crossorigin: '',
    },
  ],
  script: [
    {
      src: 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js',
      body: false,
      type: 'module',
    },
    {
      src: 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js',
      body: false,
      nomodule: true,
    },
  ],
})
</script>

<template>
  <main class="relative">
    <Sidebar />
    <div class="main-content">
      <Navbar />
      <slot />
    </div>
    <CookieBar />
  </main>
</template>
