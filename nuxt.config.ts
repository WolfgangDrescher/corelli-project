import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: ['@nuxt/content', '@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    vite: {
        worker: {
            format: 'es',
        },
        optimizeDeps: {
            exclude: ['verovio'],
        },
    },
    i18n: {
        strategy: 'prefix_except_default',
        locales: [
            { code: 'de', language: 'de-DE', file: 'de.yaml', dir: 'ltr' },
        ],
        defaultLocale: 'de',
        langDir: 'locales/',
    },
    colorMode: {
        preference: 'light',
    },
    nitro: {
        publicAssets: [
            {
                baseURL: 'kern/corelli-trio-sonatas',
                dir: fileURLToPath(new URL('./corelli-trio-sonatas/kern', import.meta.url)),
                maxAge: 3600,
            },
        ],
    },
});
