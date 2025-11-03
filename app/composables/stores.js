import { defineStore, acceptHMRUpdate } from 'pinia';

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

export const usePieceFilterOptions = defineStore('piece_filter_options', {
    state: () => (createDefaultPieceFilterOptions()),
    actions: {
        reset() {
            this.$patch(createDefaultPieceFilterOptions());
        },
    },
});


function createDefaultScoreOptions() {
    return {
        showMeter: false,
        bassstufen: false,
        hideFiguredbass: false,
        showFiguredbassAbove: false,
        showCadences: false,
        showModulations: false,
        showModulationsDegLabel: false,
        verovioScale: 40,
    };
}

export const useScoreOptions = defineStore('score_options', {
    state: () => createDefaultScoreOptions(),
    getters: {
        humdrumFilterMap: () => ({
            showMeter: 'meter -f',
            bassstufen: 'deg -k1 --box -t',
            hideFiguredbass: 'extract -I "**fb" | extract -I "**fba"',
            showFiguredbassAbove: 'shed -e "s/fb/fba/gX"',
        }),
        humdrumFilters(state) {
            const map = this.humdrumFilterMap;
            const filters = [];
            if (state.showMeter) {
                filters.push(map.showMeter);
            }
            if (state.bassstufen) {
                filters.push(map.bassstufen);
            }
            if (state.hideFiguredbass) {
                filters.push(map.hideFiguredbass);
            }
            if (state.showFiguredbassAbove) {
                filters.push(map.showFiguredbassAbove);
            }
            return filters;
        },
        verovioOptions: (state) => ({
            scale: state.verovioScale,
        }),
        countHumdrumFilters(state) {
            return [
                state.showMeter,
                state.bassstufen,
                state.hideFiguredbass,
                state.showFiguredbassAbove,
            ].filter(Boolean).length;
        },
        countHighlights(state) {
            return [
                state.showCadences,
                state.showModulations,
                state.showModulationsDegLabel,
            ].filter(Boolean).length;
        },
        countTotal() {
            return this.countHumdrumFilters + this.countHighlights;
        },
    },

    actions: {
        reset() {
            this.$patch(createDefaultScoreOptions());
        },
        zoomIn() {
            this.verovioScale = Math.min(this.verovioScale + 5, 100);
        },
        zoomOut() {
            this.verovioScale = Math.max(this.verovioScale - 5, 20);
        },
        resetZoom() {
            this.verovioScale = createDefaultScoreOptions().verovioScale;
        },
        resetHumdrumFilters() {
            const defaults = createDefaultScoreOptions();
            this.showMeter = defaults.showMeter;
            this.bassstufen = defaults.bassstufen;
            this.hideFiguredbass = defaults.hideFiguredbass;
            this.showFiguredbassAbove = defaults.showFiguredbassAbove;
        },
        resetVerovio() {
            const defaults = createDefaultScoreOptions();
            this.verovioScale = defaults.verovioScale;
        },
        resetHighlights() {
            const defaults = createDefaultScoreOptions();
            this.showCadences = defaults.showCadences;
            this.showModulations = defaults.showModulations;
            this.showModulationsDegLabel = defaults.showModulationsDegLabel;
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useScoreOptions, import.meta.hot));
}
