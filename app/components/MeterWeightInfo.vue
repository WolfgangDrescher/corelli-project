<script setup>
const noteSymbol = (basis) => {
    switch (basis) {
        case 2: return '𝅗𝅥';
        case 4: return '♩';
        case 8: return '♪';
        default: return '?';
    }
}

const getBeatColor = (weight) => {
    switch (weight) {
        case 'strong':
            return 'bg-primary/50 border-primary/60';
        case 'half-strong':
            return 'bg-primary/20 border-primary/40';
        case 'weak':
            return 'bg-transparent border-primary/20';
    }
}
</script>

<template>
    <div>
        <div class="space-y-6 mb-4">
            <div v-for="meterWeight in meterWeights" :key="meterWeight.meter" class="grid gap-2" :style="`grid-template-columns: 30px 1fr`">
                <div class="flex flex-col h-full">
                    <div class="flex-1 flex items-end justify-center text-center font-serif font-bold">
                        {{ meterWeight.meter.split('/')[0] }}
                    </div>
                    <div class="flex-1 flex items-start justify-center text-center font-serif font-bold">
                        {{ meterWeight.meter.split('/')[1] }}
                    </div>
                </div>
                <div class="h-full w-full grid gap-2" :style="`grid-template-columns: repeat(${meterWeight.beats.length}, 1fr)`">

                    <div v-for="elem in meterWeight.beats" :key="elem" class="flex items-center gap-2 border rounded-lg px-2" :class="getBeatColor(elem[1])">
                        <div class="shrink-0" v-html="noteSymbol(meterWeight.basis)"></div>
                        <div class="text-xs leading-tight">
                            {{ elem[0] }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        

        <div class="mt-8 flex items-center gap-2 text-[11px] text-gray-600">
            <div class="flex items-center gap-1 border rounded p-1" :class="getBeatColor('strong')">
                <span>strong</span>
            </div>

            <div class="flex items-center gap-1 border rounded p-1" :class="getBeatColor('half-strong')">
                <span>half-strong</span>
            </div>

            <div class="flex items-center gap-1 border rounded p-1" :class="getBeatColor('weak')">
                <span>weak</span>
            </div>
        </div>

        <div class="mt-8">
            {{ $t('meterWeightsInfoText') }}
        </div>
    </div>
</template>

