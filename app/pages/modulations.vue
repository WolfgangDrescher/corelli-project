<script setup>
import { onKeyStroke } from '@vueuse/core';

const { data } = await useAsyncData('pieces', () => queryCollection('pieces').all());
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection(`modulations`).first(), {deep: false });

const modulations = modulationsData.value.meta.modulations;

const localePath = useLocalePath();

const { t } = useI18n();

const options = reactive({
    showKeys: false,
});
const tabItems = [
    {
        slot: 'minimap',
        label: t('minimap'),
        icon: 'i-heroicons-map',
    },
];

const pieceModulations = Object.groupBy(modulations, m => m.pieceId);
</script>

<template>
    <UContainer>
        <Heading>{{ $t('modulations') }}</Heading>

        <UTabs :items="tabItems">

            <template #minimap>
                <div class="my-4 flex grow-0 flex-wrap gap-6 md:order-1">
                    <UCheckbox v-model="options.showKeys" :label="$t('showKeys')" />
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <template v-for="piece in data">
                        <UCard v-if="pieceModulations[piece.slug]">
                            <template #header>
                                <NuxtLink :to="localePath({ name: 'piece-id', params: { id: piece.slug } })">
                                    <div class="flex">
                                        <div>
                                            {{ `${piece.mv}. ${piece.body.title ? `${piece.title}: ` : ''} ${piece.movementDesignation}`}}
                                        </div>
                                        <div class="ml-auto">
                                            {{ `${piece.largerWorkTitle} Op. ${piece.op} №${piece.nr}` }}
                                        </div>
                                    </div>
                                </NuxtLink>
                            </template>
                            <PieceMap :modulations="pieceModulations[piece.slug]" :show-keys="options.showKeys" :hide-sequences="options.hideSequences" />
                        </UCard>
                    </template>
                </div>
            </template>

        </UTabs>
    </UContainer>
</template>
