export function useScoreUrlGenerator() {
    const requestUrl = useRequestURL();

    const { public: { corelliTrioSonatasSha } } = useRuntimeConfig();

    function localScoreUrlGenerator(id) {
        const url = `${requestUrl.origin}/kern/corelli-trio-sonatas/${id}.krn?${corelliTrioSonatasSha}`;
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
        githubScoreUrlGenerator,
        githubRawScoreUrlGenerator,
        vhvScoreUrlGenerator,
    };
}
