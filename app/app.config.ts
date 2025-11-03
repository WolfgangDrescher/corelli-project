export default defineAppConfig({
    ui: {
        colors: {
            primary: 'teal',
        },
        commandPalette: {
            variants: {
                active: {
                    true: {
                        item: 'before:bg-primary/5 data-highlighted:not-data-disabled:before:bg-elevated',
                    },
                },
            },
        },
    },
});
