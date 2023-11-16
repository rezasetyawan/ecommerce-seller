// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  ssr: false,
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL as string,
      APP_BASE_URL: process.env.APP_BASE_URL as string,
    }
  },
  build: {
    transpile: ['vue-sonner']
  },
  routeRules: {
    '/**': {
      proxy: { to: process.env.APP_BASE_URL as string + '/**', headers: { 'Access-Control-Allow-Origin': '*' } },
    },
  },
})

