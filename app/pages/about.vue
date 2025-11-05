<script setup>
const { t } = useI18n();
useHead({
    title: t('about'),
});
</script>

<template>
    <UContainer>
        <section class="flex flex-col gap-8">
            <Heading>{{ $t('about') }}</Heading>
        </section>
    </UContainer>
</template>
