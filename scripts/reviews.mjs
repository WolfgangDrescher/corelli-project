import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { getIdFromFilename, getFiles } from './utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = `${__dirname}/../corelli-trio-sonatas/kern/`;
const pathToReviews = `${__dirname}/../corelli-trio-sonatas/review.yaml`;
const reviewsYamlPath = `${__dirname}/../content/reviews.yaml`;

const reviewsData = yaml.load(fs.readFileSync(pathToReviews, 'utf8').toString());

const reviews = [];

getFiles(pathToKernScores).forEach(file => {

    const id = getIdFromFilename(file);

    if (!reviewsData[id] || reviewsData[id].length === 0) {
        console.warn(`❌ No review found for ${id}`);
        return;
    }

    console.log(`✅ Review found for ${id}`);

    const stdout = execSync(`cd ${pathToKernScores} && git log -1 --format="%aI" -- ${id}.krn`).toString().trim();

    const reviewDate = new Date(reviewsData[id]);
    reviewDate.setHours(23, 59, 59, 999);
    // const now = new Date();
    // reviewDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    const gitDate = new Date(stdout);

    const needsReview = gitDate > reviewDate;

    const review = {
        pieceId: id,
        date: reviewsData[id],
        needsReview
    };
    
    reviews.push(review);

});

fs.writeFileSync(reviewsYamlPath, yaml.dump({reviews}, {
    indent: 4,
    lineWidth: -1,
    sortKeys: true,
}));
