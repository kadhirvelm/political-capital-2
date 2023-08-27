#! /usr/bin/env node

/* eslint-disable header/header */

/*
 * Copyright 2023 KM.
 */

import { program } from "commander";
import { convertFiles } from "./convertFiles.js";
import { generateTypeFiles } from "./generateTypeFiles.js";

program.name("pc2-cli").description("All the scripts for running PC2 file generation").version("1.0.0");

program
  .command("convert")
  .description("Convert the types into the static output file.")
  .option("--watch", "should watch the input files", false)
  .action((options: { watch: boolean }) => {
    convertFiles(options.watch);
  });

program
  .command("generate")
  .description("Generates SCSS type files")
  .option("--watch", "should watch all the scss module files", false)
  .action((options: { watch: boolean }) => {
    generateTypeFiles(options.watch);
  });

program.parse();
