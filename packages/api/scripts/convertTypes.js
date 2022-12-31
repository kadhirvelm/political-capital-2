/**
 * Copyright (c) 2022 - KM
 */

import { readFileSync, writeFileSync } from "fs";

function createImport(filteredToJustInterfaces) {
    const file = [];

    file.push("import {");

    filteredToJustInterfaces.forEach((str) => {
        const byNewLines = str.split("\n");

        const type =
            byNewLines
                .slice(-2)[0]
                .match(/\".*\"/g)?.[0]
                .toString()
                .slice(1, -1) ?? "";

        const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
        file.push(`\tI${typeWithCasing},`);
    });

    file.push('} from "./IStaffer";');
    file.push('import { IVisit } from "./IVisit";');
    file.push("");

    return file;
}

function createIAllStaffers(filteredToJustInterfaces) {
    const file = [];

    file.push(`export interface IAllStaffers {`);

    filteredToJustInterfaces.forEach((str) => {
        const byNewLines = str.split("\n");

        const type =
            byNewLines
                .slice(-2)[0]
                .match(/\".*\"/g)?.[0]
                .toString()
                .slice(1, -1) ?? "";

        const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
        file.push(`\t${type}: I${typeWithCasing};`);
    });

    file.push(`\tunknown: never;`);
    file.push(`}`);
    file.push("");

    return file;
}

function createDefaultStaffers(filteredToJustInterfaces) {
    const file = [];

    file.push('export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {');

    filteredToJustInterfaces.forEach((str) => {
        const byNewLines = str.split("\n");

        const type =
            byNewLines
                .slice(-2)[0]
                .match(/\".*\"/g)?.[0]
                .toString()
                .slice(1, -1) ?? "";

        const partsByCasing = type
            .match(/[A-Z]?[a-z]+/g)
            .map((string, index) =>
                index === 0 ? `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}` : string.toLowerCase(),
            )
            .join(" ");

        file.push(`\t${type}: {`);
        file.push(`\t\tdisplayName: \"${partsByCasing}\",`);
        byNewLines.slice(1, -1).forEach((line) => {
            file.push(`\t${line.slice(0, -1)},`);
        });
        file.push(`\t},`);
    });
    file.push("};");

    file.push("");

    return file;
}

function createStafferNamespace(filteredToJustInterfaces) {
    const file = [];

    file.push("export namespace IStaffer {");
    const VISITOR = [];

    filteredToJustInterfaces.forEach((str) => {
        const byNewLines = str.split("\n");

        const type =
            byNewLines
                .slice(-2)[0]
                .match(/\".*\"/g)?.[0]
                .toString()
                .slice(1, -1) ?? "";

        const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;

        file.push(
            `\texport const is${typeWithCasing} = (staffer: IPossibleStaffer): staffer is I${typeWithCasing} => {`,
        );
        file.push(`\t\treturn staffer.type === \"${type}\";`);
        file.push("\t};\n");

        VISITOR.push(`\t\tif (is${typeWithCasing}(value)) {`);
        VISITOR.push(`\t\t\treturn visitor.${type}(value);`);
        VISITOR.push(`\t\t}\n`);
    });

    file.push(
        `\texport const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {`,
    );
    file.push(...VISITOR);
    file.push(`\t\treturn visitor.unknown(value);`);
    file.push(`\t};`);

    file.push("}");
    file.push("");

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
    FINAL_FILE.push(...createIAllStaffers(filteredToJustInterfaces));
    FINAL_FILE.push("export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];");
    FINAL_FILE.push("");
    FINAL_FILE.push(...createDefaultStaffers(filteredToJustInterfaces));
    FINAL_FILE.push(...createStafferNamespace(filteredToJustInterfaces));

    writeFileSync("./src/types/generatedStaffers.ts", FINAL_FILE.join("\n"));
}

convertTypes();
