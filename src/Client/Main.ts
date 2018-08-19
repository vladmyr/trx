import * as Fs from "fs";

import AudioStreamManager from "../Common/AudioStreamManager";
import { TCPClient } from "../Common/Network/TCPTransport";

const audioStreamManager = AudioStreamManager.GetInstance();

const tcpClient = new TCPClient(1373, "pi.local");
tcpClient.connect();

const audioReadableStream: any = audioStreamManager.getSourceInput(21);

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

audioReadableStream.pipe(tcpClient.getSocket());
audioReadableStream.start();
