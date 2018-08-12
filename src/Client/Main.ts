import { Writable } from "stream";
import AudioStreamManager from "../Common/AudioStreamManager";

const audioStreamManager = AudioStreamManager.GetInstance();

const RTPSession = require("krtp").RTPSession;
const session = new RTPSession(1373);

session.on("message", (msg: any) => {
  console.log(msg, msg.payload.toString("utf8"));
});

session.send(Buffer.from("Hello"))
  .catch((err: any) => console.trace(err))
session.send(Buffer.from("world"))
  .catch((err: any) => console.trace(err))

setTimeout(() => {
  session.close();
}, 5000)