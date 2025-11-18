<script setup>
import { useMagicKeys } from '@vueuse/core';

const { data: pieces } = await useAsyncData('pieces/search-palette', () => queryCollection('pieces').all());

const open = defineModel('open', { type: Boolean });

const searchTerm = ref('');

const localePath = useLocalePath();

function fuzzysearch (needle, haystack) {
    needle = needle.toLowerCase();
    haystack = haystack.toLowerCase();
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}

const { meta } = useMagicKeys();

const groups = computed(() => {
    if (!pieces.value) return []

    const groupedPieces = Object.groupBy(pieces.value, p => `${p.op}-${p.nr}`)
    
    const commandGroups = Object.entries(groupedPieces).map(([key, groupPieces]) => {
        const { op, nr } = groupPieces[0]

        const filteredItems = groupPieces.map(p => {
            const title = p.title?.toLowerCase() !== p.slug?.toLowerCase() ? p.title : '';
            const opStr = String(p.op).padStart(2, '0');
            const nrStr = String(p.nr).padStart(2, '0');
            return {
                label: `${p.mv}. ${p.movementDesignation}${title ? ` (${title})` : ''}`,
                value: p.slug,
                search: `opus. ${opStr} no nr ${nrStr} ${p.mv}. ${title} ${p.movementDesignation}`,
                onSelect: () => {
                    navigateTo(
                        localePath({ name: 'piece-id', params: { id: p.slug } }),
                        meta.value ? {
                            open: {
                                target: '_blank',
                            },
                        } : {}
                    );
                    if (!meta.value) {
                        open.value = false;
                    }

                },
            };
        }).filter(item => fuzzysearch(searchTerm.value, item.value) || fuzzysearch(searchTerm.value, item.search))

        return {
            id: `op${op}n${nr}`,
            label: `Op. ${op} №${nr}`,
            ignoreFilter: true,
            items: filteredItems,
        }
    })

    return commandGroups.filter(g => g.items.length > 0)
});
</script>

<template>
    <UModal v-model:open="open">
        <UButton
            :label="$t('search')"
            color="neutral"
            variant="soft"
            icon="i-lucide-search"
        >
            <template #trailing>
                <UKbd value="meta" />
                <UKbd color="neutral" class="font-mono">K</UKbd>
            </template>
        </UButton>
        
        <template #content>
            <UCommandPalette
                :groups="groups"
                :placeholder="$t('searchPieces')"
                v-model:search-term="searchTerm"
            >
                <template #item-trailing="{ item }">
                    <div class="font-mono text-[0.75rem] text-gray-500 translate-y-0.5">{{ item.value }}</div>
                </template>
            </UCommandPalette>
        </template>
    </UModal>
</template>
