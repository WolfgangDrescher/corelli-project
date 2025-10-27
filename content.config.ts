import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
    collections: {
        pieces: defineCollection({
            source: 'pieces/**/*.yaml',
            type: 'page',
            schema: z.object({
                composer: z.string(),
                key: z.string(),
                largerWorkTitle: z.string(),
                majorMinor: z.string(),
                meter: z.string(),
                movementDesignation: z.string(),
                mv: z.number(),
                nr: z.number(),
                op: z.number(),
                slug: z.string(),
                title: z.string(),
            }),
        }),
        chords: defineCollection({
            source: 'chords.yaml',
            type: 'data',
            schema: z.object({
                chords: z.array(z.object({
                    beat: z.number(),
                    fb: z.string(),
                    hint: z.string(),
                    deg: z.string(),
                    lineNumber: z.number(),
                    pieceId: z.string(),
                    nextDeg: z.string(),
                    meterWeight: z.string(),
                })),
            }),
        }),
        modulations: defineCollection({
            source: 'modulations.yaml',
            type: 'data',
            schema: z.object({}).passthrough(),
        }),
        transitions: defineCollection({
            source: 'transitions.yaml',
            type: 'data',
            schema: z.object({}).passthrough(),
        }),
    },
});
