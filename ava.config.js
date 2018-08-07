export default {
    compilerEnchancements: false,
    extensions: ["ts"],
    require: [
        "ts-node/register"
    ],
    files: [
        "./test/**/*.test.ts"
    ],
    sources: [
        "./src/**/*.ts"
    ]
}