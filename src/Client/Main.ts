// import AudioStreamManager from "./AudioStreamManager";

// const audioStreamManager = AudioStreamManager.GetInstance();

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

// session.sendSR("127.0.0.2").catch((err: any) => {
//   console.error(err);
// });
session.send(Buffer.from("Hello"), "pi.local")
  .catch((err: any) => console.trace(err))
session.send(Buffer.from("world"), "pi.local")
  .catch((err: any) => console.trace(err))

setTimeout(() => {
  session.close();
}, 5000)