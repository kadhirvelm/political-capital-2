/**
 * Copyright (c) 2022 - KM
 */

// import { execSync } from "child_process";

export function initDB() {
    process.env.TEST_DATABASE = "political-capital-two-test";
    process.env.NODE_ENV = "test";

    // execSync(`NODE_ENV=test cd ../backend && yarn migrate`);
}

export function teardownDB() {
    process.env.TEST_DATABASE = undefined;
    process.env.NODE_ENV = "development";
}
