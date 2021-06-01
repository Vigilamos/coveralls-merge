import path from 'path';
import {getSourceFromFile} from '../util/helpers';

export default (reportFile, config) => new Promise(resolve => {
    const fp = path.resolve(config.projectRoot, reportFile);
    const content = JSON.parse(getSourceFromFile(fp));

    content.source_files.map(each => each.name = `${config.coverallsFilePathPrefix}/${each.name}`);
    resolve(content.source_files);
});
