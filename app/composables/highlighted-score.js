export function useHighlightedScore() {

    const { localScoreUrlGenerator } = useScoreUrlGenerator();
    const scoreData = ref(null);

    async function loadScoreData(id, hightlightLineNumbers = [], filters = []) {
        scoreData.value = null;

        const data = await $fetch(localScoreUrlGenerator(id), {
            parseResponse: (txt) => txt,
        });

        const lines = data.split('\n');
 
        for (let i = 0; i < lines.length; i++) {
            if (hightlightLineNumbers.includes(i + 1)) {
                const tokens = lines[i].split('\t');
                tokens.forEach((_, tokenIndex) => {
                    const resolvedLineIndex = getResolvedTokenLineIndex(i, tokenIndex, lines);
                    if (resolvedLineIndex) {
                        lines[resolvedLineIndex] = lines[resolvedLineIndex]
                            .split('\t')
                            .map((token, ti) => {
                                if (ti === tokenIndex && /^[\[\(]?\d+/.test(token)) {
                                    return `${token}@`;
                                }
                                return token;
                            })
                            .join('\t');
                    }
                });
            }
        }

        if (hightlightLineNumbers.length) {
            lines.push('!!!RDF**kern: @ = marked note color="#ef4444');
        }

        if (filters.length) {
            filters.forEach((filter) => {
                lines.push(`!!!filter: ${filter}`);
            });
        }

        scoreData.value = lines.join('\n');
        return scoreData.value;
    }

    return {
        scoreData,
        loadScoreData,
    }
}

function tokenIsDataRecord(line, includeNullToken = false) {
    return !line.startsWith('!') && !line.startsWith('*') && !line.startsWith('=') && !(!includeNullToken && line === '.');
}

function getResolvedTokenLineIndex(lineIndex, spineIndex, lines) {
    for (let i = lineIndex; i >= 0; i--) {
        const token = lines[i].split('\t')[spineIndex];
        if (token && tokenIsDataRecord(token)) {
            return i;
        }
    }
    return null;
}
