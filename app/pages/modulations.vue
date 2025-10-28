<script setup>
import { onKeyStroke } from '@vueuse/core';

const { data } = await useAsyncData('pieces', () => queryCollection('pieces').all());
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection(`modulations`).first(), {deep: false });
const { data: transitionsData } = await useAsyncData(`transitions`, () => queryCollection(`transitions`).first(), {deep: false });

const modulations = modulationsData.value.modulations;
const transitions = transitionsData.value.meta.transitions;

const localePath = useLocalePath();

const { t } = useI18n();

const options = reactive({
    showKeys: false,
});

const separator = ' → ';

const tabItems = [
    {
        slot: 'minimap',
        label: t('minimap'),
        icon: 'i-heroicons-map',
    },
    {
        slot: 'transitions',
        label: t('transitions'),
        icon: 'i-heroicons-chart-bar-solid',
    },
];

const pieceModulations = Object.groupBy(modulations, m => m.pieceId);

const transitionsConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [{
            data: transitions.sort((a, b) => b.count > a.count ? 1 : -1).map(i => ({ x: `${i.currentDeg}${separator}${i.nextDeg}`, y: i.count })),
        }],
    },
    options: {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                yAlign: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
}));

const filter = reactive({
    currentDeg: null,
    nextDeg: null,
});

function chartClickHandler(chart, event) {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false, axis: 'x' }, true);
    if (points.length) {
        const firstPoint = points[0];
        const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index].x;
        const degs = value.split(separator);
        if (filter.currentDeg === degs[0] && filter.nextDeg === degs[1]) {
            filter.currentDeg = null;
            filter.nextDeg = null;
        } else {
            filter.currentDeg = degs[0];
            filter.nextDeg = degs[1];
        }
    }
    event.stopPropagation();
}

const filteredTransition = computed(() => {
    return transitions.filter(t => t.currentDeg === filter.currentDeg && t.nextDeg === filter.nextDeg)[0] ?? {};
});

function useChordModal(filteredTransition) {
    const modalIsOpen = ref(false)
    const activeIndex = ref(null)

    async function loadIndex(index) {
        if (index < 0 || index >= filteredTransition.value.length) return;
        activeIndex.value = index;
        modalIsOpen.value = true;
    };

    const currentGroup = computed(() => {
        return filteredTransition.value.items[activeIndex.value] ?? {};
    });

    const hasPrevious = computed(() => activeIndex.value > 0);
    const hasNext = computed(() => activeIndex.value < filteredTransition.value.items.length - 1);

    onKeyStroke('ArrowLeft', () => {
        if (modalIsOpen.value && activeIndex.value !== null && hasPrevious.value) loadIndex(activeIndex.value - 1);
    });

    onKeyStroke('ArrowRight', () => {
        if (modalIsOpen.value && activeIndex.value !== null && hasNext.value) loadIndex(activeIndex.value + 1);
    });

    return {
        modalIsOpen,
        activeIndex,
        loadIndex,
        currentGroup,
        hasPrevious,
        hasNext,
    }
}

const {
    modalIsOpen,
    activeIndex,
    loadIndex,
    currentGroup,
    hasPrevious,
    hasNext,
} = useChordModal(filteredTransition);

const { localScoreUrlGenerator } = useScoreUrlGenerator();
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

            <template #transitions>
                <div class="h-[300px]">
                    <Chart :config="transitionsConfig" @chart-click="chartClickHandler" />
                </div>
                <template v-if="filteredTransition.items">
                    <Subheading class="mt-8">{{ `${filteredTransition.currentDeg}${separator}${filteredTransition.nextDeg}` }}</Subheading>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <UButton v-for="(item, index) in filteredTransition.items" :key="`${item.id}-${item.lineNumber}`" @click="loadIndex(index)">
                            {{ `${item.id}-${item.lineNumber}` }}
                        </UButton>
                        <UModal v-model:open="modalIsOpen" :title="currentGroup.id">
                            <template #body>
                                <div :key="`${currentGroup.id}-${currentGroup.lineNumber}`">
                                    <div class="flex gap-1 justify-end">
                                        <MidiPlayer :url="localScoreUrlGenerator(currentGroup.id)" class="text-2xl" />
                                        <UButton size="sm" color="primary" variant="solid" :label="t('view')" :to="localePath({ name: 'piece-id', params: { id: currentGroup.id } })" />
                                    </div>
                                    <HighlightedScore
                                        :piece-id="currentGroup.id"
                                        :lines="[currentGroup.lineNumber]"
                                        :verovio-options="{
                                            scale: 25,
                                            pageMargin: 50,
                                        }"
                                    />
                                </div>
                            </template>
                            <template #footer>
                                <UButton class="mr-auto" v-if="hasPrevious" @click="loadIndex(activeIndex - 1)">
                                    {{ $t('previous') }}
                                </UButton>
                                <UButton class="ml-auto" v-if="hasNext" @click="loadIndex(activeIndex + 1)">
                                    {{ $t('next') }}
                                </UButton>
                            </template>
                        </UModal>
                    </div>
                </template>
            </template>

        </UTabs>
    </UContainer>
</template>
