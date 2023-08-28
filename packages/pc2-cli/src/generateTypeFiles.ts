/*
 * Copyright 2023 KM.
 */

import { glob } from "glob";
import { ensureDirSync, emptyDirSync } from "fs-extra";
import { watch } from "chokidar";
import { generateOutputTypeFile } from "./generateOutputTypeFile.js";
import chalk from "chalk";

const OUTPUT_DIRECTORY = "css_types";
const SCSS_GLOB_PATTERN = "**/*.module.scss";

const getCurrentScssModuleFiles = () => glob(SCSS_GLOB_PATTERN);

const prepareOutput = () => {
  ensureDirSync(OUTPUT_DIRECTORY);
  emptyDirSync(OUTPUT_DIRECTORY);
};

export async function generateTypeFiles(shouldWatch: boolean) {
  const startPerformance = performance.now();
  console.log(chalk.yellow("Preparing output directory"));
  prepareOutput();

  console.log(chalk.yellow("Gathering all SCSS modules files"));
  const relativePathToModuleFiles = await getCurrentScssModuleFiles();
  for (const relativePath of relativePathToModuleFiles) {
    generateOutputTypeFile(OUTPUT_DIRECTORY, relativePath);
    console.log(chalk.green("Generated file ", relativePath));
  }

  console.log(chalk.blue("Completed in ", Math.round((performance.now() - startPerformance) * 10) / 10, " ms"));

  if (!shouldWatch) {
    return;
  }

  watch(SCSS_GLOB_PATTERN).on("change", (path) => {
    console.log(chalk.yellow("Identified changed SCSS modules path ", path));
    generateOutputTypeFile(OUTPUT_DIRECTORY, path);
    console.log(chalk.green("Finished regenerating type file"));
  });
}
