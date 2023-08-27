/*
 * Copyright 2023 KM.
 */

import { ensureDirSync } from "fs-extra";
import { readFileSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";

const extractClassName = (className: string) => className.slice(1, -2);

const getClassNamesAndLineNumbers = (allLinesInFile: string[]) => {
  const classNamesAndLineNumbers: Array<{ className: string; lineNumber: number }> = [];

  for (const [index, line] of allLinesInFile.entries()) {
    const maybeClassName = line.match(/\.\S+ {/);
    if (maybeClassName === null) {
      continue;
    }

    classNamesAndLineNumbers.push({ className: extractClassName(maybeClassName[0]), lineNumber: index });
  }

  return classNamesAndLineNumbers;
};

const generateOutputFile = (
  fileName: string,
  classNamesAndLineNumbers: Array<{ className: string; lineNumber: number }>,
) => {
  const outputFile: string[] = [];

  outputFile.push("/*", " * Copyright 2023 KM.", " */\n", "interface IValidClassnames {");
  for (const { className } of classNamesAndLineNumbers) {
    outputFile.push(`  /** Shows up as ${fileName}_${className}_HASH */`, `  ${className}: string;`);
  }
  outputFile.push("}", "\ndeclare const ValidClassnames: IValidClassnames;", "export = ValidClassnames;\n");

  return outputFile;
};

export function generateOutputTypeFile(outputDirectory: string, relativePathToFile: string) {
  const parsedPath = parse(relativePathToFile);
  const file = readFileSync(relativePathToFile).toString().split("\n");

  const classNamesAndLineNumbers = getClassNamesAndLineNumbers(file);
  const outputFile = generateOutputFile(parsedPath.name, classNamesAndLineNumbers);

  const finalOutputDirectory = join(outputDirectory, parsedPath.dir);
  ensureDirSync(finalOutputDirectory);
  writeFileSync(join(finalOutputDirectory, `${parsedPath.name}.d.ts`), outputFile.join("\n"));
}
