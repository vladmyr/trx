import { Readable } from "stream";
import { readFileSync, createReadStream } from "fs";

const Speaker = require("speaker");

const source = createReadStream("./rawAudio.raw");

const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000
});

source.pipe(speaker);