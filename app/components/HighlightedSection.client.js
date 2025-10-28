function createMarker(startElem, endElem, systemElem, containerElem, color) {
    endElem = getBBoxElem(endElem) || endElem;

    const systemFirstMeasureStaffRect = selectBBoxElem(systemElem, '.measure .staff')?.getBoundingClientRect();
    const systemRect = getBBoxElem(systemElem)?.getBoundingClientRect();
    const containerRect = containerElem.getBoundingClientRect();
    const startRect = getBBoxElem(startElem)?.getBoundingClientRect();
    const endRect = getBBoxElem(endElem)?.getBoundingClientRect();

    const staffs = systemElem?.querySelectorAll('.measure .staff');
    const firstStaffRect = getBBoxElem(staffs[0])?.getBoundingClientRect();
    const lastStaffRect = getBBoxElem(staffs[staffs.length - 1])?.getBoundingClientRect();

    const heightExtender = 15;
    const height = lastStaffRect.y + lastStaffRect.height - firstStaffRect.y  + heightExtender;

    const xPosStart = startRect ? startRect.x : (systemFirstMeasureStaffRect ? systemFirstMeasureStaffRect.x: systemRect.x);
    const xPosEnd = endRect ? endRect.right : getBBoxElem([...systemElem.querySelectorAll('.measure:not(.bounding-box)')].at(-1).querySelector('.staff:not(.bounding-box)'))?.getBoundingClientRect().right;

    const widthExtender = 15;
    const width = xPosEnd - xPosStart + widthExtender;
    const xOffset = 2;

    return h('div', {
        class: [
            'absolute',
            !startElem && 'bg-zig-zag-left',
            !endElem && 'bg-zig-zag-right',
            startElem && !endElem && 'rounded-tl rounded-bl',
            !startElem && endElem && 'rounded-tr rounded-br',
            startElem && endElem && 'rounded',
        ],
        style: {
            backgroundColor: color,
            '--zig-zag-color': color,
            width: `${width}px`,
            height: `${height}px`,
            left: `${xPosStart - (widthExtender / 2) - containerRect.x + xOffset}px`,
            top: `${firstStaffRect.y - (heightExtender / 2) - containerRect.y}px`,
        },
    });
}

function selectBBoxElem(elem, selectors) {
    const selectedElem = elem?.querySelector(selectors);
    return getBBoxElem(selectedElem);
}

function getBBoxElem(elem) {
    return elem?.closest('svg')?.querySelector(`#bbox-${elem?.id} rect`) ?? elem;
}

export default {
    name: 'HighlightedSection',
    props: {
        startLine: Number,
        endLine: Number,
        color: String,
        container: HTMLElement,
    },
    setup(props) {

        const markers = [];

        let startElem = null;
        let endElem = null;
        const containerElem = props.container;

        for (let i = props.startLine; i <= props.endLine; i++) {
            startElem = props.container?.querySelector(`g[id^="note-L${i}"]`);
            if (startElem) break;
        }

        for (let i = props.endLine; i >= props.startLine; i--) {
            endElem = props.container?.querySelector(`g[id^="note-L${i}"]`);
            if (endElem) break;
        }

        if (startElem && endElem && containerElem) {

            const startSystem = startElem.closest('g.system');
            const endSystem = endElem.closest('g.system');

            if (startSystem === endSystem) {
                markers.push(createMarker(startElem, endElem, startSystem, containerElem, props.color));
            } else {
                const systemParentChildren = startSystem.parentElement.children;
                const startIndex = [...systemParentChildren].indexOf(startSystem);
                const endIndex = [...systemParentChildren].indexOf(endSystem);

                for (let i = startIndex; i <= endIndex; i++) {
                    const systemElem = systemParentChildren[i];
                    markers.push(createMarker(
                        i === startIndex ? startElem : null,
                        i === endIndex ? endElem : null,
                        systemElem,
                        containerElem,
                        props.color,
                    ));
                }
            }
        }

        return () => h('div', {}, markers);
    },
};
