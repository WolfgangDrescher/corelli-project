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
        options: {
            ...props.verovioOptions,
            svgBoundingBoxes: true,
            svgViewBox: true,
        },
        data: formattedScoreData.value,
    });
});

const scoreContainer = ref();
const scoreKey = ref(Date.now());

function mutationObserverEvent() {
    scoreKey.value = Date.now();
}

onMounted(async () => {
    loadScore(props.pieceId, props.filters);
    await nextTick();
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
    <div class="relative">
        <div class="absolute w-full h-full top-0 left-0 overflow-hidden" ref="markerContainer" :key="scoreKey">
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
            </template>
        </div>
        <div ref="scoreContainer" class="verovio-canvas-container">
            <VerovioCanvas v-if="verovioCanvasAttrs.data" ref="verovioCanvas" v-bind="{ ...$attrs, ...verovioCanvasAttrs }" />
        </div>
    </div>
</template>
