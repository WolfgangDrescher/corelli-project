<script setup>
import { onKeyStroke } from '@vueuse/core';

definePageMeta({
    layout: 'faq',
});

const { data: initialVoicingsData } = await useAsyncData('initialVoicings', () => queryCollection('initialVoicings').first(), {
    deep: false,
});

const { t } = useI18n();
const localePath = useLocalePath();

const initialVoicings = initialVoicingsData.value.initialVoicings;

const filteredValidVoicings = initialVoicings.filter(iv => iv.fb);

const groupedVoicings = Object.groupBy(initialVoicings, iv => String(iv.fb).trim());

const groupedArray = Object.entries(groupedVoicings)
    .map(([key, items]) => ({ key, items }))
    .sort((a, b) => b.items.length - a.items.length);

const filters = reactive({
    groupNumbers: false,
});

const filteredGroupedArray = computed(() => {
    if (!filters.groupNumbers) {
        return groupedArray;
    }
    const map = new Map();
    for (const { key, items } of groupedArray) {
        const numbers = key.split(' ').map(Number).filter(n => !isNaN(n));
        const normalizedKey = numbers.length === 0
            ? key
            : [...new Set(numbers)].sort((a, b) => b - a).join(' ');
        if (!map.has(normalizedKey)) {
            map.set(normalizedKey, []);
        }
        map.get(normalizedKey).push(...items);
    }
    
    return Array.from(map.entries())
        .map(([key, items]) => ({ key, items }))
        .sort((a, b) => b.items.length - a.items.length);
});

const chartConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [{
            label: t('initialVoicings'),
            data: filteredGroupedArray.value.map(v => ({ x: v.key, y: v.items.length })),
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
                // display: false,
                onClick: (e) => e.stopPropagation(),
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

const filteredKey = ref('');

const filteredVoicings = computed(() => {
    return initialVoicings.filter(iv => iv.fb === filteredKey.value);
});

function chartClickHandler(chart, event) {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false, axis: 'x' }, true);
    if (points.length) {
        const firstPoint = points[0];
        const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index].x;
        if (filteredKey.value === (value === 'null' ? null : value)) {
			filteredKey.value = ''; // oder null, wenn du das bevorzugst
		} else {
			filteredKey.value = value === 'null' ? null : value;
		}

    }
    event.stopPropagation();
}

function useScoreModal(filteredVoicings) {
    const modalIsOpen = ref(false)
    const activeIndex = ref(null)

    async function loadIndex(index) {
        if (index < 0 || index >= filteredVoicings.value.length) return;
        activeIndex.value = index;
        modalIsOpen.value = true;
    };

    const currentGroup = computed(() => {
        return filteredVoicings.value[activeIndex.value] ?? {};
    });

    const hasPrevious = computed(() => activeIndex.value > 0);
    const hasNext = computed(() => activeIndex.value < filteredVoicings.value.length - 1);

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
} = useScoreModal(filteredVoicings);

const { localScoreUrlGenerator } = useScoreUrlGenerator();
</script>

<template>
    <div>
        <Heading>{{ $t('initialVoicings') }}</Heading>

        <p>
            Um für eigene Kompositionen im Stile Corellis eine geeignete Lage
            und ein passendes Voicing zu wählen, wurde untersucht, welche
            Startposition des Voicings beim ersten Akkord mit allen drei
            Instrumenten am häufigsten vorkommt.
            
            Für diese Auswertung wurde jeweils der erste Zusammenklang in Takt 0
            (also im Auftakt) oder in Takt 1 betrachtet.
            
            Auf diese Weise wurden von insgesamt {{ initialVoicings.length }}
            Anfängen {{ filteredValidVoicings.length }} Stücke gefunden, bei
            denen unmittelbar zu Beginn ein Zusammenklang auftritt.
        </p>
        <p>
            Die erste Zahl im Voicing gibt die obere Stimme an, die zweite Zahl
            die mittlere Stimme. So bedeutet beispielsweise „5 3“ eine Quinte
            über dem Bass in Violine 1 und eine Terz über dem Bass in Violine 2.
        </p>

        <div class="flex flex-wrap gap-4 mt-8">
            <UCheckbox v-model="filters.groupNumbers" :label="$t('groupFiguresIgnoreOrder')" />
        </div>

        <div class="h-[300px]">
            <Chart :config="chartConfig" @chart-click="chartClickHandler" />
        </div>

        <Subheading class="mt-8">{{ filteredKey }}</Subheading>
        <div class="flex flex-wrap gap-2 mt-4">
            <UButton v-for="(item, index) in filteredVoicings" :key="item.pieceId" @click="loadIndex(index)">
                {{ item.pieceId }}
            </UButton>
            <UModal v-model:open="modalIsOpen" :title="currentGroup.pieceId">
                <template #body>
                    <div :key="currentGroup.pieceId">
                        <div class="flex gap-1 justify-end">
                            <MidiPlayer :url="localScoreUrlGenerator(currentGroup.pieceId)" class="text-2xl" />
                            <UButton size="sm" color="primary" variant="solid" :label="t('view')" :to="localePath({ name: 'piece-id', params: { id: currentGroup.pieceId } })" />
                        </div>
                        <HighlightedScore
                            :piece-id="currentGroup.pieceId"
                            :verovio-options="{
                                scale: 35,
                                pageMargin: 50,
                            }"
                            :filters="[
                                'myank -m 0-5',
                            ]"
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

    </div>
</template>
