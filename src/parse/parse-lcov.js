import path from 'path';

import {
    getNumberOfLinesInSource,
    getSourceFromFile,
    getSourceDigest,
    padWithNull
} from '../util/helpers';

function getCoverageFromLine(line) {
    return line.slice(3).split(',').map(number => Number(number));
}

function convertLcovSectionToCoverallsSourceFile(lcovSection) {
    const lcovSectionLines = lcovSection.trim().split('\n'),
        coverallsSourceFile = {
            coverage: []
        };

    let numberOfSourceFileLines = 0, lastLine = 0;

    lcovSectionLines.forEach(line => {
        if (line.startsWith('SF:')) {
            const relativeFilePath = line.slice(3),
                fileSource = getSourceFromFile(relativeFilePath);

            coverallsSourceFile.name = relativeFilePath;
            coverallsSourceFile.source_digest = getSourceDigest(fileSource);

            numberOfSourceFileLines = getNumberOfLinesInSource(fileSource);
        }

        if (line.startsWith('DA:')) {
            const [lineNumber, numberOfHits] = getCoverageFromLine(line);

            if (lineNumber !== 0) {
                padWithNull(coverallsSourceFile, lineNumber - lastLine - 1);

                coverallsSourceFile.coverage.push(numberOfHits);

                lastLine = lineNumber;
            }
        }
    });

    padWithNull(coverallsSourceFile, numberOfSourceFileLines - lastLine);

    return coverallsSourceFile;
}

function emptySections(section) {
    return section.trim() !== '';
}

export default (reportFile, config) => new Promise(resolve => {
    const lcovReportFilePath = path.resolve(config.projectRoot, reportFile),
        lcovContents = getSourceFromFile(lcovReportFilePath),
        lcovSections = lcovContents.split('end_of_record\n'),
        result = lcovSections
            .filter(emptySections)
            .map(section => convertLcovSectionToCoverallsSourceFile(section));

    resolve(result);
});
