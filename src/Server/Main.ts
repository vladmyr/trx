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
import * as dgram from "dgram";

const RTPSession2 = require("krtp").RTPSession;

// const session2 = new RTPSession2(1383);
const socket = dgram.createSocket("udp4");

socket.on("listening", () => {
    const address = socket.address() as AddressInfo;
    console.log(`UPD socket is listening ${address.address}:${address.port}`)
})
socket.on("message", (msg: any) => {
  console.log(msg, msg.payload.toString("utf8"));
});

socket.bind(1383);

// setTimeout(() => {
//   session.close();
// }, 5000)