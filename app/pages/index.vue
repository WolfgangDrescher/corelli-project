<script setup>
const { t } = useI18n();

useHead({
    title: t('home'),
});


const id = 'op04n01a';
const { data: piece } = await useAsyncData(`pieces/${id}`, () => queryCollection('pieces').where('stem', '=', `pieces/${id}`).first());
const { data: cadencesData } = await useAsyncData(`cadences`, () => queryCollection('cadences').first());
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection('modulations').first());

const cadences = cadencesData.value.cadences.filter(c => c.pieceId === id);
const modulations = modulationsData.value.modulations.filter(m => m.pieceId === id);

const scoreOptions = useScoreOptions();
useScoreKeyboardShortcuts();
const { localScoreUrlGenerator, githubScoreUrlGenerator, vhvScoreUrlGenerator } = useScoreUrlGenerator();

const timelineValue = 2;
const timeline = [
    {
        icon: 'i-lucide-rocket',
        title: 'Projekt-Kickoff',
        description: 'Start des Projekts und Einführung in digitale Analysemethoden.',
        date: '1. Oktober 2025',
    },
    {
        icon: 'i-lucide-music',
        title: 'Aufbereitung der Partituren',
        description: 'Import und Aufbereitung der Kern-Partituren, sodass im Anschluss spezifische musikalische Parameter mit Humdrum automatisch berechnet werden können.',
        date: 'Oktober 2025',
    },
    {
        icon: 'i-lucide-pencil',
        title: 'Annotation',
        description: 'Erfassung und Markierung von Kadenzen, Sequenzen und Tonarten.',
        date: 'November 2025',
    },
    {
        icon: 'i-lucide-lightbulb',
        title: 'Forschungsfragen',
        description: 'Formulierung, digitale Aufbereitung und Programmierung der analytischen Fragestellungen.',
        date: 'Dezember 2025',
    },
    {
        icon: 'i-lucide-globe',
        title: 'Deployment',
        description: 'Veröffentlichung und Präsentation der Website.',
        date: 'Februar 2026',
    },
];
</script>

 <template>
    <UContainer>
        <section class="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
                <Heading>Digitale Perspektiven auf Corellis Triosonaten</Heading>
            </div>
        </section>
        <div class="grid grid-cols-1 gap-8">
            <section class="grid gap-12 lg:grid-cols-2 lg:items-start">
                <div class="flex flex-col gap-6">
                    <p>
                        Die Plattform vereint Analysen, Materialien und
                        Werkzeuge, die im Rahmen des Seminars
                        <em>Digitale Methoden zur Analyse von Corellis
                        Triosonaten</em> im Wintersemester 2025/26 an der
                        Hochschule für Musik Freiburg entstanden.

                        Auf Grundlage fachlicher Analysen der Triosonaten mit
                        Annotationen von Kadenzen, Sequenzen und Tonarten werden
                        die Werke mit digitalen Methoden aufbereitet und
                        ausgewertet.

                        Mit Tools wie Humdrum und Verovio lassen sich die
                        analytischen Ergebnisse direkt auf der Website in einer
                        interaktiven Partitur sowie über Charts und
                        Filtermöglichkeiten erkunden.
                        
                        Das Ziel ist es, Studierende beim Erforschen dieser
                        Stücke mit einem Fokus auf den Generalbass zu
                        unterstützen und sie zu motivieren, eigene
                        Untersuchungen zu spezifischen Parametern dieser Musik
                        durchzuführen, sowie handwerkliche Kriterien zu
                        vermitteln, die es ihnen ermöglichen, eigene
                        Kompositionen im Stil dieser Triosonaten anzufertigen.
                    </p>
                </div>
                <UCard>
                    <Subheading :level="2">Was Sie hier finden</Subheading>
                    <ul class="space-y-1">
                        <li class="grid grid-cols-[auto_1fr] gap-2 items-start">
                            <span class="block h-2 w-2 translate-y-2 rounded-full bg-primary-500"></span>
                            <span>
                                Interaktive Darstellung von Kadenzen,
                                Satzmodellen und Modulationen direkt in der
                                Partitur.
                            </span>
                        </li>
                        <li class="grid grid-cols-[auto_1fr] gap-2 items-start">
                            <span class="block h-2 w-2 translate-y-2 rounded-full bg-primary-500"></span>
                            <span>
                                Digitale Aufbereitung konkreter Forschungsfragen
                                zu diesem Korpus.
                            </span>
                        </li>
                        <li class="grid grid-cols-[auto_1fr] gap-2 items-start">
                            <span class="block h-2 w-2 translate-y-2 rounded-full bg-primary-500"></span>
                            <span>
                                Diagramme zu Tonartenverhältnissen und
                                Modulationsvorgängen.
                            </span>
                        </li>
                        <li class="grid grid-cols-[auto_1fr] gap-2 items-start">
                            <span class="block h-2 w-2 translate-y-2 rounded-full bg-primary-500"></span>
                            <span>
                                Filtermöglichkeiten zur gezielten Auswahl
                                bestimmter musikalischer Parameter wie Akkorden
                                und Kadenzen.
                            </span>
                        </li>
                    </ul>
                </UCard>
            </section>
            <section class="grid gap-10 lg:grid-cols-2">
                <div class="flex flex-col gap-4">
                    <Subheading :level="2">Analytische und digitale Arbeitsweisen im Seminar</Subheading>
                    <p>
                        Die Studierenden erproben, wie digitale Methoden
                        musiktheoretische Analyseverfahren erweitern und
                        präzisieren können.
                        
                        Im Mittelpunkt steht die systematische Erfassung und
                        Auswertung struktureller Merkmale in Corellis
                        Triosonaten, etwa von Kadenzen, Sequenzen und
                        Modulationen.
                        
                        Durch den Einsatz datenbasierter Verfahren werden
                        musikalische Muster sichtbar, die in traditionellen
                        Analysen oft unberücksichtigt bleiben.
                        
                        Auf diese Weise entstehen neue Ansätze, um
                        kompositorische Prinzipien des Barock empirisch zu
                        untersuchen und für Lehre und Forschung nutzbar zu
                        machen.

                        Ein zentraler Bestandteil des Seminars ist die
                        Auseinandersetzung mit der Annotation musikalischer
                        Parameter. Die Studierenden entwickeln Strategien, wie
                        sich bestimmte Phänomene eindeutig erfassen und im
                        YAML-Format innerhalb des Repositoriums dokumentieren
                        lassen.

                        Darauf aufbauend erfolgt die Systematisierung der
                        Annotationen. Dabei werden Begriffe und Kriterien
                        definiert, etwa die Frage, wann eine Wendung als Kadenz
                        gilt oder in welchem Verhältnis kadenzielle Strukturen
                        innerhalb von Sequenzen stehen.

                        Anschließend werden die benötigten Daten mit Humdrum,
                        Humlib und verschiedenen Filteroptionen aufbereitet, um
                        relevante Parameter als Rohdaten zu extrahieren.

                        Diese Rohdaten dienen schließlich als Grundlage für
                        visuelle und interaktive Darstellungen auf der
                        Projektwebsite. Mit Vue.js und Nuxt.js entstehen
                        Diagramme, Filter und Ansichtsseiten, die die
                        Analyseergebnisse anschaulich und nachvollziehbar
                        machen.
                    </p>
                </div>
                <div class="flex flex-col gap-4">
                    <UTimeline :items="timeline" v-model="timelineValue" color="primary" />
                </div>
            </section>
            <section class="max-w-2xl lg:w-1/2">
                <Subheading :level="2">Beispielpartitur</Subheading>
                <p>
                    Die folgende Partitur zeigt ein Beispiel für die interaktive
                    Darstellung der im Seminar entwickelten Analysetools.
                    Kadenzen, Sequenzen und Modulationen können direkt in der
                    Notendarstellung erkundet und über verschiedene Filter und
                    Visualisierungen ausgewertet werden.

                    Probieren Sie die Befehlspalette aus, um für Sie
                    interessante Phänomene in der Partitur anzuzeigen.
                </p>
            </section>
            <section>
                <div class="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div>
                        <ScoreOptionsPalette />
                    </div>
                    <div class="shrink-0 flex gap-2 ml-auto md:order-2">
                        <MidiPlayer :url="localScoreUrlGenerator(piece.slug)" class="text-2xl"/>
                        <UButton :to="githubScoreUrlGenerator(piece.slug)" target="_blank">
                            {{ $t('github') }}
                        </UButton>
                        <UButton :to="vhvScoreUrlGenerator(piece.slug)" target="_blank">
                            {{ $t('vhv') }}
                        </UButton>
                    </div>
                </div>
                <HighlightedScore
                    :piece-id="piece.slug"
                    :verovio-options="{
                        ...scoreOptions.verovioOptions,
                        header: true,
                        spacingSystem: 15,
                        pageMarginLeft: 50,
                        pageMarginRight: 0,
                        pageMarginTop: 10,
                        pageMarginBottom: 10,
                    }"
                    :sections="scoreOptions.showCadences ? cadences.map(c => ({
                        startLine: c.startLine,
                        endLine: c.endLine,
                        label: c.tags?.join(', '),
                    })) : []"
                    :lines="scoreOptions.showModulations ? [{
                        items: modulations.map(m => ({
                            lineNumber: m.startLine,
                            label: {
                                value: scoreOptions.showModulationsDegLabel ? m.deg : m.key,
                                position: 'bottom',
                            },
                        })),
                        color: 'rgb(34 197 94 / 0.4)',
                    }] : []"
                    :filters="scoreOptions.humdrumFilters"
                />
            </section>
        </div>
    </UContainer>
</template>
