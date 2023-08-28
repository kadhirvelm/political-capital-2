/*
 * Copyright 2023 KM.
 */

import chalk from "chalk";
import { watch } from "chokidar";
import { readFileSync, writeFileSync } from "node:fs";

const getTypeFromInterface = (byNewLines: string[]): string =>
  byNewLines
    .find((line) => line.match(/type: ".*"/g))
    ?.match(/".*"/g)?.[0]
    .toString()
    .slice(1, -1) ?? "";

function createImport(filteredToJustInterfaces: string[]) {
  const file = [];

  file.push("import {");

  const temporaryAdditions = [];

  for (const string_ of filteredToJustInterfaces) {
    const byNewLines = string_.split("\n");

    const type = getTypeFromInterface(byNewLines);

    const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
    temporaryAdditions.push(`  type I${typeWithCasing},`);
  }

  file.push(
    ...temporaryAdditions.sort(),
    '} from "./Staffer";',
    'import { type GenericType, type VisitorPattern } from "./visit";',
    "",
  );

  return file;
}

function createIAllStaffers(filteredToJustInterfaces: string[]) {
  const file = [];

  file.push(`export interface IAllStaffers {`);

  const temporaryAdditions = [];

  for (const string_ of filteredToJustInterfaces) {
    const byNewLines = string_.split("\n");

    const type = getTypeFromInterface(byNewLines);

    const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
    temporaryAdditions.push(`  ${type}: I${typeWithCasing};`);
  }

  file.push(...temporaryAdditions.sort(), `}`, "");

  return file;
}

function createDefaultStaffers(filteredToJustInterfaces: string[]) {
  const file = [];

  file.push('export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {');

  const stafferAdditions: { [type: string]: { [key: string]: string } } = {};

  for (const string_ of filteredToJustInterfaces) {
    const byNewLines = string_.split("\n");

    const type = getTypeFromInterface(byNewLines);

    const partsByCasing = type
      .match(/[A-Z]?[a-z]+/g)
      ?.map((string, index) =>
        index === 0 ? `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}` : string.toLowerCase(),
      )
      .join(" ");

    const displayName = `  displayName: "${partsByCasing}"`;

    stafferAdditions[type] = {
      [displayName]: displayName,
    };

    for (const line of byNewLines.slice(1, -1)) {
      stafferAdditions[type][line.slice(0, -1)] = line;
    }
  }

  for (const stafferKey of Object.keys(stafferAdditions).sort()) {
    const sortedKeys = Object.keys(stafferAdditions[stafferKey]).sort();

    file.push(`  ${stafferKey}: {`, ...sortedKeys.map((key) => `  ${key},`), `  },`);
  }

  file.push("};", "");

  return file;
}

function createStafferNamespace(filteredToJustInterfaces: string[]) {
  const file = [];

  file.push("export const Staffer: VisitorPattern<IAllStaffers> = {", "  typeChecks: {");

  const typeChecks: { [type: string]: string[] } = {};

  for (const string_ of filteredToJustInterfaces) {
    const byNewLines = string_.split("\n");

    const type = getTypeFromInterface(byNewLines);

    const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;

    typeChecks[type] = [
      `    ${type}: (staffer: IPossibleStaffer): staffer is I${typeWithCasing} => {`,
      `      return staffer.type === "${type}";`,
      "    },",
    ];
  }

  const sortedKeys = Object.keys(typeChecks).sort();
  for (const key of sortedKeys) {
    file.push(...typeChecks[key]);
  }

  const visitor = sortedKeys.map((key) => {
    return `    if (Staffer.typeChecks.${key}(value)) {
      return visitor.${key}(value);
    }`;
  });

  file.push(
    `  },`,
    `  // eslint-disable-next-line sonarjs/cognitive-complexity`,
    `  visit: (value, visitor) => {`,
    ...visitor,
    `    return visitor.unknown(value);`,
    `  },`,
    "};",
    "",
  );

  return file;
}

function performConvertFile() {
  const startPerformance = performance.now();
  console.log(chalk.yellow("Pulling information from Staffer.ts"));

  const rawTypes = readFileSync("./src/types/Staffer.ts").toString();

  const allSplit = rawTypes.split(/(export.*{(.|\s)*?})/g);
  const filteredToJustInterfaces = allSplit.filter((s) => s.includes("interface") && s.includes("extends"));

  console.log(chalk.yellow("Generating output file"));

  const FINAL_FILE = [
    "/*",
    " * Copyright 2023 KM.",
    " */",
    "",
    "// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.",
    "",
  ];

  FINAL_FILE.push(
    ...createImport(filteredToJustInterfaces),
    ...createIAllStaffers(filteredToJustInterfaces),
    "export type IPossibleStaffer = GenericType<IAllStaffers>;",
    "",
    ...createDefaultStaffers(filteredToJustInterfaces),
    ...createStafferNamespace(filteredToJustInterfaces),
  );

  console.log(chalk.yellow("Writing output file to generatedStaffers.ts"));

  writeFileSync("./src/types/generatedStaffers.ts", FINAL_FILE.join("\n"));

  console.log(chalk.green(`All done. Took ${Math.round((performance.now() - startPerformance) * 10) / 10}ms`));
}

export function convertFiles(shouldWatch: boolean) {
  performConvertFile();

  if (!shouldWatch) {
    return;
  }

  console.log(chalk.blue("Watching Staffer.ts for changes..."));

  watch("./src/types/Staffer.ts").on("change", () => {
    console.log(chalk.blue("Changes detected to Staffer.ts, triggering regeneration"));
    performConvertFile();
  });
}
