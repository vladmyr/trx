import AudioStreamManager from "../Common/AudioStreamManager";
import RTPSession from "../Common/Network/RTPSession";
import RTPWritable from "../Common/Network/RTPWritable";

const audioStreamManager = AudioStreamManager.GetInstance();

const session = new RTPSession(1373, "pi.local");

const audioReadableStream: any = audioStreamManager.getSourceInput(21);
const rtpWritable = new RTPWritable(session);

audioReadableStream.pipe(rtpWritable);
audioReadableStream.start();
