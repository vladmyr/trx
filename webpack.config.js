// @ts-check

const Path = require("path");

const configCommon = {
    mode: "production",
    target: "node",
    devtool: "source-map",
    output: {
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            include: [
                Path.resolve(__dirname, "src", "Common")
            ],
            exclude: [
                Path.resolve(__dirname, "node_modules")
            ]
        }]
    }
}

const configClient = {
    entry: "./src/Client/Main.ts",
    output: {
        path: Path.resolve(__dirname, "build", "release", "client")
    }
}

const configServer = {
    entry: "./src/Server/Main.ts",
    output: {
        path: Path.resolve(__dirname, "build", "release", "server")
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
    
    return config;
}

module.exports = [
    // configServer,
    configClient
].map(buildEntryConfig)