export function useScoreUrlGenerator() {

    const { public: { corelliTrioSonatasSha } } = useRuntimeConfig();

    function localScoreUrlGenerator(id, annotated = false) {
        if (annotated === true) {
            return localAnnotatedScoreUrlGenerator(id);
        }
        const url = `/kern/corelli-trio-sonatas/${id}.krn?${corelliTrioSonatasSha}`;
        return url;
    }

    function localAnnotatedScoreUrlGenerator(id) {
        const url = `/kern/annotated-corelli-trio-sonatas/${id}.krn?${corelliTrioSonatasSha}`;
        return url;
    }

    function githubScoreUrlGenerator(id) {
        const url = `https://github.com/WolfgangDrescher/corelli-trio-sonatas/blob/master/kern/${id}.krn`;
        return url;
    }

    function githubRawScoreUrlGenerator(id) {
        const url = `https://raw.githubusercontent.com/WolfgangDrescher/corelli-trio-sonatas/refs/heads/master/kern/${id}.krn`;
        return url;
    }

    function vhvScoreUrlGenerator(id) {
        const url = `https://verovio.humdrum.org/?file=${encodeURIComponent(githubRawScoreUrlGenerator(id))}`;
        return url;
    }

    return {
        localScoreUrlGenerator,
        localAnnotatedScoreUrlGenerator,
        githubScoreUrlGenerator,
        githubRawScoreUrlGenerator,
        vhvScoreUrlGenerator,
    };
}
