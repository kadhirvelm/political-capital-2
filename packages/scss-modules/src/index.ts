/**
 * Copyright (c) 2022 - KM
 */

import { writeFileSync } from "fs-extra";
import * as webpack from "webpack";
import { getExportLocalsObject } from "./utils/getExportLocalsObject";
import { getTypingsFile } from "./utils/getTypingsFile";
import { getTypingsFilePath } from "./utils/getTypingsFilePath";
import { ensureDirectoryExists } from "./utils/ensureDirectoryExists";
import { generateSourceMap } from "./utils/generateSourceMap";

// eslint-disable-next-line func-names
export default async function (this: webpack.LoaderContext<{ namespace: string }>, src: string) {
    const async = this.async();

    if (async === undefined) {
        return;
    }

    const exportLocalsObject = JSON.parse(getExportLocalsObject(src));

    let typingsFile = getTypingsFile(exportLocalsObject);
    const typingsFilePath = getTypingsFilePath.call(this);

    ensureDirectoryExists(typingsFilePath.path);

    let generatedSourceMap;
    if (this.sourceMap) {
        generatedSourceMap = await generateSourceMap(
            src,
            exportLocalsObject,
            typingsFilePath.sourcePath,
            typingsFilePath.file,
        );
        writeFileSync(`${typingsFilePath.path}/${typingsFilePath.file}.d.ts.map`, generatedSourceMap.toString());

        typingsFile = `${typingsFile}\n\n/*# sourceMappingURL=${typingsFilePath.file}.map*/`;
    }

    const finalTypingsFile = `${typingsFilePath.path}/${typingsFilePath.file}.d.ts`;

    writeFileSync(finalTypingsFile, typingsFile);

    this.addDependency(this.resourcePath);

    async(null, src);
}
