/*
 * Copyright 2023 KM.
 */

import { ensureDirSync } from "fs-extra";
import { readFileSync, writeFileSync } from "node:fs";
import { type ParsedPath, join, parse } from "node:path";
import { SourceMapGenerator } from "source-map";

const getClassNamesAndOriginal = (allLinesInFile: string[]) => {
  const classNamesAndLineNumbers: Array<{ className: string; original: number }> = [];

  for (const [lineNumber, line] of allLinesInFile.entries()) {
    const maybeClassName = line.match(/\.(?<className>\S+) {/);
    if (maybeClassName === null) {
      continue;
    }

    // Source maps are not 0 indexed, so we add 1 to the lineNumber here
    classNamesAndLineNumbers.push({ className: maybeClassName.groups?.className ?? "", original: lineNumber + 1 });
  }

  return classNamesAndLineNumbers;
};

const generateOutputFile = (
  fileName: string,
  classNamesAndLineNumbers: Array<{ className: string; original: number }>,
) => {
  const outputFile: string[] = [];
  const mappingBetweenOriginalAndNew: Array<{ new: number; original: number }> = [];

  const withoutModule = parse(fileName).name;

  outputFile.push("/*", " * Copyright 2023 KM.", " */\n", "interface IValidClassnames {");
  for (const { className, original } of classNamesAndLineNumbers) {
    outputFile.push(`  /** Shows up as ${withoutModule}_${className}_HASH */`, `  ${className}: string;`);
    mappingBetweenOriginalAndNew.push({ new: outputFile.length + 1, original });
  }
  outputFile.push(
    "}",
    "\ndeclare const ValidClassnames: IValidClassnames;",
    "export = ValidClassnames;\n",
    `//# sourceMappingURL=${fileName}.scss.d.ts.map\n`,
  );

  return { mappingBetweenOriginalAndNew, outputFile };
};

const createSourceMapFile = (
  parsedPath: ParsedPath,
  mappingBetweenOldAndNew: Array<{ new: number; original: number }>,
) => {
  const outputSourceMap = new SourceMapGenerator({
    file: `${parsedPath.base}.d.ts`,
  });

  const backToRoot = `${parsedPath.dir}/`.split("/").map(() => "../");
  const relativeOriginalSourcePath = join(...backToRoot, parsedPath.dir, parsedPath.base);

  for (const mapping of mappingBetweenOldAndNew) {
    outputSourceMap.addMapping({
      generated: {
        column: 3,
        line: mapping.new,
      },
      original: {
        column: 1,
        line: mapping.original,
      },
      source: relativeOriginalSourcePath,
    });
  }

  return outputSourceMap.toString();
};

export function generateOutputTypeFile(outputDirectory: string, relativePathToFile: string) {
  const parsedPath = parse(relativePathToFile);

  const file = readFileSync(relativePathToFile).toString().split("\n");

  const classNamesAndLineNumbers = getClassNamesAndOriginal(file);
  const { outputFile, mappingBetweenOriginalAndNew } = generateOutputFile(parsedPath.name, classNamesAndLineNumbers);

  const sourceMap = createSourceMapFile(parsedPath, mappingBetweenOriginalAndNew);

  const finalOutputDirectory = join(outputDirectory, parsedPath.dir);
  ensureDirSync(finalOutputDirectory);

  writeFileSync(join(finalOutputDirectory, `${parsedPath.base}.d.ts`), outputFile.join("\n"));
  writeFileSync(join(finalOutputDirectory, `${parsedPath.base}.d.ts.map`), sourceMap);
}
