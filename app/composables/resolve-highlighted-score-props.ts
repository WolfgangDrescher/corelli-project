interface NoteGroup {
    items: string[];
    color?: string;
}

interface Section {
    startLine: number;
    endLine: number;
}

interface SectionGroup {
    items: Section[];
    color?: string;
}

interface LineGroup {
    items: number[];
    color?: string;
}

export type NotesProp = NoteGroup[] | string[];
export type LinesProp = LineGroup[] | number[];
export type SectionsProp = SectionGroup[] | Section[];

export function useResolveHighlightedScoreProps(props: {
    notes?: NotesProp;
    lines?: LinesProp;
    sections?: SectionsProp;
    filters?: Array<string>,
}) {
    const defaultColors = [
        'rgb(234 179 8 / 0.4)', // yellow-500/40
        'rgb(34 197 94 / 0.4)', // green-500/40
        'rgb(59 130 246 / 0.4)', // blue-500/40
    ];

	const lineShiftAmount = computed(() => {
		let lineShift = 0;
		if (props.filters?.includes('meter -f')) lineShift += 1;
		if (props.filters?.includes('deg -k1 --box -t')) lineShift += 1;
		return lineShift;
	});

	const applyLineShift = (value: number): number => {
		return value + lineShiftAmount.value;
    }

    const applyLineShiftToNoteId = (id: string): string => {
        const match = id.match(/^L(\d+)F(\d+)$/);
        if (!match) return id;

        const [, line, field] = match;
        if (!line || !field) return id;

        const shiftedLine = parseInt(line, 10) + lineShiftAmount.value;
        return `L${shiftedLine}F${field}`;
    };

    const isValidLineField = (id: string) => /^L\d+F\d+$/.test(id);

    const resolvedNotes = computed<NoteGroup[]>(() => {
        const notes = props.notes ?? [];

        // case: string[]
        if (notes.length > 0 && typeof notes[0] === 'string') {
            const validIds = (notes as string[]).filter(isValidLineField).map(applyLineShiftToNoteId);
            return [
                {
                    items: validIds,
                    color: defaultColors[0],
                },
            ];
        }

        // case: NoteGroup[]
        return (notes as NoteGroup[]).map((group, index) => ({
            ...group,
            items: group.items.filter(isValidLineField).map(applyLineShiftToNoteId),
            color: group.color || defaultColors[index % defaultColors.length],
        }));
    });

    const isValidSection = (section: Section): boolean => {
        return (
            typeof section.startLine === 'number' &&
            typeof section.endLine === 'number' &&
            section.startLine >= 0 &&
            section.endLine >= section.startLine
        );
    };

    const resolvedSections = computed<SectionGroup[]>(() => {
        const sections = props.sections ?? [];

        // case: Section[]
        if (sections.length > 0 && sections[0] && 'startLine' in sections[0]) {
            const valid = (sections as Section[]).filter(isValidSection).map((s) => ({
					startLine: applyLineShift(s.startLine)!,
					endLine: applyLineShift(s.endLine)!,
				}));
            return [
                {
                    items: valid,
                    color: defaultColors[0],
                },
            ];
        }

        // case 2: SectionGroup[]
        return (sections as SectionGroup[]).map((group, index) => ({
            ...group,
            items: Array.isArray(group.items)
                ? group.items.filter(isValidSection).map((s) => ({
                    startLine: applyLineShift(s.startLine)!,
                    endLine: applyLineShift(s.endLine)!,
                }))
                : [],
            color: group.color || defaultColors[index % defaultColors.length],
        }));
    });

    const isValidLineNumber = (n: number): boolean => Number.isInteger(n) && n >= 0;

    const resolvedLines = computed<LineGroup[]>(() => {
        const lines = props.lines ?? [];

        // case: number[]
        if (lines.length > 0 && typeof lines[0] === 'number') {
            const valid = (lines as number[]).filter(isValidLineNumber).map((n) => applyLineShift(n)!);
            return [
                {
                    items: valid,
                    color: defaultColors[0],
                },
            ];
        }

        // case: LineGroup[]
        return (lines as LineGroup[]).map((group, index) => ({
            ...group,
            items: Array.isArray(group.items)
                ? group.items.filter(isValidLineNumber).map((n) => applyLineShift(n)!)
                : [],
            color: group.color || defaultColors[index % defaultColors.length],
        }));
    });

    return {
        defaultColors,
        resolvedNotes,
        resolvedSections,
        resolvedLines,
    };
}
