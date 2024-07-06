<script setup>
import { useI18n } from 'vue-i18n'


useHead({
  title: 'Resume',
})

onMounted(() => {
  useLocaleStore()
})

const { locale } = useI18n({ useScope: 'global' })
const { data } = await useFetch('/api/resume')

const education = data._rawValue.education
const experience = data._rawValue.experience

</script>

<template>
  <article class="resume active" data-page="resume">
    <header>
      <h2 class="h2 article-title">
        {{ $t('pageTitles.resume') }}
      </h2>
    </header>

    <section class="timeline">

      <div class="title-wrapper">
        <div class="icon-box">
          <ion-icon name="book-outline"></ion-icon>
        </div>
        <h3 class="h3 timeline-title">
          {{ locale === 'en' ? 'Education' : '教育经历' }}
        </h3>
      </div>

      <ol class="timeline-list">
        <li class="timeline-item" v-for="resume in education" :key="resume.id" :resume="resume">
          <h4 class="h4 timeline-item-title">
            {{ locale === 'en' ? resume.title?.en : resume.title?.id_ID }}
          </h4>
          <span>{{ locale === 'en' ? resume.date?.en : resume.date?.id_ID }}</span>
          <p class="timeline-item-desc">
            {{ locale === 'en' ? resume.location?.en : resume.location?.id_ID }}
          </p>
          <p class="timeline-text">
            {{ locale === 'en' ? resume.position?.en : resume.position?.id_ID }}
          </p>
        </li>
      </ol>
    </section>

    <section class="timeline">
      <div class="title-wrapper">
        <div class="icon-box">
          <ion-icon name="briefcase-outline"></ion-icon>
        </div>
        <h3 class="h3 timeline-title">
          {{ locale === 'en' ? 'Experience' : '实习经历' }}
        </h3>
      </div>

      <ol class="timeline-list">
        <li class="timeline-item" v-for="resume in experience" :key="resume.id" :resume="resume">
          <h4 class="h4 timeline-item-title">
            {{ locale === 'en' ? resume.title?.en : resume.title?.id_ID }}
          </h4>
          <span>{{ locale === 'en' ? resume.date?.en : resume.date?.id_ID }}</span>
          <p class="timeline-item-desc">
            {{ locale === 'en' ? resume.location?.en : resume.location?.id_ID }}
          </p>
          <p class="timeline-text">
            {{ locale === 'en' ? resume.position?.en : resume.position?.id_ID }}
          </p>
        </li>
      </ol>
    </section>

    <section class="skill">
      <ul class="skills-list content-card">
        <li class="skills-item">
          <div class="title-wrapper">
            <h5 class="h5">
              UI/UX Design & Multimedia (PS, PR, AE, Adobe XD, Final Cut)
            </h5>
            <data value="80">90%</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill" style="width: 90%;" />
          </div>
        </li>

        <li class="skills-item">
          <div class="title-wrapper">
            <h5 class="h5">
              Data Analysis (Python, MySQL, Stata, Gephi)
            </h5>
            <data value="70">70%</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill" style="width: 70%;" />
          </div>
        </li>

        <li class="skills-item">
          <div class="title-wrapper">
            <h5 class="h5">
              Web Development (MIS, Wordpress, PHP, Vue.js)
            </h5>
            <data value="60">60%</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill" style="width: 60%;" />
          </div>
        </li>
      </ul>
    </section>
  </article>
</template>
