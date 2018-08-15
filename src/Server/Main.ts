import RTPSession from "../Common/Network/RTPSession";
import RTPReadable from "../Common/Network/RTPReadable2";

const Speaker = require("speaker");

const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000
});

const session = new RTPSession(1373);
const rtpReadable = new RTPReadable(session);

session.getSocket().on("close", () => console.log("close"));
session.getSocket().on("listening", () => console.log("listening"));
session.getSocket().on("error", () => console.log("error"));
session.on("message", (msg) => {
  console.log("[RTPSession]", msg);
});

// source.pipe(speaker);

// import { AddressInfo } from "net";

// import * as PortAudio from "naudiodon";

// const RTPSession2 = require("krtp").RTPSession;

// const session2 = new RTPSession2(1373);

// session2.on("listening", () => {
//     const address = session2.address() as AddressInfo;
//     console.log(`UPD socket is listening ${address.address}:${address.port}`)
// })
// session2.on("message", (msg: any) => {
//   console.log(msg.sequenceNumber, msg.timestamp, msg.payload.byteLength);
// });

// session2.send(Buffer.from("A"))
// session2.send(Buffer.from("AB"))
// session2.send(Buffer.from("ABC"))
// session2.send(Buffer.from("ABCD"))
// session2.send(Buffer.from("ABCDE"))
