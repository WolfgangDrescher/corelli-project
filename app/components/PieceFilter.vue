<script setup>
import filterOptions from '../utils/piece-filter-options.json';

const emit = defineEmits(['updateFilter']);

const pieceFilter = usePieceFilterOptions();

watch(pieceFilter, () => {
    emit('updateFilter');
});

function resetFilter() {
    pieceFilter.reset();
}

const { title, key, meter, tempo, op, nr } = storeToRefs(pieceFilter);

const {
    meterOptions,
    keyOptions,
    titleOptions,
    tempoOptions,
    opOptions,
    nrOptions,
} = toRefs(filterOptions);
</script>

<template>
    <UCard>
        <template #header>
            <div class="font-medium leading-5">
                {{ $t('filter') }}
            </div>
        </template>
        <div class="flex gap-2 mb-3">
            <UFormField :label="$t('opus')" class="lg:w-48">
                <USelectMenu
                    v-model="op"
                    multiple
                    class="w-full"
                    :search-input="false"
                    :items="opOptions"
                />
            </UFormField>
            <UFormField :label="$t('number')" class="lg:w-48">
                <USelectMenu
                    v-model="nr"
                    multiple
                    class="w-full"
                    :search-input="false"
                    :items="nrOptions"
                />
            </UFormField>
            <UFormField :label="$t('title')" class="lg:w-48">
                <USelectMenu
                    v-model="title"
                    multiple
                    class="w-full"
                    :search-input="false"
                    :items="titleOptions"
                />
            </UFormField>
            <UFormField :label="$t('tempo')" class="lg:w-48">
                <USelectMenu
                    v-model="tempo"
                    multiple
                    class="w-full"
                    :search-input="false"
                    :items="tempoOptions"
                />
            </UFormField>
            <UFormField :label="$t('key')" class="lg:w-48">
                <USelectMenu
                    v-model="key"
                    multiple
                    class="w-full"
                    :search-input="false"
                    :items="keyOptions"
                />
            </UFormField>
            <UFormField :label="$t('meter')" class="lg:w-48">
                <USelectMenu
                    v-model="meter"
                    multiple
                    class="w-full"
                    :search-input="false"
                    :items="meterOptions"
                />
            </UFormField>
        </div>
        <UButton color="warning" variant="subtle" @click="resetFilter">{{ $t('reset')}}</UButton>
    </UCard>
</template>
