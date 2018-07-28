// @ts-check

const Path = require("path");

const configCommon = {
    mode: "development",
    target: "node",
    devtool: "source-map",
    output: {
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader",
            exclude: [
                Path.resolve(__dirname, "node_modules")
            ]
        }]
    }
}

const configCLI = {
    entry: "./src/CLI/Main.ts",
    output: {
        path: Path.resolve(__dirname, "dist", "cli")
    }
}

const configClient = {}

const configServer = {
    entry: "./src/Server/Main.ts",
    output: {
        path: Path.resolve(__dirname, "dist", "server")
    }
}

const deepClone = (source, target = {}) => {
    const clone = target;

    for (const key in source) {
        if (Array.isArray(source[key])) {
            clone[key] = [].concat(source[key]);
        } else if (source[key] != null && typeof source[key] == "object") {
            clone[key] = deepClone(source[key]);
        } else {
            clone[key] = source[key];
        }
    }

    return clone;
}

const buildEntryConfig = (entryConfig) => {
    const config = {} 
    
    deepClone(configCommon, config);
    deepClone(entryConfig, config);
    
    console.log(config);

    return config;
}

module.exports = [
    configServer
].map(buildEntryConfig)