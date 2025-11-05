# Corelli Project

The **Corelli Project** brings together analyses, materials, and digital tools
developed in the seminar *Digitale Methoden zur Analyse von Corellis
Triosonaten* (Hochschule für Musik Freiburg, Wintersemester 2025/26). Building
on detailed annotations of cadences, sequences, and tonal structures, the
website presents Corelli’s trio sonatas through interactive visualizations and
score-based analyses. Using frameworks such as **Humdrum** and **Verovio**,
analytical results can be explored directly within the digital score,
complemented by charts and filtering tools. The project aims to support students
in researching basso continuo practice and compositional techniques in Corelli’s
works, while encouraging them to conduct their own analyses and stylistic
studies.


## Technologies

* [Nuxt 4](https://nuxt.com/) and [Vue 3](https://vuejs.org/) as the application framework.
* [Nuxt UI](https://ui.nuxt.com/) for UI components and Tailwind utility classes.
* [`@nuxt/content`](https://content.nuxt.com/) for managing YAML-based datasets.
* [Verovio](https://www.verovio.org/) and [vue-verovio-canvas](https://github.com/WolfgangDrescher/vue-verovio-canvas) for score rendering.


## Repository overview

| Path/Repository        | Description                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `corelli-trio-sonatas` | Git submodule containing the core (`**kern`) files of Corelli’s trio sonatas. Source: [github.com/WolfgangDrescher/corelli-trio-sonatas](https://github.com/WolfgangDrescher/corelli-trio-sonatas). |
| `content/`             | YAML-based content collections (pieces, cadences, modulations, chords, transitions).                                                                                                                |
| `app/`                 | Nuxt application with components, pages, layouts, and composables.                                                                                                                                  |
| `scripts/`             | Utility scripts, e.g., for generating YAML metadata from the core files.                                                                                                                            |


## Project Setup

```sh
git clone --recurse-submodules https://github.com/WolfgangDrescher/corelli-project.git
cd corelli-project
npm install
npm run dev
```


## Updating metadata

The analytical metadata in `content/*.yaml` is automatically generated from the
core files. When a new version of the scores is pulled into the
corelli-trio-sonatas submodule, you should run:

```sh
git submodule update
node scripts/index.mjs
```

This regenerates the metadata so that any changes in line numbers, or additions
of keys and cadences, are reflected automatically.
