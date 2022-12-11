/**
 * Copyright (c) 2022 - KM
 */

export function getTypingsFile(exportLocalsObject: { [key: string]: string }) {
    const finalFile: string[] = [];

    finalFile.push("interface IValidClassnames {");
    Object.keys(exportLocalsObject).forEach((key) =>
        finalFile.push(`\t/** Shows up as ${exportLocalsObject[key]} */\n\t${key}: string;`),
    );
    finalFile.push("}\n");

    finalFile.push("declare const ValidClassnames: IValidClassnames;\n");
    finalFile.push("export = ValidClassnames");

    return `${finalFile.join("\n")}\n`;
}
