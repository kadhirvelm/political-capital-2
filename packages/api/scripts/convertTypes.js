/**
 * Copyright (c) 2022 - KM
 */

import { readFileSync, writeFileSync } from "fs";

export function convertTypes() {
    const rawTypes = readFileSync("./src/types/IStaffer.ts").toString();

    const allSplit = rawTypes.split(/(export.*{(.|\s)*?})/g);
    const filteredToJustInterfaces = allSplit.filter((s) => s.includes("interface") && s.includes("extends"));

    const FINAL_FILE = ["/**", " * Copyright (c) 2022 - KM", "*/", ""];

    FINAL_FILE.push(`export interface IAllStaffers {`);

    filteredToJustInterfaces.forEach((str) => {
        const byNewLines = str.split("\n");

        const type =
            byNewLines
                .slice(-2)[0]
                .match(/\".*\"/g)?.[0]
                .toString()
                .slice(1, -1) ?? "";

        const typeWithCasing = `${type[0].toUpperCase()}${type.slice(1)}`;
        FINAL_FILE.push(`\t${type}: I${typeWithCasing};`);
    });

    FINAL_FILE.push(`\tunknown: never;`);
    FINAL_FILE.push(`}`);
    FINAL_FILE.push("");

    FINAL_FILE.push(`export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];`);
    FINAL_FILE.push("");

    FINAL_FILE.push('export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {');

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

        FINAL_FILE.push(`\t${type}: {`);
        FINAL_FILE.push(`\t\tdisplayName: \"${partsByCasing}\",`);
        byNewLines.slice(1, -1).forEach((line) => {
            FINAL_FILE.push(`\t${line.slice(0, -1)},`);
        });
        FINAL_FILE.push(`\t},`);
    });
    FINAL_FILE.push("};");

    FINAL_FILE.push("");

    FINAL_FILE.push("export namespace IStaffer {");
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

        FINAL_FILE.push(
            `\texport const is${typeWithCasing} = (staffer: IPossibleStaffer): staffer is I${typeWithCasing} => {`,
        );
        FINAL_FILE.push(`\t\treturn staffer.type === \"${type}\";`);
        FINAL_FILE.push("\t};\n");

        VISITOR.push(`\t\tif (is${typeWithCasing}(value)) {`);
        VISITOR.push(`\t\t\treturn visitor.${type}(value);`);
        VISITOR.push(`\t\t}\n`);
    });

    FINAL_FILE.push(
        `\texport const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {`,
    );
    FINAL_FILE.push(...VISITOR);
    FINAL_FILE.push(`\t\treturn visitor.unknown(value);`);
    FINAL_FILE.push(`\t};`);

    FINAL_FILE.push("}");

    writeFileSync("./src/types/generatedStaffers.ts", FINAL_FILE.join("\n"));
}

convertTypes();
