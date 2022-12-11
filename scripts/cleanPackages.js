/* eslint-disable no-console */

const { execSync } = require("child_process");

function cleanPackage(packageName, namespace) {
    if (namespace === undefined) {
        execSync(
            `cd packages/${packageName} && (rm -r dist || true) && (rm -r node_modules || true) && (rm -r compiled_types || true)`,
            { stdio: "ignore" },
        );
        console.log(`\t\x1b[37mCleaned ${packageName}\x1b[0m`);
    } else {
        execSync(
            `cd packages/${namespace}/${packageName} && (rm -r dist || true) && (rm -r node_modules || true) && (rm -r compiled_types || true)`,
            { stdio: "ignore" },
        );
        console.log(`\t\x1b[37mCleaned ${packageName} in namespace ${namespace}\x1b[0m`);
    }
}

function getPackageNames(namespace) {
    const rawPackageNames =
        namespace === undefined ? execSync("cd packages && ls") : execSync(`cd packages/${namespace} && ls`);
    return rawPackageNames
        .toString()
        .split("\n")
        .filter(packageName => packageName !== "");
}

getPackageNames().forEach(packageName => cleanPackage(packageName));
