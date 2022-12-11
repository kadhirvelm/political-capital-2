/**
 * Copyright (c) 2022 - KM
 */

import { SourceMapConsumer, SourceMapGenerator } from "source-map";
import path from "path";

export async function generateSourceMap(
    rawInputString: string,
    exportLocalsObject: { [key: string]: string },
    sourcePath: string | undefined,
    file: string,
): Promise<SourceMapGenerator> {
    const rawSourceMap = RegExp(/\{"version".*\}/g).exec(rawInputString);

    if (rawSourceMap == null || rawSourceMap.length === 0) {
        throw new Error(
            "Could not find raw source map from css-loader. Please ensure css-loader is generating source-maps.",
        );
    }

    const generatedContentSplitByNewLine = rawInputString
        .match(/\[module.id, "[^"]*"/g)?.[0]
        .match(/".*"/g)?.[0]
        .split("\\n");
    if (generatedContentSplitByNewLine == null || generatedContentSplitByNewLine.length === 0) {
        throw new Error("Could not identify generated content from css modules.");
    }

    const originalSourceMap = await new SourceMapConsumer(JSON.parse(rawSourceMap[0]));
    const newSourceMap = new SourceMapGenerator({ file: `${file}.d.ts` });

    const getGeneratedLine = (exportLocalLine: number) => exportLocalLine * 2 + 3;

    const getOutOfDirectory =
        sourcePath
            ?.split("/")
            .slice(1)
            .map(() => "..") ?? [];
    const finalFilePath = path.join(...getOutOfDirectory, sourcePath ?? "", file);

    let alreadyCompletedLine = 0;
    Object.values(exportLocalsObject).forEach((value, exportLocalLine) => {
        generatedContentSplitByNewLine.slice(alreadyCompletedLine).forEach((content, line) => {
            if (RegExp(value).exec(content) == null) {
                return;
            }

            const originalLine = originalSourceMap.originalPositionFor({
                line: alreadyCompletedLine + line + 1,
                column: 0,
            });
            const generatedLine = getGeneratedLine(exportLocalLine);

            if (originalLine.line == null || originalLine.column == null) {
                return;
            }

            newSourceMap.addMapping({
                generated: { line: generatedLine, column: 1 },
                original: { line: originalLine.line, column: originalLine.column },
                source: finalFilePath,
                name: value,
            });

            alreadyCompletedLine = line + 1;
        });
    });

    return newSourceMap;
}
