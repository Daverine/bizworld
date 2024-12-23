// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@hypernym/nuxt-anime', '@vueuse/nuxt', '@pinia/nuxt', '@nuxt/icon'],
  app: {
    head: {
      link: [{
        rel: 'stylesheet',
        href: '/css/lui.css'
      }]
    }
  },
  css: ['~/assets/style.scss'],
})