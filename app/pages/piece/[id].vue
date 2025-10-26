<script setup>
const localePath = useLocalePath();
const { params: { id } } = useRoute();
const { data: piece } = await useAsyncData(`pieces/${id}`, () => queryCollection('pieces').where('stem', '=', `pieces/${id}`).first());

if (!piece.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

const { data: surroundData } = await useAsyncData(`pieces/${piece.value.path}/surroundings`, () => queryCollectionItemSurroundings('pieces', piece.value.path, {
    fields: ['slug'],
}));
const [prevPiece, nextPiece] = surroundData.value;

const score = ref();

const scoreOptions = reactive({
    showMeter: false,
    bassstufen: false,
});

const { localScoreUrlGenerator, githubScoreUrlGenerator, vhvScoreUrlGenerator } = useScoreUrlGenerator();

onMounted(async () => {
    const response = await fetch(localScoreUrlGenerator(piece.value.slug));
    const kern = await response.text();
    score.value = kern;
});

const formattedData = computed(() => {
    const lines = score.value?.trim().split('\n') ?? [];

    if (scoreOptions.showMeter) {
        lines.push(`!!!filter: meter -f`);
    }
    if (scoreOptions.bassstufen) {
        lines.push(`!!!filter: deg -k1 --box`);
    }

    return score.value ? `${lines.join('\n')}` : null;
});

</script>

<template>
    <UContainer>
        <div class="flex flex-col gap-8">
            <div>
                <Heading>
                    {{ `${piece.largerWorkTitle} Op. ${piece.op} №${piece.nr}` }}
                    <div class="text-2xl">
                        {{ `${piece.mv}. ${piece.body.title ? `${piece.title}: ` : ''} ${piece.movementDesignation}`}}
                    </div>
                    <div class="text-base font-normal">
                        {{ piece.composer }}
                    </div>
                </Heading>
                <div class="flex gap-2">
                    <div v-if="prevPiece">
                        <UButton :to="localePath({ name: 'piece-id', params: { id: prevPiece.slug }, hash: $route.hash })" size="xs">
                            <Icon name="heroicons:arrow-left-circle" class="text-xl" />
                            {{ $t('previous') }}
                        </UButton>
                    </div>
                    <div v-if="nextPiece">
                        <UButton :to="localePath({ name: 'piece-id', params: { id: nextPiece.slug }, hash: $route.hash })" size="xs">
                            {{ $t('next') }}
                            <Icon name="heroicons:arrow-right-circle" class="text-xl" />
                        </UButton>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-4">
                <div>
                    <div class="flex gap-4">
                        <UCheckbox v-model="scoreOptions.showMeter" label="meter" />
                        <UCheckbox v-model="scoreOptions.bassstufen" label="bassstufen" />
                    </div>
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

            <VerovioCanvas
                v-if="formattedData"
                :data="formattedData"
                :scale="35"
                :options="{
                    header: true,
                    spacingSystem: 15,
                    pageMarginLeft: 30,
                    pageMarginRight: 30,
                    pageMarginTop: 10,
                    pageMarginBottom: 10,
                }"
            />

        </div>
    </UContainer>
</template>
