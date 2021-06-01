import path from 'path';

import parseLcov from './parse/parse-lcov';
import parseJacoco from './parse/parse-jacoco';
import parseCoveralls from './parse/parse-coveralls';

const reports = {
    lcov: parseLcov,
    jacoco: parseJacoco,
    coveralls: parseCoveralls
};

export const parse = ({reportFile, type, workingDirectory = '.'}, config) => {
    if (!reportFile) {
        throw new Error('Missing required parameter `reportFile`');
    }

    if (!type) {
        throw new Error('Missing required parameter `type`');
    }

    if (reports[type]) {
        config.workingDirectory = path.resolve(config.projectRoot, workingDirectory);

        return reports[type](reportFile, config);
    }

    throw new Error(`Unsupported report type "${type}". Supported types are ${Object.keys(reports).join(', ')}`);
};
