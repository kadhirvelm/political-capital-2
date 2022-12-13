// eslint-disable-next-line import/no-extraneous-dependencies
const { adjustStyleLoaders, override, addWebpackExternals, addWebpackModuleRule } = require("customize-cra");

function addPolyfillFallbacks(config) {
    const { resolve } = config;
    resolve.fallback = {
        ...(config.resolve.fallback ?? {}),
        crypto: false,
    };

    return config;
}

const SAMPLE_SCSS_FILE_NAME = "test.module.scss";

// https://github.com/arackaf/customize-cra/issues/44
function addEnvVariablesToDefinePlugin(config) {
    const definePlugin = config.plugins.find((plugin) => plugin.constructor.name === "DefinePlugin");
    if (definePlugin === undefined) {
        throw new Error("Cannot define environment variables");
    }

    const existingProcessEnvironment = definePlugin.definitions["process.env"] ?? {};
    definePlugin.definitions["process.env"] = {
        ...existingProcessEnvironment,
        ORIGIN: JSON.stringify(process.env.ORIGIN),
        PORT: JSON.stringify(process.env.PORT),
    };

    return config;
}

const noop = (config) => config;

module.exports = override(
    addPolyfillFallbacks,
    adjustStyleLoaders((loader) => {
        if (SAMPLE_SCSS_FILE_NAME.match(loader.test)?.[0] !== ".module.scss") {
            return;
        }

        loader.use.splice(1, 0, {
            loader: require.resolve("@pc2/scss-modules"),
        });
    }),
    addEnvVariablesToDefinePlugin,
    addWebpackModuleRule({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        },
    }),
    ...(process.env.NODE_ENV === "production"
        ? [
              addWebpackExternals({
                  react: "React",
                  "react-dom": "ReactDOM",
              }),
          ]
        : [noop]),
);
