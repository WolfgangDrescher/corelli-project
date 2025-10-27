export function useCadenceFilter(cadences, defaults = {}) {

    const defaultFilters = Object.assign({
        deg: [],
        endBassDeg: [],
        tag: [],
    }, defaults);
    
    const filters = reactive({
        ...defaultFilters,
    });

    const filteredCadences = computed(() => {
        return cadences.filter(cadence => {
            return filterDeg(cadence, filters.deg)
                && filterEndBassDeg(cadence, filters.endBassDeg)
                && filterTag(cadence, filters.tag)
            ;
        });
    });

    function resetFilters() {
        Object.assign(filters, defaultFilters);
    }

    return {
        filteredCadences,
        filters,
        resetFilters,
    };

}

function filterDeg(cadence, deg) {
    if (deg === null || !deg.length) return true;
    return deg.includes(cadence.deg);
}

function filterEndBassDeg(cadence, endBassDeg) {
    if (endBassDeg === null || !endBassDeg.length) return true;
    return endBassDeg.includes(cadence.endBassDeg);
}

function filterTag(cadence, tags) {
    if (tags === null || !tags.length) return true;
    return tags.includes(cadence.tag);
}
