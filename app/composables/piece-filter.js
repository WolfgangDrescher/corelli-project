const filterByTitle = (values, element) => {
    if (!values.length) return true;
    return values.map(value => value?.toLowerCase()).includes(element.title?.toLowerCase());
};

const filterByTempo = (values, element) => {
    if (!values.length) return true;
    return values.map(value => value?.toLowerCase()).includes(element.movementDesignation?.toLowerCase());
};

const filterByMeter = (values, element) => {
    if (!values.length) return true;
    return values.map(value => value?.toLowerCase()).includes(element.meter?.toLowerCase());
};

const filterByKey = (values, element) => {
    if (!values.length) return true;
    return values.includes(element.key);
};

export function usePieceFilter(elements) {
    const store = usePieceFilterOptions();
    const filteredElements = computed(() => {
        const filteredElems = elements.filter(element => {
            const titleMatches = filterByTitle(store.title, element);
            const tempoMatches = filterByTempo(store.tempo, element);
            const meterMatches = filterByMeter(store.meter, element);
            const keyMatches = filterByKey(store.key, element);

            return (
                titleMatches
                && tempoMatches
                && meterMatches
                && keyMatches
            );
        });

        filteredElems.sort((a, b) => {
            if (filteredElems.orderBy === 'id') {
                return a.id > b.id ? 1 : -1;
            }
            return 0;
        });

        return filteredElems;
    });

    return {
        filteredElements,
    };
};
