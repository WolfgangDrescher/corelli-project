import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { getIdFromFilename, getFiles } from './utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = `${__dirname}/../corelli-trio-sonatas/kern`;
const pathToSequenceData = `${__dirname}/../corelli-trio-sonatas/sequences.yaml`;
const pathToSequencesYaml = `${__dirname}/../content/sequences.yaml`;

const sequencesYaml = yaml.load(fs.readFileSync(pathToSequenceData, 'utf8').toString());

const sequences = [];

getFiles(pathToKernScores).forEach(file => {
    const id = getIdFromFilename(file);


    const pieceSequences = sequencesYaml[id];

    if (!pieceSequences || pieceSequences.length === 0) {
        console.warn(`❌ No sequences found for ${id}`);
        return;
    }
    
    console.log(`✅ Sequences found for ${id}`);

    const kern = execSync(`cat ${file} | lnnr | beat -ca | meter -f`).toString().trim();

    const newSequences = pieceSequences.map(([a, b, tags]) => ({
        tags: tags == null ? [] : [].concat(tags),
        pieceId: id,
    }));

    pieceSequences.forEach((pieceSequence, sequenceIndex) => {
        const [startPoint, endPoint] = pieceSequence;
        const start = parseTimepoint(startPoint);
        const end = parseTimepoint(endPoint);

        const kernLines = kern.split('\n');
        let currentMeasure = null;
        let currentBeat = null;
        let currentLineNumber = null;
        let currentAbsb = null;
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
                    currentBeat = parseFloat(v);
                    break;
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

            if (currentMeasure === start.measure && currentBeat === start.beat) {
                newSequences[sequenceIndex].startLine = currentLineNumber;
                newSequences[sequenceIndex].startBeat = currentAbsb;
            }
            
            if (currentMeasure === end.measure && currentBeat === end.beat) {
                newSequences[sequenceIndex].endLine = currentLineNumber;
                newSequences[sequenceIndex].endBeat = currentAbsb;
            }
        }

    });

    sequences.push(...newSequences.filter(c => c.pieceId));

});

fs.writeFileSync(pathToSequencesYaml, yaml.dump({sequences}, {
    indent: 4,
    lineWidth: -1,
    sortKeys: true,
}));
