import test from "ava";

import * as Path from "path";
import * as Fs from "fs";
import { Readable, Writable } from "stream";

import RTPSession from "../../../src/Common/Network/RTPSession";
import RTPWritable from "../../../src/Common/Network/RTPWritable";
import RTPReadable from "../../../src/Common/Network/RTPReadable2";

const PORT = 1373;
const CONSUMPTION_SPEED = 16 * 48000 * 2 / 1000 / 8    // bytes per ms

class RTPWritableTest extends RTPWritable {
}

class RTPReadableTest extends RTPReadable {
}

test.only("[RTPWritable] Read source from file and pipe it to network", async (t) => {
    return new Promise((resolve) => {
        const rtpSession = new RTPSession(PORT);

        const audioFilepath = Path.resolve(__dirname, "../../Assets/audio.raw");
        const audioFile = Fs.readFileSync(audioFilepath);
        const audioReadStream = Fs.createReadStream(audioFilepath);

        const destinationBuffer = Buffer.allocUnsafe(audioFile.byteLength);

        let count = 0;
        let transferByteLength = 0;
        const writable = new Writable({
            write(chunk: Buffer, _: string, callback: Function) {
                console.log(chunk.byteLength, chunk);

                chunk.copy(destinationBuffer, transferByteLength);

                count++;
                transferByteLength += chunk.byteLength;

                callback();

                if (count === 10) {
                    resolve();
                }
            }
        })

        try {
            const rtpWritable = new RTPWritableTest(rtpSession);
            const rtpReadable = new RTPReadableTest(rtpSession);

            rtpReadable.pipe(writable);
            audioReadStream.pipe(rtpWritable);
        } catch (ex) {
            t.fail(ex);
        }
    })
});