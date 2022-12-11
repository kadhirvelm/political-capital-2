#!/usr/bin/env node

/* eslint-disable no-console */

const { execSync } = require("child_process");

function testBasicCleanLock() {
    const deduplicateDiff = execSync("npx yarn-deduplicate --list yarn.lock").toString();
    const yarnDiff = execSync("git diff yarn.lock").toString();

    if (yarnDiff === "" && deduplicateDiff === "") {
        return;
    }

    console.log(
        "The lockfile has changed, please run 'yarn' in the root folder, then 'yarn clean:lock' and commit the changes.",
    );
    throw new Error("The lockfile is not clean.");
}

function main() {
    try {
        testBasicCleanLock();
        process.exit(0);
    } catch {
        process.exit(1);
    }
}

main();
