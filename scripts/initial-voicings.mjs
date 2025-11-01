import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = `${__dirname}/../corelli-trio-sonatas/kern`;
const pathToYaml = `${__dirname}/../content/initial-voicings.yaml`;

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

const initialVoicings = []

getFiles(pathToKernScores).forEach(file => {
    const id = getIdFromFilename(file);
    console.log(`✅ Initial voicing for ${id}`);

    const content = fs.readFileSync(file, 'utf8').toString();
    const exinterpLine = content.split('\n').find(l => l.startsWith('**'));
    const kernCount = exinterpLine ? (exinterpLine.match(/\*\*kern/g) || []).length : 0;

    const keepThreeKernSpines = kernCount > 3 ? '2-4' : '1-3';

    const cmd = `cat ${file} | extractxx -k ${keepThreeKernSpines} | extractxx -I "**fb" | fb -c | extractxx -i fb | ridxx -LGTdI  | head -n 15`;
    const kern = execSync(cmd).toString().trim();

    const kernLines = kern.split('\n');
    let currentMeasure = null;

    let fbToken = null;
    for (let i = 0; i < kernLines.length; i++) {
        const token = kernLines[i];
    
        // Detect current measure number (=N)
        const measureMatch = token.match(/^=(\d*)/);
        if (measureMatch) {
            currentMeasure = measureMatch[1] ? parseInt(measureMatch[1], 10) : 0;
            continue;
        }

        if (currentMeasure <=1 && token) {
            fbToken = token;
            break;
        }
    }

    initialVoicings.push({
        pieceId: id,
        fb: fbToken,
    })
    
});

fs.writeFileSync(pathToYaml, yaml.dump({initialVoicings}, {
    indent: 4,
    lineWidth: -1,
    sortKeys: true,
}));
