<script setup>
import { de } from '@nuxt/ui/locale';

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | Corelli Project` : 'Corelli Project';
    },
});
</script>

<template>
    <UApp :locale="de">
        <div class="flex flex-col min-h-screen">
            <TheHeader />
            <TheNavigation />
            <main class="py-8">
                <slot></slot>
            </main>
            <TheFooter class="mt-auto" />
        </div>
    </UApp>
</template>

<style>
html {
    font-size: 18px;
}

@screen sm {
    html {
        font-size: 18px;
    }
}

@screen md {
    html {
        font-size: 19px;
    }
}

@screen lg {
    html {
        font-size: 19px;
    }
}

@screen xl {
    html {
        font-size: 20px;
    }
}

@screen 2xl {
    html {
        font-size: 20px;
    }
}

.bg-pattern {
    background-color: oklch(70.4% 0.14 182.503);
    background-image: url("/bg-pattern.svg");
}
</style>
