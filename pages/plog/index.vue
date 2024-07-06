<script setup>
import { useI18n } from 'vue-i18n';

useHead({
  title: 'Plog',
})

const { locale } = useI18n({ useScope: 'global' })
const { data: photos } = await useFetch('/api/photo')

const photoList = [...photos.value]

</script>

<template>
  <article class="blog active" data-page="blog">
    <header>
      <h2 class="h2 article-title">
        {{ $t('pageTitles.plog') }}
      </h2>
    </header>

    <section class="blog-posts">
      <ul class="blog-posts-list">
        <li v-for="project in projectList" :key="project.id" :class="{ active: activeCategory === project.category.id || activeCategory === 0 }" class="project-item"></li>
        <li v-for="photo in photoList" :key="photo.id" class="blog-post-item">
          <a>
            <figure class="blog-banner-box">
              <img :src="photo.image" alt="photo.title" loading="lazy">
            </figure>

            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">{{ locale === 'en' ? photo.location?.en : photo.location?.id_ID }}</p>
                <span class="dot" />
                <time>{{ locale === 'en' ? photo.time?.en : photo.time?.id_ID }}</time>
              </div>
              <h4 class="h4 blog-item-title">{{ locale === 'en' ? photo.title?.en : photo.title?.id_ID }}</h4>
            </div>
          </a>
        </li>
      </ul>
    </section>
  </article>
</template>
