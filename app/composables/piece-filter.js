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

const filterByOp = (values, element) => {
    if (!values.length) return true;
    return values.includes(element.op);
};

const filterByNr = (values, element) => {
    if (!values.length) return true;
    return values.includes(element.nr);
};

export function usePieceFilter(elements) {
    const store = usePieceFilterOptions();
    const filteredElements = computed(() => {
        const filteredElems = elements.filter(element => {
            const titleMatches = filterByTitle(store.title, element);
            const tempoMatches = filterByTempo(store.tempo, element);
            const meterMatches = filterByMeter(store.meter, element);
            const keyMatches = filterByKey(store.key, element);
            const opMatches = filterByOp(store.op, element);
            const nrMatches = filterByNr(store.nr, element);

            return (
                titleMatches
                && tempoMatches
                && meterMatches
                && keyMatches
                && opMatches
                && nrMatches
            );
        });

        return filteredElems;
    });

    return {
        filteredElements,
    };
};
