/*
 * Copyright 2023 KM.
 */

import { glob } from "glob";
import { ensureDirSync, emptyDirSync } from "fs-extra";
import { watch } from "chokidar";
import { generateOutputTypeFile } from "./generateOutputTypeFile.js";

const OUTPUT_DIRECTORY = "css_types";
const SCSS_GLOB_PATTERN = "**/*.module.scss";

const getCurrentScssModuleFiles = () => glob(SCSS_GLOB_PATTERN);

const prepareOutput = () => {
  ensureDirSync(OUTPUT_DIRECTORY);
  emptyDirSync(OUTPUT_DIRECTORY);
};

export async function generateTypeFiles(shouldWatch: boolean) {
  prepareOutput();

  const relativePathToModuleFiles = await getCurrentScssModuleFiles();
  for (const relativePath of relativePathToModuleFiles) {
    generateOutputTypeFile(OUTPUT_DIRECTORY, relativePath);
  }

  if (!shouldWatch) {
    return;
  }

  watch(SCSS_GLOB_PATTERN).on("change", (path) => {
    generateOutputTypeFile(OUTPUT_DIRECTORY, path);
  });
}
