// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: {
    strict: false,
  },
  modules: [
    '@hypernym/nuxt-anime',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
  ],
  image: {
    screens: {
      sm: 448,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      logo: {
        modifiers: {
          format: 'webp',
          height: 128,
          densities: '1x',
        },
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 250,
          densities: '1x',
        },
      },
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: '/css/lui.css',
        },
        { rel: 'icon', href: '/favicon.png' },
      ],
    },
  },
  css: ['~/assets/style.scss'],
  devServer: {
    port: 3000,
    host: '0.0.0.0', // Or your desired host
  },
});
