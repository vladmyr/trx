import { Writable } from "stream";
import AudioStreamManager from "../Common/AudioStreamManager";

const audioStreamManager = AudioStreamManager.GetInstance();

// audioStreamManager.start(11, 8);
// setTimeout(() => {
//   audioStreamManager.stop()
// }, 5000);

// console.log(AudioStreamManager.GetDevices());

const RTPSession = require("krtp").RTPSession;

const session = new RTPSession(1373);

// session.on("message", (msg: any) => {
//   console.log(msg, msg.payload.toString("utf8"));
// });

const writable = new Writable({
  write(chunk, encoding, callback) {
    // session.send(chunk)
    session.send(Buffer.from(chunk), "pi.local")
      .catch((err: any) => console.trace(err))
    callback();
  }
})

// writable.on("pipe", () => console.log("pipe"))
// writable.on("unpipe", () => console.log("unpipe"))
// writable.on("finish", () => console.log("finish"))
// writable.on("error", () => console.log("error"))
// writable.on("drain", () => console.log("drain"))
// writable.on("close", () => console.log("close"))

const source = audioStreamManager.fromSource(11)
  
source.pipe(writable);
source.start();

// session.send(Buffer.from("Hello"), "192.168.0.241")
//   .catch((err: any) => console.trace(err))
// session.send(Buffer.from("world"), "192.168.0.241")
//   .catch((err: any) => console.trace(err))

// setTimeout(() => {
//   session.close();
// }, 5000)