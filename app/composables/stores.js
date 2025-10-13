import { defineStore } from 'pinia';

function createDefaultPieceFilterOptions() {
    return {
        title: [],
        tempo: [],
        key: [],
        meter: [],
    };
};

export const usePieceFilterOptions = defineStore('piece_filter_options', {
    state: () => (createDefaultPieceFilterOptions()),
    actions: {
        reset() {
            this.$patch(createDefaultPieceFilterOptions());
        },
    },
});
