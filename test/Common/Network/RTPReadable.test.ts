import test from "ava";
import { Writable } from "stream";
import RTPReadable from "../../../src/Common/RTP/RTPReadable";

class RTPReadableTest<T extends NodeJS.WritableStream> extends RTPReadable<T> {
    public static LogWritable(objectMode: boolean = false) {
        const writable = new Writable({
            write(writeChunk, encoding, done) {
                console.log(objectMode
                    ? writeChunk.toString()
                    : writeChunk
                );
                done();
            }
        });

        return writable;
    }
    public getSource() { return this._source; }
}

// test.only("[RTPReadable] Open connection and listen for incoming packets", async (t) => {
//     const elementSize = DataBufferTest.CalcByteSize(1, BUFFER_LENGTH);
//     const writable = RTPReadableTest.LogWritable();
//     const rtpReadable = new RTPReadableTest(1373, writable, 2);
//     const session = rtpReadable.getSource().getSession();
//     const packetSize = 8;
    
//     const readBufferLength = 48;
//     const readBuffer = DataBufferTest.GenDummyArray(BUFFER_BIT_DEPTH, readBufferLength, 0);

//     for (let i = 0; i < readBufferLength; i += packetSize) {
//         session.send(readBuffer.slice(i * elementSize, (i + packetSize) * elementSize));
//     }

//     await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log(readBuffer);

//             reject();
//             t.fail();
//         }, 1000000);
//     })
// });