import test from "ava";
import { DataBuffer } from "../../src/Common/RTPSession";

const BUFFER_SIZE = 16;

class DataBufferTest extends DataBuffer {
    public getBuffer() { return this._buffer; }
    public getWriteIndex() { return this._bufferWriteIndex; }
    public getReadIndex() { return this._bufferReadIndex; }
    public calcReadCapacity() { return super._calcReadCapacity(); }
    public calcReadCapacityAppend() { return super._calcReadCapacityAppend(); }
    public calcWriteCapacity() { return super._calcWriteCapacity(); }
    public calcWriteCapacityAppend() { return super._calcWriteCapacityAppend(); }

    public writeFluently(size: number = 1) {
        const buffer = Buffer.allocUnsafe(size);

        for (let i = 0; i < size; i++) {
            buffer.writeInt8(i, i);
        }

        this.write(buffer);
    }
}

test("[DataBuffer] Single buffer write", (t) => {
    const dataBuffer = new DataBufferTest(BUFFER_SIZE);
    const dataBuffer2 = new DataBufferTest(BUFFER_SIZE);

    dataBuffer.writeFluently(4);

    t.deepEqual(dataBuffer.getWriteIndex(), 4);
    t.deepEqual(dataBuffer.getReadIndex(), 0);

    dataBuffer2.writeFluently(BUFFER_SIZE);

    // FIXME: how to distinguish if buffer is full or empty?
    t.deepEqual(dataBuffer2.getWriteIndex(), 0);
    t.deepEqual(dataBuffer2.getReadIndex(), 0);
})

// test("[DataBuffer] Buffer filling without read", async () => {

// });

// test("[DataBuffer] Circular buffer filling", async () => {

// });