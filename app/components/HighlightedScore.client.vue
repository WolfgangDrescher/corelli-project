<script setup lang="ts">
const props = defineProps<{
    pieceId: String,
    verovioOptions?: {
        type: Object,
        default: () => ({}),
    },
    notes?: NotesProp,
    lines?: LinesProp,
    sections?: SectionsProp,
    filters?: Array<string>,
    horizontal?: Boolean,
    scrollToFirstSection?: Boolean,
}>();

defineOptions({ inheritAttrs: false });

const { resolvedNotes, resolvedLines, resolvedSections } = useResolveHighlightedScoreProps(props);

const verovioCanvas = ref(null);

const { loadScore, applyScoreFormatting, formattedScoreData } = useScoreFormatter();

watch(() => props.filters, (filters) => {
    applyScoreFormatting([], filters);
});

const verovioCanvasAttrs = computed(() => {
    return Object.assign({
        pageMargin: 50,
        viewMode: props.horizontal ? 'horizontal' : 'vertical',
        options: {
            ...props.verovioOptions,
            svgBoundingBoxes: true,
            // svgViewBox: true,
        },
        data: formattedScoreData.value,
    });
});

const scoreContainer = useTemplateRef('scoreContainer');
const markerContainer = useTemplateRef('markerContainer');
const wrapperElem = useTemplateRef('wrapperElem');
const scoreKey = ref(Date.now());

const markerContainerStyle = reactive({
    width: '0px',
});

function updateMarkerWidth() {
    if (scoreContainer.value && markerContainer.value) {
        const width = scoreContainer.value.querySelector('svg')?.getAttribute('width');
        if (width) {
            markerContainerStyle.width = width;
        }
    }
}

function mutationObserverEvent() {
    scoreKey.value = Date.now();
    updateMarkerWidth();
}

const { scrollElementIntoView } = useHorizontalScroll();

async function onScoreIsReady() {
    if (!resolvedSections.value?.length) return;
    if (!scoreContainer.value || !wrapperElem.value) return;

    const first = resolvedSections.value[0].items[0];
    const selector = `g[id^="note-L${first.startLine}"]`;

    await scrollElementIntoView(selector, scoreContainer.value, wrapperElem.value, true); // smooth scroll
}

onMounted(async () => {
    loadScore(props.pieceId, props.filters);
    await nextTick();
    updateMarkerWidth();
    const mutationObserver = new MutationObserver(mutationObserverEvent);
    if (scoreContainer.value) {
        mutationObserver.observe(scoreContainer.value, {
            // attributes: true,
            childList: true,
            subtree: true,
        });
    }
});
</script>

<template>
    <div class="relative overflow-x-auto" ref="wrapperElem">
        <div class="absolute h-full top-0 left-0 overflow-hidden" ref="markerContainer" :key="scoreKey" :style="markerContainerStyle">
            <template v-if="scoreContainer">
                <template v-for="noteGroup in resolvedNotes">
                    <HighlightedNote v-for="noteId in noteGroup.items" :note-id="noteId" :color="noteGroup.color" :container="scoreContainer" />
                </template>
                <template v-for="sectionGroup in resolvedSections">
                    <HighlightedSection v-for="section in sectionGroup.items" :start-line="section.startLine" :end-line="section.endLine" :label="section.label" :color="sectionGroup.color" :container="scoreContainer" />
                </template>
                <template v-for="lineGroup in resolvedLines">
                    <HighlightedSection v-for="line in lineGroup.items" :start-line="line.lineNumber" :end-line="line.lineNumber" :label="line.label" :color="lineGroup.color" :container="scoreContainer" />
                </template>
                <template v-for="sectionGroup in resolvedBelowSections">
                    <HighlightedSection v-for="section in sectionGroup.items" :start-line="section.startLine" :end-line="section.endLine" :label="section.label" :color="sectionGroup.color" :container="scoreContainer" :top="200" :inset-label="true" />
                </template>
            </template>
        </div>
        <div ref="scoreContainer" class="verovio-canvas-container">
            <VerovioCanvas v-if="verovioCanvasAttrs.data" ref="verovioCanvas" v-bind="{ ...$attrs, ...verovioCanvasAttrs }" @score-is-ready="onScoreIsReady" />
        </div>
    </div>
</template>

<style scoped>
:deep(.verovio-canvas-horizontal) {
    overflow-y: visible;
}
</style>
