#!/usr/bin/env node

const { writeFileSync, readFileSync, readdirSync } = require("fs");
const { join } = require("path");
const semver = require("semver");

const rootPackageJsonPath = join(process.cwd(), "./package.json");

const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath));
const nextSemverMinorVersion = semver.inc(rootPackageJson.version, "minor");

const packageJsonPaths = readdirSync(join(process.cwd(), "packages")).map((packageName) =>
    join(process.cwd(), "packages", packageName, "package.json"),
);

const packageJsons = [...packageJsonPaths, rootPackageJsonPath].map((packageJsonPath) => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath));
    return {
        path: packageJsonPath,
        packageJson,
    };
});

const packageNames = packageJsons.map(({ packageJson }) => packageJson.name);

packageJsons.forEach((packageJsonWithPath) => {
    const { path, packageJson } = packageJsonWithPath;

    packageJson.version = nextSemverMinorVersion;
    packageNames.forEach((packageName) => {
        if (packageJson.dependencies[packageName] !== undefined) {
            packageJson.dependencies[packageName] = nextSemverMinorVersion;
        }

        if (packageJson.devDependencies[packageName] !== undefined) {
            packageJson.devDependencies[packageName] = nextSemverMinorVersion;
        }
    });

    writeFileSync(path, JSON.stringify(packageJson, null, 4));
});
