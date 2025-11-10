import fs from 'node:fs';

export function getIdFromFilename(path) {
    return path.split(/[\\\/]/).pop().replace(/\..+$/, '');
}

export function getFiles(directory, fileList) {
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

export function parseTimepoint(tp) {
    const [measureStr, beatStr] = tp.split('/', 2);
    return {
        measure: parseInt(measureStr, 10),
        beat: convertFloatToTwoPart(beatStr),
    };
}

export function convertFloatToTwoPart(value, spacer = '+') {
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
