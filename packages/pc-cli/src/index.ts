#! /usr/bin/env node

/* eslint-disable header/header */

/*
 * Copyright 2023 KM.
 */

import { program } from "commander";
import { convertFiles } from "./convertFiles.js";

program
  .command("convert")
  .description("Convert the types into the static output file.")
  .option("--watch", "should watch the input files", false)
  .action((options: { watch: boolean }) => {
    convertFiles(options.watch);
  });

program.parse();
