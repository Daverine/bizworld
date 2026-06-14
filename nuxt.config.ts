// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  typescript: {
    strict: true,
  },
  modules: [
    "@hypernym/nuxt-anime",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@regle/nuxt",
    "@nuxt/eslint",
    "@nuxt/image",
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@regle/core",
        "@regle/rules",
        "@vueuse/integrations/useSortable",
        "better-auth/client/plugins",
        "better-auth/vue",
      ],
    },
  },
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
          format: "webp",
          height: 128,
        },
      },
      thumbnail: {
        modifiers: {
          format: "webp",
          width: 250,
        },
      },
    },
  },
  css: ["~/assets/lui.css", "~/assets/main.css"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },
  devServer: {
    port: 3000,
    host: "127.0.0.1", // Or your desired host
  },
  nitro: {
    storage: {
      uploads: {
        driver: "fs",
        base: "./public/uploads",
      },
    },
  },
});
