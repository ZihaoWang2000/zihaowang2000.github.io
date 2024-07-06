<script setup>
let isOpen = ref(false)

function toggleMenu() {
  isOpen = !isOpen
}
</script>

<template>
  <aside class="sidebar" :class="{ active: isOpen }">
    <div class="sidebar-info">
      <figure class="avatar-box">
        <img src="/images/avatar.jpeg" alt="Photo" width="80">
      </figure>

      <div class="info-content">
        <h1 class="name" title="Zihao Wang">
          Zihao Wang
        </h1>

        <p class="title text-center xl:block flex items-center justify-center gap-1">
          <span class="xl:after:content-[''] after:content-[',']">Master's Student at EPFL</span>
        </p>
      </div>

      <button class="info_more-btn" @click="isOpen = !isOpen">
        <span>Show Contacts</span>

        <ion-icon name="chevron-down" />
      </button>
    </div>

    <div class="sidebar-info_more">
      <div class="separator" />

      <ul class="contacts-list">
        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="logo-github" />
          </div>

          <div class="contact-info">
            <p class="contact-title">
              Github
            </p>
            <a href="https://github.com/ZihaoWang2000" class="contact-link" target="_blank">ZihaoWang2000</a>
          </div>
        </li>

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="logo-linkedin" />
          </div>

          <div class="contact-info">
            <p class="contact-title">
              Linkedin
            </p>

            <a href="https://www.linkedin.com/in/zihao-wang-elliott" class="contact-link" target="_blank">Zihao Wang</a>
          </div>
        </li>

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="logo-instagram" />
          </div>
          <div class="contact-info">
            <p class="contact-title">
              INSTAGRAM
            </p>
            <a href="https://www.instagram.com/wzhelliott/" class="contact-link" target="_blank">wzhelliott</a>
          </div>
        </li>

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="calendar-outline"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">Birthday</p>
            <time datetime="2000-10-03">Oct 3, 2000</time>
          </div>
        </li>
      </ul>

      <div class="separator" />

      <ul class="social-list">
        <li class="social-item">
          <NuxtLink to="mailto:elliott_wang2000@outlook.com" class="social-link" target="_blank">
            <ion-icon name="mail-outline" />
          </NuxtLink>
        </li>
        <LangSwitcher2 />
        <!-- <DarkToggle /> -->
      </ul>
    </div>
  </aside>
</template>
