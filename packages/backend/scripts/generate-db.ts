/**
 * Copyright (c) 2022 - KM
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const TABLES = [
    "REPLACE_ME",
];
const PATH = "src/backendStack/database";

/**
 * Corrects for the commonjs import.
 */
(function generateDb() {
    execSync(
        `rm -rf src/backendStack/database && sequelize-auto -h localhost -d 'REPLACE_ME' -u admin -x admin -p 5432 --dialect postgres -o ${PATH} -l ts -t ${TABLES.join(
            " ",
        )}`,
    );

    TABLES.forEach((fileName) => {
        const fullFileName = join(process.cwd(), PATH, `${fileName}.ts`);
        const file = readFileSync(fullFileName).toString();

        const fileByLines = file.split("\n").slice(2);

        fileByLines.unshift("import Sequelize from 'sequelize';");

        const correctedImports = fileByLines.map((line) => {
            return line
                .replaceAll("Optional<", "Sequelize.Optional<")
                .replaceAll("Model<", "Sequelize.Model<")
                .replaceAll("DataTypes.", "Sequelize.DataTypes.");
        });

        writeFileSync(fullFileName, correctedImports.join("\n"));
    });
})();
