<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const { t } = useI18n();
const localePath = useLocalePath();

const items: NavigationMenuItem[] = [
    {
        label: t('overview'),
        to: localePath({ name: 'faq' }),
    },
    {
        label: t('initialVoicings'),
        to: localePath({ name: 'faq-initial-voicings' }),
    },
];
</script>

<template>
    <NuxtLayout name="default">
        <UContainer>
            <div class="flex flex-col gap-6 lg:flex-row">
                <aside class="border-gray-200 dark:border-gray-800 lg:w-60 lg:shrink-0 lg:border-r lg:pr-6">
                    <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-full" />
                </aside>
                <section class="flex-1">
                    <slot />
                </section>
            </div>
        </UContainer>
    </NuxtLayout>
</template>
