import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function resolveCorelliTrioSonatasSha() {
    try {
        return execSync(`git rev-parse --short=7 HEAD:corelli-trio-sonatas`, { encoding: 'utf8' }).toString().trim();
    } catch {
        return '';
    }
}

const corelliTrioSonatasSha = resolveCorelliTrioSonatasSha();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: ['@nuxt/content', '@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        public: {
            corelliTrioSonatasSha,
        },
    },
    app: {
        head: {
            meta: [
                { name: 'robots', content: process.env.DEPLOY_ENV === 'prod' ? 'all' : 'noindex' },
            ],
        },
    },
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
        routeRules: {
            '/kern/**': { prerender: false },
        },
        publicAssets: [
            {
                baseURL: 'kern/corelli-trio-sonatas',
                dir: fileURLToPath(new URL('./corelli-trio-sonatas/kern', import.meta.url)),
                maxAge: 3600,
            },
            {
                baseURL: 'kern/annotated-corelli-trio-sonatas',
                dir: fileURLToPath(new URL('./corelli-trio-sonatas/annotated-kern', import.meta.url)),
                maxAge: 3600,
            },
        ],
    },
});
