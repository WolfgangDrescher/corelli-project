import { defineStore } from 'pinia';

function createDefaultPieceFilterOptions() {
    return {
        title: [],
        tempo: [],
        key: [],
        meter: [],
        op: [],
        nr: [],
    };
};

function createDefaultScoreOptions() {
    return {
        showMeter: false,
        bassstufen: false,
        hideFiguredbass: false,
        showFiguredbassAbove: false,
        showCadences: false,
        showModulations: false,
        showModulationsDegLabel: false,
    };
}

export const usePieceFilterOptions = defineStore('piece_filter_options', {
    state: () => (createDefaultPieceFilterOptions()),
    actions: {
        reset() {
            this.$patch(createDefaultPieceFilterOptions());
        },
    },
});

export const useScoreOptions = defineStore('score_options', {
    state: () => createDefaultScoreOptions(),
    getters: {
        humdrumFilters: (state) => {
            const filters = [];
            if (state.showMeter) {
                filters.push('meter -f');
            }
            if (state.bassstufen) {
                filters.push('deg -k1 --box -t');
            }
            if (state.hideFiguredbass) {
                filters.push('extract -I "**fb" | extract -I "**fba"');
            }
            if (state.showFiguredbassAbove) {
                filters.push('shed -e "s/fb/fba/gX"');
            }
            return filters;
        },
    },

    actions: {
        reset() {
            this.$patch(createDefaultScoreOptions());
        },
    },
});
