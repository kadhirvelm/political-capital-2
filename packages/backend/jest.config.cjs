module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "@pc2/(.+)": "<rootDir>../$1/src",
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
