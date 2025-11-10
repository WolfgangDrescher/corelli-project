import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { romanize } from '../app/utils/romanize.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = `${__dirname}/../corelli-trio-sonatas/kern`;
const pathToCadenceData = `${__dirname}/../corelli-trio-sonatas/cadences.yaml`;
const pathToCadencesYaml = `${__dirname}/../content/cadences.yaml`;

function getIdFromFilename(path) {
    return path.split(/[\\\/]/).pop().replace(/\..+$/, '');
}

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

function parseTimepoint(tp) {
    const [measureStr, beatStr] = tp.split('/', 2);
    return {
        measure: parseInt(measureStr, 10),
        beat: convertFloatToTwoPart(beatStr),
    };
}

function convertFloatToTwoPart(value, spacer = '+') {
    if (!isFinite(value)) return String(value);

    let sign = 1;
    if (value < 0) {
        sign = -1;
        value = -value;
    }

    const integ = Math.floor(value);
    const frac = value - integ;

    if (frac < 1e-10) {
        return (sign < 0 ? '-' : '') + integ.toString();
    }

    // Approximate the fractional part as a simple fraction
    let bestNum = 1, bestDen = 1, bestError = Math.abs(frac - bestNum / bestDen);
    for (let den = 1; den <= 1000; den++) {
        const num = Math.round(frac * den);
        const err = Math.abs(frac - num / den);
        if (err < bestError) {
            bestError = err;
            bestNum = num;
            bestDen = den;
            if (bestError < 1e-8) break;
        }
    }

    // Reduce fraction to lowest terms using greatest common divisor
    let a = bestNum, b = bestDen;
    while (b) [a, b] = [b, a % b];
    const gcd = a;
    bestNum /= gcd;
    bestDen /= gcd;

    let result = '';
    if (sign < 0) result += '-';
    if (integ > 0) {
        result += integ + spacer + `${bestNum}/${bestDen}`;
    } else {
        result += `${bestNum}/${bestDen}`;
    }
    return result;
}


const cadencesYaml = yaml.load(fs.readFileSync(pathToCadenceData, 'utf8').toString());

const cadences = [];

getFiles(pathToKernScores).forEach(file => {
    const id = getIdFromFilename(file);


    const pieceCadences = cadencesYaml[id];

    if (!pieceCadences || pieceCadences.length === 0) {
        console.warn(`❌ No cadences found for ${id}`);
        return;
    }
    
    console.log(`✅ Cadences found for ${id}`);

    const kern = execSync(`cat ${file} | lnnr | beat -ca | meter | degx --resolve-null -t`).toString().trim();

    const newCadences = pieceCadences.map(([a, b, tags]) => ({
        tags: tags == null ? [] : [].concat(tags),
        pieceId: id,
    }));

    pieceCadences.forEach((pieceCadence, cadenceIndex) => {
        const [startPoint, endPoint] = pieceCadence;
        const start = parseTimepoint(startPoint);
        const end = parseTimepoint(endPoint);

        const kernLines = kern.split('\n');
        let currentMeasure = null;
        let currentKey = null;
        let currentBeat = null;
        let currentLineNumber = null;
        let currentAbsb = null;
        let currentBassScaleDegree = null;
        let pieceKey = null;
        const headerCols = [];

        for (let i = 0; i < kernLines.length; i++) {
            const line = kernLines[i];
            const tokens = line.split('\t');
        
            if (line.startsWith('**')) {
                headerCols.push(...tokens);
            }

            // Detect current measure number (=N)
            const measureMatch = line.match(/^=(\d+)/);
            if (measureMatch) {
                currentMeasure = parseInt(measureMatch[1], 10);
            }

            // Detect current line number (does not match i because humlib programms can add lines)
            currentLineNumber = null;
            for (let j = 0; j < tokens.length; j++) {
                const header = headerCols[j];
                if (!header || !header.includes('**lnnr')) continue;
                const v = tokens[j]?.trim();
                if (v && v !== '.' && !v.startsWith('*') && !v.startsWith('!') && !v.startsWith('=')) {
                    currentLineNumber = parseInt(v, 10);
                    break;
                }
            }

            // Detect current beat (meter -f)
            currentBeat = null;
            for (let j = 0; j < tokens.length; j++) {
                const header = headerCols[j];
                if (!header || !header.includes('**cdata-beat')) continue;
                const v = tokens[j]?.trim();
                if (v && v !== '.' && !v.startsWith('*') && !v.startsWith('!') && !v.startsWith('=')) {
                    currentBeat = v;
                    break;
                }
            }

            // Detect current changes (e.g. *E-:)
            const keyMatch = line.match(/\*([A-Ha-h\#\-]+):/);
            if (keyMatch) {
                currentKey = keyMatch[1];
                if (pieceKey === null) {
                    pieceKey = currentKey;
                }
            }

            // Detect toatal beat count from beginning of piece (beat -ca)
            currentAbsb = null;
            for (let j = 0; j < tokens.length; j++) {
                const header = headerCols[j];
                if (!header || !header.includes('**absb')) continue;
                const v = tokens[j]?.trim();
                if (v && v !== '.' && !v.startsWith('*') && !v.startsWith('!') && !v.startsWith('=')) {
                    currentAbsb = parseInt(v, 10);
                    break;
                }
            }

            currentBassScaleDegree = null;
            for (let j = 0; j < tokens.length; j++) {
                const header = headerCols[j];
                if (!header || !header.includes('**deg')) continue;
                const v = tokens[j]?.trim();
                if (v && v !== '.' && !v.startsWith('*') && !v.startsWith('!') && !v.startsWith('=')) {
                    currentBassScaleDegree = v;
                    break;
                }
            }

            if (currentMeasure === start.measure && currentBeat === start.beat) {
                newCadences[cadenceIndex].startLine = currentLineNumber;
                newCadences[cadenceIndex].startBeat = currentAbsb;
            }
            
            if (currentMeasure === end.measure && currentBeat === end.beat) {
                newCadences[cadenceIndex].endLine = currentLineNumber;
                newCadences[cadenceIndex].endBeat = currentAbsb;
                newCadences[cadenceIndex].key = currentKey;
                newCadences[cadenceIndex].endBassDeg = currentBassScaleDegree;

                const degScore = `**kern
*${pieceKey}:
1${currentKey.toLowerCase()}`;

                const stdout = execSync(`echo "${degScore}" | degx | extractxx -i deg | ridx -I`).toString().trim();
                let deg = romanize(stdout);
                deg = currentKey === currentKey.toLowerCase() ? deg.toLowerCase() : deg.toUpperCase();
                newCadences[cadenceIndex].deg = deg;
            }
        }

    });

    cadences.push(...newCadences.filter(c => c.pieceId));

});

fs.writeFileSync(pathToCadencesYaml, yaml.dump({cadences}, {
    indent: 4,
    lineWidth: -1,
    sortKeys: true,
}));
