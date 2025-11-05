<script setup>
const { data: sequencesData } = await useAsyncData('sequences', () => queryCollection('sequences').first(), {
    deep: false,
});

const localePath = useLocalePath();

const { loadScoreData } = useScoreFormatter();

const sequences = sequencesData.value.sequences;

const uniqueTags = [...new Set(sequences.flatMap(sequence => sequence.tags || []))].toSorted();

const { filters, filteredSequences, resetFilters } = useSequenceFilter(sequences);
</script>

<template>
    <UContainer>
        <Heading>{{ $t('sequences') }}</Heading>

        <UCard>
            <template #header>
                <div class="font-medium leading-5">
                    {{ $t('filter') }}
                </div>
            </template>
            <div class="flex flex-wrap gap-2">
                <UFormField :label="$t('tags')" class="w-40">
                    <USelectMenu v-model="filters.tags" :items="uniqueTags" multiple class="w-full" :search-input="false" />
                </UFormField>
                <UFormField label="&nbsp;" class="w-32">
                    <UButton icon="i-lucide-funnel-x" color="warning" variant="subtle" @click="resetFilters">
                        {{ $t('reset') }}
                    </UButton>
                </UFormField>
            </div>
        </UCard>

        <div class="my-4">
            {{ filteredSequences.length }} / {{ sequences.length }}
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="sequence in filteredSequences" :key="`${sequence.pieceId}-${sequence.startBeat}`">
                <UCard class="h-full">
                    <template #header>
                        <NuxtLink :to="localePath({ name: 'piece-id', params: { id: sequence.pieceId } })">
                            {{ `${sequence.pieceId} ${sequence.startLine}-${sequence.endLine}` }}
                        </NuxtLink>
                    </template>
                    <VerovioCanvas view-mode="horizontal" :data="loadScoreData(sequence.pieceId, [], [
                        `myank -l ${sequence.startLine}-${sequence.endLine}`,
                    ])" :scale="35" :options="{
                        pageMarginLeft: 42,
                    }" />
                    <div v-if="sequence.tags?.length" class="flex flex-wrap gap-2 mt-4">
                        <UBadge v-for="tag in sequence.tags" :label="tag" />
                    </div>
                </UCard>
            </div>
        </div>

    </UContainer>
</template>
