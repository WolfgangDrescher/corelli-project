// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: ['@nuxt/content', '@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    colorMode: {
        preference: 'light',
    },
});
