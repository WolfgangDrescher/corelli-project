<script setup>
import { useClipboard } from '@vueuse/core';
const toast = useToast();
const { t } = useI18n();

const localePath = useLocalePath();
const { params: { id } } = useRoute();
const { data: piece } = await useAsyncData(`pieces/${id}`, () => queryCollection('pieces').where('stem', '=', `pieces/${id}`).first());
const { data: cadencesData } = await useAsyncData(`cadences`, () => queryCollection('cadences').first());
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection('modulations').first());
const { data: sequencesData } = await useAsyncData(`sequences`, () => queryCollection('sequences').first());
const { data: countPieces } = await useAsyncDataCountPieces();
const { data: countFilteredPieces } = await useAsyncDataCountPiecesCollection();

const cadences = cadencesData.value.cadences.filter(c => c.pieceId === id);
const modulations = modulationsData.value.modulations.filter(m => m.pieceId === id);
const sequences = sequencesData.value.sequences.filter(s => s.pieceId === id);

if (!piece.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

const { data: surroundData } = await useAsyncDataPiecesCollectionSurroundings(piece.value.path);
const prevPiece = computed(() => surroundData.value?.[0] ?? null);
const nextPiece = computed(() => surroundData.value?.[1] ?? null);

const score = ref();

const { localScoreUrlGenerator, githubScoreUrlGenerator, vhvScoreUrlGenerator } = useScoreUrlGenerator();

onMounted(async () => {
    const response = await fetch(localScoreUrlGenerator(piece.value.slug));
    const kern = await response.text();
    score.value = kern;
});

const scoreOptions = useScoreOptions();

useScoreKeyboardShortcuts({
    prevPiece,
    nextPiece,
});

const { copy, copied } = useClipboard();

function copyId() {
    copy(id);
};

async function redirectToFirstFilteredPiece() {
    const { data: filteredPieces } = await useAsyncDataPiecesCollection({ server: false });
    const pieces = filteredPieces.value ?? [];

    const isCurrentPieceFiltered = pieces.some(p => p.slug === id);

    const toastDuration = 3000;

    if (!isCurrentPieceFiltered) {
        const firstPiece = pieces[0];

        if (!firstPiece) {
            toast.add({
                title: t('noPiecesFound'),
                icon: 'i-lucide-alert-circle',
                duration: toastDuration,
            });
        } else {
            toast.add({
                title: t('pieceNotInFilterResultTitle', { id }),
                description: t('pieceNotInFilterResultDescription'),
                icon: 'i-lucide-alert-circle',
                duration: toastDuration,
            });
            await new Promise(resolve => setTimeout(resolve, toastDuration));
            navigateTo(localePath({ name: 'piece-id', params: { id: firstPiece.slug } }));
        }
    }
}
</script>

<template>
    <UContainer>
        <div class="flex flex-col gap-8">
            <div>
                <Heading>
                    {{ `${piece.largerWorkTitle} Op. ${piece.op} №${piece.nr}` }}
                    <div class="text-2xl flex gap-2">
                        <div>
                            {{ `${piece.mv}. ${piece.body.title ? `${piece.title}: ` : ''} ${piece.movementDesignation}`}}
                        </div>
                        <div class="flex items-center">
                            <UBadge color="neutral" size="sm" variant="outline" class="font-mono cursor-pointer select-none w-[11ch] inline-flex items-center justify-center text-center" @click="copyId" :label="copied ? $t('copied') : id" />
                        </div>
                    </div>
                    <div class="text-base font-normal">
                        {{ piece.composer }}
                    </div>
                </Heading>
                <div class="flex gap-2">
                    <UButton :disabled="!prevPiece" :to="localePath({ name: 'piece-id', params: { id: prevPiece?.slug }, hash: $route.hash })" size="xs">
                        <Icon name="heroicons:arrow-left-circle" class="text-xl" />
                        {{ $t('previous') }}
                    </UButton>
                    <UButton :disabled="!nextPiece" :to="localePath({ name: 'piece-id', params: { id: nextPiece?.slug }, hash: $route.hash })" size="xs">
                        {{ $t('next') }}
                        <Icon name="heroicons:arrow-right-circle" class="text-xl" />
                    </UButton>
                    <UModal v-if="countFilteredPieces !== undefined" @after:leave="redirectToFirstFilteredPiece">
                        <UButton :label="`${$t('filter')} ${countPieces === countFilteredPieces ? '' : `(${countFilteredPieces}/${countPieces})`}`" color="neutral" variant="subtle" size="xs" icon="i-lucide-funnel" />
                        <template #content>
                            <PieceFilter />
                        </template>
                    </UModal>
                </div>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-4">
                <div>
                    <ScoreOptionsPalette />
                </div>
                <div class="shrink-0 flex gap-2 ml-auto md:order-2">
                    <MidiPlayer :url="localScoreUrlGenerator(piece.slug)" class="text-2xl"/>
                    <UButton :to="githubScoreUrlGenerator(piece.slug)" target="_blank">
                        {{ $t('github') }}
                    </UButton>
                    <UButton :to="vhvScoreUrlGenerator(piece.slug)" target="_blank">
                        {{ $t('vhv') }}
                    </UButton>
                </div>
            </div>

            <HighlightedScore
                :piece-id="piece.slug"
                :verovio-options="{
                    ...scoreOptions.verovioOptions,
                    header: true,
                    spacingSystem: 15,
                    pageMarginLeft: 50,
                    pageMarginRight: 0,
                    pageMarginTop: 50,
                    pageMarginBottom: 50,
                }"
                :sections="[
                    {
                        items: scoreOptions.showCadences ? cadences.map(c => ({
                            startLine: c.startLine,
                            endLine: c.endLine,
                            label: c.tags?.join(', '),
                        })) : []
                    },
                    {
                        color: 'rgb(59 130 246 / 0.4)',
                        items: scoreOptions.showSequences ? sequences.map(s => ({
                            startLine: s.startLine,
                            endLine: s.endLine,
                            label: s.tags?.join(', '),
                        })) : []
                    }
                ]"
                :lines="scoreOptions.showModulations ? [{
                    items: modulations.map(m => ({
                        lineNumber: m.startLine,
                        label: {
                            value: scoreOptions.showModulationsDegLabel ? m.deg : m.key,
                            position: 'bottom',
                        },
                    })),
                    color: 'rgb(34 197 94 / 0.4)',
                }] : []"
                :filters="scoreOptions.humdrumFilters"
            />

        </div>
    </UContainer>
</template>
