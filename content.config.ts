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
                localRawFile: z.string(),
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
    },
});
