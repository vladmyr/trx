// import { Readable } from "stream";
// import { readFileSync, createReadStream } from "fs";

// const Speaker = require("speaker");

// const source = createReadStream("./rawAudio.raw");

// const speaker = new Speaker({
//     channels: 2,
//     bitDepth: 16,
//     sampleRate: 48000
// });

// source.pipe(speaker);

import { AddressInfo } from "net";

import * as PortAudio from "naudiodon";

const RTPSession2 = require("krtp").RTPSession;

const session2 = new RTPSession2(1373);

session2.on("listening", () => {
    const address = session2.address() as AddressInfo;
    console.log(`UPD socket is listening ${address.address}:${address.port}`)
})
session2.on("message", (msg: any) => {
  console.log(msg);
});

// setTimeout(() => {
//   session.close();
// }, 5000)