import { onKeyStroke } from '@vueuse/core';

function ignoreIfInput () {
    const el = document.activeElement;
    return el && (['input', 'textarea'].includes(el.tagName.toLowerCase()) || el.isContentEditable);
};

export function useScoreKeyboardShortcuts(options = {}) {
    const route = useRoute();
    const scoreOptions = useScoreOptions();
    const localePath = useLocalePath();

    const { prevPiece, nextPiece } = options ?? {};

    onKeyStroke('ArrowLeft', () => {
        if (ignoreIfInput() || !prevPiece) return;
        navigateTo(localePath({ name: 'piece-id', params: { id: prevPiece.slug }, hash: route.hash }));
    });

    onKeyStroke('ArrowRight', () => {
        if (ignoreIfInput() || !nextPiece) return;
        navigateTo(localePath({ name: 'piece-id', params: { id: nextPiece.slug }, hash: route.hash }));
    });

    onKeyStroke('c', () => {
        if (ignoreIfInput()) return;
        scoreOptions.showCadences = !scoreOptions.showCadences;
    });

    onKeyStroke('m', () => {
        if (ignoreIfInput()) return;
        scoreOptions.showModulations = !scoreOptions.showModulations;
    });

    onKeyStroke('+', () => {
        if (ignoreIfInput()) return;
        scoreOptions.zoomIn();
    });

    onKeyStroke('-', () => {
        if (ignoreIfInput()) return;
        scoreOptions.zoomOut();
    });

    onKeyStroke('0', () => {
        if (ignoreIfInput()) return;
        scoreOptions.resetZoom();
    });

    onKeyStroke('r', () => {
        if (ignoreIfInput()) return;
        scoreOptions.reset();
    });
}
