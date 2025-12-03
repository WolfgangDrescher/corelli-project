<script setup>
const { data: filteredPiecesData } = await useAsyncDataPiecesCollection();

const { data: sequencesData } = await useAsyncData('sequences', () => queryCollection('sequences').first());

const localePath = useLocalePath();

const sequences = sequencesData.value.sequences;

const sequencesForPieceFilter = computed(() => {
    return sequencesData.value.sequences.filter(c => filteredPiecesData.value ? filteredPiecesData.value.map(p => p.slug).includes(c.pieceId) : true);
});

const uniqueTags = [...new Set(sequences.flatMap(sequence => sequence.tags || []))].toSorted();

const { filters, filteredSequences, resetFilters } = useSequenceFilter(sequencesForPieceFilter);
</script>

<template>
    <UContainer>
        <Heading>{{ $t('sequences') }}</Heading>

        <div class="my-4">
            <PieceFilterModal />
        </div>

        <UCard>
            <template #header>
                <div class="font-medium leading-5">
                    {{ $t('filter') }}
                </div>
            </template>
            <div class="flex flex-wrap gap-2">
                <UFormField :label="$t('tags')" class="w-64">
                    <USelectMenu v-model="filters.tags" :items="uniqueTags" multiple class="w-full" />
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
            <div v-for="sequence in filteredSequences" :key="`${sequence.pieceId}-${sequence.startLine}-${sequence.endLine}`">
                <UCard class="h-full">
                    <template #header>
                        <NuxtLink :to="localePath({ name: 'piece-id', params: { id: sequence.pieceId } })">
                            {{ `${sequence.pieceId} ${sequence.startLine}-${sequence.endLine}` }}
                        </NuxtLink>
                    </template>
                    <HighlightedScore view-mode="horizontal" :piece-id="sequence.pieceId" :filters="[
                        `myank -l ${sequence.startLine}-${sequence.endLine}`,
                    ]" :verovio-options="{
                        scale: 35,
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
