import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import yaml from 'js-yaml';
import { getFiles } from './utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pieces = getFiles(`${__dirname}/../content/pieces`).map(file => {
    return yaml.load(fs.readFileSync(file, 'utf8'));
});

const meterOptions = [...new Set(pieces.flatMap(piece => piece.meter ?? []))].sort((a, b) => {
    const [numA, denA] = a.split('/').map(Number);
    const [numB, denB] = b.split('/').map(Number);
    return denA - denB || numA - numB;
});
const keyOptions = [...new Set(pieces.map(piece => piece.key).filter(Boolean))];
const titleOptions = [...new Set(pieces.map(piece => piece.title).filter(Boolean))];
const tempoOptions = [...new Set(pieces.flatMap(piece => piece.movementDesignation ?? []))];
const opOptions = [...new Set(pieces.map(piece => piece.op).filter(Boolean))];
const nrOptions = [...new Set(pieces.map(piece => piece.nr).filter(Boolean))];

const json = {
    meterOptions,
    keyOptions,
    titleOptions,
    tempoOptions,
    opOptions,
    nrOptions,
};

console.log(json);

fs.writeFileSync(`${__dirname}/../app/utils/piece-filter-options.json`, JSON.stringify(json, null, '\t'), 'utf8');
