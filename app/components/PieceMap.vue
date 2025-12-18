<script setup>
const props = defineProps({
    modulations: {
        type: Array,
        required: true,
    },
    showKeys: Boolean,
});

const modulationsGroupedByKey = computed(() => {
    return Object.entries(props.modulations.reduce((groups, item) => {
        const key = props.showKeys ? item.key : item.deg;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {}));
});

const maxBeat = Math.max(...props.modulations.map(m => m.endBeat));

function getWidth(startBeat, endBeat) {
    return (endBeat - startBeat) / maxBeat * 100;
}
function getLeft(startBeat) {
    return startBeat / maxBeat * 100;
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <div v-for="group in modulationsGroupedByKey" class="h-[1.5rem] relative">
            <div v-for="segment in group[1]" class="absolute h-full" :style="{
                width: `${getWidth(segment.startBeat, segment.endBeat)}%`,
                left: `${getLeft(segment.startBeat)}%`,
            }">
                <UTooltip
                    :text="segment.key"
                    :delay-duration="0"
                    arrow
                    :content="{
                        align: 'center',
                        side: 'top',
                        sideOffset: 8
                    }"
                >
                    <div class="w-full h-full bg-primary/20 border-primary/40 border rounded flex items-center hover:bg-primary/50 hover:border-primary/60 hover:shadow">
                        <div class="px-2">
                            {{ group[0] }}
                        </div>
                    </div>
                </UTooltip>
            </div>
        </div>
    </div>
</template>
