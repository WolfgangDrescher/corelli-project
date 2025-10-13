import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getFiles(directory, fileList) {
    fileList = fileList || [];
    let files = fs.readdirSync(directory);
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    for (let i in files) {
        const name = `${directory}/${files[i]}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
        } else {
            fileList.push(name);
        }
    }
    return fileList;
}

const pieces = getFiles(`${__dirname}/../content/pieces`).map(file => {
    return yaml.load(fs.readFileSync(file, 'utf8'));
});

const meterOptions = [...new Set(pieces.map(piece => piece.meter).filter(n => n))];
const keyOptions = [...new Set(pieces.map(piece => piece.key).filter(n => n))];
const titleOptions = [...new Set(pieces.map(piece => piece.title).filter(n => n))];
const tempoOptions = [...new Set(pieces.map(piece => piece.movementDesignation).filter(n => n))];

const json = {
    meterOptions,
    keyOptions,
    titleOptions,
    tempoOptions,
};

console.log(json);

fs.writeFileSync(`${__dirname}/../app/utils/piece-filter-options.json`, JSON.stringify(json, null, '\t'), 'utf8');
