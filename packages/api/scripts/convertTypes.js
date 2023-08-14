/*
 * Copyright 2023 KM.
 */

import { readFileSync, writeFileSync } from "node:fs";

function createImport(filteredToJustInterfaces) {
  const file = [];

  file.push("import {");

  for (const string_ of filteredToJustInterfaces) {
        const byNewLines = string_.split("\n");

    const type =
      byNewLines
        .at(-2)
        .match(/".*"/g)?.[0]
        .toString()
        .slice(1, -1) ?? "";

    const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
    file.push(`\tI${typeWithCasing},`);
  }

  file.push('} from "./IStaffer";', 'import { IVisit } from "./IVisit";', "");

  return file;
}

function createIAllStaffers(filteredToJustInterfaces) {
  const file = [];

  file.push(`export interface IAllStaffers {`);

  for (const string_ of filteredToJustInterfaces) {
        const byNewLines = string_.split("\n");

    const type =
      byNewLines
        .at(-2)
        .match(/".*"/g)?.[0]
        .toString()
        .slice(1, -1) ?? "";

    const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
    file.push(`\t${type}: I${typeWithCasing};`);
  }

  file.push(`\tunknown: never;`, `}`, "");

  return file;
}

function createDefaultStaffers(filteredToJustInterfaces) {
  const file = [];

  file.push('export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {');

  for (const string_ of filteredToJustInterfaces) {
        const byNewLines = string_.split("\n");

    const type =
      byNewLines
        .at(-2)
        .match(/".*"/g)?.[0]
        .toString()
        .slice(1, -1) ?? "";

    const partsByCasing = type
      .match(/[A-Z]?[a-z]+/g)
      .map((string, index) =>
        index === 0 ? `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}` : string.toLowerCase(),
      )
      .join(" ");

    file.push(`\t${type}: {`, `\t\tdisplayName: \"${partsByCasing}\",`);
    for (const line of byNewLines.slice(1, -1)) {
            file.push(`\t${line.slice(0, -1)},`);
        }
    file.push(`\t},`);
  }
  file.push("};", "");

  return file;
}

function createStafferNamespace(filteredToJustInterfaces) {
  const file = [];

  file.push("export namespace IStaffer {");
  const VISITOR = [];

  for (const string_ of filteredToJustInterfaces) {
        const byNewLines = string_.split("\n");

    const type =
      byNewLines
        .at(-2)
        .match(/".*"/g)?.[0]
        .toString()
        .slice(1, -1) ?? "";

    const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;

    file.push(`\texport const is${typeWithCasing} = (staffer: IPossibleStaffer): staffer is I${typeWithCasing} => {`);
    file.push(`\t\treturn staffer.type === \"${type}\";`, "\t};\n");

    VISITOR.push(`\t\tif (is${typeWithCasing}(value)) {`, `\t\t\treturn visitor.${type}(value);`);
    VISITOR.push(`\t\t}\n`);
  }

  file.push(
    `\texport const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {`,
    ...VISITOR,
  , `\t\treturn visitor.unknown(value);`, `\t};`);

  file.push("}", "");

  return file;
}

export function convertTypes() {
  const rawTypes = readFileSync("./src/types/IStaffer.ts").toString();

  const allSplit = rawTypes.split(/(export.*{(.|\s)*?})/g);
  const filteredToJustInterfaces = allSplit.filter((s) => s.includes("interface") && s.includes("extends"));

  const FINAL_FILE = [
    "/**",
    " * Copyright (c) 2022 - KM",
    "*/",
    "",
    "// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.",
    "",
  ];

  FINAL_FILE.push(...createImport(filteredToJustInterfaces));
  FINAL_FILE.push(
    ...createIAllStaffers(filteredToJustInterfaces),
    "export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];",
  , "");
  FINAL_FILE.push(...createDefaultStaffers(filteredToJustInterfaces));
  FINAL_FILE.push(...createStafferNamespace(filteredToJustInterfaces));

  writeFileSync("./src/types/generatedStaffers.ts", FINAL_FILE.join("\n"));
}

convertTypes();
