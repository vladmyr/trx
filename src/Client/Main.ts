import * as Fs from "fs";

import AudioStreamManager from "../Common/AudioStreamManager";
import RTPSession from "../Common/Network/RTPSession";
import RTPWritable from "../Common/Network/RTPWritable";

const audioStreamManager = AudioStreamManager.GetInstance();

const session = new RTPSession(1373);

const audioReadableStream: any = audioStreamManager.getSourceInput(21);
// const fsWritableStream = Fs.createWriteStream("../../Temp/clientRecord.raw");
const rtpWritable = new RTPWritable(session);

// rtpWritable.on("close", () => console.log("close"));
// rtpWritable.on("drain", () => console.log("drain"));
// rtpWritable.on("error", (e) => console.log("error", e));
// rtpWritable.on("finish", () => console.log("finish"));
// rtpWritable.on("pipe", () => console.log("pipe"));
// rtpWritable.on("unpipe", () => console.log("unpipe"));

// audioReadableStream.on("close", () => console.log("close"))
// audioReadableStream.on("data", () => console.log("data"))
// audioReadableStream.on("end", () => console.log("end"))
// audioReadableStream.on("error", () => console.log("error"))
// audioReadableStream.on("readable", () => console.log("readable"))

audioReadableStream.pipe(rtpWritable);
audioReadableStream.start();
