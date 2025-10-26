export function useHighlightedScore(chordsData) {
    const scoreData = ref(null);

    async function loadScoreData(group) {
        scoreData.value = null;

        const data = await $fetch(`/kern/corelli-trio-sonatas/${group.id}.krn`, {
            parseResponse: (txt) => txt,
        });

        const lines = data.split('\n');
        const choraleIntervalLength = chordsData.chords.filter(i => i.pieceId === group.id).length;

        if (group.chords.length < choraleIntervalLength) {
            group.chords.forEach((chord) => {
                for (let i = 0; i < lines.length; i++) {
                    if (i === chord.lineNumber - 1) {
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
                        })
                    }
                }
            });
        }

        lines.push('!!!filter: deg -k 1 --box')
        // lines.push('!!!filter: fb -cnl --above')
        // lines.push('!!!filter: extract -I text')
        // lines.push('!!!filter: extract -I dynam')
        lines.push('!!!RDF**kern: @ = marked note')

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
